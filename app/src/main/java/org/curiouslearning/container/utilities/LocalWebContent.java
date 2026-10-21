package org.curiouslearning.container.utilities;

import android.content.Context;
import android.net.Uri;
import android.util.Log;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.VisibleForTesting;
import androidx.webkit.ServiceWorkerClientCompat;
import androidx.webkit.ServiceWorkerControllerCompat;
import androidx.webkit.WebViewAssetLoader;
import androidx.webkit.WebViewFeature;

import org.curiouslearning.container.BuildConfig;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

/**
 * Serves the Feed The Monster build packaged inside the APK to the WebView, on FTM's own
 * production origin, for the offline standalone flavors.
 *
 * <p>The packaged catalog uses the <em>same</em> URLs as the Play Store catalog
 * ({@code https://feedthemonster.curiouscontent.org/?cr_lang=french}). In a standalone flavor
 * every request to that host is answered by {@link WebViewAssetLoader} from
 * {@code assets/feedthemonster/} and never reaches the network. Keeping the real origin matters
 * for three reasons:
 * <ul>
 *   <li>FTM's language JSON references its puzzle/feedback audio by <em>absolute</em>
 *       {@code https://feedthemonster.curiouscontent.org/lang/...} URLs, so they resolve to the
 *       packaged files without rewriting any content.</li>
 *   <li>It is a secure context, so {@code localStorage} (level progress), the Cache API and
 *       IndexedDB behave exactly as on the real site.</li>
 *   <li>{@code attribution.hostname} and FTM's own environment detection see production, so the
 *       data written for Literacy Coach is indistinguishable from the online build.</li>
 * </ul>
 *
 * <p>Interception is gated on {@code BuildConfig.OFFLINE_STANDALONE}: the online flavor loads this
 * host from the network as before and never constructs a loader.
 */
public final class LocalWebContent {

    private static final String TAG = "LocalWebContent";

    /** Host of the packaged sub-app. Must match the {@code appUrl}s in the flavor manifests. */
    public static final String DOMAIN = "feedthemonster.curiouscontent.org";

    /** Directory under {@code assets/} that holds the FTM production build. */
    public static final String ASSET_DIR = "feedthemonster";

    private static final String INDEX_FILE = "index.html";

    /**
     * MIME types by extension for the files FTM serves. {@code AssetsPathHandler} asks Android's
     * {@code MimeTypeMap}, which on older WebViews does not know {@code .wasm}/{@code .riv} and may
     * return {@code text/plain} for {@code .js}; a module script or WebAssembly stream with the
     * wrong type is refused by the browser, so the type is set here explicitly.
     */
    private static final Map<String, String> MIME_BY_EXTENSION = new HashMap<>();

    static {
        MIME_BY_EXTENSION.put("html", "text/html");
        MIME_BY_EXTENSION.put("js", "text/javascript");
        MIME_BY_EXTENSION.put("mjs", "text/javascript");
        MIME_BY_EXTENSION.put("css", "text/css");
        MIME_BY_EXTENSION.put("json", "application/json");
        MIME_BY_EXTENSION.put("wasm", "application/wasm");
        MIME_BY_EXTENSION.put("riv", "application/octet-stream");
        MIME_BY_EXTENSION.put("mp3", "audio/mpeg");
        MIME_BY_EXTENSION.put("wav", "audio/wav");
        MIME_BY_EXTENSION.put("ogg", "audio/ogg");
        MIME_BY_EXTENSION.put("png", "image/png");
        MIME_BY_EXTENSION.put("jpg", "image/jpeg");
        MIME_BY_EXTENSION.put("jpeg", "image/jpeg");
        MIME_BY_EXTENSION.put("gif", "image/gif");
        MIME_BY_EXTENSION.put("webp", "image/webp");
        MIME_BY_EXTENSION.put("svg", "image/svg+xml");
        MIME_BY_EXTENSION.put("ico", "image/x-icon");
        MIME_BY_EXTENSION.put("ttf", "font/ttf");
        MIME_BY_EXTENSION.put("otf", "font/otf");
        MIME_BY_EXTENSION.put("woff", "font/woff");
        MIME_BY_EXTENSION.put("woff2", "font/woff2");
        MIME_BY_EXTENSION.put("txt", "text/plain");
    }

    private LocalWebContent() {
    }

    /**
     * True when {@code url} must be served from the APK: only in a standalone flavor, and only
     * for the packaged sub-app's host.
     */
    public static boolean isLocalUrl(@Nullable String url) {
        if (!BuildConfig.OFFLINE_STANDALONE || url == null || url.isEmpty()) {
            return false;
        }
        return DOMAIN.equalsIgnoreCase(Uri.parse(url).getHost());
    }

    /** Builds the loader that maps {@code https://}{@link #DOMAIN}{@code /} onto {@code assets/feedthemonster/}. */
    @NonNull
    public static WebViewAssetLoader newAssetLoader(@NonNull Context context) {
        return new WebViewAssetLoader.Builder()
                .setDomain(DOMAIN)
                .setHttpAllowed(false)
                .addPathHandler("/", new PackagedAppPathHandler(
                        new WebViewAssetLoader.AssetsPathHandler(context.getApplicationContext())))
                .build();
    }

    /**
     * Answers {@code url} from the APK when it targets {@link #DOMAIN}, otherwise {@code null} so
     * the WebView proceeds normally. A miss is logged so a file missing from the package shows up
     * in logcat as such rather than as a silent blank screen or a muted puzzle.
     */
    @Nullable
    public static WebResourceResponse intercept(@NonNull WebViewAssetLoader assetLoader,
                                                @NonNull Uri url) {
        if (!DOMAIN.equalsIgnoreCase(url.getHost())) {
            return null;
        }
        WebResourceResponse response = assetLoader.shouldInterceptRequest(url);
        if (response == null && !isKnownAbsent(url.getPath())) {
            Log.w(TAG, "Packaged asset not found: " + url.getPath());
        }
        return response;
    }

    /**
     * Routes <em>service worker</em> fetches through the same loader. The packaged FTM build does
     * not ship a service worker (see tools/package-ftm.js), so this is defence in depth: should a
     * future package include one, its install-time fetches must still resolve to the APK rather
     * than the network. Process-wide by Android design; only installed for local content.
     */
    public static void installServiceWorkerInterceptor(@NonNull WebViewAssetLoader assetLoader) {
        if (!WebViewFeature.isFeatureSupported(WebViewFeature.SERVICE_WORKER_BASIC_USAGE)
                || !WebViewFeature.isFeatureSupported(
                        WebViewFeature.SERVICE_WORKER_SHOULD_INTERCEPT_REQUEST)) {
            Log.w(TAG, "WebView lacks service worker interception");
            return;
        }
        ServiceWorkerControllerCompat.getInstance().setServiceWorkerClient(
                new ServiceWorkerClientCompat() {
                    @Nullable
                    @Override
                    public WebResourceResponse shouldInterceptRequest(
                            @NonNull WebResourceRequest request) {
                        return intercept(assetLoader, request.getUrl());
                    }
                });
    }

    /**
     * Maps a request path (relative to the origin root) to the file inside
     * {@code assets/feedthemonster/}. {@code ""} and directory paths resolve to {@code index.html},
     * mirroring a static web server, which is what FTM's relative URLs expect.
     */
    @VisibleForTesting
    @NonNull
    static String assetPathFor(@NonNull String requestPath) {
        String path = requestPath;
        while (path.startsWith("/")) {
            path = path.substring(1);
        }
        if (path.isEmpty() || path.endsWith("/")) {
            path = path + INDEX_FILE;
        }
        return ASSET_DIR + "/" + path;
    }

    private static boolean isKnownAbsent(@Nullable String requestPath) {
        if (requestPath == null) {
            return false;
        }
        for (String absent : KNOWN_ABSENT) {
            if (requestPath.equals("/" + absent) || requestPath.equals(absent)) {
                return true;
            }
        }
        return false;
    }

    @VisibleForTesting
    @Nullable
    static String mimeTypeFor(@NonNull String path) {
        int dot = path.lastIndexOf('.');
        if (dot < 0 || dot == path.length() - 1) {
            return null;
        }
        return MIME_BY_EXTENSION.get(path.substring(dot + 1).toLowerCase(Locale.ROOT));
    }

    /**
     * Files FTM requests that the package deliberately does not contain. Answered with a plain 404
     * up front so {@code AssetsPathHandler} does not log a FileNotFoundException stack trace for an
     * expected miss on every launch. {@code sw.js} is dropped by tools/package-ftm.js.
     */
    private static final String[] KNOWN_ABSENT = {"sw.js"};

    /** Serves {@code assets/feedthemonster/<path>} with an explicit MIME type. */
    private static final class PackagedAppPathHandler implements WebViewAssetLoader.PathHandler {

        private final WebViewAssetLoader.AssetsPathHandler assets;

        PackagedAppPathHandler(WebViewAssetLoader.AssetsPathHandler assets) {
            this.assets = assets;
        }

        @Nullable
        @Override
        public WebResourceResponse handle(@NonNull String path) {
            for (String absent : KNOWN_ABSENT) {
                if (absent.equals(path) || ("/" + absent).equals(path)) {
                    Log.d(TAG, "Not packaged by design: " + absent);
                    return null;
                }
            }
            String assetPath = assetPathFor(path);
            WebResourceResponse response = assets.handle(assetPath);
            if (response == null) {
                return null;
            }
            String mime = mimeTypeFor(assetPath);
            if (mime != null) {
                response.setMimeType(mime);
            }
            return response;
        }
    }
}

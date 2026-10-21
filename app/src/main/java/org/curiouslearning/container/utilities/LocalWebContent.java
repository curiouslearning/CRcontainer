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
 * Serves the sub-apps packaged inside the APK to the WebView, each on its own production origin,
 * for the offline standalone flavors.
 *
 * <p>The packaged catalog uses the <em>same</em> URLs as the Play Store catalog
 * ({@code https://feedthemonster.curiouscontent.org/?cr_lang=french},
 * {@code https://curiousreader.curiouscontent.org/?book=LetsFlyEnLv2}). In a standalone flavor
 * every request to a packaged host is answered by {@link WebViewAssetLoader} from the matching
 * directory under {@code assets/} ({@code PACKAGED_ORIGINS}) and never reaches the network.
 * Keeping the real origins matters for three reasons:
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

    /** Feed The Monster: production build packaged by tools/package-ftm.js. */
    public static final String FTM_DOMAIN = "feedthemonster.curiouscontent.org";
    public static final String FTM_ASSET_DIR = "feedthemonster";

    /** Curious Reader book player: {@code index.html} + {@code dist/} + {@code BookContent/<book>/}. */
    public static final String BOOKS_DOMAIN = "curiousreader.curiouscontent.org";
    public static final String BOOKS_ASSET_DIR = "CRWebPlayerJs";

    /**
     * Host -> directory under {@code assets/} whose contents are served at that origin's root.
     * Must match the {@code appUrl} hosts used in the flavor manifests.
     */
    private static final Map<String, String> PACKAGED_ORIGINS = new HashMap<>();

    static {
        PACKAGED_ORIGINS.put(FTM_DOMAIN, FTM_ASSET_DIR);
        PACKAGED_ORIGINS.put(BOOKS_DOMAIN, BOOKS_ASSET_DIR);
    }

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
     * for a packaged sub-app's host.
     */
    public static boolean isLocalUrl(@Nullable String url) {
        if (!BuildConfig.OFFLINE_STANDALONE || url == null || url.isEmpty()) {
            return false;
        }
        return assetDirFor(Uri.parse(url).getHost()) != null;
    }

    /** The {@code assets/} directory packaged for {@code host}, or {@code null} when none is. */
    @VisibleForTesting
    @Nullable
    static String assetDirFor(@Nullable String host) {
        if (host == null) {
            return null;
        }
        return PACKAGED_ORIGINS.get(host.toLowerCase(Locale.ROOT));
    }

    /**
     * Builds the loader that maps {@code https://<host of url>/} onto that origin's packaged
     * directory. {@code url} must satisfy {@link #isLocalUrl(String)}.
     */
    @NonNull
    public static WebViewAssetLoader newAssetLoader(@NonNull Context context, @NonNull String url) {
        String host = Uri.parse(url).getHost();
        String assetDir = assetDirFor(host);
        if (assetDir == null) {
            throw new IllegalArgumentException("No packaged content for host: " + host);
        }
        return new WebViewAssetLoader.Builder()
                .setDomain(host)
                .setHttpAllowed(false)
                .addPathHandler("/", new PackagedAppPathHandler(assetDir,
                        new WebViewAssetLoader.AssetsPathHandler(context.getApplicationContext())))
                .build();
    }

    /**
     * Answers {@code url} from the APK when it targets a packaged host, otherwise {@code null} so
     * the WebView proceeds normally. A miss is logged so a file missing from the package shows up
     * in logcat as such rather than as a silent blank screen or a muted puzzle.
     */
    @Nullable
    public static WebResourceResponse intercept(@NonNull WebViewAssetLoader assetLoader,
                                                @NonNull Uri url) {
        if (assetDirFor(url.getHost()) == null) {
            return null;
        }
        WebResourceResponse response = assetLoader.shouldInterceptRequest(url);
        String assetDir = assetDirFor(url.getHost());
        String requestPath = url.getPath() == null ? "" : url.getPath();
        if (response == null && !isKnownAbsent(assetPathFor(assetDir, requestPath))) {
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
     * Maps a request path (relative to the origin root) to the file inside {@code assets/<assetDir>/}.
     * Mirrors what a static web server does with the sub-apps' relative URLs: {@code ""} and
     * directory paths resolve to {@code index.html}, and repeated slashes collapse (the book player
     * requests {@code content/images//file.png}, which Apache/nginx serve but AssetManager rejects).
     */
    @VisibleForTesting
    @NonNull
    static String assetPathFor(@NonNull String assetDir, @NonNull String requestPath) {
        String path = requestPath.replaceAll("/{2,}", "/");
        while (path.startsWith("/")) {
            path = path.substring(1);
        }
        if (path.isEmpty() || path.endsWith("/")) {
            path = path + INDEX_FILE;
        }
        return assetDir + "/" + path;
    }

    @VisibleForTesting
    static boolean isKnownAbsent(@NonNull String assetPath) {
        for (String absent : KNOWN_ABSENT) {
            if (absent.equals(assetPath)) {
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
     * Asset paths the sub-apps request on every launch that the packages deliberately do not
     * contain. Answered with a plain 404 up front so {@code AssetsPathHandler} does not log a
     * FileNotFoundException stack trace for an expected miss. FTM's {@code sw.js} is dropped by
     * tools/package-ftm.js; the book player's {@code index.html} references a root {@code app.js}
     * that its build only ships as {@code dist/app.js}.
     */
    private static final String[] KNOWN_ABSENT = {
            FTM_ASSET_DIR + "/sw.js",
            BOOKS_ASSET_DIR + "/app.js",
    };

    /** Serves {@code assets/<assetDir>/<path>} with an explicit MIME type. */
    private static final class PackagedAppPathHandler implements WebViewAssetLoader.PathHandler {

        private final String assetDir;
        private final WebViewAssetLoader.AssetsPathHandler assets;

        PackagedAppPathHandler(String assetDir, WebViewAssetLoader.AssetsPathHandler assets) {
            this.assetDir = assetDir;
            this.assets = assets;
        }

        @Nullable
        @Override
        public WebResourceResponse handle(@NonNull String path) {
            String assetPath = assetPathFor(assetDir, path);
            if (isKnownAbsent(assetPath)) {
                Log.d(TAG, "Not packaged by design: " + assetPath);
                return null;
            }
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

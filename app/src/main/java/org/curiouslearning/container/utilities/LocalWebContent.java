package org.curiouslearning.container.utilities;

import android.content.Context;
import android.content.res.AssetManager;
import android.net.Uri;
import android.util.Log;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.VisibleForTesting;
import androidx.webkit.ServiceWorkerClientCompat;
import androidx.webkit.ServiceWorkerControllerCompat;
import androidx.webkit.WebViewFeature;

import org.curiouslearning.container.BuildConfig;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * Serves the sub-apps packaged inside the APK to the WebView, for the offline standalone flavors.
 *
 * <p>Catalog entries address packaged content on a <em>virtual host</em> under
 * {@code androidplatform.net} (reserved by AndroidX for exactly this purpose; it never resolves on
 * the internet), e.g.
 * {@code https://mwfpde_french_english_cr-ftm-standalone.androidplatform.net/assets/feedthemonster/index.html?cr_lang=french}.
 * The host names the build, so it shows up unchanged in {@code attribution.hostname} (Firestore),
 * {@code web_app_url} (Firebase Analytics) and the sub-app's own page URL, which is what lets the
 * research data from a standalone build be told apart from the Play Store app. The host is
 * <em>not</em> hard-coded here: any {@code *.androidplatform.net} host is served, and the manifest
 * decides the name.
 *
 * <p>Request paths are resolved against {@code assets/}:
 * <ul>
 *   <li>{@code /assets/<dir>/<file>} → {@code assets/<dir>/<file>} (the normal case: relative URLs
 *       inside a sub-app).</li>
 *   <li>Any other root-absolute path (the Curious Reader player requests
 *       {@code /BookContent/...}, {@code /interactive-book-static/...}, {@code /dist/...} as if it
 *       were deployed at an origin root) is looked up inside each packaged sub-app directory, first
 *       match wins.</li>
 * </ul>
 *
 * <p>Two production hosts are also answered from the APK, because content refers to them by
 * absolute URL: FTM's language JSON points its puzzle audio at
 * {@code https://feedthemonster.curiouscontent.org/lang/...}. Those requests are cross-origin from
 * the virtual host, so every response carries permissive CORS headers. A handful of third-party
 * CDN files the vendored GDL player needs are vendored too ({@link #VENDORED_CDN_FILES}).
 *
 * <p>Everything is gated on {@code BuildConfig.OFFLINE_STANDALONE}; the online flavor never
 * intercepts anything.
 */
public final class LocalWebContent {

    private static final String TAG = "LocalWebContent";

    /** Suffix of the virtual hosts used by the packaged catalogs. */
    public static final String VIRTUAL_HOST_SUFFIX = ".androidplatform.net";

    /** URL path prefix on a virtual host that maps straight onto {@code assets/}. */
    public static final String ASSETS_PATH_PREFIX = "/assets/";

    /** Feed The Monster: production build packaged by tools/package-ftm.js. */
    public static final String FTM_DOMAIN = "feedthemonster.curiouscontent.org";
    public static final String FTM_ASSET_DIR = "feedthemonster";

    /** Curious Reader book player: {@code index.html} + {@code dist/} + {@code BookContent/<book>/}. */
    public static final String BOOKS_DOMAIN = "curiousreader.curiouscontent.org";
    public static final String BOOKS_ASSET_DIR = "CRWebPlayerJs";

    private static final String INDEX_FILE = "index.html";

    /**
     * Production host → packaged directory served at that origin's root. Needed for the absolute
     * URLs embedded in content (FTM audio); the catalog itself uses the virtual host.
     */
    private static final Map<String, String> PACKAGED_ORIGINS = new HashMap<>();

    /**
     * Packaged sub-app directories, in the order a root-absolute path on a virtual host is looked
     * up in them. The book player is first because it is the one that uses root-absolute paths.
     */
    private static final List<String> PACKAGED_DIRS =
            Collections.unmodifiableList(Arrays.asList(BOOKS_ASSET_DIR, FTM_ASSET_DIR));

    static {
        PACKAGED_ORIGINS.put(FTM_DOMAIN, FTM_ASSET_DIR);
        PACKAGED_ORIGINS.put(BOOKS_DOMAIN, BOOKS_ASSET_DIR);
    }

    /**
     * Asset paths the sub-apps request on every launch that the packages deliberately do not
     * contain. Answered with a plain 404 up front, without a log line per launch. FTM's
     * {@code sw.js} is dropped by tools/package-ftm.js; the book player's {@code index.html}
     * references a root {@code app.js} that its build only ships as {@code dist/app.js}, and its
     * {@code firebase-config.json} is a deploy-time file that is not in the repo.
     */
    private static final String[] KNOWN_ABSENT = {
            FTM_ASSET_DIR + "/sw.js",
            BOOKS_ASSET_DIR + "/sw.js",
            BOOKS_ASSET_DIR + "/app.js",
            BOOKS_ASSET_DIR + "/firebase-config.json",
    };

    /**
     * Third-party files a packaged sub-app fetches from a public CDN at runtime, keyed by the
     * exact {@code host/path} it requests and mapped to a copy under {@code assets/vendor/}. The
     * vendored GDL player ({@code gdlplayer.umd.js}) loads the dotlottie WebAssembly runtime from
     * jsDelivr with unpkg as fallback; without it every Lottie animation in a GDL book is blank
     * offline. Only these exact URLs are answered, nothing else on those hosts.
     */
    private static final Map<String, String> VENDORED_CDN_FILES = new HashMap<>();

    static {
        String dotlottieWasm = "vendor/dotlottie-player-0.44.0.wasm";
        VENDORED_CDN_FILES.put(
                "cdn.jsdelivr.net/npm/@lottiefiles/dotlottie-web@0.44.0/dist/dotlottie-player.wasm",
                dotlottieWasm);
        VENDORED_CDN_FILES.put(
                "unpkg.com/@lottiefiles/dotlottie-web@0.44.0/dist/dotlottie-player.wasm",
                dotlottieWasm);
    }

    /**
     * MIME types by extension for the files the sub-apps serve. Android's {@code MimeTypeMap} on
     * older WebViews does not know {@code .wasm}/{@code .riv} and may return {@code text/plain}
     * for {@code .js}; a module script or WebAssembly stream with the wrong type is refused by the
     * browser, so the type is set explicitly.
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
        MIME_BY_EXTENSION.put("lottie", "application/zip");
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

    // ---------------------------------------------------------------------------------------------
    // URL classification (pure, unit-tested)
    // ---------------------------------------------------------------------------------------------

    /**
     * True when {@code url} must be served from the APK: only in a standalone flavor, and only for
     * a virtual host or a packaged production host.
     */
    public static boolean isLocalUrl(@Nullable String url) {
        if (!BuildConfig.OFFLINE_STANDALONE || url == null || url.isEmpty()) {
            return false;
        }
        String host = Uri.parse(url).getHost();
        return isVirtualHost(host) || assetDirFor(host) != null;
    }

    /** {@code *.androidplatform.net}, the hosts the packaged catalogs use. */
    @VisibleForTesting
    static boolean isVirtualHost(@Nullable String host) {
        return host != null
                && host.toLowerCase(Locale.ROOT).endsWith(VIRTUAL_HOST_SUFFIX)
                && host.length() > VIRTUAL_HOST_SUFFIX.length();
    }

    /** The {@code assets/} directory packaged for a production {@code host}, or {@code null}. */
    @VisibleForTesting
    @Nullable
    static String assetDirFor(@Nullable String host) {
        if (host == null) {
            return null;
        }
        return PACKAGED_ORIGINS.get(host.toLowerCase(Locale.ROOT));
    }

    /**
     * The asset paths to try, in order, for a request. Empty when the host is not served from
     * the APK. Mirrors a static web server: repeated slashes collapse (the book player requests
     * {@code content/images//file.png}) and directory paths resolve to {@code index.html}.
     */
    @VisibleForTesting
    @NonNull
    static List<String> assetCandidatesFor(@Nullable String host, @Nullable String requestPath) {
        String path = normalizePath(requestPath);
        List<String> candidates = new ArrayList<>(2);
        if (isVirtualHost(host)) {
            if (path.startsWith(ASSETS_PATH_PREFIX)) {
                candidates.add(withIndex(path.substring(ASSETS_PATH_PREFIX.length())));
            } else {
                // A root-absolute path from a sub-app that assumes it is deployed at an origin root.
                for (String dir : PACKAGED_DIRS) {
                    candidates.add(dir + withIndexKeepingSlash(path));
                }
            }
            return candidates;
        }
        String dir = assetDirFor(host);
        if (dir != null) {
            candidates.add(dir + withIndexKeepingSlash(path));
        }
        return candidates;
    }

    /** The {@code assets/} path vendored for this exact CDN URL, or {@code null}. */
    @VisibleForTesting
    @Nullable
    static String vendoredAssetFor(@Nullable String host, @Nullable String path) {
        if (host == null || path == null) {
            return null;
        }
        return VENDORED_CDN_FILES.get(host.toLowerCase(Locale.ROOT) + path);
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

    /** Collapses repeated slashes and guarantees a single leading slash. */
    private static String normalizePath(@Nullable String requestPath) {
        String path = requestPath == null ? "" : requestPath.replaceAll("/{2,}", "/");
        if (!path.startsWith("/")) {
            path = "/" + path;
        }
        return path;
    }

    /** {@code "dir/"} or {@code ""} → {@code ".../index.html"}; otherwise unchanged. No leading slash. */
    private static String withIndex(String relativePath) {
        if (relativePath.isEmpty() || relativePath.endsWith("/")) {
            return relativePath + INDEX_FILE;
        }
        return relativePath;
    }

    /** Same as {@link #withIndex} for a path that keeps its leading slash. */
    private static String withIndexKeepingSlash(String absolutePath) {
        if (absolutePath.endsWith("/")) {
            return absolutePath + INDEX_FILE;
        }
        return absolutePath;
    }

    // ---------------------------------------------------------------------------------------------
    // Serving
    // ---------------------------------------------------------------------------------------------

    /**
     * Answers requests for packaged content from the APK. One instance per {@code WebApp}
     * screen; {@link #intercept(Uri)} is called from {@code shouldInterceptRequest} and, through
     * {@link #installServiceWorkerInterceptor(Server)}, for service-worker fetches.
     */
    public static final class Server {

        private final AssetManager assets;

        Server(@NonNull Context context) {
            this.assets = context.getApplicationContext().getAssets();
        }

        /**
         * The packaged response for {@code url}, or {@code null} to let the WebView proceed
         * normally (not a packaged host, or a file that is genuinely not in the package).
         */
        @Nullable
        public WebResourceResponse intercept(@NonNull Uri url) {
            String host = url.getHost();
            String path = url.getPath();

            String vendored = vendoredAssetFor(host, path);
            if (vendored != null) {
                WebResourceResponse response = open(vendored);
                if (response == null) {
                    Log.w(TAG, "Vendored CDN file missing from package: " + vendored);
                } else {
                    Log.d(TAG, "Served vendored CDN file: " + host + path);
                }
                return response;
            }

            List<String> candidates = assetCandidatesFor(host, path);
            if (candidates.isEmpty()) {
                return null;
            }
            for (String candidate : candidates) {
                if (isKnownAbsent(candidate)) {
                    return null;
                }
                WebResourceResponse response = open(candidate);
                if (response != null) {
                    return response;
                }
            }
            // Logged so a file missing from the package shows up in logcat as such rather than as
            // a silent blank page or a muted puzzle.
            Log.w(TAG, "Packaged asset not found: " + host + path + " (tried " + candidates + ")");
            return null;
        }

        /** Opens an asset as a response with an explicit MIME type and permissive CORS headers. */
        @Nullable
        private WebResourceResponse open(@NonNull String assetPath) {
            InputStream stream;
            try {
                stream = assets.open(assetPath);
            } catch (IOException notFound) {
                return null;
            }
            String mime = mimeTypeFor(assetPath);
            WebResourceResponse response = new WebResourceResponse(
                    mime != null ? mime : "application/octet-stream", null, stream);
            // Sub-apps on the virtual host fetch FTM audio and vendored CDN files cross-origin;
            // without these headers the browser discards the response.
            Map<String, String> headers = new HashMap<>();
            headers.put("Access-Control-Allow-Origin", "*");
            headers.put("Cross-Origin-Resource-Policy", "cross-origin");
            response.setResponseHeaders(headers);
            return response;
        }
    }

    /** Creates the server for a packaged sub-app screen. */
    @NonNull
    public static Server newServer(@NonNull Context context) {
        return new Server(context);
    }

    /**
     * Routes <em>service worker</em> fetches through the same server. No packaged sub-app ships a
     * service worker today (tools/package-ftm.js drops FTM's; the book player's is not copied), so
     * this is defence in depth: should a future package include one, its install-time fetches must
     * still resolve to the APK rather than the network. Process-wide by Android design; only
     * installed for local content.
     */
    public static void installServiceWorkerInterceptor(@NonNull Server server) {
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
                        return server.intercept(request.getUrl());
                    }
                });
    }
}

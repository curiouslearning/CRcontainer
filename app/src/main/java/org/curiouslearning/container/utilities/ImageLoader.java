package org.curiouslearning.container.utilities;

import android.content.Context;
import android.util.Log;
import android.widget.ImageView;

import com.squareup.picasso.Callback;
import com.squareup.picasso.OkHttp3Downloader;
import com.squareup.picasso.Picasso;

import java.io.File;
import java.io.IOException;
import java.util.concurrent.TimeUnit;

import okhttp3.Cache;
import okhttp3.CacheControl;
import okhttp3.Interceptor;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

/**
 * Loads sub-app icons through Picasso backed by an OkHttp disk cache.
 *
 * Caching is handled entirely by OkHttp's HTTP cache rather than Picasso's
 * {@code NetworkPolicy.OFFLINE}. The OFFLINE policy sends
 * {@code Cache-Control: only-if-cached}, and on a cache miss OkHttp fabricates a
 * synthetic {@code 504 Unsatisfiable Request} response. Sentry's OkHttp
 * integration reports every such 504 as an HTTP client error, so every
 * first-time icon load used to produce a Sentry event.
 *
 * Strategy:
 * - Responses are rewritten to be cacheable for {@link #ICON_MAX_AGE_DAYS}, so a
 *   cached icon is served without any network request while fresh.
 * - When the device is offline, or the network attempt fails, the request is
 *   retried with {@code max-stale} so a stale cached icon is still served. A
 *   miss in that case surfaces as an IOException, not a fake 5xx.
 */
public class ImageLoader {
    private static final String TAG = "ImageLoader";
    private static final long CACHE_SIZE_BYTES = 50L * 1024 * 1024;
    private static final int ICON_MAX_AGE_DAYS = 7;
    private static final int ICON_MAX_STALE_DAYS = 365;

    private static Picasso picasso;
    private static int targetSize = 120;
    private static int targetSizePixels;

    public static synchronized Picasso getInstance(Context context) {
        if (picasso == null) {
            Context appContext = context.getApplicationContext();
            File cacheDirectory = new File(appContext.getCacheDir(), "app_icons");
            Cache cache = new Cache(cacheDirectory, CACHE_SIZE_BYTES);
            OkHttpClient okHttpClient = new OkHttpClient.Builder()
                    .cache(cache)
                    .addInterceptor(new StaleCacheFallbackInterceptor(appContext))
                    .addNetworkInterceptor(new ForceCacheableInterceptor())
                    .build();
            OkHttp3Downloader downloader = new OkHttp3Downloader(okHttpClient);
            Picasso.Builder builder = new Picasso.Builder(appContext);
            builder.downloader(downloader);
            picasso = builder.build();
        }
        if (targetSizePixels == 0) {
            targetSizePixels = (int) (context.getResources().getDisplayMetrics().density * targetSize);
        }

        return picasso;
    }

    public static void loadWebAppIcon(Context context, String imageUrl, ImageView imageView) {
        Picasso picasso = getInstance(context);

        picasso.load(imageUrl)
                .resize(targetSizePixels, targetSizePixels)
                .centerCrop()
                .into(imageView, new Callback() {
                    @Override
                    public void onSuccess() {
                    }

                    @Override
                    public void onError(Exception e) {
                        // Icon is unavailable both from cache and network (e.g. offline on
                        // first launch). Not reportable; the view keeps its placeholder.
                        Log.w(TAG, "Failed to load icon " + imageUrl + ": " + e);
                    }
                });
    }

    /**
     * Network interceptor: overrides the server's cache headers so icons are
     * served from the disk cache without a network round-trip while fresh.
     */
    private static final class ForceCacheableInterceptor implements Interceptor {
        @Override
        public Response intercept(Chain chain) throws IOException {
            Response response = chain.proceed(chain.request());
            CacheControl cacheControl = new CacheControl.Builder()
                    .maxAge(ICON_MAX_AGE_DAYS, TimeUnit.DAYS)
                    .build();
            return response.newBuilder()
                    .removeHeader("Pragma")
                    .removeHeader("Expires")
                    .header("Cache-Control", cacheControl.toString())
                    .build();
        }
    }

    /**
     * Application interceptor: serves stale cached icons when offline or when
     * the network attempt fails. Uses {@code max-stale} rather than
     * {@code only-if-cached} so a cache miss falls through to a normal network
     * error instead of OkHttp's synthetic 504.
     */
    private static final class StaleCacheFallbackInterceptor implements Interceptor {
        private final Context appContext;

        StaleCacheFallbackInterceptor(Context appContext) {
            this.appContext = appContext;
        }

        @Override
        public Response intercept(Chain chain) throws IOException {
            Request request = chain.request();
            if (!ConnectionUtils.getInstance().isInternetConnected(appContext)) {
                return chain.proceed(withMaxStale(request));
            }
            try {
                return chain.proceed(request);
            } catch (IOException networkError) {
                Log.d(TAG, "Network fetch failed, trying stale cache for " + request.url());
                try {
                    return chain.proceed(withMaxStale(request));
                } catch (IOException cacheMiss) {
                    throw networkError;
                }
            }
        }

        private static Request withMaxStale(Request request) {
            CacheControl cacheControl = new CacheControl.Builder()
                    .maxStale(ICON_MAX_STALE_DAYS, TimeUnit.DAYS)
                    .build();
            return request.newBuilder().cacheControl(cacheControl).build();
        }
    }
}

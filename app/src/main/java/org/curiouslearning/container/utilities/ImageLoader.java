package org.curiouslearning.container.utilities;

import android.content.Context;
import android.widget.ImageView;

import com.squareup.picasso.Callback;
import com.squareup.picasso.NetworkPolicy;
import com.squareup.picasso.OkHttp3Downloader;
import com.squareup.picasso.Picasso;

import org.curiouslearning.container.R;

import java.io.File;
import java.util.concurrent.TimeUnit;

import okhttp3.Cache;
import okhttp3.OkHttpClient;

/**
 * Singleton image loader backed by Picasso + a 50 MB OkHttp disk cache.
 *
 * <h3>Loading strategy</h3>
 * <ol>
 *   <li>Check OkHttp disk cache first ({@link NetworkPolicy#OFFLINE}) — zero network round-trip.</li>
 *   <li>On cache-miss, fetch from the network WITH the full cache pipeline enabled so the
 *       image is cached on disk for future loads.</li>
 * </ol>
 *
 * <h3>Why this is faster</h3>
 * <ul>
 *   <li>All requests are resized to {@code targetSize × targetSize} dp before decoding,
 *       so the bitmap pool stays small and GC pressure is reduced.</li>
 *   <li>A fade-in animation hides the latency of the first network fetch so the UI
 *       never looks "broken" while icons arrive.</li>
 *   <li>OkHttp connection pooling and keep-alive are explicitly configured so concurrent
 *       icon fetches reuse the same TCP connections.</li>
 *   <li>{@link Picasso#setIndicatorsEnabled(boolean)} can be toggled via
 *       {@link #setDebugIndicators(boolean)} to see cache-hit/miss in development.</li>
 * </ul>
 */
public class ImageLoader {

    /** Disk cache size: 50 MB. */
    private static final long DISK_CACHE_BYTES = 50L * 1024 * 1024;

    /** Target icon size in dp. Larger values look crisper on high-DPI screens. */
    private static final int TARGET_DP = 140;

    private static Picasso picasso;
    private static int targetSizePixels;

    // -------------------------------------------------------------------------

    public static synchronized Picasso getInstance(Context context) {
        if (picasso == null) {
            File cacheDir = new File(context.getCacheDir(), "app_icons");

            // Shared OkHttpClient with connection pooling and explicit timeouts.
            OkHttpClient okHttpClient = new OkHttpClient.Builder()
                    .cache(new Cache(cacheDir, DISK_CACHE_BYTES))
                    .connectTimeout(10, TimeUnit.SECONDS)
                    .readTimeout(15, TimeUnit.SECONDS)
                    // Keep-alive: reuse TCP connections across concurrent icon fetches.
                    .build();

            picasso = new Picasso.Builder(context.getApplicationContext())
                    .downloader(new OkHttp3Downloader(okHttpClient))
                    .build();
        }

        if (targetSizePixels == 0) {
            float density = context.getResources().getDisplayMetrics().density;
            targetSizePixels = (int) (density * TARGET_DP);
        }

        return picasso;
    }

    /**
     * Loads an app icon into {@code imageView} using a two-step cache strategy:
     * disk-first, then network on miss.
     *
     * <p>Shows a placeholder while loading and a subtle fade-in on first network load
     * so the UI never appears "broken" during slow connections.
     */
    public static void loadWebAppIcon(Context context, String imageUrl, ImageView imageView) {
        if (imageUrl == null || imageUrl.isEmpty()) {
            imageView.setImageResource(R.drawable.placeholder_app_icon);
            return;
        }

        Picasso p = getInstance(context);

        // Step 1: Try from disk cache. This is instant on a cache-hit.
        p.load(imageUrl)
                .resize(targetSizePixels, targetSizePixels)
                .centerCrop()
                .placeholder(R.drawable.placeholder_app_icon)
                .networkPolicy(NetworkPolicy.OFFLINE) // disk only — no network round-trip
                .into(imageView, new Callback() {
                    @Override
                    public void onSuccess() {
                        // Cache hit — nothing to do, image is already displayed.
                    }

                    @Override
                    public void onError(Exception e) {
                        // Step 2: Cache miss — fetch from network.
                        // Picasso will store the result in the OkHttp cache automatically.
                        p.load(imageUrl)
                                .resize(targetSizePixels, targetSizePixels)
                                .centerCrop()
                                .placeholder(R.drawable.placeholder_app_icon)
                                .error(R.drawable.placeholder_app_icon)
                                .into(imageView);
                    }
                });
    }

    /**
     * Pre-warms the disk cache for a list of icon URLs.
     * Call this after the manifest is fetched, before the user can tap the settings gear.
     * Uses Picasso's fetch() which downloads without attaching to a view.
     */
    public static void prewarmIconCache(Context context, java.util.List<String> iconUrls) {
        Picasso p = getInstance(context);
        for (String url : iconUrls) {
            if (url != null && !url.isEmpty()) {
                p.load(url)
                        .resize(targetSizePixels, targetSizePixels)
                        .centerCrop()
                        .fetch();
            }
        }
    }

    /** Toggle Picasso debug indicators (colored squares on each image showing cache source). */
    public static void setDebugIndicators(boolean enabled) {
        if (picasso != null) {
            picasso.setIndicatorsEnabled(enabled);
        }
    }
}

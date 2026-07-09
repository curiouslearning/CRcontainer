package org.curiouslearning.container.utilities;

import android.content.Context;
import android.widget.ImageView;

import com.squareup.picasso.Callback;
import com.squareup.picasso.NetworkPolicy;
import com.squareup.picasso.OkHttp3Downloader;
import com.squareup.picasso.Picasso;

import java.io.File;

import okhttp3.Cache;
import okhttp3.OkHttpClient;

public class ImageLoader {
    private static Picasso picasso;
    private static int targetSize = 120;
    private static int targetSizePixels;

    public static synchronized Picasso getInstance(Context context) {
        if (picasso == null) {
            File cacheDirectory = new File(context.getCacheDir(), "app_icons");
            Cache cache = new Cache(cacheDirectory, 1024 * 1024 * 50); // 50MB max cache size
            OkHttpClient okHttpClient = new OkHttpClient.Builder()
                    .cache(cache)
                    .build();
            OkHttp3Downloader downloader = new OkHttp3Downloader(okHttpClient);
            Picasso.Builder builder = new Picasso.Builder(context);
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
        String resolvedImageUrl = imageUrl;
        if (resolvedImageUrl != null && !resolvedImageUrl.startsWith("http://")
                && !resolvedImageUrl.startsWith("https://")
                && !resolvedImageUrl.startsWith("file:///android_asset/")) {
            resolvedImageUrl = "file:///android_asset/images/" + resolvedImageUrl;
        }
        final String finalResolvedImageUrl = resolvedImageUrl;

        // Load the image and cache it
        picasso.load(finalResolvedImageUrl)
                .resize(targetSizePixels, targetSizePixels)
                .centerCrop()
                .networkPolicy(NetworkPolicy.OFFLINE)
                .into(imageView, new Callback() {
                    @Override
                    public void onSuccess() {
                    }

                    @Override
                    public void onError(Exception e) {
                        // Try loading from network if offline cache failed
                        picasso.load(finalResolvedImageUrl).into(imageView);
                    }
                });
    }
}

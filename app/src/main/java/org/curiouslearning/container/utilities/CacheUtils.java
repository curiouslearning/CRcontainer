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

public class CacheUtils {

    private static File cacheDirectory;
    public static String manifestVersionNumber;

    public static void loadWithPicasso(Context context, String imageUrl, ImageView imageView) {
        Picasso picasso = Picasso.get();

        // Set the cache directory and size
        cacheDirectory = new File(context.getCacheDir(), "app_icons");
        Cache cache = new Cache(cacheDirectory, 1024 * 1024 * 50); // 50MB max cache size
        OkHttpClient okHttpClient = new OkHttpClient.Builder()
                .cache(cache)
                .build();
        OkHttp3Downloader downloader = new OkHttp3Downloader(okHttpClient);
        Picasso.Builder builder = new Picasso.Builder(context);
        builder.downloader(downloader);
        picasso = builder.build();

        // Load the image and cache it
        Picasso finalPicasso = picasso;
        picasso.load(imageUrl)
                .networkPolicy(NetworkPolicy.OFFLINE)
                .into(imageView, new Callback() {
                    @Override
                    public void onSuccess() {}

                    @Override
                    public void onError(Exception e) {
                        // Try loading from network if offline cache failed
                        finalPicasso.load(imageUrl)
                                .into(imageView);
                    }
                });
    }

    public static void setManifestVersionNumber(String version) {
        manifestVersionNumber = version;
    }
}

package org.curiouslearning.container.presentation.adapters;


import android.animation.ObjectAnimator;
import android.animation.ValueAnimator;
import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Handler;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import org.curiouslearning.container.BuildConfig;
import org.curiouslearning.container.R;
import org.curiouslearning.container.data.model.WebApp;
import org.curiouslearning.container.utilities.AnimationUtil;
import org.curiouslearning.container.utilities.ImageLoader;
import org.curiouslearning.container.utilities.AudioPlayer;
import org.curiouslearning.container.utilities.PulsingView;

import java.util.List;

public class WebAppsAdapter extends RecyclerView.Adapter<WebAppsAdapter.ViewHolder> {

    public Context ctx;
    LayoutInflater inflater;
    public List<WebApp> webApps;
    private AudioPlayer audioPlayer;
    private Handler handler = new Handler();
    private static final String SHARED_PREFS_NAME = "animatePulse";
    private static final String PULSE_ANIMATION_KEY = "pulse_animaton";
    private SharedPreferences prefs;
    private boolean isAnimated;
    public WebAppsAdapter(Context context, List<WebApp> webApps) {
        this.ctx = context;
        this.webApps = webApps;
        this.inflater = LayoutInflater.from(ctx);
        this.audioPlayer = new AudioPlayer();
        prefs = ctx.getSharedPreferences(SHARED_PREFS_NAME, Context.MODE_PRIVATE);
        isAnimated = prefs.getBoolean(PULSE_ANIMATION_KEY,false);
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(ctx).inflate(R.layout.activity_custom_list, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, @SuppressLint("RecyclerView") int position) {

        ImageLoader.loadWebAppIcon(ctx, webApps.get(position).getAppIconUrl(), holder.appIconImage);
        holder.appIconImage.clearColorFilter();

        // Add red border to define clickable area: for debugging purposes
        // GradientDrawable borderDrawable = new GradientDrawable();
        // borderDrawable.setShape(GradientDrawable.RECTANGLE);
        // borderDrawable.setStroke(4, Color.RED); // 4px red border
        // borderDrawable.setColor(Color.TRANSPARENT);
        // holder.appIconImage.setForeground(borderDrawable);

        // Apply glow ONLY for key apps
        // if (webApps.get(position).getTitle().contains("Feed The Monster")
        //         && !isAppCached(webApps.get(position).getAppId())) {

        // }

        // Only show and animate pulse effect for Feed The Monster when not cached
        if ( webApps.get(position).getTitle().contains("Feed The Monster") && !isAppCached(webApps.get(position).getAppId())) {
            // Make pulsator visible for FTM
            holder.pulsatorLayout.setVisibility(View.VISIBLE);
            if(!isAnimated){
                holder.pulsatorLayout.startAnimation();
                SharedPreferences.Editor editor = prefs.edit();
                editor.putBoolean(PULSE_ANIMATION_KEY, true);
                editor.apply();
            }else{
                holder.itemView.postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        if( webApps.get(position).getTitle().contains("Feed The Monster") && holder.getLayoutPosition() == position)
                            holder.pulsatorLayout.startAnimation();
                    }
                }, 5000);
            }
        }else{
            // Hide and stop pulse animation for all other apps
            holder.pulsatorLayout.stopAnimation();
            holder.pulsatorLayout.setVisibility(View.GONE);
        }

        // if (!isAppCached(webApps.get(position).getAppId())) {
        //     ColorMatrix matrix = new ColorMatrix();
        //     matrix.setSaturation(0);
        //     ColorMatrixColorFilter filter = new ColorMatrixColorFilter(matrix);
        //     // holder.downloadIconImage.setImageResource(R.drawable.download_image);
        //     holder.appIconImage.setColorFilter(filter);
        // } else {
        holder.downloadIconImage.setImageResource(0);
        // }

        // Make icon clickable and set click listener only on the icon to match the border area
        holder.appIconImage.setClickable(true);
        holder.appIconImage.setFocusable(true);
        holder.appIconImage.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                audioPlayer.play(ctx, R.raw.sound_button_pressed);
                AnimationUtil.scaleButton(v, new Runnable() {
                    @Override
                    public void run() {
                        Intent intent = new Intent(ctx, org.curiouslearning.container.WebApp.class);
                        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                        intent.putExtra("appId", String.valueOf(webApps.get(position).getAppId()));
                        String appUrl = webApps.get(position).getAppUrl();
                        String launchUrl = maybeOverrideAppUrlForLocalDev(appUrl);
                        intent.putExtra("appUrl", launchUrl);
                        if (BuildConfig.DEBUG && appUrl != null && !appUrl.equals(launchUrl)) {
                            // Debug-only: the redirect strips the real host from the URL, which would
                            // otherwise break FTM detection and the hostname attribution field. WebApp
                            // reads this to keep both resolving off the deployed URL.
                            intent.putExtra("localDevOriginalUrl", appUrl);
                        }
                        intent.putExtra("title", webApps.get(position).getTitle());
                        intent.putExtra("language", webApps.get(position).getLanguage());
                        intent.putExtra("languageInEnglishName", webApps.get(position).getLanguageInEnglishName());
                        ctx.startActivity(intent);
                        holder.pulsatorLayout.stopAnimation();
                    }
                });
            }
        });

        // Remove click listener from itemView to prevent clicks outside the icon area
        holder.itemView.setOnClickListener(null);
        holder.itemView.setClickable(false);
    }

    @Override
    public int getItemCount() {
        return webApps.size();
    }

    /**
     * Debug-only: redirects a deployed sub-app URL to a local dev server so a local FTM /
     * Assessment build can be tested inside the real container.
     *
     * <p>Driven by {@code LOCAL_SUBAPP_MATCH_HOSTS} and {@code LOCAL_SUBAPP_REPLACEMENT_ORIGIN},
     * which the debug buildType reads from the developer's gitignored {@code local.properties}.
     * Both are empty in release builds and on CI, so this is a no-op everywhere except a
     * developer's own machine. See {@code local.properties.example}.
     *
     * <p>Only the origin is replaced: the original path is dropped (dev servers serve the app at
     * root) while the query and fragment are preserved (e.g. {@code ?cr_lang=english}).
     *
     * @return the local URL when {@code appUrl}'s host is configured for redirect, otherwise
     *         {@code appUrl} unchanged.
     */
    private String maybeOverrideAppUrlForLocalDev(String appUrl) {
        if (!BuildConfig.DEBUG
                || appUrl == null
                || BuildConfig.LOCAL_SUBAPP_MATCH_HOSTS.isEmpty()
                || BuildConfig.LOCAL_SUBAPP_REPLACEMENT_ORIGIN.isEmpty()) {
            return appUrl;
        }
        Uri original = Uri.parse(appUrl);
        String host = original.getHost();
        if (host == null) {
            return appUrl;
        }
        for (String matchHost : BuildConfig.LOCAL_SUBAPP_MATCH_HOSTS.split(",")) {
            if (!matchHost.trim().equalsIgnoreCase(host)) {
                continue;
            }
            Uri replacement = Uri.parse(BuildConfig.LOCAL_SUBAPP_REPLACEMENT_ORIGIN);
            StringBuilder rebuilt = new StringBuilder()
                    .append(replacement.getScheme()).append("://").append(replacement.getAuthority()).append('/');
            if (original.getEncodedQuery() != null) {
                rebuilt.append('?').append(original.getEncodedQuery());
            }
            if (original.getEncodedFragment() != null) {
                rebuilt.append('#').append(original.getEncodedFragment());
            }
            String overridden = rebuilt.toString();
            Log.d("WebAppsAdapter", "DEBUG sub-app URL override: " + appUrl + " -> " + overridden);
            return overridden;
        }
        return appUrl;
    }

    @Override
    public void onViewRecycled(@NonNull ViewHolder holder) {
        super.onViewRecycled(holder);

        holder.appIconImage.animate().cancel();
        holder.appIconImage.clearAnimation();
        holder.appIconImage.setAlpha(1f);
        holder.appIconImage.setScaleX(1f);
        holder.appIconImage.setScaleY(1f);

        // Clean up click listeners
        holder.appIconImage.setOnClickListener(null);
        holder.appIconImage.setClickable(false);
        holder.appIconImage.setFocusable(false);
        holder.itemView.setOnClickListener(null);
        holder.itemView.setClickable(false);


        // Stop and hide pulse animation when view is recycled
        holder.pulsatorLayout.stopAnimation();
        holder.pulsatorLayout.setVisibility(View.GONE);
    }

    public boolean isAppCached(int appId) {
        return ctx.getSharedPreferences("appCached", Context.MODE_PRIVATE).getBoolean(String.valueOf(appId), false);
    }

    public class ViewHolder extends RecyclerView.ViewHolder {
        ImageView appIconImage, downloadIconImage;
        PulsingView pulsatorLayout;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            appIconImage = (ImageView) itemView.findViewById(R.id.app_image);
            downloadIconImage = (ImageView) itemView.findViewById(R.id.download_image);
            pulsatorLayout = itemView.findViewById(R.id.pulsing_view);

        }



    }



}
package org.curiouslearning.container.presentation.adapters;


import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Handler;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.AccelerateDecelerateInterpolator;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.FrameLayout;
import android.widget.ImageView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import org.curiouslearning.container.R;
import org.curiouslearning.container.data.model.WebApp;
import org.curiouslearning.container.utilities.AnimationUtil;
import org.curiouslearning.container.utilities.ImageLoader;
import org.curiouslearning.container.utilities.AudioPlayer;

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

         if (webApps.get(position).getTitle().contains("Feed The Monster") && !isAppCached(webApps.get(position).getAppId()) && !isAnimated) {
             holder.itemView.postDelayed(new Runnable() {
                 @Override
                 public void run() {
                     startCircularPulseAnimation(holder);
                 }
             }, 1000);
             SharedPreferences.Editor editor = prefs.edit();
             editor.putBoolean(PULSE_ANIMATION_KEY, true);
             editor.apply();
         }else if(webApps.get(position).getTitle().contains("Feed The Monster") && !isAppCached(webApps.get(position).getAppId()) && isAnimated) {
             holder.itemView.postDelayed(new Runnable() {
                 @Override
                 public void run() {
                     startCircularPulseAnimation(holder);
                 }
             }, 5000);
         }
         else {
             holder.pulseView.setBackgroundResource(0);
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

        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                audioPlayer.play(ctx, R.raw.sound_button_pressed);
                AnimationUtil.scaleButton(v, new Runnable() {
                    @Override
                    public void run() {
                        Intent intent = new Intent(ctx, org.curiouslearning.container.WebApp.class);
                        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                        intent.putExtra("appId", String.valueOf(webApps.get(position).getAppId()));
                        intent.putExtra("appUrl", webApps.get(position).getAppUrl());
                        intent.putExtra("title", webApps.get(position).getTitle());
                        intent.putExtra("language", webApps.get(position).getLanguage());
                        intent.putExtra("languageInEnglishName", webApps.get(position).getLanguageInEnglishName());
                        ctx.startActivity(intent);
                        stopCircularPulseAnimation(holder);
                    }
                });
            }
        });
    }

    @Override
    public int getItemCount() {
        return webApps.size();
    }

    private void startCircularPulseAnimation(ViewHolder holder) {
        if (holder.pulseView == null) {
            holder.pulseView = new ImageView(ctx);
            holder.pulseView.setBackgroundResource(R.drawable.pulse_animation);
            FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
            );
            params.gravity = Gravity.CENTER;
            holder.pulseView.setLayoutParams(params);
            ((ViewGroup) holder.itemView).addView(holder.pulseView, 0);
        }
        Animation pulseAnimation = AnimationUtils.loadAnimation(ctx, R.anim.pulse_scale);
        holder.pulseView.startAnimation(pulseAnimation);

    }
    
    private void stopCircularPulseAnimation(ViewHolder holder) {
        if (holder.pulseView != null) {
            holder.pulseView.clearAnimation();
            ((ViewGroup) holder.itemView).removeView(holder.pulseView);
            holder.pulseView = null;
        }
    }
    public boolean isAppCached(int appId) {
        return ctx.getSharedPreferences("appCached", Context.MODE_PRIVATE).getBoolean(String.valueOf(appId), false);
    }

    public class ViewHolder extends RecyclerView.ViewHolder {
        ImageView appIconImage, downloadIconImage;
        View pulseView;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            appIconImage = itemView.findViewById(R.id.app_image);
            downloadIconImage = itemView.findViewById(R.id.download_image);
            pulseView = itemView.findViewById(R.id.pulse_view);
        }
    }
}

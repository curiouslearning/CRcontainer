package org.curiouslearning.container.presentation.adapters;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.graphics.ColorMatrix;
import android.graphics.ColorMatrixColorFilter;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import org.curiouslearning.container.R;
import org.curiouslearning.container.data.model.WebApp;
import org.curiouslearning.container.utilities.AnimationUtil;
import org.curiouslearning.container.utilities.CacheUtils;
import org.curiouslearning.container.utilities.ImageLoader;
import org.curiouslearning.container.utilities.AudioPlayer;

import java.util.List;

public class WebAppsAdapter extends RecyclerView.Adapter<WebAppsAdapter.ViewHolder> {

    public Context ctx;
    LayoutInflater inflater;
    public List<WebApp> webApps;
    private AudioPlayer audioPlayer;

    public WebAppsAdapter(Context context, List<WebApp> webApps) {
        this.ctx = context;
        this.webApps = webApps;
        this.inflater = LayoutInflater.from(ctx);
        this.audioPlayer = new AudioPlayer();
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
                    }
                });

            }
        });
    }

    @Override
    public int getItemCount() {
        return webApps.size();
    }

    public boolean isAppCached(int appId) {
        return ctx.getSharedPreferences("appCached", Context.MODE_PRIVATE).getBoolean(String.valueOf(appId), false);

    }

    public class ViewHolder extends RecyclerView.ViewHolder {
        ImageView appIconImage, downloadIconImage;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            appIconImage = (ImageView) itemView.findViewById(R.id.app_image);
            downloadIconImage = (ImageView) itemView.findViewById(R.id.download_image);
        }
    }
}

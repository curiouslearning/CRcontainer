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
import org.curiouslearning.container.utilities.CacheUtils;

import java.util.List;

public class WebAppsAdapter extends RecyclerView.Adapter<WebAppsAdapter.ViewHolder> {

    private Context context;
    private LayoutInflater inflater;
    private List<WebApp> webApps;

    public WebAppsAdapter(Context context, List<WebApp> webApps) {
        this.context = context;
        this.webApps = webApps;
        this.inflater = LayoutInflater.from(context);
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.activity_custom_list, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, @SuppressLint("RecyclerView") int position) {
        CacheUtils.loadWithPicasso(context, webApps.get(position).getAppIconUrl(), holder.appIconImage);
        holder.appIconImage.clearColorFilter();
        if (!isAppCached(webApps.get(position).getAppId())) {
            ColorMatrix matrix = new ColorMatrix();
            matrix.setSaturation(0);
            ColorMatrixColorFilter filter = new ColorMatrixColorFilter(matrix);
            holder.downloadIconImage.setImageResource(R.drawable.download_image);
            holder.appIconImage.setColorFilter(filter);
        } else {
            holder.downloadIconImage.setImageResource(0);
        }

        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(context, org.curiouslearning.container.WebApp.class);
                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                intent.putExtra("appId", String.valueOf(webApps.get(position).getAppId()));
                intent.putExtra("appUrl", webApps.get(position).getAppUrl());
                intent.putExtra("title", webApps.get(position).getTitle());
                context.startActivity(intent);
            }
        });
    }

    @Override
    public int getItemCount() {
        return webApps.size();
    }

    public boolean isAppCached(int appId) {
        return context.getSharedPreferences("appCached", Context.MODE_PRIVATE)
                .getBoolean(String.valueOf(appId), false);
    }

    public void setWebApps(List<WebApp> webApps) {
        this.webApps = webApps;
        notifyDataSetChanged();
    }

    public class ViewHolder extends RecyclerView.ViewHolder {
        ImageView appIconImage;
        ImageView downloadIconImage;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            appIconImage = itemView.findViewById(R.id.app_image);
            downloadIconImage = itemView.findViewById(R.id.download_image);
        }
    }
}

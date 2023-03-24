package org.curiouslearning.container.presentation.adapters;
import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
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

import java.util.ArrayList;
import java.util.List;

public class WebAppsAdapter extends RecyclerView.Adapter<WebAppsAdapter.ViewHolder>{

    public Context ctx;
    LayoutInflater inflater;
    public ArrayList<Bitmap> appIcons;
    public List<WebApp> webApps;
    private String[] versionDataStatus = {"EnglishDataCachedStatusDev", "CRDataCachedStatusDev"};

    public WebAppsAdapter(Context context, ArrayList<Bitmap> appIcons, List<WebApp> webApps) {
        this.ctx = context;
        this.appIcons = appIcons;
        this.webApps = webApps;
        this.inflater = LayoutInflater.from(ctx);

    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(ctx).inflate(R.layout.activity_custom_list, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, @SuppressLint("RecyclerView") int position) {
        holder.appIconImage.setImageBitmap(appIcons.get(position));
        holder.appIconImage.clearColorFilter();
        if (!isAppCached(position)) {
            ColorMatrix matrix = new ColorMatrix();
            matrix.setSaturation(0);
            ColorMatrixColorFilter filter = new ColorMatrixColorFilter(matrix);
            holder.downloadIconImage.setImageResource(R.drawable.download_image);
            holder.appIconImage.setColorFilter(filter);
        }

        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(ctx, org.curiouslearning.container.WebApp.class);
                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                intent.putExtra("appId", position);
                intent.putExtra("appUrl", webApps.get(position).getAppUrl());
                intent.putExtra("title", webApps.get(position).getTitle());
                ctx.startActivity(intent);
            }
        });
    }


    @Override
    public int getItemCount() {
        return appIcons.size();
    }

    public boolean isAppCached(int position) {
        return ctx.getSharedPreferences("appCached", Context.MODE_PRIVATE).getBoolean(String.valueOf(position), false);

    }

    public class ViewHolder extends RecyclerView.ViewHolder{
        ImageView appIconImage, downloadIconImage;
        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            appIconImage = (ImageView) itemView.findViewById(R.id.app_image);
            downloadIconImage = (ImageView) itemView.findViewById(R.id.download_image);
        }
    }
}

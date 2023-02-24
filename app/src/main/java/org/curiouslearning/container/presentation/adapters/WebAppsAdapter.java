package org.curiouslearning.container.presentation.adapters;
import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.ColorMatrix;
import android.graphics.ColorMatrixColorFilter;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.ImageView;

import androidx.annotation.NonNull;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.Observer;
import androidx.recyclerview.widget.RecyclerView;

import org.curiouslearning.container.R;
import org.curiouslearning.container.WebApp;
import org.curiouslearning.container.common.SharedPreferencesLiveData;

import java.util.ArrayList;

public class WebAppsAdapter extends RecyclerView.Adapter<WebAppsAdapter.ViewHolder>{

    public Context ctx;
    LayoutInflater inflater;
    public ArrayList<Bitmap> bitmaps;
    SharedPreferences sharedPref;
    SharedPreferencesLiveData sharedPreferencesLiveData;

    public WebAppsAdapter(Context context, ArrayList<Bitmap> bitmaps) {
        this.ctx = context;
        this.bitmaps = bitmaps;
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
        holder.appIconImage.setImageBitmap(bitmaps.get(position));
        holder.appIconImage.clearColorFilter();
        if (!isAppCached()) {
            ColorMatrix matrix = new ColorMatrix();
            matrix.setSaturation(0);
            ColorMatrixColorFilter filter = new ColorMatrixColorFilter(matrix);
            holder.downloadIconImage.setImageResource(R.drawable.download_image);
            holder.appIconImage.setColorFilter(filter);
        }

        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(ctx, WebApp.class);
                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                intent.putExtra("ftm-type", position);
                ctx.startActivity(intent);
            }
        });
    }


    @Override
    public int getItemCount() {
        return bitmaps.size();
    }

    public boolean isAppCached() {
        return ctx.getSharedPreferences("appCached", Context.MODE_PRIVATE).getBoolean("EnglishDataCachedStatus", false);

    }

    public class ViewHolder extends RecyclerView.ViewHolder{
        ImageView appIconImage, downloadIconImage;
        FrameLayout appIcon;
        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            appIconImage = (ImageView) itemView.findViewById(R.id.app_image);
            downloadIconImage = (ImageView) itemView.findViewById(R.id.download_image);
        }
    }
}

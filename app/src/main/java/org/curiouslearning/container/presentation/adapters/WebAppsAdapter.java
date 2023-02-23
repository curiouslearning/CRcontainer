package org.curiouslearning.container.presentation.adapters;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import org.curiouslearning.container.R;
import org.curiouslearning.container.WebApp;

import java.util.ArrayList;

public class WebAppsAdapter extends RecyclerView.Adapter<WebAppsAdapter.ViewHolder>{

    public Context ctx;
    LayoutInflater inflater;
    public ArrayList<Bitmap> bitmaps;

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
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        holder.imageView.setImageBitmap(bitmaps.get(position));
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

    public class ViewHolder extends RecyclerView.ViewHolder{
        ImageView imageView;
        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            imageView = (ImageView) itemView.findViewById(R.id.app_image);
        }
    }
}

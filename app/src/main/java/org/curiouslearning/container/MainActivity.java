package org.curiouslearning.container;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.graphics.Bitmap;
import android.os.Bundle;


import com.facebook.FacebookSdk;
import com.google.firebase.FirebaseApp;

import org.curiouslearning.container.data.local.AppManifest;
import org.curiouslearning.container.databinding.ActivityMainBinding;

import java.util.ArrayList;

public class MainActivity extends AppCompatActivity {

    public ActivityMainBinding binding;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        FirebaseApp.initializeApp(this);
        FacebookSdk.fullyInitialize();

        try {
            this.getSupportActionBar().hide();
        }
        catch (NullPointerException e) {}

        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        ArrayList<Bitmap> appIcons = new AppManifest().getWebAppsMetaData(getAssets());

        RecyclerView recyclerView = (RecyclerView) findViewById(R.id.recycleView);
        recyclerView.setLayoutManager(new GridLayoutManager(getApplicationContext(), 2, GridLayoutManager.HORIZONTAL, false));
        CustomAdapter customList = new CustomAdapter(getApplicationContext(), appIcons);
        recyclerView.setAdapter(customList);


    }
}
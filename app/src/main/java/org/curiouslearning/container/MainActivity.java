package org.curiouslearning.container;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.Observer;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.app.Application;
import android.graphics.Bitmap;
import android.os.Bundle;


import com.facebook.FacebookSdk;
import com.google.firebase.FirebaseApp;

import org.curiouslearning.container.common.SharedPreferencesLiveData;
import org.curiouslearning.container.data.local.AppManifest;
import org.curiouslearning.container.data.model.WebApp;
import org.curiouslearning.container.databinding.ActivityMainBinding;
import org.curiouslearning.container.presentation.adapters.WebAppsAdapter;
import org.curiouslearning.container.presentation.viewmodals.HomeViewModal;

import java.util.ArrayList;
import java.util.List;

public class MainActivity extends AppCompatActivity {

    public ActivityMainBinding binding;
    public RecyclerView recyclerView;
    public WebAppsAdapter apps;

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

        HomeViewModal homeViewModal = new HomeViewModal((Application) getApplicationContext(), getAssets());

        homeViewModal.getWebApps().observe(this, new Observer<List<WebApp>>() {
            @Override
            public void onChanged(List<WebApp> webApps) {
                System.out.println(webApps);
            }
        });
        
        recyclerView = findViewById(R.id.recycleView);
        recyclerView.setLayoutManager(new GridLayoutManager(getApplicationContext(), 2, GridLayoutManager.HORIZONTAL, false));
        apps = new WebAppsAdapter(getApplicationContext(), appIcons);
        recyclerView.setAdapter(apps);
    }

    @Override
    public void onResume() {
        super.onResume();
        recyclerView.setAdapter(apps);
    }
}
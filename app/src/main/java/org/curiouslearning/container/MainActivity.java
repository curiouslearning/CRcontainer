package org.curiouslearning.container;

import android.app.Application;
import android.graphics.Bitmap;
import android.os.Bundle;

import androidx.lifecycle.Observer;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.facebook.FacebookSdk;
import com.google.firebase.FirebaseApp;

import org.curiouslearning.container.data.local.AppManifest;
import org.curiouslearning.container.data.model.WebApp;
import org.curiouslearning.container.databinding.ActivityMainBinding;
import org.curiouslearning.container.presentation.adapters.WebAppsAdapter;
import org.curiouslearning.container.presentation.base.BaseActivity;
import org.curiouslearning.container.presentation.viewmodals.HomeViewModal;

import java.util.ArrayList;


public class MainActivity extends BaseActivity {

    public ActivityMainBinding binding;
    public RecyclerView recyclerView;
    public WebAppsAdapter apps;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        FirebaseApp.initializeApp(this);
        FacebookSdk.fullyInitialize();


        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        HomeViewModal homeViewModal = new HomeViewModal((Application) getApplicationContext(), getAssets());

        ArrayList<Bitmap> appIcons = new AppManifest().getWebAppsMetaData(getAssets());


        recyclerView = findViewById(R.id.recycleView);
        recyclerView.setLayoutManager(new GridLayoutManager(getApplicationContext(), 2, GridLayoutManager.HORIZONTAL, false));
        apps = new WebAppsAdapter(getApplicationContext(), appIcons, new ArrayList<>());
        recyclerView.setAdapter(apps);

        homeViewModal.getWebApps().observe(this, webApps -> {
            apps.webApps = webApps;
            apps.notifyDataSetChanged();
        });
    }

    @Override
    public void onResume() {
        super.onResume();
        recyclerView.setAdapter(apps);
    }
}
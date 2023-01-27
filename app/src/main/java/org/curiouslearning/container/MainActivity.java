package org.curiouslearning.container;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.content.DialogInterface;
import android.content.res.AssetManager;
import android.os.Bundle;

import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;
import com.google.firebase.FirebaseApp;

import org.curiouslearning.container.databinding.ActivityMainBinding;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class MainActivity extends AppCompatActivity {

    int[] appIcons = {R.drawable.ftm_english, R.drawable.ftm_french};
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

        RecyclerView recyclerView = (RecyclerView) findViewById(R.id.recycleView);
        recyclerView.setLayoutManager(new GridLayoutManager(getApplicationContext(), 2, GridLayoutManager.HORIZONTAL, false));
        CustomAdapter customList = new CustomAdapter(getApplicationContext(), appIcons);
        recyclerView.setAdapter(customList);


        AssetManager assetManager = getAssets();
        JSONFetcher jsonFetcher = new JSONFetcher(assetManager, "dummy.json");
        JSONArray jsonArray = jsonFetcher.getJSONArray();

        System.out.println(jsonArray.length());

        for(int i = 0; i < jsonArray.length(); i++) {
            JSONObject rec = null;
            try {
                rec = jsonArray.getJSONObject(i);
                String id = rec.getString("name");
                String loc = rec.getString("link");
                System.out.println(id);
                System.out.println(loc);
            } catch (JSONException e) {
                e.printStackTrace();
            }

        }

    }
}
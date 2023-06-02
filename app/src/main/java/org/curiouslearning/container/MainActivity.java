package org.curiouslearning.container;

import android.app.Application;
import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.ProgressBar;

import androidx.appcompat.app.AlertDialog;
import androidx.lifecycle.Observer;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;
import com.facebook.applinks.AppLinkData;
import com.google.android.material.textfield.TextInputLayout;
import com.google.firebase.FirebaseApp;

import org.curiouslearning.container.data.model.WebApp;
import org.curiouslearning.container.databinding.ActivityMainBinding;
import org.curiouslearning.container.presentation.adapters.WebAppsAdapter;
import org.curiouslearning.container.presentation.base.BaseActivity;
import org.curiouslearning.container.presentation.viewmodals.HomeViewModal;
import org.curiouslearning.container.utilities.CacheUtils;

import java.math.BigInteger;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class MainActivity extends BaseActivity {

    public ActivityMainBinding binding;
    public RecyclerView recyclerView;
    public WebAppsAdapter apps;
    public HomeViewModal homeViewModal;
    private SharedPreferences cachedPseudo;
    private Button settingsButton;
    private Dialog dialog;
    private ProgressBar loadingIndicator;

    private static final String SHARED_PREFS_NAME = "appCached";
    private SharedPreferences prefs;
    private String selectedLanguage;
    private String manifestVersion;

    private ArrayAdapter<String> adapter; // Add this line

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        FirebaseApp.initializeApp(this);
        FacebookSdk.fullyInitialize();
        AppEventsLogger.activateApp(getApplication());
        cachePseudoId();
        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        prefs = getSharedPreferences(SHARED_PREFS_NAME, MODE_PRIVATE);
        selectedLanguage = prefs.getString("selectedLanguage", "");
        manifestVersion = prefs.getString("manifestVersion", "");

        homeViewModal = new HomeViewModal((Application) getApplicationContext());
        dialog = new Dialog(this);
        initRecyclerView();
        loadingIndicator = findViewById(R.id.loadingIndicator);
        loadingIndicator.setVisibility(View.GONE);

        if (manifestVersion != null && !manifestVersion.isEmpty()) { // Modify this condition
            homeViewModal.getUpdatedAppManifest(manifestVersion);
        }

        AppLinkData.fetchDeferredAppLinkData(this, new AppLinkData.CompletionHandler() {
            @Override
            public void onDeferredAppLinkDataFetched(AppLinkData appLinkData) {
                if (appLinkData != null) {
                    Uri deepLinkUri = appLinkData.getTargetUri();
                    String language = deepLinkUri.getQueryParameter("language"); // Modify this line
                    if (language != null) {
                        selectedLanguage = language;
                        storeSelectedLanguage(selectedLanguage);
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                loadApps(selectedLanguage);
                            }
                        });
                    }
                } else {
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            if (selectedLanguage.isEmpty()) {
                                showLanguagePopup();
                            } else {
                                loadApps(selectedLanguage);
                            }
                        }
                    });
                }
            }
        });

        settingsButton = findViewById(R.id.settings);
        settingsButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                showLanguagePopup();
            }
        });
    }

    protected void initRecyclerView() {
        recyclerView = findViewById(R.id.recycleView);
        recyclerView.setLayoutManager(
                new GridLayoutManager(getApplicationContext(), 2, GridLayoutManager.HORIZONTAL, false));
        apps = new WebAppsAdapter(getApplicationContext(), new ArrayList<>());
        recyclerView.setAdapter(apps);
    }

    private void cachePseudoId() {
        Date now = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(now);
        cachedPseudo = getApplicationContext().getSharedPreferences(SHARED_PREFS_NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = cachedPseudo.edit();
        if (!cachedPseudo.contains("pseudoId")) {
            editor.putString("pseudoId",
                    generatePseudoId() + calendar.get(Calendar.YEAR) + (calendar.get(Calendar.MONTH) + 1)
                            + calendar.get(Calendar.DAY_OF_MONTH) + calendar.get(Calendar.HOUR_OF_DAY)
                            + calendar.get(Calendar.MINUTE) + calendar.get(Calendar.SECOND));
            editor.apply(); // Modify this line
        }
    }

    @Override
    public void onResume() {
        super.onResume();
        recyclerView.setAdapter(apps);
    }

    private String generatePseudoId() {
        SecureRandom random = new SecureRandom();
        String pseudoId = new BigInteger(130, random).toString(32);
        System.out.println(pseudoId);
        return pseudoId;
    }

    private void showPrompt(String message) {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setMessage(message)
                .setCancelable(false)
                .setPositiveButton("OK", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        finish();
                    }
                });
        AlertDialog alert = builder.create();
        alert.show();
    }

    private void showLanguagePopup() {
        dialog.setContentView(R.layout.language_popup);
        dialog.setCanceledOnTouchOutside(false);
        dialog.getWindow().setBackgroundDrawable(null);
        ImageView closeButton = dialog.findViewById(R.id.setting_close);
        TextInputLayout textBox = dialog.findViewById(R.id.dropdown_menu);
        AutoCompleteTextView autoCompleteTextView = dialog.findViewById(R.id.autoComplete);
        autoCompleteTextView.setDropDownBackgroundResource(android.R.color.white);
        adapter = new ArrayAdapter<>(dialog.getContext(), android.R.layout.simple_dropdown_item_1line,
                new ArrayList<>());
        autoCompleteTextView.setAdapter(adapter);

        homeViewModal.getAllWebApps().observe(this, new Observer<List<WebApp>>() {
            @Override
            public void onChanged(List<WebApp> webApps) {
                Set<String> distinctLanguages = new HashSet<>();
                for (WebApp webApp : webApps) {
                    String language = webApp.getLanguage();
                    distinctLanguages.add(language);
                }

                List<String> distinctLanguageList = new ArrayList<>(distinctLanguages);

                if (!webApps.isEmpty()) {
                    cacheManifestVersion(CacheUtils.manifestVersionNumber);
                }

                if (!distinctLanguageList.isEmpty()) {
                    System.out.println(distinctLanguageList);
                    adapter.clear(); // Clear the adapter before adding new items
                    adapter.addAll(distinctLanguageList);
                    adapter.notifyDataSetChanged();
                    selectedLanguage = prefs.getString("selectedLanguage", "");
                    if (!selectedLanguage.isEmpty()) {
                        textBox.setHint(selectedLanguage);
                    }

                    if (!selectedLanguage.isEmpty()) {
                        int position = adapter.getPosition(selectedLanguage);
                        System.out.println(position);
                    }

                    autoCompleteTextView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
                        @Override
                        public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                            selectedLanguage = (String) parent.getItemAtPosition(position);
                            storeSelectedLanguage(selectedLanguage);
                            dialog.dismiss();
                            loadApps(selectedLanguage);
                        }
                    });
                }
            }
        });

        closeButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                dialog.dismiss();
            }
        });
        dialog.show();
    }

    public void loadApps(String selectedLanguage) {
        loadingIndicator.setVisibility(View.VISIBLE);
        homeViewModal.getSelectedlanguageWebApps(selectedLanguage).observe(this, new Observer<List<WebApp>>() {
            @Override
            public void onChanged(List<WebApp> webApps) {
                if (!webApps.isEmpty()) {
                    loadingIndicator.setVisibility(View.GONE);
                    apps.setWebApps(webApps);
                    apps.notifyDataSetChanged();
                }
            }
        });
    }

    private void storeSelectedLanguage(String language) {
        SharedPreferences.Editor editor = prefs.edit();
        editor.putString("selectedLanguage", language);
        editor.apply();
    }

    private void cacheManifestVersion(String versionNumber) {
        if (versionNumber != null && !versionNumber.isEmpty()) { // Change the condition
            SharedPreferences.Editor editor = prefs.edit();
            editor.putString("manifestVersion", versionNumber);
            editor.apply();
        }
    }
}

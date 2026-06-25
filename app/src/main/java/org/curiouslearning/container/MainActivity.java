package org.curiouslearning.container;

import android.animation.ObjectAnimator;
import android.animation.ValueAnimator;

import android.app.Dialog;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.text.method.ScrollingMovementMethod;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;


import org.curiouslearning.container.data.model.WebApp;
import org.curiouslearning.container.databinding.ActivityMainBinding;
import org.curiouslearning.container.firebase.AnalyticsUtils;
import org.curiouslearning.container.installreferrer.InstallReferrerManager;
import org.curiouslearning.container.presentation.adapters.WebAppsAdapter;
import org.curiouslearning.container.presentation.base.BaseActivity;
import org.curiouslearning.container.presentation.viewmodels.HomeViewModel;
import org.curiouslearning.container.utilities.AnimationUtil;
import org.curiouslearning.container.utilities.AppUtils;
import org.curiouslearning.container.utilities.AudioPlayer;
import org.curiouslearning.container.utilities.DebugOverlayManager;
import org.curiouslearning.container.utilities.ImageLoader;
import org.curiouslearning.container.utilities.LanguageDialogManager;
import org.curiouslearning.container.utilities.ReferralManager;
import org.curiouslearning.container.utilities.StudyEnrollmentManager;
import org.curiouslearning.container.utilities.VisualEffectsManager;

import java.util.ArrayList;
import java.util.List;

import androidx.lifecycle.ViewModelProvider;
import app.rive.runtime.kotlin.RiveAnimationView;

public class MainActivity extends BaseActivity
        implements ReferralManager.ReferralManagerListener, LanguageDialogManager.LanguageDialogListener {
    private static final String TAG = "MainActivity";
    private static final String SHARED_PREFS_NAME = "appCached";
    private static final String UTM_PREFS_NAME = "utmPrefs";
    private final String isValidLanguage = "notValidLanguage";
    public ActivityMainBinding binding;
    public RecyclerView recyclerView;
    public WebAppsAdapter apps;
    public HomeViewModel homeViewModel;

    private SharedPreferences prefs;
    private SharedPreferences utmPrefs;
    private String selectedLanguage;
    private String manifestVersion;
    private AudioPlayer audioPlayer;
    private String appVersion;
    private ProgressBar loadingIndicator;
    private Button settingsButton;

    // Managers
    private VisualEffectsManager visualEffectsManager;
    private ReferralManager referralManager;
    private LanguageDialogManager languageDialogManager;
    private DebugOverlayManager debugOverlayManager;
    private Dialog dialog;

    private StudyEnrollmentManager studyEnrollmentManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        prefs = getSharedPreferences(SHARED_PREFS_NAME, MODE_PRIVATE);
        utmPrefs = getSharedPreferences(UTM_PREFS_NAME, MODE_PRIVATE);
        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        loadingIndicator = findViewById(R.id.loadingIndicator);
        loadingIndicator.setVisibility(View.GONE);

        selectedLanguage = prefs.getString("selectedLanguage", "");
        manifestVersion = prefs.getString("manifestVersion", "");
        appVersion = AppUtils.getAppVersionName(this);

        // Use ViewModelProvider so the ViewModel survives configuration changes
        homeViewModel = new ViewModelProvider(this).get(HomeViewModel.class);
        cachePseudoId();

        // Initialize Managers
        visualEffectsManager = new VisualEffectsManager();
        referralManager = new ReferralManager(this, homeViewModel, this, this);

        studyEnrollmentManager = new StudyEnrollmentManager(this, prefs, appVersion, new StudyEnrollmentManager.StudyEnrollmentListener() {
            @Override
            public void onDismissLanguagePopupIfShowing() {
                dismissLanguagePopupIfShowing();
            }

            @Override
            public void onLoadApps(String language) {
                runOnUiThread(() -> loadApps(language));
            }

            @Override
            public void onShowLanguagePopup() {
                runOnUiThread(() -> languageDialogManager.showLanguagePopup());
            }

            @Override
            public void onUpdateDebugOverlay() {
                runOnUiThread(() -> {
                    if (debugOverlayManager != null) {
                        debugOverlayManager.updateDebugOverlay();
                    }
                });
            }

            @Override
            public void onCachePseudoId() {
                cachePseudoId();
            }

            @Override
            public String getSelectedLanguage() {
                return selectedLanguage;
            }
        });

        audioPlayer = new AudioPlayer(); // Used by LanguageDialogManager
        languageDialogManager = new LanguageDialogManager(this, homeViewModel, prefs, audioPlayer, this);

        View offlineOverlay = findViewById(R.id.offline_mode_overlay);
        View debugTriggerArea = findViewById(R.id.debug_trigger_area);
        debugOverlayManager = new DebugOverlayManager(this, offlineOverlay, debugTriggerArea, prefs, utmPrefs,
                referralManager, appVersion);

        // Visual Effects
        setupVisualEffects();

        // Firebase is auto-initialized via google-services.json — no manual init needed.
        // Facebook SDK is initialized in MyApplication.onCreate() — no duplicate init needed here.
        Log.d(TAG, "onCreate: MainActivity started");

        // UI Setup
        initRecyclerView();

        Log.d(TAG, "onCreate: Selected language: " + selectedLanguage);
        Log.d(TAG, "onCreate: Manifest version: " + manifestVersion);
        if (manifestVersion != null && !manifestVersion.equals("")) {
            homeViewModel.getUpdatedAppManifest(manifestVersion);
        }

        settingsButton = findViewById(R.id.settings);
        settingsButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                visualEffectsManager.spinSettingsGear(view);
                AnimationUtil.scaleButton(view, new Runnable() {
                    @Override
                    public void run() {
                        languageDialogManager.showLanguagePopup();
                    }
                });
            }
        });

        // Handle Intent Data
        Intent intent = getIntent();
        if (intent.getData() != null) {
            String language = intent.getData().getQueryParameter("language");
            if (language != null) {
                selectedLanguage = Character.toUpperCase(language.charAt(0))
                        + language.substring(1).toLowerCase();
            }
        }

        // Initialize Referral Handling
        referralManager.init();

    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleIncomingIntent(intent);
    }

    private void handleIncomingIntent(Intent intent) {
        if (intent != null && intent.getData() != null) {
            Uri data = intent.getData();
            boolean handledStudyEnrollmentLink = studyEnrollmentManager.handleStudyEnrollmentLink(data);

            // Existing language parameter logic
            String language = data.getQueryParameter("language");
            if (language != null) {
                if (language.length() > 0) {
                    selectedLanguage = Character.toUpperCase(language.charAt(0))
                            + language.substring(1).toLowerCase();
                } else {
                    selectedLanguage = "";
                }
                storeSelectLanguage(selectedLanguage);
                runOnUiThread(() -> {
                    loadApps(selectedLanguage);
                });
            }

            if (handledStudyEnrollmentLink) {
                Intent consumedIntent = new Intent(intent);
                consumedIntent.setData(null);
                setIntent(consumedIntent);
            }
        }
    }

    private void dismissLanguagePopupIfShowing() {
        if (dialog != null && dialog.isShowing()) {
            dialog.dismiss();
        }
    }



    private void setupVisualEffects() {
        RiveAnimationView monsterView = findViewById(R.id.monsterView);
        // We will update monster animation later when we have data, but initial call is
        // safe if data is ready
        // But better done in onResume or when data changes.
        // visualEffectsManager.updateMonsterAnimation... called in
        // onResume/storeLanguage

        View lightOverlay = findViewById(R.id.light_overlay);
        visualEffectsManager.addBreathingEffect(lightOverlay);

        ImageView sky = findViewById(R.id.imageView);
        ImageView foreground = findViewById(R.id.foreground_foliage);

        visualEffectsManager.applyCartoonEffect(sky);
        if (foreground != null) {
            visualEffectsManager.applyCartoonEffect(foreground);
            visualEffectsManager.addWindEffect(foreground);
        }
    }

    @Override
    public void onResume() {
        super.onResume();
        recyclerView.setAdapter(apps);

        debugOverlayManager.onResume();
        visualEffectsManager.resumeBreathingEffect();

        ImageView foliage = findViewById(R.id.foreground_foliage);
        if (foliage != null) {
            visualEffectsManager.resumeWindEffect(foliage);
        }

        RiveAnimationView monsterView = findViewById(R.id.monsterView);
        if (monsterView != null && apps != null) {
            visualEffectsManager.updateMonsterAnimation(monsterView, prefs, apps.webApps, selectedLanguage);
        }
    }

    @Override
    public void onPause() {
        super.onPause();
        debugOverlayManager.onPause();
        visualEffectsManager.pauseBreathingEffect();

        ImageView foliage = findViewById(R.id.foreground_foliage);
        if (foliage != null) {
            visualEffectsManager.pauseWindEffect(foliage);
        }
    }

    // --- ReferralManagerListener Implementation ---

    @Override
    public void onLanguageReceived(String language) {
        runOnUiThread(() -> {
            if (selectedLanguage.equals("")) {
                languageDialogManager.showLanguagePopup();
            } else {
                loadApps(language);
            }
        });
    }

    @Override
    public void onShowLanguagePopup() {
        runOnUiThread(() -> {
            languageDialogManager.showLanguagePopup();
        });
    }

    @Override
    public void onUpdateDebugOverlay() {
        runOnUiThread(() -> {
            if (debugOverlayManager != null) {
                debugOverlayManager.updateDebugOverlay();
            }
        });
    }

    @Override
    public void onReferrerStatusUpdate(InstallReferrerManager.ReferrerStatus status) {
        runOnUiThread(() -> {
            if (debugOverlayManager != null) {
                debugOverlayManager.updateDebugOverlay();
            }
        });
    }

    // --- LanguageDialogListener Implementation ---

    @Override
    public void onLanguageSelected(String language) {
        selectedLanguage = language;
        loadApps(language);
    }

    // --- Helper Methods ---

    public void loadApps(String selectedLanguageParam) {
        Log.d(TAG, "loadApps: Loading apps for language: " + selectedLanguage);
        loadingIndicator.setVisibility(View.VISIBLE);
        final String language = selectedLanguageParam;

        homeViewModel.getSelectedlanguageWebApps(selectedLanguageParam).observe(this,
                new androidx.lifecycle.Observer<List<WebApp>>() {
                    @Override
                    public void onChanged(List<WebApp> webApps) {
                        loadingIndicator.setVisibility(View.GONE);
                        if (!webApps.isEmpty()) {
                            apps.webApps = webApps;
                            apps.notifyDataSetChanged();
                            storeSelectLanguage(language);

                            // Pre-warm the icon cache for all apps in the selected language
                            List<String> iconUrls = new ArrayList<>();
                            for (WebApp webApp : webApps) {
                                if (webApp.getAppIconUrl() != null && !webApp.getAppIconUrl().isEmpty()) {
                                    iconUrls.add(webApp.getAppIconUrl());
                                }
                            }
                            ImageLoader.prewarmIconCache(MainActivity.this, iconUrls);
                        } else {
                            if (!prefs.getString("selectedLanguage", "").equals("") && language.equals("")) {
                                languageDialogManager.showLanguagePopup();
                            }
                            if (manifestVersion.equals("")) {
                                if (!selectedLanguageParam.equals(isValidLanguage))
                                    loadingIndicator.setVisibility(View.VISIBLE);
                                // Trigger network fetch explicitly — Room LiveData will update observers automatically
                                homeViewModel.triggerRefresh();
                            }
                        }
                    }
                });
    }

    private void storeSelectLanguage(String language) {
        SharedPreferences.Editor editor = prefs.edit();
        editor.putString("selectedLanguage", language);
        editor.apply();
        Log.d(TAG, "storeSelectLanguage: Stored selected language: " + language);

        this.selectedLanguage = language; // Update local field
        debugOverlayManager.updateDebugOverlay();

        RiveAnimationView monsterView = findViewById(R.id.monsterView);
        if (monsterView != null && apps != null) {
            visualEffectsManager.updateMonsterAnimation(monsterView, prefs, apps.webApps, language);
        }
    }

    protected void initRecyclerView() {
        recyclerView = findViewById(R.id.recycleView);
        recyclerView.setLayoutManager(
                new GridLayoutManager(getApplicationContext(), 2, GridLayoutManager.HORIZONTAL, false));
        apps = new WebAppsAdapter(this, new ArrayList<>());
        recyclerView.setAdapter(apps);
    }

    private void cachePseudoId() {
        if (!prefs.contains("pseudoId")) {
            SharedPreferences.Editor editor = prefs.edit();
            editor.putString("pseudoId",
                    generatePseudoId() + System.currentTimeMillis());
            editor.apply(); // Never use commit() — apply() is async and safe on main thread
        }
    }

    // Kept for generatePseudoId dependency
    private String generatePseudoId() {
        java.security.SecureRandom random = new java.security.SecureRandom();
        return new java.math.BigInteger(130, random).toString(32);
    }

}

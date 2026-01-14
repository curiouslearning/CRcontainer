package org.curiouslearning.container;

import android.animation.ObjectAnimator;
import android.animation.ValueAnimator;
import android.app.Application;
import android.app.Dialog;
import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.ColorMatrix;
import android.graphics.ColorMatrixColorFilter;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.GestureDetector;
import android.view.MotionEvent;
import android.view.View;
import android.view.animation.AccelerateDecelerateInterpolator;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.ProgressBar;

import androidx.lifecycle.Observer;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;
import com.facebook.applinks.AppLinkData;
import com.google.android.material.textfield.TextInputLayout;
import com.google.firebase.FirebaseApp;
import com.google.firebase.crashlytics.FirebaseCrashlytics;

import org.curiouslearning.container.data.model.WebApp;
import org.curiouslearning.container.databinding.ActivityMainBinding;
import org.curiouslearning.container.firebase.AnalyticsUtils;
import org.curiouslearning.container.installreferrer.InstallReferrerManager;
import org.curiouslearning.container.presentation.adapters.WebAppsAdapter;
import org.curiouslearning.container.presentation.base.BaseActivity;
import org.curiouslearning.container.presentation.viewmodals.HomeViewModal;
import org.curiouslearning.container.utilities.AnimationUtil;
import org.curiouslearning.container.utilities.AppUtils;
import org.curiouslearning.container.utilities.CacheUtils;
import org.curiouslearning.container.utilities.AudioPlayer;
import org.curiouslearning.container.utilities.ConnectionUtils;
import org.curiouslearning.container.utilities.SlackUtils;

import java.math.BigInteger;
import java.security.SecureRandom;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.TimeZone;
import java.util.TreeMap;
import java.util.stream.Collectors;
import android.util.Log;
import android.content.Intent;
import android.widget.TextView;

import androidx.core.view.GestureDetectorCompat;
import app.rive.runtime.kotlin.RiveAnimationView;
import app.rive.runtime.kotlin.core.Alignment;
import app.rive.runtime.kotlin.core.Fit;
import app.rive.runtime.kotlin.core.Loop;
import io.sentry.Sentry;

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
    private static final String REFERRER_HANDLED_KEY = "isReferrerHandled";
    private static final String UTM_PREFS_NAME = "utmPrefs";
    private final String isValidLanguage = "notValidLanguage";
    private SharedPreferences utmPrefs;
    private SharedPreferences prefs;
    private String selectedLanguage;
    private String manifestVersion;
    private static final String TAG = "MainActivity";
    private AudioPlayer audioPlayer;
    private String appVersion;
    private boolean isReferrerHandled;
    private boolean isAttributionComplete = false;
    private long initialSlackAlertTime;
    private GestureDetectorCompat gestureDetector;
    private TextView textView;
    private InstallReferrerManager.ReferrerStatus currentReferrerStatus;
    private View debugTriggerArea;
    private int debugTapCount = 0;
    private long lastTapTime = 0;
    private static final long TAP_TIMEOUT = 3000; // Reset tap count after 3 seconds
    private static final int REQUIRED_TAPS = 8;
    private ObjectAnimator breathingAnimator;
    private Handler debugOverlayHandler = new Handler(Looper.getMainLooper());
    private static final long DEBUG_OVERLAY_UPDATE_INTERVAL = 1000; // 1 second

    private final Runnable debugOverlayUpdater = new Runnable() {
        @Override
        public void run() {
            updateDebugOverlay();
            debugOverlayHandler.postDelayed(this, DEBUG_OVERLAY_UPDATE_INTERVAL);
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        prefs = getSharedPreferences(SHARED_PREFS_NAME, MODE_PRIVATE);
        utmPrefs = getSharedPreferences(UTM_PREFS_NAME, MODE_PRIVATE);
        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        RiveAnimationView monsterView = findViewById(R.id.monsterView);
        // Update monster animation based on FTM state
        updateMonsterAnimation(monsterView);


        View lightOverlay = findViewById(R.id.light_overlay);
        addBreathingEffect(lightOverlay);

        ImageView sky = findViewById(R.id.imageView);
//        ImageView hills = findViewById(R.id.imageView4);
//        ImageView foreground = findViewById(R.id.imageView6);

        applyCartoonEffect(sky);
//        applyCartoonEffect(hills);
//        applyCartoonEffect(foreground);

        dialog = new Dialog(this);
        loadingIndicator = findViewById(R.id.loadingIndicator);
        loadingIndicator.setVisibility(View.GONE);
        isReferrerHandled = prefs.getBoolean(REFERRER_HANDLED_KEY, false);
        selectedLanguage = prefs.getString("selectedLanguage", "");
        initialSlackAlertTime = AnalyticsUtils.getCurrentEpochTime();
        homeViewModal = new HomeViewModal((Application) getApplicationContext(), this);
        cachePseudoId();

        // Check if we're starting in offline mode
        if (!isInternetConnected(getApplicationContext())) {
            // If referrer was already handled before, we can send offline event with stored
            // UTM params
            if (isReferrerHandled) {
                logStartedInOfflineMode();
            }
            // If referrer wasn't handled yet, we'll wait for referrer callback to send the
            // event
        }

        InstallReferrerManager.ReferrerCallback referrerCallback = new InstallReferrerManager.ReferrerCallback() {
            @Override
            public void onReferrerStatusUpdate(InstallReferrerManager.ReferrerStatus status) {
                currentReferrerStatus = status;
                updateDebugOverlay();
            }

            @Override
            public void onReferrerReceived(String deferredLang, String fullURL) {
                String language = deferredLang.trim();

                if (!isReferrerHandled) {
                    SharedPreferences.Editor editor = prefs.edit();
                    editor.putBoolean(REFERRER_HANDLED_KEY, true);
                    editor.apply();
                    if ((language != null && language.length() > 0) || fullURL.contains("curiousreader://app")) {
                        isAttributionComplete = true;
                        // Store deferred deeplink
                        editor = prefs.edit();
                        editor.putString("deferred_deeplink", fullURL);
                        editor.apply();

                        // Store UTM parameters first
                        SharedPreferences.Editor utmEditor = utmPrefs.edit();
                        Uri uri = Uri.parse("http://dummyurl.com/?" + fullURL);
                        String source = uri.getQueryParameter("source");
                        String campaign_id = uri.getQueryParameter("campaign_id");
                        utmEditor.putString("source", source);
                        utmEditor.putString("campaign_id", campaign_id);
                        utmEditor.apply();

                        // Also store in InstallReferrerPrefs for analytics
                        SharedPreferences installReferrerPrefs = getSharedPreferences("InstallReferrerPrefs",
                                MODE_PRIVATE);
                        SharedPreferences.Editor installReferrerEditor = installReferrerPrefs.edit();
                        installReferrerEditor.putString("source", source);
                        installReferrerEditor.putString("campaign_id", campaign_id);
                        installReferrerEditor.apply();

                        // Now check offline mode and log event with the stored UTM params
                        if (!isInternetConnected(getApplicationContext())) {
                            logStartedInOfflineMode();
                        }
                        updateDebugOverlay(); // Always update the overlay

                        validLanguage(language, "google", fullURL.replace("deferred_deeplink=", ""));
                        String pseudoId = prefs.getString("pseudoId", "");
                        String manifestVrsn = prefs.getString("manifestVersion", "");
                        String lang = "";
                        if (language != null && language.length() > 0)
                            lang = Character.toUpperCase(language.charAt(0))
                                    + language.substring(1).toLowerCase();
                        selectedLanguage = lang;
                        storeSelectLanguage(lang);
                        updateDebugOverlay();

                        if (isAttributionComplete) {
                            AnalyticsUtils.logLanguageSelectEvent(MainActivity.this, "language_selected", pseudoId,
                                    language,
                                    manifestVrsn, "true", fullURL.replace("deferred_deeplink=", ""));
                        } else {
                            Log.d(TAG, "Attribution not complete. Skipping event log.");
                        }
                        Log.d(TAG, "Referrer language received: " + language + " " + lang);
                    } else {
                        fetchFacebookDeferredData();
                    }
                } else {
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            if (selectedLanguage.equals("")) {
                                showLanguagePopup();
                            } else {
                                loadApps(selectedLanguage);
                            }
                        }
                    });
                }
            }
        };
        InstallReferrerManager installReferrerManager = new InstallReferrerManager(getApplicationContext(),
                referrerCallback);
        installReferrerManager.checkPlayStoreAvailability();
        Intent intent = getIntent();
        if (intent.getData() != null) {
            String language = intent.getData().getQueryParameter("language");
            if (language != null) {
                selectedLanguage = Character.toUpperCase(language.charAt(0))
                        + language.substring(1).toLowerCase();
            }
        }
        audioPlayer = new AudioPlayer();
        FirebaseApp.initializeApp(this);
        FacebookSdk.setAutoInitEnabled(true);
        FacebookSdk.fullyInitialize();
        FacebookSdk.setAdvertiserIDCollectionEnabled(true);
        Log.d(TAG, "onCreate: Initializing MainActivity and FacebookSdk");
        AppEventsLogger.activateApp(getApplication());
        appVersion = AppUtils.getAppVersionName(this);
        manifestVersion = prefs.getString("manifestVersion", "");
        initRecyclerView();
        Log.d(TAG, "onCreate: Selected language: " + selectedLanguage);
        Log.d(TAG, "onCreate: Manifest version: " + manifestVersion);
        if (manifestVersion != null && manifestVersion != "") {
            homeViewModal.getUpdatedAppManifest(manifestVersion);
        }
        settingsButton = findViewById(R.id.settings);
        settingsButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                AnimationUtil.scaleButton(view, new Runnable() {
                    @Override
                    public void run() {
                        showLanguagePopup();
                    }
                });
            }
        });

        // Initialize debug trigger area
        debugTriggerArea = findViewById(R.id.debug_trigger_area);
        debugTriggerArea.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                long currentTime = System.currentTimeMillis();
                if (currentTime - lastTapTime > TAP_TIMEOUT) {
                    debugTapCount = 1;
                } else {
                    debugTapCount++;
                }
                lastTapTime = currentTime;

                if (debugTapCount >= REQUIRED_TAPS) {
                    debugTapCount = 0;
                    View offlineOverlay = findViewById(R.id.offline_mode_overlay);
                    if (offlineOverlay != null) {
                        offlineOverlay.setVisibility(View.VISIBLE);
                        offlineOverlay.setElevation(dpToPx(24));
                        offlineOverlay.bringToFront();
                        updateDebugOverlay();
                        debugOverlayHandler.post(debugOverlayUpdater);
                    }
                }
            }
        });
    }
    private void addBreathingEffect(View view) {
        breathingAnimator = ObjectAnimator.ofFloat(
                view,
                "alpha",
                0.06f,
                0.1f
        );
        breathingAnimator.setDuration(6000);
        breathingAnimator.setRepeatCount(ValueAnimator.INFINITE);
        breathingAnimator.setRepeatMode(ValueAnimator.REVERSE);
        breathingAnimator.setInterpolator(new AccelerateDecelerateInterpolator());
        breathingAnimator.start();
    }
    private void applyCartoonEffect(ImageView imageView) {

        ColorMatrix colorMatrix = new ColorMatrix();

        // 1️⃣ Increase saturation (cartoon look)
        colorMatrix.setSaturation(1.2f);

        // 2️⃣ Slight brightness boost
        ColorMatrix brightnessMatrix = new ColorMatrix(new float[]{
                1, 0, 0, 0, 20,
                0, 1, 0, 0, 20,
                0, 0, 1, 0, 20,
                0, 0, 0, 1, 0
        });

        colorMatrix.postConcat(brightnessMatrix);

        imageView.setColorFilter(
                new ColorMatrixColorFilter(colorMatrix)
        );
    }

    private int dpToPx(int dp) {
        return (int) (dp * getResources().getDisplayMetrics().density);
    }

    private class GestureListener extends GestureDetector.SimpleOnGestureListener {
        @Override
        public boolean onDoubleTap(MotionEvent e) {
            android.util.Log.d("MainActivity", " Double tapped on settings_box");

            String pseudoId = prefs.getString("pseudoId", "");
            textView.setText("cr_user_id_" + pseudoId);
            textView.setVisibility(View.VISIBLE);
            return true;
        }
    }

    private void fetchFacebookDeferredData() {
        AppLinkData.fetchDeferredAppLinkData(this, new AppLinkData.CompletionHandler() {
            @Override
            public void onDeferredAppLinkDataFetched(AppLinkData appLinkData) {
                String pseudoId = prefs.getString("pseudoId", "");
                String manifestVrsn = prefs.getString("manifestVersion", "");
                if (dialog != null && dialog.isShowing()) {
                    dialog.dismiss();
                    Log.d(TAG, "onDeferredAppLinkDataFetched: dialog is equal to null ");
                }
                Log.d(TAG, "onDeferredAppLinkDataFetched:Facebook AppLinkData: " + appLinkData);
                if (appLinkData != null) {
                    Uri deepLinkUri = appLinkData.getTargetUri();
                    Log.d(TAG, "onDeferredAppLinkDataFetched: DeepLink URI: " + deepLinkUri);
                    String language = ((Uri) deepLinkUri).getQueryParameter("language");
                    String source = ((Uri) deepLinkUri).getQueryParameter("source");
                    String campaign_id = ((Uri) deepLinkUri).getQueryParameter("campaign_id");
                    SharedPreferences.Editor editor = utmPrefs.edit();
                    editor.putString("source", source);
                    editor.putString("campaign_id", campaign_id);
                    editor.apply();
                    validLanguage(language, "facebook", String.valueOf(deepLinkUri));
                    String lang = Character.toUpperCase(language.charAt(0)) + language.substring(1).toLowerCase();
                    Log.d(TAG, "onDeferredAppLinkDataFetched: Language from deep link: " + lang);
                    selectedLanguage = lang;
                    storeSelectLanguage(lang);
                    isAttributionComplete = true;
                    AnalyticsUtils.storeReferrerParams(MainActivity.this, source, campaign_id);

                    if (isAttributionComplete) {
                        AnalyticsUtils.logLanguageSelectEvent(MainActivity.this, "language_selected", pseudoId, lang,
                                manifestVrsn, "true", String.valueOf(deepLinkUri));
                    } else {
                        Log.d(TAG, "Attribution not complete. Skipping event log.");
                    }

                } else {
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            if (selectedLanguage.equals("")) {
                                showLanguagePopup();
                            } else {
                                loadApps(selectedLanguage);
                            }

                        }
                    });
                }
            }
        });
    }

    protected void initRecyclerView() {
        recyclerView = findViewById(R.id.recycleView);
        recyclerView.setLayoutManager(
                new GridLayoutManager(getApplicationContext(), 2, GridLayoutManager.HORIZONTAL, false));
        apps = new WebAppsAdapter(this, new ArrayList<>());
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
                    generatePseudoId() + calendar.get(Calendar.YEAR) + (calendar.get(Calendar.MONTH) + 1) +
                            calendar.get(Calendar.DAY_OF_MONTH) + calendar.get(Calendar.HOUR_OF_DAY)
                            + calendar.get(Calendar.MINUTE) + calendar.get(Calendar.SECOND));
            editor.commit();
        }
    }

    public static String convertEpochToDate(long epochMillis) {
        Date date = new Date(epochMillis);
        SimpleDateFormat sdf =
                new SimpleDateFormat("dd MMM yyyy hh:mm a", Locale.getDefault());
        sdf.setTimeZone(TimeZone.getDefault());
        return sdf.format(date);
    }

    @Override
    public void onResume() {
        super.onResume();
        recyclerView.setAdapter(apps);
        // Only update the overlay if it's visible
        View offlineOverlay = findViewById(R.id.offline_mode_overlay);
        if (offlineOverlay != null && offlineOverlay.getVisibility() == View.VISIBLE) {
            updateDebugOverlay();
            debugOverlayHandler.post(debugOverlayUpdater);
        }
        if (breathingAnimator != null) breathingAnimator.resume();
        
        // Refresh monster animation in case it was updated while WebApp was open
        RiveAnimationView monsterView = findViewById(R.id.monsterView);
        if (monsterView != null) {
            updateMonsterAnimation(monsterView);
        }
    }

    @Override
    public void onPause() {
        super.onPause();
        // Stop periodic updates of debug overlay
        debugOverlayHandler.removeCallbacks(debugOverlayUpdater);
        if (breathingAnimator != null) breathingAnimator.pause();
    }

    private String generatePseudoId() {
        SecureRandom random = new SecureRandom();
        String pseudoId = new BigInteger(130, random).toString(32);
        System.out.println(pseudoId);
        return pseudoId;
    }

    private void validLanguage(String deferredLang, String source, String deepLinkUri) {
        String language = deferredLang == null ? null : deferredLang.trim();
        long currentEpochTime = AnalyticsUtils.getCurrentEpochTime();
        String pseudoId = prefs.getString("pseudoId", "");
        String[] uriParts = deepLinkUri.split("(?=[?&])");
        StringBuilder message = new StringBuilder();
        message.append("An incorrect or null language value was detected in a ")
                .append(source)
                .append(" campaign’s deferred deep link with the following details:\n\n");
        for (String part : uriParts) {
            message.append(part).append("\n");
        }
        message.append("\n");
        message.append("User affected:: ").append(pseudoId).append("\n")
                .append("Detected in data at: ").append(convertEpochToDate(currentEpochTime)).append("\n")
                .append("Alerted in Slack: ").append(convertEpochToDate(initialSlackAlertTime));
        runOnUiThread(() -> {
            if (language == null || language.length() == 0) {
                String errorMsg = "[AttributionError] Null or empty 'language' received from " + source
                        + " referrer. PseudoId: " + pseudoId;
                AnalyticsUtils.logAttributionErrorEvent(MainActivity.this, "attribution_error", deepLinkUri, pseudoId);

                // Firebase Crashlytics non-fatal error
                FirebaseCrashlytics.getInstance().log(errorMsg);
                FirebaseCrashlytics.getInstance().recordException(
                        new IllegalArgumentException(errorMsg));
                // Slack alert
                SlackUtils.sendMessageToSlack(MainActivity.this, String.valueOf(message));
                Sentry.captureMessage("Missing Language when selecting Language ");
                showLanguagePopup();
                return;
            }
            homeViewModal.getAllLanguagesInEnglish().observe(this, validLanguages -> {
                List<String> lowerCaseLanguages = validLanguages.stream()
                        .map(String::toLowerCase)
                        .collect(Collectors.toList());
                if (lowerCaseLanguages != null && lowerCaseLanguages.size() > 0
                        && !lowerCaseLanguages.contains(language.toLowerCase().trim())) {
                    SlackUtils.sendMessageToSlack(MainActivity.this, String.valueOf(message));
                    Sentry.captureMessage("Incorrect Language when selecting Language ");
                    showLanguagePopup();
                    loadingIndicator.setVisibility(View.GONE);
                    selectedLanguage = "";
                    storeSelectLanguage("");
                    return;
                } else if (lowerCaseLanguages != null && lowerCaseLanguages.size() > 0) {
                    String lang = Character.toUpperCase(language.charAt(0))
                            + language.substring(1).toLowerCase();
                    loadApps(lang);
                } else if (lowerCaseLanguages == null || lowerCaseLanguages.size() == 0) {
                    loadApps(isValidLanguage);
                }
            });
        });
    }

    private void showLanguagePopup() {
        if (!dialog.isShowing()) {
            dialog.setContentView(R.layout.language_popup);

            dialog.setCanceledOnTouchOutside(false);
            dialog.getWindow().setBackgroundDrawable(null);

            ImageView invisibleBox = dialog.findViewById(R.id.invisible_box);
            textView = dialog.findViewById(R.id.pseudo_id_text);

            ImageView closeButton = dialog.findViewById(R.id.setting_close);
            TextInputLayout textBox = dialog.findViewById(R.id.dropdown_menu);
            AutoCompleteTextView autoCompleteTextView = dialog.findViewById(R.id.autoComplete);
            autoCompleteTextView.setDropDownBackgroundResource(android.R.color.white);
            ArrayAdapter<String> adapter = new ArrayAdapter<String>(dialog.getContext(),
                    android.R.layout.simple_dropdown_item_1line, new ArrayList<String>());
            autoCompleteTextView.setAdapter(adapter);

            homeViewModal.getAllWebApps().observe(this, new Observer<List<WebApp>>() {
                @Override
                public void onChanged(List<WebApp> webApps) {
                    Set<String> distinctLanguages = sortLanguages(webApps);
                    Map<String, String> languagesEnglishNameMap = MapLanguagesEnglishName(webApps);
                    List<String> distinctLanguageList = new ArrayList<>(distinctLanguages);
                    if (!webApps.isEmpty()) {
                        cacheManifestVersion(CacheUtils.manifestVersionNumber);
                    }

                    if (!distinctLanguageList.isEmpty()) {
                        Log.d(TAG, "showLanguagePopup: Distinct languages: " + distinctLanguageList);
                        adapter.clear();
                        adapter.addAll(distinctLanguageList);
                        adapter.notifyDataSetChanged();
                        int standardizedItemHeight = 50;
                        int itemCount = adapter.getCount();
                        int dropdownHeight = standardizedItemHeight * itemCount;
                        int maxHeight = getResources().getDisplayMetrics().heightPixels / 2;
                        int adjustedDropdownHeight = Math.min(dropdownHeight, maxHeight);
                        autoCompleteTextView.setDropDownHeight(adjustedDropdownHeight);

                        selectedLanguage = prefs.getString("selectedLanguage", "");
                        if (!selectedLanguage.isEmpty() && languagesEnglishNameMap.containsValue(selectedLanguage)) {
                            textBox.setHint(languagesEnglishNameMap.get(selectedLanguage));
                        }

                        autoCompleteTextView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
                            @Override
                            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                                audioPlayer.play(MainActivity.this, R.raw.sound_button_pressed);
                                selectedLanguage = languagesEnglishNameMap
                                        .get((String) parent.getItemAtPosition(position));
                                String pseudoId = prefs.getString("pseudoId", "");
                                String manifestVrsn = prefs.getString("manifestVersion", "");
                                AnalyticsUtils.logLanguageSelectEvent(view.getContext(), "language_selected", pseudoId,
                                        selectedLanguage, manifestVrsn, "false", "");

                                dialog.dismiss();
                                loadApps(selectedLanguage);
                            }
                        });
                    }
                }
            });

            gestureDetector = new GestureDetectorCompat(this, new GestureListener());
            if (invisibleBox != null) {
                invisibleBox.setOnTouchListener((v, event) -> {
                    gestureDetector.onTouchEvent(event); // Process the touch events with GestureDetector
                    return true;
                });
            }

            closeButton.setOnClickListener(new View.OnClickListener() {
                public void onClick(View v) {
                    audioPlayer.play(MainActivity.this, R.raw.sound_button_pressed);
                    AnimationUtil.scaleButton(v, new Runnable() {
                        @Override
                        public void run() {
                            textView.setVisibility(View.GONE);
                            dialog.dismiss();
                        }
                    });

                }

            });
            try {
            if (isFinishing() ||  isDestroyed()) {
                Log.w(TAG, "showLanguagePopup: Activity is finishing or destroyed, not showing dialog.");
                return;
            }
            dialog.show();
        } catch (Exception e) {
                FirebaseCrashlytics.getInstance().log("showLanguagePopup: Failed to show dialog");
                FirebaseCrashlytics.getInstance().recordException(
                        new RuntimeException("showLanguagePopup: Failed to show dialog", e)
                );
            Log.e(TAG, "showLanguagePopup: Failed to show dialog", e);
        }
        }
    }

    private Map<String, String> MapLanguagesEnglishName(List<WebApp> webApps) {
        Map<String, String> languagesEnglishNameMap = new TreeMap<>();
        for (WebApp webApp : webApps) {
            String languageInEnglishName = webApp.getLanguageInEnglishName();
            String languageInLocalName = webApp.getLanguage();
            if (languageInEnglishName != null && languageInLocalName != null) {
                languagesEnglishNameMap.put(languageInLocalName, languageInEnglishName);
                languagesEnglishNameMap.put(languageInEnglishName, languageInLocalName);
            }
        }
        return languagesEnglishNameMap;
    }

    private Set<String> sortLanguages(List<WebApp> webApps) {
        Map<String, List<String>> dialectGroups = new TreeMap<>();
        Map<String, String> languages = new TreeMap<>();
        for (WebApp webApp : webApps) {
            String languageInEnglishName = webApp.getLanguageInEnglishName();
            String languageInLocaName = webApp.getLanguage();
            languages.put(languageInEnglishName, languageInLocaName);
        }
        for (WebApp webApp : webApps) {
            String languageInEnglishName = webApp.getLanguageInEnglishName();
            String languageInLocalName = webApp.getLanguage();
            String[] parts = extractBaseLanguageAndDialect(languageInLocalName, languageInEnglishName);
            String baseLanguage = parts[0]; // The root language (e.g., "English", "Portuguese")
            String dialect = parts[1]; // The dialect (e.g., "US", "Brazilian")
            if (baseLanguage.contains("Kreyòl")) {
                dialectGroups.putIfAbsent("Creole" + baseLanguage, new ArrayList<>());
                dialectGroups.get("Creole" + baseLanguage).add(dialect);
            } else {
                dialectGroups.putIfAbsent(baseLanguage, new ArrayList<>());
                dialectGroups.get(baseLanguage).add(dialect);
            }
        }

        List<String> sortedLanguages = new ArrayList<>();
        for (Map.Entry<String, List<String>> entry : dialectGroups.entrySet()) {
            String baseLanguage = entry.getKey();
            List<String> dialects = entry.getValue();
            Collections.sort(dialects);
            for (String dialect : dialects) {
                if (languages.get(baseLanguage) == null || !languages.get(baseLanguage).equals(dialect)) {
                    if (baseLanguage.contains("Creole"))
                        sortedLanguages.add(baseLanguage.substring(6) + " - " + dialect);
                    else
                        sortedLanguages.add(baseLanguage + " - " + dialect);
                } else
                    sortedLanguages.add(dialect);
            }
        }

        return new LinkedHashSet<>(sortedLanguages);
    }

    private String[] extractBaseLanguageAndDialect(String languageInLocalName, String languageInEnglishName) {
        String baseLanguage = languageInEnglishName;
        String dialect = "";

        if (languageInLocalName.contains(" - ")) {
            String[] parts = languageInLocalName.split(" - ");
            baseLanguage = parts[0].trim();
            dialect = parts[1].trim();
        } else {
            baseLanguage = languageInEnglishName;
            dialect = languageInLocalName;
        }
        return new String[] { baseLanguage, dialect };
    }

    public void loadApps(String selectedlanguage) {
        Log.d(TAG, "loadApps: Loading apps for language: " + selectedLanguage);
        loadingIndicator.setVisibility(View.VISIBLE);
        final String language = selectedlanguage;
        homeViewModal.getSelectedlanguageWebApps(selectedlanguage).observe(this, new Observer<List<WebApp>>() {
            @Override
            public void onChanged(List<WebApp> webApps) {
                loadingIndicator.setVisibility(View.GONE);
                if (!webApps.isEmpty()) {
                    apps.webApps = webApps;
                    apps.notifyDataSetChanged();
                    storeSelectLanguage(language);
                } else {
                    if (!prefs.getString("selectedLanguage", "").equals("") && language.equals("")) {
                        showLanguagePopup();
                    }
                    if (manifestVersion.equals("")) {
                        if (!selectedlanguage.equals(isValidLanguage))
                            loadingIndicator.setVisibility(View.VISIBLE);
                        homeViewModal.getAllWebApps();
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
        updateDebugOverlay(); // Update overlay when language changes
    }

    private void cacheManifestVersion(String versionNumber) {
        if (versionNumber != null && versionNumber != "") {
            SharedPreferences.Editor editor = prefs.edit();
            editor.putString("manifestVersion", versionNumber);
            editor.apply();
            Log.d(TAG, "cacheManifestVersion: Cached manifest version: " + versionNumber);
            updateDebugOverlay(); // Update overlay when manifest version changes
        }
    }

    private boolean isInternetConnected(Context context) {
        return ConnectionUtils.getInstance().isInternetConnected(context);
    }

    private void updateDebugOverlay() {
        View offlineOverlay = findViewById(R.id.offline_mode_overlay);
        if (offlineOverlay != null) {
            // Don't change visibility here, let it be controlled by the trigger button
            
            // Initialize close button
            ImageButton closeButton = offlineOverlay.findViewById(R.id.debug_overlay_close);
            if (closeButton != null) {
                closeButton.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        offlineOverlay.setVisibility(View.GONE);
                        debugOverlayHandler.removeCallbacks(debugOverlayUpdater);
                    }
                });
            }
            StringBuilder debugInfo = new StringBuilder();

            // Basic Info Section
            boolean isOffline = !isInternetConnected(getApplicationContext());
            debugInfo.append("=== Basic Info ===\n");
            debugInfo.append("Offline Mode: ").append(isOffline).append("\n");
            debugInfo.append("App Version: ").append(appVersion).append("\n");
            debugInfo.append("Manifest Version: ").append(manifestVersion).append("\n");
            debugInfo.append("CR User ID: cr_user_id_").append(prefs.getString("pseudoId", "")).append("\n\n");

            // Referrer & Attribution Section
            debugInfo.append("=== Referrer & Attribution ===\n");
            if (currentReferrerStatus != null) {
                debugInfo.append("Referrer Status: ").append(currentReferrerStatus.state);
                if (currentReferrerStatus.state.equals("RETRYING")) {
                    debugInfo.append(" (Attempt ").append(currentReferrerStatus.currentAttempt)
                            .append("/").append(currentReferrerStatus.maxAttempts).append(")");
                }
                debugInfo.append("\n");

                // Show successful attempt number if available
                if (currentReferrerStatus.successfulAttempt > 0) {
                    debugInfo.append("Referrer Handled After: ").append(currentReferrerStatus.successfulAttempt)
                            .append(" attempt(s)\n");
                }

                if (currentReferrerStatus.lastError != null) {
                    debugInfo.append("Last Error: ").append(currentReferrerStatus.lastError).append("\n");
                }
            } else {
                debugInfo.append("Referrer Status: NOT_STARTED\n");
            }
            debugInfo.append("Referrer Handled: ").append(isReferrerHandled).append("\n");
            debugInfo.append("Attribution Complete: ").append(isAttributionComplete).append("\n");
            String deferredDeeplink = prefs.getString("deferred_deeplink", "");
            debugInfo.append("Deferred Deeplink: ").append(deferredDeeplink.isEmpty() ? "None" : deferredDeeplink)
                    .append("\n\n");

            // UTM Parameters Section
            debugInfo.append("=== UTM Parameters ===\n");
            debugInfo.append("Source: ").append(utmPrefs.getString("source", "None")).append("\n");
            debugInfo.append("Campaign ID: ").append(utmPrefs.getString("campaign_id", "None")).append("\n");
            debugInfo.append("Content: ").append(utmPrefs.getString("utm_content", "None")).append("\n\n");

            // Language Section
            debugInfo.append("=== Language Info ===\n");
            debugInfo.append("Selected Language: ").append(selectedLanguage.isEmpty() ? "None" : selectedLanguage)
                    .append("\n");
            debugInfo.append("Stored Language: ").append(prefs.getString("selectedLanguage", "None")).append("\n\n");

            // Events Section
            debugInfo.append("=== Events ===\n");
            debugInfo.append("Started In Offline Mode Event Sent: ").append(isOffline).append("\n");
            debugInfo.append("Initial Slack Alert Time: ").append(convertEpochToDate(initialSlackAlertTime))
                    .append("\n");
            debugInfo.append("Current Time: ").append(convertEpochToDate(AnalyticsUtils.getCurrentEpochTime()))
                    .append("\n");

            // Set the debug info
            TextView debugText = offlineOverlay.findViewById(R.id.debug_info);
            debugText.setText(debugInfo.toString());
        }
    }

    private void logStartedInOfflineMode() {
        AnalyticsUtils.logStartedInOfflineModeEvent(MainActivity.this,
                "started_in_offline_mode", prefs.getString("pseudoId", ""));
        updateDebugOverlay();
    }

    /**
     * Updates the monster animation based on FTM monster phase.
     * Shows egg monster if FTM is not downloaded, otherwise shows phase-appropriate monster.
     */
    private void updateMonsterAnimation(RiveAnimationView monsterView) {
        // Check if FTM is downloaded by checking if any FTM app is cached
        boolean isFtmDownloaded = isFtmDownloaded();
        
        if (!isFtmDownloaded) {
            // Show egg monster if FTM is not downloaded
            loadMonsterAnimation(monsterView, 0);
            Log.d(TAG, "updateMonsterAnimation: FTM not downloaded, showing egg monster");
            return;
        }
        
        // Get stored monster phase from SharedPreferences
        int monsterPhase = prefs.getInt("ftm_monster_phase", 0);
        loadMonsterAnimation(monsterView, monsterPhase);
        Log.d(TAG, "updateMonsterAnimation: Showing monster phase " + monsterPhase);
    }

    /**
     * Checks if Feed the Monster is downloaded by checking cache status
     */
    private boolean isFtmDownloaded() {
        // First check if we have the explicit flag
        if (prefs.getBoolean("ftm_downloaded", false)) {
            return true;
        }
        
        // Check if we have stored monster phase (indicates FTM was used before)
        int storedPhase = prefs.getInt("ftm_monster_phase", -1);
        if (storedPhase >= 0) {
            return true;
        }
        
        // Check if any FTM app is cached by checking app list
        if (homeViewModal != null && apps != null && apps.webApps != null) {
            for (WebApp webApp : apps.webApps) {
                if (webApp.getTitle() != null && webApp.getTitle().contains("Feed The Monster")) {
                    String appId = String.valueOf(webApp.getAppId());
                    boolean isCached = prefs.getBoolean(appId, false);
                    if (isCached) {
                        return true;
                    }
                }
            }
        }
        
        return false;
    }

    /**
     * Loads the appropriate Rive animation based on monster phase
     * Phase 0: Egg
     * Phase 1: Hatched (≥12 stars)
     * Phase 2: Young (≥38 stars)
     * Phase 3: Adult (≥63 stars)
     */
    private void loadMonsterAnimation(RiveAnimationView monsterView, int phase) {
        int riveResource;
        
        switch (phase) {
            case 0:
                riveResource = R.raw.eggmonster;
                break;
            case 1:
                riveResource = R.raw.hatchedmonster;
                break;
            case 2:
                riveResource = R.raw.youngmonster;
                break;
            case 3:
                riveResource = R.raw.adultmonster;
                break;
            default:
                riveResource = R.raw.eggmonster;
                break;
        }
        
        monsterView.setRiveResource(
                riveResource,
                null,               // artboard (null = default)
                null,               // animation (null = first)
                null,               // state machine
                true,               // autoplay
                Fit.CONTAIN,        // fit
                Alignment.CENTER,   // alignment
                Loop.LOOP           // loop mode
        );
    }

}
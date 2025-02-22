package org.curiouslearning.container;

import android.app.Application;
import android.app.Dialog;
import android.content.Context;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;
import android.os.RemoteException;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.ProgressBar;

import androidx.lifecycle.Observer;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.appcompat.app.AppCompatActivity;
import com.android.installreferrer.api.InstallReferrerClient;
import com.android.installreferrer.api.InstallReferrerStateListener;
import com.android.installreferrer.api.ReferrerDetails;
import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;
import com.facebook.appevents.iap.InAppPurchaseUtils;
import com.facebook.applinks.AppLinkData;
import com.google.android.material.textfield.TextInputLayout;
import com.google.firebase.FirebaseApp;

import org.curiouslearning.container.data.database.WebAppDao;
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
import org.curiouslearning.container.utilities.DeepLinkHelper;
import org.curiouslearning.container.utilities.AudioPlayer;
import org.curiouslearning.container.utilities.SlackUtils;

import java.math.BigInteger;
import java.net.URLDecoder;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import android.util.Log;
import android.content.Intent;

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
    private SharedPreferences utmPrefs;
    private SharedPreferences prefs;
    private String selectedLanguage;
    private String manifestVersion;
    private static final String TAG = "MainActivity";
    private AudioPlayer audioPlayer;
    private String appVersion;
    private InstallReferrerClient referrerClient;
    private boolean isReferrerHandled;
    private boolean isDataReceived;
    private boolean langCheck;
    private boolean isDebugApk;
    private Uri deepLinkUri;
    private String deferredURL;
    private long initialSlackAlertTime;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Turn this back to BuildConfig.DEBUG just in case if you want to have 
        // language selection button in debug only
        isDebugApk = true; //BuildConfig.DEBUG;
        prefs = getSharedPreferences(SHARED_PREFS_NAME, MODE_PRIVATE);
        utmPrefs = getSharedPreferences(UTM_PREFS_NAME, MODE_PRIVATE);
        isReferrerHandled = prefs.getBoolean(REFERRER_HANDLED_KEY, false);
        selectedLanguage = prefs.getString("selectedLanguage", "");
        langCheck = true;
        isDataReceived = false;
        initialSlackAlertTime= AnalyticsUtils.getCurrentEpochTime();
        InstallReferrerManager.ReferrerCallback referrerCallback = new InstallReferrerManager.ReferrerCallback() {
            @Override
            public void onReferrerReceived(String language, String fullURL) {
                // Handle referrer language received

                if (!isReferrerHandled ) {
                    if (isDataReceived == true ) {
                        System.out.println("return from playstore");
                        return;
                    }
                    if(language == null || language.length() ==0){
                        String pseudoId = prefs.getString("pseudoId", "");
                        long currentEpochTime = AnalyticsUtils.getCurrentEpochTime();
                        SlackUtils.sendMessageToSlack(MainActivity.this,"Language is not correct for google defeered deep link URL: "+fullURL+" , cr_user_id: "+pseudoId +" , currentTimestamp: "+convertEpochToDate(currentEpochTime)+ " , initialSlackAlertTime: "+convertEpochToDate(initialSlackAlertTime));
                        return;
                    }
                    String lang = Character.toUpperCase(language.charAt(0))
                            + language.substring(1).toLowerCase();
                    isDataReceived=true;
                    deferredURL = fullURL;
                    selectedLanguage = lang;
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            // if(!isDebugApk)
                                // settingsButton.setVisibility(View.GONE);
                            loadApps(lang);
                        }
                    });
                    SharedPreferences.Editor editor = prefs.edit();
                    editor.putBoolean(REFERRER_HANDLED_KEY, true);
                    editor.apply();
                    Log.d(TAG, "Referrer language received: " + language + " " + lang);
                }

            }
        };
        InstallReferrerManager installReferrerManager = new InstallReferrerManager(getApplicationContext(), referrerCallback);
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
        cachePseudoId();
        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        appVersion = AppUtils.getAppVersionName(this);
        manifestVersion = prefs.getString("manifestVersion", "");

        homeViewModal = new HomeViewModal((Application) getApplicationContext(), this);
        dialog = new Dialog(this);
        initRecyclerView();
        loadingIndicator = findViewById(R.id.loadingIndicator);
        loadingIndicator.setVisibility(View.GONE);
        Log.d(TAG, "onCreate: Selected language: " + selectedLanguage);
        Log.d(TAG, "onCreate: Manifest version: " + manifestVersion);
        if (manifestVersion != null && manifestVersion != "") {
            homeViewModal.getUpdatedAppManifest(manifestVersion);
        }
        settingsButton = findViewById(R.id.settings);
        // if( isDebugApk || selectedLanguage.length() == 0 || selectedLanguage ==null){
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
        // }
        // else{
        //     settingsButton.setVisibility(View.GONE);
        // }


        AppLinkData.fetchDeferredAppLinkData(this, new AppLinkData.CompletionHandler() {
            @Override
            public void onDeferredAppLinkDataFetched(AppLinkData appLinkData) {
                if (isDataReceived == true) {
                    System.out.println("return from facebook");
                    return;
                }
                String pseudoId = prefs.getString("pseudoId", "");
                String manifestVrsn = prefs.getString("manifestVersion", "");
                if (dialog != null && dialog.isShowing()) {
                    dialog.dismiss();
                    Log.d(TAG, "onDeferredAppLinkDataFetched: dialog is equal to null ");
                }
                Log.d(TAG, "onDeferredAppLinkDataFetched: AppLinkData: " + appLinkData);
                if (appLinkData != null) {
                    isDataReceived = true;
                    deepLinkUri = appLinkData.getTargetUri();
                    Log.d(TAG, "onDeferredAppLinkDataFetched: DeepLink URI: " + deepLinkUri);
                    String language = ((Uri) deepLinkUri).getQueryParameter("language");
                    String source = ((Uri) deepLinkUri).getQueryParameter("source");
                    String campaign_id = ((Uri) deepLinkUri).getQueryParameter("campaign_id");
                    SharedPreferences.Editor editor = utmPrefs.edit();
                    editor.putString("source", source);
                    editor.putString("campaign_id", campaign_id);
                    editor.apply();
                    Log.d(TAG, "onDeferredAppLinkDataFetched: Language Source CampaignId: " + language + " " + source
                            + " " + campaign_id +" "+isDebugApk);

                    if (language != null) {

                        deferredURL = String.valueOf(deepLinkUri);
                        String lang = Character.toUpperCase(language.charAt(0)) + language.substring(1).toLowerCase();
                        Log.d(TAG, "onDeferredAppLinkDataFetched: Language from deep link: " + lang);
                        selectedLanguage = lang;
                        storeSelectLanguage(lang);
                        AnalyticsUtils.storeReferrerParams(MainActivity.this, source, campaign_id);
                        AnalyticsUtils.logLanguageSelectEvent(MainActivity.this, "language_selected", pseudoId, lang,
                                manifestVrsn, "true");
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                // if(isDebugApk == false){
                                //     settingsButton = findViewById(R.id.settings);
                                //     settingsButton.setVisibility(View.GONE);
                                // }
                                loadApps(lang);
                            }
                        });
                    }else{
                        long currentEpochTime = AnalyticsUtils.getCurrentEpochTime();
                        SlackUtils.sendMessageToSlack(MainActivity.this,"Language is null for Facebook defereed deep link URL: "+deepLinkUri+" , cr_user_id: "+pseudoId +" , currentTimestamp: "+convertEpochToDate(currentEpochTime)+ " , initialSlackAlertTime: "+convertEpochToDate(initialSlackAlertTime));
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

        // settingsButton = findViewById(R.id.settings);
        // if(selectedLanguage ==null){
        //     settingsButton.setOnClickListener(new View.OnClickListener() {
        //         @Override
        //         public void onClick(View view) {
        //             audioPlayer.play(MainActivity.this, R.raw.sound_button_pressed);
        //             AnimationUtil.scaleButton(view, new Runnable() {
        //                 @Override
        //                 public void run() {

        //                     showLanguagePopup();
        //                 }
        //             });
        //         }
        //     });
        // }else{
        //     settingsButton.setVisibility(View.GONE);
        // }
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
    public static String convertEpochToDate(long epochTimeMillis) {
        Instant instant = Instant.ofEpochMilli(epochTimeMillis);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM yyyy hh:mm a")
                                                       .withZone(ZoneId.systemDefault());
        return formatter.format(instant);
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

    private void showLanguagePopup() {
        if (!dialog.isShowing()) {
            dialog.setContentView(R.layout.language_popup);

            dialog.setCanceledOnTouchOutside(false);
            dialog.getWindow().setBackgroundDrawable(null);
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
                                        selectedLanguage, manifestVrsn, "false");
                                dialog.dismiss();
                                // if(!isDebugApk)
                                //     settingsButton.setVisibility(View.GONE);
                                loadApps(selectedLanguage);
                            }
                        });
                    }
                }
            });

            closeButton.setOnClickListener(new View.OnClickListener() {
                public void onClick(View v) {
                    audioPlayer.play(MainActivity.this, R.raw.sound_button_pressed);
                    AnimationUtil.scaleButton(v, new Runnable() {
                        @Override
                        public void run() {
                            dialog.dismiss();
                        }
                    });

                }

            });
            dialog.show();
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
            String baseLanguage = parts[0];  // The root language (e.g., "English", "Portuguese")
            String dialect = parts[1];       // The dialect (e.g., "US", "Brazilian")
            if(baseLanguage.contains("Kreyòl")){
                dialectGroups.putIfAbsent("Creole"+baseLanguage, new ArrayList<>());
                dialectGroups.get("Creole"+baseLanguage).add(dialect);
            }else {
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
                if(languages.get(baseLanguage) == null || !languages.get(baseLanguage).equals(dialect)) {
                    if (baseLanguage.contains("Creole"))
                        sortedLanguages.add(baseLanguage.substring(6) + " - " + dialect);
                    else
                        sortedLanguages.add(baseLanguage+ " - " + dialect);
                }
                else
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
        return new String[]{baseLanguage, dialect};
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
                    langCheck = true;
                    apps.webApps = webApps;
                    apps.notifyDataSetChanged();
                    storeSelectLanguage(language);
                } else {
                    if (!prefs.getString("selectedLanguage", "").equals("") && language.equals("")) {
                        // settingsButton.setVisibility(View.VISIBLE);
                        showLanguagePopup();
                    } else if (manifestVersion.equals("") && langCheck) {
                        langCheck = false;
                        loadingIndicator.setVisibility(View.VISIBLE);
                        homeViewModal.getAllWebApps();
                    } else {
                        if(deferredURL!=null){
                            String pseudoId = prefs.getString("pseudoId", "");
                            long currentEpochTime = AnalyticsUtils.getCurrentEpochTime();
                            SlackUtils.sendMessageToSlack(MainActivity.this,"Language is not correct for defeered deep link URL: "+deferredURL+" , cr_user_id: "+pseudoId +" , currentTimestamp: "+convertEpochToDate(currentEpochTime)+ " , initialSlackAlertTime: "+convertEpochToDate(initialSlackAlertTime));
                        }
                        // settingsButton.setVisibility(View.VISIBLE);
                        showLanguagePopup();
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
    }

    private void cacheManifestVersion(String versionNumber) {
        if (versionNumber != null && versionNumber != "") {
            SharedPreferences.Editor editor = prefs.edit();
            editor.putString("manifestVersion", versionNumber);
            editor.apply();
            Log.d(TAG, "cacheManifestVersion: Cached manifest version: " + versionNumber);
        }
    }

    // private void loadFallbackWebApps() {
    // homeViewModal.getSelectedlanguageWebApps("English").observe(this, new
    // Observer<List<WebApp>>() {
    // @Override
    // public void onChanged(List<WebApp> fallbackWebApps) {
    // loadingIndicator.setVisibility(View.GONE);
    // apps.webApps = fallbackWebApps;
    // apps.notifyDataSetChanged();
    // storeSelectLanguage("English");
    // // Remove the observer after receiving the initial fallback web apps
    // homeViewModal.getSelectedlanguageWebApps("English").removeObserver(this);
    // }
    // });
    // }

    // private void showPrompt(String message) {
    // if (!isFinishing()) {
    // AlertDialog.Builder builder = new AlertDialog.Builder(this);
    // builder.setMessage(message)
    // .setCancelable(false)
    // .setPositiveButton("OK", new DialogInterface.OnClickListener() {
    // public void onClick(DialogInterface dialog, int id) {
    // finish();
    // if (prefs.getString("selectedLanguage", "").equals("")) {
    // showLanguagePopup();
    // } else {
    // loadApps("English");
    // }
    // }
    // });
    // AlertDialog alert = builder.create();
    // alert.show();
    // }
    // }

}
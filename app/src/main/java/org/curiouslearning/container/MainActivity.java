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

import java.math.BigInteger;
import java.net.URLDecoder;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Calendar;
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
    private SharedPreferences prefs;
    private String selectedLanguage;
    private String manifestVersion;
    private static final String TAG = "MainActivity";
    private AudioPlayer audioPlayer;
    private String appVersion;
    private InstallReferrerClient referrerClient;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        InstallReferrerManager installReferrerManager = new InstallReferrerManager(this);
        installReferrerManager.checkPlayStoreAvailability();
        audioPlayer = new AudioPlayer();
        FirebaseApp.initializeApp(this);
        FacebookSdk.fullyInitialize();
        Log.d(TAG, "onCreate: Initializing MainActivity and FacebookSdk");
        AppEventsLogger.activateApp(getApplication());
        handleReferrerData();
        cachePseudoId();
        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        appVersion = AppUtils.getAppVersionName(this);
        prefs = getSharedPreferences(SHARED_PREFS_NAME, MODE_PRIVATE);
        selectedLanguage = prefs.getString("selectedLanguage", "");
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
 
        AppLinkData.fetchDeferredAppLinkData(this, new AppLinkData.CompletionHandler() {
            @Override
            public void onDeferredAppLinkDataFetched(AppLinkData appLinkData) {
                Intent intent = getIntent();
                String pseudoId = prefs.getString("pseudoId", "");
                String manifestVrsn = prefs.getString("manifestVersion", "");
                if (dialog != null && dialog.isShowing()) {
                    dialog.dismiss();
                    Log.d(TAG, "onDeferredAppLinkDataFetched: dialog is equal to null ");
                }
                Log.d(TAG, "onDeferredAppLinkDataFetched: AppLinkData: " + appLinkData);
                if (appLinkData != null) {
                    Uri deepLinkUri = appLinkData.getTargetUri();
                    Log.d(TAG, "onDeferredAppLinkDataFetched: DeepLink URI: " + deepLinkUri);
                    String language = ((Uri) deepLinkUri).getQueryParameter("language");
                    if (language != null) {
                        String lang = Character.toUpperCase(language.charAt(0)) + language.substring(1).toLowerCase();
                        Log.d(TAG, "onDeferredAppLinkDataFetched: Language from deep link: " + lang);
                        // Store the selected language
                        selectedLanguage = lang;

                        AnalyticsUtils.logLanguageSelectEvent(MainActivity.this, "language_selected", pseudoId, lang,
                                manifestVrsn, "true");

                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                loadApps(lang);
                            }
                        });
                    }
                } else if (intent != null && Intent.ACTION_VIEW.equals(intent.getAction())) {
                    Uri data = intent.getData();
                    Log.d(TAG, "onDeferredAppLinkDataFetched: intent URI: " + data);
                    if (data != null) {
                        String language = data.getQueryParameter("language");
                        if (language != null) {
                            String lang = Character.toUpperCase(language.charAt(0))
                                    + language.substring(1).toLowerCase();
                            Log.d(TAG, "onDeferredAppLinkDataFetched: Language from intent data: " + lang);
                            // Store the selected language
                            selectedLanguage = lang;

                            AnalyticsUtils.logLanguageSelectEvent(MainActivity.this, "language_selected", pseudoId,
                                    lang, manifestVrsn, "true");

                            runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    loadApps(lang);
                                }
                            });
                        }
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

        settingsButton = findViewById(R.id.settings);
        settingsButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                audioPlayer.play(MainActivity.this, R.raw.sound_button_pressed);
                AnimationUtil.scaleButton(view, new Runnable() {
                    @Override
                    public void run() {
                        showLanguagePopup();
                    }
                });
            }
        });
    }
    private void handleReferrerData() {
        if (getIntent()!=null)
        handleIntent(getIntent());
    referrerClient = InstallReferrerClient.newBuilder(this).build();
    referrerClient.startConnection(new InstallReferrerStateListener() {
        @Override
        public void onInstallReferrerSetupFinished(int responseCode) {
            switch (responseCode) {
                case InstallReferrerClient.InstallReferrerResponse.OK:
                    try {
                        ReferrerDetails response = referrerClient.getInstallReferrer();
                        String referrerUrl = response.getInstallReferrer();
                        // String referrerUrl="referrer=utm_source%3Dfacebook%26utm_medium%3Dprint%26utm_campaign%3D120208084211250195%26deferred_deeplink%3Dcuriousreader%3A%2F%2Fapp%3Flanguage%3Dhindi";
                        String decodedReferrerUrl = URLDecoder.decode(referrerUrl, "UTF-8");
                        long referrerClickTime = response.getReferrerClickTimestampSeconds();
                        long appInstallTime = response.getInstallBeginTimestampSeconds();
                        boolean instantExperienceLaunched = response.getGooglePlayInstantParam();
                        Log.d(TAG, ">>>>>reponse " + response);
                        Log.d(TAG, ">>>>>referrerClickTime " + referrerClickTime);
                        Log.d(TAG, ">>>>>appInstallTime " + appInstallTime);
                        Log.d(TAG, ">>>>>instantExperienceLaunched " + instantExperienceLaunched);
                        Log.d(TAG, ">>>>>referrerUrl " + referrerUrl);
                        Log.d(TAG, ">>>>>decodedReferrerUrl " + decodedReferrerUrl);
                        if (referrerUrl != null) {
                            System.out.println("referrerURL>>>");
                            String language = getLanguageFromReferrer(referrerUrl);
                            if (language != null) {
                                // Apply the language setting in your app
                                System.out.println("language>>>>>>"+language);
                                applyLanguageSetting(language);
                            }
                        }
                        saveReferrerInfo(decodedReferrerUrl);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    break;
                case InstallReferrerClient.InstallReferrerResponse.FEATURE_NOT_SUPPORTED:
                    Log.d(TAG, ">>>>> InstallReferrer feature not supported error " );
                    break;
                case InstallReferrerClient.InstallReferrerResponse.SERVICE_UNAVAILABLE:
                    Log.d(TAG, ">>>>>InstallReferrer service unavailable error ");
                    break;
            }
        }

        @Override
        public void onInstallReferrerServiceDisconnected() {
            // Try to restart the connection on the next request to Google Play by calling
            Log.d(TAG, ">>>>>InstallReferrer service disconnected error ");
        }
    });
    }
    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        // Handle the intent when the app is already running
        setIntent(intent);
        handleIntent(intent);
    }

    private void handleIntent(Intent intent) {
        System.out.println("uri>>>>>  " + intent);
        if (Intent.ACTION_VIEW.equals(intent.getAction())) {
            Uri uri = intent.getData();
            System.out.println("uri>>>>>  " + uri);
            String referrer = uri.getQueryParameter("referrer");
            getLanguageFromReferrer(referrer);
        }
    }

    private void saveReferrerInfo(String referrerUrl) {

        // Save the referrer URL in SharedPreferences or any other persistent storage
        SharedPreferences sharedPreferences = getSharedPreferences("app_prefs", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putString("referrer_url", referrerUrl);
        editor.apply();
        getLanguageFromReferrer(referrerUrl);
    }

    private String getLanguageFromReferrer(String referrerUrl) {
        try {
            // Decode the referrer URL
            String decodedReferrerUrl = URLDecoder.decode(referrerUrl, "UTF-8");
            System.out.println("Decoded referrerUrl: " + decodedReferrerUrl);
            // Parse the parameters into a map
            Map<String, String> params = getQueryMap(decodedReferrerUrl);
            String deferredDeeplink = params.get("deferred_deeplink");
            if (deferredDeeplink != null) {
                // Parse the deferred_deeplink parameters
                Map<String, String> deeplinkParams = getQueryMap(deferredDeeplink.replace("curiousreader://app?", ""));
                String language = deeplinkParams.get("language");
                if (language != null) {
                    System.out.println("Language: " + language);
                    return language;
                } else {
                    System.out.println("Language parameter not found.");
                    return "";
                }
            } else {
                System.out.println("deferred_deeplink parameter not found.");
                return "";
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "";
    }

    public static Map<String, String> getQueryMap(String query) {
        Map<String, String> map = new HashMap<>();
        String[] params = query.split("&");
        for (String param : params) {
            System.out.println(">>>>param  "+param);
            String[] keyValue = param.split("=");
            if (keyValue.length == 2) {
                System.out.println(">>>>key value  "+keyValue[0]+"  "+ keyValue[1]);
                map.put(keyValue[0], keyValue[1]);
            }else if (keyValue.length > 2) {
                // If there are more than two parts, concatenate the rest as the value
                String key = keyValue[0];
                StringBuilder value = new StringBuilder(keyValue[1]);
                for (int i = 2; i < keyValue.length; i++) {
                    value.append("=").append(keyValue[i]);
                }
                map.put(key, value.toString());
            }
        }
        return map;
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

    @Override
    public void onResume() {
        super.onResume();
        recyclerView.setAdapter(apps);
    }

    private void applyLanguageSetting(String language) {
        System.out.println("this is the language >> " + language);
        String lang = Character.toUpperCase(language.charAt(0))
                + language.substring(1).toLowerCase();
        Log.d(TAG, "onDeferredAppLinkDataFetched: Language from intent data: " + lang);
        // Store the selected language
        selectedLanguage = lang;
        String pseudoId = prefs.getString("pseudoId", "");
        String manifestVrsn = prefs.getString("manifestVersion", "");
        AnalyticsUtils.logLanguageSelectEvent(MainActivity.this, "language_selected", pseudoId,
                lang, manifestVrsn, "true");

        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                loadApps(lang);
            }
        });
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

    private Set sortLanguages(List<WebApp> webApps) {
        List<String> langList = new ArrayList<>();
        Map<String, String> languages = new TreeMap<>();
        for (WebApp webApp : webApps) {
            String languageInEnglishName = webApp.getLanguageInEnglishName();
            String languageInLocaName = webApp.getLanguage();
            languages.put(languageInEnglishName, languageInLocaName);
        }
        for (Map.Entry<String, String> entry : languages.entrySet()) {
            langList.add(entry.getValue());
        }
        return new LinkedHashSet<>(langList);
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
                    if (!prefs.getString("selectedLanguage", "").equals("") && !language.equals("")) {
                        showLanguagePopup();
                    }
                    if (manifestVersion.equals("")) {
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
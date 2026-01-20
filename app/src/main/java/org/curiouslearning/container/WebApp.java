package org.curiouslearning.container;

import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.ActivityInfo;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.webkit.ConsoleMessage;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ImageView;

import androidx.appcompat.app.AlertDialog;

import org.curiouslearning.container.firebase.AnalyticsUtils;
import org.curiouslearning.container.presentation.base.BaseActivity;
import org.curiouslearning.container.utilities.ConnectionUtils;
import org.curiouslearning.container.utilities.AudioPlayer;
import io.sentry.Sentry;

public class WebApp extends BaseActivity {

    private String title;
    private String appUrl;

    private WebView webView;
    private SharedPreferences sharedPref;
    private SharedPreferences utmPrefs;
    private String urlIndex;
    private String language;
    private String languageInEnglishName;
    private String pseudoId;
    private boolean isDataCached;
    private String source;
    private String campaignId;

    private static final String SHARED_PREFS_NAME = "appCached";
    private static final String UTM_PREFS_NAME = "utmPrefs";
    private AudioPlayer audioPlayer;
    ImageView goBack;
    private android.os.Handler monsterStateCheckHandler;
    private Runnable monsterStateCheckRunnable;
    private boolean isFtmApp;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        audioPlayer = new AudioPlayer();
        setContentView(R.layout.activity_web_app);
        getIntentData();
        initViews();
        logAppLaunchEvent();
        loadWebView();
    }

    private void getIntentData() {
        Intent intent = getIntent();
        if (intent != null) {
            urlIndex = intent.getStringExtra("appId");
            title = intent.getStringExtra("title");
            appUrl = intent.getStringExtra("appUrl");
            language = intent.getStringExtra("language");
            languageInEnglishName = intent.getStringExtra("languageInEnglishName");
        }
    }

    private void initViews() {
        sharedPref = getApplicationContext().getSharedPreferences(SHARED_PREFS_NAME, Context.MODE_PRIVATE);
        utmPrefs = getApplicationContext().getSharedPreferences(UTM_PREFS_NAME, Context.MODE_PRIVATE);
        isDataCached = sharedPref.getBoolean(String.valueOf(urlIndex), false);
        pseudoId = sharedPref.getString("pseudoId", "");
        source = utmPrefs.getString("source", "");
        campaignId = utmPrefs.getString("campaign_id", "");
        goBack = findViewById(R.id.button2);
        goBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                logAppExitEvent();
                audioPlayer.play(WebApp.this, R.raw.sound_button_pressed);
                finish();
            }
        });
    }

    private void loadWebView() {
        if (!isInternetConnected(getApplicationContext()) && !isDataCached) {
            showPrompt("Please Connect to the Network");
            return;
        }

        webView = findViewById(R.id.web_app);
        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
        webView.setHorizontalScrollBarEnabled(false);

        // Check if this is FTM app
        isFtmApp = appUrl.contains("feedthemonster");

        // Create custom WebViewClient for FTM to handle monster state API
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                // Query monster evolution state when FTM loads
                if (isFtmApp) {
                    // Wait a bit for the API to be ready, then query
                    view.postDelayed(new Runnable() {
                        @Override
                        public void run() {
                            queryMonsterEvolutionState(view);
                            // Start periodic checks for phase updates during gameplay
                            startPeriodicMonsterStateCheck(view);
                        }
                    }, 2000); // Wait 2 seconds for FTM to initialize
                }
            }
        });

        webView.getSettings().setDomStorageEnabled(true);
        webView.getSettings().getDomStorageEnabled();
        webView.getSettings().setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK);
        webView.getSettings().setJavaScriptEnabled(true);
        webView.addJavascriptInterface(new WebAppInterface(this), "Android");
        if (isFtmApp) {
            System.out
                    .println(">> url source and campaign params added to the subapp url " + source + " " + campaignId);
            if (source != null && !source.isEmpty()) {
                appUrl = addSourceToUrl(appUrl);
            } else {
                Sentry.captureMessage("Missing source when building URL for app: " + appUrl);
                Log.w("WebApp", "Missing source parameter for app: " + appUrl);
            }
            if (campaignId != null && !campaignId.isEmpty()) {
                appUrl = addCampaignIdToUrl(appUrl);
            } else {
                Sentry.captureMessage("Missing campaign_id when building URL for app: " + appUrl);
                Log.w("WebApp", "Missing campaign_id parameter for app: " + appUrl);
            }
        }
        if (appUrl.contains("docs.google.com/forms")) {
            webView.loadUrl(addCrUserIdToFormUrl(appUrl));
        } else if (appUrl.contains("welcome_parent_video")) {
            goBack.setVisibility(View.GONE);
            webView.loadUrl(addCrUserIdToUrl(appUrl));
        } else {
            webView.loadUrl(addCrUserIdToUrl(appUrl));
        }
        System.out.println("subapp url : " + appUrl);
        webView.setWebChromeClient(new WebChromeClient() {
            public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
                Log.d("WebView", consoleMessage.message());
                return true;
            }
        });
    }

    private String addCrUserIdToUrl(String appUrl) {
        Uri originalUri = Uri.parse(appUrl);
        String separator = (originalUri.getQuery() == null) ? "?" : "&";
        String modifiedUrl = originalUri.toString() + separator + "cr_user_id=" +
                pseudoId;
        if (pseudoId == null || pseudoId.isEmpty()) {
            Sentry.captureMessage("Missing cr_user_id for app: " + appUrl);
            Log.e("WebApp", "Missing cr_user_id when building URL");
        }
        return modifiedUrl;
    }

    private String addCrUserIdToFormUrl(String appUrl) {
        Uri originalUri = Uri.parse(appUrl);
        String separator = (originalUri.getQuery() == null) ? "?" : "&";
        String modifiedUrl = originalUri.toString() + pseudoId + separator +
                "cr_user_id=" + pseudoId;
        return modifiedUrl;
    }

    private String addSourceToUrl(String appUrl) {
        Uri originalUri = Uri.parse(appUrl);
        String separator = (originalUri.getQuery() == null) ? "?" : "&";
        String modifiedUrl = originalUri.toString() + separator + "source=" + source;
        return modifiedUrl;
    }

    private String addCampaignIdToUrl(String appUrl) {
        Uri originalUri = Uri.parse(appUrl);
        String separator = (originalUri.getQuery() == null) ? "?" : "&";
        String modifiedUrl = originalUri.toString() + separator + "campaign_id=" +
                campaignId;
        return modifiedUrl;
    }

    private boolean isInternetConnected(Context context) {
        return ConnectionUtils.getInstance().isInternetConnected(context);
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

    public class WebAppInterface {
        private Context mContext;

        WebAppInterface(Context context) {
            mContext = context;
        }

        @JavascriptInterface
        public void cachedStatus(boolean dataCachedStatus) {
            SharedPreferences.Editor editor = sharedPref.edit();
            editor.putBoolean(String.valueOf(urlIndex), dataCachedStatus);
            editor.commit();

            if (!isInternetConnected(getApplicationContext()) && dataCachedStatus) {
                showPrompt("Please Connect to the Network");
            }
        }

        @JavascriptInterface
        public void setContainerAppOrientation(String orientationType) {
            Log.d("WebView", "Orientation value received from webapp " + appUrl + "--->" + orientationType);

            if (orientationType != null && !orientationType.isEmpty()) {
                setAppOrientation(orientationType);
            } else {
                Log.e("WebView", "Invalid orientation value received from webapp " + appUrl);
            }
        }

        @JavascriptInterface
        public void closeWebView() {
            goBack.setVisibility(View.GONE);
            logAppExitEvent();
            audioPlayer.play(WebApp.this, R.raw.sound_button_pressed);
            finish();
        }

        @JavascriptInterface
        public void onMonsterEvolutionStateReceived(String jsonState) {
            Log.d("WebApp", "Monster evolution state received: " + jsonState);

            try {
                // Parse JSON string
                org.json.JSONObject stateJson = new org.json.JSONObject(jsonState);
                String app = stateJson.optString("app", "");
                int monsterPhase = stateJson.optInt("monsterPhase", 0);
                int successStars = stateJson.optInt("successStars", 0);
                boolean hasError = stateJson.has("error");

                if ("feed_the_monster".equals(app) && !hasError) {
                    // Store monster phase per language using a map structure
                    storeMonsterPhaseForLanguage(languageInEnglishName, monsterPhase, successStars,
                            stateJson.optLong("timestamp", System.currentTimeMillis()));

                    // Also set global downloaded flag
                    SharedPreferences.Editor editor = sharedPref.edit();
                    editor.putBoolean("ftm_downloaded", true);
                    editor.apply();

                    Log.d("WebApp", "Stored monster phase for language '" + languageInEnglishName +
                            "': phase=" + monsterPhase + ", stars=" + successStars);
                } else if (hasError) {
                    Log.w("WebApp", "Monster state not ready: " + stateJson.optString("error", "UNKNOWN"));
                }
            } catch (org.json.JSONException e) {
                Log.e("WebApp", "Error parsing monster evolution state JSON", e);
            }
        }

        /**
         * Stores monster phase for a specific language in a JSON map structure
         */
        private void storeMonsterPhaseForLanguage(String language, int phase, int successStars, long timestamp) {
            try {
                // Get existing map or create new one
                String mapJson = sharedPref.getString("ftm_monster_phases_map", "{}");
                org.json.JSONObject phasesMap = new org.json.JSONObject(mapJson);

                // Create or update entry for this language
                org.json.JSONObject languageData = new org.json.JSONObject();
                languageData.put("monsterPhase", phase);
                languageData.put("successStars", successStars);
                languageData.put("timestamp", timestamp);

                phasesMap.put(language, languageData);

                // Store updated map
                SharedPreferences.Editor editor = sharedPref.edit();
                editor.putString("ftm_monster_phases_map", phasesMap.toString());
                editor.apply();

                Log.d("WebApp", "Updated monster phase map for language: " + language);
            } catch (org.json.JSONException e) {
                Log.e("WebApp", "Error storing monster phase for language: " + language, e);
            }
        }
    }

    /**
     * Queries the monster evolution state from FTM using the
     * getMonsterEvolutionState() API
     */
    private void queryMonsterEvolutionState(WebView webView) {
        String javascript = "(function() {" +
                "  try {" +
                "    if (typeof window.getMonsterEvolutionState === 'function') {" +
                "      var state = window.getMonsterEvolutionState();" +
                "      if (state && window.Android && window.Android.onMonsterEvolutionStateReceived) {" +
                "        window.Android.onMonsterEvolutionStateReceived(JSON.stringify(state));" +
                "        console.log('Monster evolution state sent to Android:', state);" +
                "        return true;" +
                "      }" +
                "    } else {" +
                "      console.log('getMonsterEvolutionState API not available yet');" +
                "    }" +
                "    return false;" +
                "  } catch (e) {" +
                "    console.error('Error getting monster evolution state: ' + e.message);" +
                "    return false;" +
                "  }" +
                "})();";

        webView.evaluateJavascript(javascript, null);
    }

    /**
     * Starts periodic checking of monster evolution state while FTM is open
     */
    private void startPeriodicMonsterStateCheck(WebView webView) {
        if (monsterStateCheckHandler == null) {
            monsterStateCheckHandler = new android.os.Handler(android.os.Looper.getMainLooper());
        }

        monsterStateCheckRunnable = new Runnable() {
            @Override
            public void run() {
                if (webView != null && isFtmApp) {
                    queryMonsterEvolutionState(webView);
                    // Check every 5 seconds for phase updates
                    monsterStateCheckHandler.postDelayed(this, 5000);
                }
            }
        };

        // Start checking after initial delay
        monsterStateCheckHandler.postDelayed(monsterStateCheckRunnable, 5000);
    }

    @Override
    protected void onPause() {
        super.onPause();
        // Stop periodic state checks when leaving FTM
        if (monsterStateCheckHandler != null && monsterStateCheckRunnable != null) {
            monsterStateCheckHandler.removeCallbacks(monsterStateCheckRunnable);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        // Resume periodic state checks if FTM is open
        if (webView != null && isFtmApp) {
            startPeriodicMonsterStateCheck(webView);
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        // Stop periodic state checks
        if (monsterStateCheckHandler != null && monsterStateCheckRunnable != null) {
            monsterStateCheckHandler.removeCallbacks(monsterStateCheckRunnable);
        }
    }

    public void setAppOrientation(String orientationType) {
        int currentOrientation = getRequestedOrientation();
        if (orientationType.equalsIgnoreCase("portrait")
                && (currentOrientation != ActivityInfo.SCREEN_ORIENTATION_PORTRAIT)) {
            setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
            Log.d("WebView", "Orientation Changed to Portarit for webApp ---> " + title);
        } else if (orientationType.equalsIgnoreCase("landscape")
                && (currentOrientation != ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE)) {
            setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
            Log.d("WebView", "Orientation Changed to Landscape for webApp ---> " + title);
        }
    }

    // log firebase Event
    public void logAppLaunchEvent() {
        AnalyticsUtils.logEvent(this, "app_launch", title, appUrl, pseudoId, languageInEnglishName);

    }

    public void logAppExitEvent() {
        AnalyticsUtils.logEvent(this, "app_exit", title, appUrl, pseudoId, languageInEnglishName);
    }
}

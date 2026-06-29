package org.curiouslearning.container.presentation.webapp;

import org.curiouslearning.container.R;

import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.ActivityInfo;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.webkit.ConsoleMessage;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ImageView;

import androidx.appcompat.app.AlertDialog;
import org.curiouslearning.container.firebase.AnalyticsUtils;
import org.curiouslearning.container.presentation.base.BaseActivity;
import org.curiouslearning.container.util.ConnectionUtils;
import org.curiouslearning.container.util.AudioPlayer;

public class WebAppActivity extends BaseActivity implements WebAppJsBridge.WebAppBridgeListener {

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
    private boolean isFtmApp;

    private MonsterStateManager monsterStateManager;

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
                audioPlayer.play(WebAppActivity.this, R.raw.sound_button_pressed);
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

        isFtmApp = appUrl.contains("feedthemonster");
        
        monsterStateManager = new MonsterStateManager(this, webView, sharedPref, language, languageInEnglishName, isFtmApp);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                if (isFtmApp) {
                    view.postDelayed(new Runnable() {
                        @Override
                        public void run() {
                            monsterStateManager.queryMonsterEvolutionState();
                            monsterStateManager.startPeriodicMonsterStateCheck();
                        }
                    }, 2000);
                }
            }
        });

        webView.getSettings().setDomStorageEnabled(true);
        webView.getSettings().getDomStorageEnabled();
        webView.getSettings().setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK);
        webView.getSettings().setJavaScriptEnabled(true);
        
        WebAppJsBridge jsBridge = new WebAppJsBridge(this, this);
        webView.addJavascriptInterface(jsBridge, "Android");
        
        appUrl = UrlBuilder.buildUrl(appUrl, pseudoId, source, campaignId, isFtmApp);

        if (appUrl.contains("welcome_parent_video")) {
            goBack.setVisibility(View.GONE);
        }

        webView.loadUrl(appUrl);
        Log.d("WebApp", "Loading subapp url: " + appUrl);
        
        webView.setWebChromeClient(new WebChromeClient() {
            public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
                Log.d("WebView", consoleMessage.message());
                return true;
            }
        });
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

    @Override
    public void onCachedStatusReceived(boolean dataCachedStatus) {
        SharedPreferences.Editor editor = sharedPref.edit();
        editor.putBoolean(String.valueOf(urlIndex), dataCachedStatus);
        editor.apply();

        if (!isInternetConnected(getApplicationContext()) && dataCachedStatus) {
            runOnUiThread(() -> showPrompt("Please Connect to the Network"));
        }
    }

    @Override
    public void onOrientationRequested(String orientationType) {
        runOnUiThread(() -> {
            Log.d("WebView", "Orientation value received from webapp " + appUrl + "--->" + orientationType);
            if (orientationType != null && !orientationType.isEmpty()) {
                setAppOrientation(orientationType);
            } else {
                Log.e("WebView", "Invalid orientation value received from webapp " + appUrl);
            }
        });
    }

    @Override
    public void onCloseRequested() {
        runOnUiThread(() -> {
            goBack.setVisibility(View.GONE);
            logAppExitEvent();
            audioPlayer.play(WebAppActivity.this, R.raw.sound_button_pressed);
            finish();
        });
    }

    @Override
    public void onMonsterEvolutionStateReceived(String jsonState) {
        if (monsterStateManager != null) {
            monsterStateManager.onMonsterEvolutionStateReceived(jsonState);
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        if (monsterStateManager != null) {
            monsterStateManager.stopPeriodicMonsterStateCheck();
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (monsterStateManager != null) {
            monsterStateManager.onResume();
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (monsterStateManager != null) {
            monsterStateManager.stopPeriodicMonsterStateCheck();
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

    public void logAppLaunchEvent() {
        AnalyticsUtils.logEvent(this, "app_launch", title, appUrl, pseudoId, languageInEnglishName);
    }

    public void logAppExitEvent() {
        AnalyticsUtils.logEvent(this, "app_exit", title, appUrl, pseudoId, languageInEnglishName);
    }
}

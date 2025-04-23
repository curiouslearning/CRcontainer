package org.curiouslearning.container;

import static org.curiouslearning.container.MainActivity.activity_id;

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

import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;

import org.curiouslearning.container.firebase.AnalyticsUtils;
import org.curiouslearning.container.presentation.base.BaseActivity;
import org.curiouslearning.container.utilities.ConnectionUtils;
import org.curiouslearning.container.utilities.AudioPlayer;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Iterator;

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
    private static final String TAG = "WebApp";


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
            appUrl = "https://ibiza-stage-ftm-respect-dev.firebaseapp.com/";
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
        ImageView goBack = findViewById(R.id.button2);
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
        webView.setWebViewClient(new WebViewClient());
        webView.getSettings().setDomStorageEnabled(true);
        webView.getSettings().getDomStorageEnabled();
        webView.getSettings().setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK);
        webView.getSettings().setJavaScriptEnabled(true);
        webView.addJavascriptInterface(new WebAppInterface(this), "Android");
        if (appUrl.contains("feedthemonster")) {
            System.out
                    .println(">> url source and campaign params added to the subapp url " + source + " " + campaignId);
            if (source != null && !source.isEmpty()) {
                appUrl = addSourceToUrl(appUrl);
            }
            if (campaignId != null && !campaignId.isEmpty()) {
                appUrl = addCampaignIdToUrl(appUrl);
            }
        }

       webView.loadUrl(addCrUserIdToUrl(appUrl));
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
        String modifiedUrl = originalUri.toString() + separator + "cr_user_id=" + pseudoId;
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
        String modifiedUrl = originalUri.toString() + separator + "campaign_id=" + campaignId;
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

    public void sendDataToJS(String key, @Nullable JSONObject tempData) {
        try {
            String jsonString;

            if (tempData != null) {
                // tempData is basically to send normal data from java to javascript
                jsonString = tempData.toString();
            } else {
                // otherwise fallback to SharedPreferences if no tempData provided
                jsonString = sharedPref.getString(key, "{}");
            }

            final String jsCode = "window.onDataFromAndroid(" + JSONObject.quote(jsonString) + ")";
            webView.post(() -> webView.evaluateJavascript(jsCode, null));

        } catch (Exception e) {
            e.printStackTrace();
        }
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
        public String getLessonId() {
            Log.d("getlessonID", activity_id);
            String lesson_id = activity_id;
            activity_id = "";
            return lesson_id;
        }

        @JavascriptInterface
        public void sendDataToContainer(String key, String payload) {
            Log.d("WebView", "Received gamePlayData from webapp " + appUrl + "--->" + payload);

            try {
                JSONObject gameData = new JSONObject(payload);
                Log.d("WebView", "JSON GAME DATA " + appUrl + "---> " + gameData);

                // Check if this is gameData and process it
                if(key.equals("gameData")) {  // Use equals() instead of == for string comparison
                    XAPIManager xs = new XAPIManager();

                    // Extract values from the JSONObject
                    String crUserId = gameData.optString("cr_user_id", "");
                    String ftmLanguage = gameData.optString("ftm_language", "");
                    String successOrFailure = gameData.optString("success_or_failure", "");
                    int rightMoves = gameData.optInt("right_moves", 0);
                    int wrongMoves = gameData.optInt("wrong_moves", 0);
                    String levelNumber = String.valueOf(gameData.optInt("level_number", 0));
                    double duration = gameData.optDouble("duration", 0.0);
                    int score = gameData.optInt("score", 0);

                    // Now use these extracted values
                     xs.sendXAPIStatement(
                            "johndoe01@example.com",
                            "John Doe 01",
                            "http://adlnet.gov/expapi/verbs/completed",
                            (successOrFailure.equals("success")) ? "completed" : successOrFailure,
                            levelNumber,
                            levelNumber,
                            levelNumber,
                            "course-456",
                            "class-789",
                            "school-101",
                            "assignment-202",
                            "chapter-303",
                             score,
                            rightMoves,
                            wrongMoves
                    );
                    
                }

                //just for testing, to check the incoming statements
//                else if(true) {
                    XAPIManager xs = new XAPIManager();
                    xs.retrieveXAPIStatements("johndoe01@example.com");
                    Log.d(TAG, "Successfully get the statements");
//                }


            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        @JavascriptInterface
        public void requestDataFromContainer(String key, @Nullable JSONObject tempData) {
            ((WebApp) mContext).sendDataToJS(key, tempData);
        }

        @JavascriptInterface
        public void sendGameLevelInfoToJS() {
            try {
                // Create sample game level data (you would load this from your database or preference)
                JSONArray levelInfoArray = new JSONArray();

                // Get data from SharedPreferences if available
                String savedGameData = sharedPref.getString(language + "gamePlayedInfo", null);

                if (savedGameData != null) {
                    // Use existing data if available
                    levelInfoArray = new JSONArray(savedGameData);
                } else {
                    // Sample data in case nothing exists yet
                    JSONObject level1 = new JSONObject();
                    level1.put("levelName", "LetterOnly");
                    level1.put("levelNumber", 0);
                    level1.put("score", 100);
                    level1.put("starCount", 3);

                    JSONObject level2 = new JSONObject();
                    level2.put("levelName", "LetterOnly");
                    level2.put("levelNumber", 0);
                    level2.put("score", 80);
                    level2.put("starCount", 3);

                    levelInfoArray.put(level1);
                    levelInfoArray.put(level2);
                }

                // Create a wrapper JSON object with type information
                JSONObject dataToSend = new JSONObject();
                dataToSend.put("type", "gameLevelInfo");
                dataToSend.put("data", levelInfoArray);

                // Send to JavaScript
                ((WebApp) mContext).sendDataToJS("gameLevelInfo", dataToSend);

                Log.d(TAG, "Sent game level info to JS: " + dataToSend.toString());
            } catch (JSONException e) {
                Log.e(TAG, "Error creating game level info", e);
            }
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

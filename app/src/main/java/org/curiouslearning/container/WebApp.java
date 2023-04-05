package org.curiouslearning.container;

import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;
import android.view.View;
import android.webkit.ConsoleMessage;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ImageView;

import androidx.appcompat.app.AlertDialog;

import org.curiouslearning.container.firebase.AnalyticsUtils;
import org.curiouslearning.container.presentation.base.BaseActivity;
import org.curiouslearning.container.utilities.ConnectionUtils;

public class WebApp extends BaseActivity {

    private String title;
    private String appUrl;

    private WebView webView;
    private SharedPreferences sharedPref;
    private int urlIndex;
    private boolean dataCached;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_web_app);
        getIntentData();
        initViews();
        logAppLaunchEvent();
        loadWebView();
    }

    private void getIntentData() {
        Intent intent = getIntent();
        if (intent != null) {
            urlIndex = intent.getIntExtra("ftm-type", 0);
            title = intent.getStringExtra("title");
            appUrl = intent.getStringExtra("appUrl");
        }
    }

    private void initViews() {
        sharedPref = getApplicationContext().getSharedPreferences("appCached", Context.MODE_PRIVATE);
        dataCached = sharedPref.getBoolean(String.valueOf(urlIndex), false);
        ImageView goBack = findViewById(R.id.button2);
        goBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                finish();
            }
        });
    }

    private void loadWebView() {
        if (!isInternetConnected(getApplicationContext()) && !dataCached) {
            showPrompt("Please Connect to the Network");
            return;
        }

        webView = findViewById(R.id.web_app);
        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
        webView.setHorizontalScrollBarEnabled(false);
        webView.setWebViewClient(new WebViewClient());
        webView.getSettings().setDomStorageEnabled(true);
        webView.getSettings().getDomStorageEnabled();
        webView.getSettings().setAppCacheEnabled(true);
        webView.getSettings().setJavaScriptEnabled(true);
        webView.addJavascriptInterface(new WebAppInterface(this), "Android");
        webView.loadUrl(appUrl);
        webView.setWebChromeClient(new WebChromeClient() {
            public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
                return false;
            }
        });
    }

    private boolean isInternetConnected(Context context){
        return ConnectionUtils.getInstance().isInternetConnected(context);
    }

    private void showPrompt(String message){
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
        public void receiveData(boolean isDataCached) {
            SharedPreferences.Editor editor = sharedPref.edit();
            editor.putBoolean(String.valueOf(urlIndex), true);
            editor.commit();

            if (!isInternetConnected(getApplicationContext()) && isDataCached) {
                showPrompt("Please Connect to the Network");
            }

            // Do something with the data
        }
    }

    //log firebase Event
    public void logAppLaunchEvent() {
        AnalyticsUtils.logEvent(this, "app_launch", title, appUrl);
    }
}

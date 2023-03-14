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
import androidx.appcompat.app.AppCompatActivity;

public class WebApp extends AppCompatActivity {

    private WebView webView;
    private String[] urls = {"https://feedthemonster.curiouscontent.org/?ftm_language=english", "\n" +
            "https://feedthemonsterdev.curiouscontent.org/?ftm_language=english"};
    private int urlIndex = 0;
    private String[] versionDataStatus = {"EnglishDataCachedStatusProd","EnglishDataCachedStatusDev"};
    private boolean dataCached = false;
    SharedPreferences sharedPref;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Intent i = this.getIntent();
            if(i!=null){
                urlIndex = i.getIntExtra("ftm-type", 8);
            sharedPref = getApplicationContext().getSharedPreferences("appCached", Context.MODE_PRIVATE);

            dataCached = sharedPref.getBoolean(versionDataStatus[urlIndex], false);
            try {
                this.getSupportActionBar().hide();
            } catch (NullPointerException e) {
            }
            setContentView(R.layout.activity_web_app);

            ImageView goBack = findViewById(R.id.button2);
            goBack.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    finish();
                }
            });

            if (!isInternetConnected(getApplicationContext()) && !dataCached) {
                showPrompt("Please Connect to the Network");
            } else {

                webView = (WebView) findViewById(R.id.web_app);
                webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
                webView.setHorizontalScrollBarEnabled(false);
                webView.setWebViewClient(new WebViewClient());
                webView.getSettings().setDomStorageEnabled(true);
                webView.getSettings().getDomStorageEnabled();
                webView.getSettings().setAppCacheEnabled(true);
//            webView.getSettings().setLoadsImagesAutomatically(true);
                webView.getSettings().setJavaScriptEnabled(true);
                webView.addJavascriptInterface(new WebAppInterface(this), "Android");
//            webView.getSettings().setAllowFileAccess(true);
                webView.loadUrl(urls[urlIndex]);
                webView.setWebChromeClient(new WebChromeClient() {
                    public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
                        return false;
                    }

                });
            }
        }
    }
        public class WebAppInterface {
            Context mContext;

            /** Instantiate the interface and set the context */
            WebAppInterface(Context c) {
                mContext = c;
            }

            /** Receive data from the PWA */
            @JavascriptInterface
            public void receiveData(boolean isDataCached) {

                SharedPreferences.Editor editor = sharedPref.edit();
                editor.putBoolean(versionDataStatus[urlIndex], true);
                editor.commit();
                if (!isInternetConnected(getApplicationContext()) && isDataCached) {

                    showPrompt("Please Connect to the Network");
                }
                // Do something with the data
            }
        }
        public boolean isInternetConnected(Context context){
            ConnectivityManager connectivityManager = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
            NetworkInfo activeNetworkInfo = connectivityManager.getActiveNetworkInfo();
            return activeNetworkInfo != null && activeNetworkInfo.isConnected();
        }
        private void showPrompt (String message){
            AlertDialog.Builder builder = new AlertDialog.Builder(this);
            builder.setMessage(message)
                    .setCancelable(false)
                    .setPositiveButton("OK", new DialogInterface.OnClickListener() {
                        public void onClick(DialogInterface dialog, int id) {
                            // do nothing
                            finish();
                        }
                    });
            AlertDialog alert = builder.create();
            alert.show();
        }
    }

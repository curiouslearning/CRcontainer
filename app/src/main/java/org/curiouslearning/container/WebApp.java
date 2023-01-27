package org.curiouslearning.container;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import android.content.DialogInterface;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.webkit.ConsoleMessage;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebStorage;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;

public class WebApp extends AppCompatActivity {

    private WebView webView;
    private String[] urls = {"https://devcuriousreader.wpcomstaging.com/FeedTheMonsterJS2.3/", "\n" +
            "https://devcuriousreader.wpcomstaging.com/FTMFrench2.0/"};
    private int urlIndex = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        try {
            this.getSupportActionBar().hide();
        }
        catch (NullPointerException e) {}
        setContentView(R.layout.activity_web_app);

        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Title");
        builder.setView(R.layout.custom_layout);
        builder.setPositiveButton("OK", new DialogInterface.OnClickListener() {
            public void onClick(DialogInterface dialog, int id) {
                // User clicked OK button
            }
        });
        builder.setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
            public void onClick(DialogInterface dialog, int id) {
                // User cancelled the dialog
            }
        });
        AlertDialog dialog = builder.create();


        Intent i = this.getIntent();

        Button goBack = findViewById(R.id.button2);
        goBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                dialog.show();
//                finish();
            }
        });

        if (i != null) {
            urlIndex = i.getIntExtra("org.curiouslearning.container-type", 8);
            webView = (WebView) findViewById(R.id.web_app);
            webView.setWebViewClient(new WebViewClient());
            webView.getSettings().setDomStorageEnabled(true);
            webView.getSettings().setAppCacheEnabled(true);
//            webView.getSettings().setLoadsImagesAutomatically(true);
            webView.getSettings().setJavaScriptEnabled(true);
//            webView.getSettings().setAllowFileAccess(true);
            webView.loadUrl(urls[urlIndex]);
            webView.setWebChromeClient(new WebChromeClient() {
                public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
                    return false;
                }

            });
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                webView.getWebChromeClient().onReceivedTitle(webView, "Feed The Monster");
            }
            webView.evaluateJavascript("localStorage.setLocalStorage('loaded', true);", s -> {});
            webView.evaluateJavascript("localStorage.getLocalStorage('loaded', true);", new ValueCallback<String>() {
                @Override
                public void onReceiveValue(String value) {
                    System.out.println("Value: " + value);
                }
            });
        }
    }
}
package org.curiouslearning.container;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.webkit.ConsoleMessage;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
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

        Intent i = this.getIntent();

        Button goBack = findViewById(R.id.button2);
        goBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                finish();
            }
        });

        if (i != null) {
            urlIndex = i.getIntExtra("ftm-type", 8);
            webView = (WebView) findViewById(R.id.web_app);
            webView.setWebViewClient(new MyWebViewClient());
            webView.getSettings().setDomStorageEnabled(true);
            webView.getSettings().getDomStorageEnabled();
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
        }
    }
}
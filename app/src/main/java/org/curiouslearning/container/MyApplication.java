package org.curiouslearning.container;

import android.app.Application;
import android.util.Log;
import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;
import com.google.firebase.FirebaseApp;
import com.google.firebase.analytics.FirebaseAnalytics;

import io.sentry.android.core.SentryAndroid;

public class MyApplication extends Application {
    private static final String TAG = "MyApplication";
    
    @Override
    public void onCreate() {
        super.onCreate();
        
        // Initialize Firebase first
        FirebaseApp.initializeApp(this);
        
        // Configure Firebase Analytics for offline support
        FirebaseAnalytics firebaseAnalytics = FirebaseAnalytics.getInstance(this);
        firebaseAnalytics.setAnalyticsCollectionEnabled(true);
        firebaseAnalytics.setSessionTimeoutDuration(1800000); // 30 minutes
        
        Log.d(TAG, "Firebase Analytics initialized with offline support enabled");
        
        // FacebookSdk.sdkInitialize(getApplicationContext());
        FacebookSdk.setAutoInitEnabled(true);
        FacebookSdk.fullyInitialize();
        FacebookSdk.setAdvertiserIDCollectionEnabled(true);
        AppEventsLogger.activateApp(this);
        SentryAndroid.init(this, options -> {
            options.setDsn(
                    "https://3e3bfa9bd4473edd4e0b0d502195f4de@o4504951275651072.ingest.us.sentry.io/4510001311383552"); // replace
                                                                                                                        // with
                                                                                                                        // your
                                                                                                                        // DSN
            options.setEnvironment(BuildConfig.BUILD_TYPE);

        });
    }
}

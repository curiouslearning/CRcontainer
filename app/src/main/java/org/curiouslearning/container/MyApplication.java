package org.curiouslearning.container;

import android.app.Application;
import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;

import org.curiouslearning.container.telemetry.SentryReporter;

public class MyApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();

        if (BuildConfig.ENABLE_FACEBOOK) {
            FacebookSdk.setAutoInitEnabled(true);
            FacebookSdk.fullyInitialize();
            FacebookSdk.setAdvertiserIDCollectionEnabled(true);
            AppEventsLogger.activateApp(this);
        }

        if (BuildConfig.ENABLE_SENTRY) {
            SentryReporter.init(this);
        }
        // RiveInitializer is auto-initialized via AndroidManifest.xml (InitializationProvider)

    }
}

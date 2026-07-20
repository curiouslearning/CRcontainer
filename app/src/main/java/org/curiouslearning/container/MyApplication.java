package org.curiouslearning.container;

import android.app.Application;
import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;

import org.curiouslearning.container.core.context.AppContext;

import io.sentry.android.core.SentryAndroid;

public class MyApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();

        AppContext.getInstance().init(this);

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
        // RiveInitializer is auto-initialized via AndroidManifest.xml (InitializationProvider)

    }
}

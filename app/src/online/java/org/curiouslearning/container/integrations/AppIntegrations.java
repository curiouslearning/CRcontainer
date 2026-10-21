package org.curiouslearning.container.integrations;

import android.app.Application;

import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;

import org.curiouslearning.container.BuildConfig;

import io.sentry.android.core.SentryAndroid;

/**
 * Process-level third-party SDK start-up for the {@code online} (Play Store) flavor: the Facebook
 * SDK (campaign attribution, app events) and Sentry. The standalone flavors ship a no-op twin of
 * this class and do not contain either library.
 */
public final class AppIntegrations {

    private AppIntegrations() {
    }

    public static void init(Application application) {
        FacebookSdk.setAutoInitEnabled(true);
        FacebookSdk.fullyInitialize();
        FacebookSdk.setAdvertiserIDCollectionEnabled(true);
        AppEventsLogger.activateApp(application);

        SentryAndroid.init(application, options -> {
            options.setDsn(
                    "https://3e3bfa9bd4473edd4e0b0d502195f4de@o4504951275651072.ingest.us.sentry.io/4510001311383552");
            options.setEnvironment(BuildConfig.BUILD_TYPE);
        });
    }
}

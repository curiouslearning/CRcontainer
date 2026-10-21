package org.curiouslearning.container.integrations;

import android.app.Application;
import android.util.Log;

/**
 * Standalone-flavor twin of the online {@code AppIntegrations}: the offline builds contain neither
 * the Facebook SDK nor Sentry, so there is nothing to start. Firebase (Analytics, Firestore,
 * Crashlytics) is initialised elsewhere and is present in every flavor.
 */
public final class AppIntegrations {

    private AppIntegrations() {
    }

    public static void init(Application application) {
        Log.i("AppIntegrations", "Standalone build: Facebook SDK and Sentry are not included");
    }
}

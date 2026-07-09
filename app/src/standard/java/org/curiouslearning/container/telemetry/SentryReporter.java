package org.curiouslearning.container.telemetry;

import android.app.Application;

import org.curiouslearning.container.BuildConfig;

import io.sentry.Sentry;
import io.sentry.android.core.SentryAndroid;

public final class SentryReporter {
    private SentryReporter() {
    }

    public static void init(Application application) {
        if (!BuildConfig.ENABLE_SENTRY) {
            return;
        }

        SentryAndroid.init(application, options -> {
            options.setDsn(
                    "https://3e3bfa9bd4473edd4e0b0d502195f4de@o4504951275651072.ingest.us.sentry.io/4510001311383552");
            options.setEnvironment(BuildConfig.BUILD_TYPE);
        });
    }

    public static void captureMessage(String message) {
        if (!BuildConfig.ENABLE_SENTRY) {
            return;
        }

        Sentry.captureMessage(message);
    }
}

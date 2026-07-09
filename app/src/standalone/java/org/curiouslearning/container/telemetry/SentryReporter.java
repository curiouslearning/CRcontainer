package org.curiouslearning.container.telemetry;

import android.app.Application;

public final class SentryReporter {
    private SentryReporter() {
    }

    public static void init(Application application) {
        // Standalone builds do not ship Sentry.
    }

    public static void captureMessage(String message) {
        // Standalone builds do not ship Sentry.
    }
}

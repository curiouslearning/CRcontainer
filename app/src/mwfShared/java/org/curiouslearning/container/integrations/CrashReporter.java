package org.curiouslearning.container.integrations;

import android.util.Log;

import java.util.Map;

/**
 * Standalone-flavor twin of the online {@code CrashReporter}: the offline builds do not contain
 * Sentry, so reports go to logcat only. Crashes themselves still reach Firebase Crashlytics.
 */
public final class CrashReporter {

    private static final String TAG = "CrashReporter";

    private CrashReporter() {
    }

    public static void message(String message) {
        Log.w(TAG, message);
    }

    public static void breadcrumb(String category, String message, Map<String, Object> data) {
        Log.d(TAG, category + ": " + message + (data != null ? " " + data : ""));
    }
}

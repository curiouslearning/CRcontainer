package org.curiouslearning.container.firebase;

import android.content.Context;
import android.os.Bundle;
import com.google.firebase.analytics.FirebaseAnalytics;

import java.util.Date;

public class AnalyticsUtils {

    private static FirebaseAnalytics mFirebaseAnalytics;

    public static void logEvent(Context context, String eventName, Bundle bundle) {
        // Initialize Firebase Analytics if not already initialized
        if (mFirebaseAnalytics == null) {
            mFirebaseAnalytics = FirebaseAnalytics.getInstance(context);
        }

        // Log a custom event
        bundle.putString(FirebaseAnalytics.Param.START_DATE, new Date().toString());
        mFirebaseAnalytics.logEvent(eventName, bundle);
    }
}

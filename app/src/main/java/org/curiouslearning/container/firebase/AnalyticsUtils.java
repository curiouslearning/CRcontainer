package org.curiouslearning.container.firebase;

import android.content.Context;
import android.os.Bundle;
import com.google.firebase.analytics.FirebaseAnalytics;

import java.util.Date;

public class AnalyticsUtils {

    private static FirebaseAnalytics mFirebaseAnalytics;

    public static void logEvent(Context context, String eventName, String appName, String appUrl ,String pseudoId) {
        // Initialize Firebase Analytics if not already initialized
        if (mFirebaseAnalytics == null) {
            mFirebaseAnalytics = FirebaseAnalytics.getInstance(context);
        }

        // Log a custom event
        Bundle bundle = new Bundle();
        bundle.putString("web_app_title", appName);
        bundle.putString("web_app_url", appUrl);
        bundle.putString("cr_user_id", pseudoId);
        mFirebaseAnalytics.logEvent(eventName, bundle);
    }
}

package org.curiouslearning.container.firebase;

import android.content.Context;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;

import com.android.installreferrer.api.ReferrerDetails;
import com.google.firebase.analytics.FirebaseAnalytics;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class AnalyticsUtils {

    private static FirebaseAnalytics mFirebaseAnalytics;

    public static FirebaseAnalytics getFirebaseAnalytics(Context context) {
        if (mFirebaseAnalytics == null) {
            mFirebaseAnalytics = FirebaseAnalytics.getInstance(context);
        }
        return mFirebaseAnalytics;
    }

    public static void logEvent(Context context, String eventName, String appName, String appUrl, String pseudoId, String language) {
        FirebaseAnalytics firebaseAnalytics = getFirebaseAnalytics(context);

        Bundle bundle = new Bundle();
        bundle.putString("web_app_title", appName);
        bundle.putString("web_app_url", appUrl);
        bundle.putString("cr_user_id", pseudoId);
        bundle.putString("cr_language", language);
        firebaseAnalytics.logEvent(eventName, bundle);
    }

    public static void logReferrerEvent(Context context, String eventName, ReferrerDetails response) {
        if (response != null) {
            FirebaseAnalytics firebaseAnalytics = getFirebaseAnalytics(context);

            Bundle bundle = new Bundle();
            bundle.putString("referrer_url", response.getInstallReferrer());
            bundle.putLong("referrer_click_time", response.getReferrerClickTimestampSeconds());
            bundle.putLong("app_install_time", response.getInstallBeginTimestampSeconds());
            bundle.putBoolean("instant_experience_launched", response.getGooglePlayInstantParam());

            Map<String, String> extractedParams = extractReferrerParameters(response.getInstallReferrer());
            if (extractedParams != null) {
                bundle.putString("source", extractedParams.get("source"));
                bundle.putString("campaign_id", extractedParams.get("source"));
            }

            firebaseAnalytics.logEvent(eventName, bundle);
        }
    }

    private  static Map<String, String> extractReferrerParameters(String referrerUrl) {
        Map<String, String> params = new HashMap<>();

        Uri uri = Uri.parse("?" + referrerUrl);
        
        String source = uri.getQueryParameter("utm_source");
        String campaign = uri.getQueryParameter("utm_campaign");

        Log.d("campaign_id from souce ", campaign + " " + source);

        params.put("source", source);
        params.put("campaign_id", campaign);

        return params;
    }
}

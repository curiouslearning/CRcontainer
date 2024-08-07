package org.curiouslearning.container.firebase;

import android.content.Context;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;

import com.android.installreferrer.api.ReferrerDetails;
import com.google.firebase.analytics.FirebaseAnalytics;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class AnalyticsUtils {

    private static FirebaseAnalytics mFirebaseAnalytics;
    private static final String PREFS_NAME = "InstallReferrerPrefs";
    private static final String UTM_SOURCE = "utm_source";
    private static final String UTM_CAMPAIGN = "utm_campaign";

    public static FirebaseAnalytics getFirebaseAnalytics(Context context) {
        if (mFirebaseAnalytics == null) {
            mFirebaseAnalytics = FirebaseAnalytics.getInstance(context);
        }
        return mFirebaseAnalytics;
    }

    public static void logEvent(Context context, String eventName, String appName, String appUrl, String pseudoId, String language) {
        FirebaseAnalytics firebaseAnalytics = getFirebaseAnalytics(context);

        Bundle bundle = createEventBundle(context);
        bundle.putString("web_app_title", appName);
        bundle.putString("web_app_url", appUrl);
        bundle.putString("cr_user_id", pseudoId);
        bundle.putString("cr_language", language);
        firebaseAnalytics.logEvent(eventName, bundle);
    }

    public static void logLanguageSelectEvent(Context context, String eventName, String pseudoId, String language, String manifestVersion, String autoSelected) {
        FirebaseAnalytics firebaseAnalytics = getFirebaseAnalytics(context);

        Bundle bundle = createEventBundle(context);
        long currentEpochTime = getCurrentEpochTime();
        bundle.putLong("event_timestamp", currentEpochTime);
        bundle.putString("cr_user_id", pseudoId);
        bundle.putString("cr_language", language);
        bundle.putString("manifest_version", manifestVersion);
        bundle.putString("auto_selected",autoSelected);
        firebaseAnalytics.logEvent(eventName, bundle);
    }



    public static void logReferrerEvent(Context context, String eventName, ReferrerDetails response) {
        if (response != null) {
            FirebaseAnalytics firebaseAnalytics = getFirebaseAnalytics(context);
            String referrerUrl = response.getInstallReferrer();
            Bundle bundle = new Bundle();
            bundle.putString("referrer_url", referrerUrl);
            bundle.putLong("referrer_click_time", response.getReferrerClickTimestampSeconds());
            bundle.putLong("app_install_time", response.getInstallBeginTimestampSeconds());
            
            Map<String, String> extractedParams = extractReferrerParameters(referrerUrl);
            if (extractedParams != null) {
                String source = extractedParams.get("source");
                String campaign = extractedParams.get("campaign");
                String content = extractedParams.get("content");
                bundle.putString("utm_source", source);
                bundle.putString("utm_campaign", campaign);
                bundle.putString("utm_content", content);
                storeReferrerParams(context, source, campaign);
            }

            firebaseAnalytics.logEvent(eventName, bundle);
        }
    }
    private static void storeReferrerParams(Context context, String source, String campaign) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = prefs.edit();
        editor.putString(UTM_SOURCE, source);
        editor.putString(UTM_CAMPAIGN, campaign);
        editor.apply();
    }

    private static Bundle createEventBundle(Context context) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        Bundle bundle = new Bundle();
        bundle.putString("utm_source", prefs.getString(UTM_SOURCE, ""));
        bundle.putString("utm_campaign", prefs.getString(UTM_CAMPAIGN, ""));
        return bundle;
    }

    private  static Map<String, String> extractReferrerParameters(String referrerUrl) {
        Map<String, String> params = new HashMap<>();
        // Using a dummy URL to ensure `Uri.parse` correctly processes the referrerUrl as part of a valid URL.
        Uri uri = Uri.parse("http://dummyurl.com/?" +referrerUrl);

        String source = uri.getQueryParameter("utm_source");
        String campaign = uri.getQueryParameter("utm_campaign");
        String content = uri.getQueryParameter("utm_content");
        Log.d("data without decode util", campaign + " " + source + " " + content);
        content = urlDecode(content);

        Log.d("referral data", uri+" "+campaign + " " + source + " " + content+" "+referrerUrl);

        params.put("source", source);
        params.put("campaign", campaign);
        params.put("content", content);

        return params;
    }

    public static long getCurrentEpochTime() {
        long currentTimeMillis = System.currentTimeMillis();

        return currentTimeMillis;
    }

    public static String urlDecode(String encodedString) {
        try {
            if (encodedString != null) {
                String decodedString = URLDecoder.decode(encodedString, StandardCharsets.UTF_8.toString());
                System.out.println("Decoded utm_content: " + decodedString);
                return decodedString;
            } else {
                System.out.println("Encoded string is null.");
                return null;
            }
        } catch (UnsupportedEncodingException | IllegalArgumentException e) {
            e.printStackTrace();
            return null;
        }
    }
}

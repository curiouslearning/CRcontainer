package org.curiouslearning.container.firebase;

import android.content.Context;
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

    public static void logLanguageSelectEvent(Context context, String eventName, String pseudoId, String language, String manifestVersion, String autoSelected) {
        FirebaseAnalytics firebaseAnalytics = getFirebaseAnalytics(context);

        Bundle bundle = new Bundle();
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
           
            Bundle bundle = new Bundle();
            bundle.putString("referrer_url", response.getInstallReferrer());
            bundle.putLong("referrer_click_time", response.getReferrerClickTimestampSeconds());
            bundle.putLong("app_install_time", response.getInstallBeginTimestampSeconds());

            Map<String, String> extractedParams = extractReferrerParameters(response.getInstallReferrer());
            if (extractedParams != null) {
                String source = extractedParams.get("source");
                String campaign = extractedParams.get("campaign");
                String content = extractedParams.get("content");
                bundle.putString("source", source);
                bundle.putString("campaign", campaign);
                bundle.putString("content", content);
            }

            firebaseAnalytics.logEvent(eventName, bundle);
        }
    }

    private  static Map<String, String> extractReferrerParameters(String referrerUrl) {
        Map<String, String> params = new HashMap<>();
         //create a dummmy url
        // Using a dummy URL to ensure `Uri.parse` correctly processes the referrerUrl as part of a valid URL.
        Uri uri = Uri.parse("http://dummyurl.com/?" +referrerUrl);

        String source = uri.getQueryParameter("utm_source");
        String campaign = uri.getQueryParameter("utm_campaign");
        String content = uri.getQueryParameter("utm_content");
        Log.d("data without decode", campaign + " " + source + " " + content);
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

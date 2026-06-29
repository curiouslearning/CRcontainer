package org.curiouslearning.container.installreferrer;

import android.net.Uri;
import android.text.TextUtils;
import android.util.Log;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

public class ReferrerParser {
    private static final String TAG = "ReferrerParser";

    public static class ParsedReferrer {
        public String deferredLanguage = "";
        public String source = null;
        public String campaignId = null;
        public String content = null;
        public boolean isInvalidReferrer = false;
        public boolean isOrganicInstall = false;
    }

    public static ParsedReferrer parse(String referrerUrl) {
        ParsedReferrer result = new ParsedReferrer();
        if (TextUtils.isEmpty(referrerUrl)) {
            return result;
        }

        Uri uri = Uri.parse("http://dummyurl.com/?" + referrerUrl);
        
        // Parse source/medium for organic/invalid detection
        String utmSource = uri.getQueryParameter("utm_source");
        String utmMedium = uri.getQueryParameter("utm_medium");

        if (utmSource != null && (utmSource.equals("(not set)") || utmSource.equals("(not%20set)"))) {
            result.isInvalidReferrer = true;
        }
        if (utmMedium != null && (utmMedium.equals("(not set)") || utmMedium.equals("(not%20set)"))) {
            result.isInvalidReferrer = true;
        }
        if ("google-play".equalsIgnoreCase(utmSource) && "organic".equalsIgnoreCase(utmMedium)) {
            result.isOrganicInstall = true;
        }

        String deeplink = uri.getQueryParameter("deferred_deeplink");
        if (!TextUtils.isEmpty(deeplink)) {
            Uri deeplinkUri = Uri.parse(deeplink);
            String language = deeplinkUri.getQueryParameter("language");
            if (!TextUtils.isEmpty(language)) {
                result.deferredLanguage = language;
            }
            
            result.source = deeplinkUri.getQueryParameter("source");
            result.campaignId = deeplinkUri.getQueryParameter("campaign_id");
            if (!TextUtils.isEmpty(result.source) || !TextUtils.isEmpty(result.campaignId)) {
                Log.d("referrer", "Extracted from deferred_deeplink - source: " + result.source + ", campaign_id: " + result.campaignId);
            }
        }

        if (TextUtils.isEmpty(result.source)) {
            result.source = uri.getQueryParameter("source");
            if (!TextUtils.isEmpty(result.source)) {
                Log.d("referrer", "Extracted source from top-level referrer URL: " + result.source);
            }
        }
        if (TextUtils.isEmpty(result.campaignId)) {
            result.campaignId = uri.getQueryParameter("campaign_id");
            if (!TextUtils.isEmpty(result.campaignId)) {
                Log.d("referrer", "Extracted campaign_id from top-level referrer URL: " + result.campaignId);
            }
        }

        String content = uri.getQueryParameter("utm_content");
        Log.d("data without decode", deeplink + " " + result.campaignId + " " + result.source + " " + content);
        result.content = urlDecode(content);
        Log.d("referral data", uri + " " + result.campaignId + " " + result.source + " " + result.content + " " + referrerUrl);

        return result;
    }

    public static String urlDecode(String encodedString) {
        try {
            if (encodedString != null) {
                String decodedString = URLDecoder.decode(encodedString, StandardCharsets.UTF_8.toString());
                Log.d(TAG, "Decoded utm_content: " + decodedString);
                return decodedString;
            } else {
                Log.w(TAG, "urlDecode: encodedString is null.");
                return null;
            }
        } catch (UnsupportedEncodingException | IllegalArgumentException e) {
            Log.e(TAG, "urlDecode failed", e);
            return null;
        }
    }
}

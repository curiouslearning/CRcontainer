package org.curiouslearning.container.installreferrer;

import android.content.Context;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.RemoteException;
import android.text.TextUtils;
import android.util.Log;

import com.android.installreferrer.api.InstallReferrerClient;
import com.android.installreferrer.api.InstallReferrerStateListener;
import com.android.installreferrer.api.ReferrerDetails;

import org.curiouslearning.container.firebase.AnalyticsUtils;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

public class InstallReferrerManager {

    private final InstallReferrerClient installReferrerClient;
    private Context context;
    private ReferrerCallback callback;
    private static final String UTM_PREFS_NAME = "utmPrefs";
    private static final String SHARED_PREFS_NAME = "appCached";
    private static final String SOURCE = "source";
    private static final String CAMPAIGN_ID = "campaign_id";
    private static final String RETRY_ATTEMPT_KEY = "current_retry_attempt";
    private static final String SUCCESS_ATTEMPT_COUNT_KEY = "success_attempt_count";

    private static int MAX_RETRY_ATTEMPTS = 5;
    private static final long RETRY_INTERVAL_MS = 2000; // 2 seconds
    private int currentRetryAttempt = 0;
    private int successAttemptCount = 0;
    private android.os.Handler retryHandler = new android.os.Handler();

    public InstallReferrerManager(Context context, ReferrerCallback callback) {
        this.context = context;
        this.callback = callback;
        installReferrerClient = InstallReferrerClient.newBuilder(context).build();
        
        // Load cached retry attempt from SharedPreferences
        SharedPreferences prefs = context.getSharedPreferences(SHARED_PREFS_NAME, Context.MODE_PRIVATE);
        currentRetryAttempt = prefs.getInt(RETRY_ATTEMPT_KEY, 0);
        successAttemptCount = prefs.getInt(SUCCESS_ATTEMPT_COUNT_KEY, 0);
        // INSERT_YOUR_CODE
        MAX_RETRY_ATTEMPTS = currentRetryAttempt + 5;
        Log.d("referrer", "Loaded cached retry attempt: " + currentRetryAttempt + ", success attempt count: " + successAttemptCount);
    }

    public void checkPlayStoreAvailability() {
        if (installReferrerClient != null) {
            callback.onReferrerStatusUpdate(new ReferrerStatus("CONNECTING", 0, MAX_RETRY_ATTEMPTS, null));
            startConnection();
        } else {
            String error = "Install referrer client not initialized";
            Log.d("referrer", error);
            callback.onReferrerStatusUpdate(new ReferrerStatus("FAILED", 0, MAX_RETRY_ATTEMPTS, error));
        }
    }

    private void startConnection() {
        Log.d("referrer", "Attempting to connect to referrer service (attempt " + (currentRetryAttempt + 1) + "/"
                + MAX_RETRY_ATTEMPTS + ")");

        installReferrerClient.startConnection(new InstallReferrerStateListener() {
            @Override
            public void onInstallReferrerSetupFinished(int responseCode) {
                switch (responseCode) {
                    case InstallReferrerClient.InstallReferrerResponse.OK:
                        Log.d("referrer", "install connection established on attempt " + (currentRetryAttempt + 1));
                        int successAttempt = currentRetryAttempt + 1;
                        successAttemptCount = successAttempt;
                        currentRetryAttempt = 0; // Reset retry counter on success
                        saveRetryAttemptToCache(); // Cache the reset value
                        callback.onReferrerStatusUpdate(new ReferrerStatus("CONNECTED", currentRetryAttempt,
                                MAX_RETRY_ATTEMPTS, null, successAttempt));
                        handleReferrer();
                        break;
                    case InstallReferrerClient.InstallReferrerResponse.FEATURE_NOT_SUPPORTED:
                        String featureError = "Install referrer not supported";
                        Log.d("referrer", featureError);
                        // Don't overwrite existing cached raw_referrer_url - preserve it for extraction
                        
                        // Try to extract from cached raw_referrer_url first (might have utm_source/utm_medium)
                        SharedPreferences installReferrerPrefs = context.getSharedPreferences("install_referrer_prefs", Context.MODE_PRIVATE);
                        String rawReferrerUrl = installReferrerPrefs.getString("raw_referrer_url", "");
                        String extractedSource = null;
                        String extractedCampaignId = null;
                        
                        if (!TextUtils.isEmpty(rawReferrerUrl)) {
                            // Try to extract fallback values from cached raw_referrer_url
                            Map<String, String> extractedParams = extractReferrerParameters(rawReferrerUrl);
                            if (extractedParams != null) {
                                extractedSource = extractedParams.get("source");
                                extractedCampaignId = extractedParams.get("campaign_id");
                                Log.d("referrer", "Extracted from cached raw_referrer_url - source: " + extractedSource + ", campaign_id: " + extractedCampaignId);
                            }
                        }
                        
                        // Check cached values from InstallReferrerPrefs (might have valid attribution from other sources)
                        SharedPreferences cachedPrefs = context.getSharedPreferences("InstallReferrerPrefs", Context.MODE_PRIVATE);
                        String cachedSource = cachedPrefs.getString("source", "");
                        String cachedCampaignId = cachedPrefs.getString("campaign_id", "");
                        
                        // Use extracted values if available, otherwise fall back to cached values
                        String finalSource = !TextUtils.isEmpty(extractedSource) ? extractedSource : cachedSource;
                        String finalCampaignId = !TextUtils.isEmpty(extractedCampaignId) ? extractedCampaignId : cachedCampaignId;
                        
                        callback.onReferrerStatusUpdate(
                                new ReferrerStatus("FAILED", currentRetryAttempt, MAX_RETRY_ATTEMPTS, featureError));
                        callback.onReferrerReceived("", "");
                        
                        // Only mark as failed if we don't have any valid attribution (extracted or cached)
                        if (TextUtils.isEmpty(finalSource) || TextUtils.isEmpty(finalCampaignId)) {
                            logAttributionStatus("failed", featureError, null, null);
                        } else {
                            // We have valid attribution (from extraction or cache), so mark as success
                            logAttributionStatus("success", featureError, finalSource, finalCampaignId);
                        }
                        break;
                    case InstallReferrerClient.InstallReferrerResponse.SERVICE_UNAVAILABLE:
                        String serviceError = "Install referrer service unavailable";
                        Log.d("referrer", serviceError);
                        callback.onReferrerStatusUpdate(
                                new ReferrerStatus("RETRYING", currentRetryAttempt, MAX_RETRY_ATTEMPTS, serviceError));
                        retryConnection();
                        break;
                    default:
                        String unknownError = "Unknown response code: " + responseCode;
                        Log.d("referrer", unknownError);
                        callback.onReferrerStatusUpdate(
                                new ReferrerStatus("RETRYING", currentRetryAttempt, MAX_RETRY_ATTEMPTS, unknownError));
                        retryConnection();
                        break;
                }
            }

            @Override
            public void onInstallReferrerServiceDisconnected() {
                Log.d("referrer", "Referrer service disconnected");
                retryConnection();
            }
        });
    }

    private void handleReferrer() {
        ReferrerDetails referrerDetails = null;
        try {
            referrerDetails = installReferrerClient.getInstallReferrer();
            Log.d("referal", referrerDetails.toString() + " ");
            String referrerUrl = referrerDetails.getInstallReferrer();

            // Cache the raw referrerUrl in preferences (handle null case)
            cacheRawReferrerUrl(referrerUrl);
            // the below url is for testing purpose
            // String referrerUrl =
            // "deferred_deeplink=curiousreader://app?language=hindii&source=testQA&campaign_id=123test";
            Log.d("referal", referrerUrl + " ");
            Map<String, String> extractedParams = extractReferrerParameters(referrerUrl);
            logFirstOpenEvent(referrerDetails);
            String source = extractedParams.get("source");
            String campaignId = extractedParams.get("campaign_id");
            
            // Log extracted values (which may include fallback from utm_source/utm_medium)
            Log.d("referrer", "Extracted source: " + source + ", campaign_id: " + campaignId);
            
            // Check cached values from PREFS_NAME (InstallReferrerPrefs) which is used for user properties
            // This ensures we use the same source as user properties for attribution status
            SharedPreferences cachedPrefs = context.getSharedPreferences("InstallReferrerPrefs", Context.MODE_PRIVATE);
            String cachedSource = cachedPrefs.getString("source", "");
            String cachedCampaignId = cachedPrefs.getString("campaign_id", "");
            
            // Use cached values if current extraction is empty (cached values might come from Facebook deferred deep link or previous extraction)
            if (TextUtils.isEmpty(source) && !TextUtils.isEmpty(cachedSource)) {
                source = cachedSource;
                Log.d("referrer", "Using cached source: " + source);
            }
            if (TextUtils.isEmpty(campaignId) && !TextUtils.isEmpty(cachedCampaignId)) {
                campaignId = cachedCampaignId;
                Log.d("referrer", "Using cached campaign_id: " + campaignId);
            }
            
            // Check if this is an organic install (utm_source=google-play&utm_medium=organic)
            // Also check for invalid referrer URLs like utm_source=(not set)&utm_medium=(not set)
            boolean isOrganicInstall = false;
            boolean isInvalidReferrer = false;
            if (!TextUtils.isEmpty(referrerUrl)) {
                Uri uri = Uri.parse("http://dummyurl.com/?" + referrerUrl);
                String utmSource = uri.getQueryParameter("utm_source");
                String utmMedium = uri.getQueryParameter("utm_medium");
                
                // Check for invalid/not set values
                if (utmSource != null && (utmSource.equals("(not set)") || utmSource.equals("(not%20set)"))) {
                    isInvalidReferrer = true;
                    Log.d("referrer", "Detected invalid referrer with utm_source=(not set)");
                }
                if (utmMedium != null && (utmMedium.equals("(not set)") || utmMedium.equals("(not%20set)"))) {
                    isInvalidReferrer = true;
                    Log.d("referrer", "Detected invalid referrer with utm_medium=(not set)");
                }
                
                // Check for valid organic install
                if ("google-play".equalsIgnoreCase(utmSource) && "organic".equalsIgnoreCase(utmMedium)) {
                    isOrganicInstall = true;
                    Log.d("referrer", "Detected organic install from Google Play");
                }
            }
            
            // Determine status based on final source and campaignId (from current extraction with fallback, or cache)
            // Success if: organic install OR we have both source and campaign_id
            // Failed if: invalid referrer OR referrer URL is empty or we don't have required parameters
            if (isInvalidReferrer) {
                Log.d("referrer", "Attribution status: FAILED - invalid referrer with (not set) values");
                logAttributionStatus("failed", referrerUrl, source, campaignId);
            } else if (isOrganicInstall || (!TextUtils.isEmpty(source) && !TextUtils.isEmpty(campaignId))) {
                Log.d("referrer", "Attribution status: SUCCESS - organic: " + isOrganicInstall + ", source: " + source + ", campaign_id: " + campaignId);
                logAttributionStatus("success", referrerUrl, source, campaignId);
            } else {
                Log.d("referrer", "Attribution status: FAILED - source: " + source + ", campaign_id: " + campaignId);
                logAttributionStatus("failed", referrerUrl, source, campaignId);
            }

        } catch (RemoteException e) {
            // Don't overwrite existing cached raw_referrer_url - preserve it for extraction
            
            // Try to extract from cached raw_referrer_url first (might have utm_source/utm_medium)
            SharedPreferences installReferrerPrefs = context.getSharedPreferences("install_referrer_prefs", Context.MODE_PRIVATE);
            String rawReferrerUrl = installReferrerPrefs.getString("raw_referrer_url", "");
            String extractedSource = null;
            String extractedCampaignId = null;
            
            if (!TextUtils.isEmpty(rawReferrerUrl)) {
                // Try to extract fallback values from cached raw_referrer_url
                Map<String, String> extractedParams = extractReferrerParameters(rawReferrerUrl);
                if (extractedParams != null) {
                    extractedSource = extractedParams.get("source");
                    extractedCampaignId = extractedParams.get("campaign_id");
                    Log.d("referrer", "Extracted from cached raw_referrer_url - source: " + extractedSource + ", campaign_id: " + extractedCampaignId);
                }
            }
            
            // Check cached values from InstallReferrerPrefs (might have valid attribution from other sources)
            SharedPreferences cachedPrefs = context.getSharedPreferences("InstallReferrerPrefs", Context.MODE_PRIVATE);
            String cachedSource = cachedPrefs.getString("source", "");
            String cachedCampaignId = cachedPrefs.getString("campaign_id", "");
            
            // Use extracted values if available, otherwise fall back to cached values
            String finalSource = !TextUtils.isEmpty(extractedSource) ? extractedSource : cachedSource;
            String finalCampaignId = !TextUtils.isEmpty(extractedCampaignId) ? extractedCampaignId : cachedCampaignId;
            
            // Check if this is an organic install from cached raw_referrer_url
            // Also check for invalid referrer URLs like utm_source=(not set)&utm_medium=(not set)
            boolean isOrganicInstall = false;
            boolean isInvalidReferrer = false;
            if (!TextUtils.isEmpty(rawReferrerUrl)) {
                Uri uri = Uri.parse("http://dummyurl.com/?" + rawReferrerUrl);
                String utmSource = uri.getQueryParameter("utm_source");
                String utmMedium = uri.getQueryParameter("utm_medium");
                
                // Check for invalid/not set values
                if (utmSource != null && (utmSource.equals("(not set)") || utmSource.equals("(not%20set)"))) {
                    isInvalidReferrer = true;
                    Log.d("referrer", "Detected invalid cached referrer with utm_source=(not set)");
                }
                if (utmMedium != null && (utmMedium.equals("(not set)") || utmMedium.equals("(not%20set)"))) {
                    isInvalidReferrer = true;
                    Log.d("referrer", "Detected invalid cached referrer with utm_medium=(not set)");
                }
                
                // Check for valid organic install
                if ("google-play".equalsIgnoreCase(utmSource) && "organic".equalsIgnoreCase(utmMedium)) {
                    isOrganicInstall = true;
                    Log.d("referrer", "Detected organic install from cached referrer URL");
                }
            }
            
            // Success if: organic install OR we have valid attribution (extracted or cached)
            // Failed if: invalid referrer OR no valid attribution
            if (isInvalidReferrer) {
                Log.d("referrer", "Attribution status: FAILED - invalid cached referrer with (not set) values");
                logAttributionStatus("failed", e.getMessage(), null, null);
            } else if (isOrganicInstall || (!TextUtils.isEmpty(finalSource) && !TextUtils.isEmpty(finalCampaignId))) {
                logAttributionStatus("success", e.getMessage(), finalSource, finalCampaignId);
            } else {
                logAttributionStatus("failed", e.getMessage(), null, null);
            }
            e.printStackTrace();
        } finally {
            installReferrerClient.endConnection();
        }
    }

    private Map<String, String> extractReferrerParameters(String referrerUrl) {
        Map<String, String> params = new HashMap<>();
        // Using a dummy URL to ensure `Uri.parse` correctly processes the referrerUrl
        // as part of a valid URL.
        Uri uri = Uri.parse("http://dummyurl.com/?" + referrerUrl);
        String deeplink = uri.getQueryParameter("deferred_deeplink");
        if (deeplink != null && deeplink.contains("curiousreader://app?language")) {
            callback.onReferrerReceived(deeplink.replace("curiousreader://app?language=", ""), referrerUrl);
        } else if (deeplink != null) {
            callback.onReferrerReceived("", referrerUrl);
        } else {
            callback.onReferrerReceived("", referrerUrl);
        }
        
        String source = null;
        String campaign_id = null;
        
        // First, try to extract source and campaign_id from deferred_deeplink (highest priority)
        if (deeplink != null && !deeplink.isEmpty()) {
            Uri deeplinkUri = Uri.parse(deeplink);
            source = deeplinkUri.getQueryParameter("source");
            campaign_id = deeplinkUri.getQueryParameter("campaign_id");
            if (!TextUtils.isEmpty(source) || !TextUtils.isEmpty(campaign_id)) {
                Log.d("referrer", "Extracted from deferred_deeplink - source: " + source + ", campaign_id: " + campaign_id);
            }
        }
        
        // If not found in deferred_deeplink, try top-level parameters in referrer URL
        if (TextUtils.isEmpty(source)) {
            source = uri.getQueryParameter("source");
            if (!TextUtils.isEmpty(source)) {
                Log.d("referrer", "Extracted source from top-level referrer URL: " + source);
            }
        }
        if (TextUtils.isEmpty(campaign_id)) {
            campaign_id = uri.getQueryParameter("campaign_id");
            if (!TextUtils.isEmpty(campaign_id)) {
                Log.d("referrer", "Extracted campaign_id from top-level referrer URL: " + campaign_id);
            }
        }
        
        // Fallback to utm_source and utm_medium ONLY if source/campaign_id are still not available
        // if (TextUtils.isEmpty(source)) {
        //     String utmSource = uri.getQueryParameter("utm_source");
        //     if (!TextUtils.isEmpty(utmSource)) {
        //         source = utmSource;
        //         Log.d("referrer", "Using utm_source as fallback for source: " + source);
        //     }
        // }
        // if (TextUtils.isEmpty(campaign_id)) {
        //     String utmMedium = uri.getQueryParameter("utm_medium");
        //     if (!TextUtils.isEmpty(utmMedium)) {
        //         campaign_id = utmMedium;
        //         Log.d("referrer", "Using utm_medium as fallback for campaign_id: " + campaign_id);
        //     }
        // }
        
        String content = uri.getQueryParameter("utm_content");
        Log.d("data without decode", deeplink + " " + campaign_id + " " + source + " " + content);
        content = urlDecode(content);

        Log.d("referral data", uri + " " + campaign_id + " " + source + " " + content + " " + referrerUrl);
        SharedPreferences prefs = context.getSharedPreferences(UTM_PREFS_NAME, Context.MODE_PRIVATE);

        SharedPreferences.Editor editor = prefs.edit();
        editor.putString(SOURCE, source);
        editor.putString(CAMPAIGN_ID, campaign_id);
        editor.apply();
        params.put("source", source);
        params.put("campaign_id", campaign_id);
        // params.put("content", content);

        return params;
    }

    public void logFirstOpenEvent(ReferrerDetails referrerDetails) {

        AnalyticsUtils.logReferrerEvent(this.context, "first_open_cl", referrerDetails);
    }

    public interface ReferrerCallback {
        void onReferrerReceived(String referrerUrl, String fullUrl);

        void onReferrerStatusUpdate(ReferrerStatus status);
    }

    public static class ReferrerStatus {
        public final String state; // "CONNECTING", "RETRYING", "CONNECTED", "FAILED", "NOT_STARTED"
        public final int currentAttempt;
        public final int maxAttempts;
        public final String lastError;
        public final int successfulAttempt; // The attempt number where we succeeded, or -1 if not yet successful

        public ReferrerStatus(String state, int currentAttempt, int maxAttempts, String lastError) {
            this(state, currentAttempt, maxAttempts, lastError, -1);
        }

        public ReferrerStatus(String state, int currentAttempt, int maxAttempts, String lastError,
                int successfulAttempt) {
            this.state = state;
            this.currentAttempt = currentAttempt;
            this.maxAttempts = maxAttempts;
            this.lastError = lastError;
            this.successfulAttempt = successfulAttempt;
        }
    }

    private void retryConnection() {
        if (currentRetryAttempt < MAX_RETRY_ATTEMPTS) {
            currentRetryAttempt++;
            saveRetryAttemptToCache(); // Cache the incremented value
            Log.d("referrer", "Scheduling retry " + currentRetryAttempt + "/" + MAX_RETRY_ATTEMPTS +
                    " in " + RETRY_INTERVAL_MS + "ms");

            retryHandler.postDelayed(new Runnable() {
                @Override
                public void run() {
                    if (installReferrerClient != null) {
                        startConnection();
                    }
                }
            }, RETRY_INTERVAL_MS);
        } else {
            Log.d("referrer", "Max retry attempts reached. Giving up.");
            // Don't overwrite existing cached raw_referrer_url - preserve it for extraction
            callback.onReferrerReceived("", "");
            
            // Try to extract from cached raw_referrer_url first (might have utm_source/utm_medium)
            SharedPreferences installReferrerPrefs = context.getSharedPreferences("install_referrer_prefs", Context.MODE_PRIVATE);
            String rawReferrerUrl = installReferrerPrefs.getString("raw_referrer_url", "");
            String extractedSource = null;
            String extractedCampaignId = null;
            
            if (!TextUtils.isEmpty(rawReferrerUrl)) {
                // Try to extract fallback values from cached raw_referrer_url
                Map<String, String> extractedParams = extractReferrerParameters(rawReferrerUrl);
                if (extractedParams != null) {
                    extractedSource = extractedParams.get("source");
                    extractedCampaignId = extractedParams.get("campaign_id");
                    Log.d("referrer", "Extracted from cached raw_referrer_url - source: " + extractedSource + ", campaign_id: " + extractedCampaignId);
                }
            }
            
            // Check cached values from InstallReferrerPrefs (might have valid attribution from other sources)
            SharedPreferences cachedPrefs = context.getSharedPreferences("InstallReferrerPrefs", Context.MODE_PRIVATE);
            String cachedSource = cachedPrefs.getString("source", "");
            String cachedCampaignId = cachedPrefs.getString("campaign_id", "");
            
            // Use extracted values if available, otherwise fall back to cached values
            String finalSource = !TextUtils.isEmpty(extractedSource) ? extractedSource : cachedSource;
            String finalCampaignId = !TextUtils.isEmpty(extractedCampaignId) ? extractedCampaignId : cachedCampaignId;
            
            // Only mark as failed if we don't have any valid attribution (extracted or cached)
            if (TextUtils.isEmpty(finalSource) || TextUtils.isEmpty(finalCampaignId)) {
                logAttributionStatus("failed", "url not available", null, null);
            } else {
                // We have valid attribution (from extraction or cache), so mark as success
                logAttributionStatus("success", "url not available", finalSource, finalCampaignId);
            }
        }
    }
    
    private void saveRetryAttemptToCache() {
        SharedPreferences prefs = context.getSharedPreferences(SHARED_PREFS_NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = prefs.edit();
        editor.putInt(RETRY_ATTEMPT_KEY, currentRetryAttempt);
        editor.putInt(SUCCESS_ATTEMPT_COUNT_KEY, successAttemptCount);
        editor.apply();
        Log.d("referrer", "Cached retry attempt: " + currentRetryAttempt + ", success attempt count: " + successAttemptCount);
    }

    /**
     * Helper method to cache the raw referrer URL in SharedPreferences.
     * This ensures the value is always cached, even if empty, so AnalyticsUtils can read it.
     * 
     * @param referrerUrl The raw referrer URL to cache (can be null or empty)
     */
    private void cacheRawReferrerUrl(String referrerUrl) {
        SharedPreferences prefs = context.getSharedPreferences("install_referrer_prefs", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = prefs.edit();
        // Always cache as non-null string (empty if null) to avoid null values in SharedPreferences
        editor.putString("raw_referrer_url", referrerUrl != null ? referrerUrl : "");
        editor.apply();
        Log.d("referrer", "Cached raw_referrer_url: " + (referrerUrl != null && !referrerUrl.isEmpty() ? referrerUrl : "(empty)"));
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

    private void logAttributionStatus(String status, String referralUrl, String source, String campaignId) {
        Map<String, Object> eventData = new HashMap<>();
        SharedPreferences sharedPrefs = context.getSharedPreferences(SHARED_PREFS_NAME, context.MODE_PRIVATE);
        String pseudoId = sharedPrefs.getString("pseudoId", "");
        AnalyticsUtils.logAttributionStatusEvent(context, "attribution_status", status, referralUrl, pseudoId,
                MAX_RETRY_ATTEMPTS, successAttemptCount, source, campaignId);
    }

}

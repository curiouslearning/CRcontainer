package org.curiouslearning.container.installreferrer;

import static android.content.ContentValues.TAG;

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
        Log.d("referrer", "Loaded cached retry attempt: " + currentRetryAttempt + ", success attempt count: "
                + successAttemptCount);
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
                        Log.d(TAG, featureError);
                        resolveAttributionFromCache(featureError);
                        callback.onReferrerStatusUpdate(
                                new ReferrerStatus("FAILED", currentRetryAttempt, MAX_RETRY_ATTEMPTS, featureError));
                        callback.onReferrerReceived("", "");
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

            // Check cached values from PREFS_NAME (InstallReferrerPrefs) which is used for
            // user properties
            // This ensures we use the same source as user properties for attribution status
            SharedPreferences cachedPrefs = context.getSharedPreferences("InstallReferrerPrefs", Context.MODE_PRIVATE);
            String cachedSource = cachedPrefs.getString("source", "");
            String cachedCampaignId = cachedPrefs.getString("campaign_id", "");

            // Use cached values if current extraction is empty (cached values might come
            // from Facebook deferred deep link or previous extraction)
            if (TextUtils.isEmpty(source) && !TextUtils.isEmpty(cachedSource)) {
                source = cachedSource;
                Log.d("referrer", "Using cached source: " + source);
            }
            if (TextUtils.isEmpty(campaignId) && !TextUtils.isEmpty(cachedCampaignId)) {
                campaignId = cachedCampaignId;
                Log.d("referrer", "Using cached campaign_id: " + campaignId);
            }

            ReferrerParser.ParsedReferrer parsedData = ReferrerParser.parse(referrerUrl);
            boolean isOrganicInstall = parsedData.isOrganicInstall;
            boolean isInvalidReferrer = parsedData.isInvalidReferrer;

            // Determine status based on final source and campaignId (from current
            // extraction with fallback, or cache)
            // Success if: organic install OR we have both source and campaign_id
            // Failed if: invalid referrer OR referrer URL is empty or we don't have
            // required parameters
            if (isInvalidReferrer) {
                Log.d("referrer", "Attribution status: FAILED - invalid referrer with (not set) values");
                logAttributionStatus("failed", referrerUrl, source, campaignId);
            } else if (isOrganicInstall || (!TextUtils.isEmpty(source) && !TextUtils.isEmpty(campaignId))) {
                Log.d("referrer", "Attribution status: SUCCESS - organic: " + isOrganicInstall + ", source: " + source
                        + ", campaign_id: " + campaignId);
                logAttributionStatus("success", referrerUrl, source, campaignId);
            } else {
                Log.d("referrer", "Attribution status: FAILED - source: " + source + ", campaign_id: " + campaignId);
                logAttributionStatus("failed", referrerUrl, source, campaignId);
            }

        } catch (RemoteException e) {
            Log.e(TAG, "handleReferrer RemoteException", e);
            resolveAttributionFromCache(e.getMessage());
        } finally {
            installReferrerClient.endConnection();
        }
    }

    private Map<String, String> extractReferrerParameters(String referrerUrl) {
        ReferrerParser.ParsedReferrer parsed = ReferrerParser.parse(referrerUrl);
        callback.onReferrerReceived(parsed.deferredLanguage, referrerUrl);

        SharedPreferences prefs = context.getSharedPreferences(UTM_PREFS_NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = prefs.edit();
        editor.putString(SOURCE, parsed.source);
        editor.putString(CAMPAIGN_ID, parsed.campaignId);
        editor.apply();

        Map<String, String> params = new HashMap<>();
        params.put("source", parsed.source);
        params.put("campaign_id", parsed.campaignId);
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
            Log.d(TAG, "Max retry attempts reached. Falling back to cached attribution.");
            callback.onReferrerReceived("", "");
            resolveAttributionFromCache("url not available");
        }
    }

    /**
     * Resolves attribution data from cached SharedPreferences when the Play Store
     * referrer service is unavailable (FEATURE_NOT_SUPPORTED, RemoteException, or
     * max retries).
     *
     * <p>
     * Checks two sources in priority order:
     * <ol>
     * <li>Cached {@code raw_referrer_url} — parsed with
     * {@link #extractReferrerParameters}</li>
     * <li>Values previously written to {@code InstallReferrerPrefs} (e.g. from
     * Facebook SDK)</li>
     * </ol>
     *
     * @param errorContext A short description of why we're falling back (used for
     *                     logging only)
     */
    private void resolveAttributionFromCache(String errorContext) {
        SharedPreferences installReferrerPrefs = context.getSharedPreferences("install_referrer_prefs",
                Context.MODE_PRIVATE);
        String rawReferrerUrl = installReferrerPrefs.getString("raw_referrer_url", "");

        String extractedSource = null;
        String extractedCampaignId = null;

        if (!TextUtils.isEmpty(rawReferrerUrl)) {
            Map<String, String> params = extractReferrerParameters(rawReferrerUrl);
            if (params != null) {
                extractedSource = params.get("source");
                extractedCampaignId = params.get("campaign_id");
                Log.d(TAG, "resolveAttributionFromCache: extracted source=" + extractedSource
                        + " campaign_id=" + extractedCampaignId);
            }
        }

        SharedPreferences cachedPrefs = context.getSharedPreferences("InstallReferrerPrefs", Context.MODE_PRIVATE);
        String cachedSource = cachedPrefs.getString("source", "");
        String cachedCampaignId = cachedPrefs.getString("campaign_id", "");

        String finalSource = !TextUtils.isEmpty(extractedSource) ? extractedSource : cachedSource;
        String finalCampaignId = !TextUtils.isEmpty(extractedCampaignId) ? extractedCampaignId : cachedCampaignId;

        boolean isOrganicInstall = false;
        boolean isInvalidReferrer = false;
        if (!TextUtils.isEmpty(rawReferrerUrl)) {
            ReferrerParser.ParsedReferrer parsedData = ReferrerParser.parse(rawReferrerUrl);
            isOrganicInstall = parsedData.isOrganicInstall;
            isInvalidReferrer = parsedData.isInvalidReferrer;
        }

        Log.d(TAG, "resolveAttributionFromCache: context='" + errorContext
                + "' organic=" + isOrganicInstall
                + " invalid=" + isInvalidReferrer
                + " finalSource=" + finalSource
                + " finalCampaignId=" + finalCampaignId);

        if (isInvalidReferrer) {
            logAttributionStatus("failed", errorContext, null, null);
        } else if (isOrganicInstall || (!TextUtils.isEmpty(finalSource) && !TextUtils.isEmpty(finalCampaignId))) {
            logAttributionStatus("success", errorContext, finalSource, finalCampaignId);
        } else {
            logAttributionStatus("failed", errorContext, null, null);
        }
    }

    private void saveRetryAttemptToCache() {
        SharedPreferences prefs = context.getSharedPreferences(SHARED_PREFS_NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = prefs.edit();
        editor.putInt(RETRY_ATTEMPT_KEY, currentRetryAttempt);
        editor.putInt(SUCCESS_ATTEMPT_COUNT_KEY, successAttemptCount);
        editor.apply();
        Log.d("referrer",
                "Cached retry attempt: " + currentRetryAttempt + ", success attempt count: " + successAttemptCount);
    }

    /**
     * Helper method to cache the raw referrer URL in SharedPreferences.
     * This ensures the value is always cached, even if empty, so AnalyticsUtils can
     * read it.
     * 
     * @param referrerUrl The raw referrer URL to cache (can be null or empty)
     */
    private void cacheRawReferrerUrl(String referrerUrl) {
        SharedPreferences prefs = context.getSharedPreferences("install_referrer_prefs", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = prefs.edit();
        // Always cache as non-null string (empty if null) to avoid null values in
        // SharedPreferences
        editor.putString("raw_referrer_url", referrerUrl != null ? referrerUrl : "");
        editor.apply();
        Log.d("referrer", "Cached raw_referrer_url: "
                + (referrerUrl != null && !referrerUrl.isEmpty() ? referrerUrl : "(empty)"));
    }



    private void logAttributionStatus(String status, String referralUrl, String source, String campaignId) {
        Map<String, Object> eventData = new HashMap<>();
        SharedPreferences sharedPrefs = context.getSharedPreferences(SHARED_PREFS_NAME, context.MODE_PRIVATE);
        String pseudoId = sharedPrefs.getString("pseudoId", "");
        AnalyticsUtils.logAttributionStatusEvent(context, "attribution_status", status, referralUrl, pseudoId,
                MAX_RETRY_ATTEMPTS, successAttemptCount, source, campaignId);
    }

}

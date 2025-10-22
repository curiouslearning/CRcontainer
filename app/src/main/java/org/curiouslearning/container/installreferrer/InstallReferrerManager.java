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

    private static final int MAX_RETRY_ATTEMPTS = 5;
    private static final long RETRY_INTERVAL_MS = 2000; // 2 seconds
    private int currentRetryAttempt = 0;
    private int successAttemptCount = 0;
    private android.os.Handler retryHandler = new android.os.Handler();

    public InstallReferrerManager(Context context, ReferrerCallback callback) {
        this.context = context;
        this.callback = callback;
        installReferrerClient = InstallReferrerClient.newBuilder(context).build();

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
                        callback.onReferrerStatusUpdate(new ReferrerStatus("CONNECTED", currentRetryAttempt,
                                MAX_RETRY_ATTEMPTS, null, successAttempt));
                        handleReferrer();
                        break;
                    case InstallReferrerClient.InstallReferrerResponse.FEATURE_NOT_SUPPORTED:
                        String featureError = "Install referrer not supported";
                        Log.d("referrer", featureError);
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
            // String referrerUrl = referrerDetails.getInstallReferrer();
            // the below url is for testing purpose
            String referrerUrl = "deferred_deeplink=curiousreader://app?language=hindii&source=testQA&campaign_id=123test";
            Log.d("referal", referrerUrl + " ");
            Map<String, String> extractedParams = extractReferrerParameters(referrerUrl);
            logFirstOpenEvent(referrerDetails);
            String source = extractedParams.get("source");
            String campaignId = extractedParams.get("campaign_id");
            if (TextUtils.isEmpty(source) || TextUtils.isEmpty(campaignId)) {
                logAttributionStatus("failed", referrerUrl, source, campaignId);
            } else {
                logAttributionStatus("success", referrerUrl, source, campaignId);
            }

        } catch (RemoteException e) {
            logAttributionStatus("failed", "url not available", null, null);
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
        String source = uri.getQueryParameter("source");
        String campaign_id = uri.getQueryParameter("campaign_id");
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
            callback.onReferrerReceived("", "");
            logAttributionStatus("failed", "url not available", null, null);
        }
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
        AnalyticsUtils.logAttributionStatusEvent(context, "attribution_status_6", status, referralUrl, pseudoId,
                MAX_RETRY_ATTEMPTS, successAttemptCount, source, campaignId);
    }

}

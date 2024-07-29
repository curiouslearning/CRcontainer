package org.curiouslearning.container.installreferrer;


import android.content.Context;
import android.net.Uri;
import android.os.RemoteException;
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

    public InstallReferrerManager(Context context, ReferrerCallback callback) {
        this.context = context;
        this.callback = callback;
        installReferrerClient = InstallReferrerClient.newBuilder(context).build();
    }

    public void checkPlayStoreAvailability() {
        if (installReferrerClient != null) {
            startConnection();
        } else {
            Log.d("referrer", "install connection not established");
        }
    }

    private void startConnection() {
        installReferrerClient.startConnection(new InstallReferrerStateListener() {
            @Override
            public void onInstallReferrerSetupFinished(int responseCode) {
                switch (responseCode) {
                    case InstallReferrerClient.InstallReferrerResponse.OK:
                        Log.d("referrer", "install connection established");
                        handleReferrer();
                        break;
                    case InstallReferrerClient.InstallReferrerResponse.FEATURE_NOT_SUPPORTED:
                        Log.d("referrer", "install referrer not supported");
                        break;
                    case InstallReferrerClient.InstallReferrerResponse.SERVICE_UNAVAILABLE:
                        Log.d("referrer", "install referrer service unavailable");
                        break;
                }
            }

            @Override
            public void onInstallReferrerServiceDisconnected() {
                // on service disconnect
            }
        });
    }

    private void handleReferrer() {
        ReferrerDetails referrerDetails = null;
        try {
            referrerDetails = installReferrerClient.getInstallReferrer();
            Log.d("referal", referrerDetails.toString() +" ");
            String referrerUrl = referrerDetails.getInstallReferrer();
            Log.d("referal", referrerUrl +" ");
            extractReferrerParameters("utm_source=facebook&utm_medium=print&utm_campaign=120208084211250195&deferred_deeplink=curiousreader://app?language=nepalii");
            logFirstOpenEvent(referrerDetails);

        } catch (RemoteException e) {
            e.printStackTrace();
        } finally {
            installReferrerClient.endConnection();
        }
    }
    private Map<String, String> extractReferrerParameters(String referrerUrl) {
        Map<String, String> params = new HashMap<>();
        // Using a dummy URL to ensure `Uri.parse` correctly processes the referrerUrl as part of a valid URL.
        Uri uri = Uri.parse("http://dummyurl.com/?" +referrerUrl);
        String deeplink= uri.getQueryParameter("deferred_deeplink");
        if(deeplink!=null && deeplink.contains("curiousreader://app?language")){
            callback.onReferrerReceived(deeplink.replace("curiousreader://app?language=", ""));
        }
        String source = uri.getQueryParameter("utm_source");
        String campaign = uri.getQueryParameter("utm_campaign");
        String content = uri.getQueryParameter("utm_content");
        Log.d("data without decode",deeplink+" "+ campaign + " " + source + " " + content);
        content = urlDecode(content);

        Log.d("referral data", uri+" "+campaign + " " + source + " " + content+" "+referrerUrl);

        params.put("source", source);
        params.put("campaign", campaign);
        params.put("content", content);

        return params;
    }
    public void logFirstOpenEvent(ReferrerDetails referrerDetails) {
        AnalyticsUtils.logReferrerEvent(this.context, "first_open_cl", referrerDetails);
    }
    public interface ReferrerCallback {
        void onReferrerReceived(String referrerUrl);
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


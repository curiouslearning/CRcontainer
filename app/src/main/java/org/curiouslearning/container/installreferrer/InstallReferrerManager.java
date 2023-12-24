package org.curiouslearning.container.installreferrer;


import android.content.Context;
import android.os.RemoteException;
import android.util.Log;

import com.android.installreferrer.api.InstallReferrerClient;
import com.android.installreferrer.api.InstallReferrerStateListener;
import com.android.installreferrer.api.ReferrerDetails;

import org.curiouslearning.container.firebase.AnalyticsUtils;

public class InstallReferrerManager {

    private final InstallReferrerClient installReferrerClient;
    private Context context;

    public InstallReferrerManager(Context context) {
        this.context = context;
        installReferrerClient = InstallReferrerClient.newBuilder(context).build();
    }

    public void checkPlayStoreAvailability() {
        if (installReferrerClient.isReady()) {
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
            String referrerUrl = referrerDetails.getInstallReferrer();
            Log.d("referal", referrerUrl +" ");
            logFirstOpenEvent(referrerDetails);

        } catch (RemoteException e) {
            e.printStackTrace();
        } finally {
            installReferrerClient.endConnection();
        }
    }

    public void logFirstOpenEvent(ReferrerDetails referrerDetails) {
        AnalyticsUtils.logReferrerEvent(this.context, "first_open_cl", referrerDetails);
    }
}


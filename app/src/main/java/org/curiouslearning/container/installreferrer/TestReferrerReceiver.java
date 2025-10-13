package org.curiouslearning.container.installreferrer;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

public class TestReferrerReceiver extends BroadcastReceiver {
    private static final String TAG = "TestReferrerReceiver";

    @Override
    public void onReceive(Context context, Intent intent) {
        String referrer = intent.getStringExtra("referrer");
        Log.d(TAG, "Received test referrer: " + referrer);

        // Get the real InstallReferrerClient and simulate the referrer
        InstallReferrerManager.overrideReferrerForTesting(context, referrer);
    }
}

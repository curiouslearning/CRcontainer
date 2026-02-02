package org.curiouslearning.container.utilities;

import android.animation.ObjectAnimator;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.widget.ImageButton;
import android.widget.TextView;


import org.curiouslearning.container.R;
import org.curiouslearning.container.firebase.AnalyticsUtils;
import org.curiouslearning.container.installreferrer.InstallReferrerManager;

public class DebugOverlayManager {

    private Context context;
    private View offlineOverlay;
    private SharedPreferences prefs;
    private SharedPreferences utmPrefs;
    private Handler debugOverlayHandler = new Handler(Looper.getMainLooper());
    private static final long DEBUG_OVERLAY_UPDATE_INTERVAL = 1000;
    
    // Dependencies needed for data
    private ReferralManager referralManager;
    private String appVersion;
    
    private View debugTriggerArea;
    private int debugTapCount = 0;
    private long lastTapTime = 0;
    private static final long TAP_TIMEOUT = 3000;
    private static final int REQUIRED_TAPS = 8;
    
    private final Runnable debugOverlayUpdater = new Runnable() {
        @Override
        public void run() {
            updateDebugOverlay();
            debugOverlayHandler.postDelayed(this, DEBUG_OVERLAY_UPDATE_INTERVAL);
        }
    };

    public DebugOverlayManager(Context context, View offlineOverlay, View debugTriggerArea, SharedPreferences prefs, SharedPreferences utmPrefs, ReferralManager referralManager, String appVersion) {
        this.context = context;
        this.offlineOverlay = offlineOverlay;
        this.debugTriggerArea = debugTriggerArea;
        this.prefs = prefs;
        this.utmPrefs = utmPrefs;
        this.referralManager = referralManager;
        this.appVersion = appVersion;
        
        setupTrigger();
    }
    
    private void setupTrigger() {
        if (debugTriggerArea != null) {
            debugTriggerArea.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    long currentTime = System.currentTimeMillis();
                    if (currentTime - lastTapTime > TAP_TIMEOUT) {
                        debugTapCount = 1;
                    } else {
                        debugTapCount++;
                    }
                    lastTapTime = currentTime;

                    if (debugTapCount >= REQUIRED_TAPS) {
                        debugTapCount = 0;
                        if (offlineOverlay != null) {
                            offlineOverlay.setVisibility(View.VISIBLE);
                            offlineOverlay.setElevation(24 * context.getResources().getDisplayMetrics().density);
                            offlineOverlay.bringToFront();
                            updateDebugOverlay();
                            debugOverlayHandler.post(debugOverlayUpdater);
                        }
                    }
                }
            });
        }
    }

    public void updateDebugOverlay() {
        if (offlineOverlay == null) return;
        
        ImageButton closeButton = offlineOverlay.findViewById(R.id.debug_overlay_close);
        if (closeButton != null) {
            closeButton.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    offlineOverlay.setVisibility(View.GONE);
                    debugOverlayHandler.removeCallbacks(debugOverlayUpdater);
                }
            });
        }
        
        StringBuilder debugInfo = new StringBuilder();

        // Basic Info Section
        boolean isOffline = !ConnectionUtils.getInstance().isInternetConnected(context);
        String manifestVersion = prefs.getString("manifestVersion", "");
        debugInfo.append("=== Basic Info ===\n");
        debugInfo.append("Offline Mode: ").append(isOffline).append("\n");
        debugInfo.append("App Version: ").append(appVersion).append("\n");
        debugInfo.append("Manifest Version: ").append(manifestVersion).append("\n");
        debugInfo.append("CR User ID: cr_user_id_").append(prefs.getString("pseudoId", "")).append("\n\n");

        // Referrer & Attribution Section
        debugInfo.append("=== Referrer & Attribution ===\n");
        InstallReferrerManager.ReferrerStatus status = referralManager.getCurrentReferrerStatus();
        if (status != null) {
            debugInfo.append("Referrer Status: ").append(status.state);
            if (status.state.equals("RETRYING")) {
                debugInfo.append(" (Attempt ").append(status.currentAttempt)
                        .append("/").append(status.maxAttempts).append(")");
            }
            debugInfo.append("\n");

            if (status.successfulAttempt > 0) {
                debugInfo.append("Referrer Handled After: ").append(status.successfulAttempt)
                        .append(" attempt(s)\n");
            }

            if (status.lastError != null) {
                debugInfo.append("Last Error: ").append(status.lastError).append("\n");
            }
        } else {
            debugInfo.append("Referrer Status: NOT_STARTED\n");
        }
        
        debugInfo.append("Referrer Handled: ").append(referralManager.isReferrerHandled()).append("\n");
        debugInfo.append("Attribution Complete: ").append(referralManager.isAttributionComplete()).append("\n");
        String deferredDeeplink = prefs.getString("deferred_deeplink", "");
        debugInfo.append("Deferred Deeplink: ").append(deferredDeeplink.isEmpty() ? "None" : deferredDeeplink)
                .append("\n\n");

        // UTM Parameters Section
        debugInfo.append("=== UTM Parameters ===\n");
        debugInfo.append("Source: ").append(utmPrefs.getString("source", "None")).append("\n");
        debugInfo.append("Campaign ID: ").append(utmPrefs.getString("campaign_id", "None")).append("\n");
        debugInfo.append("Content: ").append(utmPrefs.getString("utm_content", "None")).append("\n\n");

        // Language Section
        debugInfo.append("=== Language Info ===\n");
        String selectedLanguage = prefs.getString("selectedLanguage", "");
        debugInfo.append("Selected Language: ").append(selectedLanguage.isEmpty() ? "None" : selectedLanguage)
                .append("\n");
        debugInfo.append("Stored Language: ").append(prefs.getString("selectedLanguage", "None")).append("\n\n");

        // Events Section
        debugInfo.append("=== Events ===\n");
        debugInfo.append("Started In Offline Mode Event Sent: ").append(isOffline).append("\n");
        debugInfo.append("Initial Slack Alert Time: ").append(AppUtils.convertEpochToDate(referralManager.getInitialSlackAlertTime()))
                .append("\n");
        debugInfo.append("Current Time: ").append(AppUtils.convertEpochToDate(AnalyticsUtils.getCurrentEpochTime()))
                .append("\n");

        // Set the debug info
        TextView debugText = offlineOverlay.findViewById(R.id.debug_info);
        debugText.setText(debugInfo.toString());
    }
    
    public void onResume() {
        if (offlineOverlay != null && offlineOverlay.getVisibility() == View.VISIBLE) {
            updateDebugOverlay();
            debugOverlayHandler.post(debugOverlayUpdater);
        }
    }
    
    public void onPause() {
        debugOverlayHandler.removeCallbacks(debugOverlayUpdater);
    }
}

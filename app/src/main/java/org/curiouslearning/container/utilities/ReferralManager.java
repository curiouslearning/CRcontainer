package org.curiouslearning.container.utilities;

import android.content.Context;
import android.content.SharedPreferences;
import android.net.Uri;
import android.util.Log;

import androidx.lifecycle.LifecycleOwner;
import androidx.lifecycle.Observer;

import com.facebook.applinks.AppLinkData;
import com.google.firebase.crashlytics.FirebaseCrashlytics;

import org.curiouslearning.container.firebase.AnalyticsUtils;
import org.curiouslearning.container.installreferrer.InstallReferrerManager;
import org.curiouslearning.container.presentation.viewmodals.HomeViewModal;

import java.util.List;
import java.util.stream.Collectors;

import io.sentry.Sentry;

public class ReferralManager {

    private static final String TAG = "ReferralManager";
    private static final String SHARED_PREFS_NAME = "appCached";
    private static final String REFERRER_HANDLED_KEY = "isReferrerHandled";
    private static final String UTM_PREFS_NAME = "utmPrefs";
    private final String isValidLanguage = "notValidLanguage";

    private Context context;
    private SharedPreferences prefs;
    private SharedPreferences utmPrefs;
    private HomeViewModal homeViewModal;
    private LifecycleOwner lifecycleOwner;
    private ReferralManagerListener listener;

    private boolean isReferrerHandled;
    private boolean isAttributionComplete = false;
    private InstallReferrerManager.ReferrerStatus currentReferrerStatus;
    private long initialSlackAlertTime;

    public interface ReferralManagerListener {
        void onLanguageReceived(String language);
        void onShowLanguagePopup();
        void onUpdateDebugOverlay();
        void onReferrerStatusUpdate(InstallReferrerManager.ReferrerStatus status);
    }

    public ReferralManager(Context context, HomeViewModal homeViewModal, LifecycleOwner lifecycleOwner, ReferralManagerListener listener) {
        this.context = context;
        this.homeViewModal = homeViewModal;
        this.lifecycleOwner = lifecycleOwner;
        this.listener = listener;
        
        this.prefs = context.getSharedPreferences(SHARED_PREFS_NAME, Context.MODE_PRIVATE);
        this.utmPrefs = context.getSharedPreferences(UTM_PREFS_NAME, Context.MODE_PRIVATE);
        this.isReferrerHandled = prefs.getBoolean(REFERRER_HANDLED_KEY, false);
        this.initialSlackAlertTime = AnalyticsUtils.getCurrentEpochTime();
    }

    public void init() {
        InstallReferrerManager.ReferrerCallback referrerCallback = new InstallReferrerManager.ReferrerCallback() {
            @Override
            public void onReferrerStatusUpdate(InstallReferrerManager.ReferrerStatus status) {
                currentReferrerStatus = status;
                if (listener != null) listener.onReferrerStatusUpdate(status);
            }

            @Override
            public void onReferrerReceived(String deferredLang, String fullURL) {
                String language = deferredLang.trim();

                if (!isReferrerHandled) {
                    SharedPreferences.Editor editor = prefs.edit();
                    editor.putBoolean(REFERRER_HANDLED_KEY, true);
                    editor.apply();
                    
                    if ((language != null && language.length() > 0) || fullURL.contains("curiousreader://app")) {
                        isAttributionComplete = true;
                        // Store deferred deeplink
                        editor = prefs.edit();
                        editor.putString("deferred_deeplink", fullURL);
                        editor.apply();

                        // Store UTM parameters first
                        SharedPreferences.Editor utmEditor = utmPrefs.edit();
                        Uri uri = Uri.parse("http://dummyurl.com/?" + fullURL);
                        String source = uri.getQueryParameter("source");
                        String campaign_id = uri.getQueryParameter("campaign_id");
                        utmEditor.putString("source", source);
                        utmEditor.putString("campaign_id", campaign_id);
                        utmEditor.apply();

                        // Also store in InstallReferrerPrefs for analytics
                        SharedPreferences installReferrerPrefs = context.getSharedPreferences("InstallReferrerPrefs",
                                Context.MODE_PRIVATE);
                        SharedPreferences.Editor installReferrerEditor = installReferrerPrefs.edit();
                        installReferrerEditor.putString("source", source);
                        installReferrerEditor.putString("campaign_id", campaign_id);
                        installReferrerEditor.apply();

                        // Now check offline mode and log event with the stored UTM params
                        if (!ConnectionUtils.getInstance().isInternetConnected(context)) {
                            logStartedInOfflineMode();
                        }
                        if (listener != null) listener.onUpdateDebugOverlay(); // Always update the overlay

                        validLanguage(language, "google", fullURL.replace("deferred_deeplink=", ""));
                        String pseudoId = prefs.getString("pseudoId", "");
                        String manifestVrsn = prefs.getString("manifestVersion", "");
                        String lang = "";
                        if (language != null && language.length() > 0)
                            lang = Character.toUpperCase(language.charAt(0))
                                    + language.substring(1).toLowerCase();
                        
                        // We don't set selectedLanguage here directly, we let validLanguage/listener handle it
                        // checking original code: it does both.
                        
                        if (listener != null) listener.onUpdateDebugOverlay();

                        if (isAttributionComplete) {
                            AnalyticsUtils.logLanguageSelectEvent(context, "language_selected", pseudoId,
                                    language,
                                    manifestVrsn, "true", fullURL.replace("deferred_deeplink=", ""));
                        } else {
                            Log.d(TAG, "Attribution not complete. Skipping event log.");
                        }
                        Log.d(TAG, "Referrer language received: " + language + " " + lang);
                    } else {
                        fetchFacebookDeferredData();
                    }
                } else {
                    String selectedLanguage = prefs.getString("selectedLanguage", "");
                    if (selectedLanguage.equals("")) {
                        if (listener != null) listener.onShowLanguagePopup();
                    } else {
                        if (listener != null) listener.onLanguageReceived(selectedLanguage);
                    }
                }
            }
        };

        InstallReferrerManager installReferrerManager = new InstallReferrerManager(context, referrerCallback);
        installReferrerManager.checkPlayStoreAvailability();
    }

    public void fetchFacebookDeferredData() {
        AppLinkData.fetchDeferredAppLinkData(context, new AppLinkData.CompletionHandler() {
            @Override
            public void onDeferredAppLinkDataFetched(AppLinkData appLinkData) {
                String pseudoId = prefs.getString("pseudoId", "");
                String manifestVrsn = prefs.getString("manifestVersion", "");
                
                // Note: Dialog dismissal was here in MainActivity, but here we can just ensure we proceed
                
                Log.d(TAG, "onDeferredAppLinkDataFetched:Facebook AppLinkData: " + appLinkData);
                if (appLinkData != null) {
                    Uri deepLinkUri = appLinkData.getTargetUri();
                    Log.d(TAG, "onDeferredAppLinkDataFetched: DeepLink URI: " + deepLinkUri);
                    String language = ((Uri) deepLinkUri).getQueryParameter("language");
                    String source = ((Uri) deepLinkUri).getQueryParameter("source");
                    String campaign_id = ((Uri) deepLinkUri).getQueryParameter("campaign_id");
                    SharedPreferences.Editor editor = utmPrefs.edit();
                    editor.putString("source", source);
                    editor.putString("campaign_id", campaign_id);
                    editor.apply();
                    validLanguage(language, "facebook", String.valueOf(deepLinkUri));
                    String lang = Character.toUpperCase(language.charAt(0)) + language.substring(1).toLowerCase();
                    Log.d(TAG, "onDeferredAppLinkDataFetched: Language from deep link: " + lang);
                    
                    isAttributionComplete = true;
                    AnalyticsUtils.storeReferrerParams(context, source, campaign_id);

                    if (isAttributionComplete) {
                        AnalyticsUtils.logLanguageSelectEvent(context, "language_selected", pseudoId, lang,
                                manifestVrsn, "true", String.valueOf(deepLinkUri));
                    } else {
                        Log.d(TAG, "Attribution not complete. Skipping event log.");
                    }

                } else {
                     String selectedLanguage = prefs.getString("selectedLanguage", "");
                     if (selectedLanguage.equals("")) {
                        if (listener != null) listener.onShowLanguagePopup();
                     } else {
                        if (listener != null) listener.onLanguageReceived(selectedLanguage);
                     }
                }
            }
        });
    }

    private void validLanguage(String deferredLang, String source, String deepLinkUri) {
        String language = deferredLang == null ? null : deferredLang.trim();
        long currentEpochTime = AnalyticsUtils.getCurrentEpochTime();
        String pseudoId = prefs.getString("pseudoId", "");
        String[] uriParts = deepLinkUri.split("(?=[?&])");
        StringBuilder message = new StringBuilder();
        message.append("An incorrect or null language value was detected in a ")
                .append(source)
                .append(" campaign’s deferred deep link with the following details:\n\n");
        for (String part : uriParts) {
            message.append(part).append("\n");
        }
        message.append("\n");
        message.append("User affected:: ").append(pseudoId).append("\n")
                .append("Detected in data at: ").append(AppUtils.convertEpochToDate(currentEpochTime)).append("\n")
                .append("Alerted in Slack: ").append(AppUtils.convertEpochToDate(initialSlackAlertTime));
        
        if (language == null || language.length() == 0) {
            String errorMsg = "[AttributionError] Null or empty 'language' received from " + source
                    + " referrer. PseudoId: " + pseudoId;
            AnalyticsUtils.logAttributionErrorEvent(context, "attribution_error", deepLinkUri, pseudoId);

            // Firebase Crashlytics non-fatal error
            FirebaseCrashlytics.getInstance().log(errorMsg);
            FirebaseCrashlytics.getInstance().recordException(
                    new IllegalArgumentException(errorMsg));
            // Slack alert
            SlackUtils.sendMessageToSlack(context, String.valueOf(message));
            Sentry.captureMessage("Missing Language when selecting Language ");
            if (listener != null) listener.onShowLanguagePopup();
            return;
        }
        
        homeViewModal.getAllLanguagesInEnglish().observe(lifecycleOwner, validLanguages -> {
            List<String> lowerCaseLanguages = validLanguages.stream()
                    .map(String::toLowerCase)
                    .collect(Collectors.toList());
            if (lowerCaseLanguages != null && lowerCaseLanguages.size() > 0
                    && !lowerCaseLanguages.contains(language.toLowerCase().trim())) {
                SlackUtils.sendMessageToSlack(context, String.valueOf(message));
                Sentry.captureMessage("Incorrect Language when selecting Language ");
                if (listener != null) listener.onShowLanguagePopup();
               
                // loadingIndicator visibility logic left to MainActivity via callbacks if needed
                // selectedLanguage = ""; // Managed in MainActivity/SharedPrefs
                // storeSelectLanguage(""); 
                // We'll let MainActivity handle "empty" language selection if popup is shown
                return;
            } else if (lowerCaseLanguages != null && lowerCaseLanguages.size() > 0) {
                String lang = Character.toUpperCase(language.charAt(0))
                        + language.substring(1).toLowerCase();
                if (listener != null) listener.onLanguageReceived(lang);
            } else if (lowerCaseLanguages == null || lowerCaseLanguages.size() == 0) {
                if (listener != null) listener.onLanguageReceived(isValidLanguage);
            }
        });
    }

    private void logStartedInOfflineMode() {
        AnalyticsUtils.logStartedInOfflineModeEvent(context,
                "started_in_offline_mode", prefs.getString("pseudoId", ""));
        if (listener != null) listener.onUpdateDebugOverlay();
    }

    // Getters for Debug Overlay
    public InstallReferrerManager.ReferrerStatus getCurrentReferrerStatus() {
        return currentReferrerStatus;
    }

    public boolean isReferrerHandled() {
        return isReferrerHandled;
    }

    public boolean isAttributionComplete() {
        return isAttributionComplete;
    }

    public SharedPreferences getUtmPrefs() {
        return utmPrefs;
    }
    
    public long getInitialSlackAlertTime() {
        return initialSlackAlertTime;
    }
}

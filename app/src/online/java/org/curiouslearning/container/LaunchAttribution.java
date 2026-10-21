package org.curiouslearning.container;

import android.content.Context;
import android.content.SharedPreferences;
import android.net.Uri;
import android.util.Log;

import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;
import com.facebook.applinks.AppLinkData;

import org.curiouslearning.container.firebase.AnalyticsUtils;
import org.curiouslearning.container.installreferrer.InstallReferrerManager;

/**
 * First-launch install attribution for the {@code online} (Play Store) flavor: reads the Play
 * Install Referrer, falls back to a Facebook deferred deep link, stores source / campaign_id and a
 * deferred language, and then drives {@code MainActivity}'s first screen. This is the code that
 * used to live inline in {@code MainActivity.onCreate}; it was moved here unchanged so the
 * standalone flavors, which contain neither the Install Referrer library nor the Facebook SDK,
 * can ship a no-op twin of this class.
 *
 * <p>Same package as {@code MainActivity} on purpose: it reaches the activity's package-private
 * state and helpers exactly as the inline code did.
 */
final class LaunchAttribution {

    // Kept as "MainActivity" so existing log filters keep matching these lines.
    private static final String TAG = "MainActivity";

    private LaunchAttribution() {
    }

    static void start(MainActivity host) {
        InstallReferrerManager.ReferrerCallback referrerCallback = new InstallReferrerManager.ReferrerCallback() {
            @Override
            public void onReferrerStatusUpdate(InstallReferrerManager.ReferrerStatus status) {
                host.setReferrerDebugStatus(describe(status));
                host.updateDebugOverlay();
            }

            @Override
            public void onReferrerReceived(String deferredLang, String fullURL) {
                String language = deferredLang.trim();

                if (!host.isReferrerHandled) {
                    SharedPreferences.Editor editor = host.prefs.edit();
                    editor.putBoolean(MainActivity.REFERRER_HANDLED_KEY, true);
                    editor.apply();
                    if ((language != null && language.length() > 0) || fullURL.contains("curiousreader://app")) {
                        host.isAttributionComplete = true;
                        // Store deferred deeplink
                        editor = host.prefs.edit();
                        editor.putString("deferred_deeplink", fullURL);
                        editor.apply();

                        // Store UTM parameters first
                        SharedPreferences.Editor utmEditor = host.utmPrefs.edit();
                        Uri uri = Uri.parse("http://dummyurl.com/?" + fullURL);
                        String source = uri.getQueryParameter("source");
                        String campaign_id = uri.getQueryParameter("campaign_id");
                        // Never overwrite stored attribution with null/empty values.
                        SharedPreferences installReferrerPrefs = host.getSharedPreferences("InstallReferrerPrefs",
                                Context.MODE_PRIVATE);
                        SharedPreferences.Editor installReferrerEditor = installReferrerPrefs.edit();
                        if (source != null && !source.trim().isEmpty()) {
                            utmEditor.putString("source", source);
                            installReferrerEditor.putString("source", source);
                        }
                        if (campaign_id != null && !campaign_id.trim().isEmpty()) {
                            utmEditor.putString("campaign_id", campaign_id);
                            installReferrerEditor.putString("campaign_id", campaign_id);
                        }
                        utmEditor.apply();
                        installReferrerEditor.apply();

                        host.hydrateAttributionContext();

                        // Now check offline mode and log event with the stored UTM params
                        if (!host.isInternetConnected(host.getApplicationContext())) {
                            host.logStartedInOfflineMode();
                        }
                        host.updateDebugOverlay(); // Always update the overlay

                        host.validLanguage(language, "google", fullURL.replace("deferred_deeplink=", ""));
                        String pseudoId = host.prefs.getString("pseudoId", "");
                        String manifestVrsn = host.prefs.getString("manifestVersion", "");
                        String lang = "";
                        if (language != null && language.length() > 0)
                            lang = Character.toUpperCase(language.charAt(0))
                                    + language.substring(1).toLowerCase();
                        host.selectedLanguage = lang;
                        host.storeSelectLanguage(lang);
                        host.updateDebugOverlay();

                        if (host.isAttributionComplete) {
                            AnalyticsUtils.logLanguageSelectEvent(host, "language_selected", pseudoId,
                                    language,
                                    manifestVrsn, "true", fullURL.replace("deferred_deeplink=", ""));
                        } else {
                            Log.d(TAG, "Attribution not complete. Skipping event log.");
                        }
                        Log.d(TAG, "Referrer language received: " + language + " " + lang);
                    } else {
                        fetchFacebookDeferredData(host);
                    }
                } else {
                    host.runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            if (host.selectedLanguage.equals("")) {
                                host.showLanguagePopup();
                            } else {
                                host.loadApps(host.selectedLanguage);
                            }
                        }
                    });
                }
            }
        };
        InstallReferrerManager installReferrerManager = new InstallReferrerManager(host.getApplicationContext(),
                referrerCallback);
        installReferrerManager.checkPlayStoreAvailability();

        FacebookSdk.setAutoInitEnabled(true);
        FacebookSdk.fullyInitialize();
        FacebookSdk.setAdvertiserIDCollectionEnabled(true);
        Log.d(TAG, "onCreate: Initializing MainActivity and FacebookSdk");
        AppEventsLogger.activateApp(host.getApplication());
    }

    /** The lines the debug overlay used to build from a {@code ReferrerStatus}. */
    private static String describe(InstallReferrerManager.ReferrerStatus status) {
        StringBuilder text = new StringBuilder(status.state);
        if (status.state.equals("RETRYING")) {
            text.append(" (Attempt ").append(status.currentAttempt)
                    .append("/").append(status.maxAttempts).append(")");
        }
        if (status.successfulAttempt > 0) {
            text.append("\nReferrer Handled After: ").append(status.successfulAttempt).append(" attempt(s)");
        }
        if (status.lastError != null) {
            text.append("\nLast Error: ").append(status.lastError);
        }
        return text.toString();
    }

    private static void fetchFacebookDeferredData(MainActivity host) {
        AppLinkData.fetchDeferredAppLinkData(host, new AppLinkData.CompletionHandler() {
            @Override
            public void onDeferredAppLinkDataFetched(AppLinkData appLinkData) {
                String pseudoId = host.prefs.getString("pseudoId", "");
                String manifestVrsn = host.prefs.getString("manifestVersion", "");
                // Only close an open language popup when a deferred link is about to decide the
                // language. With no link an already open popup must stay put; dismissing and
                // reopening it looked like a second popup.
                if (appLinkData != null && host.dialog != null && host.dialog.isShowing()) {
                    host.dialog.dismiss();
                    Log.d(TAG, "onDeferredAppLinkDataFetched: dismissed language popup for deferred link");
                }
                Log.d(TAG, "onDeferredAppLinkDataFetched:Facebook AppLinkData: " + appLinkData);
                if (appLinkData != null) {
                    Uri deepLinkUri = appLinkData.getTargetUri();
                    Log.d(TAG, "onDeferredAppLinkDataFetched: DeepLink URI: " + deepLinkUri);
                    String language = ((Uri) deepLinkUri).getQueryParameter("language");
                    String source = ((Uri) deepLinkUri).getQueryParameter("source");
                    String campaign_id = ((Uri) deepLinkUri).getQueryParameter("campaign_id");
                    // Never overwrite stored attribution with null/empty values.
                    SharedPreferences.Editor editor = host.utmPrefs.edit();
                    if (source != null && !source.trim().isEmpty()) {
                        editor.putString("source", source);
                    }
                    if (campaign_id != null && !campaign_id.trim().isEmpty()) {
                        editor.putString("campaign_id", campaign_id);
                    }
                    editor.apply();
                    host.validLanguage(language, "facebook", String.valueOf(deepLinkUri));
                    String lang = "";
                    if (language != null && language.length() > 0) {
                        lang = Character.toUpperCase(language.charAt(0)) + language.substring(1).toLowerCase();
                    }
                    Log.d(TAG, "onDeferredAppLinkDataFetched: Language from deep link: " + lang);
                    host.selectedLanguage = lang;
                    host.storeSelectLanguage(lang);
                    host.isAttributionComplete = true;
                    AnalyticsUtils.storeReferrerParams(host, source, campaign_id);
                    host.hydrateAttributionContext();

                    if (host.isAttributionComplete) {
                        AnalyticsUtils.logLanguageSelectEvent(host, "language_selected", pseudoId, lang,
                                manifestVrsn, "true", String.valueOf(deepLinkUri));
                    } else {
                        Log.d(TAG, "Attribution not complete. Skipping event log.");
                    }

                } else {
                    host.runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            if (host.selectedLanguage.equals("")) {
                                host.showLanguagePopup();
                            } else {
                                host.loadApps(host.selectedLanguage);
                            }

                        }
                    });
                }
            }
        });
    }
}

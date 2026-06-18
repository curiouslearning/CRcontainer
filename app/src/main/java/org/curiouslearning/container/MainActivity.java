package org.curiouslearning.container;

import android.animation.ObjectAnimator;
import android.animation.ValueAnimator;
import android.app.Application;
import android.app.Dialog;
import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.ColorMatrix;
import android.graphics.ColorMatrixColorFilter;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.GestureDetector;
import android.view.MotionEvent;
import android.view.View;
import android.view.animation.AccelerateDecelerateInterpolator;
import android.text.method.ScrollingMovementMethod;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.ProgressBar;

import androidx.lifecycle.Observer;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;
import com.facebook.applinks.AppLinkData;
import com.google.android.material.textfield.TextInputLayout;
import com.google.firebase.FirebaseApp;
import com.google.firebase.crashlytics.FirebaseCrashlytics;

import org.curiouslearning.container.data.model.WebApp;
import org.curiouslearning.container.databinding.ActivityMainBinding;
import org.curiouslearning.container.firebase.AnalyticsUtils;
import org.curiouslearning.container.installreferrer.InstallReferrerManager;
import org.curiouslearning.container.presentation.adapters.WebAppsAdapter;
import org.curiouslearning.container.presentation.base.BaseActivity;
import org.curiouslearning.container.presentation.viewmodals.HomeViewModal;
import org.curiouslearning.container.utilities.AnimationUtil;
import org.curiouslearning.container.utilities.AppUtils;
import org.curiouslearning.container.utilities.CacheUtils;
import org.curiouslearning.container.utilities.AudioPlayer;
import org.curiouslearning.container.utilities.ConnectionUtils;
import org.curiouslearning.container.utilities.DebugOverlayManager;
import org.curiouslearning.container.utilities.LanguageDialogManager;
import org.curiouslearning.container.utilities.ReferralManager;
import org.curiouslearning.container.utilities.SlackUtils;
import org.curiouslearning.container.utilities.VisualEffectsManager;

import java.math.BigInteger;
import java.security.SecureRandom;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.TimeZone;
import java.util.TreeMap;
import java.util.stream.Collectors;
import android.util.Log;
import android.content.Intent;
import android.widget.TextView;

import androidx.core.view.GestureDetectorCompat;
import app.rive.runtime.kotlin.RiveAnimationView;
import app.rive.runtime.kotlin.core.Alignment;
import app.rive.runtime.kotlin.core.Fit;
import app.rive.runtime.kotlin.core.Loop;
import io.sentry.Sentry;

public class MainActivity extends BaseActivity
        implements ReferralManager.ReferralManagerListener, LanguageDialogManager.LanguageDialogListener {
    private static final String TAG = "MainActivity";
    private static final String SHARED_PREFS_NAME = "appCached";
    private static final String UTM_PREFS_NAME = "utmPrefs";
    private final String isValidLanguage = "notValidLanguage";
    public ActivityMainBinding binding;
    public RecyclerView recyclerView;
    public WebAppsAdapter apps;
    public HomeViewModal homeViewModal;

    private SharedPreferences prefs;
    private SharedPreferences utmPrefs;
    private String selectedLanguage;
    private String manifestVersion;
    private AudioPlayer audioPlayer;
    private String appVersion;
    private ProgressBar loadingIndicator;
    private Button settingsButton;

    // Managers
    private VisualEffectsManager visualEffectsManager;
    private ReferralManager referralManager;
    private LanguageDialogManager languageDialogManager;
    private DebugOverlayManager debugOverlayManager;
    private SharedPreferences cachedPseudo;

    private Dialog dialog;

    private static final String REFERRER_HANDLED_KEY = "isReferrerHandled";

    private boolean isReferrerHandled;
    private boolean isAttributionComplete = false;
    private boolean isHandlingIdConfirmation = false;
    private boolean isShowingEnrollmentSuccess = false;
    private long initialSlackAlertTime;
    private GestureDetectorCompat gestureDetector;
    private TextView textView;
    private InstallReferrerManager.ReferrerStatus currentReferrerStatus;
    private View debugTriggerArea;
    private int debugTapCount = 0;
    private long lastTapTime = 0;
    private static final long TAP_TIMEOUT = 3000; // Reset tap count after 3 seconds
    private static final int REQUIRED_TAPS = 8;
    private ObjectAnimator breathingAnimator;
    private Handler debugOverlayHandler = new Handler(Looper.getMainLooper());
    private static final long DEBUG_OVERLAY_UPDATE_INTERVAL = 1000; // 1 second

    // private final Runnable debugOverlayUpdater = new Runnable() {
    // @Override
    // public void run() {
    // updateDebugOverlay();
    // debugOverlayHandler.postDelayed(this, DEBUG_OVERLAY_UPDATE_INTERVAL);
    // }
    // };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        prefs = getSharedPreferences(SHARED_PREFS_NAME, MODE_PRIVATE);
        utmPrefs = getSharedPreferences(UTM_PREFS_NAME, MODE_PRIVATE);
        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        loadingIndicator = findViewById(R.id.loadingIndicator);
        loadingIndicator.setVisibility(View.GONE);

        selectedLanguage = prefs.getString("selectedLanguage", "");
        manifestVersion = prefs.getString("manifestVersion", "");
        appVersion = AppUtils.getAppVersionName(this);

        homeViewModal = new HomeViewModal((Application) getApplicationContext(), this);
        cachePseudoId();

        // Initialize Managers
        visualEffectsManager = new VisualEffectsManager();
        referralManager = new ReferralManager(this, homeViewModal, this, this);

        audioPlayer = new AudioPlayer(); // Used by LanguageDialogManager
        languageDialogManager = new LanguageDialogManager(this, homeViewModal, prefs, audioPlayer, this);

        View offlineOverlay = findViewById(R.id.offline_mode_overlay);
        View debugTriggerArea = findViewById(R.id.debug_trigger_area);
        debugOverlayManager = new DebugOverlayManager(this, offlineOverlay, debugTriggerArea, prefs, utmPrefs,
                referralManager, appVersion);

        // Visual Effects
        setupVisualEffects();

        // Firebase & Facebook Init
        FirebaseApp.initializeApp(this);
        FacebookSdk.setAutoInitEnabled(true);
        FacebookSdk.fullyInitialize();
        FacebookSdk.setAdvertiserIDCollectionEnabled(true);
        Log.d(TAG, "onCreate: Initializing MainActivity and FacebookSdk");
        AppEventsLogger.activateApp(getApplication());

        // UI Setup
        initRecyclerView();

        Log.d(TAG, "onCreate: Selected language: " + selectedLanguage);
        Log.d(TAG, "onCreate: Manifest version: " + manifestVersion);
        if (manifestVersion != null && !manifestVersion.equals("")) {
            homeViewModal.getUpdatedAppManifest(manifestVersion);
        }

        settingsButton = findViewById(R.id.settings);
        settingsButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                visualEffectsManager.spinSettingsGear(view);
                AnimationUtil.scaleButton(view, new Runnable() {
                    @Override
                    public void run() {
                        languageDialogManager.showLanguagePopup();
                    }
                });
            }
        });

        // Handle Intent Data
        Intent intent = getIntent();
        if (intent.getData() != null) {
            String language = intent.getData().getQueryParameter("language");
            if (language != null) {
                selectedLanguage = Character.toUpperCase(language.charAt(0))
                        + language.substring(1).toLowerCase();
            }
        }

        // Initialize Referral Handling
        referralManager.init();

    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleIncomingIntent(intent);
    }

    private void handleIncomingIntent(Intent intent) {
        if (intent != null && intent.getData() != null) {
            Uri data = intent.getData();
            boolean handledStudyEnrollmentLink = false;

            // Check for set_new_ID
            String newIdRaw = data.getQueryParameter("study_user_id");
            String confirmationMessageRaw = data.getQueryParameter("confirmation_message");
            String studyConsent = data.getQueryParameter("study_consent");

            // Verify or generate cr_user_id before processing
            if (!prefs.contains("pseudoId")) {
                cachePseudoId();
            }

            if (newIdRaw != null && !newIdRaw.isEmpty()) {
                String newId = newIdRaw.replaceAll("[^0-9]", "");

                if ("true".equals(studyConsent) && !newId.isEmpty()) {
                    handledStudyEnrollmentLink = true;
                    String storedStudyUserId = prefs.getString(AnalyticsUtils.STUDY_USER_ID, "");
                    if (storedStudyUserId != null && !storedStudyUserId.isEmpty()) {
                        Log.d(TAG,
                                "handleIncomingIntent: Study enrollment link ignored because a study user ID is already stored.");
                    } else if (isHandlingIdConfirmation || isShowingEnrollmentSuccess) {
                        Log.d(TAG,
                                "handleIncomingIntent: Study enrollment UI already active. Ignoring duplicate link.");
                    } else {
                        isHandlingIdConfirmation = true;
                        dismissLanguagePopupIfShowing();

                        String confirmationMessage = confirmationMessageRaw;
                        if (confirmationMessage != null && confirmationMessage.length() > 800) {
                            confirmationMessage = confirmationMessage.substring(0, 800);
                        }

                        showConfirmIdDialog(newId, confirmationMessage, studyConsent);
                    }
                } else {
                    Log.w(TAG, "handleIncomingIntent: Invalid study_consent or empty ID. Enrollment aborted.");
                    // Flow aborted, app resumes normally (isHandlingIdConfirmation remains false)
                }
            }

            // Existing language parameter logic
            String language = data.getQueryParameter("language");
            if (language != null) {
                if (language.length() > 0) {
                    selectedLanguage = Character.toUpperCase(language.charAt(0))
                            + language.substring(1).toLowerCase();
                } else {
                    selectedLanguage = "";
                }
                storeSelectLanguage(selectedLanguage);
                runOnUiThread(() -> {
                    loadApps(selectedLanguage);
                });
            }

            if (handledStudyEnrollmentLink) {
                Intent consumedIntent = new Intent(intent);
                consumedIntent.setData(null);
                setIntent(consumedIntent);
            }
        }
    }

    private void dismissLanguagePopupIfShowing() {
        if (dialog != null && dialog.isShowing()) {
            dialog.dismiss();
        }
    }

    private void showConfirmIdDialog(final String newId, final String confirmationMessage, final String studyConsent) {
        runOnUiThread(() -> {
            try {
                final Dialog confirmDialog = new Dialog(this);
                confirmDialog.setContentView(R.layout.dialog_confirm_id);
                confirmDialog.setCanceledOnTouchOutside(false);
                confirmDialog.setOnDismissListener(dialogInterface -> isHandlingIdConfirmation = false);
                confirmDialog.setOnCancelListener(dialogInterface -> isHandlingIdConfirmation = false);
                if (confirmDialog.getWindow() != null) {
                    confirmDialog.getWindow().setBackgroundDrawable(
                            new android.graphics.drawable.ColorDrawable(android.graphics.Color.TRANSPARENT));
                }

                TextView newUserIdTv = confirmDialog.findViewById(R.id.new_user_id);
                newUserIdTv.setText(newId);

                if (confirmationMessage != null && !confirmationMessage.isEmpty()) {
                    TextView dialogMessageTv = confirmDialog.findViewById(R.id.dialog_message);
                    if (dialogMessageTv != null) {
                        dialogMessageTv.setText(confirmationMessage);
                        dialogMessageTv.setMovementMethod(new ScrollingMovementMethod());
                    }
                }

                Button btnConfirm = confirmDialog.findViewById(R.id.btn_confirm);

                // Add pulse/breathing micro-animation to the Confirm button
                ObjectAnimator scaleX = ObjectAnimator.ofFloat(btnConfirm, "scaleX", 1f, 1.05f, 1f);
                ObjectAnimator scaleY = ObjectAnimator.ofFloat(btnConfirm, "scaleY", 1f, 1.05f, 1f);
                scaleX.setDuration(1500);
                scaleY.setDuration(1500);
                scaleX.setRepeatCount(ValueAnimator.INFINITE);
                scaleY.setRepeatCount(ValueAnimator.INFINITE);
                scaleX.start();
                scaleY.start();

                btnConfirm.setOnClickListener(v -> {
                    btnConfirm.setEnabled(false);
                    scaleX.cancel();
                    scaleY.cancel();

                    String storedStudyUserId = prefs.getString(AnalyticsUtils.STUDY_USER_ID, "");
                    if (storedStudyUserId != null && !storedStudyUserId.isEmpty()) {
                        Log.d(TAG, "showConfirmIdDialog: Study user ID already stored. Confirmation ignored.");
                        confirmDialog.dismiss();
                        isHandlingIdConfirmation = false;
                        return;
                    }

                    SharedPreferences.Editor editor = prefs.edit();

                    editor.putString(AnalyticsUtils.STUDY_USER_ID, newId);
                    if (studyConsent != null && !studyConsent.isEmpty()) {
                        editor.putString("studyConsent", studyConsent);
                    }
                    editor.apply();

                    String joinedStudyAppVersion = appVersion;
                    if (joinedStudyAppVersion == null || joinedStudyAppVersion.isEmpty()) {
                        joinedStudyAppVersion = AppUtils.getAppVersionName(MainActivity.this);
                    }
                    String pseudoId = prefs.getString("pseudoId", "");
                    // Log joined-study confirmation event for analytics
                    AnalyticsUtils.logJoinedStudyEvent(
                            MainActivity.this,
                            pseudoId,
                            selectedLanguage,
                            joinedStudyAppVersion,
                            newId,
                            studyConsent);

                    debugOverlayManager.updateDebugOverlay();


                    // Reload apps with the new ID
                    if (selectedLanguage != null && !selectedLanguage.isEmpty()) {
                        loadApps(selectedLanguage);
                    }

                    Runnable onDismiss = () -> {
                        if (selectedLanguage == null || selectedLanguage.isEmpty()) {
                            languageDialogManager.showLanguagePopup();

                        }
                    };

                    showSuccessDialog(onDismiss);

                    confirmDialog.dismiss();
                    isHandlingIdConfirmation = false;
                });

                confirmDialog.show();

                // Entrance animation (scale up with overshoot)
                View decorView = confirmDialog.getWindow().getDecorView();
                View rootLayout = decorView.findViewById(android.R.id.content);
                if (rootLayout != null) {
                    rootLayout.setScaleX(0.7f);
                    rootLayout.setScaleY(0.7f);
                    rootLayout.setAlpha(0f);
                    rootLayout.animate()
                            .scaleX(1f)
                            .scaleY(1f)
                            .alpha(1f)
                            .setDuration(350)
                            .setInterpolator(new android.view.animation.OvershootInterpolator(1.2f))
                            .start();
                }
            } catch (Exception e) {
                Log.e(TAG, "showConfirmIdDialog: Failed to show confirmation dialog", e);
                isHandlingIdConfirmation = false;
            }
        });
    }

    private void showSuccessDialog(Runnable onDismissAction) {
        runOnUiThread(() -> {
            try {
                isShowingEnrollmentSuccess = true;
                final Dialog successDialog = new Dialog(this);
                successDialog.setContentView(R.layout.dialog_enrollment_success);
                successDialog.setCanceledOnTouchOutside(false);
                successDialog.setCancelable(false);
                Handler successHandler = new Handler(Looper.getMainLooper());
                final boolean[] dismissActionDelivered = { false };
                successDialog.setOnDismissListener(dialog -> {
                    isShowingEnrollmentSuccess = false;
                    if (!dismissActionDelivered[0] && onDismissAction != null) {
                        dismissActionDelivered[0] = true;
                        successHandler.post(onDismissAction);
                    }
                });
                if (successDialog.getWindow() != null) {
                    successDialog.getWindow().setBackgroundDrawable(
                            new android.graphics.drawable.ColorDrawable(android.graphics.Color.TRANSPARENT));
                }

                successDialog.show();

                successHandler.postDelayed(() -> {
                    if (successDialog.isShowing()) {
                        successDialog.dismiss();
                    }
                }, 2000);

            } catch (Exception e) {
                isShowingEnrollmentSuccess = false;
                Log.e(TAG, "showSuccessDialog: Failed to show success dialog", e);
            }
        });
    }

    private void setupVisualEffects() {
        RiveAnimationView monsterView = findViewById(R.id.monsterView);
        // We will update monster animation later when we have data, but initial call is
        // safe if data is ready
        // But better done in onResume or when data changes.
        // visualEffectsManager.updateMonsterAnimation... called in
        // onResume/storeLanguage

        View lightOverlay = findViewById(R.id.light_overlay);
        visualEffectsManager.addBreathingEffect(lightOverlay);

        ImageView sky = findViewById(R.id.imageView);
        ImageView foreground = findViewById(R.id.foreground_foliage);

        visualEffectsManager.applyCartoonEffect(sky);
        if (foreground != null) {
            visualEffectsManager.applyCartoonEffect(foreground);
            visualEffectsManager.addWindEffect(foreground);
        }
    }

    @Override
    public void onResume() {
        super.onResume();
        recyclerView.setAdapter(apps);

        debugOverlayManager.onResume();
        visualEffectsManager.resumeBreathingEffect();

        ImageView foliage = findViewById(R.id.foreground_foliage);
        if (foliage != null) {
            visualEffectsManager.resumeWindEffect(foliage);
        }

        RiveAnimationView monsterView = findViewById(R.id.monsterView);
        if (monsterView != null && apps != null) {
            visualEffectsManager.updateMonsterAnimation(monsterView, prefs, apps.webApps, selectedLanguage);
        }
    }

    @Override
    public void onPause() {
        super.onPause();
        debugOverlayManager.onPause();
        visualEffectsManager.pauseBreathingEffect();

        ImageView foliage = findViewById(R.id.foreground_foliage);
        if (foliage != null) {
            visualEffectsManager.pauseWindEffect(foliage);
        }
    }

    // --- ReferralManagerListener Implementation ---

    @Override
    public void onLanguageReceived(String language) {
        if (selectedLanguage.equals("")) {
            languageDialogManager.showLanguagePopup();
        } else {
            loadApps(language);
        }
    }

    @Override
    public void onShowLanguagePopup() {
        languageDialogManager.showLanguagePopup();
    }

    @Override
    public void onUpdateDebugOverlay() {
        debugOverlayManager.updateDebugOverlay();
    }

    @Override
    public void onReferrerStatusUpdate(InstallReferrerManager.ReferrerStatus status) {
        debugOverlayManager.updateDebugOverlay();
    }

    // --- LanguageDialogListener Implementation ---

    @Override
    public void onLanguageSelected(String language) {
        selectedLanguage = language;
        loadApps(language);
    }

    // --- Helper Methods ---

    public void loadApps(String selectedLanguageParam) {
        Log.d(TAG, "loadApps: Loading apps for language: " + selectedLanguage);
        loadingIndicator.setVisibility(View.VISIBLE);
        final String language = selectedLanguageParam;

        homeViewModal.getSelectedlanguageWebApps(selectedLanguageParam).observe(this,
                new androidx.lifecycle.Observer<List<WebApp>>() {
                    @Override
                    public void onChanged(List<WebApp> webApps) {
                        loadingIndicator.setVisibility(View.GONE);
                        if (!webApps.isEmpty()) {
                            apps.webApps = webApps;
                            apps.notifyDataSetChanged();
                            storeSelectLanguage(language);
                        } else {
                            if (!prefs.getString("selectedLanguage", "").equals("") && language.equals("")) {
                                languageDialogManager.showLanguagePopup();
                            }
                            if (manifestVersion.equals("")) {
                                if (!selectedLanguageParam.equals(isValidLanguage))
                                    loadingIndicator.setVisibility(View.VISIBLE);
                                homeViewModal.getAllWebApps();
                            }
                        }
                    }
                });
    }

    private void storeSelectLanguage(String language) {
        SharedPreferences.Editor editor = prefs.edit();
        editor.putString("selectedLanguage", language);
        editor.apply();
        Log.d(TAG, "storeSelectLanguage: Stored selected language: " + language);

        this.selectedLanguage = language; // Update local field
        debugOverlayManager.updateDebugOverlay();

        RiveAnimationView monsterView = findViewById(R.id.monsterView);
        if (monsterView != null && apps != null) {
            visualEffectsManager.updateMonsterAnimation(monsterView, prefs, apps.webApps, language);
        }
    }

    protected void initRecyclerView() {
        recyclerView = findViewById(R.id.recycleView);
        recyclerView.setLayoutManager(
                new GridLayoutManager(getApplicationContext(), 2, GridLayoutManager.HORIZONTAL, false));
        apps = new WebAppsAdapter(this, new ArrayList<>());
        recyclerView.setAdapter(apps);
    }

    private void cachePseudoId() {
        // Keeps logic for generating pseudoId
        // Assuming shared prefs logic is same or simplified
        if (!prefs.contains("pseudoId")) {
            SharedPreferences.Editor editor = prefs.edit();
            editor.putString("pseudoId",
                    generatePseudoId() + System.currentTimeMillis()); // Simplified suffix for brevity, original was
                                                                      // complex date
            editor.commit();
        }
    }

    // Kept for generatePseudoId dependency
    private String generatePseudoId() {
        java.security.SecureRandom random = new java.security.SecureRandom();
        return new java.math.BigInteger(130, random).toString(32);
    }

}

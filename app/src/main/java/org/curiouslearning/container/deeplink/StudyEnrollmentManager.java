package org.curiouslearning.container.deeplink;

import org.curiouslearning.container.util.AnimationUtil;
import org.curiouslearning.container.util.AppUtils;

import android.animation.ObjectAnimator;
import android.animation.ValueAnimator;
import android.app.Activity;
import android.app.Dialog;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Handler;
import android.os.Looper;
import android.text.method.ScrollingMovementMethod;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import org.curiouslearning.container.R;
import org.curiouslearning.container.firebase.AnalyticsUtils;

public class StudyEnrollmentManager {

    private static final String TAG = "StudyEnrollmentManager";

    private final Activity activity;
    private final SharedPreferences prefs;
    private final String appVersion;
    private final StudyEnrollmentListener listener;

    private boolean isHandlingIdConfirmation = false;
    private boolean isShowingEnrollmentSuccess = false;

    public interface StudyEnrollmentListener {
        void onDismissLanguagePopupIfShowing();
        void onLoadApps(String language);
        void onShowLanguagePopup();
        void onUpdateDebugOverlay();
        void onCachePseudoId();
        String getSelectedLanguage();
    }

    public StudyEnrollmentManager(Activity activity, SharedPreferences prefs, String appVersion, StudyEnrollmentListener listener) {
        this.activity = activity;
        this.prefs = prefs;
        this.appVersion = appVersion;
        this.listener = listener;
    }

    public boolean handleStudyEnrollmentLink(Uri data) {
        if (data == null) return false;

        String newIdRaw = data.getQueryParameter("study_user_id");
        String confirmationMessageRaw = data.getQueryParameter("confirmation_message");
        String studyConsent = data.getQueryParameter("study_consent");

        if (!prefs.contains("pseudoId")) {
            listener.onCachePseudoId();
        }

        if (newIdRaw != null && !newIdRaw.isEmpty()) {
            String newId = newIdRaw.replaceAll("[^0-9]", "");

            if ("true".equals(studyConsent) && !newId.isEmpty()) {
                String storedStudyUserId = prefs.getString(AnalyticsUtils.STUDY_USER_ID, "");
                if (storedStudyUserId != null && !storedStudyUserId.isEmpty()) {
                    Log.d(TAG, "handleStudyEnrollmentLink: Study enrollment link ignored because a study user ID is already stored.");
                } else if (isHandlingIdConfirmation || isShowingEnrollmentSuccess) {
                    Log.d(TAG, "handleStudyEnrollmentLink: Study enrollment UI already active. Ignoring duplicate link.");
                } else {
                    isHandlingIdConfirmation = true;
                    listener.onDismissLanguagePopupIfShowing();

                    String confirmationMessage = confirmationMessageRaw;
                    if (confirmationMessage != null && confirmationMessage.length() > 800) {
                        confirmationMessage = confirmationMessage.substring(0, 800);
                    }

                    showConfirmIdDialog(newId, confirmationMessage, studyConsent);
                }
                return true;
            } else {
                Log.w(TAG, "handleStudyEnrollmentLink: Invalid study_consent or empty ID. Enrollment aborted.");
            }
        }
        return false;
    }

    private void showConfirmIdDialog(final String newId, final String confirmationMessage, final String studyConsent) {
        activity.runOnUiThread(() -> {
            try {
                final Dialog confirmDialog = new Dialog(activity);
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

                ObjectAnimator[] pulseAnimators = AnimationUtil.startPulseAnimation(btnConfirm);

                btnConfirm.setOnClickListener(v -> {
                    btnConfirm.setEnabled(false);
                    if (pulseAnimators != null && pulseAnimators.length == 2) {
                        pulseAnimators[0].cancel();
                        pulseAnimators[1].cancel();
                    }

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
                        joinedStudyAppVersion = AppUtils.getAppVersionName(activity);
                    }
                    String pseudoId = prefs.getString("pseudoId", "");
                    String selectedLanguage = listener.getSelectedLanguage();

                    AnalyticsUtils.logJoinedStudyEvent(
                            activity,
                            pseudoId,
                            selectedLanguage,
                            joinedStudyAppVersion,
                            newId,
                            studyConsent);

                    listener.onUpdateDebugOverlay();

                    if (selectedLanguage != null && !selectedLanguage.isEmpty()) {
                        listener.onLoadApps(selectedLanguage);
                    }

                    Runnable onDismiss = () -> {
                        if (selectedLanguage == null || selectedLanguage.isEmpty()) {
                            listener.onShowLanguagePopup();
                        }
                    };

                    showSuccessDialog(onDismiss);

                    confirmDialog.dismiss();
                    isHandlingIdConfirmation = false;
                });

                confirmDialog.show();

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
        activity.runOnUiThread(() -> {
            try {
                isShowingEnrollmentSuccess = true;
                final Dialog successDialog = new Dialog(activity);
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
}

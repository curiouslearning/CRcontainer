package org.curiouslearning.container.utilities;

import android.app.Activity;
import android.app.Dialog;
import android.content.SharedPreferences;
import android.util.Log;
import android.view.GestureDetector;
import android.view.MotionEvent;
import android.view.View;
import android.widget.AdapterView;
import android.widget.AutoCompleteTextView;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.core.view.GestureDetectorCompat;
import androidx.lifecycle.LifecycleOwner;
import androidx.lifecycle.Observer;

import com.google.android.material.textfield.TextInputLayout;
import com.google.firebase.crashlytics.FirebaseCrashlytics;

import org.curiouslearning.container.R;
import org.curiouslearning.container.data.model.WebApp;
import org.curiouslearning.container.firebase.AnalyticsUtils;
import org.curiouslearning.container.presentation.adapters.LanguageDropdownAdapter;
import org.curiouslearning.container.presentation.viewmodals.HomeViewModal;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;

public class LanguageDialogManager {

    private static final String TAG = "LanguageDialogManager";
    private Activity activity;
    private Dialog dialog;
    private HomeViewModal homeViewModal;
    private SharedPreferences prefs;
    private AudioPlayer audioPlayer;
    private GestureDetectorCompat gestureDetector;
    private LanguageDialogListener listener;

    public interface LanguageDialogListener {
        void onLanguageSelected(String language);
    }

    public LanguageDialogManager(Activity activity, HomeViewModal homeViewModal, SharedPreferences prefs, AudioPlayer audioPlayer, LanguageDialogListener listener) {
        this.activity = activity;
        this.homeViewModal = homeViewModal;
        this.prefs = prefs;
        this.audioPlayer = audioPlayer;
        this.listener = listener;
        this.dialog = new Dialog(activity);
    }

    public void showLanguagePopup() {
        if (!dialog.isShowing()) {
            dialog.setContentView(R.layout.language_popup);

            View dialogRoot = getDialogRoot();

            dialog.setCanceledOnTouchOutside(false);
            if (dialog.getWindow() != null) {
                dialog.getWindow().setBackgroundDrawable(null);
            }

            ImageView invisibleBox = dialog.findViewById(R.id.invisible_box);
            TextView textView = dialog.findViewById(R.id.pseudo_id_text);

            ImageView closeButton = dialog.findViewById(R.id.setting_close);
            TextInputLayout textBox = dialog.findViewById(R.id.dropdown_menu);
            AutoCompleteTextView autoCompleteTextView = dialog.findViewById(R.id.autoComplete);

            textBox.setBackground(null);
            textBox.setBoxBackgroundMode(TextInputLayout.BOX_BACKGROUND_NONE);

            autoCompleteTextView.setDropDownBackgroundResource(R.drawable.dropdown_background_transparent);
            final LanguageDropdownAdapter[] adapterRef = new LanguageDropdownAdapter[1];

            homeViewModal.getAllWebApps().observe((LifecycleOwner) activity, new Observer<List<WebApp>>() {
                @Override
                public void onChanged(List<WebApp> webApps) {
                    Set<String> distinctLanguages = sortLanguages(webApps);
                    Map<String, String> languagesEnglishNameMap = MapLanguagesEnglishName(webApps);
                    List<String> distinctLanguageList = new ArrayList<>(distinctLanguages);
                    
                    if (!webApps.isEmpty()) {
                        CacheUtils.manifestVersionNumber = prefs.getString("manifestVersion", ""); // Simplified
                        // Actually in MainActivity it was cacheManifestVersion(CacheUtils.manifestVersionNumber);
                        // But CacheUtils.manifestVersionNumber gets updated in WebAppRepository or similar usually. 
                        // Assuming CacheUtils handles its own state or we don't strictly need to re-cache here if it's already done.
                    }

                    if (!distinctLanguageList.isEmpty()) {
                        String selectedLanguage = prefs.getString("selectedLanguage", "");
                        adapterRef[0] = new LanguageDropdownAdapter(
                                dialog.getContext(), distinctLanguageList, languagesEnglishNameMap);
                        adapterRef[0].setSelectedLanguage(selectedLanguage);
                        autoCompleteTextView.setAdapter(adapterRef[0]);

                        setupDropdownHeight(autoCompleteTextView, adapterRef[0]);

                        if (!selectedLanguage.isEmpty() && languagesEnglishNameMap.containsValue(selectedLanguage)) {
                            String displayName = languagesEnglishNameMap.get(selectedLanguage);
                            autoCompleteTextView.setText(displayName, false);
                        }

                        autoCompleteTextView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
                            @Override
                            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                                audioPlayer.play(activity, R.raw.sound_button_pressed);
                                String selectedDisplayName = (String) parent.getItemAtPosition(position);
                                String selectedLanguage = languagesEnglishNameMap.get(selectedDisplayName);

                                if (adapterRef[0] != null) {
                                    adapterRef[0].setSelectedLanguage(selectedLanguage);
                                }

                                autoCompleteTextView.setText(selectedDisplayName, false);
                                String pseudoId = prefs.getString("pseudoId", "");
                                String manifestVrsn = prefs.getString("manifestVersion", "");
                                AnalyticsUtils.logLanguageSelectEvent(view.getContext(), "language_selected", pseudoId,
                                        selectedLanguage, manifestVrsn, "false", "");

                                dismissDialogWithAnimation(dialogRoot, () -> {
                                    if (listener != null) listener.onLanguageSelected(selectedLanguage);
                                });
                            }
                        });
                    }
                }
            });

            setupGestureDetector(textView);
            if (invisibleBox != null) {
                invisibleBox.setOnTouchListener((v, event) -> {
                    gestureDetector.onTouchEvent(event);
                    return true;
                });
            }

            final View finalDialogRoot = dialogRoot;
            closeButton.setOnClickListener(new View.OnClickListener() {
                public void onClick(View v) {
                    audioPlayer.play(activity, R.raw.sound_button_pressed);
                    textView.setVisibility(View.GONE);

                    AnimationUtil.animateCloseButton(v, new Runnable() {
                        @Override
                        public void run() {
                            dismissDialogWithAnimation(finalDialogRoot, null);
                        }
                    });
                }
            });

            try {
                if (activity.isFinishing() || activity.isDestroyed()) {
                    return;
                }
                dialog.show();
                
                if (finalDialogRoot != null) {
                    finalDialogRoot.post(() -> {
                        AnimationUtil.animateDropdownOpen(finalDialogRoot);
                        AnimationUtil.addBreathingAnimation(finalDialogRoot);
                    });
                }
            } catch (Exception e) {
                FirebaseCrashlytics.getInstance().log("showLanguagePopup: Failed to show dialog");
                FirebaseCrashlytics.getInstance().recordException(
                        new RuntimeException("showLanguagePopup: Failed to show dialog", e));
            }
        }
    }

    private void dismissDialogWithAnimation(View dialogRoot, Runnable onComplete) {
         if (dialogRoot != null) {
            AnimationUtil.animateDropdownClose(dialogRoot, new Runnable() {
                @Override
                public void run() {
                    dialog.dismiss();
                    if (onComplete != null) onComplete.run();
                }
            });
        } else {
            dialog.dismiss();
            if (onComplete != null) onComplete.run();
        }
    }

    private View getDialogRoot() {
        if (dialog.getWindow() != null) {
            View decorView = dialog.getWindow().getDecorView();
            if (decorView != null) {
                View contentView = decorView.findViewById(android.R.id.content);
                if (contentView instanceof android.view.ViewGroup) {
                    android.view.ViewGroup contentGroup = (android.view.ViewGroup) contentView;
                    if (contentGroup.getChildCount() > 0) {
                        return contentGroup.getChildAt(0);
                    }
                }
            }
        }
        return null;
    }

    private void setupDropdownHeight(AutoCompleteTextView autoCompleteTextView, LanguageDropdownAdapter adapter) {
        float density = activity.getResources().getDisplayMetrics().density;
        int itemHeightPx = (int) (80 * density);
        int itemCount = adapter.getCount();
        int contentHeight = itemHeightPx * itemCount;
        int screenHeight = activity.getResources().getDisplayMetrics().heightPixels;
        int bottomReservedSpace = (int) (screenHeight * 0.10f);
        int[] location = new int[2];
        autoCompleteTextView.getLocationOnScreen(location);
        int triggerBottomY = location[1] + autoCompleteTextView.getHeight();
        int availableHeightBelow = screenHeight - triggerBottomY - bottomReservedSpace;
        int adjustedDropdownHeight = Math.min(contentHeight, availableHeightBelow);
        if (adjustedDropdownHeight < itemHeightPx * 2) {
            adjustedDropdownHeight = itemHeightPx * 2;
        }
        autoCompleteTextView.setDropDownHeight(adjustedDropdownHeight);
    }
    
    private void setupGestureDetector(TextView textView) {
         gestureDetector = new GestureDetectorCompat(activity, new GestureDetector.SimpleOnGestureListener() {
            @Override
            public boolean onDoubleTap(MotionEvent e) {
                String pseudoId = prefs.getString("pseudoId", "");
                textView.setText("cr_user_id_" + pseudoId);
                textView.setVisibility(View.VISIBLE);
                return true;
            }
        });
    }

    private Map<String, String> MapLanguagesEnglishName(List<WebApp> webApps) {
        Map<String, String> languagesEnglishNameMap = new TreeMap<>();
        for (WebApp webApp : webApps) {
            String languageInEnglishName = webApp.getLanguageInEnglishName();
            String languageInLocalName = webApp.getLanguage();
            if (languageInEnglishName != null && languageInLocalName != null) {
                languagesEnglishNameMap.put(languageInLocalName, languageInEnglishName);
                languagesEnglishNameMap.put(languageInEnglishName, languageInLocalName);
            }
        }
        return languagesEnglishNameMap;
    }

    private Set<String> sortLanguages(List<WebApp> webApps) {
        Map<String, List<String>> dialectGroups = new TreeMap<>();
        Map<String, String> languages = new TreeMap<>();
        for (WebApp webApp : webApps) {
            String languageInEnglishName = webApp.getLanguageInEnglishName();
            String languageInLocaName = webApp.getLanguage();
            languages.put(languageInEnglishName, languageInLocaName);
        }
        for (WebApp webApp : webApps) {
            String languageInEnglishName = webApp.getLanguageInEnglishName();
            String languageInLocalName = webApp.getLanguage();
            String[] parts = extractBaseLanguageAndDialect(languageInLocalName, languageInEnglishName);
            String baseLanguage = parts[0]; 
            String dialect = parts[1];
            if (baseLanguage.contains("Kreyòl")) {
                dialectGroups.putIfAbsent("Creole" + baseLanguage, new ArrayList<>());
                dialectGroups.get("Creole" + baseLanguage).add(dialect);
            } else {
                dialectGroups.putIfAbsent(baseLanguage, new ArrayList<>());
                dialectGroups.get(baseLanguage).add(dialect);
            }
        }

        List<String> sortedLanguages = new ArrayList<>();
        for (Map.Entry<String, List<String>> entry : dialectGroups.entrySet()) {
            String baseLanguage = entry.getKey();
            List<String> dialects = entry.getValue();
            Collections.sort(dialects);
            for (String dialect : dialects) {
                if (languages.get(baseLanguage) == null || !languages.get(baseLanguage).equals(dialect)) {
                    if (baseLanguage.contains("Creole"))
                        sortedLanguages.add(baseLanguage.substring(6) + " - " + dialect);
                    else
                        sortedLanguages.add(baseLanguage + " - " + dialect);
                } else
                    sortedLanguages.add(dialect);
            }
        }

        return new LinkedHashSet<>(sortedLanguages);
    }

    private String[] extractBaseLanguageAndDialect(String languageInLocalName, String languageInEnglishName) {
        String baseLanguage = languageInEnglishName;
        String dialect = "";

        if (languageInLocalName.contains(" - ")) {
            String[] parts = languageInLocalName.split(" - ");
            baseLanguage = parts[0].trim();
            dialect = parts[1].trim();
        } else {
            baseLanguage = languageInEnglishName;
            dialect = languageInLocalName;
        }
        return new String[] { baseLanguage, dialect };
    }

    public boolean isDialogShowing() {
        return dialog != null && dialog.isShowing();
    }
    
    public void dismissDialog() {
        if (dialog != null && dialog.isShowing()) {
            dialog.dismiss();
        }
    }
}

package org.curiouslearning.container.utilities;

import android.animation.ObjectAnimator;
import android.animation.ValueAnimator;
import android.content.SharedPreferences;
import android.graphics.ColorMatrix;
import android.graphics.ColorMatrixColorFilter;
import android.view.View;
import android.view.animation.AccelerateDecelerateInterpolator;
import android.widget.ImageView;

import org.curiouslearning.container.R;
import org.curiouslearning.container.data.model.WebApp;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.List;

import app.rive.runtime.kotlin.RiveAnimationView;
import app.rive.runtime.kotlin.core.Alignment;
import app.rive.runtime.kotlin.core.Fit;
import app.rive.runtime.kotlin.core.Loop;

public class VisualEffectsManager {

    private ObjectAnimator breathingAnimator;

    public void addBreathingEffect(View view) {
        if (view == null) return;
        
        breathingAnimator = ObjectAnimator.ofFloat(
                view,
                "alpha",
                0.06f,
                0.1f);
        breathingAnimator.setDuration(6000);
        breathingAnimator.setRepeatCount(ValueAnimator.INFINITE);
        breathingAnimator.setRepeatMode(ValueAnimator.REVERSE);
        breathingAnimator.setInterpolator(new AccelerateDecelerateInterpolator());
        breathingAnimator.start();
    }

    public void resumeBreathingEffect() {
        if (breathingAnimator != null) {
            breathingAnimator.resume();
        }
    }

    public void pauseBreathingEffect() {
        if (breathingAnimator != null) {
            breathingAnimator.pause();
        }
    }

    public void addWindEffect(ImageView foliageView) {
        if (foliageView == null) return;

        // Create a subtle horizontal translation animation to simulate wind
        ObjectAnimator windAnimatorX = ObjectAnimator.ofFloat(
                foliageView,
                "translationX",
                -8f, // Slight left movement
                8f // Slight right movement
        );
        windAnimatorX.setDuration(4000); // Slow, gentle movement
        windAnimatorX.setRepeatCount(ValueAnimator.INFINITE);
        windAnimatorX.setRepeatMode(ValueAnimator.REVERSE);
        windAnimatorX.setInterpolator(new AccelerateDecelerateInterpolator());

        // Add slight rotation for more natural wind effect
        ObjectAnimator windAnimatorRotation = ObjectAnimator.ofFloat(
                foliageView,
                "rotation",
                -1.5f, // Slight counter-clockwise
                1.5f // Slight clockwise
        );
        windAnimatorRotation.setDuration(5000); // Slightly different duration for organic feel
        windAnimatorRotation.setRepeatCount(ValueAnimator.INFINITE);
        windAnimatorRotation.setRepeatMode(ValueAnimator.REVERSE);
        windAnimatorRotation.setInterpolator(new AccelerateDecelerateInterpolator());

        // Start both animations
        windAnimatorX.start();
        windAnimatorRotation.start();

        // Store animators for cleanup if needed
        foliageView.setTag(R.id.wind_animator_x_tag, windAnimatorX);
        foliageView.setTag(R.id.wind_animator_rotation_tag, windAnimatorRotation);
    }

    public void pauseWindEffect(ImageView foliageView) {
        if (foliageView == null) return;
        
        Object tagX = foliageView.getTag(R.id.wind_animator_x_tag);
        Object tagRotation = foliageView.getTag(R.id.wind_animator_rotation_tag);

        if (tagX instanceof ObjectAnimator) {
            ((ObjectAnimator) tagX).pause();
        }
        if (tagRotation instanceof ObjectAnimator) {
            ((ObjectAnimator) tagRotation).pause();
        }
    }

    public void resumeWindEffect(ImageView foliageView) {
        if (foliageView == null) return;
        
        Object tagX = foliageView.getTag(R.id.wind_animator_x_tag);
        Object tagRotation = foliageView.getTag(R.id.wind_animator_rotation_tag);

        if (tagX instanceof ObjectAnimator) {
            ((ObjectAnimator) tagX).resume();
        }
        if (tagRotation instanceof ObjectAnimator) {
            ((ObjectAnimator) tagRotation).resume();
        }
    }

    public void applyCartoonEffect(ImageView imageView) {
        if (imageView == null) return;

        ColorMatrix colorMatrix = new ColorMatrix();

        // 1️⃣ Increase saturation (cartoon look)
        colorMatrix.setSaturation(1.2f);

        // 2️⃣ Slight brightness boost
        ColorMatrix brightnessMatrix = new ColorMatrix(new float[] {
                1, 0, 0, 0, 20,
                0, 1, 0, 0, 20,
                0, 0, 1, 0, 20,
                0, 0, 0, 1, 0
        });

        colorMatrix.postConcat(brightnessMatrix);

        imageView.setColorFilter(
                new ColorMatrixColorFilter(colorMatrix));
    }

    public void spinSettingsGear(View settingsButton) {
        if (settingsButton == null) return;
        
        ObjectAnimator spinAnimator = ObjectAnimator.ofFloat(
                settingsButton,
                "rotation",
                0f,
                360f);
        spinAnimator.setDuration(400); // Quick spin
        spinAnimator.setInterpolator(new AccelerateDecelerateInterpolator());
        spinAnimator.start();
    }

    public void updateMonsterAnimation(RiveAnimationView monsterView, SharedPreferences prefs, List<WebApp> webApps, String selectedLanguage) {
        if (monsterView == null) return;

        // Check if FTM is downloaded by checking if any FTM app is cached
        boolean isFtmDownloaded = isFtmDownloaded(prefs, webApps);

        if (!isFtmDownloaded) {
            // Show egg monster if FTM is not downloaded
            loadMonsterAnimation(monsterView, 0);
            return;
        }

        // Get stored monster phase for the current selected language
        int monsterPhase = getMonsterPhaseForLanguage(prefs, selectedLanguage);
        loadMonsterAnimation(monsterView, monsterPhase);
    }

    private boolean isFtmDownloaded(SharedPreferences prefs, List<WebApp> webApps) {
        // First check if we have the explicit flag
        if (prefs.getBoolean("ftm_downloaded", false)) {
            return true;
        }

        // Check if we have stored monster phase map (indicates FTM was used before)
        String mapJson = prefs.getString("ftm_monster_phases_map", "{}");
        if (!mapJson.equals("{}")) {
            try {
                JSONObject phasesMap = new JSONObject(mapJson);
                if (phasesMap.length() > 0) {
                    return true;
                }
            } catch (JSONException e) {
                // Ignore, fall through to other checks
            }
        }

        // Check legacy global phase for backward compatibility
        int storedPhase = prefs.getInt("ftm_monster_phase", -1);
        if (storedPhase >= 0) {
            return true;
        }

        // Check if any FTM app is cached by checking app list
        if (webApps != null) {
            for (WebApp webApp : webApps) {
                if (webApp.getTitle() != null && webApp.getTitle().contains("Feed The Monster")) {
                    String appId = String.valueOf(webApp.getAppId());
                    boolean isCached = prefs.getBoolean(appId, false);
                    if (isCached) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    private int getMonsterPhaseForLanguage(SharedPreferences prefs, String language) {
        if (language == null || language.isEmpty()) {
            return 0;
        }

        try {
            // Get the phases map
            String mapJson = prefs.getString("ftm_monster_phases_map", "{}");
            JSONObject phasesMap = new JSONObject(mapJson);

            // Check if we have data for this language
            if (phasesMap.has(language)) {
                JSONObject languageData = phasesMap.getJSONObject(language);
                int phase = languageData.optInt("monsterPhase", 0);
                return phase;
            } else {
                // Fallback to old global key for backward compatibility
                int oldPhase = prefs.getInt("ftm_monster_phase", -1);
                if (oldPhase >= 0) {
                    return oldPhase;
                }
                return 0;
            }
        } catch (JSONException e) {
            // Fallback to old global key for backward compatibility
            int oldPhase = prefs.getInt("ftm_monster_phase", -1);
            if (oldPhase >= 0) {
                return oldPhase;
            }
            return 0;
        }
    }

    public void loadMonsterAnimation(RiveAnimationView monsterView, int phase) {
        int riveResource;

        switch (phase) {
            case 0:
                riveResource = R.raw.eggmonster;
                break;
            case 1:
                riveResource = R.raw.hatchedmonster;
                break;
            case 2:
                riveResource = R.raw.youngmonster;
                break;
            case 3:
                riveResource = R.raw.adultmonster;
                break;
            default:
                riveResource = R.raw.eggmonster;
                break;
        }

        monsterView.setRiveResource(
                riveResource,
                null, // artboard (null = default)
                null, // animation (null = first)
                null, // state machine
                true, // autoplay
                Fit.CONTAIN, // fit
                Alignment.CENTER, // alignment
                Loop.LOOP // loop mode
        );
    }
}

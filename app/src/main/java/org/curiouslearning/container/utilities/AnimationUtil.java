package org.curiouslearning.container.utilities;

import android.animation.Animator;
import android.animation.AnimatorSet;
import android.animation.ObjectAnimator;
import android.view.View;
import android.view.animation.OvershootInterpolator;

import org.curiouslearning.container.R;

public class AnimationUtil {

    // Private constructor to prevent instantiation (utility class)
    private AnimationUtil() {
        throw new UnsupportedOperationException("Utility class - cannot be instantiated");
    }

    public static void scaleButton(final View view, final Runnable endAction) {
        view.animate()
                .scaleX(1.2f)
                .scaleY(1.2f)
                .setDuration(100) // Increased duration for a smoother effect, you can adjust as needed
                .withEndAction(new Runnable() {
                    @Override
                    public void run() {
                        view.animate()
                                .scaleX(1.0f)
                                .scaleY(1.0f)
                                .setDuration(100) // Increased duration for a smoother effect, you can adjust as needed
                                .withEndAction(new Runnable() {
                                    @Override
                                    public void run() {
                                        if (endAction != null) {
                                            endAction.run();
                                        }
                                    }
                                })
                                .start();
                    }
                })
                .start();
    }

    /**
     * Animates dropdown entrance with fade, scale, and translate effects.
     * Uses OvershootInterpolator for a bouncy, polished feel.
     * 
     * @param root The root view of the dropdown (typically the dialog's content
     *             view)
     */
    public static void animateDropdownOpen(View root) {
        if (root == null)
            return;

        // Convert 20dp to pixels
        float translationY = 20f * root.getResources().getDisplayMetrics().density;

        // Cancel any existing animations to prevent conflicts
        Object tag = root.getTag(R.id.dropdown_animator_tag);
        if (tag instanceof Animator) {
            ((Animator) tag).cancel();
            root.setTag(R.id.dropdown_animator_tag, null);
        }
        root.animate().cancel();
        root.clearAnimation();

        // Set initial state
        root.setAlpha(0f);
        root.setScaleX(0.9f);
        root.setScaleY(0.9f);
        root.setTranslationY(translationY);

        // Create animators
        ObjectAnimator fadeIn = ObjectAnimator.ofFloat(root, "alpha", 0f, 1f);
        ObjectAnimator scaleX = ObjectAnimator.ofFloat(root, "scaleX", 0.9f, 1f);
        ObjectAnimator scaleY = ObjectAnimator.ofFloat(root, "scaleY", 0.9f, 1f);
        ObjectAnimator translateY = ObjectAnimator.ofFloat(root, "translationY", translationY, 0f);

        // Set duration (400ms for smooth, responsive feel)
        int duration = 400;
        fadeIn.setDuration(duration);
        scaleX.setDuration(duration);
        scaleY.setDuration(duration);
        translateY.setDuration(duration);

        // Use OvershootInterpolator for bouncy entrance
        OvershootInterpolator overshoot = new OvershootInterpolator(1.2f);
        fadeIn.setInterpolator(overshoot);
        scaleX.setInterpolator(overshoot);
        scaleY.setInterpolator(overshoot);
        translateY.setInterpolator(overshoot);

        // Play all animations together
        AnimatorSet animatorSet = new AnimatorSet();
        animatorSet.playTogether(fadeIn, scaleX, scaleY, translateY);
        animatorSet.start();

        // Store animator set for potential cancellation using string tag
        root.setTag(R.id.dropdown_animator_tag, animatorSet);
    }

    /**
     * Animates dropdown exit with fade, scale, and translate effects.
     * Dismisses the dialog after animation completes.
     * 
     * @param root  The root view of the dropdown
     * @param onEnd Runnable to execute after animation completes (typically
     *              dialog.dismiss())
     */
    public static void animateDropdownClose(View root, Runnable onEnd) {
        if (root == null) {
            if (onEnd != null)
                onEnd.run();
            return;
        }

        // Convert 20dp to pixels
        float translationY = 20f * root.getResources().getDisplayMetrics().density;

        // Cancel any existing animations
        Object tag = root.getTag(R.id.dropdown_animator_tag);
        if (tag instanceof Animator) {
            ((Animator) tag).cancel();
        }
        root.animate().cancel();
        root.clearAnimation();

        // Create animators
        ObjectAnimator fadeOut = ObjectAnimator.ofFloat(root, "alpha", 1f, 0f);
        ObjectAnimator scaleX = ObjectAnimator.ofFloat(root, "scaleX", 1f, 0.9f);
        ObjectAnimator scaleY = ObjectAnimator.ofFloat(root, "scaleY", 1f, 0.9f);
        ObjectAnimator translateY = ObjectAnimator.ofFloat(root, "translationY", 0f, translationY);

        // Set duration (280ms for quick, responsive exit)
        int duration = 280;
        fadeOut.setDuration(duration);
        scaleX.setDuration(duration);
        scaleY.setDuration(duration);
        translateY.setDuration(duration);

        // Play all animations together
        AnimatorSet animatorSet = new AnimatorSet();
        animatorSet.playTogether(fadeOut, scaleX, scaleY, translateY);

        // Execute onEnd callback after animation completes
        animatorSet.addListener(new Animator.AnimatorListener() {
            @Override
            public void onAnimationStart(Animator animation) {
                // No action needed on start
            }

            @Override
            public void onAnimationEnd(Animator animation) {
                if (onEnd != null) {
                    onEnd.run();
                }
            }

            @Override
            public void onAnimationCancel(Animator animation) {
                // If cancelled, still execute onEnd to ensure dialog is dismissed
                if (onEnd != null) {
                    onEnd.run();
                }
            }

            @Override
            public void onAnimationRepeat(Animator animation) {
                // Not used for this animation
            }
        });

        animatorSet.start();
    }

    /**
     * Animates the close button with rotation and scale effects.
     * Provides immediate visual feedback when tapped.
     * 
     * @param closeBtn The close button view
     * @param onEnd    Runnable to execute after animation completes (typically
     *                 triggers dropdown close)
     */
    public static void animateCloseButton(View closeBtn, Runnable onEnd) {
        if (closeBtn == null) {
            if (onEnd != null)
                onEnd.run();
            return;
        }

        // Cancel any existing animations
        closeBtn.animate().cancel();
        closeBtn.clearAnimation();

        // Get current rotation to handle multiple rapid taps
        float currentRotation = closeBtn.getRotation();

        // Create animators
        ObjectAnimator rotate = ObjectAnimator.ofFloat(closeBtn, "rotation", currentRotation, currentRotation + 180f);
        ObjectAnimator scaleDown = ObjectAnimator.ofFloat(closeBtn, "scaleX", 1f, 0.85f);
        ObjectAnimator scaleDownY = ObjectAnimator.ofFloat(closeBtn, "scaleY", 1f, 0.85f);

        // Scale back up
        ObjectAnimator scaleUp = ObjectAnimator.ofFloat(closeBtn, "scaleX", 0.85f, 1f);
        ObjectAnimator scaleUpY = ObjectAnimator.ofFloat(closeBtn, "scaleY", 0.85f, 1f);

        // Set durations
        rotate.setDuration(300); // Quick rotation
        scaleDown.setDuration(150);
        scaleDownY.setDuration(150);
        scaleUp.setDuration(150);
        scaleUpY.setDuration(150);

        // Create sequence: scale down + rotate, then scale up
        AnimatorSet scaleDownSet = new AnimatorSet();
        scaleDownSet.playTogether(scaleDown, scaleDownY);

        AnimatorSet scaleUpSet = new AnimatorSet();
        scaleUpSet.playTogether(scaleUp, scaleUpY);

        AnimatorSet animatorSet = new AnimatorSet();
        animatorSet.play(scaleDownSet).with(rotate);
        animatorSet.play(scaleUpSet).after(scaleDownSet);

        // Execute onEnd callback after animation completes
        animatorSet.addListener(new Animator.AnimatorListener() {
            @Override
            public void onAnimationStart(Animator animation) {
                // No action needed on start
            }

            @Override
            public void onAnimationEnd(Animator animation) {
                if (onEnd != null) {
                    onEnd.run();
                }
            }

            @Override
            public void onAnimationCancel(Animator animation) {
                // Reset scale if cancelled
                closeBtn.setScaleX(1f);
                closeBtn.setScaleY(1f);
                if (onEnd != null) {
                    onEnd.run();
                }
            }

            @Override
            public void onAnimationRepeat(Animator animation) {
                // Not used for this animation
            }
        });

        animatorSet.start();
    }

    /**
     * Adds a subtle breathing animation to the dropdown card.
     * Very lightweight and battery-friendly - uses alpha animation only.
     * 
     * @param root The root view of the dropdown
     * @return The animator for potential cancellation
     */
    public static Animator addBreathingAnimation(View root) {
        if (root == null)
            return null;

        // Cancel any existing breathing animation
        Object tag = root.getTag(R.id.breathing_animator_tag);
        if (tag instanceof Animator) {
            ((Animator) tag).cancel();
        }

        // Very subtle alpha breathing (1.0 to 0.98)
        ObjectAnimator breathing = ObjectAnimator.ofFloat(root, "alpha", 1f, 0.98f);
        breathing.setDuration(3000); // Slow, gentle breathing
        breathing.setRepeatCount(ObjectAnimator.INFINITE);
        breathing.setRepeatMode(ObjectAnimator.REVERSE);
        breathing.start();

        // Store for cancellation
        root.setTag(R.id.breathing_animator_tag, breathing);

        return breathing;
    }

    /**
     * Stops the breathing animation if it's running.
     * 
     * @param root The root view of the dropdown
     */
    public static void stopBreathingAnimation(View root) {
        if (root == null)
            return;

        Object tag = root.getTag(R.id.breathing_animator_tag);
        if (tag instanceof Animator) {
            ((Animator) tag).cancel();
            root.setTag(R.id.breathing_animator_tag, null);
        }
    }
}

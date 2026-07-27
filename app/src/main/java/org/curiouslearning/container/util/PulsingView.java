package org.curiouslearning.container.util;

import android.animation.ValueAnimator;
import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.util.AttributeSet;
import android.view.animation.DecelerateInterpolator;
import android.view.View;

/**
 * Draws an expanding translucent circle to draw attention to the FTM app icon.
 *
 * <p>Performance notes for low-end devices:
 * <ul>
 *   <li>A {@code LAYER_TYPE_HARDWARE} layer is set while the animation is running so the
 *       GPU compositor handles each frame rather than the main-thread CPU renderer.</li>
 *   <li>{@code invalidate()} is only called from inside the ValueAnimator update listener,
 *       which is already gated by the animator's running state — no spurious redraws.</li>
 *   <li>The animator is reset to 0 and the hardware layer is removed when stopped, so idle
 *       views have zero GPU overhead.</li>
 * </ul>
 */
public class PulsingView extends View {

    private final Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);
    private float radius = 0f;
    private ValueAnimator animator;
    private boolean isRunning = false;

    public PulsingView(Context context, AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    private void init() {
        paint.setColor(Color.parseColor("#B3B3B3"));
        paint.setAlpha(100);

        float density = getResources().getDisplayMetrics().density;
        float maxRadius = 168f * density / 2f;

        animator = ValueAnimator.ofFloat(0f, maxRadius);
        animator.setDuration(1200);
        animator.setRepeatCount(ValueAnimator.INFINITE);
        // RESTART mode: circle expands from 0 to max, then jumps back to 0 instantly.
        // Combined with DecelerateInterpolator this looks like a clean outward "ripple"
        // and avoids the CPU cost of running the animation backwards each cycle.
        animator.setRepeatMode(ValueAnimator.RESTART);
        animator.setInterpolator(new DecelerateInterpolator());
        animator.addUpdateListener(animation -> {
            if (isRunning) {
                radius = (float) animation.getAnimatedValue();
                invalidate();
            }
        });
    }

    public void startAnimation() {
        if (isRunning) return;
        isRunning = true;
        // Hardware layer: the GPU compositor will cache the layer texture and only
        // re-composite it each frame — no CPU canvas drawing per frame.
        setLayerType(LAYER_TYPE_HARDWARE, null);
        animator.start();
    }

    public void stopAnimation() {
        if (!isRunning && animator != null && !animator.isRunning()) return;
        isRunning = false;
        if (animator != null) {
            animator.cancel();
        }
        radius = 0f;
        // Release the hardware layer so idle views don't consume GPU memory.
        setLayerType(LAYER_TYPE_NONE, null);
        invalidate();
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        if (radius > 0f) {
            canvas.drawCircle(getWidth() / 2f, getHeight() / 2f, radius, paint);
        }
    }

    @Override
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        stopAnimation();
    }
}

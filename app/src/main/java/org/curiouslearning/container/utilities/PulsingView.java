package org.curiouslearning.container.utilities;

import android.animation.ValueAnimator;
import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.util.AttributeSet;
import android.view.View;

public class PulsingView extends View {


    private Paint paint;
    private float radius;
    private ValueAnimator animator;

    public PulsingView(Context context, AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    private void init() {
        paint = new Paint();
        paint.setColor(Color.parseColor("#B3B3B3")); // Grey color
        paint.setAlpha(100);
        radius = 0;

        animator = ValueAnimator.ofFloat(0, 100);
        animator.setDuration(1800); // Pulse duration
        animator.setRepeatCount(ValueAnimator.INFINITE);
        animator.setRepeatMode(ValueAnimator.REVERSE);
        animator.addUpdateListener(animation -> {
            radius = (float) animation.getAnimatedValue();
            invalidate(); // Redraw the view
        });
    }

    public void startAnimation() {
        animator.start();
    }

    public void stopAnimation() {
        animator.cancel();
        radius = 0; // Reset radius if needed
        invalidate(); // Redraw to clear the previous pulse
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        canvas.drawCircle(getWidth() / 2, getHeight() / 2, radius, paint);
    }
}

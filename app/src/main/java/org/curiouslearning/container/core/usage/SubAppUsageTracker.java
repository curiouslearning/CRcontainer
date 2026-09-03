package org.curiouslearning.container.core.usage;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Build;
import android.os.PowerManager;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.VisibleForTesting;

/**
 * Drives a {@link SubAppUsageTimer} from one sub-app Activity's lifecycle. Time counts only while the
 * Activity is resumed and the screen is interactive, and is flushed on stop.
 */
public final class SubAppUsageTracker {

    private static final String TAG = "SubAppUsageTracker";

    /** Whether the display is on and usable. Injected so a test drives it. */
    public interface ScreenState {
        boolean isInteractive();
    }

    /** Test hook: replaces the Firestore flusher so tests observe segments. Null in real builds. */
    @VisibleForTesting
    static volatile SubAppUsageFlusher flusherOverride;

    private final SubAppUsageTimer timer;
    private final SubAppUsageFlusher flusher;
    private final ScreenState screenState;
    private final String appKey;
    private final String language;

    private final BroadcastReceiver screenReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            if (intent != null) {
                onScreenEvent(intent.getAction());
            }
        }
    };

    /** Non-null only while the screen receiver is registered. */
    private Context receiverContext;

    private boolean resumed;

    /** Resolves the process-wide timer for this sub-app and writes through the shared event handler. */
    public static SubAppUsageTracker create(@NonNull Context context,
                                            @NonNull String appKey,
                                            @NonNull String language,
                                            @NonNull String crUserId) {

        PowerManager powerManager =
                (PowerManager) context.getApplicationContext().getSystemService(Context.POWER_SERVICE);

        // Fails open: with no PowerManager, measure rather than silently record nothing.
        ScreenState screenState = () -> powerManager == null || powerManager.isInteractive();

        SubAppUsageFlusher override = flusherOverride;

        return new SubAppUsageTracker(
                SubAppUsageTimers.getInstance(appKey, language),
                (override != null) ? override : new FirestoreUsageFlusher(crUserId),
                screenState,
                appKey,
                language);
    }

    @VisibleForTesting
    SubAppUsageTracker(@NonNull SubAppUsageTimer timer,
                       @NonNull SubAppUsageFlusher flusher,
                       @NonNull ScreenState screenState,
                       @NonNull String appKey,
                       @NonNull String language) {
        this.timer = timer;
        this.flusher = flusher;
        this.screenState = screenState;
        this.appKey = appKey;
        this.language = language;
    }

    /** Starts listening for screen transitions. Call from {@code Activity.onStart}. */
    public void onStart(@NonNull Context context) {

        if (receiverContext != null) {
            return;
        }

        receiverContext = context.getApplicationContext();

        IntentFilter filter = new IntentFilter();
        filter.addAction(Intent.ACTION_SCREEN_OFF);
        filter.addAction(Intent.ACTION_SCREEN_ON);
        filter.addAction(Intent.ACTION_USER_PRESENT);

        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                receiverContext.registerReceiver(screenReceiver, filter, Context.RECEIVER_NOT_EXPORTED);
            } else {
                receiverContext.registerReceiver(screenReceiver, filter);
            }
        } catch (Exception e) {
            // Lifecycle anchoring still measures correctly; losing the receiver must not crash the sub-app.
            Log.e(TAG, "Could not register screen receiver; falling back to lifecycle only", e);
            receiverContext = null;
        }
    }

    /** Opens a segment, unless the screen is dark. Call from {@code Activity.onResume}. */
    public void onResume() {

        resumed = true;

        if (screenState.isInteractive()) {
            timer.start(appKey, language);
        }
    }

    /** Closes the open segment, keeping its time but writing nothing. Call from {@code Activity.onPause}. */
    public void onPause() {

        resumed = false;
        timer.pause();
    }

    /**
     * Stops listening and flushes, unless the Activity is being recreated. Call from
     * {@code Activity.onStop} as {@code onStop(isChangingConfigurations())}.
     */
    public void onStop(boolean changingConfigurations) {

        if (receiverContext != null) {
            try {
                receiverContext.unregisterReceiver(screenReceiver);
            } catch (IllegalArgumentException e) {
                Log.w(TAG, "Screen receiver was already unregistered", e);
            }
            receiverContext = null;
        }

        if (changingConfigurations) {
            // The timer is process-wide, so the time survives recreation and joins the next flush.
            // Writing here would split one session across two increments.
            return;
        }

        flush();
    }

    private void flush() {

        // stopAndDrain closes any still-open segment first, so no pause is needed beforehand.
        UsageSegment segment = timer.stopAndDrain();

        if (segment.isEmpty()) {
            return;
        }

        flusher.flush(segment);
    }

    private void onScreenEvent(@Nullable String action) {

        if (Intent.ACTION_SCREEN_OFF.equals(action)) {
            // Makes "screen-off is not counted" hold independently of lifecycle ordering.
            timer.pause();
            return;
        }

        // SCREEN_ON covers devices with no lock; USER_PRESENT covers those with a keyguard.
        if (resumed && !timer.isRunning() && screenState.isInteractive()) {
            timer.start(appKey, language);
        }
    }
}

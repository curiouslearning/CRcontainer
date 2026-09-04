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

import org.curiouslearning.container.core.subapp.handler.AppEventWriteCallback;

/**
 * Drives a {@link SubAppUsageTimer} from one sub-app Activity's lifecycle — time counts only while resumed
 * with the screen on — plus an {@link OpenStretchRecorder} keeping the same state on disk against a kill.
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
    private final OpenStretchRecorder recorder;
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

        SubAppUsageTimer timer = SubAppUsageTimers.getInstance(appKey, language);

        OpenStretchRecorder recorder = new OpenStretchRecorder(
                new SharedPreferencesOpenStretchStore(context),
                timer,
                new AndroidMonotonicClock(),
                new AndroidBootTokenProvider(),
                new ExecutorHeartbeatTicker(),
                appKey,
                language,
                crUserId);

        return new SubAppUsageTracker(
                timer,
                (override != null) ? override : new FirestoreUsageFlusher(crUserId),
                recorder,
                screenState,
                appKey,
                language);
    }

    @VisibleForTesting
    SubAppUsageTracker(@NonNull SubAppUsageTimer timer,
                       @NonNull SubAppUsageFlusher flusher,
                       @NonNull OpenStretchRecorder recorder,
                       @NonNull ScreenState screenState,
                       @NonNull String appKey,
                       @NonNull String language) {
        this.timer = timer;
        this.flusher = flusher;
        this.recorder = recorder;
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
            openSegment();
        }
    }

    /** Closes the open segment, keeping its time but writing nothing. Call from {@code Activity.onPause}. */
    public void onPause() {

        resumed = false;
        closeSegment();
    }

    /**
     * An event arrived from the sub-app, proving it was alive now. Purely additive — the container's own
     * heartbeat bounds the error, so a silent sub-app is recovered just as accurately.
     */
    public void onSubAppEvent() {
        recorder.onSubAppEvent();
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
            // Writing here would split one session across two increments. The open-stretch record stays
            // too, for the same reason — the session is not over.
            return;
        }

        flush();
    }

    private void openSegment() {
        timer.start(appKey, language);
        // After start(), so the record it writes already shows the segment open.
        recorder.onSegmentOpened();
    }

    private void closeSegment() {
        timer.pause();
        // After pause(), so the closing segment's time is already in the accumulators being persisted.
        recorder.onSegmentClosed();
    }

    private void flush() {

        // stopAndDrain closes any still-open segment first, so no pause is needed beforehand.
        UsageSegment segment = timer.stopAndDrain();

        if (segment.isEmpty()) {
            // Nothing to write, and nothing left worth recovering.
            recorder.clear();
            return;
        }

        flusher.flush(segment, new AppEventWriteCallback() {
            @Override
            public void onQueued() {
                // Only now: the record and the timer's undrained state must stop existing at the same
                // moment. Clearing at pause would lose a paused-then-killed session; clearing before the
                // write is accepted would lose a rejected one; not clearing at all would recover time
                // that has already been written.
                recorder.clear();
            }

            @Override
            public void onFailed(Exception e) {
                Log.w(TAG, "Usage write failed; open stretch kept for the next launch", e);
            }
        });
    }

    /** Package-private so a test can deliver a screen transition without broadcasting one. */
    @VisibleForTesting
    void onScreenEvent(@Nullable String action) {

        if (Intent.ACTION_SCREEN_OFF.equals(action)) {
            // Makes "screen-off is not counted" hold independently of lifecycle ordering.
            closeSegment();
            return;
        }

        // SCREEN_ON covers devices with no lock; USER_PRESENT covers those with a keyguard.
        if (resumed && !timer.isRunning() && screenState.isInteractive()) {
            openSegment();
        }
    }
}

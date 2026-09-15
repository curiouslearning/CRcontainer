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
import org.curiouslearning.container.core.usage.boot.AndroidBootTokenProvider;
import org.curiouslearning.container.core.usage.clock.AndroidMonotonicClock;
import org.curiouslearning.container.core.usage.flush.CoalescingUsageFlushers;
import org.curiouslearning.container.core.usage.flush.SubAppUsageFlusher;
import org.curiouslearning.container.core.usage.heartbeat.ExecutorHeartbeatTicker;

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
                (override != null) ? override : CoalescingUsageFlushers.getInstance(context, appKey, language, crUserId),
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
     * An event arrived from the sub-app, proving it was alive now. Banks what the open segment has measured
     * so far into the flusher, converting it from time a kill could only recover as an <em>estimate</em> into
     * measured duration that is durable on disk (MR-228).
     *
     * <p>The event is the container's only evidence that a child is actually playing, which is why the
     * banking hangs off it rather than off a timer: banked time is evidenced play, while whatever the event
     * did not cover stays an estimate in {@code cr_recovered_seconds} and can be discounted as such. A
     * sub-app that reports nothing is therefore never banked, only estimated — which is the honest answer for
     * one that gives no liveness signal at all.
     *
     * <p>Never calls {@code flushPending()}, so with the coalescing flusher production uses, the fold reaches
     * SharedPreferences and nothing else — the periodic ticker or the next stop does the Firestore write.
     * Write volume stays bounded by the interval, not by how chatty a sub-app is.
     */
    public void onSubAppEvent() {

        // Runs on the WebView's JavaBridge thread, so it can interleave with a lifecycle flush on main. The
        // timer is fully synchronized, and the worst interleaving leaves a record the recovery discards.
        UsageSegment segment = timer.checkpointAndDrain();

        if (segment.isEmpty()) {
            // Nothing whole to bank — FTM sends two payloads per game event in the same millisecond, so the
            // second lands here. The record still describes the same total; just move the liveness point.
            recorder.onSubAppEvent();
            return;
        }

        Log.d(TAG, "Sub-app event banked " + segment.cappedSeconds + "s of open segment time");

        flusher.flush(segment, null);

        // After the fold, never before: SharedPreferences applies land in submission order, so a kill in
        // between duplicates at most this one event's worth of time rather than losing it.
        recorder.onCheckpoint();
    }

    /**
     * Stops listening and flushes, unless the Activity is being recreated. Call from
     * {@code Activity.onStop} as {@code onStop(isChangingConfigurations())}.
     *
     * <p>Every stop that is not a recreation writes, whether the child is done with the sub-app or has merely
     * pushed it to the background. There is no stop worth measuring that should not write: {@code WebApp}
     * starts no activities of its own, so the only stops are Home/recents, screen-off — where writing is
     * exactly what is wanted — and a return to the grid, which always finishes.
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
        } else {
            flusher.flush(segment, new AppEventWriteCallback() {
                @Override
                public void onQueued() {
                    // Only now: the record and the timer's undrained state must stop existing at the same
                    // moment. Clearing at pause would lose a paused-then-killed session; clearing before
                    // the write is accepted would lose a rejected one; not clearing at all would recover
                    // time that has already been written.
                    recorder.clear();
                }

                @Override
                public void onFailed(Exception e) {
                    Log.w(TAG, "Usage write failed; open stretch kept for the next launch", e);
                }
            });
        }

        // Fire-and-forget, after handing the just-drained segment off above: a no-op for a plain flusher,
        // and for a coalescing one, forces whatever is buffered — this segment included — out to Firestore
        // now, instead of waiting for the next periodic interval. Unconditional, because a session the child
        // backgrounded is just as measured as one they finished, and on a device that is not reopened for
        // days the periodic interval is not a fallback that ever runs.
        flusher.flushPending();
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

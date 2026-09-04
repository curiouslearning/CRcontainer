package org.curiouslearning.container.core.usage;

import android.util.Log;

import androidx.annotation.NonNull;

/**
 * Keeps an {@link OpenStretchRecord} on disk while one sub-app has undrained usage time, so a process kill
 * loses at most one heartbeat interval instead of the whole session.
 */
public final class OpenStretchRecorder {

    private static final String TAG = "OpenStretchRecorder";

    /**
     * How often the container refreshes the last-known-alive point, in ms. This is the whole error budget:
     * a recovered stretch can overstate a real one by at most one interval, whatever happens afterwards.
     */
    static final long DEFAULT_HEARTBEAT_MS = 60_000L;

    private final OpenStretchStore store;
    private final SubAppUsageTimer timer;
    private final MonotonicClock clock;
    private final BootTokenProvider bootTokens;
    private final HeartbeatTicker ticker;
    private final long heartbeatMs;

    private final String appKey;
    private final String language;
    private final String crUserId;
    private final String key;

    /** Latest {@code elapsedRealtime} at which this stretch was known to still be in progress. */
    private long lastAliveMs;

    public OpenStretchRecorder(@NonNull OpenStretchStore store,
                               @NonNull SubAppUsageTimer timer,
                               @NonNull MonotonicClock clock,
                               @NonNull BootTokenProvider bootTokens,
                               @NonNull HeartbeatTicker ticker,
                               @NonNull String appKey,
                               @NonNull String language,
                               @NonNull String crUserId) {
        this(store, timer, clock, bootTokens, ticker, appKey, language, crUserId, DEFAULT_HEARTBEAT_MS);
    }

    /** Visible for tests, so a heartbeat can be exercised without waiting a minute for each tick. */
    OpenStretchRecorder(@NonNull OpenStretchStore store,
                        @NonNull SubAppUsageTimer timer,
                        @NonNull MonotonicClock clock,
                        @NonNull BootTokenProvider bootTokens,
                        @NonNull HeartbeatTicker ticker,
                        @NonNull String appKey,
                        @NonNull String language,
                        @NonNull String crUserId,
                        long heartbeatMs) {
        this.store = store;
        this.timer = timer;
        this.clock = clock;
        this.bootTokens = bootTokens;
        this.ticker = ticker;
        this.appKey = appKey;
        this.language = language;
        this.crUserId = crUserId;
        this.key = OpenStretchRecord.key(appKey, language);
        this.heartbeatMs = heartbeatMs;
    }

    /**
     * A segment has just been opened on the timer. Writes the record and begins the heartbeat.
     * Call after {@code timer.start()}, so the snapshot this reads already has the segment open.
     */
    public synchronized void onSegmentOpened() {

        lastAliveMs = clock.elapsedRealtimeMillis();

        persist();

        ticker.start(this::onTick, heartbeatMs);
    }

    /**
     * A segment has just been closed. Call after {@code timer.pause()}. The record deliberately survives:
     * a paused session's accumulated time is unwritten too, and a kill would lose it just the same.
     */
    public synchronized void onSegmentClosed() {

        ticker.stop();

        persist();
    }

    /**
     * An event arrived from the sub-app, proving it was alive now. Only moves the point forward, and only
     * while a segment is open — an event after the stretch closed must not reopen it.
     */
    public synchronized void onSubAppEvent() {

        if (!timer.isRunning()) {
            return;
        }

        long now = clock.elapsedRealtimeMillis();

        if (now > lastAliveMs) {
            lastAliveMs = now;
            persist();
        }
    }

    /**
     * The timer has been drained and the write durably queued; there is nothing left to recover. Not at
     * pause, and not before the write is accepted, or a rejected or offline write would lose the time.
     */
    public synchronized void clear() {

        ticker.stop();

        discard();
    }

    /** Visible for tests; the production caller is the {@link HeartbeatTicker}. */
    synchronized void onTick() {

        if (!timer.isRunning()) {
            return;
        }

        lastAliveMs = clock.elapsedRealtimeMillis();

        persist();
    }

    private void persist() {

        SubAppUsageTimer.Undrained undrained = timer.undrained();

        // Nothing open and nothing accumulated: a stale record here would invite a phantom recovery.
        if (undrained.isEmpty()) {
            discard();
            return;
        }

        try {
            store.save(new OpenStretchRecord(
                    appKey,
                    language,
                    crUserId,
                    bootTokens.currentToken(),
                    undrained.segmentStartMs,
                    lastAliveMs,
                    undrained.cappedMs,
                    undrained.trimmedMs));

        } catch (Exception e) {
            // A failed write costs accuracy on a crash that may never happen; it must not cost the session.
            Log.w(TAG, "Could not persist open stretch for " + key, e);
        }
    }

    /**
     * Removes the record, swallowing a storage failure. Guarded because {@link #clear()} runs inside a
     * Firestore callback, where an escaping exception surfaces in the SDK rather than anywhere useful.
     */
    private void discard() {

        try {
            store.delete(key);

        } catch (Exception e) {
            Log.w(TAG, "Could not remove open stretch for " + key, e);
        }
    }
}

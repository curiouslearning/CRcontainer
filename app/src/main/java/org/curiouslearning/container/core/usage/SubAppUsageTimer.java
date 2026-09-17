package org.curiouslearning.container.core.usage;

import org.curiouslearning.container.core.usage.clock.MonotonicClock;

/**
 * Accumulates container-measured foreground time for one sub-app, in segments, and hands it out in whole
 * seconds on {@link #stopAndDrain()}.
 *
 * <p>Time is accumulated per segment — one resume-to-pause span — so a drain may cover several segments.
 * Sub-second remainders stay in the timer and join the next drain.
 *
 * <p>The idle cap bounds <em>un-evidenced</em> time rather than play: it applies to the stretch since the
 * last sub-app event, not to the whole segment, and never to the accumulated sum. A child who keeps
 * completing puzzles keeps proving they are there, so their time is credited in full however long they play;
 * a device left face-up on a sub-app screen reports nothing and is still trimmed.
 *
 * <p>No Android imports: time comes from an injected {@link MonotonicClock}. All public methods are
 * synchronized.
 */
public final class SubAppUsageTimer {

    /** 30 minutes without a sign of life, a starting value to be tuned against real data. */
    static final long DEFAULT_CAP_MS = 30L * 60L * 1000L;

    /** Segments shorter than this are discarded — a tap through to a sub-app and straight back out is noise. */
    static final long DEFAULT_DEBOUNCE_MS = 1_500L;

    private static final long NOT_RUNNING = -1L;
    private static final long MILLIS_PER_SECOND = 1_000L;

    private final MonotonicClock clock;
    private final long capMs;
    private final long debounceMs;

    private String appKey;
    private String language;

    /** Start of the open segment, or {@link #NOT_RUNNING} when no segment is open. */
    private long segmentStartMs = NOT_RUNNING;

    /** Undrained total after per-segment capping, in ms. */
    private long accCappedMs;

    /**
     * Undrained total of what the cap trimmed, in ms — never negative.
     *
     * <p>Held as the trimmed difference rather than as a raw total so that {@code raw = capped + trimmed}
     * keeps {@link UsageSegment#rawSeconds} {@code >= cappedSeconds}; flooring an independent raw total does
     * not, because capping desynchronises the two remainders.
     */
    private long accTrimmedMs;

    /**
     * Raw ms of the open segment already folded into the accumulators; 0 when nothing is banked.
     *
     * <p>Holding this rather than moving {@link #segmentStartMs} forward is what makes repeated banking
     * exact: a bank caps against the current window and subtracts what it already contributed, so any number
     * of banks inside one window total exactly what closing that window once would have.
     */
    private long segmentBankedRawMs;

    /**
     * Where the current cap window opened, as a value on the same scale as {@link #segmentBankedRawMs}.
     *
     * <p>A sub-app event is the container's only proof that a child is actually playing, so
     * {@link #checkpointAndDrain()} restarts the window from that moment and everything before it is
     * credited in full. The cap then only ever trims a stretch nothing vouched for.
     *
     * <p>A sub-app that emits no events never moves this, so the cap behaves for it exactly as it did when
     * it applied to the whole segment — {@code assessment} is unchanged by this.
     */
    private long capWindowBaseRawMs;

    public SubAppUsageTimer(MonotonicClock clock) {
        this(clock, DEFAULT_CAP_MS, DEFAULT_DEBOUNCE_MS);
    }

    /** Visible for tests, so the cap can be exercised without simulating 45 minutes of wall clock. */
    SubAppUsageTimer(MonotonicClock clock, long capMs, long debounceMs) {
        this.clock = clock;
        this.capMs = capMs;
        this.debounceMs = debounceMs;
    }

    /**
     * Opens a segment for {@code appKey} in {@code language}, closing and keeping any segment already open.
     *
     * <p>Identity is last-write-wins, and any undrained time follows it.
     */
    public synchronized void start(String appKey, String language) {

        if (isRunning()) {
            closeSegment();
        }

        this.appKey = appKey;
        this.language = language;
        this.segmentStartMs = clock.elapsedRealtimeMillis();
    }

    /** Closes the open segment, keeping its time, without handing anything out. A no-op when not running. */
    public synchronized void pause() {

        if (isRunning()) {
            closeSegment();
        }
    }

    /**
     * Closes any open segment and returns everything accumulated so far, in whole seconds.
     *
     * <p>A drain with nothing to report comes back {@link UsageSegment#isEmpty()} rather than null.
     */
    public synchronized UsageSegment stopAndDrain() {

        pause();

        return drain();
    }

    /**
     * Banks what the open segment has measured so far and hands it out, <b>leaving the segment open</b>, so
     * time already measured can be made durable mid-session instead of waiting for the segment to close.
     *
     * <p>Totals are unaffected: the cap is applied to the whole segment on every bank, and sub-second
     * remainders carry exactly as they do for {@link #stopAndDrain()}. A no-op while nothing is running, and
     * while the open segment is still inside the debounce window.
     */
    public synchronized UsageSegment checkpointAndDrain() {

        if (isRunning()) {

            long rawSoFar = openSegmentRawMs();

            if (isBankable(rawSoFar)) {
                bankOpenSegment(rawSoFar);
            }

            // The caller only reaches here on a sign of life from the sub-app, which is exactly what the cap
            // was waiting to see. Reopen the window from here so an actively-playing child is never trimmed.
            capWindowBaseRawMs = segmentBankedRawMs;
        }

        return drain();
    }

    /** Hands out everything accumulated, in whole seconds, keeping the sub-second remainder. */
    private UsageSegment drain() {

        long cappedSeconds = accCappedMs / MILLIS_PER_SECOND;
        long trimmedSeconds = accTrimmedMs / MILLIS_PER_SECOND;

        // Subtract what is handed out rather than zeroing, so the remainder survives to the next drain.
        accCappedMs -= cappedSeconds * MILLIS_PER_SECOND;
        accTrimmedMs -= trimmedSeconds * MILLIS_PER_SECOND;

        return new UsageSegment(appKey, language, cappedSeconds, cappedSeconds + trimmedSeconds);
    }

    /** True while a segment is open, i.e. between {@link #start} and the next pause or drain. */
    public synchronized boolean isRunning() {
        return segmentStartMs != NOT_RUNNING;
    }

    /**
     * Everything this timer holds that a process kill would lose, read atomically — so a heartbeat cannot
     * pair a segment start from before a {@code pause()} with accumulators from after it.
     */
    static final class Undrained {

        final String appKey;
        final String language;

        /**
         * Start of the <b>un-banked</b> part of the open segment, or {@link SubAppUsageTimer#NOT_RUNNING}.
         *
         * <p>Not the segment's own start: time already banked by a checkpoint has been handed to a flusher
         * and is durable elsewhere, so a recovery estimating from the real start would count it a second
         * time — once as measured duration and once as {@code cr_recovered_seconds}.
         */
        final long segmentStartMs;

        final long cappedMs;
        final long trimmedMs;

        private Undrained(String appKey, String language, long segmentStartMs, long cappedMs, long trimmedMs) {
            this.appKey = appKey;
            this.language = language;
            this.segmentStartMs = segmentStartMs;
            this.cappedMs = cappedMs;
            this.trimmedMs = trimmedMs;
        }

        /** True when there is nothing worth persisting: no open segment and nothing accumulated. */
        boolean isEmpty() {
            return segmentStartMs == NOT_RUNNING && cappedMs == 0L && trimmedMs == 0L;
        }
    }

    /** @see Undrained */
    synchronized Undrained undrained() {

        long unbankedStartMs = isRunning() ? segmentStartMs + segmentBankedRawMs : NOT_RUNNING;

        return new Undrained(appKey, language, unbankedStartMs, accCappedMs, accTrimmedMs);
    }

    /**
     * Adds previously-persisted time back into the accumulators, without opening a segment. Additive, so
     * it cannot discard time this timer has already measured in the current process.
     */
    synchronized void restoreUndrained(long cappedMs, long trimmedMs) {

        if (cappedMs < 0L || trimmedMs < 0L) {
            return;
        }

        accCappedMs += cappedMs;
        accTrimmedMs += trimmedMs;
    }

    /**
     * Closes the open segment into the accumulators, applying the debounce and the per-segment cap.
     *
     * <p>A clock that jumps backwards yields a negative span, which the debounce discards.
     */
    private void closeSegment() {

        long rawMs = openSegmentRawMs();

        if (isBankable(rawMs)) {
            bankOpenSegment(rawMs);
        }

        segmentStartMs = NOT_RUNNING;
        segmentBankedRawMs = 0L;
        capWindowBaseRawMs = 0L;
    }

    /** How long the open segment has run, including the part already banked. Negative if the clock rewound. */
    private long openSegmentRawMs() {
        return clock.elapsedRealtimeMillis() - segmentStartMs;
    }

    /**
     * Whether the open segment has earned its keep. The debounce judges a segment once — at its first bank —
     * rather than judging each checkpoint, so a segment that has already contributed time cannot have its
     * remaining tail discarded for being short.
     */
    private boolean isBankable(long rawSoFar) {
        return rawSoFar >= debounceMs || segmentBankedRawMs > 0L;
    }

    /**
     * Folds everything the open segment has measured that is not already folded, capping against the whole
     * segment so the per-segment cap survives any number of banks.
     */
    private void bankOpenSegment(long rawSoFar) {

        if (rawSoFar <= segmentBankedRawMs) {
            // A backwards clock, or nothing new since the last bank. Either way there is nothing to add.
            return;
        }

        // Everything is measured within the current cap window, so a window reopened by a sub-app event
        // starts the allowance over rather than inheriting a cap the earlier, evidenced play already used up.
        long windowRawSoFar = rawSoFar - capWindowBaseRawMs;
        long windowBankedRaw = segmentBankedRawMs - capWindowBaseRawMs;

        long cappedSoFar = Math.min(windowRawSoFar, capMs);
        long cappedBanked = Math.min(windowBankedRaw, capMs);

        accCappedMs += cappedSoFar - cappedBanked;
        accTrimmedMs += (windowRawSoFar - cappedSoFar) - (windowBankedRaw - cappedBanked);

        segmentBankedRawMs = rawSoFar;
    }
}

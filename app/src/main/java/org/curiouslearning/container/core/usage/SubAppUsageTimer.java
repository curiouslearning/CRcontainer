package org.curiouslearning.container.core.usage;

/**
 * Accumulates container-measured foreground time for one sub-app, in segments, and hands it out in whole
 * seconds on {@link #stopAndDrain()}.
 *
 * <p>Time is accumulated per segment — one resume-to-pause span — so a drain may cover several segments. The
 * idle cap is applied to each segment as it closes, never to the accumulated sum. Sub-second remainders stay
 * in the timer and join the next drain.
 *
 * <p>No Android imports: time comes from an injected {@link MonotonicClock}. All public methods are
 * synchronized.
 */
public final class SubAppUsageTimer {

    /** 30 minutes per segment, a starting value to be tuned against real data. */
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

        /** Start of the open segment, or {@link SubAppUsageTimer#NOT_RUNNING}. */
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
        return new Undrained(appKey, language, segmentStartMs, accCappedMs, accTrimmedMs);
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

        long rawMs = clock.elapsedRealtimeMillis() - segmentStartMs;
        segmentStartMs = NOT_RUNNING;

        if (rawMs < debounceMs) {
            return;
        }

        long cappedMs = Math.min(rawMs, capMs);

        accCappedMs += cappedMs;
        accTrimmedMs += rawMs - cappedMs;
    }
}

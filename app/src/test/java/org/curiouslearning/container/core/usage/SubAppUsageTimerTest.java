package org.curiouslearning.container.core.usage;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

/** Plain JUnit — {@link SubAppUsageTimer} takes a {@link MonotonicClock} rather than touching SystemClock. */
public class SubAppUsageTimerTest {

    private static final long CAP_MS = 10_000L;
    private static final long DEBOUNCE_MS = 1_500L;

    private static final String APP = "feed-the-monster";
    private static final String LANG = "English";

    /** Hand-driven clock; only a test rewinds it. */
    private static final class FakeClock implements MonotonicClock {

        private long nowMs;

        @Override
        public long elapsedRealtimeMillis() {
            return nowMs;
        }

        void advance(long millis) {
            nowMs += millis;
        }

        void set(long millis) {
            nowMs = millis;
        }
    }

    private final FakeClock clock = new FakeClock();
    private final SubAppUsageTimer timer = new SubAppUsageTimer(clock, CAP_MS, DEBOUNCE_MS);

    /** Runs one complete segment of {@code durationMs} without draining. */
    private void segment(long durationMs) {
        timer.start(APP, LANG);
        clock.advance(durationMs);
        timer.pause();
    }

    @Test
    public void drainsWholeSecondsOfASingleSegment() {
        segment(5_000L);

        UsageSegment drained = timer.stopAndDrain();

        assertEquals(5L, drained.cappedSeconds);
        assertEquals(5L, drained.rawSeconds);
        assertEquals(APP, drained.appKey);
        assertEquals(LANG, drained.language);
        assertFalse(drained.isEmpty());
    }

    @Test
    public void carriesSubSecondRemainderAcrossDrains() {
        segment(1_600L);
        assertEquals(1L, timer.stopAndDrain().rawSeconds);

        segment(1_600L);

        // 3200ms total: the two 600ms remainders combine into the second whole second.
        assertEquals(2L, timer.stopAndDrain().rawSeconds);
    }

    @Test
    public void discardsSegmentShorterThanDebounce() {
        segment(DEBOUNCE_MS - 1L);

        assertTrue(timer.stopAndDrain().isEmpty());
    }

    @Test
    public void appliesCapPerSegmentNotToTheAccumulatedTotal() {
        segment(CAP_MS - 1_000L);
        segment(CAP_MS - 1_000L);

        UsageSegment drained = timer.stopAndDrain();

        // Two legitimate under-cap segments must total both spans, not be trimmed to a single cap.
        assertEquals(18L, drained.cappedSeconds);
        assertEquals(18L, drained.rawSeconds);
    }

    @Test
    public void trimsASegmentThatExceedsTheCapButKeepsRawIntact() {
        segment(CAP_MS * 3L);

        UsageSegment drained = timer.stopAndDrain();

        assertEquals(CAP_MS / 1_000L, drained.cappedSeconds);
        assertEquals(CAP_MS * 3L / 1_000L, drained.rawSeconds);
    }

    @Test
    public void keepsMeasuredTimeWhenStartIsCalledTwiceWithoutAPause() {
        timer.start(APP, LANG);
        clock.advance(4_000L);
        timer.start(APP, LANG);
        clock.advance(3_000L);

        assertEquals(7L, timer.stopAndDrain().rawSeconds);
    }

    @Test
    public void discardsABackwardsClockJumpRatherThanAccumulatingNegativeTime() {
        clock.set(100_000L);
        timer.start(APP, LANG);
        clock.set(50_000L);

        assertTrue(timer.stopAndDrain().isEmpty());
    }

    @Test
    public void reportsEmptyWhenNothingWasEverMeasured() {
        assertTrue(timer.stopAndDrain().isEmpty());
    }

    @Test
    public void isRunningOnlyWhileASegmentIsOpen() {
        assertFalse(timer.isRunning());

        timer.start(APP, LANG);
        assertTrue(timer.isRunning());

        timer.pause();
        assertFalse(timer.isRunning());
    }

    /** rawSeconds must never come back below cappedSeconds, or MR-183 sees a negative cap-trim figure. */
    @Test
    public void neverReportsMoreCappedTimeThanRawTime() {
        segment(1_600L);
        timer.stopAndDrain();

        segment(CAP_MS + 500L);
        timer.stopAndDrain();

        segment(1_600L);
        UsageSegment drained = timer.stopAndDrain();

        assertTrue("capped=" + drained.cappedSeconds + " exceeded raw=" + drained.rawSeconds,
                drained.rawSeconds >= drained.cappedSeconds);
    }

    /** Sub-second time deferred by the remainders must still land in the totals across many drains. */
    @Test
    public void accumulatesTheSameTotalsAcrossManyDrainsAsOneLongOne() {
        long cappedTotal = 0L;
        long rawTotal = 0L;

        for (int i = 0; i < 20; i++) {
            segment(CAP_MS + 500L);
            UsageSegment drained = timer.stopAndDrain();
            cappedTotal += drained.cappedSeconds;
            rawTotal += drained.rawSeconds;
            assertTrue(drained.rawSeconds >= drained.cappedSeconds);
        }

        // 20 segments of cap+500ms: every one is trimmed to the cap, leaving 20 * 500ms of trimmed time.
        assertEquals(20L * CAP_MS / 1_000L, cappedTotal);
        assertEquals(20L * (CAP_MS + 500L) / 1_000L, rawTotal);
    }
}

package org.curiouslearning.container.core.usage;

import static org.junit.Assert.assertEquals;

import org.curiouslearning.container.core.subapp.handler.AppEventWriteCallback;
import org.curiouslearning.container.core.usage.clock.MonotonicClock;
import org.curiouslearning.container.core.usage.flush.CoalescingUsageFlusher;
import org.curiouslearning.container.core.usage.flush.PendingUsageWrite;
import org.curiouslearning.container.core.usage.flush.PendingUsageWriteStore;
import org.curiouslearning.container.core.usage.flush.SubAppUsageFlusher;
import org.curiouslearning.container.core.usage.heartbeat.HeartbeatTicker;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.annotation.Config;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Closes the one gap {@code CoalescingUsageFlusherTest} leaves in MT-US2-01's coverage: that test hand-feeds
 * {@code CoalescingUsageFlusher} already-capped numbers, which proves the *coalescer* never re-caps a sum, but
 * never proves the cap those numbers came from was real. This test wires an actual {@link SubAppUsageTimer} —
 * with its package-private test constructor's lowered cap, same pattern {@code SubAppUsageTimerTest} already
 * uses — into a real {@link CoalescingUsageFlusher}, so the per-segment cap (MR-178/MR-180) and the coalescing
 * summation (MR-184/FR-005) are exercised together, end to end, on the JVM. It is the device-free equivalent
 * of [quickstart.md](../../../../../../../specs/003-coalesce-usage-writes/quickstart.md) Level 3 / test-plan.md
 * MT-US2-01, which a real 30-minute-capped device run is impractical to reproduce by hand.
 *
 * <p>Lives in {@code core.usage} rather than {@code core.usage.flush} because it needs
 * {@link SubAppUsageTimer}'s package-private test constructor; {@link CoalescingUsageFlusher} itself is public
 * and reachable from here without any visibility change to production code.
 */
@RunWith(RobolectricTestRunner.class)
@Config(sdk = 28)
public class CoalescingUsageFlusherCapIntegrationTest {

    /** Spec's own example uses 20-minute segments; kept short here only so the fake clock's math stays readable. */
    private static final long CAP_MS = 20L * 60L * 1000L;
    private static final long DEBOUNCE_MS = 1_500L;

    private static final String APP = "feed-the-monster";
    private static final String LANG = "English";
    private static final String CR_USER_ID = "child-123";

    /** Hand-driven clock; mirrors {@code SubAppUsageTimerTest.FakeClock} exactly. */
    private static final class FakeClock implements MonotonicClock {
        private long nowMs;

        @Override
        public long elapsedRealtimeMillis() {
            return nowMs;
        }

        void advance(long millis) {
            nowMs += millis;
        }
    }

    private static final class FakeDelegateFlusher implements SubAppUsageFlusher {

        UsageSegment lastSegment;
        AppEventWriteCallback lastCallback;

        @Override
        public void flush(UsageSegment segment, AppEventWriteCallback callback) {
            lastSegment = segment;
            lastCallback = callback;
        }
    }

    private static final class FakeStore implements PendingUsageWriteStore {

        final Map<String, PendingUsageWrite> saved = new LinkedHashMap<>();

        @Override
        public List<PendingUsageWrite> loadAll() {
            return new ArrayList<>(saved.values());
        }

        @Override
        public void save(PendingUsageWrite write) {
            saved.put(write.key(), write);
        }

        @Override
        public void delete(String key) {
            saved.remove(key);
        }
    }

    /** Never fired in this test: both folds are handed off via an explicit {@code flushPending()}, not a tick. */
    private static final class NoOpTicker implements HeartbeatTicker {
        @Override
        public void start(Runnable tick, long intervalMs) {
        }

        @Override
        public void stop() {
        }
    }

    private final FakeClock clock = new FakeClock();
    private final SubAppUsageTimer timer = new SubAppUsageTimer(clock, CAP_MS, DEBOUNCE_MS);
    private final FakeDelegateFlusher delegate = new FakeDelegateFlusher();
    private final FakeStore store = new FakeStore();
    private final CoalescingUsageFlusher flusher =
            new CoalescingUsageFlusher(delegate, store, new NoOpTicker(), APP, LANG, CR_USER_ID);

    /** Runs one complete segment of {@code durationMs}, draining it into its own {@link UsageSegment}. */
    private UsageSegment drainOneSegment(long durationMs) {
        timer.start(APP, LANG);
        clock.advance(durationMs);
        return timer.stopAndDrain();
    }

    /**
     * The spec's own worked example (spec.md Acceptance Scenario US2#1, SC-003), reproduced end to end: two
     * stretches each individually capped at the per-segment maximum, drained separately (as two real
     * Home-toggle stops would), folded into the same coalesced buffer, then flushed together.
     */
    @Test
    public void twoSeparatelyCappedSegmentsFromARealTimerSumInFullWhenCoalesced() {

        // Each stretch runs 5 minutes past the cap, so SubAppUsageTimer itself — not a hand-picked number —
        // trims each one to exactly CAP_MS, independently.
        long overCapMs = CAP_MS + 5L * 60L * 1000L;

        UsageSegment first = drainOneSegment(overCapMs);
        assertEquals("first segment's own cap trim", CAP_MS / 1_000L, first.cappedSeconds);

        UsageSegment second = drainOneSegment(overCapMs);
        assertEquals("second segment's own cap trim", CAP_MS / 1_000L, second.cappedSeconds);

        flusher.flush(first, null);
        flusher.flush(second, null);
        flusher.flushPending();

        long onePerSegmentCapInSeconds = CAP_MS / 1_000L;
        long overCapInSeconds = overCapMs / 1_000L;

        // The assertion that matters: double the cap, not a single cap's worth.
        assertEquals("coalesced capped duration must be 2x the per-segment cap, never re-capped to 1x",
                2L * onePerSegmentCapInSeconds, delegate.lastSegment.cappedSeconds);
        assertEquals("raw duration must sum independently of capping",
                2L * overCapInSeconds, delegate.lastSegment.rawSeconds);
    }
}

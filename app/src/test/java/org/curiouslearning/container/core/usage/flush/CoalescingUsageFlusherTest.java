package org.curiouslearning.container.core.usage.flush;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.curiouslearning.container.core.subapp.handler.AppEventWriteCallback;
import org.curiouslearning.container.core.usage.UsageSegment;
import org.curiouslearning.container.core.usage.heartbeat.HeartbeatTicker;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.annotation.Config;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * {@link CoalescingUsageFlusher} takes only interfaces (a delegate flusher, a store, a ticker), so
 * hand-driven fakes exercise it without a device, mirroring {@code SubAppUsageTimerTest}'s style — Robolectric
 * is needed only because the class under test logs via {@code android.util.Log}.
 *
 * <p>Covers US1 (bounded writes, ticker lifecycle), US2 (coalesced totals never re-capped, raw always
 * accompanies capped), and US4 (a finish-triggered flush leaves nothing behind).
 */
@RunWith(RobolectricTestRunner.class)
@Config(sdk = 28)
public class CoalescingUsageFlusherTest {

    private static final String APP = "feed-the-monster";
    private static final String LANG = "English";
    private static final String CR_USER_ID = "child-123";
    private static final long INTERVAL_MS = 5 * 60 * 1000L;
    private static final String KEY = PendingUsageWrite.key(APP, LANG);

    private FakeDelegateFlusher delegate;
    private FakeStore store;
    private FakeTicker ticker;
    private CoalescingUsageFlusher flusher;

    @Before
    public void setup() {
        delegate = new FakeDelegateFlusher();
        store = new FakeStore();
        ticker = new FakeTicker();
        flusher = new CoalescingUsageFlusher(delegate, store, ticker, APP, LANG, CR_USER_ID, INTERVAL_MS);
    }

    private static UsageSegment segment(long cappedSeconds, long rawSeconds) {
        return new UsageSegment(APP, LANG, cappedSeconds, rawSeconds);
    }

    // ---- US1: folding, buffering, ticker lifecycle ----

    @Test
    public void foldingOneSegmentPersistsAndCallsOnQueuedSynchronously() {
        RecordingCallback callback = new RecordingCallback();

        flusher.flush(segment(10L, 12L), callback);

        assertEquals(1, store.saveCount);
        PendingUsageWrite saved = store.saved.get(KEY);
        assertEquals(10L, saved.cappedSeconds);
        assertEquals(12L, saved.rawSeconds);
        assertTrue(callback.queued);
        assertEquals(0, delegate.flushCount());
    }

    @Test
    public void foldingASecondSegmentSumsIntoTheSameRecord() {
        flusher.flush(segment(10L, 12L), null);
        flusher.flush(segment(5L, 5L), null);

        PendingUsageWrite saved = store.saved.get(KEY);
        assertEquals(15L, saved.cappedSeconds);
        assertEquals(17L, saved.rawSeconds);
        assertEquals(2, store.saveCount);
    }

    @Test
    public void tickerStartsOnFirstFoldIntoAnEmptyBufferAndNotAgainOnTheSecond() {
        flusher.flush(segment(10L, 10L), null);
        assertEquals(1, ticker.startCount);
        assertEquals(INTERVAL_MS, ticker.intervalMs);

        flusher.flush(segment(5L, 5L), null);
        assertEquals(1, ticker.startCount);
    }

    @Test
    public void tickerStopsOnceTheBufferIsEmptiedByAFlush() {
        flusher.flush(segment(10L, 10L), null);
        assertTrue(ticker.running);

        flusher.flushPending();
        delegate.completeLastWithQueued();

        assertFalse(ticker.running);
        assertEquals(1, ticker.stopCount);
    }

    @Test
    public void aPeriodicTickForcesTheSameFlushAsAFinishTriggeredCall() {
        flusher.flush(segment(8L, 8L), null);

        ticker.fire();

        assertEquals(1, delegate.flushCount());
        assertEquals(8L, delegate.lastSegment().cappedSeconds);
    }

    @Test
    public void flushPendingOnANonEmptyBufferForcesAnImmediateDelegateFlushAndClearsOnlyOnQueued() {
        flusher.flush(segment(10L, 12L), null);

        flusher.flushPending();

        assertEquals(1, delegate.flushCount());
        assertEquals(10L, delegate.lastSegment().cappedSeconds);
        assertEquals(12L, delegate.lastSegment().rawSeconds);
        // Not yet cleared: onQueued has not fired.
        assertTrue(store.saved.containsKey(KEY));

        delegate.completeLastWithQueued();

        assertFalse(store.saved.containsKey(KEY));
        assertFalse(ticker.running);
    }

    @Test
    public void flushPendingOnAnEmptyBufferIsANoOp() {
        flusher.flushPending();

        assertEquals(0, delegate.flushCount());
        assertEquals(0, store.saveCount);
    }

    @Test
    public void delegateOnFailedLeavesThePersistedRecordAndTheTickerRunningForRetry() {
        flusher.flush(segment(10L, 10L), null);

        flusher.flushPending();
        delegate.completeLastWithFailure();

        assertTrue(store.saved.containsKey(KEY));
        assertTrue(ticker.running);

        // The buffer itself must still hold the amount, so the retry resends it in full.
        flusher.flushPending();
        assertEquals(2, delegate.flushCount());
        assertEquals(10L, delegate.lastSegment().cappedSeconds);
    }

    @Test
    public void aFoldThatRacesInDuringAnInFlightFlushIsKeptForTheNextOne() {
        flusher.flush(segment(10L, 10L), null);

        flusher.flushPending();
        // A new fold arrives while the first flush is still in flight (not yet queued).
        flusher.flush(segment(4L, 4L), null);

        delegate.completeLastWithQueued();

        // The raced-in 4 seconds survive the first flush's onQueued rather than being wiped by it.
        PendingUsageWrite remaining = store.saved.get(KEY);
        assertEquals(4L, remaining.cappedSeconds);
        assertEquals(4L, remaining.rawSeconds);
        assertTrue(ticker.running);
    }

    // ---- US2: totals correctness ----

    @Test
    public void twoIndividuallyCappedSegmentsSumInFullNeverReCappedToASingleCap() {
        long perSegmentCap = 20L;

        flusher.flush(segment(perSegmentCap, perSegmentCap), null);
        flusher.flush(segment(perSegmentCap, perSegmentCap), null);

        flusher.flushPending();

        assertEquals(40L, delegate.lastSegment().cappedSeconds);
        assertEquals(40L, delegate.lastSegment().rawSeconds);
    }

    @Test
    public void everyFlushCarriesBothCappedAndRawWithRawAlwaysAtLeastCapped() {
        flusher.flush(segment(10L, 15L), null);
        flusher.flush(segment(5L, 5L), null);

        flusher.flushPending();

        UsageSegment flushed = delegate.lastSegment();
        assertTrue(flushed.cappedSeconds > 0L);
        assertTrue(flushed.rawSeconds > 0L);
        assertTrue(flushed.rawSeconds >= flushed.cappedSeconds);
        assertEquals(15L, flushed.cappedSeconds);
        assertEquals(20L, flushed.rawSeconds);
    }

    @Test
    public void coalescedTotalEqualsTheSumOfWhatIndependentFlushesWouldHaveWritten() {
        long[][] independentSegments = {{3L, 3L}, {7L, 8L}, {2L, 2L}, {12L, 14L}, {1L, 1L}};

        long expectedCapped = 0L;
        long expectedRaw = 0L;
        for (long[] seg : independentSegments) {
            expectedCapped += seg[0];
            expectedRaw += seg[1];
            flusher.flush(segment(seg[0], seg[1]), null);
        }

        flusher.flushPending();

        assertEquals(expectedCapped, delegate.lastSegment().cappedSeconds);
        assertEquals(expectedRaw, delegate.lastSegment().rawSeconds);
    }

    // ---- US4: clean-exit hygiene ----

    @Test
    public void finishTriggeredFlushPendingLeavesNoPersistedRecordOrRunningTickerOnceAccepted() {
        flusher.flush(segment(6L, 6L), null);

        flusher.flushPending();
        delegate.completeLastWithQueued();

        assertTrue(store.saved.isEmpty());
        assertFalse(ticker.running);
    }

    @Test
    public void finishTriggeredFlushPendingOnAnAlreadyEmptyBufferProducesNoDelegateCallOrRecord() {
        flusher.flushPending();

        assertEquals(0, delegate.flushCount());
        assertTrue(store.saved.isEmpty());
    }

    // ---- fakes ----

    private static final class RecordingCallback implements AppEventWriteCallback {
        boolean queued;

        @Override
        public void onQueued() {
            queued = true;
        }
    }

    private static final class FakeDelegateFlusher implements SubAppUsageFlusher {

        final List<UsageSegment> flushedSegments = new ArrayList<>();
        private final List<AppEventWriteCallback> callbacks = new ArrayList<>();

        @Override
        public void flush(UsageSegment segment, AppEventWriteCallback callback) {
            flushedSegments.add(segment);
            callbacks.add(callback);
        }

        int flushCount() {
            return flushedSegments.size();
        }

        UsageSegment lastSegment() {
            return flushedSegments.get(flushedSegments.size() - 1);
        }

        void completeLastWithQueued() {
            AppEventWriteCallback callback = callbacks.get(callbacks.size() - 1);
            if (callback != null) {
                callback.onQueued();
            }
        }

        void completeLastWithFailure() {
            AppEventWriteCallback callback = callbacks.get(callbacks.size() - 1);
            if (callback != null) {
                callback.onFailed(new RuntimeException("simulated delegate failure"));
            }
        }
    }

    private static final class FakeStore implements PendingUsageWriteStore {

        final Map<String, PendingUsageWrite> saved = new LinkedHashMap<>();
        int saveCount;

        @Override
        public List<PendingUsageWrite> loadAll() {
            return new ArrayList<>(saved.values());
        }

        @Override
        public void save(PendingUsageWrite write) {
            saveCount++;
            saved.put(write.key(), write);
        }

        @Override
        public void delete(String key) {
            saved.remove(key);
        }
    }

    private static final class FakeTicker implements HeartbeatTicker {

        Runnable tick;
        long intervalMs;
        boolean running;
        int startCount;
        int stopCount;

        @Override
        public void start(Runnable tick, long intervalMs) {
            this.tick = tick;
            this.intervalMs = intervalMs;
            this.running = true;
            startCount++;
        }

        @Override
        public void stop() {
            running = false;
            stopCount++;
        }

        void fire() {
            if (tick != null) {
                tick.run();
            }
        }
    }
}

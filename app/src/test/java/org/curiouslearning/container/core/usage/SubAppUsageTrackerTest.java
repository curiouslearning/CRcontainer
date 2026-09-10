package org.curiouslearning.container.core.usage;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;

import org.curiouslearning.container.core.subapp.handler.AppEventWriteCallback;
import org.curiouslearning.container.core.usage.clock.MonotonicClock;
import org.curiouslearning.container.core.usage.flush.SubAppUsageFlusher;
import org.junit.Before;
import org.junit.Test;

import java.util.ArrayList;
import java.util.List;

/**
 * Mockito, with mockito-inline (since {@link OpenStretchRecorder} is a concrete final class), verifies the
 * existing {@code recorder.clear()}-in-{@code onQueued()} ordering still holds through MR-184's new
 * {@code finishing}/{@code flushPending()} path, for both an empty and a non-empty drained segment.
 */
public class SubAppUsageTrackerTest {

    private static final String APP = "feed-the-monster";
    private static final String LANG = "English";
    private static final long CAP_MS = 30L * 60L * 1000L;
    private static final long DEBOUNCE_MS = 1_500L;

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
    }

    /** Records what it is asked to flush, and defers the callback until the test fires it. */
    private static final class FakeFlusher implements SubAppUsageFlusher {

        final List<UsageSegment> flushedSegments = new ArrayList<>();
        final List<AppEventWriteCallback> callbacks = new ArrayList<>();
        int flushPendingCallCount;

        @Override
        public void flush(UsageSegment segment, AppEventWriteCallback callback) {
            flushedSegments.add(segment);
            callbacks.add(callback);
        }

        @Override
        public void flushPending() {
            flushPendingCallCount++;
        }

        void completeLastWithQueued() {
            AppEventWriteCallback callback = callbacks.get(callbacks.size() - 1);
            if (callback != null) {
                callback.onQueued();
            }
        }
    }

    private final FakeClock clock = new FakeClock();
    private final SubAppUsageTimer timer = new SubAppUsageTimer(clock, CAP_MS, DEBOUNCE_MS);
    private final FakeFlusher flusher = new FakeFlusher();

    private OpenStretchRecorder recorder;
    private SubAppUsageTracker tracker;

    @Before
    public void setup() {
        recorder = mock(OpenStretchRecorder.class);

        SubAppUsageTracker.ScreenState alwaysInteractive = () -> true;
        tracker = new SubAppUsageTracker(timer, flusher, recorder, alwaysInteractive, APP, LANG);
    }

    /** Opens and closes a segment directly on the timer, well past the debounce, without draining it. */
    private void accumulateDrainableTime() {
        timer.start(APP, LANG);
        clock.advance(5_000L);
        timer.pause();
    }

    @Test
    public void nonEmptySegmentClearsTheRecorderOnlyOnceOnQueuedFires() {
        accumulateDrainableTime();

        tracker.onStop(false, false);

        assertEquals(1, flusher.flushedSegments.size());
        verify(recorder, never()).clear();

        flusher.completeLastWithQueued();

        verify(recorder, times(1)).clear();
        assertEquals(0, flusher.flushPendingCallCount);
    }

    @Test
    public void nonEmptySegmentAlsoForcesFlushPendingWhenFinishing() {
        accumulateDrainableTime();

        tracker.onStop(false, true);

        assertEquals(1, flusher.flushedSegments.size());
        assertEquals(1, flusher.flushPendingCallCount);
        // flushPending() is fire-and-forget and unrelated to the drained segment's own callback.
        verify(recorder, never()).clear();

        flusher.completeLastWithQueued();

        verify(recorder, times(1)).clear();
    }

    @Test
    public void emptySegmentClearsTheRecorderImmediatelyWithoutCallingTheDelegate() {
        // No accumulated time: stopAndDrain() comes back empty.
        tracker.onStop(false, false);

        assertEquals(0, flusher.flushedSegments.size());
        verify(recorder, times(1)).clear();
        assertEquals(0, flusher.flushPendingCallCount);
    }

    @Test
    public void emptySegmentStillForcesFlushPendingWhenFinishing() {
        tracker.onStop(false, true);

        assertEquals(0, flusher.flushedSegments.size());
        verify(recorder, times(1)).clear();
        assertEquals(1, flusher.flushPendingCallCount);
    }

    @Test
    public void changingConfigurationsSkipsFlushEntirely() {
        accumulateDrainableTime();

        tracker.onStop(true, false);

        assertEquals(0, flusher.flushedSegments.size());
        assertEquals(0, flusher.flushPendingCallCount);
        verifyNoInteractions(recorder);
    }
}

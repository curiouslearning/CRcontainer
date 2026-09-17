package org.curiouslearning.container.core.usage;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
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
import org.junit.runner.RunWith;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.annotation.Config;

import java.util.ArrayList;
import java.util.List;

/**
 * Mockito, with mockito-inline (since {@link OpenStretchRecorder} is a concrete final class), covers the two
 * flush policies the tracker owns: every stop that is not a recreation writes (MR-228 Gap 1), and a sub-app
 * event banks the open segment without writing (MR-228 Gap 2).
 *
 * <p>The {@code recorder.clear()}-in-{@code onQueued()} ordering is asserted throughout, because the record
 * and the timer's undrained state must stop existing at the same moment.
 *
 * <p>Robolectric is needed only because the class under test logs a banked sub-app event via
 * {@code android.util.Log}, matching {@code CoalescingUsageFlusherTest}'s reason for the same runner.
 */
@RunWith(RobolectricTestRunner.class)
@Config(sdk = 28)
public class SubAppUsageTrackerTest {

    private static final String APP = "feed-the-monster";
    private static final String LANG = "English";
    private static final long CAP_MS = 30L * 60L * 1000L;
    private static final long DEBOUNCE_MS = 1_500L;

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

    /** Sums the capped seconds of every segment handed to the flusher so far. */
    private long totalFlushedCappedSeconds() {
        long total = 0L;
        for (UsageSegment segment : flusher.flushedSegments) {
            total += segment.cappedSeconds;
        }
        return total;
    }

    // ---- Gap 1: every real stop writes ----

    @Test
    public void nonEmptySegmentClearsTheRecorderOnlyOnceOnQueuedFires() {
        accumulateDrainableTime();

        tracker.onStop(false);

        assertEquals(1, flusher.flushedSegments.size());
        verify(recorder, never()).clear();

        flusher.completeLastWithQueued();

        verify(recorder, times(1)).clear();
    }

    @Test
    public void everyRealStopForcesFlushPendingNotJustAFinishingOne() {
        accumulateDrainableTime();

        tracker.onStop(false);

        assertEquals(1, flusher.flushedSegments.size());
        assertEquals(1, flusher.flushPendingCallCount);
    }

    @Test
    public void emptySegmentClearsTheRecorderImmediatelyWithoutCallingTheDelegate() {
        // No accumulated time: stopAndDrain() comes back empty.
        tracker.onStop(false);

        assertEquals(0, flusher.flushedSegments.size());
        verify(recorder, times(1)).clear();
    }

    @Test
    public void emptySegmentStillForcesFlushPendingOnAPlainBackgrounding() {
        tracker.onStop(false);

        assertEquals(0, flusher.flushedSegments.size());
        assertEquals(1, flusher.flushPendingCallCount);
    }

    @Test
    public void changingConfigurationsSkipsFlushEntirely() {
        accumulateDrainableTime();

        tracker.onStop(true);

        assertEquals(0, flusher.flushedSegments.size());
        assertEquals(0, flusher.flushPendingCallCount);
        verifyNoInteractions(recorder);
    }

    // ---- Gap 2: a sub-app event banks the open segment ----

    @Test
    public void aSubAppEventFoldsTheBankedSegmentWithoutForcingAFirestoreWrite() {
        tracker.onResume();
        clock.advance(12_000L);

        tracker.onSubAppEvent();

        assertEquals(1, flusher.flushedSegments.size());
        assertEquals(12L, flusher.flushedSegments.get(0).cappedSeconds);
        // The whole point of coalescing: durable on disk, but no write until the ticker or the next stop.
        assertEquals(0, flusher.flushPendingCallCount);
    }

    @Test
    public void aSubAppEventNeverClearsTheRecorderAndPersistsAfterTheFold() {
        tracker.onResume();
        clock.advance(12_000L);

        tracker.onSubAppEvent();

        // The segment is still open, so the record must survive and only shrink.
        verify(recorder, never()).clear();
        verify(recorder, times(1)).onCheckpoint();
        verify(recorder, never()).onSubAppEvent();
    }

    @Test
    public void aSubAppEventLeavesTheSegmentOpenSoTimeKeepsAccruing() {
        tracker.onResume();
        clock.advance(12_000L);

        tracker.onSubAppEvent();

        assertTrue(timer.isRunning());
    }

    @Test
    public void aSecondSubAppEventInTheSameMillisecondFoldsNothingAndOnlyBumpsLiveness() {
        tracker.onResume();
        clock.advance(12_000L);

        // FTM's handleLevelCompleted sends logSummaryData and logUserSessionsData back to back.
        tracker.onSubAppEvent();
        tracker.onSubAppEvent();

        assertEquals(1, flusher.flushedSegments.size());
        verify(recorder, times(1)).onCheckpoint();
        verify(recorder, times(1)).onSubAppEvent();
    }

    @Test
    public void aSubAppEventWhileNoSegmentIsOpenOnlyBumpsLiveness() {
        tracker.onSubAppEvent();

        assertEquals(0, flusher.flushedSegments.size());
        verify(recorder, times(1)).onSubAppEvent();
        verify(recorder, never()).onCheckpoint();
        verify(recorder, never()).clear();
    }

    @Test
    public void aSubAppEventArrivingAfterAFullDrainBanksNothingMore() {
        tracker.onResume();
        clock.advance(12_000L);
        tracker.onStop(false);

        // The JavaBridge thread can deliver an event after the lifecycle flush has already drained everything.
        tracker.onSubAppEvent();

        assertEquals(1, flusher.flushedSegments.size());
        verify(recorder, never()).onCheckpoint();
    }

    @Test
    public void timeSplitAcrossSubAppEventsAndTheFinalStopSumsToTheWholeSession() {
        tracker.onResume();

        clock.advance(10_000L);
        tracker.onSubAppEvent();

        clock.advance(20_000L);
        tracker.onSubAppEvent();

        clock.advance(5_000L);
        tracker.onStop(false);

        assertEquals(3, flusher.flushedSegments.size());
        assertEquals(35L, totalFlushedCappedSeconds());
    }

    @Test
    public void subSecondRemaindersSurviveEveryCheckpointAndJoinALaterOne() {
        tracker.onResume();

        // Three events at 1.6s each: flooring in isolation would hand out 1 + 1 + 1 and lose 1.8s.
        clock.advance(1_600L);
        tracker.onSubAppEvent();
        clock.advance(1_600L);
        tracker.onSubAppEvent();
        clock.advance(1_600L);
        tracker.onSubAppEvent();

        tracker.onStop(false);

        assertEquals(4L, totalFlushedCappedSeconds());
    }

    // ---- fakes ----

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
}

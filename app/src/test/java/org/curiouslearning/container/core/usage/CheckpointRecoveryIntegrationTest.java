package org.curiouslearning.container.core.usage;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import androidx.annotation.NonNull;

import org.curiouslearning.container.core.subapp.handler.AppEventWriteCallback;
import org.curiouslearning.container.core.usage.boot.BootTokenProvider;
import org.curiouslearning.container.core.usage.clock.MonotonicClock;
import org.curiouslearning.container.core.usage.flush.CoalescingUsageFlusher;
import org.curiouslearning.container.core.usage.flush.FlusherFactory;
import org.curiouslearning.container.core.usage.flush.PendingUsageWrite;
import org.curiouslearning.container.core.usage.flush.PendingUsageWriteRecovery;
import org.curiouslearning.container.core.usage.flush.PendingUsageWriteStore;
import org.curiouslearning.container.core.usage.flush.SubAppUsageFlusher;
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
 * The whole MR-228 Gap 2 chain end to end: a real {@link SubAppUsageTimer}, {@link OpenStretchRecorder},
 * {@link SubAppUsageTracker} and {@link CoalescingUsageFlusher} over fake stores, killed mid-session, then
 * replayed through both recovery passes on a fresh object graph.
 *
 * <p>The property under test is the one no single class can assert on its own: at every instant a second of
 * play is described by <em>exactly one</em> of the two records — the pending write or the open stretch —
 * never both and never neither. Lives in {@code core.usage} for package-private access to the test
 * constructors; Robolectric because the classes involved log via {@code android.util.Log}.
 */
@RunWith(RobolectricTestRunner.class)
@Config(sdk = 28)
public class CheckpointRecoveryIntegrationTest {

    private static final String APP = "feed-the-monster";
    private static final String LANG = "English";
    private static final String CR_USER_ID = "child-123";

    private static final long CAP_MS = 30L * 60L * 1000L;
    private static final long DEBOUNCE_MS = 1_500L;
    private static final long HEARTBEAT_MS = 60_000L;
    private static final long BOOT_TOKEN = 1_700_000_000_000L;

    private FakeClock clock;
    private FakePendingStore pendingStore;
    private FakeOpenStretchStore openStretchStore;
    private SubAppUsageTimer timer;
    private OpenStretchRecorder recorder;
    private CoalescingUsageFlusher flusher;
    private RecordingFlusher liveDelegate;
    private SubAppUsageTracker tracker;

    @Before
    public void setup() {
        clock = new FakeClock();
        pendingStore = new FakePendingStore();
        openStretchStore = new FakeOpenStretchStore();
        liveDelegate = new RecordingFlusher();

        timer = new SubAppUsageTimer(clock, CAP_MS, DEBOUNCE_MS);

        recorder = new OpenStretchRecorder(
                openStretchStore, timer, clock, new FixedBootTokenProvider(), new NoOpTicker(),
                APP, LANG, CR_USER_ID, HEARTBEAT_MS);

        // Nothing calls flushPending() during a simulated kill, so the delegate stays untouched and the
        // buffer stays on disk exactly as it would when a process dies before the periodic interval elapses.
        flusher = new CoalescingUsageFlusher(
                liveDelegate, pendingStore, new NoOpTicker(), APP, LANG, CR_USER_ID);

        tracker = new SubAppUsageTracker(timer, flusher, recorder, () -> true, APP, LANG);
    }

    /** Everything the two recovery passes would write at the next container launch. */
    private RecoveredTotals recoverEverything() {

        RecordingFlusher recovered = new RecordingFlusher();
        FlusherFactory factory = crUserId -> recovered;

        new PendingUsageWriteRecovery(pendingStore, factory).recoverAll();
        new OpenStretchRecovery(openStretchStore, new FixedBootTokenProvider(), factory, CAP_MS).recoverAll();

        return new RecoveredTotals(recovered.flushedSegments);
    }

    @Test
    public void aKillMidSessionIsRecoveredExactlyOnceWithMostOfItAsMeasuredTime() {
        tracker.onResume();

        clock.advance(40_000L);
        tracker.onSubAppEvent();

        clock.advance(25_000L);
        tracker.onSubAppEvent();

        // The container's own heartbeat is the last thing to run before the process dies.
        clock.advance(10_000L);
        recorder.onTick();

        assertTrue("nothing should have reached Firestore before the kill", liveDelegate.flushedSegments.isEmpty());

        RecoveredTotals totals = recoverEverything();

        // 75 seconds of play: 65 banked by the two events, 10 estimated from the un-banked tail.
        assertEquals(75L, totals.totalSeconds);
        assertEquals(65L, totals.measuredSeconds);
        assertEquals(10L, totals.recoveredSeconds);
        assertEquals(1L, totals.recoveredCount);
    }

    @Test
    public void bothStoresAreClearedOnceTheRecoveredWritesAreAccepted() {
        tracker.onResume();
        clock.advance(40_000L);
        tracker.onSubAppEvent();
        recorder.onTick();

        recoverEverything();

        assertTrue(pendingStore.saved.isEmpty());
        assertTrue(openStretchStore.saved.isEmpty());
    }

    @Test
    public void aSessionEndedCleanlyLeavesNothingForEitherRecoveryPass() {
        tracker.onResume();
        clock.advance(40_000L);
        tracker.onSubAppEvent();

        clock.advance(20_000L);
        tracker.onStop(false);

        // Gap 1: backgrounding writes the whole session immediately rather than buffering it.
        assertEquals(60L, liveDelegate.totalCappedSeconds());

        // And leaves nothing behind for either recovery pass to write a second time.
        RecoveredTotals totals = recoverEverything();

        assertEquals(0L, totals.totalSeconds);
        assertTrue(pendingStore.saved.isEmpty());
        assertTrue(openStretchStore.saved.isEmpty());
    }

    @Test
    public void aCheckpointThatDidNotRewriteTheRecordWouldCountTheSameSecondsTwice() {
        tracker.onResume();

        clock.advance(40_000L);
        recorder.onTick();

        // Exactly what onSubAppEvent does, minus the recorder.onCheckpoint() that shrinks the record. This is
        // the regression fence for that call: without it the banked time is described by both records.
        clock.advance(5_000L);
        UsageSegment banked = timer.checkpointAndDrain();
        assertFalse(banked.isEmpty());
        flusher.flush(banked, null);

        RecoveredTotals totals = recoverEverything();

        // A 45-second session reported as 85: 45 measured plus the 40 the stale record still claims.
        assertEquals(85L, totals.totalSeconds);
    }

    /** Split of what the two recovery passes wrote, by whether it came back measured or estimated. */
    private static final class RecoveredTotals {

        final long totalSeconds;
        final long measuredSeconds;
        final long recoveredSeconds;
        final long recoveredCount;

        RecoveredTotals(List<UsageSegment> segments) {
            long total = 0L;
            long measured = 0L;
            long recovered = 0L;
            long count = 0L;

            for (UsageSegment segment : segments) {
                total += segment.cappedSeconds;
                if (segment.isRecovered()) {
                    recovered += segment.recoveredSeconds;
                    count += segment.recoveredCount;
                } else {
                    measured += segment.cappedSeconds;
                }
            }

            this.totalSeconds = total;
            this.measuredSeconds = measured;
            this.recoveredSeconds = recovered;
            this.recoveredCount = count;
        }
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

    /** One boot, so nothing under test is filtered out as belonging to a previous one. */
    private static final class FixedBootTokenProvider implements BootTokenProvider {

        @Override
        public long currentToken() {
            return BOOT_TOKEN;
        }

        @Override
        public boolean matches(long storedToken) {
            return storedToken == BOOT_TOKEN;
        }
    }

    /** Stands in for Firestore, accepting every write immediately. */
    private static final class RecordingFlusher implements SubAppUsageFlusher {

        final List<UsageSegment> flushedSegments = new ArrayList<>();

        @Override
        public void flush(UsageSegment segment, AppEventWriteCallback callback) {
            flushedSegments.add(segment);
            if (callback != null) {
                callback.onQueued();
            }
        }

        long totalCappedSeconds() {
            long total = 0L;
            for (UsageSegment segment : flushedSegments) {
                total += segment.cappedSeconds;
            }
            return total;
        }
    }

    private static final class FakePendingStore implements PendingUsageWriteStore {

        final Map<String, PendingUsageWrite> saved = new LinkedHashMap<>();

        @NonNull
        @Override
        public List<PendingUsageWrite> loadAll() {
            return new ArrayList<>(saved.values());
        }

        @Override
        public void save(@NonNull PendingUsageWrite write) {
            saved.put(write.key(), write);
        }

        @Override
        public void delete(@NonNull String key) {
            saved.remove(key);
        }
    }

    private static final class FakeOpenStretchStore implements OpenStretchStore {

        final Map<String, OpenStretchRecord> saved = new LinkedHashMap<>();

        @NonNull
        @Override
        public List<OpenStretchRecord> loadAll() {
            return new ArrayList<>(saved.values());
        }

        @Override
        public void save(@NonNull OpenStretchRecord record) {
            saved.put(record.key(), record);
        }

        @Override
        public void delete(@NonNull String key) {
            saved.remove(key);
        }
    }

    /** No thread: these tests drive every tick by hand. */
    private static final class NoOpTicker implements HeartbeatTicker {

        @Override
        public void start(@NonNull Runnable tick, long intervalMs) {
        }

        @Override
        public void stop() {
        }
    }
}

package org.curiouslearning.container.core.usage;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import androidx.annotation.NonNull;

import org.curiouslearning.container.core.usage.boot.BootTokenProvider;
import org.curiouslearning.container.core.usage.clock.MonotonicClock;
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
 * {@link OpenStretchRecorder} takes only interfaces (a store, a clock, a boot-token provider, a ticker)
 * alongside a real {@link SubAppUsageTimer}, so hand-driven fakes exercise it without a device — Robolectric
 * is needed only because the class under test logs via {@code android.util.Log}.
 *
 * <p>Focus is MR-228's {@code onCheckpoint()}: the record must shrink the moment a checkpoint hands time to a
 * flusher, or that time is described by both the pending write and the open-stretch estimate and next launch
 * writes it twice.
 */
@RunWith(RobolectricTestRunner.class)
@Config(sdk = 28)
public class OpenStretchRecorderTest {

    private static final String APP = "feed-the-monster";
    private static final String LANG = "English";
    private static final String CR_USER_ID = "child-123";
    private static final String KEY = OpenStretchRecord.key(APP, LANG);

    private static final long CAP_MS = 30L * 60L * 1000L;
    private static final long DEBOUNCE_MS = 1_500L;
    private static final long HEARTBEAT_MS = 60_000L;
    private static final long BOOT_TOKEN = 1_700_000_000_000L;

    private FakeClock clock;
    private FakeStore store;
    private FakeTicker ticker;
    private SubAppUsageTimer timer;
    private OpenStretchRecorder recorder;

    @Before
    public void setup() {
        clock = new FakeClock();
        store = new FakeStore();
        ticker = new FakeTicker();
        timer = new SubAppUsageTimer(clock, CAP_MS, DEBOUNCE_MS);

        recorder = new OpenStretchRecorder(
                store, timer, clock, new FixedBootTokenProvider(), ticker, APP, LANG, CR_USER_ID, HEARTBEAT_MS);
    }

    /** Opens a segment the way {@code SubAppUsageTracker.openSegment()} does: timer first, then the record. */
    private void openSegment() {
        timer.start(APP, LANG);
        recorder.onSegmentOpened();
    }

    /** What {@code OpenStretchRecovery} would estimate from the record currently on disk. */
    private long estimatedSecondsOnDisk() {
        OpenStretchRecord record = store.saved.get(KEY);
        if (record == null) {
            return 0L;
        }
        long openMs = record.hasOpenSegment()
                ? Math.min(Math.max(0L, record.lastAliveMs - record.segmentStartMs), CAP_MS)
                : 0L;
        return (Math.max(0L, record.undrainedCappedMs) + openMs) / 1_000L;
    }

    @Test
    public void onCheckpointPersistsEvenWhenTheClockHasNotAdvanced() {
        openSegment();
        clock.advance(40_000L);
        timer.checkpointAndDrain();

        int savesBefore = store.saveCount;

        // No clock movement: onSubAppEvent()'s "only move forward" guard would skip the write entirely.
        recorder.onCheckpoint();

        assertEquals(savesBefore + 1, store.saveCount);
    }

    @Test
    public void theRecordAfterACheckpointNoLongerDescribesTheBankedTime() {
        openSegment();
        clock.advance(40_000L);
        recorder.onTick();

        assertEquals(40L, estimatedSecondsOnDisk());

        timer.checkpointAndDrain();
        recorder.onCheckpoint();

        // The 40 seconds are now a durable pending write; the record must not offer them a second time.
        assertEquals(0L, estimatedSecondsOnDisk());
    }

    @Test
    public void onlyTheTailSinceTheLastCheckpointRemainsRecoverable() {
        openSegment();
        clock.advance(40_000L);
        timer.checkpointAndDrain();
        recorder.onCheckpoint();

        clock.advance(15_000L);
        recorder.onTick();

        assertEquals(15L, estimatedSecondsOnDisk());
    }

    @Test
    public void aCheckpointedSegmentStillLeavesARecoverableRecordBehind() {
        openSegment();
        clock.advance(40_000L);
        timer.checkpointAndDrain();
        recorder.onCheckpoint();

        OpenStretchRecord record = store.saved.get(KEY);

        assertNotNull(record);
        assertTrue(record.hasOpenSegment());
        assertEquals(CR_USER_ID, record.crUserId);
        assertEquals(BOOT_TOKEN, record.bootToken);
    }

    @Test
    public void aCheckpointNeverStopsTheHeartbeatBecauseTheSegmentIsStillOpen() {
        openSegment();
        clock.advance(40_000L);
        timer.checkpointAndDrain();
        recorder.onCheckpoint();

        assertTrue(ticker.running);
    }

    @Test
    public void aRecordPersistedAfterAFullDrainEstimatesToNothing() {
        openSegment();
        clock.advance(40_000L);

        // A lifecycle flush on main can interleave with a checkpoint on the JavaBridge thread.
        timer.stopAndDrain();
        recorder.onCheckpoint();

        assertEquals(0L, estimatedSecondsOnDisk());
        assertNull(store.saved.get(KEY));
    }

    @Test
    public void clearRemovesTheRecordAndStopsTheHeartbeat() {
        openSegment();
        clock.advance(40_000L);

        recorder.clear();

        assertTrue(store.saved.isEmpty());
        assertFalse(ticker.running);
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

    private static final class FakeStore implements OpenStretchStore {

        final Map<String, OpenStretchRecord> saved = new LinkedHashMap<>();
        int saveCount;

        @NonNull
        @Override
        public List<OpenStretchRecord> loadAll() {
            return new ArrayList<>(saved.values());
        }

        @Override
        public void save(@NonNull OpenStretchRecord record) {
            saveCount++;
            saved.put(record.key(), record);
        }

        @Override
        public void delete(@NonNull String key) {
            saved.remove(key);
        }
    }

    private static final class FakeTicker implements HeartbeatTicker {

        boolean running;

        @Override
        public void start(@NonNull Runnable tick, long intervalMs) {
            running = true;
        }

        @Override
        public void stop() {
            running = false;
        }
    }
}

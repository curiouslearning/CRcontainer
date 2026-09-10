package org.curiouslearning.container.core.usage.flush;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.curiouslearning.container.core.subapp.handler.AppEventWriteCallback;
import org.curiouslearning.container.core.usage.UsageSegment;
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
 * {@link PendingUsageWriteRecovery} logs via {@code android.util.Log}, hence Robolectric; everything else is
 * hand-rolled fakes, mirroring {@code CoalescingUsageFlusherTest}.
 *
 * <p>Unlike {@code OpenStretchRecovery}, there is no boot-token or elapsed-time check to exercise here at
 * all — {@link PendingUsageWrite} carries no such field (data-model.md's "what it deliberately does not
 * carry"), so every persisted record recovers regardless of how stale it is or what boot wrote it (FR-011).
 */
@RunWith(RobolectricTestRunner.class)
@Config(sdk = 28)
public class PendingUsageWriteRecoveryTest {

    private static final String APP = "feed-the-monster";
    private static final String LANG = "English";
    private static final String CR_USER_ID = "child-123";
    private static final String KEY = PendingUsageWrite.key(APP, LANG);

    private FakeStore store;
    private FakeFlusher flusher;
    private PendingUsageWriteRecovery recovery;

    @Before
    public void setup() {
        store = new FakeStore();
        flusher = new FakeFlusher();
        recovery = new PendingUsageWriteRecovery(store, crUserId -> flusher);
    }

    @Test
    public void recoveredRecordUsesThePlainUsageSegmentConstructorWithNoRecoveryCounters() {
        store.save(new PendingUsageWrite(APP, LANG, CR_USER_ID, 42L, 50L));

        recovery.recoverAll();

        assertEquals(1, flusher.flushed.size());
        UsageSegment segment = flusher.flushed.get(0);
        assertEquals(APP, segment.appKey);
        assertEquals(LANG, segment.language);
        assertEquals(42L, segment.cappedSeconds);
        assertEquals(50L, segment.rawSeconds);
        assertEquals(0L, segment.recoveredSeconds);
        assertEquals(0L, segment.recoveredCount);
        assertFalse(segment.isRecovered());
    }

    @Test
    public void recordIsDeletedOnlyOnceTheRecoveryFlushIsQueued() {
        store.save(new PendingUsageWrite(APP, LANG, CR_USER_ID, 10L, 10L));

        recovery.recoverAll();

        assertTrue(store.saved.containsKey(KEY));

        flusher.completeLastWithQueued();

        assertFalse(store.saved.containsKey(KEY));
    }

    @Test
    public void onFailedKeepsTheRecordForTheNextLaunch() {
        store.save(new PendingUsageWrite(APP, LANG, CR_USER_ID, 10L, 10L));

        recovery.recoverAll();
        flusher.completeLastWithFailure();

        assertTrue(store.saved.containsKey(KEY));
    }

    @Test
    public void oneRecordsFailureDoesNotStopTheOthersFromRecovering() {
        store.save(new PendingUsageWrite("assessment", LANG, CR_USER_ID, 5L, 5L));
        store.save(new PendingUsageWrite(APP, LANG, CR_USER_ID, 10L, 10L));

        SubAppUsageFlusher partiallyBrokenFlusher = new SubAppUsageFlusher() {
            @Override
            public void flush(UsageSegment segment, AppEventWriteCallback callback) {
                if ("assessment".equals(segment.appKey)) {
                    throw new RuntimeException("simulated failure recovering assessment");
                }
                flusher.flush(segment, callback);
            }
        };

        PendingUsageWriteRecovery recoveryWithPartialFailure =
                new PendingUsageWriteRecovery(store, crUserId -> partiallyBrokenFlusher);

        recoveryWithPartialFailure.recoverAll();

        assertEquals(1, flusher.flushed.size());
        assertEquals(APP, flusher.flushed.get(0).appKey);
    }

    @Test
    public void anEmptyRecordIsDiscardedWithoutAttemptingAFlush() {
        // Should never be persisted in this state, but a corrupted record must not become a phantom write.
        store.saved.put(KEY, new PendingUsageWrite(APP, LANG, CR_USER_ID, 0L, 0L));

        recovery.recoverAll();

        assertEquals(0, flusher.flushed.size());
        assertTrue(store.saved.isEmpty());
    }

    @Test
    public void noRecordsIsANoOp() {
        recovery.recoverAll();

        assertEquals(0, flusher.flushed.size());
    }

    // ---- fakes ----

    private static final class FakeFlusher implements SubAppUsageFlusher {

        final List<UsageSegment> flushed = new ArrayList<>();
        private final List<AppEventWriteCallback> callbacks = new ArrayList<>();

        @Override
        public void flush(UsageSegment segment, AppEventWriteCallback callback) {
            flushed.add(segment);
            callbacks.add(callback);
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
                callback.onFailed(new RuntimeException("simulated recovery failure"));
            }
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
}

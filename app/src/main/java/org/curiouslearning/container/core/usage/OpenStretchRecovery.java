package org.curiouslearning.container.core.usage;

import android.util.Log;

import androidx.annotation.NonNull;

import org.curiouslearning.container.core.subapp.handler.AppEventWriteCallback;

import java.util.List;

/**
 * Turns {@link OpenStretchRecord}s left by a previous run into writes, on container launch. The estimate
 * ends at the record's last-known-alive point, never at the moment of recovery.
 */
public final class OpenStretchRecovery {

    private static final String TAG = "OpenStretchRecovery";

    private static final long MILLIS_PER_SECOND = 1_000L;

    private final OpenStretchStore store;
    private final BootTokenProvider bootTokens;
    private final FlusherFactory flusherFactory;
    private final long capMs;

    /**
     * Builds the flusher for one record's own {@code cr_user_id} — never from current state, which the
     * debug override can have changed since.
     */
    public interface FlusherFactory {
        SubAppUsageFlusher forUser(@NonNull String crUserId);
    }

    public OpenStretchRecovery(@NonNull OpenStretchStore store,
                               @NonNull BootTokenProvider bootTokens,
                               @NonNull FlusherFactory flusherFactory) {
        this(store, bootTokens, flusherFactory, SubAppUsageTimer.DEFAULT_CAP_MS);
    }

    /** Visible for tests, so the cap can be exercised without simulating 45 minutes. */
    OpenStretchRecovery(@NonNull OpenStretchStore store,
                        @NonNull BootTokenProvider bootTokens,
                        @NonNull FlusherFactory flusherFactory,
                        long capMs) {
        this.store = store;
        this.bootTokens = bootTokens;
        this.flusherFactory = flusherFactory;
        this.capMs = capMs;
    }

    /**
     * Recovers every leftover record. One record's failure never stops the others: a child who used two
     * sub-apps before a crash should not lose both because one of them is unreadable.
     */
    public void recoverAll() {

        List<OpenStretchRecord> records;

        try {
            records = store.loadAll();
        } catch (Exception e) {
            Log.w(TAG, "Could not read open stretches; nothing recovered this launch", e);
            return;
        }

        if (records.isEmpty()) {
            return;
        }

        Log.d(TAG, "Found " + records.size() + " open stretch(es) from a previous run");

        for (OpenStretchRecord record : records) {
            try {
                recover(record);
            } catch (Exception e) {
                Log.w(TAG, "Could not recover " + record.key() + "; leaving it for the next launch", e);
            }
        }
    }

    private void recover(OpenStretchRecord record) {

        if (!bootTokens.matches(record.bootToken)) {
            // Nothing is written — not a duration, and not a zero-length recovery, which would inflate
            // cr_recovered_count with events that contributed no time.
            Log.d(TAG, "Discarding " + record.key() + ": recorded in a previous boot");
            store.delete(record.key());
            return;
        }

        long seconds = estimateSeconds(record);

        if (seconds <= 0L) {
            Log.d(TAG, "Discarding " + record.key() + ": estimates to nothing");
            store.delete(record.key());
            return;
        }

        UsageSegment segment = UsageSegment.recovered(record.appKey, record.language, seconds);

        flusherFactory.forUser(record.crUserId).flush(segment, new AppEventWriteCallback() {
            @Override
            public void onQueued() {
                // Durable in Firestore's local queue, offline or not. Gating on the server acknowledging
                // instead would replay the record every offline launch and double-count.
                store.delete(record.key());
                Log.d(TAG, "Recovered " + segment);
            }

            @Override
            public void onFailed(Exception e) {
                // Kept, so a rejected write becomes a retry next launch rather than lost time.
                Log.w(TAG, "Recovery write failed for " + record.key() + "; record kept", e);
            }
        });
    }

    /**
     * {@code undrained + min(lastAlive - segmentStart, cap)}, in whole seconds, never negative. The cap
     * applies to the open segment alone; the undrained total is already a sum of individually capped ones.
     */
    private long estimateSeconds(OpenStretchRecord record) {

        long totalMs = Math.max(0L, record.undrainedCappedMs);

        if (record.hasOpenSegment()) {
            long openMs = record.lastAliveMs - record.segmentStartMs;
            totalMs += Math.min(Math.max(0L, openMs), capMs);
        }

        return totalMs / MILLIS_PER_SECOND;
    }
}

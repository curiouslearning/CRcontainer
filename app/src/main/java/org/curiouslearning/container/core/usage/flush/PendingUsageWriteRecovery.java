package org.curiouslearning.container.core.usage.flush;

import android.util.Log;

import androidx.annotation.NonNull;

import org.curiouslearning.container.core.subapp.handler.AppEventWriteCallback;
import org.curiouslearning.container.core.usage.UsageSegment;

import java.util.List;

/**
 * Turns {@link PendingUsageWrite}s left by a previous run into ordinary writes, on container launch.
 *
 * <p>Bypasses {@link CoalescingUsageFlusher} entirely (research.md D6): recovery runs once, before any
 * sub-app is open, so there is nothing to batch with, and routing a single recovered write through a fresh
 * buffer-and-ticker would only add a delay to data that is already fully known.
 */
public final class PendingUsageWriteRecovery {

    private static final String TAG = "PendingUsageWriteRecovery";

    private final PendingUsageWriteStore store;
    private final FlusherFactory flusherFactory;

    public PendingUsageWriteRecovery(@NonNull PendingUsageWriteStore store,
                                     @NonNull FlusherFactory flusherFactory) {
        this.store = store;
        this.flusherFactory = flusherFactory;
    }

    /**
     * Recovers every leftover record. One record's failure never stops the others: a child who used two
     * sub-apps before a crash should not lose both because one of them is unreadable.
     */
    public void recoverAll() {

        List<PendingUsageWrite> records;

        try {
            records = store.loadAll();
        } catch (Exception e) {
            Log.w(TAG, "Could not read pending usage writes; nothing recovered this launch", e);
            return;
        }

        if (records.isEmpty()) {
            return;
        }

        Log.d(TAG, "Found " + records.size() + " pending usage write(s) from a previous run");

        for (PendingUsageWrite record : records) {
            try {
                recover(record);
            } catch (Exception e) {
                Log.w(TAG, "Could not recover " + record.key() + "; leaving it for the next launch", e);
            }
        }
    }

    private void recover(PendingUsageWrite record) {

        if (record.isEmpty()) {
            // Should never be persisted in this state, but a corrupted record must not become a phantom
            // zero-length write.
            store.delete(record.key());
            return;
        }

        // The plain, non-recovered constructor: this time was already measured by SubAppUsageTimer, not
        // estimated, so it must never touch cr_recovered_seconds/cr_recovered_count (FR-009). No boot-token
        // or elapsed-time check gates this at all — unlike an OpenStretchRecord, this record carries no
        // elapsed-time anchor for a reboot to invalidate (FR-011).
        UsageSegment segment =
                new UsageSegment(record.appKey, record.language, record.cappedSeconds, record.rawSeconds);

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
}

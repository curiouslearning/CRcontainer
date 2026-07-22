package org.curiouslearning.container.core.subapp.handler;

import android.util.Log;

import androidx.annotation.NonNull;

import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.ListenerRegistration;
import com.google.firebase.firestore.MetadataChanges;
import com.google.firebase.firestore.SetOptions;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

/**
 * Shared state and sync-listener mechanics for the per-collection payload handlers
 * ({@link DefaultAppEventPayloadHandler}, {@link SummaryDataEventPayloadHandler}).
 * Each subclass keeps its own {@code crUserId}-scoped singleton and its own
 * {@code syncListeners} registry, since the two classes track distinct sets of
 * Firestore documents (sessions vs. summaries) and never share a docId.
 */
abstract class BaseAppEventPayloadHandler {

    private static final String TAG = "AppEventHandler";

    protected final String crUserId;
    private final Map<String, ListenerRegistration> syncListeners = new HashMap<>();

    protected BaseAppEventPayloadHandler(@NonNull String crUserId) {
        this.crUserId = crUserId;
    }

    /**
     * Removes any active sync listeners and clears the registry. Used when the shared
     * instance is replaced for a new {@code crUserId} so stale registrations are not leaked.
     */
    protected void detachListeners() {
        for (ListenerRegistration reg : syncListeners.values()) {
            if (reg != null) {
                reg.remove();
            }
        }
        syncListeners.clear();
    }

    /**
     * Attaches a one-shot metadata listener that stamps synced_at when the pending write
     * is confirmed by the Firestore server (offline write flushed on reconnect, or
     * immediate server confirmation when already online).
     *
     * Safe to call multiple times for the same docRef — only one listener is kept active
     * per document ID at a time.
     */
    protected void attachSyncListener(@NonNull DocumentReference docRef) {
        String docId = docRef.getId();

        if (syncListeners.containsKey(docId)) {
            Log.d(TAG, "Sync listener already active for docId=" + docId);
            return;
        }

        ListenerRegistration[] holder = {null};
        holder[0] = docRef.addSnapshotListener(MetadataChanges.INCLUDE, (snapshot, error) -> {
            if (snapshot == null || error != null) return;
            if (!snapshot.getMetadata().hasPendingWrites() && !snapshot.getMetadata().isFromCache()) {
                syncListeners.remove(docId);
                if (holder[0] != null) holder[0].remove();
                Log.d(TAG, "Sync detected for docId=" + docId);
                Map<String, Object> update = new HashMap<>();
                update.put("synced_at", Instant.now().toString());
                docRef.set(update, SetOptions.merge())
                        .addOnSuccessListener(v ->
                                Log.d(TAG, "synced_at recorded for docId=" + docId))
                        .addOnFailureListener(e ->
                                Log.e(TAG, "Failed to record synced_at for docId=" + docId, e));
            }
        });

        syncListeners.put(docId, holder[0]);
    }
}

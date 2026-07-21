package org.curiouslearning.container.core.subapp.handler;

import android.util.Log;

import androidx.annotation.NonNull;

import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FieldValue;
import com.google.firebase.firestore.ListenerRegistration;
import com.google.firebase.firestore.MetadataChanges;
import com.google.firebase.firestore.SetOptions;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.Query;

import org.curiouslearning.container.BuildConfig;
import org.curiouslearning.container.core.context.AppContext;
import org.curiouslearning.container.core.context.AppContextKey;
import org.curiouslearning.container.core.subapp.payload.AppEventPayload;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

public class DefaultAppEventPayloadHandler
        implements AppEventPayloadHandler {

    private static final String TAG = "AppEventHandler";
    private static final String COLLECTION_USER_SESSION = "user_sessions_data";
    private static final String COLLECTION_SUMMARY = "summary_data";

    private final Map<String, ListenerRegistration> syncListeners = new HashMap<>();
    private final String crUserId;

    // Process-level shared instance so the container (MainActivity) and every sub-app (WebApp) resolve to
    // one handler. A single syncListeners map makes the per-doc dedup guard in attachSyncListener effective
    // process-wide (exactly one sync listener per summary doc), and lets MainActivity warm Firestore /
    // attach listeners on container open, before any sub-app is launched.
    private static DefaultAppEventPayloadHandler instance;

    /**
     * Returns the shared handler for {@code crUserId}, constructing it on first use. Rebuilds (detaching the
     * previous instance's listeners) only when the id changes — which in practice happens only under the
     * DEBUG {@code custom_cr_user_id} override; the production {@code pseudoId} is stable for the process.
     */
    public static synchronized DefaultAppEventPayloadHandler getInstance(@NonNull String crUserId) {
        if (instance == null || !instance.crUserId.equals(crUserId)) {
            if (instance != null) {
                instance.detachListeners();
            }
            instance = new DefaultAppEventPayloadHandler(crUserId);
        }
        return instance;
    }

    public DefaultAppEventPayloadHandler(@NonNull String crUserId) {
        this.crUserId = crUserId;
        attachExistingSyncListeners();
    }

    /**
     * Removes any active sync listeners and clears the registry. Used when the shared instance is replaced
     * for a new {@code crUserId} so stale registrations are not leaked.
     */
    private void detachListeners() {
        for (ListenerRegistration reg : syncListeners.values()) {
            if (reg != null) {
                reg.remove();
            }
        }
        syncListeners.clear();
    }

    private void attachExistingSyncListeners() {
        if (crUserId.trim().isEmpty()) {
            Log.w(TAG, "cr_user_id is blank — skipping existing sync listener attachment");
            return;
        }
        FirebaseFirestore db = FirebaseFirestore.getInstance();
        db.collection(COLLECTION_SUMMARY)
                .whereEqualTo("cr_user_id", crUserId)
                .get()
                .addOnSuccessListener(querySnapshot -> {
                    List<DocumentSnapshot> docs = querySnapshot.getDocuments();
                    Log.d(TAG, "Attaching sync listeners to " + docs.size() + " existing summary docs");
                    for (DocumentSnapshot doc : docs) {
                        attachSyncListener(
                                db.collection(COLLECTION_SUMMARY).document(doc.getId())
                        );
                    }
                })
                .addOnFailureListener(e ->
                        Log.w(TAG, "Failed to fetch existing summary docs for sync listener attachment", e));
    }

    @Override
    public void handle(AppEventPayload payload) {

        Log.d(
                TAG,
                "Accepted payload | app_id=" + payload.app_id +
                        " collection=" + payload.collection
        );

        storePayload(payload);
    }

    
    private void storePayload(@NonNull AppEventPayload payload) {

        FirebaseFirestore db = FirebaseFirestore.getInstance();
        String rawCollection = payload.collection;
        String normalizedCollection = normalizeCollection(rawCollection);

        if (payload.cr_user_id == null || payload.cr_user_id.trim().isEmpty() ||
                payload.app_id == null || payload.app_id.trim().isEmpty() ||
                normalizedCollection == null || normalizedCollection.isEmpty()
        ) {

            Log.e(TAG, "Invalid payload — missing or blank required fields");
            return;
        }

        payload.collection = normalizedCollection;

        // Stamp the container build version into metadata (not data), using the
        // `container_app_version` naming shared with the WebView URL param and the
        // Firebase user property set by the sub-apps.
        if (payload.metadata == null) {
            payload.metadata = new HashMap<>();
        }
        payload.metadata.put("container_app_version", BuildConfig.VERSION_NAME);

        switch (normalizedCollection) {

            case COLLECTION_USER_SESSION:
                Log.d(TAG, "Handling user_sessions_data payload");
                storeUserSessionPayload(db, payload);
                break;

            case COLLECTION_SUMMARY:
                Log.d(TAG, "Handling summary_data payload");
                storeSummaryPayload(db, payload);
                break;

            default:
                Log.e(
                        TAG,
                        "Unsupported collection: raw='" + rawCollection +
                                "' normalized='" + normalizedCollection +
                                "' length=" + normalizedCollection.length()
                );
                return;
        }
    }

    private String normalizeCollection(String collection) {

        if (collection == null) {
            return null;
        }

        String normalized = collection.trim().toLowerCase(Locale.US);

        if ("user_sessions_data".equals(normalized)) {
            return COLLECTION_USER_SESSION;
        }

        if ("summary_data".equals(normalized)) {
            return COLLECTION_SUMMARY;
        }

        return normalized;
    }

    /**
     * Direct save for user_sessions_data
     */
    private void storeUserSessionPayload(
            FirebaseFirestore db,
            AppEventPayload payload
    ) {

        if (!(payload.data instanceof Map)) {
            Log.e(TAG, "Invalid payload.data type. Expected Map but got: "
                    + (payload.data == null ? "null" : payload.data.getClass()));
            return;
        }

        // Enrich with the Curious Reader selected language, read at event time from AppContext.
        // Language can only change from MainActivity (never while a sub-app WebView is foregrounded),
        // so the store-time value equals the launch language. Scoped to user_sessions_data only.
        if (payload.metadata == null) {
            payload.metadata = new HashMap<>();
        }
        payload.metadata.put("language", resolveLanguage());

        Map<String, Object> record = new HashMap<>();

        record.put("cr_user_id", payload.cr_user_id);
        record.put("app_id", payload.app_id);
        record.put("collection", payload.collection);
        record.put("created_at", Instant.now().toString());
        record.put("schema_version", payload.schema_version != null ? payload.schema_version : "unknown");
        record.put("metadata", payload.metadata);

        Map<String, Object> data =
                new HashMap<>((Map<String, Object>) payload.data);

        record.put("data", data);

        db.collection(payload.collection)
                .add(record)
                .addOnSuccessListener(ref -> {
                    Log.d(TAG, "User session saved docId=" + ref.getId());
                    attachSyncListener(ref);
                })
                .addOnFailureListener(e ->
                        Log.e(TAG, "Failed to save user session payload", e));
    }

    /**
     * Resolves the Curious Reader selected language from {@link AppContext} for event enrichment.
     * Falls back to {@code "unknown"} when the language is absent/blank — matching the
     * {@code schema_version} fallback convention — or when the read fails (e.g. AppContext not yet
     * initialized), so event storage never fails solely because the language is unavailable.
     */
    private String resolveLanguage() {
        try {
            String lang = AppContext.getInstance().get(AppContextKey.LANGUAGE);
            return (lang != null && !lang.trim().isEmpty()) ? lang : "unknown";
        } catch (Exception e) {
            Log.w(TAG, "Language unavailable for enrichment — defaulting to \"unknown\"", e);
            return "unknown";
        }
    }

    /**
     * Used for summary_data
     */
    private void storeSummaryPayload(
            FirebaseFirestore db,
            AppEventPayload payload
    ) {

        if (!(payload.data instanceof Map)) {
            Log.e(TAG, "Invalid payload.data type. Expected Map but got: "
                    + (payload.data == null ? "null" : payload.data.getClass()));
            return;
        }

        Log.d(TAG, "Querying summary record (offline-first)");

        Query query = db.collection(payload.collection)
                .whereEqualTo("cr_user_id", payload.cr_user_id)
                .whereEqualTo("app_id", payload.app_id)
                .limit(1);

        // Build the data write map once, using atomic FieldValue.increment sentinels for
        // "add" fields so concurrent summary writes compose server-side instead of being
        // read-modified-written (which loses updates when two writes race — e.g. the
        // PUZZLE_COMPLETED + LEVEL_COMPLETED pair fired on the last puzzle of a level).
        Map<String, Object> dataWriteMap = buildSummaryDataWriteMap(payload);

        Map<String, Object> record = new HashMap<>();
        record.put("cr_user_id", payload.cr_user_id);
        record.put("app_id", payload.app_id);
        record.put("metadata", payload.metadata);
        record.put("data", dataWriteMap);

        query.get()
                .addOnSuccessListener(querySnapshot -> {
                    if (!querySnapshot.isEmpty()) {

                        DocumentSnapshot existingDoc = querySnapshot.getDocuments().get(0);

                        record.put("updated_at", Instant.now().toString());

                        DocumentReference existingRef = db.collection(payload.collection)
                                .document(existingDoc.getId());

                        existingRef.set(record, SetOptions.merge())
                                .addOnSuccessListener(aVoid -> {
                                    Log.d(TAG, "Updated summary payload with id: " + existingDoc.getId());
                                    attachSyncListener(existingRef);
                                })
                                .addOnFailureListener(e ->
                                        Log.e(TAG, "Failed to update summary payload", e));

                    } else {

                        Log.d(TAG, "No existing summary record — creating new");
                        createNewSummaryDoc(db, payload, record);
                    }
                })
                .addOnFailureListener(e -> {

                    Log.w(TAG, "Query failed — creating new summary record", e);
                    createNewSummaryDoc(db, payload, record);
                });
    }

    private void createNewSummaryDoc(
            FirebaseFirestore db,
            AppEventPayload payload,
            Map<String, Object> record
    ) {

        // record already carries the atomic-increment data write map built in
        // storeSummaryPayload. FieldValue.increment treats a missing field as 0, so the
        // same map is correct for a brand-new document too.
        record.put("collection", payload.collection);
        record.put("created_at", Instant.now().toString());
        record.put("schema_version", payload.schema_version != null ? payload.schema_version : "unknown");

        db.collection(payload.collection)
                .add(record)
                .addOnSuccessListener(ref -> {
                    Log.d(TAG, "Created new summary payload docId=" + ref.getId());
                    attachSyncListener(ref);
                })
                .addOnFailureListener(e ->
                        Log.e(TAG, "Failed to create summary payload", e));
    }

    /**
     * Builds the {@code data} write map for a summary_data payload. "add" fields are emitted
     * as atomic {@link FieldValue#increment} sentinels so concurrent writes compose
     * server-side rather than being read-modified-written (which loses updates when two
     * summary writes race). "replace" fields (and "add" on a non-numeric value, matching the
     * legacy fallback) are written verbatim.
     *
     * This does NOT read the existing document: {@code increment} treats a missing field as
     * 0, so the same map is correct whether the target doc already exists or is being created.
     * Written with {@link SetOptions#merge}, sibling fields not present here are left intact.
     */
    private Map<String, Object> buildSummaryDataWriteMap(@NonNull AppEventPayload payload) {

        Map<String, Object> writeMap = new HashMap<>();

        if (!(payload.data instanceof Map)) {
            Log.e(TAG, "Invalid payload.data type during write-map build");
            return writeMap;
        }

        Map<String, Object> newData = (Map<String, Object>) payload.data;

        Map<String, Object> options = new HashMap<>();

        if (payload.options instanceof Map) {
            Map<?, ?> raw = (Map<?, ?>) payload.options;
            for (Map.Entry<?, ?> entry : raw.entrySet()) {
                options.put(String.valueOf(entry.getKey()), entry.getValue());
            }
        }

        for (Map.Entry<String, Object> entry : newData.entrySet()) {

            String key = entry.getKey();
            Object newValue = entry.getValue();

            String operation =
                    options.get(key) instanceof String
                            ? (String) options.get(key)
                            : "replace";

            if ("add".equals(operation) && newValue instanceof Number) {

                Number n = (Number) newValue;

                boolean integral =
                        n instanceof Long ||
                                n instanceof Integer ||
                                n instanceof Short ||
                                n instanceof Byte;

                writeMap.put(key, integral
                        ? FieldValue.increment(n.longValue())
                        : FieldValue.increment(n.doubleValue()));

            } else {
                // "replace" (default), or "add" on a non-numeric value — overwrite.
                writeMap.put(key, newValue);
            }
        }

        return writeMap;
    }

    /**
     * Attaches a one-shot metadata listener that stamps synced_at when the pending write
     * is confirmed by the Firestore server (offline write flushed on reconnect, or
     * immediate server confirmation when already online).
     *
     * Safe to call multiple times for the same docRef — only one listener is kept active
     * per document ID at a time.
     */
    private void attachSyncListener(@NonNull DocumentReference docRef) {
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

package org.curiouslearning.container.core.subapp.handler;

import android.util.Log;

import androidx.annotation.NonNull;

import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FieldValue;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QuerySnapshot;
import com.google.firebase.firestore.SetOptions;

import org.curiouslearning.container.core.subapp.payload.AppEventPayload;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Handles {@code summary_data} payloads, partitioned per language via the
 * {@code metadata.language} field (stamped by {@link DefaultAppEventPayloadHandler}
 * from the {@code AppContext}-cached Curious Reader language before delegating here).
 *
 * When no language is stamped on the payload (unset/blank at the time the event was
 * processed), the query/write shape falls back to the pre-language-partitioning
 * behavior: match on {@code cr_user_id} + {@code app_id} only. This is also what
 * transparently picks up legacy summary docs that predate language partitioning,
 * without a separate migration.
 */
class SummaryDataEventPayloadHandler extends BaseAppEventPayloadHandler {

    private static final String TAG = "AppEventHandler";
    static final String COLLECTION_SUMMARY = "summary_data";
    private static final String LANGUAGE_FIELD = "metadata.language";

    private static SummaryDataEventPayloadHandler instance;

    static synchronized SummaryDataEventPayloadHandler getInstance(@NonNull String crUserId) {
        if (instance == null || !instance.crUserId.equals(crUserId)) {
            if (instance != null) {
                instance.detachListeners();
            }
            instance = new SummaryDataEventPayloadHandler(crUserId);
        }
        return instance;
    }

    private SummaryDataEventPayloadHandler(@NonNull String crUserId) {
        super(crUserId);
        attachExistingSyncListeners();
    }

    private void attachExistingSyncListeners() {
        if (crUserId.trim().isEmpty()) {
            Log.w(TAG, "cr_user_id is blank — skipping existing sync listener attachment");
            return;
        }

        Log.d(TAG, "Attaching sync listeners for cr_user_id=" + crUserId);

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

    void handle(@NonNull AppEventPayload payload) {

        if (!(payload.data instanceof Map)) {
            Log.e(TAG, "Invalid payload.data type. Expected Map but got: "
                    + (payload.data == null ? "null" : payload.data.getClass()));
            return;
        }

        FirebaseFirestore db = FirebaseFirestore.getInstance();

        String language = payload.metadata != null
                ? (String) payload.metadata.get("language")
                : null;

        Log.d(TAG, "Querying summary record (offline-first)"
                + (language != null ? " language=" + language : " (no language)"));

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

        if (language != null) {
            // Language known: Firestore can match it server-side directly.
            db.collection(payload.collection)
                    .whereEqualTo("cr_user_id", payload.cr_user_id)
                    .whereEqualTo("app_id", payload.app_id)
                    .whereEqualTo(LANGUAGE_FIELD, language)
                    .limit(1)
                    .get()
                    .addOnSuccessListener(querySnapshot ->
                            onQueryResult(db, payload, record, firstDocId(querySnapshot)))
                    .addOnFailureListener(e -> {
                        Log.w(TAG, "Query failed — creating new summary record", e);
                        createNewSummaryDoc(db, payload, record);
                    });
        } else {
            // Language unknown: Firestore has no "field does not exist" filter, so match
            // cr_user_id + app_id server-side, then pick the doc lacking metadata.language
            // client-side. This is what keeps the fallback from silently updating a doc
            // that's already tagged with a different, known language.
            db.collection(payload.collection)
                    .whereEqualTo("cr_user_id", payload.cr_user_id)
                    .whereEqualTo("app_id", payload.app_id)
                    .get()
                    .addOnSuccessListener(querySnapshot -> {
                        String existingDocId = null;
                        for (DocumentSnapshot doc : querySnapshot.getDocuments()) {
                            if (!doc.contains(LANGUAGE_FIELD)) {
                                existingDocId = doc.getId();
                                break;
                            }
                        }
                        onQueryResult(db, payload, record, existingDocId);
                    })
                    .addOnFailureListener(e -> {
                        Log.w(TAG, "Query failed — creating new summary record", e);
                        createNewSummaryDoc(db, payload, record);
                    });
        }
    }

    private static String firstDocId(QuerySnapshot querySnapshot) {
        return querySnapshot.isEmpty() ? null : querySnapshot.getDocuments().get(0).getId();
    }

    private void onQueryResult(
            FirebaseFirestore db,
            AppEventPayload payload,
            Map<String, Object> record,
            String existingDocId
    ) {
        if (existingDocId != null) {

            record.put("updated_at", Instant.now().toString());

            DocumentReference existingRef = db.collection(payload.collection).document(existingDocId);

            existingRef.set(record, SetOptions.merge())
                    .addOnSuccessListener(aVoid -> {
                        Log.d(TAG, "Updated summary payload with id: " + existingDocId);
                        attachSyncListener(existingRef);
                    })
                    .addOnFailureListener(e ->
                            Log.e(TAG, "Failed to update summary payload", e));

        } else {
            Log.d(TAG, "No existing summary record — creating new");
            createNewSummaryDoc(db, payload, record);
        }
    }

    private void createNewSummaryDoc(
            FirebaseFirestore db,
            AppEventPayload payload,
            Map<String, Object> record
    ) {

        // record already carries the atomic-increment data write map built in handle().
        // FieldValue.increment treats a missing field as 0, so the same map is correct
        // for a brand-new document too.
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
}

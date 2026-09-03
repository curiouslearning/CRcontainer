package org.curiouslearning.container.core.subapp.handler;

import android.util.Log;

import androidx.annotation.NonNull;

import com.google.android.gms.tasks.Task;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FieldValue;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QuerySnapshot;
import com.google.firebase.firestore.SetOptions;

import org.curiouslearning.container.BuildConfig;
import org.curiouslearning.container.core.context.AppContext;
import org.curiouslearning.container.core.context.AppContextKey;
import org.curiouslearning.container.core.subapp.payload.AppEventPayload;
import org.curiouslearning.container.utilities.CountryProvider;

import java.time.Instant;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

public class DefaultAppEventPayloadHandler
        implements AppEventPayloadHandler {

    private static final String TAG = "AppEventHandler";
    private static final String COLLECTION_USER_SESSION = "user_sessions_data";
    private static final String COLLECTION_SUMMARY = "summary_data";
    private static final String LANGUAGE_FIELD = "metadata.language";

    private final String crUserId;

    // Process-level shared instance so the container (MainActivity) and every sub-app (WebApp) resolve to
    // one handler, and so MainActivity can warm Firestore on container open — priming the local cache with
    // this user's summary docs before any sub-app is launched (see prefetchSummaryDocs).
    private static DefaultAppEventPayloadHandler instance;

    /**
     * Returns the shared handler for {@code crUserId}, constructing it on first use. Rebuilds only when the
     * id changes — which in practice happens only under the DEBUG {@code custom_cr_user_id} override; the
     * production {@code pseudoId} is stable for the process.
     */
    public static synchronized DefaultAppEventPayloadHandler getInstance(@NonNull String crUserId) {
        if (instance == null || !instance.crUserId.equals(crUserId)) {
            instance = new DefaultAppEventPayloadHandler(crUserId);
        }
        return instance;
    }

    public DefaultAppEventPayloadHandler(@NonNull String crUserId) {
        this.crUserId = crUserId;
        prefetchSummaryDocs();
    }

    /**
     * Warms the local Firestore cache with this user's existing summary docs on container open, so the
     * upsert query in {@link #storeSummaryPayload} can still resolve an existing doc when the device is
     * offline at write time — instead of missing it and creating a duplicate summary record.
     */
    private void prefetchSummaryDocs() {
        if (crUserId.trim().isEmpty()) {
            Log.w(TAG, "cr_user_id is blank — skipping summary doc prefetch");
            return;
        }
        FirebaseFirestore.getInstance()
                .collection(COLLECTION_SUMMARY)
                .whereEqualTo("cr_user_id", crUserId)
                .get()
                .addOnSuccessListener(querySnapshot ->
                        Log.d(TAG, "Prefetched " + querySnapshot.size() + " existing summary docs"))
                .addOnFailureListener(e ->
                        Log.w(TAG, "Failed to prefetch existing summary docs", e));
    }

    @Override
    public void handle(AppEventPayload payload, AppEventWriteCallback callback) {

        // MR-217: resolve once, here, and overwrite payload.app_id with the trusted value — every
        // downstream read of payload.app_id (this log line, storeUserSessionPayload,
        // storeSummaryPayload's written field and both whereEqualTo queries) then uses it with no
        // further changes needed at those call sites.
        payload.app_id = resolveAppId(payload);

        Log.d(
                TAG,
                "Accepted payload | app_id=" + payload.app_id +
                        " collection=" + payload.collection
        );

        storePayload(payload, OneShotWriteCallback.wrap(callback));
    }

    private void storePayload(@NonNull AppEventPayload payload, @NonNull OneShotWriteCallback callback) {

        FirebaseFirestore db = FirebaseFirestore.getInstance();
        String rawCollection = payload.collection;
        String normalizedCollection = normalizeCollection(rawCollection);

        // app_id is intentionally not checked here — handle() has already resolved it via
        // resolveAppId, which always returns a non-blank value (current_app_id, the payload's
        // own app_id, or "unknown"); it is never a rejection reason.
        if (payload.cr_user_id == null || payload.cr_user_id.trim().isEmpty() ||
                normalizedCollection == null || normalizedCollection.isEmpty()
        ) {

            Log.e(TAG, "Invalid payload — missing or blank required fields");
            callback.onFailed(new IllegalArgumentException(
                    "Invalid payload — missing or blank required fields"));
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

        // MR-156: stamp the cached coarse country (full English name); "unknown"
        // when the device has never resolved one.
        String country = CountryProvider.getCountry();
        payload.metadata.put("country",
                country != null ? country : CountryProvider.MISSING_COUNTRY_VALUE);

        if (payload.attribution == null) {
            payload.attribution = new HashMap<>();
        }
        payload.attribution.put("campaign_id", resolveContextString(AppContextKey.CAMPAIGN_ID, ""));
        payload.attribution.put("source", resolveContextString(AppContextKey.SOURCE, ""));
        payload.attribution.put("hostname", resolveContextString(AppContextKey.HOSTNAME, "unknown"));
        payload.attribution.put("apk_package_name", BuildConfig.APPLICATION_ID);

        // Stamp the Curious Reader language cached in AppContext. Left unstamped when
        // unset/blank (rather than a sentinel like "unknown") so summary_data's
        // field-presence query fallback (see storeSummaryPayload) keeps working — a
        // written sentinel would make an unset-language doc indistinguishable from one
        // genuinely tagged with that sentinel as its language.
        String language = resolveContextString(AppContextKey.LANGUAGE, null);
        if (language != null) {
            payload.metadata.put("language", language);
        }

        switch (normalizedCollection) {

            case COLLECTION_USER_SESSION:
                Log.d(TAG, "Handling user_sessions_data payload");
                storeUserSessionPayload(db, payload, callback);
                break;

            case COLLECTION_SUMMARY:
                Log.d(TAG, "Handling summary_data payload");
                storeSummaryPayload(db, payload, callback);
                break;

            default:
                String unsupported = "Unsupported collection: raw='" + rawCollection +
                        "' normalized='" + normalizedCollection +
                        "' length=" + normalizedCollection.length();
                Log.e(TAG, unsupported);
                callback.onFailed(new IllegalArgumentException(unsupported));
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
            AppEventPayload payload,
            @NonNull OneShotWriteCallback callback
    ) {

        if (!(payload.data instanceof Map)) {
            String message = "Invalid payload.data type. Expected Map but got: "
                    + (payload.data == null ? "null" : payload.data.getClass());
            Log.e(TAG, message);
            callback.onFailed(new IllegalArgumentException(message));
            return;
        }

        Map<String, Object> record = new HashMap<>();

        record.put("cr_user_id", payload.cr_user_id);
        record.put("app_id", payload.app_id);
        record.put("collection", payload.collection);
        record.put("created_at", Instant.now().toString());
        record.put("synced_at", FieldValue.serverTimestamp());
        record.put("schema_version", payload.schema_version != null ? payload.schema_version : "unknown");
        record.put("metadata", payload.metadata);
        record.put("attribution", payload.attribution);

        Map<String, Object> data =
                new HashMap<>((Map<String, Object>) payload.data);

        record.put("data", data);

        Task<DocumentReference> write = db.collection(payload.collection).add(record);

        // Signalled before the listeners are attached, so "queued precedes the terminal callback"
        // holds even when the write acks immediately. The write is already in Firestore's local
        // persistence queue at this point and survives process death, so the caller may release its
        // own copy; the listeners below only fire on server ack, which offline may be much later or
        // never.
        callback.onQueued();

        write.addOnSuccessListener(ref -> {
                    Log.d(TAG, "User session saved docId=" + ref.getId());
                    callback.onWritten(ref.getId());
                })
                .addOnFailureListener(e -> {
                    Log.e(TAG, "Failed to save user session payload", e);
                    callback.onFailed(e);
                });
    }

    /**
     * MR-217: resolves the trusted app_id for a Firestore field/query, in this fixed order and
     * no other ("do not guess"):
     * <ol>
     *   <li>current_app_id (this session's manifest-derived, container-known value) — used
     *       silently when available.</li>
     *   <li>{@code payload.app_id}, the sub-app's own reported value — used, with a warning
     *       logged, only when (1) is unavailable.</li>
     *   <li>The literal {@code "unknown"} — used, with a warning logged, only when both (1) and
     *       (2) are unavailable.</li>
     * </ol>
     */
    String resolveAppId(@NonNull AppEventPayload payload) {
        String currentAppId = resolveContextString(AppContextKey.CURRENT_APP_ID, null);
        if (currentAppId != null && !currentAppId.trim().isEmpty()) {
            return currentAppId;
        }

        if (payload.app_id != null && !payload.app_id.trim().isEmpty()) {
            Log.w(TAG, "current_app_id unavailable — falling back to payload app_id="
                    + payload.app_id);
            return payload.app_id;
        }

        Log.w(TAG, "current_app_id and payload app_id both unavailable — defaulting app_id to \"unknown\"");
        return "unknown";
    }

    private String resolveContextString(AppContextKey key, String fallback) {
        try {
            String value = AppContext.getInstance().get(key);
            return (value != null && !value.trim().isEmpty()) ? value : fallback;
        } catch (Exception e) {
            Log.w(TAG, "AppContext value unavailable for " + key
                    + (fallback != null ? " — defaulting to \"" + fallback + "\"" : " — leaving unset"), e);
            return fallback;
        }
    }

    /**
     * Used for summary_data. Partitioned per language via the {@code metadata.language} field
     * (stamped, or left absent when unset/blank, by {@link #storePayload}).
     *
     * When no language is available, the query matches on {@code cr_user_id} + {@code app_id}
     * only — the same shape used before language partitioning existed. This is also what
     * transparently picks up legacy summary docs that predate it, without a separate migration.
     */
    private void storeSummaryPayload(
            FirebaseFirestore db,
            AppEventPayload payload,
            @NonNull OneShotWriteCallback callback
    ) {

        if (!(payload.data instanceof Map)) {
            String message = "Invalid payload.data type. Expected Map but got: "
                    + (payload.data == null ? "null" : payload.data.getClass());
            Log.e(TAG, message);
            callback.onFailed(new IllegalArgumentException(message));
            return;
        }

        String language = (String) payload.metadata.get("language");

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
        record.put("attribution", payload.attribution);
        record.put("data", dataWriteMap);
        record.put("synced_at", FieldValue.serverTimestamp());

        if (language != null) {
            // Language known: Firestore can match it server-side directly.
            db.collection(payload.collection)
                    .whereEqualTo("cr_user_id", payload.cr_user_id)
                    .whereEqualTo("app_id", payload.app_id)
                    .whereEqualTo(LANGUAGE_FIELD, language)
                    .limit(1)
                    .get()
                    .addOnSuccessListener(querySnapshot ->
                            onSummaryQueryResult(db, payload, record, firstDocId(querySnapshot), callback))
                    .addOnFailureListener(e -> {
                        Log.w(TAG, "Query failed — creating new summary record", e);
                        createNewSummaryDoc(db, payload, record, callback);
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
                        onSummaryQueryResult(db, payload, record, existingDocId, callback);
                    })
                    .addOnFailureListener(e -> {
                        Log.w(TAG, "Query failed — creating new summary record", e);
                        createNewSummaryDoc(db, payload, record, callback);
                    });
        }
    }

    private static String firstDocId(QuerySnapshot querySnapshot) {
        return querySnapshot.isEmpty() ? null : querySnapshot.getDocuments().get(0).getId();
    }

    private void onSummaryQueryResult(
            FirebaseFirestore db,
            AppEventPayload payload,
            Map<String, Object> record,
            String existingDocId,
            @NonNull OneShotWriteCallback callback
    ) {
        if (existingDocId != null) {

            record.put("updated_at", Instant.now().toString());

            DocumentReference existingRef = db.collection(payload.collection).document(existingDocId);

            Task<Void> write = existingRef.set(record, SetOptions.merge());

            callback.onQueued();

            write.addOnSuccessListener(aVoid -> {
                        Log.d(TAG, "Updated summary payload with id: " + existingDocId);
                        callback.onWritten(existingDocId);
                    })
                    .addOnFailureListener(e -> {
                        Log.e(TAG, "Failed to update summary payload", e);
                        callback.onFailed(e);
                    });

        } else {
            Log.d(TAG, "No existing summary record — creating new");
            createNewSummaryDoc(db, payload, record, callback);
        }
    }

    private void createNewSummaryDoc(
            FirebaseFirestore db,
            AppEventPayload payload,
            Map<String, Object> record,
            @NonNull OneShotWriteCallback callback
    ) {

        String now = Instant.now().toString();

        // record already carries the atomic-increment data write map built in
        // storeSummaryPayload. FieldValue.increment treats a missing field as 0, so the
        // same map is correct for a brand-new document too.
        record.put("collection", payload.collection);
        record.put("created_at", now);
        record.put("updated_at", now);
        record.put("schema_version", payload.schema_version != null ? payload.schema_version : "unknown");

        Task<DocumentReference> write = db.collection(payload.collection).add(record);

        callback.onQueued();

        write.addOnSuccessListener(ref -> {
                    Log.d(TAG, "Created new summary payload docId=" + ref.getId());
                    callback.onWritten(ref.getId());
                })
                .addOnFailureListener(e -> {
                    Log.e(TAG, "Failed to create summary payload", e);
                    callback.onFailed(e);
                });
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

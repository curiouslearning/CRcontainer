package org.curiouslearning.container.core.subapp.handler;

import android.util.Log;

import androidx.annotation.NonNull;

import com.google.firebase.firestore.FirebaseFirestore;

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
        extends BaseAppEventPayloadHandler
        implements AppEventPayloadHandler {

    private static final String TAG = "AppEventHandler";
    private static final String COLLECTION_USER_SESSION = "user_sessions_data";
    private static final String COLLECTION_SUMMARY = "summary_data";

    // Process-level shared instance so the container (MainActivity) and every sub-app (WebApp) resolve to
    // one handler. A single syncListeners map makes the per-doc dedup guard in attachSyncListener effective
    // process-wide (exactly one sync listener per session doc), and lets MainActivity warm Firestore /
    // attach listeners on container open, before any sub-app is launched. Summary docs are tracked
    // separately by SummaryDataEventPayloadHandler's own singleton, warmed below for the same reason.
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
        super(crUserId);
        // Warms the summary handler's own singleton (and its existing-listener attachment)
        // as soon as the container resolves this instance, matching the pre-split behavior
        // where that attachment ran from this class's constructor.
        SummaryDataEventPayloadHandler.getInstance(crUserId);
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

        // MR-156: stamp the cached coarse country (full English name); "unknown"
        // when the device has never resolved one.
        String country = CountryProvider.getCountry();
        payload.metadata.put("country",
                country != null ? country : CountryProvider.MISSING_COUNTRY_VALUE);

        // Stamp the Curious Reader language cached in AppContext (set on language selection /
        // FTM launch). Left unstamped when unset/blank so summary partitioning falls back to
        // its pre-language-partitioning behavior instead of writing an empty/sentinel value.
        String language = AppContext.getInstance().contains(AppContextKey.LANGUAGE)
                ? AppContext.getInstance().get(AppContextKey.LANGUAGE)
                : null;
        if (language != null && !language.trim().isEmpty()) {
            payload.metadata.put("language", language);
        }

        switch (normalizedCollection) {

            case COLLECTION_USER_SESSION:
                Log.d(TAG, "Handling user_sessions_data payload");
                storeUserSessionPayload(db, payload);
                break;

            case COLLECTION_SUMMARY:
                Log.d(TAG, "Handling summary_data payload");
                SummaryDataEventPayloadHandler.getInstance(crUserId).handle(payload);
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

}

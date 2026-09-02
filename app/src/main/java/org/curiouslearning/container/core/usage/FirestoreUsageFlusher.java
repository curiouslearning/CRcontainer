package org.curiouslearning.container.core.usage;

import android.util.Log;

import androidx.annotation.NonNull;

import org.curiouslearning.container.core.subapp.emitter.AppEventEmitter;
import org.curiouslearning.container.core.subapp.emitter.AppEventPayloadBuilder;
import org.curiouslearning.container.core.subapp.payload.AppEventPayload;

/**
 * Writes a drained {@link UsageSegment} into {@code summary_data} as pure increments (MR-183), so it
 * composes offline. The {@code cr_recovered_*} fields belong to MR-182; metadata is stamped by the handler.
 */
public final class FirestoreUsageFlusher implements SubAppUsageFlusher {

    private static final String TAG = "UsageFlusher";

    private static final String COLLECTION = "summary_data";
    private static final String SCHEMA_VERSION = "v1";

    static final String FIELD_DURATION_SECONDS = "cr_duration_seconds";
    static final String FIELD_DURATION_RAW_SECONDS = "cr_duration_raw_seconds";

    private final String crUserId;
    private final AppEventEmitter emitter;

    public FirestoreUsageFlusher(@NonNull String crUserId) {
        this.crUserId = crUserId;
        // Resolved once: forUser() rebuilds the shared handler, and re-runs its prefetch, per call.
        this.emitter = AppEventEmitter.forUser(crUserId);
    }

    @Override
    public void flush(UsageSegment segment) {

        if (segment == null || segment.isEmpty()) {
            return;
        }

        AppEventPayload payload = new AppEventPayloadBuilder()
                .crUserId(crUserId)
                .appId(segment.appKey)
                .collection(COLLECTION)
                .schemaVersion(SCHEMA_VERSION)
                .add(FIELD_DURATION_SECONDS, segment.cappedSeconds)
                .add(FIELD_DURATION_RAW_SECONDS, segment.rawSeconds)
                .build();

        boolean accepted = emitter.emit(payload);

        if (accepted) {
            Log.d(TAG, "Flushed " + segment);
        } else {
            Log.e(TAG, "Usage flush rejected for " + segment);
        }
    }
}

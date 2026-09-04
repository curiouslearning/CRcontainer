package org.curiouslearning.container.core.usage;

import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import org.curiouslearning.container.core.subapp.emitter.AppEventEmitter;
import org.curiouslearning.container.core.subapp.emitter.AppEventPayloadBuilder;
import org.curiouslearning.container.core.subapp.handler.AppEventWriteCallback;
import org.curiouslearning.container.core.subapp.payload.AppEventPayload;

/**
 * Writes a drained {@link UsageSegment} into {@code summary_data} (MR-183). Every field is {@code add} — a
 * plain increment with no read-then-write — so writes compose offline and across devices.
 */
public final class FirestoreUsageFlusher implements SubAppUsageFlusher {

    private static final String TAG = "UsageFlusher";

    private static final String COLLECTION = "summary_data";
    private static final String SCHEMA_VERSION = "v1";

    static final String FIELD_DURATION_SECONDS = "cr_duration_seconds";
    static final String FIELD_DURATION_RAW_SECONDS = "cr_duration_raw_seconds";
    static final String FIELD_RECOVERED_SECONDS = "cr_recovered_seconds";
    static final String FIELD_RECOVERED_COUNT = "cr_recovered_count";

    private final String crUserId;
    private final AppEventEmitter emitter;

    public FirestoreUsageFlusher(@NonNull String crUserId) {
        this.crUserId = crUserId;
        // Resolved once: forUser() rebuilds the shared handler, and re-runs its prefetch, per call.
        this.emitter = AppEventEmitter.forUser(crUserId);
    }

    /** Visible for tests, which supply a fake emitter rather than reaching Firestore. */
    FirestoreUsageFlusher(@NonNull String crUserId, @NonNull AppEventEmitter emitter) {
        this.crUserId = crUserId;
        this.emitter = emitter;
    }

    @Override
    public void flush(UsageSegment segment, @Nullable AppEventWriteCallback callback) {

        if (segment == null || segment.isEmpty()) {
            return;
        }

        AppEventPayloadBuilder builder = new AppEventPayloadBuilder()
                .crUserId(crUserId)
                .appId(segment.appKey)
                .collection(COLLECTION)
                .schemaVersion(SCHEMA_VERSION)
                // The segment's own language, not whatever is selected now. Without this the handler
                // stamps live state, which is invisible for a live flush and wrong for a recovered one.
                .language(segment.language)
                .add(FIELD_DURATION_SECONDS, segment.cappedSeconds)
                .add(FIELD_DURATION_RAW_SECONDS, segment.rawSeconds);

        if (segment.isRecovered()) {
            // Written only when there is something to report, so an absent field keeps meaning "never
            // recovered" rather than "recovered nothing".
            builder.add(FIELD_RECOVERED_SECONDS, segment.recoveredSeconds)
                    .add(FIELD_RECOVERED_COUNT, segment.recoveredCount);
        }

        AppEventPayload payload = builder.build();

        boolean accepted = emitter.emit(payload, callback);

        if (accepted) {
            Log.d(TAG, "Flushed " + segment);
        } else {
            Log.e(TAG, "Usage flush rejected for " + segment);
        }
    }
}

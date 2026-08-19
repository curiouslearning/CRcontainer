package org.curiouslearning.container.core.subapp.emitter;

import androidx.annotation.NonNull;

import org.curiouslearning.container.core.subapp.payload.AppEventPayload;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

/**
 * Fluent construction of an {@link AppEventPayload} for Java callers.
 *
 * <p>{@link AppEventPayload} stays a plain Gson DTO with public fields, which is what the JS bridge
 * needs; this builder is what Java uses so a hand-filled payload cannot silently omit
 * {@code timestamp} or put a value in {@code options} that the validator will later reject.
 * {@link #add} and {@link #replace} are the only ways to populate {@code data}, so the two maps can
 * never disagree.
 *
 * <pre>{@code
 * AppEventPayload payload = new AppEventPayloadBuilder()
 *         .crUserId(pseudoId)
 *         .appId(appId)
 *         .collection("summary_data")
 *         .schemaVersion("v1")
 *         .add("cr_duration_seconds", cappedSeconds)
 *         .add("cr_duration_raw_seconds", rawSeconds)
 *         .build();
 * }</pre>
 */
public final class AppEventPayloadBuilder {

    private static final String OPTION_ADD = "add";
    private static final String OPTION_REPLACE = "replace";

    private final Map<String, Object> data = new HashMap<>();
    private final Map<String, String> options = new HashMap<>();

    private String crUserId;
    private String appId;
    private String collection;
    private String schemaVersion;
    private String timestamp;

    public AppEventPayloadBuilder crUserId(String crUserId) {
        this.crUserId = crUserId;
        return this;
    }

    public AppEventPayloadBuilder appId(String appId) {
        this.appId = appId;
        return this;
    }

    public AppEventPayloadBuilder collection(String collection) {
        this.collection = collection;
        return this;
    }

    public AppEventPayloadBuilder schemaVersion(String schemaVersion) {
        this.schemaVersion = schemaVersion;
        return this;
    }

    /** Defaults to {@code Instant.now()} at {@link #build()} time; set this only to override it. */
    public AppEventPayloadBuilder timestamp(String timestamp) {
        this.timestamp = timestamp;
        return this;
    }

    /**
     * Accumulating field: written as an atomic {@code FieldValue.increment}, so the value passed
     * here is a delta, not a running total.
     */
    public AppEventPayloadBuilder add(@NonNull String field, @NonNull Number delta) {
        data.put(field, delta);
        options.put(field, OPTION_ADD);
        return this;
    }

    /** Overwriting field: the stored value becomes exactly {@code value}. */
    public AppEventPayloadBuilder replace(@NonNull String field, Object value) {
        data.put(field, value);
        options.put(field, OPTION_REPLACE);
        return this;
    }

    public AppEventPayload build() {

        AppEventPayload payload = new AppEventPayload();

        payload.cr_user_id = crUserId;
        payload.app_id = appId;
        payload.collection = collection;
        payload.schema_version = schemaVersion;
        payload.timestamp = (timestamp != null && !timestamp.trim().isEmpty())
                ? timestamp
                : Instant.now().toString();
        payload.data = new HashMap<>(data);
        payload.options = new HashMap<>(options);

        return payload;
    }
}

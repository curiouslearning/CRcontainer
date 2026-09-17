package org.curiouslearning.container.core.subapp.emitter;

import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;

import org.curiouslearning.container.core.subapp.handler.AppEventPayloadHandler;
import org.curiouslearning.container.core.subapp.handler.AppEventWriteCallback;
import org.curiouslearning.container.core.subapp.handler.DefaultAppEventPayloadHandler;
import org.curiouslearning.container.core.subapp.handler.OneShotWriteCallback;
import org.curiouslearning.container.core.subapp.payload.AppEventPayload;
import org.curiouslearning.container.core.subapp.validation.AppEventPayloadValidator;
import org.curiouslearning.container.core.subapp.validation.ValidationResult;

/**
 * The single entry point for emitting an {@link AppEventPayload}, from JavaScript or from Java.
 *
 * <p>Before this existed the only way into {@link DefaultAppEventPayloadHandler} was the WebView
 * bridge, so container-measured data had nowhere to go. Rather than give Java a second Firestore
 * write path, both sources funnel through here: same validator, same handler instance, therefore the
 * same metadata/attribution stamping, the same {@code FieldValue.increment} semantics and the same
 * {@code synced_at} server timestamp.
 *
 * <p>Construct payloads with {@link AppEventPayloadBuilder}, which cannot produce an {@code options}
 * value outside the validator's {@code add}/{@code replace} allowlist.
 */
public final class AppEventEmitter {

    private static final String TAG = "AppEventEmitter";

    private final Gson gson = new Gson();
    private final AppEventPayloadValidator validator = new AppEventPayloadValidator();
    private final AppEventPayloadHandler handler;

    /**
     * Resolves to the process-wide handler for {@code crUserId} — the same instance MainActivity
     * warms on container open — so every writer shares one warmed Firestore cache.
     */
    public static AppEventEmitter forUser(@NonNull String crUserId) {
        return new AppEventEmitter(DefaultAppEventPayloadHandler.getInstance(crUserId));
    }

    public AppEventEmitter(@NonNull AppEventPayloadHandler handler) {
        this.handler = handler;
    }

    /** @see #emit(AppEventPayload, AppEventWriteCallback) */
    public boolean emit(AppEventPayload payload) {
        return emit(payload, null);
    }

    /**
     * Validates {@code payload} and hands it to the handler.
     *
     * @return {@code true} when the payload was accepted for delivery — it passed validation and is
     *         now the handler's responsibility. {@code false} means it was rejected and dropped;
     *         nothing will be written. A {@code true} return says nothing about whether the write
     *         reached Firestore: use {@code callback} for that.
     */
    public boolean emit(AppEventPayload payload, @Nullable AppEventWriteCallback callback) {

        // Wrapped here and handed down, so the catch-all below cannot report a second terminal
        // result on top of one the handler already delivered.
        OneShotWriteCallback once = OneShotWriteCallback.wrap(callback);

        try {
            ValidationResult result = validator.validate(payload);

            if (!result.isValid) {
                Log.e(TAG, "Payload rejected: " + result.errorMessage);
                once.onFailed(new IllegalArgumentException(result.errorMessage));
                return false;
            }

            handler.handle(payload, once);
            return true;

        } catch (Exception e) {
            Log.e(TAG, "Unexpected error handling payload", e);
            once.onFailed(e);
            return false;
        }
    }

    /** @see #emitJson(String, AppEventWriteCallback) */
    public boolean emitJson(String payloadJson) {
        return emitJson(payloadJson, null);
    }

    /**
     * Parses a JSON payload — the form the WebView bridge receives — then emits it. Same return
     * semantics as {@link #emit(AppEventPayload, AppEventWriteCallback)}, with malformed or empty
     * JSON counting as a rejection.
     */
    public boolean emitJson(String payloadJson, @Nullable AppEventWriteCallback callback) {

        OneShotWriteCallback once = OneShotWriteCallback.wrap(callback);

        try {
            if (payloadJson == null || payloadJson.trim().isEmpty()) {
                Log.e(TAG, "Rejected payload: empty JSON");
                once.onFailed(new IllegalArgumentException("Rejected payload: empty JSON"));
                return false;
            }

            AppEventPayload payload = gson.fromJson(payloadJson, AppEventPayload.class);

            // The trust boundary. container_language lets a Java caller name the language a payload's
            // data belongs to, overriding live AppContext state; honouring it from a sub-app would hand
            // sub-apps the ability to relabel which language partition their own data lands in, which
            // they cannot do today. Rejected rather than quietly stripped, because a sub-app sending it
            // is either confused or probing, and both deserve a signal.
            if (payload != null && payload.container_language != null) {
                Log.e(TAG, "Rejected payload: container_language is not accepted from a sub-app");
                once.onFailed(new IllegalArgumentException(
                        "Rejected payload: container_language is not accepted from a sub-app"));
                return false;
            }

            return emit(payload, once);

        } catch (JsonSyntaxException e) {
            Log.e(TAG, "Invalid JSON payload", e);
            once.onFailed(e);
            return false;
        } catch (Exception e) {
            Log.e(TAG, "Unexpected error handling payload", e);
            once.onFailed(e);
            return false;
        }
    }
}

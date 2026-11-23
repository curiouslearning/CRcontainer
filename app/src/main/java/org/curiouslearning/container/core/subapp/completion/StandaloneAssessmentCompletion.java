package org.curiouslearning.container.core.subapp.completion;

import androidx.annotation.Nullable;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

/**
 * Recognises the moment a standalone assessment (assessment-survey-js opened from the catalog, not
 * the copy embedded in Feed The Monster) has finished, from the payloads it sends over the bridge.
 *
 * <p>When an assessment ends, assessment-survey-js ({@code App.ts}, the {@code ENDED} subscriber)
 * sends, in this order and synchronously:
 * <ol>
 *   <li>{@code summary_data} via {@code AndroidInterface.logSummaryData}, then</li>
 *   <li>{@code user_sessions_data} with {@code data.event_type = "activity_completed"} via
 *       {@code AndroidInterface.logUserSessionsData}.</li>
 * </ol>
 * By then its own analytics ({@code completed} to Firebase/Statsig) have already been tracked, so
 * the second payload is the last thing the assessment does. It is the trigger for closing the
 * screen and returning to the container (see {@code WebApp}).
 *
 * <p>Pure functions so they run in plain JVM unit tests.
 */
public final class StandaloneAssessmentCompletion {

    /** {@code app_id} the container and assessment-survey-js both use for the assessment. */
    public static final String ASSESSMENT_APP_ID = "assessment";

    static final String COLLECTION_USER_SESSIONS = "user_sessions_data";
    static final String EVENT_ACTIVITY_COMPLETED = "activity_completed";

    private StandaloneAssessmentCompletion() {
    }

    /**
     * Whether a sub-app screen hosts a standalone assessment that should close itself when done.
     *
     * @param resolvedAppKey the screen's app key, as {@code SubAppIdResolver.resolve} returns it
     * @param isFtmApp       Feed The Monster embeds its own assessments and must never auto-close
     */
    public static boolean isStandaloneAssessment(@Nullable String resolvedAppKey, boolean isFtmApp) {
        return !isFtmApp && ASSESSMENT_APP_ID.equals(resolvedAppKey);
    }

    /**
     * True for the bridge payload that marks a finished assessment: a {@code user_sessions_data}
     * event whose {@code data.event_type} is {@code activity_completed}. Anything else, including
     * malformed JSON, is false.
     */
    public static boolean isCompletionPayload(@Nullable String payloadJson) {
        if (payloadJson == null || payloadJson.trim().isEmpty()) {
            return false;
        }
        try {
            JsonElement root = JsonParser.parseString(payloadJson);
            if (!root.isJsonObject()) {
                return false;
            }
            JsonObject payload = root.getAsJsonObject();
            if (!COLLECTION_USER_SESSIONS.equals(stringOrNull(payload, "collection"))) {
                return false;
            }
            JsonElement data = payload.get("data");
            if (data == null || !data.isJsonObject()) {
                return false;
            }
            return EVENT_ACTIVITY_COMPLETED.equals(stringOrNull(data.getAsJsonObject(), "event_type"));
        } catch (RuntimeException malformed) {
            return false;
        }
    }

    @Nullable
    private static String stringOrNull(JsonObject object, String key) {
        JsonElement value = object.get(key);
        if (value == null || !value.isJsonPrimitive() || !value.getAsJsonPrimitive().isString()) {
            return null;
        }
        return value.getAsString();
    }
}

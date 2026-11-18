package org.curiouslearning.container.core.subapp.completion;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

public class StandaloneAssessmentCompletionTest {

    /** The exact shape @curiouslearning/core's AndroidInterface.logUserSessionsData sends. */
    private static final String COMPLETED = "{\"cr_user_id\":\"u1\",\"app_id\":\"assessment\","
            + "\"schema_version\":\"1\",\"metadata\":{\"app_version\":\"v1.1.5\",\"environment\":\"production\"},"
            + "\"data\":{\"type\":\"lettersounds\",\"lang\":\"urdu\",\"score\":300,\"max_score\":500,"
            + "\"time_spent\":61234,\"event_type\":\"activity_completed\"},"
            + "\"collection\":\"user_sessions_data\",\"timestamp\":\"2026-11-17T10:00:00.000Z\"}";

    @Test
    public void activityCompletedUserSessionIsTheCompletionSignal() {
        assertTrue(StandaloneAssessmentCompletion.isCompletionPayload(COMPLETED));
    }

    @Test
    public void summaryDataIsNotTheCompletionSignal() {
        // Sent just before the completion event; closing on it would race the user_sessions write.
        assertFalse(StandaloneAssessmentCompletion.isCompletionPayload(
                "{\"collection\":\"summary_data\",\"app_id\":\"assessment\","
                        + "\"data\":{\"app_type\":\"assessment\",\"score\":300,\"time_spent\":1}}"));
    }

    @Test
    public void otherUserSessionEventsAreNotTheCompletionSignal() {
        assertFalse(StandaloneAssessmentCompletion.isCompletionPayload(
                "{\"collection\":\"user_sessions_data\",\"data\":{\"event_type\":\"level_completed\"}}"));
        assertFalse(StandaloneAssessmentCompletion.isCompletionPayload(
                "{\"collection\":\"user_sessions_data\",\"data\":{}}"));
        assertFalse(StandaloneAssessmentCompletion.isCompletionPayload(
                "{\"collection\":\"user_sessions_data\",\"data\":\"activity_completed\"}"));
    }

    @Test
    public void malformedOrEmptyPayloadsAreIgnored() {
        assertFalse(StandaloneAssessmentCompletion.isCompletionPayload(null));
        assertFalse(StandaloneAssessmentCompletion.isCompletionPayload(""));
        assertFalse(StandaloneAssessmentCompletion.isCompletionPayload("not json"));
        assertFalse(StandaloneAssessmentCompletion.isCompletionPayload("[1,2]"));
        assertFalse(StandaloneAssessmentCompletion.isCompletionPayload("{\"collection\":"));
    }

    @Test
    public void onlyStandaloneAssessmentsAutoClose() {
        assertTrue(StandaloneAssessmentCompletion.isStandaloneAssessment("assessment", false));
        // FTM hosts embedded assessments and keeps playing afterwards.
        assertFalse(StandaloneAssessmentCompletion.isStandaloneAssessment("assessment", true));
        assertFalse(StandaloneAssessmentCompletion.isStandaloneAssessment("feed-the-monster", false));
        assertFalse(StandaloneAssessmentCompletion.isStandaloneAssessment(null, false));
    }
}

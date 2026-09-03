package org.curiouslearning.container;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.curiouslearning.container.core.subapp.payload.AppEventPayload;
import org.curiouslearning.container.core.subapp.validation.AppEventPayloadValidator;
import org.curiouslearning.container.core.subapp.validation.ValidationResult;
import org.junit.Test;

import java.util.HashMap;

/**
 * MR-217: AppEventPayloadValidator no longer hard-requires app_id on the incoming bridge
 * payload — the container now resolves a trusted app_id itself (see
 * DefaultAppEventPayloadHandlerTest), so a sub-app payload omitting its own app_id must still
 * pass validation. Every other required field must still be enforced.
 */
public class AppEventPayloadValidatorTest {

    private final AppEventPayloadValidator validator = new AppEventPayloadValidator();

    private AppEventPayload validPayload() {
        AppEventPayload payload = new AppEventPayload();
        payload.cr_user_id = "user-123";
        payload.app_id = "some-app-id";
        payload.collection = "summary_data";
        payload.data = new HashMap<String, Object>();
        payload.timestamp = "2026-09-02T00:00:00Z";
        return payload;
    }

    @Test
    public void missingAppId_stillPasses() {
        AppEventPayload payload = validPayload();
        payload.app_id = null;

        ValidationResult result = validator.validate(payload);

        assertTrue(result.isValid);
    }

    @Test
    public void blankAppId_stillPasses() {
        AppEventPayload payload = validPayload();
        payload.app_id = "   ";

        ValidationResult result = validator.validate(payload);

        assertTrue(result.isValid);
    }

    @Test
    public void missingCrUserId_stillFails() {
        AppEventPayload payload = validPayload();
        payload.cr_user_id = null;

        ValidationResult result = validator.validate(payload);

        assertFalse(result.isValid);
    }

    @Test
    public void missingCollection_stillFails() {
        AppEventPayload payload = validPayload();
        payload.collection = null;

        ValidationResult result = validator.validate(payload);

        assertFalse(result.isValid);
    }

    @Test
    public void missingData_stillFails() {
        AppEventPayload payload = validPayload();
        payload.data = null;

        ValidationResult result = validator.validate(payload);

        assertFalse(result.isValid);
    }

    @Test
    public void missingTimestamp_stillFails() {
        AppEventPayload payload = validPayload();
        payload.timestamp = null;

        ValidationResult result = validator.validate(payload);

        assertFalse(result.isValid);
    }

    @Test
    public void fullyValidPayload_passes() {
        ValidationResult result = validator.validate(validPayload());

        assertTrue(result.isValid);
    }
}

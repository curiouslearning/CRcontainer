package org.curiouslearning.container.core.subapp.validation;

import org.curiouslearning.container.core.subapp.payload.AppEventPayload;

import java.util.Map;

public class AppEventPayloadValidator {

    public ValidationResult validate(AppEventPayload payload) {

        if (payload == null) {
            return ValidationResult.failure("Payload is null");
        }

        if (isEmpty(payload.cr_user_id)) {
            return ValidationResult.failure("Missing cr_user_id");
        }

        // MR-217: app_id is no longer required here — the container resolves its own trusted
        // app_id (DefaultAppEventPayloadHandler.resolveAppId) and only falls back to this
        // payload's app_id, if present, when that's unavailable. See AppEventPayloadValidatorTest.

        if (isEmpty(payload.collection)) {
            return ValidationResult.failure("Missing collection");
        }

        if (payload.data == null) {
            return ValidationResult.failure("Missing data");
        }

        if (isEmpty(payload.timestamp)) {
            return ValidationResult.failure("Missing timestamp");
        }

        if (payload.options != null) {
            for (Map.Entry<String, String> entry : payload.options.entrySet()) {
                String op = entry.getValue();
                if (!"add".equals(op) && !"replace".equals(op)) {
                    return ValidationResult.failure(
                            "Invalid option for field: " + entry.getKey()
                    );
                }
            }
        }

        return ValidationResult.success();
    }

    private boolean isEmpty(String value) {
        return value == null || value.trim().isEmpty();
    }
}

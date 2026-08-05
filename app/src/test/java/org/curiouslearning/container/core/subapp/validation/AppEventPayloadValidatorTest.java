package org.curiouslearning.container.core.subapp.validation;

import org.curiouslearning.container.core.subapp.payload.AppEventPayload;
import org.junit.Before;
import org.junit.Test;

import java.util.HashMap;
import java.util.Map;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class AppEventPayloadValidatorTest {

    private AppEventPayloadValidator validator;

    @Before
    public void setup() {
        validator = new AppEventPayloadValidator();
    }

    @Test
    public void testValidPayload() {
        AppEventPayload payload = new AppEventPayload();
        payload.cr_user_id = "user";
        payload.app_id = "app";
        payload.collection = "col";
        payload.data = new Object();
        payload.timestamp = "time";
        
        ValidationResult result = validator.validate(payload);
        assertTrue(result.isValid);
    }

    @Test
    public void testNullPayload() {
        ValidationResult result = validator.validate(null);
        assertFalse(result.isValid);
        assertEquals("Payload is null", result.errorMessage);
    }

    @Test
    public void testMissingUserId() {
        AppEventPayload payload = new AppEventPayload();
        payload.cr_user_id = "";
        ValidationResult result = validator.validate(payload);
        assertFalse(result.isValid);
        assertEquals("Missing cr_user_id", result.errorMessage);
    }

    @Test
    public void testMissingAppId() {
        AppEventPayload payload = new AppEventPayload();
        payload.cr_user_id = "user";
        payload.app_id = " ";
        ValidationResult result = validator.validate(payload);
        assertFalse(result.isValid);
        assertEquals("Missing app_id", result.errorMessage);
    }

    @Test
    public void testMissingCollection() {
        AppEventPayload payload = new AppEventPayload();
        payload.cr_user_id = "user";
        payload.app_id = "app";
        payload.collection = null;
        ValidationResult result = validator.validate(payload);
        assertFalse(result.isValid);
        assertEquals("Missing collection", result.errorMessage);
    }

    @Test
    public void testMissingData() {
        AppEventPayload payload = new AppEventPayload();
        payload.cr_user_id = "user";
        payload.app_id = "app";
        payload.collection = "col";
        payload.data = null;
        ValidationResult result = validator.validate(payload);
        assertFalse(result.isValid);
        assertEquals("Missing data", result.errorMessage);
    }

    @Test
    public void testMissingTimestamp() {
        AppEventPayload payload = new AppEventPayload();
        payload.cr_user_id = "user";
        payload.app_id = "app";
        payload.collection = "col";
        payload.data = new Object();
        payload.timestamp = "";
        ValidationResult result = validator.validate(payload);
        assertFalse(result.isValid);
        assertEquals("Missing timestamp", result.errorMessage);
    }

    @Test
    public void testInvalidOptions() {
        AppEventPayload payload = new AppEventPayload();
        payload.cr_user_id = "user";
        payload.app_id = "app";
        payload.collection = "col";
        payload.data = new Object();
        payload.timestamp = "time";
        
        Map<String, String> options = new HashMap<>();
        options.put("key", "invalid_op");
        payload.options = options;
        
        ValidationResult result = validator.validate(payload);
        assertFalse(result.isValid);
        assertEquals("Invalid option for field: key", result.errorMessage);
    }

    @Test
    public void testValidOptions() {
        AppEventPayload payload = new AppEventPayload();
        payload.cr_user_id = "user";
        payload.app_id = "app";
        payload.collection = "col";
        payload.data = new Object();
        payload.timestamp = "time";
        
        Map<String, String> options = new HashMap<>();
        options.put("key1", "add");
        options.put("key2", "replace");
        payload.options = options;
        
        ValidationResult result = validator.validate(payload);
        assertTrue(result.isValid);
    }
}

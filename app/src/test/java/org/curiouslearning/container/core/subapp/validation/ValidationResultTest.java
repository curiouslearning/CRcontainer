package org.curiouslearning.container.core.subapp.validation;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

public class ValidationResultTest {

    @Test
    public void testSuccess() {
        ValidationResult result = ValidationResult.success();
        assertTrue(result.isValid);
        assertNull(result.errorMessage);
    }

    @Test
    public void testFailure() {
        ValidationResult result = ValidationResult.failure("Error message");
        assertFalse(result.isValid);
        assertEquals("Error message", result.errorMessage);
    }
}

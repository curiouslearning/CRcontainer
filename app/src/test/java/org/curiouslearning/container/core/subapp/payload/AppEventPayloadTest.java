package org.curiouslearning.container.core.subapp.payload;

import org.junit.Test;

import java.util.HashMap;

import static org.junit.Assert.assertEquals;

public class AppEventPayloadTest {

    @Test
    public void testGettersAndSetters() {
        AppEventPayload payload = new AppEventPayload();
        payload.cr_user_id = "user1";
        payload.app_id = "app1";
        payload.collection = "test_collection";
        payload.data = new HashMap<>();
        payload.options = new HashMap<>();
        payload.timestamp = "2023-01-01T00:00:00Z";

        assertEquals("user1", payload.cr_user_id);
        assertEquals("app1", payload.app_id);
        assertEquals("test_collection", payload.collection);
        assertEquals(HashMap.class, payload.data.getClass());
        assertEquals(HashMap.class, payload.options.getClass());
        assertEquals("2023-01-01T00:00:00Z", payload.timestamp);
    }
}

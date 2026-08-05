package org.curiouslearning.container.data.model;

import org.junit.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

public class WebAppResponseTest {

    @Test
    public void testGettersAndSetters() {
        WebAppResponse response = new WebAppResponse();
        response.setVersion("1.0");

        List<WebApp> apps = new ArrayList<>();
        WebApp app = new WebApp();
        app.setAppId(1);
        apps.add(app);

        response.setWebApp(apps);

        assertEquals("1.0", response.getVersion());
        assertNotNull(response.getWebApps());
        assertEquals(1, response.getWebApps().size());
        assertEquals(1, response.getWebApps().get(0).getAppId());
    }
}

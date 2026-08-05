package org.curiouslearning.container.data.local;

import android.content.res.AssetManager;

import org.curiouslearning.container.data.model.WebApp;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

public class AppManifestTest {

    @Mock
    private AssetManager mockAssetManager;

    private AppManifest appManifest;

    @Before
    public void setup() throws IOException {
        MockitoAnnotations.openMocks(this);
        appManifest = AppManifest.getAppManifest();

        String mockJson = "[ { \"appId\": 1, \"title\": \"App 1\" }, { \"appId\": 2, \"title\": \"App 2\" } ]";
        InputStream inputStream = new ByteArrayInputStream(mockJson.getBytes(StandardCharsets.UTF_8)) {
            @Override
            public int available() {
                return mockJson.getBytes(StandardCharsets.UTF_8).length;
            }
        };
        
        when(mockAssetManager.open(anyString())).thenReturn(inputStream);
    }

    @Test
    public void testGetData() {
        String data = appManifest.getData(mockAssetManager);
        assertNotNull(data);
        assertEquals("[ { \"appId\": 1, \"title\": \"App 1\" }, { \"appId\": 2, \"title\": \"App 2\" } ]", data);
    }

    @Test
    public void testGetAllWebApps() {
        List<WebApp> apps = appManifest.getAllWebApps(mockAssetManager);
        assertNotNull(apps);
        assertEquals(2, apps.size());
        assertEquals(1, apps.get(0).getAppId());
        assertEquals("App 2", apps.get(1).getTitle());
    }
}

package org.curiouslearning.container.util;

import android.content.Context;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.Assert.*;
import static org.mockito.Mockito.*;
import org.junit.runner.RunWith;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.annotation.Config;

@RunWith(RobolectricTestRunner.class)
@Config(sdk = {28})
public class AppUtilsTest {

    @Mock
    private Context mockContext;
    @Mock
    private PackageManager mockPackageManager;

    @Before
    public void setup() {
        MockitoAnnotations.openMocks(this);
        when(mockContext.getPackageManager()).thenReturn(mockPackageManager);
        when(mockContext.getPackageName()).thenReturn("org.curiouslearning.container");
    }

    @Test
    public void testGetAppVersionName_Success() throws Exception {
        PackageInfo packageInfo = new PackageInfo();
        packageInfo.versionName = "1.2.3";
        
        when(mockPackageManager.getPackageInfo("org.curiouslearning.container", 0)).thenReturn(packageInfo);
        
        String version = AppUtils.getAppVersionName(mockContext);
        assertEquals("1.2.3", version);
    }

    @Test
    public void testGetAppVersionName_NotFound() throws Exception {
        when(mockPackageManager.getPackageInfo("org.curiouslearning.container", 0))
                .thenThrow(new PackageManager.NameNotFoundException());
        
        String version = AppUtils.getAppVersionName(mockContext);
        assertEquals("", version);
    }

    @Test
    public void testConvertEpochToDate() {
        // 0 milliseconds is Jan 1, 1970
        String dateString = AppUtils.convertEpochToDate(0);
        assertNotNull(dateString);
        assertTrue(dateString.contains("1970"));
    }
}

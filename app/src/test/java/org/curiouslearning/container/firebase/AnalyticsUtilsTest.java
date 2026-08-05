package org.curiouslearning.container.firebase;

import android.content.Context;
import android.content.SharedPreferences;

import com.google.firebase.analytics.FirebaseAnalytics;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.MockitoAnnotations;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.when;
import org.junit.runner.RunWith;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.annotation.Config;

@RunWith(RobolectricTestRunner.class)
@Config(sdk = {28})
public class AnalyticsUtilsTest {

    @Mock
    private Context mockContext;
    @Mock
    private SharedPreferences mockPrefs;
    @Mock
    private FirebaseAnalytics mockFirebaseAnalytics;

    @Before
    public void setup() {
        MockitoAnnotations.openMocks(this);
        when(mockContext.getSharedPreferences(anyString(), anyInt())).thenReturn(mockPrefs);
        when(mockPrefs.getString(anyString(), anyString())).thenReturn("mockValue");
    }

    @Test
    public void testUrlDecode_Success() {
        String decoded = AnalyticsUtils.urlDecode("hello%20world");
        assertEquals("hello world", decoded);
    }

    @Test
    public void testUrlDecode_Null() {
        assertNull(AnalyticsUtils.urlDecode(null));
    }

    @Test
    public void testLogEvent_NoCrash() {
        try (MockedStatic<FirebaseAnalytics> mockedFirebase = mockStatic(FirebaseAnalytics.class)) {
            mockedFirebase.when(() -> FirebaseAnalytics.getInstance(any(Context.class)))
                    .thenReturn(mockFirebaseAnalytics);

            AnalyticsUtils.logEvent(mockContext, "test_event", "App Name", "url", "pseudo123", "English");
            
            // Verify no crash and execution completes
        }
    }

    @Test
    public void testLogLanguageSelectEvent_NoCrash() {
        try (MockedStatic<FirebaseAnalytics> mockedFirebase = mockStatic(FirebaseAnalytics.class)) {
            mockedFirebase.when(() -> FirebaseAnalytics.getInstance(any(Context.class)))
                    .thenReturn(mockFirebaseAnalytics);

            AnalyticsUtils.logLanguageSelectEvent(mockContext, "language_select", "pseudo123", "English", "1.0", "false", "mock_uri");
        }
    }
}

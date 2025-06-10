package org.curiouslearning.container;

import static org.junit.Assert.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;

import androidx.test.ext.junit.runners.AndroidJUnit4;

import com.google.firebase.analytics.FirebaseAnalytics;

import org.curiouslearning.container.firebase.AnalyticsUtils;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.MockedStatic;

@RunWith(AndroidJUnit4.class)
public class AnalyticsUtilsCustomEventsTest {

    @Mock
    Context mockContext;

    @Mock
    FirebaseAnalytics mockFirebaseAnalytics;

    @Mock
    SharedPreferences mockPrefs;

    @Mock
    SharedPreferences.Editor mockEditor;

    @Before
    public void setup() {
        MockitoAnnotations.openMocks(this);

        // Mock SharedPreferences behavior to return non-null values
        when(mockContext.getSharedPreferences(eq("InstallReferrerPrefs"), eq(Context.MODE_PRIVATE))).thenReturn(mockPrefs);
        when(mockPrefs.getString(eq("source"), anyString())).thenReturn("test_source");
        when(mockPrefs.getString(eq("campaign_id"), anyString())).thenReturn("test_campaign");
        when(mockPrefs.getString(eq("extra_key"), anyString())).thenReturn("extra_value"); // add others if needed
    }

    @Test
    public void testLogEvent_appLaunch() {
        try (MockedStatic<FirebaseAnalytics> firebaseAnalyticsMockedStatic = Mockito.mockStatic(FirebaseAnalytics.class)) {
            firebaseAnalyticsMockedStatic.when(() -> FirebaseAnalytics.getInstance(mockContext))
                    .thenReturn(mockFirebaseAnalytics);

            AnalyticsUtils.logEvent(
                    mockContext,
                    "app_launch",
                    "Feed the Monster",
                    "https://example.com/ftm",
                    "user123",
                    "Hindi"
            );

            ArgumentCaptor<Bundle> bundleCaptor = ArgumentCaptor.forClass(Bundle.class);
            verify(mockFirebaseAnalytics).logEvent(eq("app_launch"), bundleCaptor.capture());

            Bundle captured = bundleCaptor.getValue();
            assertEquals("Feed the Monster", captured.getString("web_app_title"));
            assertEquals("https://example.com/ftm", captured.getString("web_app_url"));
            assertEquals("user123", captured.getString("cr_user_id"));
            assertEquals("Hindi", captured.getString("cr_language"));
        }
    }

    @Test
    public void testLogLanguageSelectEvent() {
        try (MockedStatic<FirebaseAnalytics> firebaseAnalyticsMockedStatic = Mockito.mockStatic(FirebaseAnalytics.class)) {
            firebaseAnalyticsMockedStatic.when(() -> FirebaseAnalytics.getInstance(mockContext))
                    .thenReturn(mockFirebaseAnalytics);

            AnalyticsUtils.logLanguageSelectEvent(
                    mockContext,
                    "language_selected",
                    "user456",
                    "Nepali",
                    "v1.2.3",
                    "false"
            );

            ArgumentCaptor<Bundle> bundleCaptor = ArgumentCaptor.forClass(Bundle.class);
            verify(mockFirebaseAnalytics).logEvent(eq("language_selected"), bundleCaptor.capture());

            Bundle captured = bundleCaptor.getValue();
            assertEquals("user456", captured.getString("cr_user_id"));
            assertEquals("Nepali", captured.getString("cr_language"));
            assertEquals("v1.2.3", captured.getString("manifest_version"));
            assertEquals("false", captured.getString("auto_selected"));
        }
    }
}

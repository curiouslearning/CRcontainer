package org.curiouslearning.container.deeplink;

import android.app.Activity;
import android.content.SharedPreferences;
import android.net.Uri;

import androidx.arch.core.executor.testing.InstantTaskExecutorRule;

import org.curiouslearning.container.firebase.AnalyticsUtils;
import org.curiouslearning.container.util.AnimationUtil;
import org.curiouslearning.container.util.AppUtils;
import org.junit.After;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.robolectric.Robolectric;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.android.controller.ActivityController;
import org.robolectric.annotation.Config;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(RobolectricTestRunner.class)
@Config(sdk = {28})
public class StudyEnrollmentManagerTest {

    @Rule
    public InstantTaskExecutorRule instantTaskExecutorRule = new InstantTaskExecutorRule();

    @Mock
    private SharedPreferences mockPrefs;
    
    @Mock
    private SharedPreferences.Editor mockEditor;

    private Activity activity;
    private ActivityController<Activity> activityController;
    private StudyEnrollmentManager manager;

    private MockedStatic<AnalyticsUtils> mockedAnalyticsUtils;
    private MockedStatic<AnimationUtil> mockedAnimationUtil;
    private MockedStatic<AppUtils> mockedAppUtils;

    @Before
    public void setup() {
        MockitoAnnotations.openMocks(this);

        activityController = Robolectric.buildActivity(Activity.class);
        activity = activityController.create().start().resume().get();

        when(mockPrefs.edit()).thenReturn(mockEditor);
        when(mockEditor.putString(anyString(), anyString())).thenReturn(mockEditor);

        mockedAnalyticsUtils = Mockito.mockStatic(AnalyticsUtils.class);
        mockedAnimationUtil = Mockito.mockStatic(AnimationUtil.class);
        mockedAppUtils = Mockito.mockStatic(AppUtils.class);

        manager = new StudyEnrollmentManager(activity, mockPrefs, "1.0.0");
    }

    @After
    public void teardown() {
        mockedAnalyticsUtils.close();
        mockedAnimationUtil.close();
        mockedAppUtils.close();
        activityController.pause().stop().destroy();
    }

    @Test
    public void testHandleStudyEnrollmentLink_NullUri() {
        boolean result = manager.handleStudyEnrollmentLink(null, "English");
        assertFalse(result);
    }

    @Test
    public void testHandleStudyEnrollmentLink_MissingId() {
        Uri mockUri = mock(Uri.class);
        when(mockUri.getQueryParameter("study_user_id")).thenReturn(null);

        boolean result = manager.handleStudyEnrollmentLink(mockUri, "English");
        assertFalse(result);
    }

    @Test
    public void testHandleStudyEnrollmentLink_ValidId_MissingConsent() {
        Uri mockUri = mock(Uri.class);
        when(mockUri.getQueryParameter("study_user_id")).thenReturn("12345");
        when(mockUri.getQueryParameter("study_consent")).thenReturn(null);

        boolean result = manager.handleStudyEnrollmentLink(mockUri, "English");
        assertFalse(result);
    }

    @Test
    public void testHandleStudyEnrollmentLink_AlreadyEnrolled() {
        Uri mockUri = mock(Uri.class);
        when(mockUri.getQueryParameter("study_user_id")).thenReturn("12345");
        when(mockUri.getQueryParameter("study_consent")).thenReturn("true");

        // Simulate already enrolled
        when(mockPrefs.getString(AnalyticsUtils.STUDY_USER_ID, "")).thenReturn("99999");
        when(mockPrefs.contains("pseudoId")).thenReturn(true);

        boolean result = manager.handleStudyEnrollmentLink(mockUri, "English");
        // Returns true because it is a valid enrollment link, but it ignores it internally
        assertTrue(result);
        
        // No dialog or enrollment events should be triggered
        org.junit.Assert.assertNull(manager.getEnrollmentState().getValue());
    }
}

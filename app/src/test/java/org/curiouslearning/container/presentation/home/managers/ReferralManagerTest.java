package org.curiouslearning.container.presentation.home.managers;

import android.app.Activity;
import android.content.SharedPreferences;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.annotation.Config;

import static org.junit.Assert.assertFalse;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@RunWith(RobolectricTestRunner.class)
@Config(sdk = {28})
public class ReferralManagerTest {

    @Mock
    private Activity mockActivity;
    @Mock
    private SharedPreferences mockPrefs;

    @Mock
    private org.curiouslearning.container.presentation.viewmodels.HomeViewModel mockHomeViewModel;
    @Mock
    private androidx.lifecycle.LifecycleOwner mockLifecycleOwner;
    @Mock
    private ReferralManager.ReferralManagerListener mockListener;

    private ReferralManager manager;

    @Before
    public void setup() {
        MockitoAnnotations.openMocks(this);
        when(mockActivity.getSharedPreferences(org.mockito.ArgumentMatchers.anyString(), org.mockito.ArgumentMatchers.anyInt())).thenReturn(mockPrefs);
        when(mockPrefs.getBoolean(org.mockito.ArgumentMatchers.anyString(), org.mockito.ArgumentMatchers.anyBoolean())).thenReturn(false);
        manager = new ReferralManager(mockActivity, mockHomeViewModel, mockLifecycleOwner, mockListener);
    }

    @Test
    public void testInit() {
        // Simple test to ensure it instantiates
    }
}

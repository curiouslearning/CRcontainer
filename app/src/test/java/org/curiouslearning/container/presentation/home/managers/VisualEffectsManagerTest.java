package org.curiouslearning.container.presentation.home.managers;

import android.app.Activity;
import android.view.View;
import android.widget.ImageView;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.annotation.Config;

import static org.mockito.Mockito.mock;

@RunWith(RobolectricTestRunner.class)
@Config(sdk = {28})
public class VisualEffectsManagerTest {

    @Mock
    private Activity mockActivity;
    @Mock
    private ImageView mockAppIconImageView;
    @Mock
    private View mockOfflineOverlay;
    @Mock
    private View mockBlurredBackground;

    private VisualEffectsManager manager;

    @Before
    public void setup() {
        MockitoAnnotations.openMocks(this);
        manager = new VisualEffectsManager();
    }

    @Test
    public void testInit() {
        // Basic instantiation
    }
}

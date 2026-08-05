package org.curiouslearning.container.util;

import android.content.Context;
import androidx.test.core.app.ApplicationProvider;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.annotation.Config;

import static org.junit.Assert.assertNotNull;

@RunWith(RobolectricTestRunner.class)
@Config(sdk = {28})
public class PulsingViewTest {

    private PulsingView pulsingView;
    private Context context;

    @Before
    public void setup() {
        context = ApplicationProvider.getApplicationContext();
        pulsingView = new PulsingView(context, null);
    }

    @Test
    public void testInit() {
        assertNotNull(pulsingView);
    }

    @Test
    public void testStartAndStopAnimation() {
        pulsingView.startAnimation();
        // State should be running, but we can't easily assert private fields.
        // We just ensure it doesn't crash.
        pulsingView.stopAnimation();
    }
}

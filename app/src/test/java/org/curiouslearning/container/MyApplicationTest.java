package org.curiouslearning.container;

import androidx.test.core.app.ApplicationProvider;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.annotation.Config;

import static org.junit.Assert.assertNotNull;

@RunWith(RobolectricTestRunner.class)
@Config(sdk = {28}, application = MyApplication.class)
@org.junit.Ignore("Fails due to Facebook SDK initialization in Robolectric")
public class MyApplicationTest {

    @Test
    public void testMyApplicationInitialization() {
        MyApplication app = ApplicationProvider.getApplicationContext();
        assertNotNull(app);
        // If the application doesn't crash during onCreate, it's a success
    }
}

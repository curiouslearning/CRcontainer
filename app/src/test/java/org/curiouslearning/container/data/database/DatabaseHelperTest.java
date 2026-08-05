package org.curiouslearning.container.data.database;

import android.content.Context;

import androidx.test.core.app.ApplicationProvider;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.annotation.Config;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertSame;

@RunWith(RobolectricTestRunner.class)
@Config(sdk = {28})
public class DatabaseHelperTest {

    @Test
    public void testGetInstanceReturnsSingleton() {
        Context context = ApplicationProvider.getApplicationContext();
        
        DatabaseHelper instance1 = DatabaseHelper.getInstance(context);
        assertNotNull(instance1);
        
        DatabaseHelper instance2 = DatabaseHelper.getInstance(context);
        assertSame(instance1, instance2);
    }
}

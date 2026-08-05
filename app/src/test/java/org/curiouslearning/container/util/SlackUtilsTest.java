package org.curiouslearning.container.util;

import android.content.Context;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.junit.runner.RunWith;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.annotation.Config;

@RunWith(RobolectricTestRunner.class)
@Config(sdk = {28})
public class SlackUtilsTest {

    @Mock
    private Context mockContext;

    @Before
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testSendMessageToSlack_NoCrash() {
        // Without mocking ConfigLoader, it might return null for URL, which aborts cleanly.
        // We just ensure it doesn't crash the calling thread.
        SlackUtils.sendMessageToSlack(mockContext, "Test Message");
    }
}

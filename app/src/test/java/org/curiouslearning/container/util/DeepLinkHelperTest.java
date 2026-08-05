package org.curiouslearning.container.util;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.annotation.Config;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.verify;

@RunWith(RobolectricTestRunner.class)
@Config(sdk = {28})
public class DeepLinkHelperTest {

    @Mock
    private Activity mockActivity;

    @Before
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testHandleDeepLink_ValidCuriousReaderLink() {
        Intent intent = new Intent(Intent.ACTION_VIEW);
        intent.setData(Uri.parse("curiousreader://app/language=nepali"));

        String language = DeepLinkHelper.handleDeepLink(mockActivity, intent);
        assertEquals("nepali", language);

        ArgumentCaptor<Intent> intentCaptor = ArgumentCaptor.forClass(Intent.class);
        verify(mockActivity).startActivity(intentCaptor.capture());
        
        Intent launchedIntent = intentCaptor.getValue();
        assertEquals("nepali", launchedIntent.getStringExtra("language"));
    }

    @Test
    public void testHandleDeepLink_InvalidRedirectToPlayStore() {
        Intent intent = new Intent(Intent.ACTION_VIEW);
        intent.setData(Uri.parse("http://example.com"));

        String language = DeepLinkHelper.handleDeepLink(mockActivity, intent);
        assertEquals("", language);

        ArgumentCaptor<Intent> intentCaptor = ArgumentCaptor.forClass(Intent.class);
        verify(mockActivity).startActivity(intentCaptor.capture());
        
        Intent launchedIntent = intentCaptor.getValue();
        assertEquals(Intent.ACTION_VIEW, launchedIntent.getAction());
        assertEquals("https://play.google.com/store/apps/details?id=org.curiouslearning.container", launchedIntent.getDataString());
    }
}

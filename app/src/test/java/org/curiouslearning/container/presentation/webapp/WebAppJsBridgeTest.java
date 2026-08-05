package org.curiouslearning.container.presentation.webapp;

import android.content.Context;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.annotation.Config;

import static org.mockito.Mockito.verify;

@RunWith(RobolectricTestRunner.class)
@Config(sdk = {28})
public class WebAppJsBridgeTest {

    @Mock
    private Context mockContext;
    @Mock
    private WebAppJsBridge.WebAppBridgeListener mockListener;

    private WebAppJsBridge jsBridge;

    @Before
    public void setup() {
        MockitoAnnotations.openMocks(this);
        jsBridge = new WebAppJsBridge(mockContext, mockListener);
    }

    @Test
    public void testCachedStatus() {
        jsBridge.cachedStatus(true);
        verify(mockListener).onCachedStatusReceived(true);
    }

    @Test
    public void testSetContainerAppOrientation() {
        jsBridge.setContainerAppOrientation("landscape");
        verify(mockListener).onOrientationRequested("landscape");
    }

    @Test
    public void testCloseWebView() {
        jsBridge.closeWebView();
        verify(mockListener).onCloseRequested();
    }

    @Test
    public void testOnMonsterEvolutionStateReceived() {
        String mockState = "{\"state\":\"evolved\"}";
        jsBridge.onMonsterEvolutionStateReceived(mockState);
        verify(mockListener).onMonsterEvolutionStateReceived(mockState);
    }
}

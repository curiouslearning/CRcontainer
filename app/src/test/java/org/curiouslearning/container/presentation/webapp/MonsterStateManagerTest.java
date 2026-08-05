package org.curiouslearning.container.presentation.webapp;

import android.content.Context;
import android.content.SharedPreferences;
import android.webkit.WebView;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.annotation.Config;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(RobolectricTestRunner.class)
@Config(sdk = {28})
public class MonsterStateManagerTest {

    @Mock
    private Context mockContext;
    @Mock
    private SharedPreferences mockPrefs;
    @Mock
    private WebView mockWebView;
    @Mock
    private SharedPreferences.Editor mockEditor;

    private MonsterStateManager manager;

    @Before
    public void setup() {
        MockitoAnnotations.openMocks(this);
        when(mockPrefs.edit()).thenReturn(mockEditor);
        when(mockEditor.putString(anyString(), anyString())).thenReturn(mockEditor);
        
        manager = new MonsterStateManager(mockContext, mockWebView, mockPrefs, "hindi", "Hindi", true);
    }

    @Test
    public void testQueryMonsterEvolutionState() {
        manager.queryMonsterEvolutionState();
        // Verifies evaluateJavascript was called
        verify(mockWebView).evaluateJavascript(anyString(), any());
    }

    @Test
    public void testInit() {
        // Init works
    }
}

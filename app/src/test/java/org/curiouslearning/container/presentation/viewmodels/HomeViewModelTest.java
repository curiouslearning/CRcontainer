package org.curiouslearning.container.presentation.viewmodels;

import android.app.Application;

import androidx.arch.core.executor.testing.InstantTaskExecutorRule;
import androidx.lifecycle.MutableLiveData;

import org.curiouslearning.container.data.model.WebApp;
import org.curiouslearning.container.data.repository.WebAppRepository;
import org.junit.After;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.MockedConstruction;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.annotation.Config;

import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(RobolectricTestRunner.class)
@Config(sdk = {28})
public class HomeViewModelTest {

    @Rule
    public InstantTaskExecutorRule instantTaskExecutorRule = new InstantTaskExecutorRule();

    @Mock
    private Application mockApplication;

    private MockedConstruction<WebAppRepository> mockedConstruction;
    private WebAppRepository mockRepository;
    private HomeViewModel viewModel;

    @Before
    public void setup() {
        MockitoAnnotations.openMocks(this);

        // Mock WebAppRepository construction
        mockedConstruction = Mockito.mockConstruction(WebAppRepository.class, (mock, context) -> {
            mockRepository = mock;
            
            // Setup default LiveData returns
            MutableLiveData<List<WebApp>> mockWebApps = new MutableLiveData<>();
            mockWebApps.setValue(Arrays.asList(new WebApp(), new WebApp()));
            
            MutableLiveData<List<String>> mockLanguages = new MutableLiveData<>();
            mockLanguages.setValue(Arrays.asList("English", "Spanish"));

            when(mock.getAllWebApps()).thenReturn(mockWebApps);
            when(mock.getAllLanguagesInEnglish()).thenReturn(mockLanguages);
            when(mock.getSelectedLanguageWebApps(anyString())).thenReturn(mockWebApps);
        });

        viewModel = new HomeViewModel(mockApplication);
    }

    @After
    public void teardown() {
        if (mockedConstruction != null) {
            mockedConstruction.close();
        }
    }

    @Test
    public void testInitialization() {
        // Verify fetchWebApp is called during initialization
        verify(mockRepository).fetchWebApp();
    }

    @Test
    public void testSetLanguage() {
        // Trigger LiveData switchMap
        viewModel.getSelectedLanguageWebApps().observeForever(webApps -> {});
        
        viewModel.setLanguage("English");

        // Verify repository is called with the language
        verify(mockRepository).getSelectedLanguageWebApps("English");
        assertEquals(2, viewModel.getSelectedLanguageWebApps().getValue().size());
    }

    @Test
    public void testGetAllWebApps() {
        assertEquals(2, viewModel.getAllWebApps().getValue().size());
        verify(mockRepository).getAllWebApps();
    }

    @Test
    public void testGetAllLanguagesInEnglish() {
        assertEquals(2, viewModel.getAllLanguagesInEnglish().getValue().size());
        verify(mockRepository).getAllLanguagesInEnglish();
    }

    @Test
    public void testGetUpdatedAppManifest() {
        viewModel.getUpdatedAppManifest("v1");
        verify(mockRepository).getUpdatedAppManifest("v1");
    }

    @Test
    public void testTriggerRefresh() {
        // clear invocations to ignore the one from constructor
        Mockito.clearInvocations(mockRepository);
        
        viewModel.triggerRefresh();
        
        verify(mockRepository).fetchWebApp();
    }
}

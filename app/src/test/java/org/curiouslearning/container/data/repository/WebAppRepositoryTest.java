package org.curiouslearning.container.data.repository;

import android.app.Application;

import androidx.lifecycle.MutableLiveData;
import androidx.test.core.app.ApplicationProvider;

import org.curiouslearning.container.data.database.WebAppDatabase;
import org.curiouslearning.container.data.model.WebApp;
import org.curiouslearning.container.data.remote.RetrofitInstance;
import org.curiouslearning.container.util.ConnectionUtils;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockedConstruction;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.annotation.Config;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(RobolectricTestRunner.class)
@Config(sdk = {28})
public class WebAppRepositoryTest {

    private WebAppRepository webAppRepository;

    private MockedStatic<RetrofitInstance> mockedRetrofitInstance;
    private MockedStatic<ConnectionUtils> mockedConnectionUtils;
    private MockedConstruction<WebAppDatabase> mockedWebAppDatabase;

    private RetrofitInstance mockRetrofit;
    private ConnectionUtils mockConnectionUtils;
    private WebAppDatabase mockDatabase;

    @Before
    public void setup() {
        mockRetrofit = mock(RetrofitInstance.class);
        mockConnectionUtils = mock(ConnectionUtils.class);

        mockedRetrofitInstance = Mockito.mockStatic(RetrofitInstance.class);
        mockedRetrofitInstance.when(RetrofitInstance::getInstance).thenReturn(mockRetrofit);

        mockedConnectionUtils = Mockito.mockStatic(ConnectionUtils.class);
        mockedConnectionUtils.when(ConnectionUtils::getInstance).thenReturn(mockConnectionUtils);

        mockedWebAppDatabase = Mockito.mockConstruction(WebAppDatabase.class,
                (mock, context) -> {
                    mockDatabase = mock;
                    MutableLiveData<List<WebApp>> liveData = new MutableLiveData<>(new ArrayList<>());
                    when(mock.getAllWebApps()).thenReturn(liveData);
                });

        Application application = ApplicationProvider.getApplicationContext();
        webAppRepository = new WebAppRepository(application);
    }

    @After
    public void teardown() {
        mockedRetrofitInstance.close();
        mockedConnectionUtils.close();
        mockedWebAppDatabase.close();
    }

    @Test
    public void testGetSelectedLanguageWebApps() {
        webAppRepository.getSelectedLanguageWebApps("English");
        verify(mockDatabase).getSelectedLanguageWebApps("English");
    }

    @Test
    public void testGetAllWebApps() {
        webAppRepository.getAllWebApps();
        verify(mockDatabase).getAllWebApps();
    }

    @Test
    public void testGetAllLanguagesInEnglish() {
        webAppRepository.getAllLanguagesInEnglish();
        verify(mockDatabase).getAllLanguagesInEnglish();
    }

    @Test
    public void testFetchWebAppNoInternet() {
        when(mockConnectionUtils.isInternetConnected(any())).thenReturn(false);
        webAppRepository.fetchWebApp();
        Mockito.verifyNoInteractions(mockRetrofit);
    }

    @Test
    public void testFetchWebAppWithInternet() {
        when(mockConnectionUtils.isInternetConnected(any())).thenReturn(true);
        webAppRepository.fetchWebApp();
        verify(mockRetrofit).fetchAndCacheWebApps(eq(mockDatabase), any());

        // Check isFetching deduplication
        webAppRepository.fetchWebApp();
        verify(mockRetrofit, times(1)).fetchAndCacheWebApps(eq(mockDatabase), any());
    }

    @Test
    public void testGetUpdatedAppManifestNoInternet() {
        when(mockConnectionUtils.isInternetConnected(any())).thenReturn(false);
        webAppRepository.getUpdatedAppManifest("1.0");
        Mockito.verifyNoInteractions(mockRetrofit);
    }

    @Test
    public void testGetUpdatedAppManifestWithInternet() {
        when(mockConnectionUtils.isInternetConnected(any())).thenReturn(true);
        webAppRepository.getUpdatedAppManifest("1.0");
        verify(mockRetrofit).getUpdatedAppManifest(mockDatabase, "1.0");
    }
}

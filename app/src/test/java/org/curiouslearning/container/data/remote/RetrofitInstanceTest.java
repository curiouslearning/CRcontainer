package org.curiouslearning.container.data.remote;

import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

import org.curiouslearning.container.data.database.WebAppDatabase;
import org.curiouslearning.container.util.CacheUtils;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.annotation.Config;

import java.lang.reflect.Field;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;

import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(RobolectricTestRunner.class)
@Config(sdk = {27})
public class RetrofitInstanceTest {

    @Mock
    private WebAppDatabase mockWebAppDatabase;

    @Mock
    private Retrofit mockRetrofit;

    @Mock
    private ApiService mockApiService;

    @Mock
    private Call<JsonElement> mockCall;

    private MockedStatic<CacheUtils> mockedCacheUtils;

    @Before
    public void setup() throws Exception {
        MockitoAnnotations.openMocks(this);

        when(mockRetrofit.create(ApiService.class)).thenReturn(mockApiService);
        when(mockApiService.getWebApps()).thenReturn(mockCall);

        Field retrofitField = RetrofitInstance.class.getDeclaredField("retrofit");
        retrofitField.setAccessible(true);
        retrofitField.set(null, mockRetrofit);

        Field retrofitInstanceField = RetrofitInstance.class.getDeclaredField("retrofitInstance");
        retrofitInstanceField.setAccessible(true);
        retrofitInstanceField.set(null, new RetrofitInstance());

        mockedCacheUtils = Mockito.mockStatic(CacheUtils.class);
    }

    @After
    public void teardown() {
        mockedCacheUtils.close();
    }

    @Test
    public void testGetAppManifestSuccess() {
        String mockResponseJson = "{ \"version\": \"2.0\", \"web_apps\": [ { \"appId\": 1, \"title\": \"App 1\" } ] }";
        JsonElement jsonElement = JsonParser.parseString(mockResponseJson);
        Response<JsonElement> response = Response.success(jsonElement);

        RetrofitInstance.getInstance().getAppManifest(mockWebAppDatabase, null);

        ArgumentCaptor<Callback<JsonElement>> captor = ArgumentCaptor.forClass(Callback.class);
        verify(mockCall).enqueue(captor.capture());

        captor.getValue().onResponse(mockCall, response);

        mockedCacheUtils.verify(() -> CacheUtils.setManifestVersionNumber("2.0"));
        verify(mockWebAppDatabase).deleteWebApps(anyList());
    }

    @Test
    public void testGetUpdatedAppManifestDifferentVersion() {
        String mockResponseJson = "{ \"version\": \"3.0\", \"web_apps\": [ { \"appId\": 1, \"title\": \"App 1\" } ] }";
        JsonElement jsonElement = JsonParser.parseString(mockResponseJson);
        Response<JsonElement> response = Response.success(jsonElement);

        RetrofitInstance.getInstance().getUpdatedAppManifest(mockWebAppDatabase, "2.0");

        ArgumentCaptor<Callback<JsonElement>> captor = ArgumentCaptor.forClass(Callback.class);
        verify(mockCall).enqueue(captor.capture());

        captor.getValue().onResponse(mockCall, response);

        mockedCacheUtils.verify(() -> CacheUtils.setManifestVersionNumber("3.0"));
        verify(mockWebAppDatabase).deleteWebApps(anyList());
    }

    @Test
    public void testGetUpdatedAppManifestSameVersion() {
        String mockResponseJson = "{ \"version\": \"2.0\", \"web_apps\": [ { \"appId\": 1, \"title\": \"App 1\" } ] }";
        JsonElement jsonElement = JsonParser.parseString(mockResponseJson);
        Response<JsonElement> response = Response.success(jsonElement);

        RetrofitInstance.getInstance().getUpdatedAppManifest(mockWebAppDatabase, "2.0");

        ArgumentCaptor<Callback<JsonElement>> captor = ArgumentCaptor.forClass(Callback.class);
        verify(mockCall).enqueue(captor.capture());

        captor.getValue().onResponse(mockCall, response);

        mockedCacheUtils.verifyNoInteractions();
        Mockito.verifyNoInteractions(mockWebAppDatabase);
    }
}

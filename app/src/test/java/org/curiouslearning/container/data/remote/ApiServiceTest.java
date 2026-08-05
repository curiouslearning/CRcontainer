package org.curiouslearning.container.data.remote;

import com.google.gson.JsonElement;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.io.IOException;

import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import retrofit2.Call;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

public class ApiServiceTest {

    private MockWebServer mockWebServer;
    private ApiService apiService;

    @Before
    public void setup() throws IOException {
        mockWebServer = new MockWebServer();
        mockWebServer.start();

        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(mockWebServer.url("/"))
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        apiService = retrofit.create(ApiService.class);
    }

    @After
    public void teardown() throws IOException {
        mockWebServer.shutdown();
    }

    @Test
    public void testGetWebAppsSuccess() throws IOException {
        String mockResponseJson = "{ \"version\": \"1.0\", \"web_apps\": [] }";
        mockWebServer.enqueue(new MockResponse()
                .setResponseCode(200)
                .setBody(mockResponseJson));

        Call<JsonElement> call = apiService.getWebApps();
        Response<JsonElement> response = call.execute();

        assertTrue(response.isSuccessful());
        assertNotNull(response.body());
        assertTrue(response.body().isJsonObject());
        assertEquals("1.0", response.body().getAsJsonObject().get("version").getAsString());
    }

    @Test
    public void testGetWebAppsFailure() throws IOException {
        mockWebServer.enqueue(new MockResponse().setResponseCode(404));

        Call<JsonElement> call = apiService.getWebApps();
        Response<JsonElement> response = call.execute();

        assertTrue(!response.isSuccessful());
        assertEquals(404, response.code());
    }
}

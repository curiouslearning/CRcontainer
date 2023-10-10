package org.curiouslearning.container.data.remote;

import org.curiouslearning.container.data.database.WebAppDatabase;
import org.curiouslearning.container.data.model.WebApp;
import org.curiouslearning.container.data.model.WebAppV1.WebAppV1;
import org.curiouslearning.container.data.model.WebAppV2.WebAppV2;
import org.curiouslearning.container.data.model.WebAppResponse;
import org.curiouslearning.container.utilities.CacheUtils;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class RetrofitInstance {

    private static Retrofit retrofit;
    private static RetrofitInstance retrofitInstance;

    private static String URL = "https://devcuriousreader.wpcomstaging.com/container_app_manifest/testing_1/";
    private List<WebApp> webApps;
    private List<WebAppV1> webappsv1;
    private List<WebAppV2> webappsv2;

    public static RetrofitInstance getInstance() {
        if (retrofit == null) {
            retrofitInstance = new RetrofitInstance();
            retrofit = new Retrofit.Builder()
                    .baseUrl(URL)
                    .addConverterFactory(GsonConverterFactory.create())
                    .build();
        }
        return retrofitInstance;
    }

    public void getAppManifest(WebAppDatabase webAppDatabase) {
        ApiService api = retrofit.create(ApiService.class);
        Call<WebAppResponse> call = api.getWebApps();

        call.enqueue(new Callback<WebAppResponse>() {
            @Override
            public void onResponse(Call<WebAppResponse> call, Response<WebAppResponse> response) {
                if (response.isSuccessful()) {
                    WebAppResponse webAppResponse = response.body();
                    CacheUtils.setManifestVersionNumber(webAppResponse.getVersion());
                    List<WebApp> webApps = webAppResponse.getWebApps();
                    webAppDatabase.deleteWebApps(webApps);

                }
            }

            @Override
            public void onFailure(Call<WebAppResponse> call, Throwable t) {
                System.out.println(t.getMessage() + "Something went wrong");
            }
        });
    }

    public void fetchAndCacheWebApps(WebAppDatabase webAppDatabase) {
        getAppManifest(webAppDatabase);
    }

    public void getUpdatedAppManifest(WebAppDatabase webAppDatabase, String manifestVersion) {
        ApiService api = retrofit.create(ApiService.class);
        Call<WebAppResponse> call = api.getWebApps();

        call.enqueue(new Callback<WebAppResponse>() {
            @Override
            public void onResponse(Call<WebAppResponse> call, Response<WebAppResponse> response) {
                if (response.isSuccessful()) {
                    WebAppResponse webAppResponse = response.body();
                    if (manifestVersion != webAppResponse.getVersion()) {
                        webAppDatabase.deleteWebApps(webAppResponse.getWebApps());
                    }
                }
            }

            @Override
            public void onFailure(Call<WebAppResponse> call, Throwable t) {
                System.out.println(t.getMessage() + "Something went wromng");
            }
        });
    }
}

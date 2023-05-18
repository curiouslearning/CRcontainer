package org.curiouslearning.container.data.remote;

import org.curiouslearning.container.data.database.WebAppDatabase;
import org.curiouslearning.container.data.model.WebApp;

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

    public List<WebApp> getAppManifest(WebAppDatabase webAppDatabase) {
        ApiService api = retrofit.create(ApiService.class);
        Call<List<WebApp>> call = api.getWebApps();

        call.enqueue(new Callback<List<WebApp>>() {
            @Override
            public void onResponse(Call<List<WebApp>> call, Response<List<WebApp>> response) {
                if (response.isSuccessful()) {
                    webApps = response.body();
                    webAppDatabase.insertAll(webApps);
                }
            }

            @Override
            public void onFailure(Call<List<WebApp>> call, Throwable t) {
                System.out.println(t.getMessage() + "Something went wromng");
            }
        });

        return webApps;
    }

    public void fetchAndCacheWebApps(WebAppDatabase webAppDatabase) {
        getAppManifest(webAppDatabase);
    }

}

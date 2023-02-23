package org.curiouslearning.container.data.remote;


import org.curiouslearning.container.data.model.WebApp;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class RetrofitInstance {


    private static Retrofit retrofit;
    private static String URL = "";
    private List<WebApp> webApps;

    public static Retrofit getInstance() {
        if (retrofit == null) {
            retrofit = new Retrofit.Builder()
                    .baseUrl(URL)
                    .addConverterFactory(GsonConverterFactory.create())
                    .build();
        }
        return retrofit;
    }

    public void getAppManifest() {
        ApiService api = retrofit.create(ApiService.class);
        Call<List<WebApp>> call = api.getWebApps();
        call.enqueue(new Callback<List<WebApp>>() {
            @Override
            public void onResponse(Call<List<WebApp>> call, Response<List<WebApp>> response) {
                if (response.isSuccessful()) {
                    webApps = response.body();
                }
            }

            @Override
            public void onFailure(Call<List<WebApp>> call, Throwable t) {
                System.out.println(t.getMessage() + "Something went wromng");
            }
        });
    }

    public List<WebApp> getAllWebApps() {
        return webApps;
    }
}

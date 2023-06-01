package org.curiouslearning.container.data.remote;

import android.text.TextUtils;

import org.curiouslearning.container.data.database.WebAppDatabase;
import org.curiouslearning.container.data.remote.ManifestResponse;
import org.curiouslearning.container.data.model.WebApp;

import java.util.List;

import javax.swing.plaf.synth.SynthScrollBarUI;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class RetrofitInstance {

    private static Retrofit retrofit;
    private static RetrofitInstance retrofitInstance;

    private static String URL = "https://devcuriousreader.wpcomstaging.com/container_app_manifest/testing/";
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

    public void getAppManifest(WebAppDatabase webAppDatabase) {
        ApiService api = retrofit.create(ApiService.class);
        Call<ManifestResponse> call = api.getManifestResponse();

        call.enqueue(new Callback<ManifestResponse>() {

            @Override

            public void onResponse(Call<ManifestResponse> call, Response<ManifestResponse> response) {
                if (response.isSuccessful()) {
                    ManifestResponse manifestResponse = response.body();
                    if (manifestResponse != null) {
                        List<WebApp> webApps = manifestResponse.getWebApps();
                        webAppDatabase.insertAll(webApps);
                    }
                }
            }

            @Override
            public void onFailure(Call<ManifestResponse> call, Throwable t) {
                System.out.println(t.getMessage() + " Something went wrong");
            }
        });
    }

    public void getUpdatedAppManifest(WebAppDatabase webAppDatabase, String selectedLanguage) {
        ApiService api = retrofit.create(ApiService.class);
        Call<ManifestResponse> call = api.getManifestResponse();

        call.enqueue(new Callback<ManifestResponse>() {
            @Override
            public void onResponse(Call<ManifestResponse> call, Response<ManifestResponse> response) {
                if (response.isSuccessful()) {
                    ManifestResponse manifestResponse = response.body();
                    if (manifestResponse != null) {
                        List<WebApp> latestWebApps = manifestResponse.getWebApps();
                        if (!TextUtils.isEmpty(selectedLanguage) && latestWebApps != null && !latestWebApps.isEmpty()) {
                            if (webApps != null && !webApps.isEmpty() && webApps.size() != latestWebApps.size()) {
                                if (latestWebApps.size() > 1) {
                                    // webAppDatabase.deleteWebApps();
                                    webAppDatabase.insertAll(latestWebApps);
                                    System.out.println("size is different");
                                }
                            } else {
                                System.out.println("size is same");
                                webAppDatabase.deleteWebApps();
                            }
                        } else {
                            // System.out.println(">>>>>>>>>>>>>>>>>>");
                            // webAppDatabase.deleteWebApps();
                            webAppDatabase.insertAll(latestWebApps);
                        }
                    }
                }
            }

            public void deleteWebApps() {
                webAppDatabase.deleteWebApps();
            }

            @Override
            public void onFailure(Call<ManifestResponse> call, Throwable t) {
                System.out.println(t.getMessage() + " Something went wrong");
            }
        });
    }

    public void fetchAndCacheWebApps(WebAppDatabase webAppDatabase) {
        getAppManifest(webAppDatabase);
    }
}

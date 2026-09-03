package org.curiouslearning.container.data.remote;

import android.util.Log;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;

import org.curiouslearning.container.BuildConfig;
import org.curiouslearning.container.data.database.WebAppDatabase;
import org.curiouslearning.container.data.model.IpInfoResponse;
import org.curiouslearning.container.data.model.WebApp;
import org.curiouslearning.container.data.model.WebAppResponse;
import org.curiouslearning.container.utilities.CacheUtils;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class RetrofitInstance {

    private static Retrofit retrofit;
    private static RetrofitInstance retrofitInstance;
    private Map<String, Object> data;
    private static String URL = BuildConfig.API_URL;;

    private List<WebApp> webApps;

    public static RetrofitInstance getInstance() {
        Log.d("AppConfig", "Build Type API URL: " + URL);
        if (retrofit == null) {
            retrofitInstance = new RetrofitInstance();
            retrofit = new Retrofit.Builder()
                    .baseUrl(URL)
                    .addConverterFactory(GsonConverterFactory.create())
                    .build();
        }
        return retrofitInstance;
    }

    public interface FetchCallback {
        void onComplete();
    }

    public interface CountryCallback {
        void onSuccess(String rawCountry);

        void onFailure();
    }

    public void fetchCountry(CountryCallback callback) {
        ApiService api = retrofit.create(ApiService.class);
        Call<IpInfoResponse> call = api.getIpInfo(BuildConfig.IPINFO_TOKEN);

        call.enqueue(new Callback<IpInfoResponse>() {
            @Override
            public void onResponse(Call<IpInfoResponse> call, Response<IpInfoResponse> response) {
                // Never log the response body here — it contains the device IP (MR-156 AC 2).
                if (response.isSuccessful() && response.body() != null) {
                    callback.onSuccess(response.body().country);
                } else {
                    callback.onFailure();
                }
            }

            @Override
            public void onFailure(Call<IpInfoResponse> call, Throwable t) {
                Log.w("CountryProvider", "country lookup failed: " + t.getMessage());
                callback.onFailure();
            }
        });
    }

    public void getAppManifest(WebAppDatabase webAppDatabase, FetchCallback callback) {
        ApiService api = retrofit.create(ApiService.class);
        Call<JsonElement> call = api.getWebApps(); // Assume your API call returns a raw JsonElement

        call.enqueue(new Callback<JsonElement>() {
            @Override
            public void onResponse(Call<JsonElement> call, Response<JsonElement> response) {
                if (response.isSuccessful()) {
                    JsonElement jsonElement = response.body();

                    if (jsonElement != null) {
                        JsonObject jsonObject = jsonElement.getAsJsonObject();
                        JsonElement versionElement = jsonObject.get("version");
                        WebAppResponse webAppResponse = findWebApps(jsonElement);
                        webAppResponse.setVersion(versionElement.getAsString());
                        if (webAppResponse != null) {
                            CacheUtils.setManifestVersionNumber(webAppResponse.getVersion());
                            List<WebApp> webApps = webAppResponse.getWebApps();
                            logAppIdCoverage(webApps);
                            webAppDatabase.deleteWebApps(webApps);
                        }
                    }
                }
                if (callback != null) {
                    callback.onComplete();
                }
            }

            @Override
            public void onFailure(Call<JsonElement> call, Throwable t) {
                System.out.println(t.getMessage() + "Something went wrong");
                if (callback != null) {
                    callback.onComplete();
                }
            }
        });
    }

    public void fetchAndCacheWebApps(WebAppDatabase webAppDatabase, FetchCallback callback) {
        getAppManifest(webAppDatabase, callback);
    }

    public void getUpdatedAppManifest(WebAppDatabase webAppDatabase, String manifestVersion) {
        ApiService api = retrofit.create(ApiService.class);
        Call<JsonElement> call = api.getWebApps(); // Assume your API call returns a raw JsonElement

        call.enqueue(new Callback<JsonElement>() {
            @Override
            public void onResponse(Call<JsonElement> call, Response<JsonElement> response) {
                if (response.isSuccessful()) {
                    JsonElement jsonElement = response.body();

                    if (jsonElement != null) {
                        JsonObject jsonObject = jsonElement.getAsJsonObject();
                        JsonElement versionElement = jsonObject.get("version");
                        WebAppResponse webAppResponse = findWebApps(jsonElement);
                        webAppResponse.setVersion(versionElement.getAsString());
                        String latestManifestVersion = webAppResponse.getVersion();
                        logAppIdCoverage(webAppResponse.getWebApps());
                        if (!Objects.equals(manifestVersion, latestManifestVersion)) {
                            CacheUtils.setManifestVersionNumber(latestManifestVersion);
                            webAppDatabase.deleteWebApps(webAppResponse.getWebApps());
                        }
                    }
                }
            }

            @Override
            public void onFailure(Call<JsonElement> call, Throwable t) {
                System.out.println(t.getMessage() + "Something went wrong");
            }
        });

    }

    /**
     * MR-217: logs how many of the just-parsed manifest entries carry an app_id, so a manifest
     * that hasn't rolled the field out yet (or partially has) is visible in device logs without
     * inspecting the on-device catalog directly.
     */
    private void logAppIdCoverage(List<WebApp> webApps) {
        if (webApps == null) {
            return;
        }
        long withAppId = webApps.stream()
                .filter(webApp -> webApp.getApp_id() != null && !webApp.getApp_id().trim().isEmpty())
                .count();
        Log.d("AppConfig", "Manifest app_id coverage: " + withAppId + "/" + webApps.size() + " entries");
    }

    private WebAppResponse findWebApps(JsonElement element) {
        if (element.isJsonObject()) {
            JsonObject jsonObject = element.getAsJsonObject();

            for (Map.Entry<String, JsonElement> entry : jsonObject.entrySet()) {
                String key = entry.getKey();
                JsonElement value = entry.getValue();

                if (key.equals("web_apps") && value.isJsonArray()) {
                    WebAppResponse webAppResponse = new WebAppResponse();
                    List<WebApp> webApps = new Gson().fromJson(value, new TypeToken<List<WebApp>>() {
                    }.getType());
                    webAppResponse.setWebApp(webApps);

                    return webAppResponse;
                } else if (value.isJsonObject()) {
                    WebAppResponse nestedResponse = findWebApps(value);
                    if (nestedResponse != null) {
                        return nestedResponse;
                    }
                }
            }
        }

        return null;
    }
}

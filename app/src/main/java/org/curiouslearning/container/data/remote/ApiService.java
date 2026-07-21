package org.curiouslearning.container.data.remote;

import com.google.gson.JsonElement;

import org.curiouslearning.container.data.model.IpInfoResponse;
import org.curiouslearning.container.data.model.WebApp;
import org.curiouslearning.container.data.model.WebAppResponse;

import java.util.List;
import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Query;

public interface ApiService {

    @GET("web_app_manifest.json")
    Call<JsonElement> getWebApps();

    // Absolute URL overrides the manifest baseUrl; Lite endpoint returns the
    // full English country name and no city/region/coordinates.
    @GET("https://api.ipinfo.io/lite/me")
    Call<IpInfoResponse> getIpInfo(@Query("token") String token);

}

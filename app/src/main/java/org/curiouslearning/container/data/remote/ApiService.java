package org.curiouslearning.container.data.remote;

import com.google.gson.JsonElement;

import org.curiouslearning.container.data.model.WebApp;
import org.curiouslearning.container.data.model.WebAppResponse;

import java.util.List;
import retrofit2.Call;
import retrofit2.http.GET;

public interface ApiService {

    @GET("web_app_manifest.json")
    Call<JsonElement> getWebApps();

}

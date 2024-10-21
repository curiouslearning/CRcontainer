package org.curiouslearning.devcontainer.data.remote;

import com.google.gson.JsonElement;

import org.curiouslearning.devcontainer.data.model.WebApp;
import org.curiouslearning.devcontainer.data.model.WebAppResponse;

import java.util.List;
import retrofit2.Call;
import retrofit2.http.GET;

public interface ApiService {

    @GET("web_app_manifest.json")
    Call<JsonElement> getWebApps();

}

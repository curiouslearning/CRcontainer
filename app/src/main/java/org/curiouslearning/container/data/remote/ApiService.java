package org.curiouslearning.container.data.remote;

import org.curiouslearning.container.data.model.WebApp;
import java.util.List;
import retrofit2.Call;
import retrofit2.http.GET;

public interface ApiService {

    @GET("")
    Call<List<WebApp>> getWebApps();

}

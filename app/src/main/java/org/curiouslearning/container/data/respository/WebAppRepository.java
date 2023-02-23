package org.curiouslearning.container.data.respository;

import android.app.Application;
import android.content.res.AssetManager;

import androidx.lifecycle.LiveData;

import org.curiouslearning.container.data.database.WebAppDatabase;
import org.curiouslearning.container.data.local.AppManifest;
import org.curiouslearning.container.data.model.WebApp;
import org.curiouslearning.container.data.remote.RetrofitInstance;

import java.util.List;

public class WebAppRepository {

    private LiveData<List<WebApp>> webApps;
    private WebAppDatabase webAppDatabase;
    private RetrofitInstance retrofit;
    private AppManifest appManifest;


    public WebAppRepository(Application application) {
        webAppDatabase = new WebAppDatabase(application);
        webApps = webAppDatabase.getAllWebApps();
        appManifest = AppManifest.getAppManifest();
    }

    public LiveData<List<WebApp>> getWebApps() {
        return webApps;
    }

    public void insertAll(AssetManager assetManager) {
        webAppDatabase.insertAll(appManifest.getAllWebApps(assetManager));
    }

}

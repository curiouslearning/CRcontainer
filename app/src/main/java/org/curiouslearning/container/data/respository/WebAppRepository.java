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

    private WebAppDatabase webAppDatabase;
    private AppManifest appManifest;
    private LiveData<List<WebApp>> webApps;


    public WebAppRepository(Application application) {
        webAppDatabase = new WebAppDatabase(application);
        appManifest = AppManifest.getAppManifest();
    }

    public LiveData<List<WebApp>> getWebApps(AssetManager assetManager) {
        webApps = webAppDatabase.getAllWebApps();
        if (webApps.getValue() != null && !webApps.getValue().isEmpty()) {
            return webApps;
        } else {
            insertAll(assetManager);
            return webApps;
        }
    }

    public void insertAll(AssetManager assetManager) {
        webAppDatabase.insertAll(appManifest.getAllWebApps(assetManager));
    }

}

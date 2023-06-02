package org.curiouslearning.container.data.respository;

import android.app.Application;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.Observer;

import org.curiouslearning.container.data.database.WebAppDatabase;
import org.curiouslearning.container.data.model.WebApp;
import org.curiouslearning.container.data.remote.RetrofitInstance;
import org.curiouslearning.container.utilities.ConnectionUtils;

import java.util.List;

public class WebAppRepository {

    private WebAppDatabase webAppDatabase;
    private RetrofitInstance retrofitInstance;
    private LiveData<List<WebApp>> webApp;
    private Application application;

    public WebAppRepository(Application application) {
        this.application = application;
        retrofitInstance = RetrofitInstance.getInstance();
        webAppDatabase = new WebAppDatabase(application);
    }

    public void fetchWebApp() {
        if (ConnectionUtils.getInstance().isInternetConnected(application)) {
            retrofitInstance.fetchAndCacheWebApps(webAppDatabase);
        }
    }

    public LiveData<List<WebApp>> getSelectedlanguageWebApps(String selectedLanguage) {
        webApp = webAppDatabase.getSelectedlanguageWebApps(selectedLanguage);
        webApp.observeForever(new Observer<List<WebApp>>() {
            @Override
            public void onChanged(List<WebApp> webApps) {
                if (webApps != null && !webApps.isEmpty()) {
                    // New data is available for the selected language, update the UI
                    // with the new data here.
                } else {
                   fetchWebApp();
                }
            }
        });
        return webApp;
    }

    public LiveData<List<WebApp>> getAllWebApps() {
        webApp = webAppDatabase.getAllWebApps();
        webApp.observeForever(new Observer<List<WebApp>>() {
            @Override
            public void onChanged(List<WebApp> webApps) {
                if (webApps != null && !webApps.isEmpty()) {
                    // New data is available for the selected language, update the UI
                    // with the new data here.
                } else {
                    fetchWebApp();
                }
            }
        });
        return webApp;
    }

    public void getUpdatedAppManifest(String manifestVersion) {
        if (ConnectionUtils.getInstance().isInternetConnected(application)) {
            retrofitInstance.getUpdatedAppManifest(webAppDatabase, manifestVersion);
        }
    }
}

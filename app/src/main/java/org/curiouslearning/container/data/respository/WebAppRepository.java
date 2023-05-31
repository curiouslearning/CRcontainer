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

    public void fetchWebApps() {
        if (ConnectionUtils.getInstance().isInternetConnected(application)) {
            retrofitInstance.fetchAndCacheWebApps(webAppDatabase);
        }
    }

    public LiveData<List<WebApp>> getSelectedlanguageWebApps(String selectedLanguage) {
        webApp = webAppDatabase.getSelectedlanguageWebApps(selectedLanguage);
        if (webApp.getValue() == null || webApp.getValue().isEmpty()) {
            fetchWebApps();
        }
        return webApp;
    }

    public LiveData<List<WebApp>> getAllWebApps() {
        webApp = webAppDatabase.getAllWebApps();
        if (webApp.getValue() == null || webApp.getValue().isEmpty()) {
            fetchWebApps();
        }
        return webApp;
    }
}

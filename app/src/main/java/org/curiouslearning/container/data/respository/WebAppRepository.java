package org.curiouslearning.container.data.respository;

import android.app.Application;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.Observer;

import org.curiouslearning.container.data.database.WebAppDatabase;
import org.curiouslearning.container.data.model.WebApp;
import org.curiouslearning.container.data.remote.RetrofitInstance;
import org.curiouslearning.container.utilities.ConnectionUtils;

import java.util.List;
import java.util.Set;

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

    public LiveData<List<WebApp>> getWebApps(String selectedLanguage) {
        MutableLiveData<List<WebApp>> webAppLiveData = new MutableLiveData<>();

        webApp = webAppDatabase.getAllWebApps(selectedLanguage);
        webApp.observeForever(new Observer<List<WebApp>>() {
            @Override
            public void onChanged(List<WebApp> webApps) {
                if (webApps != null && !webApps.isEmpty()) {
                    // New data is available for the selected language, update the LiveData
                    webAppLiveData.postValue(webApps);
                } else {
                    // No data available for the selected language, fetch it from the server
                    if (ConnectionUtils.getInstance().isInternetConnected(application)) {
                        retrofitInstance.fetchAndCacheWebApps(webAppDatabase);
                    }
                }
            }
        });

        return webAppLiveData;
    }

    public String[] getAvailableLanguages() {

        return retrofitInstance.getAvailableLanguages();
    }
}

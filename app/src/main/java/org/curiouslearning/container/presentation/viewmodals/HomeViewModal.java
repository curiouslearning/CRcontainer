package org.curiouslearning.container.presentation.viewmodals;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;

import org.curiouslearning.container.data.model.WebApp;
import org.curiouslearning.container.data.respository.WebAppRepository;

import java.util.List;

public class HomeViewModal extends AndroidViewModel {

    private WebAppRepository webAppRepository;
    private LiveData<List<WebApp>> webAppsLiveData;

    public HomeViewModal(@NonNull Application application) {
        super(application);
        webAppRepository = new WebAppRepository(application);
    }

    public LiveData<List<WebApp>> getWebApps(String selectedLanguage) {

        // if (webAppsLiveData == null) {
        webAppsLiveData = webAppRepository.getWebApps(selectedLanguage);
        // } else {
        // }
        return webAppsLiveData;
    }

    public String[] getAvailableLanguages() {

        return webAppRepository.getAvailableLanguages();
    }
}

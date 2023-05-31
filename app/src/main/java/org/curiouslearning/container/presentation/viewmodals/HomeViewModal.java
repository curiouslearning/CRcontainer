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
    private Application application;

    public HomeViewModal(@NonNull Application application) {
        super(application);
        this.application = application;
        webAppRepository = new WebAppRepository(application);
    }

    public LiveData<List<WebApp>> getSelectedlanguageWebApps(String selectedLanguage) {
        return webAppRepository.getSelectedlanguageWebApps(selectedLanguage);
    }

    public LiveData<List<WebApp>> getAllWebApps() {
        return webAppRepository.getAllWebApps();
    }
}

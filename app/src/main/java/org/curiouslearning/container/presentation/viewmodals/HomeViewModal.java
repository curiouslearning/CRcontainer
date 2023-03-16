package org.curiouslearning.container.presentation.viewmodals;

import android.app.Application;
import android.content.res.AssetManager;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;

import org.curiouslearning.container.data.model.WebApp;
import org.curiouslearning.container.data.respository.WebAppRepository;
import org.curiouslearning.container.firebase.AnalyticsUtils;

import java.util.List;

public class HomeViewModal extends AndroidViewModel {

    private WebAppRepository webAppRepository;
    private LiveData<List<WebApp>> webApps;
    private Application application;
    public HomeViewModal(@NonNull Application application, AssetManager assetManager) {
        super(application);
        this.application = application;
        webAppRepository = new WebAppRepository(application);
        webApps = webAppRepository.getWebApps();
        if (webApps.getValue() == null || webApps.getValue().isEmpty()) {
            insertAll(assetManager);
        }
    }

    public LiveData<List<WebApp>> getWebApps() {
        return webApps;
    }


    public void insertAll(AssetManager assetManager) {
        webAppRepository.insertAll(assetManager);
    }

    public void logAppLaunchEvent() {
        AnalyticsUtils.logEvent(application, "App Launch", new Bundle());
    }
}

package org.curiouslearning.container.presentation.viewmodals;

import android.app.Application;
import android.content.res.AssetManager;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;

import org.curiouslearning.container.data.model.WebApp;
import org.curiouslearning.container.data.respository.WebAppRepository;

import java.util.List;

public class HomeViewModal extends AndroidViewModel {

    private WebAppRepository webAppRepository;
    private AssetManager assetManager;

    public HomeViewModal(@NonNull Application application, AssetManager assetManager) {
        super(application);
        this.assetManager = assetManager;
        webAppRepository = new WebAppRepository(application);
    }

    public LiveData<List<WebApp>> getWebApps() {
        return webAppRepository.getWebApps(assetManager);
    }

}

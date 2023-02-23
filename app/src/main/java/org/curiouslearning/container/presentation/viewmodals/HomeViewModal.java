package org.curiouslearning.container.presentation.viewmodals;

import android.app.Application;
import android.content.res.AssetManager;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.recyclerview.widget.RecyclerView;

import org.curiouslearning.container.R;
import org.curiouslearning.container.data.model.WebApp;
import org.curiouslearning.container.data.respository.WebAppRepository;

import java.util.List;

public class HomeViewModal extends AndroidViewModel {

    private WebAppRepository webAppRepository;
    private LiveData<List<WebApp>> webApps;

    public HomeViewModal(@NonNull Application application, AssetManager assetManager) {
        super(application);
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
}

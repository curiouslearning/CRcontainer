package org.curiouslearning.container.data.respository;

import android.app.Application;

import androidx.lifecycle.LifecycleOwner;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.Observer;

import org.curiouslearning.container.BuildConfig;
import org.curiouslearning.container.data.database.WebAppDatabase;
import org.curiouslearning.container.data.local.LocalManifestLoader;
import org.curiouslearning.container.data.model.WebApp;
import org.curiouslearning.container.data.remote.RetrofitInstance;
import org.curiouslearning.container.utilities.ConnectionUtils;

import java.util.Collections;
import java.util.List;

public class WebAppRepository {

    private WebAppDatabase webAppDatabase;
    private RetrofitInstance retrofitInstance;
    private LiveData<List<WebApp>> webApp;
    private Application application;

    private boolean isFetching = false;

    // Set when the packaged manifest of an offline standalone build cannot be loaded, so the UI
    // can show a diagnostic instead of an indefinite loading indicator. Never set for online builds.
    private final MutableLiveData<String> localManifestError = new MutableLiveData<>();

    public WebAppRepository(Application application) {
        this.application = application;
        retrofitInstance = RetrofitInstance.getInstance();
        webAppDatabase = new WebAppDatabase(application);
    }

    public void fetchWebApp() {
        if (isFetching) {
            return;
        }
        if (BuildConfig.OFFLINE_STANDALONE) {
            // Standalone builds never consult the remote manifest: the packaged one is the source
            // of truth and must be usable without any connectivity, including on first launch.
            isFetching = true;
            LocalManifestLoader.loadInto(application, webAppDatabase, new LocalManifestLoader.Listener() {
                @Override
                public void onLoaded(String version, int appCount) {
                    isFetching = false;
                }

                @Override
                public void onFailed(String reason) {
                    isFetching = false;
                    localManifestError.postValue(reason);
                }
            });
            return;
        }
        if (ConnectionUtils.getInstance().isInternetConnected(application)) {
            isFetching = true;
            retrofitInstance.fetchAndCacheWebApps(webAppDatabase, new RetrofitInstance.FetchCallback() {
                @Override
                public void onComplete() {
                    isFetching = false;
                }
            });
        }
    }

    public LiveData<List<WebApp>> getSelectedlanguageWebApps(String selectedLanguage, LifecycleOwner lifecycleOwner) {
        MutableLiveData<List<WebApp>> selectedLanguageWebApps = new MutableLiveData<>();
        webApp = webAppDatabase.getSelectedlanguageWebApps(selectedLanguage);
        webApp.observe(lifecycleOwner, new Observer<List<WebApp>>() {
            @Override
            public void onChanged(List<WebApp> webApps) {
                if (webApps != null && !webApps.isEmpty()) {
                    selectedLanguageWebApps.setValue(webApps);
                } else {
                    selectedLanguageWebApps.setValue(Collections.emptyList());
//                   fetchWebApp();
                }
            }
        });
        return selectedLanguageWebApps;
    }

    public LiveData<List<WebApp>> getAllWebApps(LifecycleOwner lifecycleOwner) {
        MutableLiveData<List<WebApp>> newWebApps = new MutableLiveData<>();
        webApp = webAppDatabase.getAllWebApps();
        webApp.observe(lifecycleOwner, new Observer<List<WebApp>>() {
            @Override
            public void onChanged(List<WebApp> webApps) {
                if (webApps != null && !webApps.isEmpty()) {
                    newWebApps.setValue(webApps);
                } else {
                    newWebApps.setValue(Collections.emptyList());
                    fetchWebApp();
                }
            }
        });
        return newWebApps;
    }
    public LiveData<List<String>> getAllLanguagesInEnglish() {
        return webAppDatabase.getAllLanguagesInEnglish();
    }

    public LiveData<String> getLocalManifestError() {
        return localManifestError;
    }

    public void getUpdatedAppManifest(String manifestVersion) {
        if (BuildConfig.OFFLINE_STANDALONE) {
            // The remote manifest would replace the packaged catalog with entries whose content is
            // not on the device. Standalone catalogs change only with a new APK.
            return;
        }
        if (ConnectionUtils.getInstance().isInternetConnected(application)) {
            retrofitInstance.getUpdatedAppManifest(webAppDatabase, manifestVersion);
        }
    }
}

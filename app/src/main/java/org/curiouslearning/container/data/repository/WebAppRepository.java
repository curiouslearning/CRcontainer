package org.curiouslearning.container.data.repository;

import android.app.Application;

import androidx.lifecycle.LiveData;

import org.curiouslearning.container.data.database.WebAppDatabase;
import org.curiouslearning.container.data.model.WebApp;
import org.curiouslearning.container.data.remote.RetrofitInstance;
import org.curiouslearning.container.utilities.ConnectionUtils;

import java.util.List;

/**
 * Single source of truth for WebApp data.
 *
 * <p>Returns Room LiveData directly — callers (ViewModels) must NOT pass a
 * {@link androidx.lifecycle.LifecycleOwner} here. Observation belongs in the
 * Activity/Fragment layer.
 */
public class WebAppRepository {

    private final WebAppDatabase webAppDatabase;
    private final RetrofitInstance retrofitInstance;
    private final Application application;

    private boolean isFetching = false;

    public WebAppRepository(Application application) {
        this.application = application;
        retrofitInstance = RetrofitInstance.getInstance();
        webAppDatabase = new WebAppDatabase(application);
    }

    /**
     * Returns a LiveData stream of WebApps filtered by language.
     * Room will automatically re-emit when the underlying table changes.
     */
    public LiveData<List<WebApp>> getSelectedlanguageWebApps(String selectedLanguage) {
        return webAppDatabase.getSelectedlanguageWebApps(selectedLanguage);
    }

    /**
     * Returns a LiveData stream of all WebApps.
     * Room will automatically re-emit when the underlying table changes.
     * Call {@link #fetchWebApp()} separately to trigger a network refresh.
     */
    public LiveData<List<WebApp>> getAllWebApps() {
        return webAppDatabase.getAllWebApps();
    }

    /** Returns a LiveData stream of all language names in English. */
    public LiveData<List<String>> getAllLanguagesInEnglish() {
        return webAppDatabase.getAllLanguagesInEnglish();
    }

    /**
     * Fetches the full app manifest from the network and caches it in Room.
     * Room LiveData observers are notified automatically when the insert completes.
     * Safe to call multiple times — concurrent fetches are de-duplicated via {@code isFetching}.
     */
    public void fetchWebApp() {
        if (isFetching) {
            return;
        }
        if (ConnectionUtils.getInstance().isInternetConnected(application)) {
            isFetching = true;
            retrofitInstance.fetchAndCacheWebApps(webAppDatabase, () -> isFetching = false);
        }
    }

    /**
     * Fetches the manifest only when the version has changed since last cache.
     * Room LiveData observers are notified automatically on any update.
     */
    public void getUpdatedAppManifest(String manifestVersion) {
        if (ConnectionUtils.getInstance().isInternetConnected(application)) {
            retrofitInstance.getUpdatedAppManifest(webAppDatabase, manifestVersion);
        }
    }
}

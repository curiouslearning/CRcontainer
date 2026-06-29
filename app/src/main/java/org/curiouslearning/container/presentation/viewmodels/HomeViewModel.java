package org.curiouslearning.container.presentation.viewmodels;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;

import org.curiouslearning.container.data.model.WebApp;
import org.curiouslearning.container.data.repository.WebAppRepository;

import java.util.List;

/**
 * ViewModel for the home screen.
 *
 * <p><b>Note:</b> A {@link androidx.lifecycle.LifecycleOwner} must never be stored inside a
 * ViewModel — doing so causes memory leaks and crashes on configuration changes.
 * LiveData observation belongs in the Activity/Fragment, not here.
 */
public class HomeViewModel extends AndroidViewModel {

    private final WebAppRepository webAppRepository;

    public HomeViewModel(@NonNull Application application) {
        super(application);
        webAppRepository = new WebAppRepository(application);
        // Kick off an initial fetch so Room LiveData is populated as soon as
        // the ViewModel is created. Room will notify all active observers
        // automatically once the insert completes.
        webAppRepository.fetchWebApp();
    }

    /**
     * Returns a LiveData stream of WebApps filtered by the given language code.
     * Callers (Activities/Fragments) must observe this with {@code this} as LifecycleOwner.
     */
    public LiveData<List<WebApp>> getSelectedLanguageWebApps(String selectedLanguage) {
        return webAppRepository.getSelectedLanguageWebApps(selectedLanguage);
    }

    /** Returns a LiveData stream of all WebApps in the local database. */
    public LiveData<List<WebApp>> getAllWebApps() {
        return webAppRepository.getAllWebApps();
    }

    /** Returns a LiveData stream of all language names in English. */
    public LiveData<List<String>> getAllLanguagesInEnglish() {
        return webAppRepository.getAllLanguagesInEnglish();
    }

    /**
     * Triggers a background refresh of the app manifest when the version has changed.
     * Room LiveData observers will be notified automatically when the DB is updated.
     */
    public void getUpdatedAppManifest(String manifestVersion) {
        webAppRepository.getUpdatedAppManifest(manifestVersion);
    }

    /**
     * Explicitly triggers a network fetch of the manifest.
     * Use this instead of calling {@link #getAllWebApps()} as a side-effect to start a fetch.
     */
    public void triggerRefresh() {
        webAppRepository.fetchWebApp();
    }
}

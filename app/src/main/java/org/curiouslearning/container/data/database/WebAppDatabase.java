package org.curiouslearning.container.data.database;

import android.app.Application;

import androidx.lifecycle.LiveData;

import org.curiouslearning.container.data.model.WebApp;

import java.util.List;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

public class WebAppDatabase {

    private static final Executor DB_EXECUTOR = Executors.newSingleThreadExecutor();

    private final WebAppDao webAppDao;

    public WebAppDatabase(Application application) {
        DatabaseHelper database = DatabaseHelper.getInstance(application);
        webAppDao = database.webAppDao();
    }

    /** Inserts (or replaces) a list of WebApps off the main thread. */
    public void insertAll(List<WebApp> webApps) {
        DB_EXECUTOR.execute(() -> webAppDao.insertAll(webApps));
    }

    /**
     * Atomically clears the table and inserts the new list.
     * Uses the shared executor so delete + insert always run in order.
     */
    public void deleteWebApps(List<WebApp> webApps) {
        DB_EXECUTOR.execute(() -> {
            webAppDao.deleteAllWebApp();
            webAppDao.insertAll(webApps);
        });
    }

    public LiveData<List<WebApp>> getAllWebApps() {
        return webAppDao.getAllWebApp();
    }

    public LiveData<List<WebApp>> getSelectedlanguageWebApps(String selectedLanguage) {
        return webAppDao.getSelectedlanguageWebApps(selectedLanguage);
    }

    public LiveData<List<String>> getAllLanguagesInEnglish() {
        return webAppDao.getAllLanguagesInEnglish();
    }
}

package org.curiouslearning.container.data.database;

import android.app.Application;
import android.os.AsyncTask;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.lifecycle.LiveData;

import org.curiouslearning.container.data.model.WebApp;

import java.util.List;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

public class WebAppDatabase {

    private WebAppDao webAppDao;

    public WebAppDatabase(Application application) {
        DatabaseHelper database = DatabaseHelper.getInstance(application);
        webAppDao = database.webAppDao();
    }

    public void insertAll(List<WebApp> webApps) {
        new InsertAllWebAppAsyncTask(webAppDao).execute(webApps);
    }

    // public void deleteWebApps() {
    // new DeleteAllWebAppAsyncTask(webAppDao).execute();
    // }
    public void deleteWebApps() {
        Executor executor = Executors.newSingleThreadExecutor();
        executor.execute(() -> {
            webAppDao.deleteAllWebApp();
        });
    }

    public LiveData<List<WebApp>> getAllWebApps() {
        return webAppDao.getAllWebApp();
    }

    public LiveData<List<WebApp>> getSelectedlanguageWebApps(String selectedLanguage) {
        return webAppDao.getSelectedlanguageWebApps(selectedLanguage);
    }

    private static class InsertAllWebAppAsyncTask extends AsyncTask<List<WebApp>, Void, Void> {
        private WebAppDao WebAppDao;

        private InsertAllWebAppAsyncTask(WebAppDao WebAppDao) {
            this.WebAppDao = WebAppDao;
        }

        @Nullable
        @Override
        protected Void doInBackground(@NonNull List<WebApp>... WebApps) {
            WebAppDao.insertAll(WebApps[0]);
            return null;
        }
    }

    private static class DeleteAllWebAppAsyncTask extends AsyncTask<Void, Void, Void> {
        private WebAppDao WebAppDao;

        private DeleteAllWebAppAsyncTask(WebAppDao WebAppDao) {
            this.WebAppDao = WebAppDao;
        }

        @Override
        protected Void doInBackground(Void... voids) {
            WebAppDao.deleteAllWebApp();
            return null;
        }
    }
}

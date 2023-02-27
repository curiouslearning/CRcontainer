package org.curiouslearning.container.data.database;

import android.app.Application;
import android.os.AsyncTask;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.lifecycle.LiveData;

import org.curiouslearning.container.data.model.WebApp;

import java.util.List;

public class WebAppDatabase {

    private WebAppDao webAppDao;
    private LiveData<List<WebApp>> allWebApps;

    public WebAppDatabase(Application application) {
        DatabaseHelper database = DatabaseHelper.getInstance(application);
        webAppDao = database.webAppDao();
        allWebApps = webAppDao.getAllWebApp();
    }

    public void insert(WebApp webApps) {
        new InsertWebAppAsyncTask(webAppDao).execute(webApps);
    }

    public void insertAll(List<WebApp> webApps) {
        new InsertAllWebAppAsyncTask(webAppDao).execute(webApps);
    }

    public void update(List<WebApp> webApps) {
        new UpdateWebAppAsyncTask(webAppDao).execute(webApps);
    }

    public void delete(WebApp webApp) {
        new DeleteWebAppAsyncTask(webAppDao).execute(webApp);
    }

    public void deleteAllWebApps() {
        new DeleteAllWebAppsAsyncTask(webAppDao).execute();
    }

    public LiveData<List<WebApp>> getAllWebApps() {
        return allWebApps;
    }

    private static class InsertWebAppAsyncTask extends AsyncTask<WebApp, Void, Void> {
        private WebAppDao WebAppDao;

        private InsertWebAppAsyncTask(WebAppDao WebAppDao) {
            this.WebAppDao = WebAppDao;
        }

        @Nullable
        @Override
        protected Void doInBackground(@NonNull WebApp... WebApps) {
            WebAppDao.insert(WebApps[0]);
            return null;
        }
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

    private static class UpdateWebAppAsyncTask extends AsyncTask<List<WebApp>, Void, Void> {
        private WebAppDao WebAppDao;

        private UpdateWebAppAsyncTask(WebAppDao WebAppDao) {
            this.WebAppDao = WebAppDao;
        }

        @Nullable
        @Override
        protected Void doInBackground(@NonNull List<WebApp>... WebApps) {
            WebAppDao.update((WebApp) WebApps[0]);
            return null;
        }
    }

    private static class DeleteWebAppAsyncTask extends AsyncTask<WebApp, Void, Void> {
        private WebAppDao WebAppDao;

        private DeleteWebAppAsyncTask(WebAppDao WebAppDao) {
            this.WebAppDao = WebAppDao;
        }

        @Nullable
        @Override
        protected Void doInBackground(@NonNull WebApp... WebApps) {
            WebAppDao.delete(WebApps[0]);
            return null;
        }
    }

    private static class DeleteAllWebAppsAsyncTask extends AsyncTask<WebApp, Void, Void> {
        private WebAppDao WebAppDao;

        private DeleteAllWebAppsAsyncTask(WebAppDao WebAppDao) {
            this.WebAppDao = WebAppDao;
        }

        @Nullable
        @Override
        protected Void doInBackground(WebApp... webApps) {
            WebAppDao.deleteAllWebApp();
            return null;
        }
    }
}

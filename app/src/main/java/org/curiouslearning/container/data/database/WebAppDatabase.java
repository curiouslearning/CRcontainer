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

    public WebAppDatabase(Application application) {
        DatabaseHelper database = DatabaseHelper.getInstance(application);
        webAppDao = database.webAppDao();
    }

    public void insertAll(List<WebApp> webApps) {
        new InsertAllWebAppAsyncTask(webAppDao).execute(webApps);
    }

    public LiveData<List<WebApp>> getAllWebApps(String selectedLanguage) {
        return webAppDao.getAllWebApp(selectedLanguage);
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

}

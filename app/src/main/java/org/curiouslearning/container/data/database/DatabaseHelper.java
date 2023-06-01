package org.curiouslearning.container.data.database;

import android.content.Context;
import android.os.AsyncTask;

import androidx.annotation.NonNull;
import androidx.room.Database;
import androidx.room.Room;
import androidx.room.RoomDatabase;
import androidx.sqlite.db.SupportSQLiteDatabase;

import org.curiouslearning.container.data.model.WebApp;

@Database(entities = { WebApp.class }, version = 1)
public abstract class DatabaseHelper extends RoomDatabase {

    private static DatabaseHelper instance;

    public abstract WebAppDao webAppDao();

    public static synchronized DatabaseHelper getInstance(Context context) {
        if (instance == null) {
            instance = Room.databaseBuilder(context.getApplicationContext(),
                    DatabaseHelper.class, "web_apps_database")
                    .fallbackToDestructiveMigration()
                    .addCallback(roomCallback)
                    .build();
        }
        return instance;
    }

    private static RoomDatabase.Callback roomCallback = new RoomDatabase.Callback() {
        @Override
        public void onCreate(@NonNull SupportSQLiteDatabase db) {
            super.onCreate(db);
            new PopulateDbAsyncTask(instance).execute();
        }
    };

    private static class PopulateDbAsyncTask extends AsyncTask<Void, Void, Void> {
        private WebAppDao webAppDao;

        private PopulateDbAsyncTask(DatabaseHelper db) {
            webAppDao = db.webAppDao();
        }

        @Override
        protected Void doInBackground(Void... voids) {
            // webAppDao.deleteAllWebApp();
            return null;
        }
    }
}

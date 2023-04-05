package org.curiouslearning.container.data.database;


import androidx.lifecycle.LiveData;
import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;
import org.curiouslearning.container.data.model.WebApp;
import java.util.List;

@Dao
public interface WebAppDao {

    @Insert
    void insert(WebApp webApp);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insertAll(List<WebApp> webApp);


    @Query("DELETE FROM web_app_table")
    void deleteAllWebApp();

    @Query("SELECT * FROM web_app_table ORDER BY appId ASC")
    LiveData<List<WebApp>> getAllWebApp();
}

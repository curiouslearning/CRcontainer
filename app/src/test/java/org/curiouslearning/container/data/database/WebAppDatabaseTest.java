package org.curiouslearning.container.data.database;

import android.app.Application;

import androidx.arch.core.executor.testing.InstantTaskExecutorRule;
import androidx.room.Room;
import androidx.test.core.app.ApplicationProvider;

import org.curiouslearning.container.LiveDataTestUtil;
import org.curiouslearning.container.data.model.WebApp;
import org.junit.After;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.annotation.Config;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;

@RunWith(RobolectricTestRunner.class)
@Config(sdk = {28})
public class WebAppDatabaseTest {

    @Rule
    public InstantTaskExecutorRule instantTaskExecutorRule = new InstantTaskExecutorRule();

    private WebAppDatabase webAppDatabase;
    private DatabaseHelper databaseHelper;
    private MockedStatic<DatabaseHelper> mockedDatabaseHelper;

    @Before
    public void setup() {
        Application application = ApplicationProvider.getApplicationContext();
        
        databaseHelper = Room.inMemoryDatabaseBuilder(application, DatabaseHelper.class)
                .allowMainThreadQueries()
                .build();
                
        mockedDatabaseHelper = Mockito.mockStatic(DatabaseHelper.class);
        mockedDatabaseHelper.when(() -> DatabaseHelper.getInstance(application)).thenReturn(databaseHelper);

        webAppDatabase = new WebAppDatabase(application);
    }

    @After
    public void teardown() {
        mockedDatabaseHelper.close();
        databaseHelper.close();
    }

    @Test
    public void testInsertAllAndGetAllWebApps() throws InterruptedException {
        WebApp app1 = new WebApp();
        app1.setAppId(1);
        app1.setTitle("App 1");

        WebApp app2 = new WebApp();
        app2.setAppId(2);
        app2.setTitle("App 2");

        List<WebApp> list = new ArrayList<>();
        list.add(app1);
        list.add(app2);

        webAppDatabase.insertAll(list);
        
        Thread.sleep(100);

        List<WebApp> result = LiveDataTestUtil.getOrAwaitValue(webAppDatabase.getAllWebApps());
        assertEquals(2, result.size());
    }

    @Test
    public void testDeleteWebApps() throws InterruptedException {
        WebApp app1 = new WebApp();
        app1.setAppId(1);
        app1.setTitle("App 1");

        WebApp app2 = new WebApp();
        app2.setAppId(2);
        app2.setTitle("App 2");

        List<WebApp> initialList = new ArrayList<>();
        initialList.add(app1);
        
        webAppDatabase.insertAll(initialList);
        Thread.sleep(100);

        List<WebApp> resultBefore = LiveDataTestUtil.getOrAwaitValue(webAppDatabase.getAllWebApps());
        assertEquals(1, resultBefore.size());

        List<WebApp> newList = new ArrayList<>();
        newList.add(app2);
        
        webAppDatabase.deleteWebApps(newList);
        Thread.sleep(100);

        List<WebApp> resultAfter = LiveDataTestUtil.getOrAwaitValue(webAppDatabase.getAllWebApps());
        assertEquals(1, resultAfter.size());
        assertEquals("App 2", resultAfter.get(0).getTitle());
    }
}

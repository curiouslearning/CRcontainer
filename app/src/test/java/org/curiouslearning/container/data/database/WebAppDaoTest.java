package org.curiouslearning.container.data.database;

import android.content.Context;

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
import org.robolectric.RobolectricTestRunner;
import org.robolectric.annotation.Config;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

@RunWith(RobolectricTestRunner.class)
@Config(sdk = {28})
public class WebAppDaoTest {

    @Rule
    public InstantTaskExecutorRule instantTaskExecutorRule = new InstantTaskExecutorRule();

    private DatabaseHelper database;
    private WebAppDao webAppDao;

    @Before
    public void setup() {
        Context context = ApplicationProvider.getApplicationContext();
        database = Room.inMemoryDatabaseBuilder(context, DatabaseHelper.class)
                .allowMainThreadQueries()
                .build();
        webAppDao = database.webAppDao();
    }

    @After
    public void teardown() {
        database.close();
    }

    @Test
    public void testInsertAndGetAllWebApp() throws InterruptedException {
        WebApp app1 = new WebApp();
        app1.setAppId(1);
        app1.setTitle("App 1");
        app1.setLanguageInEnglishName("English");

        webAppDao.insert(app1);

        List<WebApp> apps = LiveDataTestUtil.getOrAwaitValue(webAppDao.getAllWebApp());
        assertEquals(1, apps.size());
        assertEquals("App 1", apps.get(0).getTitle());
    }

    @Test
    public void testInsertAllAndGetSelectedLanguageWebApps() throws InterruptedException {
        WebApp app1 = new WebApp();
        app1.setAppId(1);
        app1.setTitle("App 1");
        app1.setLanguageInEnglishName("English");

        WebApp app2 = new WebApp();
        app2.setAppId(2);
        app2.setTitle("App 2");
        app2.setLanguageInEnglishName("Spanish");

        WebApp app3 = new WebApp();
        app3.setAppId(3);
        app3.setTitle("App 3");
        app3.setLanguageInEnglishName("English");

        List<WebApp> list = new ArrayList<>();
        list.add(app1);
        list.add(app2);
        list.add(app3);

        webAppDao.insertAll(list);

        List<WebApp> englishApps = LiveDataTestUtil.getOrAwaitValue(webAppDao.getSelectedLanguageWebApps("English"));
        assertEquals(2, englishApps.size());
        assertEquals("App 1", englishApps.get(0).getTitle());
        assertEquals("App 3", englishApps.get(1).getTitle());

        List<WebApp> spanishApps = LiveDataTestUtil.getOrAwaitValue(webAppDao.getSelectedLanguageWebApps("spanish"));
        assertEquals(1, spanishApps.size());
        assertEquals("App 2", spanishApps.get(0).getTitle());
    }

    @Test
    public void testDeleteAllWebApp() throws InterruptedException {
        WebApp app1 = new WebApp();
        app1.setAppId(1);
        app1.setTitle("App 1");
        app1.setLanguageInEnglishName("English");

        webAppDao.insert(app1);

        List<WebApp> appsBefore = LiveDataTestUtil.getOrAwaitValue(webAppDao.getAllWebApp());
        assertEquals(1, appsBefore.size());

        webAppDao.deleteAllWebApp();

        List<WebApp> appsAfter = LiveDataTestUtil.getOrAwaitValue(webAppDao.getAllWebApp());
        assertEquals(0, appsAfter.size());
    }

    @Test
    public void testGetAllLanguagesInEnglish() throws InterruptedException {
        WebApp app1 = new WebApp();
        app1.setAppId(1);
        app1.setLanguageInEnglishName("English");

        WebApp app2 = new WebApp();
        app2.setAppId(2);
        app2.setLanguageInEnglishName("Spanish");

        List<WebApp> list = new ArrayList<>();
        list.add(app1);
        list.add(app2);
        webAppDao.insertAll(list);

        List<String> languages = LiveDataTestUtil.getOrAwaitValue(webAppDao.getAllLanguagesInEnglish());
        assertEquals(2, languages.size());
        assertTrue(languages.contains("English"));
        assertTrue(languages.contains("Spanish"));
    }
}

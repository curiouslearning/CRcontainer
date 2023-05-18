package org.curiouslearning.container.data.remote;

import static com.facebook.FacebookSdk.getApplicationContext;

import android.content.Context;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;

import org.curiouslearning.container.data.database.WebAppDatabase;
import org.curiouslearning.container.data.model.WebApp;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class RetrofitInstance {

    private static RetrofitInstance retrofitInstance;
    private static final String OFFLINE_MANIFEST_FILE = "web_apps_manifest.json";

    private List<WebApp> webApps;

    private RetrofitInstance() {
        // Private constructor to enforce singleton pattern
    }

    public static RetrofitInstance getInstance() {
        if (retrofitInstance == null) {
            retrofitInstance = new RetrofitInstance();
        }
        return retrofitInstance;
    }

    public List<WebApp> getAppManifest( WebAppDatabase webAppDatabase) {
        Context context = getApplicationContext();
        if (webApps != null) {
            return webApps;
        }

        try {
            // Read the offline manifest file from the assets folder
            InputStream is = context.getAssets().open(OFFLINE_MANIFEST_FILE);

            // Parse the JSON data into a JsonObject
            JsonObject jsonObject = new Gson().fromJson(new InputStreamReader(is), JsonObject.class);

            // Parse the web apps from the JsonObject
            webApps = parseWebApps(jsonObject);

            // Insert the List<WebApp> object into the database
            webAppDatabase.insertAll(webApps);

            is.close();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return webApps;
    }

    public String[] getAvailableLanguages() {
        Context context = getApplicationContext();
        try {
            // Read the offline manifest file from the assets folder
            InputStream is = context.getAssets().open(OFFLINE_MANIFEST_FILE);

            // Parse the JSON data into a JsonObject
            JsonObject jsonObject = new Gson().fromJson(new InputStreamReader(is), JsonObject.class);

            // Extract the language keys from the JsonObject
            Set<String> languageSet = jsonObject.keySet();

            is.close();

            // Convert the Set<String> to a String[] array
            return languageSet.toArray(new String[0]);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return new String[0];
    }

    private List<WebApp> parseWebApps(JsonObject jsonObject) {
        List<WebApp> webApps = new ArrayList<>();

        for (Map.Entry<String, JsonElement> entry : jsonObject.entrySet()) {
            String language = entry.getKey();
            JsonArray webAppsArray = entry.getValue().getAsJsonArray();
            List<WebApp> languageWebApps = new Gson().fromJson(webAppsArray, new TypeToken<List<WebApp>>() {
            }.getType());

            // Set the language for each web app in the list
            for (WebApp webApp : languageWebApps) {
                webApp.setLanguage(language);
            }

            webApps.addAll(languageWebApps);
        }

        return webApps;
    }

    public void fetchAndCacheWebApps(WebAppDatabase webAppDatabase) {
        getAppManifest(webAppDatabase);
    }

}

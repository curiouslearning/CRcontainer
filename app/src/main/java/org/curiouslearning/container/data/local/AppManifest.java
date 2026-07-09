package org.curiouslearning.container.data.local;

import android.content.res.AssetManager;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;

import org.curiouslearning.container.data.model.WebApp;

import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Type;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.List;

public class AppManifest {

    public final String jsonFileName = "web_apps_manifest.json";

    public static AppManifest instance;

    public static AppManifest getAppManifest() {
        if (instance == null) {
            instance = new AppManifest();
        }
        return instance;
    }


    public String getData(AssetManager assetManager) {
        try {
            InputStream inputStream = assetManager.open(jsonFileName);
            byte[] buffer = new byte[inputStream.available()];
            inputStream.read(buffer);
            inputStream.close();
            return new String(buffer, StandardCharsets.UTF_8);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }


    public List<WebApp> getAllWebApps(AssetManager assetManager) {
        String jsonData = getData(assetManager);
        if (jsonData == null || jsonData.trim().isEmpty()) {
            return Collections.emptyList();
        }
        Type listType = new TypeToken<List<WebApp>>(){}.getType();
        JsonElement parsedElement = JsonParser.parseString(jsonData);

        if (parsedElement.isJsonObject()) {
            JsonObject jsonObject = parsedElement.getAsJsonObject();
            JsonElement webAppsElement = jsonObject.get("web_apps");
            if (webAppsElement != null && webAppsElement.isJsonArray()) {
                return new Gson().fromJson(webAppsElement, listType);
            }
        }

        if (parsedElement.isJsonArray()) {
            return new Gson().fromJson(parsedElement, listType);
        }

        return Collections.emptyList();
    }
}

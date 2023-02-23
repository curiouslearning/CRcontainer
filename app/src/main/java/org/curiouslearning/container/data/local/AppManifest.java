package org.curiouslearning.container.data.local;

import android.content.res.AssetManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import org.curiouslearning.container.data.model.WebApp;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Type;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
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

    public ArrayList<Bitmap> getWebAppsMetaData(AssetManager assetManager) {

        try {
            ArrayList<Bitmap> bitmap = new ArrayList<>();
            InputStream inputStream = assetManager.open(jsonFileName);
            byte[] buffer = new byte[inputStream.available()];
            inputStream.read(buffer);
            inputStream.close();
            String jsonString = new String(buffer, StandardCharsets.UTF_8);

            JSONObject jsonObject = new JSONObject(jsonString);
            JSONArray jsonArray = jsonObject.getJSONArray("data");
            for (int i = 0; i < jsonArray.length(); i++) {

                JSONObject image = jsonArray.getJSONObject(i);
                String imagePath = image.getString("appIconUrl");
                InputStream imageStream = assetManager.open(imagePath);
                bitmap.add(BitmapFactory.decodeStream(imageStream));

            }
            return bitmap;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return null;
    }

    public String getAppManifest(AssetManager assetManager) {
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
        String jsonData = getAppManifest(assetManager);
        Type listType = new TypeToken<List<WebApp>>(){}.getType();
        List<WebApp> webApps =  new Gson().fromJson(convertToJsonArray(jsonData).toString(), listType);
        return webApps;
    }

    public JSONArray convertToJsonArray(String jsonData) {
        try {
            JSONArray jsonArray = new JSONObject(jsonData).getJSONArray("data");
            return jsonArray;
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return null;
    }
}

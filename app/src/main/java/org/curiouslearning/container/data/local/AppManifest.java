package org.curiouslearning.container.data.local;

import android.content.res.AssetManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;

public class AppManifest {

    public final String jsonFileName = "web_apps_manifest.json";

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

    public String getLocalJson(AssetManager assetManager) {
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
}

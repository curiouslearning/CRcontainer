package org.curiouslearning.container;

import android.content.res.AssetManager;

import org.json.JSONArray;
import org.json.JSONException;

import java.io.IOException;
import java.io.InputStream;

public class JSONFetcher {
    public JSONArray jsonArray;

    public JSONFetcher(AssetManager assetManager, String fileName) {
        try {
            InputStream inputStream = assetManager.open(fileName);
            int size = inputStream.available();
            byte[] buffer = new byte[size];
            inputStream.read(buffer);
            inputStream.close();
            String jsonString = new String(buffer, "UTF-8");
            System.out.println(jsonString);
            jsonArray = new JSONArray(jsonString);
        } catch (IOException e) {
            e.printStackTrace();
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    public JSONArray getJSONArray() {
        return jsonArray;
    }
}

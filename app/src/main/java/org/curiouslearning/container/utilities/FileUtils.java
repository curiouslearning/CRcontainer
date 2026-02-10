package org.curiouslearning.container.utilities;

import android.content.Context;
import android.util.Log;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class FileUtils {

    private static final String TAG = "FILE-DEBUG";

    /**
     * Load a raw file into a byte array
     */
    public static byte[] readRawFile(Context context, int resId) {
        Log.d(TAG, "Loading raw resource ID: " + resId);

        InputStream inputStream = null;

        try {
            inputStream = context.getResources().openRawResource(resId);
            byte[] data = new byte[inputStream.available()];
            int read = inputStream.read(data);

            Log.d(TAG, "Raw file loaded. Size: " + read);
            return data;

        } catch (Exception e) {
            Log.e(TAG, "Error loading raw resource", e);
            return null;

        } finally {
            if (inputStream != null) {
                try { inputStream.close(); }
                catch (IOException ignored) {}
            }
        }
    }

    /**
     * Load config.properties from /assets
     */
    public static Properties loadPropertiesFromAssets(Context context, String fileName) {
        Properties props = new Properties();
        InputStream inputStream = null;

        try {
            inputStream = context.getAssets().open(fileName);
            props.load(inputStream);
            Log.d(TAG, "Properties file loaded: " + fileName);

        } catch (Exception e) {
            Log.e(TAG, "Error loading properties file: " + fileName, e);

        } finally {
            if (inputStream != null) {
                try { inputStream.close(); }
                catch (IOException ignored) {}
            }
        }

        return props;
    }
}

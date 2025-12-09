package org.curiouslearning.container.utilities;

import android.content.Context;
import android.util.Base64;
import android.util.Log;

import org.curiouslearning.container.R;

import java.nio.charset.StandardCharsets;
import java.util.Properties;

public class ConfigLoader {

    private static final String TAG = "CONFIG-DEBUG";

    /**
     * Load and decrypt the Slack webhook URL using:
     * - encrypted_webhook.bin (in APK)
     * - iv.bin (in APK)
     * - AES key from config.properties (injected by CI)
     */
    public static String getSlackWebhookUrl(Context context) {
        try {
            Log.d(TAG, "Loading encrypted Slack webhook from raw resources...");

            // Load encrypted webhook + IV
            byte[] encryptedWebhook = FileUtils.readRawFile(context, R.raw.encrypted_webhook);
            byte[] iv = FileUtils.readRawFile(context, R.raw.slack_iv);

            if (encryptedWebhook == null || iv == null) {
                Log.e(TAG, "Encrypted webhook or IV missing!");
                return null;
            }

            Log.d(TAG, "Encrypted webhook size = " + encryptedWebhook.length);
            Log.d(TAG, "IV size = " + iv.length);

            // Load AES key from config.properties
            Properties props = FileUtils.loadPropertiesFromAssets(context, "config.properties");
            String aesBase64 = props.getProperty("SLACK_AES_KEY");

            if (aesBase64 == null) {
                Log.e(TAG, "SLACK_AES_KEY missing in config.properties!");
                return null;
            }

            byte[] aesKeyBytes = Base64.decode(aesBase64, Base64.DEFAULT);
            Log.d(TAG, "Loaded AES key length = " + aesKeyBytes.length);

            // Decrypt webhook
            byte[] decryptedBytes = org.curiouslearning.container.utilities.CryptoUtils.decryptAesCbc(
                    encryptedWebhook,
                    iv,
                    aesKeyBytes
            ).getBytes();

            String webhookUrl = new String(decryptedBytes, StandardCharsets.UTF_8);

            Log.d(TAG, "Slack webhook decrypted successfully.");
            return webhookUrl;

        } catch (Exception e) {
            Log.e(TAG, "Error decrypting Slack webhook", e);
            return null;
        }
    }
}

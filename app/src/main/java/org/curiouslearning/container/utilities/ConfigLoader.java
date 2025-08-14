package org.curiouslearning.container.utilities;

import android.content.Context;
import java.io.InputStream;
import java.util.Properties;
import org.curiouslearning.container.BuildConfig;

public class ConfigLoader {
    public static String getSlackWebhookUrl(Context context) {
        try {
            Properties properties = new Properties();
            InputStream inputStream = context.getAssets().open("config.properties");
            properties.load(inputStream);

            String webhookUrl = properties.getProperty("SLACK_WEBHOOK_URL");
            if (webhookUrl != null && !webhookUrl.isEmpty()) {
                return webhookUrl;
            }
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}

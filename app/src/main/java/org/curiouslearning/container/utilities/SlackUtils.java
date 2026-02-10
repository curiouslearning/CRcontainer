package org.curiouslearning.container.utilities;

import android.content.Context;
import android.os.AsyncTask;
import android.util.Log;

import java.nio.charset.StandardCharsets;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class SlackUtils {

    private static final String TAG = "SLACK-DEBUG";
    private static final MediaType JSON = MediaType.get("application/json; charset=utf-8");

    /**
     * Public API to send a message to Slack asynchronously
     */
    public static void sendMessageToSlack(Context context, String message) {
        Log.d(TAG, "Preparing to send Slack message...");

        try {
            new SendSlackMessageTask(context).execute(message);
        } catch (Exception e) {
            Log.e(TAG, "Error starting Slack AsyncTask", e);
        }
    }

    /**
     * AsyncTask to send Slack messages in the background
     */
    private static class SendSlackMessageTask extends AsyncTask<String, Void, Void> {

        private final Context context;

        SendSlackMessageTask(Context context) {
            this.context = context;
        }

        @Override
        protected Void doInBackground(String... messages) {
            Log.d(TAG, "AsyncTask started... retrieving webhook");

            try {
                String webhookUrl = ConfigLoader.getSlackWebhookUrl(context);
                if (webhookUrl == null || webhookUrl.isEmpty()) {
                    Log.e(TAG, "Webhook URL is null or empty, aborting Slack message.");
                    return null;
                }

                Log.d(TAG, "Sending Slack message: " + messages[0]);
                sendToSlack(webhookUrl, messages[0]);

            } catch (Exception e) {
                Log.e(TAG, "Error sending Slack message", e);
            }

            return null;
        }

        /**
         * Internal method to send message to Slack via HTTP POST
         */
        private void sendToSlack(String url, String message) {
            try {
                OkHttpClient client = new OkHttpClient();
                String jsonPayload = "{\"text\": \"" + message + "\"}";

                RequestBody body = RequestBody.create(JSON, jsonPayload);
                Request request = new Request.Builder()
                        .url(url)
                        .post(body)
                        .build();

                try (Response response = client.newCall(request).execute()) {
                    if (response.isSuccessful()) {
                        Log.d(TAG, "Slack message sent successfully.");
                    } else {
                        Log.e(TAG, "Slack request failed: " + response.toString());
                    }
                }

            } catch (Exception e) {
                Log.e(TAG, "Exception while sending Slack message", e);
            }
        }
    }
}

package org.curiouslearning.container.utilities;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class SlackUtils {
    private static final String SLACK_WEBHOOK_URL = "https://hooks.slack.com/services/your-webhook-url";  // Replace with your Webhook URL
    private static final MediaType JSON = MediaType.get("application/json; charset=utf-8");

    // Method to send message to Slack
    public static void sendMessageToSlack(String message) {
        OkHttpClient client = new OkHttpClient();
        String jsonPayload = "{\"text\": \"" + message + "\"}";

        RequestBody body = RequestBody.create(JSON, jsonPayload);
        Request request = new Request.Builder()
                .url(SLACK_WEBHOOK_URL)
                .post(body)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new RuntimeException("Slack message failed: " + response);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

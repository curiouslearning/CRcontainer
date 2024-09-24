package org.curiouslearning.container.utilities;
import android.os.AsyncTask;

import io.github.cdimascio.dotenv.Dotenv;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class SlackUtils {
//    private static final String SLACK_WEBHOOK_URL = "";  // Replace with your Webhook URL

    private static final MediaType JSON = MediaType.get("application/json; charset=utf-8");

    // Method to send message to Slack
    public static void sendMessageToSlack(String message) {
        new SendSlackMessageTask().execute(message);
    }

    // AsyncTask to send Slack message in the background
    private static class SendSlackMessageTask extends AsyncTask<String, Void, Void> {
        @Override
        protected Void doInBackground(String... messages) {
            Dotenv dotenv = Dotenv.configure()
                    .directory("/assets")
                    .filename("env") // instead of '.env', use 'env'
                    .load();
            String webHookUrl = dotenv.get("SLACK_WEBHOOK_URL");
            System.out.println("slackURLTesting : "+webHookUrl);


            OkHttpClient client = new OkHttpClient();
            String jsonPayload = "{\"text\": \"" + messages[0] + "\"}";

            RequestBody body = RequestBody.create(JSON, jsonPayload);
            Request request = new Request.Builder()
                    .url(webHookUrl)
                    .post(body)
                    .build();

            try (Response response = client.newCall(request).execute()) {
                if (!response.isSuccessful()) {
                    throw new RuntimeException("Slack message failed: " + response);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
            return null;
        }
    }
}

package org.curiouslearning.container.utilities;

import android.util.Log;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

/**
 * Utility for sending messages to a Slack webhook.
 *
 * <p>Uses a shared {@link OkHttpClient} instance (thread-safe, expensive to create)
 * and dispatches each send on a background thread.
 */
public class SlackUtils {

    private static final String TAG = "SlackUtils";
    private static final MediaType JSON = MediaType.get("application/json; charset=utf-8");

    /** Shared OkHttpClient — reuse connection pool across all Slack calls. */
    private static final OkHttpClient HTTP_CLIENT = new OkHttpClient();

    /**
     * Sends a plain-text message to Slack asynchronously.
     * Does nothing if the webhook URL cannot be resolved.
     */
    public static void sendMessageToSlack(android.content.Context context, String message) {
        Log.d(TAG, "Preparing to send Slack message...");

        // Run network I/O on a background thread (replaces deprecated AsyncTask)
        new Thread(() -> {
            try {
                String webhookUrl = ConfigLoader.getSlackWebhookUrl(context);
                if (webhookUrl == null || webhookUrl.isEmpty()) {
                    Log.e(TAG, "Webhook URL is null or empty, aborting Slack message.");
                    return;
                }
                sendToSlack(webhookUrl, message);
            } catch (Exception e) {
                Log.e(TAG, "Error sending Slack message", e);
            }
        }, "slack-sender").start();
    }

    /** Internal method: sends message to Slack via HTTP POST. */
    private static void sendToSlack(String url, String message) {
        try {
            // Simple JSON escaping for the message text
            String safeMessage = message.replace("\\", "\\\\").replace("\"", "\\\"");
            String jsonPayload = "{\"text\": \"" + safeMessage + "\"}";

            RequestBody body = RequestBody.create(JSON, jsonPayload);
            Request request = new Request.Builder()
                    .url(url)
                    .post(body)
                    .build();

            try (Response response = HTTP_CLIENT.newCall(request).execute()) {
                if (response.isSuccessful()) {
                    Log.d(TAG, "Slack message sent successfully.");
                } else {
                    Log.e(TAG, "Slack request failed: " + response.code() + " " + response.message());
                }
            }
        } catch (Exception e) {
            Log.e(TAG, "Exception while sending Slack message", e);
        }
    }
}

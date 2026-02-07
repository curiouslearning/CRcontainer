package org.curiouslearning.container.core.subapp.handler;

import android.util.Log;

import com.google.firebase.firestore.FirebaseFirestore;

import org.curiouslearning.container.core.subapp.payload.AppEventPayload;

import java.util.HashMap;
import java.util.Map;

public class DefaultAppEventPayloadHandler
        implements AppEventPayloadHandler {

    private static final String TAG = "AppEventHandler";

    @Override
    public void handle(AppEventPayload payload) {

        Log.d(TAG,
                "Accepted payload | app_id=" + payload.app_id +
                        " collection=" + payload.collection +
                        " timestamp=" + payload.timestamp
        );

        // Only store assessment payloads
        if (isAssessmentPayload(payload)) {
            storeAssessmentPayload(payload);
        } else {
            Log.d(TAG, "Not an assessment payload — skipping Firestore store");
        }
    }

    private boolean isAssessmentPayload(AppEventPayload payload) {
        // Use your app_id or a field in payload.data to detect assessment types
        String appId = payload.app_id != null ? payload.app_id : "";
        return appId.equals("letter_sounds") || appId.equals("sight_words");
    }

    private void storeAssessmentPayload(AppEventPayload payload) {
        FirebaseFirestore db = FirebaseFirestore.getInstance();

        // Build the Firestore record
        Map<String, Object> record = new HashMap<>();

        record.put("cr_user_id", payload.cr_user_id);
        record.put("app_id", payload.app_id);
        record.put("collection", payload.collection);
        record.put("timestamp", payload.timestamp);

        // Store entire data blob (sub-app-specific fields)
        record.put("data", payload.data);

        // Store options if present (like add/replace instructions)
        if (payload.options != null) {
            record.put("options", payload.options);
        }

        // Write to Firestore (local first, syncs when online)
        db.collection("summary_data")
                .add(record)
                .addOnSuccessListener(ref ->
                        Log.d(TAG, "Stored assessment payload in Firestore: " + ref.getId()))
                .addOnFailureListener(e ->
                        Log.e(TAG, "Failed to store assessment payload", e));
    }

}

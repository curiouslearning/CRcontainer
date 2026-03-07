package org.curiouslearning.container.core.subapp.handler;

import android.util.Log;

import androidx.annotation.NonNull;

import com.google.firebase.firestore.FirebaseFirestore;

import org.curiouslearning.container.core.subapp.payload.AppEventPayload;

import java.util.HashMap;
import java.util.Map;

public class DefaultAppEventPayloadHandler
        implements AppEventPayloadHandler {

    private static final String TAG = "AppEventHandler";

    @Override
    public void handle(AppEventPayload payload) {

        Log.d(
                TAG,
                "Accepted payload | app_id=" + payload.app_id +
                        " collection=" + payload.collection +
                        " timestamp=" + payload.timestamp
        );

        storePayload(payload);
    }

    private void storePayload(@NonNull AppEventPayload payload) {

        FirebaseFirestore db = FirebaseFirestore.getInstance();

        // Validate required fields
        if (payload.cr_user_id == null || payload.cr_user_id.trim().isEmpty() ||
                payload.app_id == null || payload.app_id.trim().isEmpty() ||
                payload.collection == null || payload.collection.trim().isEmpty() ||
                payload.timestamp == null) {

            Log.e(TAG, "Invalid payload — missing or blank required fields");
            return;
        }

        Log.d(TAG, "Saving payload to Firestore collection=" + payload.collection);

        Map<String, Object> record = new HashMap<>();

        record.put("cr_user_id", payload.cr_user_id);
        record.put("app_id", payload.app_id);
        record.put("collection", payload.collection);
        record.put("timestamp", payload.timestamp);

        Map<String, Object> data =
                payload.data instanceof Map
                        ? new HashMap<>((Map<String, Object>) payload.data)
                        : new HashMap<>();

        record.put("data", data);

        db.collection(payload.collection)
                .add(record)
                .addOnSuccessListener(ref ->
                        Log.d(TAG, "Payload stored successfully docId=" + ref.getId()))
                .addOnFailureListener(e ->
                        Log.e(TAG, "Failed to store payload", e));
    }
}
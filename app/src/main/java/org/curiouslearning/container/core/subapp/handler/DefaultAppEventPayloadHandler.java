package org.curiouslearning.container.core.subapp.handler;

import android.util.Log;

import androidx.annotation.NonNull;

import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.SetOptions;

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

        storeSubAppPayload(payload);
    }

    private void storeSubAppPayload(@NonNull AppEventPayload payload) {
        FirebaseFirestore db = FirebaseFirestore.getInstance();

        // Reject null OR blank
        if (payload.cr_user_id == null || payload.cr_user_id.trim().isEmpty() ||
                payload.app_id == null || payload.app_id.trim().isEmpty() ||
                payload.collection == null || payload.collection.trim().isEmpty() ||
                payload.timestamp == null) {

            Log.e(TAG, "Invalid payload — missing or blank required fields");
            return;
        }

        // ✅ Deterministic document ID (prevents duplicates)
        String docId = payload.cr_user_id + "_" + payload.app_id;

        DocumentReference documentRef =
                db.collection(payload.collection).document(docId);

        Log.d(TAG, "Upserting summary record");

        documentRef.get()
                .addOnSuccessListener(existingDoc -> {

                    Map<String, Object> record = new HashMap<>();
                    record.put("cr_user_id", payload.cr_user_id);
                    record.put("app_id", payload.app_id);
                    record.put("collection", payload.collection);
                    record.put("timestamp", payload.timestamp);

                    Map<String, Object> mergedData =
                            mergeData(existingDoc, payload);

                    record.put("data", mergedData);

                    // ✅ Idempotent write
                    documentRef.set(record, SetOptions.merge())
                            .addOnSuccessListener(aVoid ->
                                    Log.d(TAG, "Summary payload upserted in Firestore"))
                            .addOnFailureListener(e ->
                                    Log.e(TAG, "Failed to upsert summary payload", e));
                })
                .addOnFailureListener(e ->
                        Log.e(TAG, "Failed fetching existing summary data", e));
    }

    private Map<String, Object> mergeData(
            @NonNull DocumentSnapshot existingDoc,
            @NonNull AppEventPayload payload
    ) {
        Map<String, Object> merged = new HashMap<>();

        // Seed from existing nested data
        if (existingDoc.exists()) {
            Object existingDataObj = existingDoc.get("data");
            if (existingDataObj instanceof Map) {
                merged.putAll((Map<String, Object>) existingDataObj);
            }
        }

        if (!(payload.data instanceof Map)) {
            return merged;
        }

        Map<String, Object> newData = (Map<String, Object>) payload.data;
        Map<String, String> optionsMap =
                payload.options instanceof Map
                        ? (Map<String, String>) payload.options
                        : new HashMap<>();

        for (Map.Entry<String, Object> entry : newData.entrySet()) {
            String field = entry.getKey();
            Object newValue = entry.getValue();

            String operation = optionsMap.getOrDefault(field, "replace");
            Object existingValue = merged.get(field);

            if ("add".equals(operation)
                    && existingValue instanceof Number
                    && newValue instanceof Number) {

                double sum =
                        ((Number) existingValue).doubleValue()
                                + ((Number) newValue).doubleValue();

                merged.put(field, sum);
            } else {
                merged.put(field, newValue);
            }
        }

        return merged;
    }
}
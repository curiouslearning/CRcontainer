package org.curiouslearning.container.core.subapp.handler;

import android.util.Log;

import androidx.annotation.NonNull;

import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.Query;
import com.google.firebase.firestore.DocumentSnapshot;

import org.curiouslearning.container.core.subapp.payload.AppEventPayload;

import java.util.HashMap;
import java.util.List;
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

        // ✅ Updated validation: reject null OR blank
        if (payload.cr_user_id == null || payload.cr_user_id.trim().isEmpty() ||
                payload.app_id == null || payload.app_id.trim().isEmpty() ||
                payload.collection == null || payload.collection.trim().isEmpty() ||
                payload.timestamp == null) {

            Log.e(TAG, "Invalid payload — missing or blank required fields");
            return;
        }

        Log.d(TAG, "Checking for existing summary record");

        Query query = db.collection(payload.collection)
                .whereEqualTo("cr_user_id", payload.cr_user_id)
                .whereEqualTo("app_id", payload.app_id)
                .limit(1);

        query.get()
                .addOnSuccessListener(querySnapshot -> {

                    Map<String, Object> record = new HashMap<>();
                    record.put("cr_user_id", payload.cr_user_id);
                    record.put("app_id", payload.app_id);
                    record.put("collection", payload.collection);
                    record.put("timestamp", payload.timestamp);

                    Map<String, Object> mergedData;

                    if (!querySnapshot.isEmpty()) {
                        // Update existing
                        List<DocumentSnapshot> documents = querySnapshot.getDocuments();
                        DocumentSnapshot existingDoc = documents.get(0);
                        String docId = existingDoc.getId();

                        mergedData = mergeData(existingDoc, payload);
                        record.put("data", mergedData);

                        db.collection(payload.collection)
                                .document(docId)
                                .set(record)
                                .addOnSuccessListener(aVoid ->
                                        Log.d(TAG, "Updated summary payload in Firestore"))
                                .addOnFailureListener(e ->
                                        Log.e(TAG, "Failed to update summary payload", e));

                    } else {
                        // Create new
                        mergedData = payload.data instanceof Map
                                ? new HashMap<>((Map<String, Object>) payload.data)
                                : new HashMap<>();

                        record.put("data", mergedData);

                        db.collection(payload.collection)
                                .add(record)
                                .addOnSuccessListener(ref ->
                                        Log.d(TAG, "Created new summary payload docId=" + ref.getId()))
                                .addOnFailureListener(e ->
                                        Log.e(TAG, "Failed to create summary payload", e));
                    }
                })
                .addOnFailureListener(e ->
                        Log.e(TAG, "Failed querying summary data", e));
    }

    private Map<String, Object> mergeData(
            @NonNull DocumentSnapshot existingDoc,
            @NonNull AppEventPayload payload
    ) {
        Map<String, Object> merged = new HashMap<>();

        Object existingDataObj = existingDoc.get("data");
        if (existingDataObj instanceof Map) {
            merged.putAll((Map<String, Object>) existingDataObj);
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
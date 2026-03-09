package org.curiouslearning.container.core.subapp.handler;

import android.util.Log;

import androidx.annotation.NonNull;

import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.Query;

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

        storePayload(payload);
    }

    private void storePayload(@NonNull AppEventPayload payload) {

        FirebaseFirestore db = FirebaseFirestore.getInstance();

        if (payload.cr_user_id == null || payload.cr_user_id.trim().isEmpty() ||
                payload.app_id == null || payload.app_id.trim().isEmpty() ||
                payload.collection == null || payload.collection.trim().isEmpty() ||
                payload.timestamp == null) {

            Log.e(TAG, "Invalid payload — missing or blank required fields");
            return;
        }

        if ("user_session_data".equals(payload.collection)) {

            Log.d(TAG, "Handling user_session_data payload");
            storeUserSessionPayload(db, payload);

        } else {

            Log.d(TAG, "Handling summary_data payload");
            storeSummaryPayload(db, payload);
        }
    }

    /**
     * NEW IMPLEMENTATION
     * Direct save for user_session_data
     */
    private void storeUserSessionPayload(
            FirebaseFirestore db,
            AppEventPayload payload
    ) {

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
                        Log.d(TAG, "User session saved docId=" + ref.getId()))
                .addOnFailureListener(e ->
                        Log.e(TAG, "Failed to save user session payload", e));
    }

    /**
     * OLD IMPLEMENTATION
     * Used for summary_data
     */
    private void storeSummaryPayload(
            FirebaseFirestore db,
            AppEventPayload payload
    ) {

        Log.d(TAG, "Querying summary record (offline-first)");

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

                    if (!querySnapshot.isEmpty()) {

                        List<DocumentSnapshot> documents = querySnapshot.getDocuments();
                        DocumentSnapshot existingDoc = documents.get(0);

                        Map<String, Object> mergedData =
                                mergeData(existingDoc, payload);

                        record.put("data", mergedData);

                        db.collection(payload.collection)
                                .document(existingDoc.getId())
                                .set(record)
                                .addOnSuccessListener(aVoid ->
                                        Log.d(TAG, "Updated summary payload"))
                                .addOnFailureListener(e ->
                                        Log.e(TAG, "Failed to update summary payload", e));

                    } else {

                        Log.d(TAG, "No existing summary record — creating new");
                        createNewSummaryDoc(db, payload, record);
                    }
                })
                .addOnFailureListener(e -> {

                    Log.w(TAG, "Query failed — creating new summary record", e);

                    Map<String, Object> record = new HashMap<>();
                    record.put("cr_user_id", payload.cr_user_id);
                    record.put("app_id", payload.app_id);
                    record.put("collection", payload.collection);
                    record.put("timestamp", payload.timestamp);

                    createNewSummaryDoc(db, payload, record);
                });
    }

    private void createNewSummaryDoc(
            FirebaseFirestore db,
            AppEventPayload payload,
            Map<String, Object> record
    ) {

        Map<String, Object> newData =
                payload.data instanceof Map
                        ? new HashMap<>((Map<String, Object>) payload.data)
                        : new HashMap<>();

        record.put("data", newData);

        db.collection(payload.collection)
                .add(record)
                .addOnSuccessListener(ref ->
                        Log.d(TAG, "Created new summary payload docId=" + ref.getId()))
                .addOnFailureListener(e ->
                        Log.e(TAG, "Failed to create summary payload", e));
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

        Map<String, Object> options = new HashMap<>();

        if (payload.options instanceof Map) {
            Map<?, ?> raw = (Map<?, ?>) payload.options;
            for (Map.Entry<?, ?> entry : raw.entrySet()) {
                options.put(String.valueOf(entry.getKey()), entry.getValue());
            }
        }

        for (Map.Entry<String, Object> entry : newData.entrySet()) {

            String key = entry.getKey();
            Object newValue = entry.getValue();
            Object existingValue = merged.get(key);

            String operation =
                    options.get(key) instanceof String
                            ? (String) options.get(key)
                            : "replace";

            if ("add".equals(operation)
                    && newValue instanceof Number
                    && existingValue instanceof Number) {

                Number n1 = (Number) existingValue;
                Number n2 = (Number) newValue;

                boolean n1Integral =
                        n1 instanceof Long ||
                                n1 instanceof Integer ||
                                n1 instanceof Short ||
                                n1 instanceof Byte;

                boolean n2Integral =
                        n2 instanceof Long ||
                                n2 instanceof Integer ||
                                n2 instanceof Short ||
                                n2 instanceof Byte;

                if (n1Integral && n2Integral) {
                    long result = n1.longValue() + n2.longValue();
                    merged.put(key, result);
                } else {
                    double result = n1.doubleValue() + n2.doubleValue();
                    merged.put(key, result);
                }

            } else {
                merged.put(key, newValue);
            }
        }

        return merged;
    }
}
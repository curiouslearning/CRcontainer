package org.curiouslearning.container.core.subapp.handler;

import android.util.Log;

import androidx.annotation.NonNull;

import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.Query;
import com.google.firebase.firestore.QuerySnapshot;
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

        // Minimal required fields
        if (payload.cr_user_id == null ||
                payload.app_id == null ||
                payload.timestamp == null ||
                payload.collection == null) {

            Log.e(TAG, "Invalid payload — missing required fields");
            return;
        }

        // Build Firestore record
        Map<String, Object> record = new HashMap<>();
        record.put("cr_user_id", payload.cr_user_id);
        record.put("app_id", payload.app_id);
        record.put("collection", payload.collection);
        record.put("timestamp", payload.timestamp);
        record.put("data", payload.data);

        // Evaluate options (add vs replace)
        if (payload.data instanceof Map) {
            Map<String, Object> dataMap = (Map<String, Object>) payload.data;

            for (Map.Entry<String, Object> entry : dataMap.entrySet()) {
                String field = entry.getKey();
                Object newValue = entry.getValue();

                String operation = "replace"; // default

                if (payload.options instanceof Map) {
                    Map<String, String> optionsMap = (Map<String, String>) payload.options;
                    if (optionsMap.containsKey(field)) {
                        operation = optionsMap.get(field);
                    }
                }

                Object existingValue = record.get(field);

                if ("add".equals(operation)
                        && existingValue instanceof Number
                        && newValue instanceof Number) {

                    double sum =
                            ((Number) existingValue).doubleValue()
                                    + ((Number) newValue).doubleValue();

                    record.put(field, sum);
                } else {
                    record.put(field, newValue);
                }
            }
        }

        Log.d(TAG, "Checking for existing summary record");

        // Query by user + app (single summary record model)
        Query query = db.collection(payload.collection)
                .whereEqualTo("cr_user_id", payload.cr_user_id)
                .whereEqualTo("app_id", payload.app_id)
                .limit(1);

        query.get()
                .addOnSuccessListener(querySnapshot -> {
                    if (!querySnapshot.isEmpty()) {
                        // Update existing document
                        List<DocumentSnapshot> documents = querySnapshot.getDocuments();
                        DocumentSnapshot existingDoc = documents.get(0);
                        String docId = existingDoc.getId();

                        Log.d(TAG, "Existing summary record found. Updating docId=" + docId);

                        db.collection(payload.collection)
                                .document(docId)
                                .set(record)
                                .addOnSuccessListener(aVoid ->
                                        Log.d(TAG, "Updated summary payload in Firestore"))
                                .addOnFailureListener(e ->
                                        Log.e(TAG, "Failed to update summary payload", e));

                    } else {
                        //Create new document (Firestore generates ID)
                        Log.d(TAG, "No existing summary record found. Creating new document");

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
}
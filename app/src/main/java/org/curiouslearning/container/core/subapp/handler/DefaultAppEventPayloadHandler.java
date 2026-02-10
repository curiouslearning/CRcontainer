package org.curiouslearning.container.core.subapp.handler;

import android.util.Log;

import androidx.annotation.NonNull;

import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.DocumentReference;

import org.curiouslearning.container.core.subapp.payload.AppEventPayload;

import java.util.HashMap;
import java.util.Map;

public class DefaultAppEventPayloadHandler
        implements AppEventPayloadHandler {

    private static final String TAG = "AppEventHandler";
    private static final String COLLECTION_SUMMARY_DATA = "posts";

    @Override
    public void handle(AppEventPayload payload) {

        Log.d(
                TAG,
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
        String appId = payload.app_id != null ? payload.app_id : "";
        return appId.equals("letter_sounds") || appId.equals("sight_words");
    }

    private void storeAssessmentPayload(@NonNull AppEventPayload payload) {
        FirebaseFirestore db = FirebaseFirestore.getInstance();

        if (payload.cr_user_id == null ||
                payload.app_id == null ||
                payload.timestamp == null) {

            Log.e(TAG, "Invalid assessment payload — missing required fields");
            return;
        }

        // 🔑 Deterministic, event-level document ID
        String documentId =
                payload.cr_user_id + "_" +
                        payload.app_id + "_" +
                        payload.timestamp;

        DocumentReference docRef = db
                .collection(COLLECTION_SUMMARY_DATA)
                .document(documentId);

        // Build Firestore record
        Map<String, Object> record = new HashMap<>();
        record.put("cr_user_id", payload.cr_user_id);
        record.put("app_id", payload.app_id);
        record.put("collection", payload.collection);
        record.put("timestamp", payload.timestamp);
        record.put("data", payload.data);

        if (payload.options != null) {
            record.put("options", payload.options);
        }

        Log.d(TAG, "Checking for existing summary record | docId=" + documentId);

        // Idempotent write
        docRef.get()
                .addOnSuccessListener(snapshot -> {
                    if (snapshot.exists()) {
                        Log.d(
                                TAG,
                                "Duplicate assessment ignored | docId=" + documentId
                        );
                        return;
                    }

                    docRef.set(record)
                            .addOnSuccessListener(aVoid ->
                                    Log.d(
                                            TAG,
                                            "Assessment stored successfully | docId=" + documentId
                                    ))
                            .addOnFailureListener(e ->
                                    Log.e(
                                            TAG,
                                            "Failed to store assessment payload",
                                            e
                                    ));
                })
                .addOnFailureListener(e ->
                        Log.e(TAG, "Failed to check existing summary record", e));
    }
}

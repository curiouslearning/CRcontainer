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
    private static final String COLLECTION_SUMMARY_DATA = "posts";
    
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
        String appId = payload.app_id != null ? payload.app_id : "";
        return appId.equals("letter_sounds") || appId.equals("sight_words");
    }

    private void storeAssessmentPayload(@NonNull AppEventPayload payload) {
        FirebaseFirestore db = FirebaseFirestore.getInstance();

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

        Log.d(TAG, "Checking for existing summary record");

        // 🔑 Query first (deterministic lookup)
        Query query = db.collection(COLLECTION_SUMMARY_DATA)
                .whereEqualTo("cr_user_id", payload.cr_user_id)
                .whereEqualTo("app_id", payload.app_id)
                .limit(1);

        query.get()
                .addOnSuccessListener(querySnapshot -> {
                    if (!querySnapshot.isEmpty()) {
                        // Existing document found → reuse ID
                        List<DocumentSnapshot> documents = querySnapshot.getDocuments();
                        DocumentSnapshot existingDoc = documents.get(0);
                        String docId = existingDoc.getId();

                        Log.d(TAG, "Existing summary record found. Updating docId=" + docId);

                        db.collection(COLLECTION_SUMMARY_DATA)
                                .document(docId)
                                .set(record)
                                .addOnSuccessListener(aVoid ->
                                        Log.d(TAG, "Updated assessment payload in Firestore"))
                                .addOnFailureListener(e ->
                                        Log.e(TAG, "Failed to update assessment payload", e));

                    } else {
                        // No document → create new one
                        Log.d(TAG, "No existing summary record found. Creating new document");

                        db.collection(COLLECTION_SUMMARY_DATA)
                                .add(record)
                                .addOnSuccessListener(ref ->
                                        Log.d(TAG, "Created new assessment payload docId=" + ref.getId()))
                                .addOnFailureListener(e ->
                                        Log.e(TAG, "Failed to create assessment payload", e));
                    }
                })
                .addOnFailureListener(e ->
                        Log.e(TAG, "Failed querying summary_data", e));
    }
}

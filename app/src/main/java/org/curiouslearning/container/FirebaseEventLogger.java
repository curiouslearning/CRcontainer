package org.curiouslearning.container;

import android.util.Log;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.FirebaseFirestoreSettings;
import java.util.Map;

public class FirebaseEventLogger {

    private static final String TAG = "FIREBASE_POC";
    private final FirebaseFirestore db;

    public FirebaseEventLogger() {
        db = FirebaseFirestore.getInstance();

        FirebaseFirestoreSettings settings = new FirebaseFirestoreSettings.Builder()
                .setPersistenceEnabled(true)   // enables offline cache
                .build();

        db.setFirestoreSettings(settings);
    }

    public void logEvent(Map<String, Object> eventData) {
        db.collection("summary_data_poc")         // append-only
                .add(eventData)
                .addOnSuccessListener(doc -> Log.d(TAG, "Event logged. Doc ID = " + doc.getId()))
                .addOnFailureListener(e -> Log.e(TAG, "Event logging failed", e));
    }

    public void goOffline() {
        db.disableNetwork().addOnSuccessListener(v ->
                Log.d(TAG, "Firestore → OFFLINE MODE"));
    }

    public void goOnline() {
        db.enableNetwork().addOnSuccessListener(v ->
                Log.d(TAG, "Firestore → ONLINE (Sync queued events)"));
    }
}

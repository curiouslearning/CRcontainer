package org.curiouslearning.container.core.subapp.handler;

import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.firestore.CollectionReference;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.Query;
import com.google.firebase.firestore.QuerySnapshot;

import org.curiouslearning.container.core.subapp.payload.AppEventPayload;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.annotation.Config;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(RobolectricTestRunner.class)
@Config(sdk = {28})
public class DefaultAppEventPayloadHandlerTest {

    private DefaultAppEventPayloadHandler handler;

    private MockedStatic<FirebaseFirestore> mockedFirestoreStatic;

    @Mock
    private FirebaseFirestore mockFirestore;

    @Mock(answer = org.mockito.Answers.RETURNS_DEEP_STUBS)
    private CollectionReference mockCollection;

    @Mock(answer = org.mockito.Answers.RETURNS_DEEP_STUBS)
    private DocumentReference mockDocumentReference;

    @Before
    public void setup() {
        MockitoAnnotations.openMocks(this);
        handler = new DefaultAppEventPayloadHandler();

        mockedFirestoreStatic = Mockito.mockStatic(FirebaseFirestore.class);
        mockedFirestoreStatic.when(FirebaseFirestore::getInstance).thenReturn(mockFirestore);

        when(mockFirestore.collection(anyString())).thenReturn(mockCollection);
    }

    @After
    public void teardown() {
        mockedFirestoreStatic.close();
    }

    @Test
    public void testInvalidPayload() {
        AppEventPayload payload = new AppEventPayload();
        // Missing required fields
        handler.handle(payload);
        
        // No interaction with Firestore should happen
        Mockito.verifyNoInteractions(mockFirestore);
    }

    @Test
    public void testUnsupportedCollection() {
        AppEventPayload payload = createValidPayload();
        payload.collection = "unknown_collection";

        handler.handle(payload);

        // No interactions
        Mockito.verifyNoInteractions(mockFirestore);
    }

    @Test
    public void testUserSessionData() {
        AppEventPayload payload = createValidPayload();
        payload.collection = "user_sessions_data";

        Task<DocumentReference> mockTask = mockTask(mockDocumentReference, null);
        when(mockCollection.add(any())).thenReturn(mockTask);

        handler.handle(payload);

        ArgumentCaptor<Map<String, Object>> captor = ArgumentCaptor.forClass(Map.class);
        verify(mockCollection).add(captor.capture());

        Map<String, Object> savedRecord = captor.getValue();
        assertEquals("user1", savedRecord.get("cr_user_id"));
        assertEquals("app1", savedRecord.get("app_id"));
        assertEquals("user_sessions_data", savedRecord.get("collection"));
        assertTrue(savedRecord.containsKey("data"));
    }

    @Test
    public void testSummaryData_NewRecord() {
        AppEventPayload payload = createValidPayload();
        payload.collection = "summary_data";

        // Mock Query Snapshot (Empty)
        QuerySnapshot mockQuerySnapshot = mock(QuerySnapshot.class);
        when(mockQuerySnapshot.isEmpty()).thenReturn(true);
        Task<QuerySnapshot> mockGetTask = mockTask(mockQuerySnapshot, null);
        when(mockCollection.whereEqualTo(anyString(), any()).whereEqualTo(anyString(), any()).limit(1L).get()).thenReturn(mockGetTask);

        // Mock Add
        Task<DocumentReference> mockAddTask = mockTask(mockDocumentReference, null);
        when(mockCollection.add(any())).thenReturn(mockAddTask);

        handler.handle(payload);

        ArgumentCaptor<Map<String, Object>> captor = ArgumentCaptor.forClass(Map.class);
        verify(mockCollection).add(captor.capture());

        Map<String, Object> savedRecord = captor.getValue();
        assertEquals("user1", savedRecord.get("cr_user_id"));
    }

    @Test
    public void testSummaryData_ExistingRecord_Merge() {
        AppEventPayload payload = createValidPayload();
        payload.collection = "summary_data";
        
        // Data with operation add
        Map<String, Object> data = new HashMap<>();
        data.put("score", 10);
        data.put("name", "new_name");
        payload.data = data;
        
        Map<String, String> options = new HashMap<>();
        options.put("score", "add"); // Add operation
        payload.options = options;

        // Mock Document Snapshot (Existing)
        QuerySnapshot mockQuerySnapshot = mock(QuerySnapshot.class);
        when(mockQuerySnapshot.isEmpty()).thenReturn(false);
        DocumentSnapshot mockDoc = mock(DocumentSnapshot.class);
        when(mockDoc.getId()).thenReturn("doc123");
        
        Map<String, Object> existingData = new HashMap<>();
        existingData.put("score", 20); // Existing score
        existingData.put("name", "old_name");
        when(mockDoc.get("data")).thenReturn(existingData);

        when(mockQuerySnapshot.getDocuments()).thenReturn(Collections.singletonList(mockDoc));
        
        Task<QuerySnapshot> mockGetTask = mockTask(mockQuerySnapshot, null);
        when(mockCollection.whereEqualTo(anyString(), any()).whereEqualTo(anyString(), any()).limit(1L).get()).thenReturn(mockGetTask);

        // Mock Update
        when(mockCollection.document("doc123")).thenReturn(mockDocumentReference);
        Task<Void> mockSetTask = mockTask(null, null);
        when(mockDocumentReference.set(any())).thenReturn(mockSetTask);

        handler.handle(payload);

        ArgumentCaptor<Map<String, Object>> captor = ArgumentCaptor.forClass(Map.class);
        verify(mockDocumentReference).set(captor.capture());

        Map<String, Object> savedRecord = captor.getValue();
        Map<String, Object> savedData = (Map<String, Object>) savedRecord.get("data");
        
        // Verify score was added (10 + 20 = 30)
        assertEquals(30L, savedData.get("score"));
        // Verify name was replaced (new_name replaces old_name)
        assertEquals("new_name", savedData.get("name"));
    }
    
    @Test
    public void testSummaryData_QueryFailed() {
        AppEventPayload payload = createValidPayload();
        payload.collection = "summary_data";

        // Mock Query Snapshot (Failure)
        Task<QuerySnapshot> mockGetTask = mockTask(null, new Exception("Network error"));
        when(mockCollection.whereEqualTo(anyString(), any()).whereEqualTo(anyString(), any()).limit(1L).get()).thenReturn(mockGetTask);

        // Mock Add (Fallback)
        Task<DocumentReference> mockAddTask = mockTask(mockDocumentReference, null);
        when(mockCollection.add(any())).thenReturn(mockAddTask);

        handler.handle(payload);

        verify(mockCollection).add(any());
    }

    private AppEventPayload createValidPayload() {
        AppEventPayload payload = new AppEventPayload();
        payload.cr_user_id = "user1";
        payload.app_id = "app1";
        payload.timestamp = "time";
        payload.data = new HashMap<>();
        return payload;
    }

    @SuppressWarnings("unchecked")
    private <T> Task<T> mockTask(T result, Exception e) {
        Task<T> mockTask = mock(Task.class);
        when(mockTask.addOnSuccessListener(any())).thenAnswer(invocation -> {
            if (result != null) {
                OnSuccessListener<T> listener = invocation.getArgument(0);
                listener.onSuccess(result);
            } else if (e == null) {
                // For Task<Void>
                OnSuccessListener<T> listener = invocation.getArgument(0);
                listener.onSuccess(null);
            }
            return mockTask;
        });
        when(mockTask.addOnFailureListener(any())).thenAnswer(invocation -> {
            if (e != null) {
                OnFailureListener listener = invocation.getArgument(0);
                listener.onFailure(e);
            }
            return mockTask;
        });
        return mockTask;
    }
}

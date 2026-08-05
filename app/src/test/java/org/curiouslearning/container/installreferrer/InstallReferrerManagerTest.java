package org.curiouslearning.container.installreferrer;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.RemoteException;

import androidx.test.core.app.ApplicationProvider;

import com.android.installreferrer.api.InstallReferrerClient;
import com.android.installreferrer.api.InstallReferrerStateListener;
import com.android.installreferrer.api.ReferrerDetails;

import org.curiouslearning.container.firebase.AnalyticsUtils;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.stubbing.Answer;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.annotation.Config;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(RobolectricTestRunner.class)
@Config(sdk = {28})
public class InstallReferrerManagerTest {

    @Mock
    private InstallReferrerManager.ReferrerCallback mockCallback;

    @Mock
    private InstallReferrerClient mockClient;

    @Mock
    private InstallReferrerClient.Builder mockBuilder;
    
    @Mock
    private SharedPreferences mockPrefs;
    
    @Mock
    private SharedPreferences.Editor mockEditor;

    private Context context;
    private MockedStatic<InstallReferrerClient> mockedStaticClient;
    private MockedStatic<AnalyticsUtils> mockedAnalyticsUtils;

    @Before
    public void setup() {
        MockitoAnnotations.openMocks(this);
        context = Mockito.spy(ApplicationProvider.getApplicationContext());

        // Mock SharedPreferences
        when(context.getSharedPreferences(anyString(), anyInt())).thenReturn(mockPrefs);
        when(mockPrefs.edit()).thenReturn(mockEditor);
        when(mockEditor.putInt(anyString(), anyInt())).thenReturn(mockEditor);
        when(mockEditor.putString(anyString(), anyString())).thenReturn(mockEditor);

        mockedAnalyticsUtils = Mockito.mockStatic(AnalyticsUtils.class);

        // Mock InstallReferrerClient builder pattern
        mockedStaticClient = Mockito.mockStatic(InstallReferrerClient.class);
        mockedStaticClient.when(() -> InstallReferrerClient.newBuilder(any(Context.class))).thenReturn(mockBuilder);
        when(mockBuilder.build()).thenReturn(mockClient);
    }

    @After
    public void teardown() {
        mockedStaticClient.close();
        mockedAnalyticsUtils.close();
    }

    @Test
    public void testCheckPlayStoreAvailability_StartsConnection() {
        InstallReferrerManager manager = new InstallReferrerManager(context, mockCallback);
        
        manager.checkPlayStoreAvailability();
        
        verify(mockCallback).onReferrerStatusUpdate(any(InstallReferrerManager.ReferrerStatus.class));
        verify(mockClient).startConnection(any(InstallReferrerStateListener.class));
    }

    @Test
    public void testStartConnection_OK_Success() throws RemoteException {
        InstallReferrerManager manager = new InstallReferrerManager(context, mockCallback);
        
        ReferrerDetails mockDetails = mock(ReferrerDetails.class);
        when(mockDetails.getInstallReferrer()).thenReturn("utm_source=google-play&utm_medium=organic");
        when(mockClient.getInstallReferrer()).thenReturn(mockDetails);

        doAnswer(new Answer<Void>() {
            @Override
            public Void answer(InvocationOnMock invocation) throws Throwable {
                InstallReferrerStateListener listener = invocation.getArgument(0);
                listener.onInstallReferrerSetupFinished(InstallReferrerClient.InstallReferrerResponse.OK);
                return null;
            }
        }).when(mockClient).startConnection(any(InstallReferrerStateListener.class));

        manager.checkPlayStoreAvailability();

        verify(mockClient).getInstallReferrer();
        verify(mockClient).endConnection();
        verify(mockCallback).onReferrerReceived(anyString(), anyString());
    }

    @Test
    public void testStartConnection_FeatureNotSupported() {
        InstallReferrerManager manager = new InstallReferrerManager(context, mockCallback);
        
        doAnswer(new Answer<Void>() {
            @Override
            public Void answer(InvocationOnMock invocation) throws Throwable {
                InstallReferrerStateListener listener = invocation.getArgument(0);
                listener.onInstallReferrerSetupFinished(InstallReferrerClient.InstallReferrerResponse.FEATURE_NOT_SUPPORTED);
                return null;
            }
        }).when(mockClient).startConnection(any(InstallReferrerStateListener.class));

        manager.checkPlayStoreAvailability();

        verify(mockCallback).onReferrerReceived("", "");
    }
}

package org.curiouslearning.container.util;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.Assert.*;
import static org.mockito.Mockito.*;

public class ConnectionUtilsTest {

    @Mock
    private Context mockContext;
    @Mock
    private ConnectivityManager mockConnectivityManager;
    @Mock
    private NetworkInfo mockNetworkInfo;

    private ConnectionUtils connectionUtils;

    @Before
    public void setup() {
        MockitoAnnotations.openMocks(this);
        connectionUtils = ConnectionUtils.getInstance();
        when(mockContext.getSystemService(Context.CONNECTIVITY_SERVICE)).thenReturn(mockConnectivityManager);
        when(mockConnectivityManager.getActiveNetworkInfo()).thenReturn(mockNetworkInfo);
    }

    @Test
    public void testGetInstance() {
        ConnectionUtils instance1 = ConnectionUtils.getInstance();
        ConnectionUtils instance2 = ConnectionUtils.getInstance();
        assertNotNull(instance1);
        assertSame(instance1, instance2);
    }

    @Test
    public void testIsInternetConnected_Wifi() {
        when(mockNetworkInfo.isConnected()).thenReturn(true);
        when(mockNetworkInfo.getType()).thenReturn(ConnectivityManager.TYPE_WIFI);
        
        assertTrue(connectionUtils.isInternetConnected(mockContext));
    }

    @Test
    public void testIsInternetConnected_Mobile() {
        when(mockNetworkInfo.isConnected()).thenReturn(true);
        when(mockNetworkInfo.getType()).thenReturn(ConnectivityManager.TYPE_MOBILE);
        
        assertTrue(connectionUtils.isInternetConnected(mockContext));
    }

    @Test
    public void testIsInternetConnected_NotConnected() {
        when(mockNetworkInfo.isConnected()).thenReturn(false);
        
        assertFalse(connectionUtils.isInternetConnected(mockContext));
    }

    @Test
    public void testIsInternetConnected_NoNetworkInfo() {
        when(mockConnectivityManager.getActiveNetworkInfo()).thenReturn(null);
        
        assertFalse(connectionUtils.isInternetConnected(mockContext));
    }
}

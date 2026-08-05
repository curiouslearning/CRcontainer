package org.curiouslearning.container.security;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.annotation.Config;

import javax.crypto.SecretKey;

import static org.junit.Assert.*;

@RunWith(RobolectricTestRunner.class)
@Config(sdk = {28})
@org.junit.Ignore("KeyStore requires complex BouncyCastle mocking on Robolectric")
public class KeyStoreManagerTest {

    @Test
    public void testGetOrCreateKey() {
        SecretKey key1 = KeyStoreManager.getOrCreateKey();
        assertNotNull("Key should be generated and returned", key1);
        
        SecretKey key2 = KeyStoreManager.getOrCreateKey();
        assertNotNull("Key should be retrieved from Keystore", key2);
        
        assertEquals("Should retrieve the same key if it exists", key1.getAlgorithm(), key2.getAlgorithm());
        // Since it's from Keystore, direct byte comparison of encoded form might be null, but we can check it's returned
    }
}

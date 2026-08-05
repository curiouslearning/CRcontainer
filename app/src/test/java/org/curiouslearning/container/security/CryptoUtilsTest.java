package org.curiouslearning.container.security;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.annotation.Config;
import static org.junit.Assert.*;

@RunWith(RobolectricTestRunner.class)
@Config(sdk = {28})
public class CryptoUtilsTest {

    @Test
    public void testHexToBytes() {
        assertNull(CryptoUtils.hexToBytes(null));
        
        byte[] bytes = CryptoUtils.hexToBytes("48656C6C6F"); // "Hello" in hex
        assertNotNull(bytes);
        assertEquals(5, bytes.length);
        assertArrayEquals(new byte[]{0x48, 0x65, 0x6c, 0x6c, 0x6f}, bytes);
    }

    @Test
    public void testGenerateRandomIV() {
        byte[] iv = CryptoUtils.generateRandomIV();
        assertNotNull(iv);
        assertEquals(16, iv.length);
    }

    @Test
    public void testEncryptionDecryption() throws Exception {
        byte[] key = new byte[16]; // 16 bytes for AES-128
        for(int i=0; i<16; i++) key[i] = (byte) i;
        
        byte[] iv = CryptoUtils.generateRandomIV();
        String originalData = "SuperSecretData";
        
        byte[] encrypted = CryptoUtils.encryptAesCbc(key, iv, originalData.getBytes());
        assertNotNull(encrypted);
        assertNotEquals(originalData, new String(encrypted));
        
        String decrypted = CryptoUtils.decryptAesCbc(key, iv, encrypted);
        assertEquals(originalData, decrypted);
    }
}

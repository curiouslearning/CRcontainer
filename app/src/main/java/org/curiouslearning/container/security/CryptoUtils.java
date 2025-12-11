package org.curiouslearning.container.utilities;

import android.util.Log;

import java.security.SecureRandom;
import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

public class CryptoUtils {

    private static final String TAG = "CRYPTO-DEBUG";

    // Convert HEX string → byte array
    public static byte[] hexToBytes(String hex) {
        if (hex == null) return null;

        int len = hex.length();
        byte[] result = new byte[len / 2];

        for (int i = 0; i < len; i += 2) {
            result[i / 2] = (byte) ((Character.digit(hex.charAt(i), 16) << 4)
                    + Character.digit(hex.charAt(i + 1), 16));
        }
        return result;
    }

    // AES-CBC ENCRYPTION — used only at build-time, not inside Android app
    public static byte[] encryptAesCbc(byte[] key, byte[] iv, byte[] data) throws Exception {
        Log.d(TAG, "Encrypting using AES/CBC...");
        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");

        SecretKeySpec keySpec = new SecretKeySpec(key, "AES");
        IvParameterSpec ivSpec = new IvParameterSpec(iv);

        cipher.init(Cipher.ENCRYPT_MODE, keySpec, ivSpec);
        byte[] encrypted = cipher.doFinal(data);

        Log.d(TAG, "AES encryption complete. Size = " + encrypted.length);
        return encrypted;
    }

    // AES-CBC DECRYPTION — used in the Android app
    public static String decryptAesCbc(byte[] key, byte[] iv, byte[] encrypted) throws Exception {
        Log.d(TAG, "Decrypting using AES/CBC...");

        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");

        SecretKeySpec keySpec = new SecretKeySpec(key, "AES");
        IvParameterSpec ivSpec = new IvParameterSpec(iv);

        cipher.init(Cipher.DECRYPT_MODE, keySpec, ivSpec);
        byte[] decrypted = cipher.doFinal(encrypted);

        String output = new String(decrypted);
        Log.d(TAG, "AES decryption successful. Output length = " + output.length());

        return output;
    }

    // Generates 16-byte IV (same size required for AES-CBC)
    public static byte[] generateRandomIV() {
        SecureRandom random = new SecureRandom();
        byte[] iv = new byte[16];
        random.nextBytes(iv);
        Log.d(TAG, "Generated new IV");
        return iv;
    }
}

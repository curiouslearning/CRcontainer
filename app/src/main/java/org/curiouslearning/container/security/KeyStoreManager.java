package org.curiouslearning.container.utilities;

import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyProperties;
import android.util.Log;

import java.security.KeyStore;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;

public class KeyStoreManager {

    private static final String TAG = "KEYSTORE-DEBUG";
    private static final String KEY_ALIAS = "slack_keystore_wrapper";

    public static SecretKey getOrCreateKey() {
        try {
            KeyStore keyStore = KeyStore.getInstance("AndroidKeyStore");
            keyStore.load(null);

            if (keyStore.containsAlias(KEY_ALIAS)) {
                Log.d(TAG, "Key found in Android Keystore.");
                return (SecretKey) keyStore.getKey(KEY_ALIAS, null);
            }

            Log.d(TAG, "Key not found. Creating new key...");
            KeyGenParameterSpec keySpec = new KeyGenParameterSpec.Builder(
                    KEY_ALIAS,
                    KeyProperties.PURPOSE_ENCRYPT | KeyProperties.PURPOSE_DECRYPT
            )
                    .setBlockModes(KeyProperties.BLOCK_MODE_CBC)
                    .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_PKCS7)
                    .setRandomizedEncryptionRequired(true)
                    .build();

            KeyGenerator keyGenerator = KeyGenerator.getInstance(
                    KeyProperties.KEY_ALGORITHM_AES,
                    "AndroidKeyStore"
            );

            keyGenerator.init(keySpec);
            SecretKey secretKey = keyGenerator.generateKey();

            Log.d(TAG, "New AES key created in Android Keystore.");

            return secretKey;

        } catch (Exception e) {
            Log.e(TAG, "Error retrieving keystore key", e);
            return null;
        }
    }
}

package org.curiouslearning.container.util;

import org.junit.Test;
import static org.junit.Assert.*;

public class CacheUtilsTest {

    @Test
    public void testSetManifestVersionNumber() {
        String original = CacheUtils.manifestVersionNumber;
        CacheUtils.setManifestVersionNumber("2.5");
        assertEquals("2.5", CacheUtils.manifestVersionNumber);
        CacheUtils.manifestVersionNumber = original; // Reset for other tests
    }
}

package org.curiouslearning.container.core.usage;

/**
 * Identifies one uninterrupted run of the device, so a record written before a reboot can be recognised
 * as no longer interpretable. Injected, because a test cannot reboot a device.
 */
public interface BootTokenProvider {

    /** A value that is stable within a boot and differs across one. */
    long currentToken();

    /** Whether {@code storedToken} came from the current boot, allowing for clock correction. */
    boolean matches(long storedToken);
}

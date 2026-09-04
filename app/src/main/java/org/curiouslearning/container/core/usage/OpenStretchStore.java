package org.curiouslearning.container.core.usage;

import androidx.annotation.NonNull;

import java.util.List;

/**
 * Where an {@link OpenStretchRecord} lives while the process that owns it may die at any moment.
 * A seam, so everything above it stays unit-testable without a device.
 */
public interface OpenStretchStore {

    /** Every record currently held. Unparseable ones are omitted, never raised. */
    @NonNull
    List<OpenStretchRecord> loadAll();

    /** Writes {@code record} under its own {@link OpenStretchRecord#key()}, replacing any previous one. */
    void save(@NonNull OpenStretchRecord record);

    /** Removes the record stored under {@code key}. A no-op when nothing is stored there. */
    void delete(@NonNull String key);
}

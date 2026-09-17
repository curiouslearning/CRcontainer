package org.curiouslearning.container.core.usage.flush;

import androidx.annotation.NonNull;

import java.util.List;

/**
 * Where a {@link PendingUsageWrite} lives while the process that owns it may die at any moment.
 * A seam, so everything above it stays unit-testable without a device. Mirrors {@code OpenStretchStore},
 * deliberately not shared with it — see research.md D3–D4 for why the two record types must not be conflated.
 */
public interface PendingUsageWriteStore {

    /** Every record currently held. Unparseable ones are omitted, never raised. */
    @NonNull
    List<PendingUsageWrite> loadAll();

    /** Writes {@code write} under its own {@link PendingUsageWrite#key()}, replacing any previous one. */
    void save(@NonNull PendingUsageWrite write);

    /** Removes the record stored under {@code key}. A no-op when nothing is stored there. */
    void delete(@NonNull String key);
}

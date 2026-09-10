package org.curiouslearning.container.core.usage.flush;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * The production {@link PendingUsageWriteStore}: one preference entry per record, keyed by
 * {@link PendingUsageWrite#key()}, each a single delimited value so it lands atomically in one apply().
 * Its own prefs file, independent of MR-182's {@code sub_app_usage_open_stretches} (research.md D3).
 */
public final class SharedPreferencesPendingUsageWriteStore implements PendingUsageWriteStore {

    private static final String TAG = "PendingUsageWriteStore";

    private static final String PREFS_NAME = "sub_app_usage_pending_writes";

    /**
     * ASCII unit separator, numeric rather than a literal control character so it survives an encoding
     * change. Chosen because it cannot occur in an app_id, a language name, or a cr_user_id.
     */
    private static final char UNIT_SEPARATOR = 0x1F;

    private static final String FIELD_SEPARATOR = String.valueOf(UNIT_SEPARATOR);

    /** Bumped whenever the field list changes; an unrecognised version is discarded, never misparsed. */
    private static final String VERSION = "v1";

    private static final int FIELD_COUNT = 6;

    private final SharedPreferences prefs;

    public SharedPreferencesPendingUsageWriteStore(@NonNull Context context) {
        this.prefs = context.getApplicationContext().getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
    }

    @NonNull
    @Override
    public List<PendingUsageWrite> loadAll() {

        List<PendingUsageWrite> records = new ArrayList<>();

        for (Map.Entry<String, ?> entry : prefs.getAll().entrySet()) {

            Object value = entry.getValue();

            if (!(value instanceof String)) {
                Log.w(TAG, "Discarding non-string entry for " + entry.getKey());
                continue;
            }

            PendingUsageWrite record = deserialize((String) value);

            if (record == null) {
                // Dropped rather than raised: a malformed value must not stop a container launch, and must
                // not stop the readable records from being recovered.
                Log.w(TAG, "Discarding unreadable record for " + entry.getKey());
                continue;
            }

            records.add(record);
        }

        return records;
    }

    @Override
    public void save(@NonNull PendingUsageWrite write) {
        prefs.edit().putString(write.key(), serialize(write)).apply();
    }

    @Override
    public void delete(@NonNull String key) {
        prefs.edit().remove(key).apply();
    }

    private static String serialize(PendingUsageWrite write) {
        return VERSION
                + FIELD_SEPARATOR + write.appKey
                + FIELD_SEPARATOR + write.language
                + FIELD_SEPARATOR + write.crUserId
                + FIELD_SEPARATOR + write.cappedSeconds
                + FIELD_SEPARATOR + write.rawSeconds;
    }

    @Nullable
    private static PendingUsageWrite deserialize(String value) {

        // -1 keeps trailing empty fields, so a blank cr_user_id fails identity validation rather than
        // silently shortening the array and looking like a version mismatch.
        String[] parts = value.split(FIELD_SEPARATOR, -1);

        if (parts.length != FIELD_COUNT || !VERSION.equals(parts[0])) {
            return null;
        }

        try {
            PendingUsageWrite record = new PendingUsageWrite(
                    parts[1],
                    parts[2],
                    parts[3],
                    Long.parseLong(parts[4]),
                    Long.parseLong(parts[5]));

            return record.hasUsableIdentity() ? record : null;

        } catch (NumberFormatException e) {
            return null;
        }
    }
}

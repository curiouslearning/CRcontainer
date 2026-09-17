package org.curiouslearning.container.core.usage.flush;

import static androidx.test.core.app.ApplicationProvider.getApplicationContext;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import android.content.Context;
import android.content.SharedPreferences;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.annotation.Config;

import java.util.List;

/** Robolectric — exercises the real {@link SharedPreferences} round-trip and its tolerance for corruption. */
@RunWith(RobolectricTestRunner.class)
@Config(sdk = 28)
public class SharedPreferencesPendingUsageWriteStoreTest {

    private static final String PREFS_NAME = "sub_app_usage_pending_writes";

    private static final String APP = "feed-the-monster";
    private static final String LANG = "English";
    private static final String CR_USER_ID = "child-123";

    private Context context;
    private SharedPreferencesPendingUsageWriteStore store;

    @Before
    public void setup() {
        context = getApplicationContext();
        store = new SharedPreferencesPendingUsageWriteStore(context);
    }

    @Test
    public void savedRecordRoundTripsUnchanged() {
        PendingUsageWrite write = new PendingUsageWrite(APP, LANG, CR_USER_ID, 42L, 50L);

        store.save(write);

        List<PendingUsageWrite> loaded = store.loadAll();
        assertEquals(1, loaded.size());

        PendingUsageWrite roundTripped = loaded.get(0);
        assertEquals(APP, roundTripped.appKey);
        assertEquals(LANG, roundTripped.language);
        assertEquals(CR_USER_ID, roundTripped.crUserId);
        assertEquals(42L, roundTripped.cappedSeconds);
        assertEquals(50L, roundTripped.rawSeconds);
    }

    @Test
    public void savingUnderTheSameKeyReplacesThePreviousRecord() {
        store.save(new PendingUsageWrite(APP, LANG, CR_USER_ID, 10L, 10L));
        store.save(new PendingUsageWrite(APP, LANG, CR_USER_ID, 30L, 35L));

        List<PendingUsageWrite> loaded = store.loadAll();
        assertEquals(1, loaded.size());
        assertEquals(30L, loaded.get(0).cappedSeconds);
        assertEquals(35L, loaded.get(0).rawSeconds);
    }

    @Test
    public void malformedStoredValueIsSkippedNotThrown() {
        rawPrefs().edit().putString("some::key", "not-a-valid-record").apply();

        assertTrue(store.loadAll().isEmpty());
    }

    @Test
    public void unrecognisedVersionIsSkipped() {
        String separator = String.valueOf((char) 0x1F);
        String wellFormedButWrongVersion = "v99" + separator + APP + separator + LANG + separator
                + CR_USER_ID + separator + "10" + separator + "10";

        rawPrefs().edit().putString("some::key", wellFormedButWrongVersion).apply();

        assertTrue(store.loadAll().isEmpty());
    }

    @Test
    public void nonStringEntryIsSkipped() {
        rawPrefs().edit().putLong("some::key", 123L).apply();

        assertTrue(store.loadAll().isEmpty());
    }

    @Test
    public void deleteIsANoOpForAnAbsentKey() {
        store.delete("never-saved::english");

        assertTrue(store.loadAll().isEmpty());
    }

    @Test
    public void deleteRemovesOnlyTheNamedRecord() {
        store.save(new PendingUsageWrite(APP, LANG, CR_USER_ID, 5L, 5L));
        store.save(new PendingUsageWrite("assessment", LANG, CR_USER_ID, 7L, 7L));

        store.delete(PendingUsageWrite.key(APP, LANG));

        List<PendingUsageWrite> remaining = store.loadAll();
        assertEquals(1, remaining.size());
        assertEquals("assessment", remaining.get(0).appKey);
    }

    private SharedPreferences rawPrefs() {
        return context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
    }
}

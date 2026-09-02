package org.curiouslearning.container.core.subapp.handler;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static androidx.test.core.app.ApplicationProvider.getApplicationContext;

import android.util.Log;

import org.curiouslearning.container.core.context.AppContext;
import org.curiouslearning.container.core.context.AppContextKey;
import org.curiouslearning.container.core.subapp.payload.AppEventPayload;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.annotation.Config;
import org.robolectric.shadows.ShadowLog;

/**
 * MR-217: DefaultAppEventPayloadHandler.resolveAppId's fixed fallback order — current_app_id,
 * then the payload's own app_id, then the literal "unknown" — with a warning logged (tag
 * "AppEventHandler") whenever current_app_id itself was unavailable. Nothing else is ever
 * consulted ("do not guess").
 *
 * Constructed with a blank cr_user_id so the constructor's Firestore prefetch (prefetchSummaryDocs)
 * short-circuits and no Firebase mocking is needed — resolveAppId itself never touches Firestore.
 */
@RunWith(RobolectricTestRunner.class)
@Config(sdk = 28)
public class DefaultAppEventPayloadHandlerTest {

    private static final String TAG = "AppEventHandler";

    private DefaultAppEventPayloadHandler handler;

    @Before
    public void setup() {
        AppContext.getInstance().init(getApplicationContext());
        AppContext.getInstance().remove(AppContextKey.CURRENT_APP_ID);
        // Blank cr_user_id makes the constructor's own prefetchSummaryDocs() short-circuit with
        // its own "cr_user_id is blank" warning (same TAG) instead of touching Firestore — reset
        // the log AFTER construction so that unrelated warning doesn't contaminate each test's
        // warningLogged() check below.
        handler = new DefaultAppEventPayloadHandler("");
        ShadowLog.reset();
    }

    private AppEventPayload payloadWithAppId(String appId) {
        AppEventPayload payload = new AppEventPayload();
        payload.app_id = appId;
        return payload;
    }

    @Test
    public void currentAppIdPresent_isUsed_evenWhenPayloadDiffers() {
        AppContext.getInstance().set(AppContextKey.CURRENT_APP_ID, "manifest-app-1");

        String resolved = handler.resolveAppId(payloadWithAppId("payload-app-2"));

        assertEquals("manifest-app-1", resolved);
        assertFalse("no warning expected when current_app_id is available", warningLogged());
    }

    @Test
    public void currentAppIdMissing_fallsBackToPayloadAppId_andLogsWarning() {
        String resolved = handler.resolveAppId(payloadWithAppId("payload-app-2"));

        assertEquals("payload-app-2", resolved);
        assertTrue("expected a warning when falling back to payload.app_id", warningLogged());
    }

    @Test
    public void bothMissing_defaultsToUnknown_andLogsWarning() {
        String resolved = handler.resolveAppId(payloadWithAppId(null));

        assertEquals("unknown", resolved);
        assertTrue("expected a warning when falling back to \"unknown\"", warningLogged());
    }

    @Test
    public void bothBlank_defaultsToUnknown_andLogsWarning() {
        String resolved = handler.resolveAppId(payloadWithAppId("   "));

        assertEquals("unknown", resolved);
        assertTrue(warningLogged());
    }

    private boolean warningLogged() {
        for (ShadowLog.LogItem item : ShadowLog.getLogs()) {
            if (item.type == Log.WARN && TAG.equals(item.tag)) {
                return true;
            }
        }
        return false;
    }
}

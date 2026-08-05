package org.curiouslearning.container.deeplink;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class StudyEnrollmentStateTest {

    @Test
    public void testDismissLanguagePopup() {
        StudyEnrollmentState state = StudyEnrollmentState.dismissLanguagePopup();
        assertEquals(StudyEnrollmentState.Type.DISMISS_LANGUAGE_POPUP, state.type);
        assertNull(state.language);
    }

    @Test
    public void testLoadApps() {
        StudyEnrollmentState state = StudyEnrollmentState.loadApps("English");
        assertEquals(StudyEnrollmentState.Type.LOAD_APPS, state.type);
        assertEquals("English", state.language);
    }

    @Test
    public void testShowLanguagePopup() {
        StudyEnrollmentState state = StudyEnrollmentState.showLanguagePopup();
        assertEquals(StudyEnrollmentState.Type.SHOW_LANGUAGE_POPUP, state.type);
        assertNull(state.language);
    }

    @Test
    public void testUpdateDebugOverlay() {
        StudyEnrollmentState state = StudyEnrollmentState.updateDebugOverlay();
        assertEquals(StudyEnrollmentState.Type.UPDATE_DEBUG_OVERLAY, state.type);
        assertNull(state.language);
    }

    @Test
    public void testCachePseudoId() {
        StudyEnrollmentState state = StudyEnrollmentState.cachePseudoId();
        assertEquals(StudyEnrollmentState.Type.CACHE_PSEUDO_ID, state.type);
        assertNull(state.language);
    }
}

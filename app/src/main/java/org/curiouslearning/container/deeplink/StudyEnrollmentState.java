package org.curiouslearning.container.deeplink;

/**
 * Represents a one-shot enrollment event emitted by {@link StudyEnrollmentManager} via LiveData.
 *
 * <p>Uses a plain Java 8 enum + class pattern (no sealed classes or records) to stay
 * compatible with the project's {@code sourceCompatibility JavaVersion.VERSION_1_8} constraint.
 *
 * <p>Observers should switch on {@link #type} and read {@link #language} only when
 * the type is {@link Type#LOAD_APPS}.
 */
public class StudyEnrollmentState {

    public enum Type {
        DISMISS_LANGUAGE_POPUP,
        LOAD_APPS,
        SHOW_LANGUAGE_POPUP,
        UPDATE_DEBUG_OVERLAY,
        CACHE_PSEUDO_ID
    }

    public final Type type;

    /** Non-null only when {@link #type} is {@link Type#LOAD_APPS}. */
    public final String language;

    private StudyEnrollmentState(Type type, String language) {
        this.type = type;
        this.language = language;
    }

    // --- Static factory methods ---

    public static StudyEnrollmentState dismissLanguagePopup() {
        return new StudyEnrollmentState(Type.DISMISS_LANGUAGE_POPUP, null);
    }

    public static StudyEnrollmentState loadApps(String language) {
        return new StudyEnrollmentState(Type.LOAD_APPS, language);
    }

    public static StudyEnrollmentState showLanguagePopup() {
        return new StudyEnrollmentState(Type.SHOW_LANGUAGE_POPUP, null);
    }

    public static StudyEnrollmentState updateDebugOverlay() {
        return new StudyEnrollmentState(Type.UPDATE_DEBUG_OVERLAY, null);
    }

    public static StudyEnrollmentState cachePseudoId() {
        return new StudyEnrollmentState(Type.CACHE_PSEUDO_ID, null);
    }
}

package org.curiouslearning.container.util;

/**
 * Central registry of all SharedPreferences key strings.
 *
 * <p>Use these constants wherever a SharedPreferences key is read or written.
 * Never use raw string literals for preference keys in other files.
 *
 * <h3>SharedPreferences files</h3>
 * <ul>
 *   <li>{@code PREFS_NAME} — general app state ({@code "AppPreferences"})</li>
 *   <li>{@code UTM_PREFS_NAME} — attribution / UTM parameters ({@code "InstallReferrerPrefs"})</li>
 * </ul>
 */
public final class PreferenceKeys {

    // -------------------------------------------------------------------------
    // SharedPreferences file names
    // -------------------------------------------------------------------------

    /** General app SharedPreferences name. */
    public static final String PREFS_NAME = "AppPreferences";

    /** UTM / install-referrer SharedPreferences name. */
    public static final String UTM_PREFS_NAME = "InstallReferrerPrefs";

    // -------------------------------------------------------------------------
    // General app preferences  (PREFS_NAME file)
    // -------------------------------------------------------------------------

    /** The generated anonymous user identifier (cr_user_id). */
    public static final String KEY_PSEUDO_ID = "pseudoId";

    /** The language code chosen by the user (e.g. "en", "fr - FR"). */
    public static final String KEY_SELECTED_LANGUAGE = "selectedLanguage";

    /** The version string of the last successfully downloaded manifest. */
    public static final String KEY_MANIFEST_VERSION = "manifestVersion";

    /** Whether a given app (keyed by appId) has been cached locally.
     *  Usage: {@code prefs.getBoolean(String.valueOf(appId), false)} */
    public static final String KEY_APP_CACHED_PREFIX = ""; // dynamic — appId is the key itself

    /** The deferred deep-link URL received from the install referrer. */
    public static final String KEY_DEFERRED_DEEPLINK = "deferred_deeplink";

    /** Whether the FTM (Feed the Monster) app has been downloaded. */
    public static final String KEY_FTM_DOWNLOADED = "ftm_downloaded";

    /** JSON map of per-language monster phase state. */
    public static final String KEY_FTM_MONSTER_PHASES_MAP = "ftm_monster_phases_map";

    /** Legacy single-language monster phase (kept for backward compatibility). */
    public static final String KEY_FTM_MONSTER_PHASE = "ftm_monster_phase";

    // -------------------------------------------------------------------------
    // UTM / attribution preferences  (UTM_PREFS_NAME file)
    // -------------------------------------------------------------------------

    /** Traffic source (e.g. "google", "facebook"). */
    public static final String KEY_UTM_SOURCE = "source";

    /** Campaign identifier. */
    public static final String KEY_UTM_CAMPAIGN_ID = "campaign_id";

    /** UTM content parameter. */
    public static final String KEY_UTM_CONTENT = "utm_content";

    /** Raw install referrer string from the Play Store. */
    public static final String KEY_RAW_REFERRER_URL = "raw_referrer_url";

    // -------------------------------------------------------------------------

    private PreferenceKeys() {
        // Utility class — no instances
    }
}

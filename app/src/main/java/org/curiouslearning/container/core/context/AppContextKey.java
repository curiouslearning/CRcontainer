package org.curiouslearning.container.core.context;

/**
 * Central registry of keys usable with {@link AppContext}. Add new keys
 * here rather than introducing separate constants elsewhere.
 */
public enum AppContextKey {
    LANGUAGE,
    CAMPAIGN_ID,
    SOURCE,
    HOSTNAME
}

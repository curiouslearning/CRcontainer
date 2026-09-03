package org.curiouslearning.container.core.usage;

import java.util.Locale;

/**
 * Resolves the {@code app_id} for container-measured usage: the manifest extra when present (MR-217),
 * else a host/path allowlist, else {@code null} so the caller skips tracking rather than guessing.
 */
public final class SubAppIdResolver {

    /** Intent extra carrying the manifest-declared {@code app_id}. Populated by MR-217. */
    public static final String EXTRA_APP_ID = "app_id";

    private static final String FTM_APP_ID = "feed-the-monster";
    private static final String ASSESSMENT_APP_ID = "assessment";

    /** Both spellings: the curiouscontent.org hosts run them together, the S3 paths hyphenate. */
    private static final String[] FTM_TOKENS = {"feedthemonster", "feed-the-monster"};

    private static final String[] ASSESSMENT_TOKENS = {"assessment"};

    private SubAppIdResolver() {
    }

    /**
     * Returns the {@code app_id} to stamp, or {@code null} when the sub-app cannot be identified.
     * The value must equal what the sub-app reports, or the write forks its summary document.
     */
    public static String resolve(String manifestAppId, String identityUrl) {

        if (manifestAppId != null && !manifestAppId.trim().isEmpty()) {
            return manifestAppId.trim();
        }

        if (identityUrl == null || identityUrl.trim().isEmpty()) {
            return null;
        }

        String hostAndPath = hostAndPathOf(identityUrl);

        if (containsAny(hostAndPath, FTM_TOKENS)) {
            return FTM_APP_ID;
        }
        if (containsAny(hostAndPath, ASSESSMENT_TOKENS)) {
            return ASSESSMENT_APP_ID;
        }

        return null;
    }

    private static boolean containsAny(String haystack, String[] tokens) {
        for (String token : tokens) {
            if (haystack.contains(token)) {
                return true;
            }
        }
        return false;
    }

    /** Host and path, lowercased, with the scheme, credentials, query and fragment removed. */
    private static String hostAndPathOf(String url) {

        String remainder = url.trim().toLowerCase(Locale.ROOT);

        int schemeEnd = remainder.indexOf("://");
        if (schemeEnd >= 0) {
            remainder = remainder.substring(schemeEnd + 3);
        }

        // Query and fragment are dropped: a ?book= slug must not decide identity.
        int queryStart = remainder.length();
        for (int i = 0; i < remainder.length(); i++) {
            char c = remainder.charAt(i);
            if (c == '?' || c == '#') {
                queryStart = i;
                break;
            }
        }
        remainder = remainder.substring(0, queryStart);

        int authorityEnd = remainder.indexOf('/');
        String authority = (authorityEnd >= 0) ? remainder.substring(0, authorityEnd) : remainder;
        String path = (authorityEnd >= 0) ? remainder.substring(authorityEnd) : "";

        int credentialsEnd = authority.lastIndexOf('@');
        if (credentialsEnd >= 0) {
            authority = authority.substring(credentialsEnd + 1);
        }

        int portStart = authority.indexOf(':');
        if (portStart >= 0) {
            authority = authority.substring(0, portStart);
        }

        return authority + path;
    }
}

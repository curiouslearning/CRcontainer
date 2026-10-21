package org.curiouslearning.container.data.local;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import org.curiouslearning.container.data.model.WebApp;
import org.curiouslearning.container.data.model.WebAppResponse;
import org.junit.Test;

import java.util.List;

/**
 * Pure-JVM tests for {@link LocalManifestLoader#parse(String)}: the packaged manifest of an
 * offline standalone build must be accepted when complete and rejected with a precise reason
 * otherwise, since a bad manifest can only be fixed by shipping a new APK.
 */
public class LocalManifestLoaderTest {

    private static final String VALID = "{\n"
            + "  \"version\": \"mwf-test-1\",\n"
            + "  \"web_apps\": [\n"
            + "    {\"appId\": 28, \"app_id\": \"feed-the-monster\",\n"
            + "     \"appIconUrl\": \"file:///android_asset/images/ftm_french.png\",\n"
            + "     \"title\": \"Feed The Monster French\",\n"
            + "     \"appUrl\": \"https://feedthemonster.curiouscontent.org/?cr_lang=french\",\n"
            + "     \"language\": \"Français\", \"languageInEnglishName\": \"French\"},\n"
            + "    {\"appId\": 0,\n"
            + "     \"appIconUrl\": \"file:///android_asset/images/ftm_english.png\",\n"
            + "     \"title\": \"Feed The Monster US English\",\n"
            + "     \"appUrl\": \"https://feedthemonster.curiouscontent.org/?cr_lang=english\",\n"
            + "     \"language\": \"English - US\", \"languageInEnglishName\": \"English\"}\n"
            + "  ]\n"
            + "}";

    @Test
    public void parse_acceptsCompleteManifest_andMapsEveryField() {
        WebAppResponse response = LocalManifestLoader.parse(VALID);

        assertEquals("mwf-test-1", response.getVersion());
        List<WebApp> apps = response.getWebApps();
        assertEquals(2, apps.size());

        WebApp french = apps.get(0);
        assertEquals(28, french.getAppId());
        assertEquals("feed-the-monster", french.getApp_id());
        assertEquals("French", french.getLanguageInEnglishName());
        assertEquals("Français", french.getLanguage());
        assertTrue(french.getAppUrl().contains("cr_lang=french"));

        // app_id is optional in the schema (older manifests predate it); absence must not reject.
        assertEquals(null, apps.get(1).getApp_id());
    }

    @Test
    public void parse_rejectsEmptyOrNull() {
        assertRejected(null, "empty");
        assertRejected("   ", "empty");
    }

    @Test
    public void parse_rejectsMalformedJson() {
        assertRejected("{\"version\": \"1\", \"web_apps\": [", "valid JSON");
    }

    @Test
    public void parse_rejectsNonObjectRoot() {
        assertRejected("[{\"appId\": 1}]", "object");
    }

    @Test
    public void parse_rejectsMissingVersion() {
        assertRejected("{\"web_apps\": [{\"appId\": 1}]}", "version");
    }

    @Test
    public void parse_rejectsMissingOrEmptyWebApps() {
        assertRejected("{\"version\": \"1\"}", "web_apps");
        assertRejected("{\"version\": \"1\", \"web_apps\": []}", "empty");
        assertRejected("{\"version\": \"1\", \"web_apps\": {}}", "web_apps");
    }

    @Test
    public void parse_rejectsEntryMissingRequiredField_namingIndexAndField() {
        String missingLanguageName = "{\"version\": \"1\", \"web_apps\": ["
                + "{\"appId\": 0, \"appIconUrl\": \"x.png\", \"title\": \"T\", \"appUrl\": \"https://a/\", \"language\": \"English - US\", \"languageInEnglishName\": \"English\"},"
                + "{\"appId\": 1, \"appIconUrl\": \"x.png\", \"title\": \"T\", \"appUrl\": \"https://a/\", \"language\": \"Français\"}"
                + "]}";
        assertRejected(missingLanguageName, "web_apps[1] is missing \"languageInEnglishName\"");

        String blankUrl = "{\"version\": \"1\", \"web_apps\": ["
                + "{\"appId\": 0, \"appIconUrl\": \"x.png\", \"title\": \"T\", \"appUrl\": \"  \", \"language\": \"English - US\", \"languageInEnglishName\": \"English\"}"
                + "]}";
        assertRejected(blankUrl, "web_apps[0] is missing \"appUrl\"");
    }

    private static void assertRejected(String json, String expectedReasonFragment) {
        try {
            LocalManifestLoader.parse(json);
            fail("expected rejection containing: " + expectedReasonFragment);
        } catch (IllegalArgumentException e) {
            assertTrue("reason was: " + e.getMessage(),
                    e.getMessage().contains(expectedReasonFragment));
        }
    }
}

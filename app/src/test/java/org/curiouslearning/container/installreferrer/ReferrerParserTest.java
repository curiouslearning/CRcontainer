package org.curiouslearning.container.installreferrer;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.annotation.Config;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

@RunWith(RobolectricTestRunner.class)
@Config(sdk = {28})
public class ReferrerParserTest {

    @Test
    public void testParseEmpty() {
        ReferrerParser.ParsedReferrer result = ReferrerParser.parse("");
        assertEquals("", result.deferredLanguage);
        assertFalse(result.isInvalidReferrer);
        assertFalse(result.isOrganicInstall);
    }

    @Test
    public void testParseOrganic() {
        String url = "utm_source=google-play&utm_medium=organic";
        ReferrerParser.ParsedReferrer result = ReferrerParser.parse(url);
        assertTrue(result.isOrganicInstall);
        assertFalse(result.isInvalidReferrer);
    }

    @Test
    public void testParseInvalid() {
        String url = "utm_source=(not%20set)&utm_medium=(not%20set)";
        ReferrerParser.ParsedReferrer result = ReferrerParser.parse(url);
        assertTrue(result.isInvalidReferrer);
        assertFalse(result.isOrganicInstall);
    }

    @Test
    public void testParseDeferredDeeplink() {
        String deeplink = "deferred_deeplink=curiousreader://app?language=hindi&source=fb&campaign_id=123";
        // Need to URL encode the deeplink in reality, but Uri.parse handles basic parsing
        // We will mimic the actual url encoding:
        String url = "deferred_deeplink=curiousreader%3A%2F%2Fapp%3Flanguage%3Dhindi%26source%3Dfb%26campaign_id%3D123";
        ReferrerParser.ParsedReferrer result = ReferrerParser.parse(url);
        
        assertEquals("hindi", result.deferredLanguage);
        assertEquals("fb", result.source);
        assertEquals("123", result.campaignId);
    }

    @Test
    public void testParseTopLevelSourceCampaign() {
        String url = "source=topSource&campaign_id=topCampaign";
        ReferrerParser.ParsedReferrer result = ReferrerParser.parse(url);
        
        assertEquals("topSource", result.source);
        assertEquals("topCampaign", result.campaignId);
    }

    @Test
    public void testUrlDecode() {
        String decoded = ReferrerParser.urlDecode("hello%20world");
        assertEquals("hello world", decoded);
    }
}

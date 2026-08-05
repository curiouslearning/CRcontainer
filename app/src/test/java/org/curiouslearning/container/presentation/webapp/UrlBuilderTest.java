package org.curiouslearning.container.presentation.webapp;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.annotation.Config;

import static org.junit.Assert.*;

@RunWith(RobolectricTestRunner.class)
@Config(sdk = {28})
public class UrlBuilderTest {

    @Test
    public void testBuildUrl_WithCampaignAndCrUserId() {
        String url = UrlBuilder.buildUrl("https://example.com/app", "user456", "source123", "camp123", true);
        assertTrue(url.contains("campaign_id=camp123"));
        assertTrue(url.contains("cr_user_id=user456"));
    }

    @Test
    public void testBuildUrl_GoogleForm() {
        String url = UrlBuilder.buildUrl("https://docs.google.com/forms/d/e/1FAIpQLSxyz/viewform", "user456", "source123", "camp123", true);
        assertTrue(url.contains("cr_user_id=user456"));
    }
}

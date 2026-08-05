package org.curiouslearning.container.data.model;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class WebAppTest {

    @Test
    public void testGettersAndSetters() {
        WebApp webApp = new WebApp();
        webApp.setAppId(1);
        webApp.setTitle("Title");
        webApp.setLanguage("English");
        webApp.setLanguageInEnglishName("EnglishName");
        webApp.setAppUrl("http://app.url");
        webApp.setAppIconUrl("http://app.icon.url");

        assertEquals(1, webApp.getAppId());
        assertEquals("Title", webApp.getTitle());
        assertEquals("English", webApp.getLanguage());
        assertEquals("EnglishName", webApp.getLanguageInEnglishName());
        assertEquals("http://app.url", webApp.getAppUrl());
        assertEquals("http://app.icon.url", webApp.getAppIconUrl());
    }
}

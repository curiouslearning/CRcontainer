package org.curiouslearning.container.utilities;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

import org.junit.Test;

/**
 * The path and MIME mapping that turns a request on FTM's origin into a file inside
 * {@code assets/feedthemonster/}. Pure functions; the Android {@code AssetsPathHandler} they feed
 * is exercised on-device.
 */
public class LocalWebContentTest {

    @Test
    public void rootAndDirectoryPathsResolveToIndexHtml() {
        assertEquals("feedthemonster/index.html", LocalWebContent.assetPathFor(""));
        assertEquals("feedthemonster/index.html", LocalWebContent.assetPathFor("/"));
        assertEquals("feedthemonster/lang/french/index.html", LocalWebContent.assetPathFor("lang/french/"));
    }

    @Test
    public void filePathsKeepTheirLocationUnderThePackagedDirectory() {
        assertEquals("feedthemonster/feedTheMonster.js", LocalWebContent.assetPathFor("feedTheMonster.js"));
        assertEquals("feedthemonster/feedTheMonster.js", LocalWebContent.assetPathFor("/feedTheMonster.js"));
        // The absolute audio URLs in FTM's language JSON land here.
        assertEquals("feedthemonster/lang/french/audios/a.mp3",
                LocalWebContent.assetPathFor("lang/french/audios/a.mp3"));
        assertEquals("feedthemonster/assets/rive/rive.wasm",
                LocalWebContent.assetPathFor("assets/rive/rive.wasm"));
    }

    @Test
    public void mimeTypesCoverWhatABrowserIsStrictAbout() {
        assertEquals("text/javascript", LocalWebContent.mimeTypeFor("feedthemonster/feedTheMonster.js"));
        assertEquals("application/wasm", LocalWebContent.mimeTypeFor("feedthemonster/assets/rive/rive.wasm"));
        assertEquals("application/json", LocalWebContent.mimeTypeFor("feedthemonster/lang/french/ftm_french.json"));
        assertEquals("text/html", LocalWebContent.mimeTypeFor("feedthemonster/index.html"));
        assertEquals("audio/mpeg", LocalWebContent.mimeTypeFor("x/y.MP3"));
        assertEquals("font/ttf", LocalWebContent.mimeTypeFor("assets/fonts/NotoSans-Regular.ttf"));
    }

    @Test
    public void unknownOrMissingExtensionsFallBackToTheHandlerDefault() {
        assertNull(LocalWebContent.mimeTypeFor("feedthemonster/PACKAGE_INFO"));
        assertNull(LocalWebContent.mimeTypeFor("feedthemonster/file."));
        assertNull(LocalWebContent.mimeTypeFor("feedthemonster/data.unknownext"));
    }
}

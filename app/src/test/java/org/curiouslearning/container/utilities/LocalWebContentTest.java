package org.curiouslearning.container.utilities;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

/**
 * The path and MIME mapping that turns a request on FTM's origin into a file inside
 * {@code assets/feedthemonster/}. Pure functions; the Android {@code AssetsPathHandler} they feed
 * is exercised on-device.
 */
public class LocalWebContentTest {

    private static final String FTM = LocalWebContent.FTM_ASSET_DIR;
    private static final String BOOKS = LocalWebContent.BOOKS_ASSET_DIR;

    @Test
    public void eachPackagedHostMapsToItsOwnAssetDirectory() {
        assertEquals("feedthemonster", LocalWebContent.assetDirFor("feedthemonster.curiouscontent.org"));
        assertEquals("feedthemonster", LocalWebContent.assetDirFor("FeedTheMonster.CuriousContent.org"));
        assertEquals("CRWebPlayerJs", LocalWebContent.assetDirFor("curiousreader.curiouscontent.org"));
        // Anything else stays on the network (assessment, Google Forms, dev hosts).
        assertNull(LocalWebContent.assetDirFor("assessment.curiouscontent.org"));
        assertNull(LocalWebContent.assetDirFor("feedthemonsterdev.curiouscontent.org"));
        assertNull(LocalWebContent.assetDirFor("docs.google.com"));
        assertNull(LocalWebContent.assetDirFor(null));
    }

    @Test
    public void rootAndDirectoryPathsResolveToIndexHtml() {
        assertEquals("feedthemonster/index.html", LocalWebContent.assetPathFor(FTM, ""));
        assertEquals("feedthemonster/index.html", LocalWebContent.assetPathFor(FTM, "/"));
        assertEquals("CRWebPlayerJs/index.html", LocalWebContent.assetPathFor(BOOKS, ""));
        assertEquals("feedthemonster/lang/french/index.html", LocalWebContent.assetPathFor(FTM, "lang/french/"));
    }

    @Test
    public void filePathsKeepTheirLocationUnderThePackagedDirectory() {
        assertEquals("feedthemonster/feedTheMonster.js", LocalWebContent.assetPathFor(FTM, "feedTheMonster.js"));
        assertEquals("feedthemonster/feedTheMonster.js", LocalWebContent.assetPathFor(FTM, "/feedTheMonster.js"));
        // The absolute audio URLs in FTM's language JSON land here.
        assertEquals("feedthemonster/lang/french/audios/a.mp3",
                LocalWebContent.assetPathFor(FTM, "lang/french/audios/a.mp3"));
        assertEquals("feedthemonster/assets/rive/rive.wasm",
                LocalWebContent.assetPathFor(FTM, "assets/rive/rive.wasm"));
        // The book player's relative BookContent/<book>/content/... requests land here.
        assertEquals("CRWebPlayerJs/BookContent/LetsFlyEnLv2/content/content.json",
                LocalWebContent.assetPathFor(BOOKS, "BookContent/LetsFlyEnLv2/content/content.json"));
        assertEquals("CRWebPlayerJs/dist/app.js", LocalWebContent.assetPathFor(BOOKS, "/dist/app.js"));
    }

    @Test
    public void repeatedSlashesCollapseLikeAStaticServer() {
        // content.json entries such as "/images/file.png" make the player request images//file.png.
        assertEquals("CRWebPlayerJs/BookContent/ColoursFrenchLv4/content/images/file-61fb29a5596cb.png",
                LocalWebContent.assetPathFor(BOOKS, "BookContent/ColoursFrenchLv4/content/images//file-61fb29a5596cb.png"));
        assertEquals("feedthemonster/index.html", LocalWebContent.assetPathFor(FTM, "//"));
        assertEquals("feedthemonster/lang/french/ftm_french.json",
                LocalWebContent.assetPathFor(FTM, "///lang//french/ftm_french.json"));
    }

    @Test
    public void expectedMissesAreRecognisedPerPackage() {
        assertTrue(LocalWebContent.isKnownAbsent(LocalWebContent.assetPathFor(FTM, "sw.js")));
        assertTrue(LocalWebContent.isKnownAbsent(LocalWebContent.assetPathFor(BOOKS, "/app.js")));
        assertFalse(LocalWebContent.isKnownAbsent(LocalWebContent.assetPathFor(BOOKS, "/dist/app.js")));
        assertFalse(LocalWebContent.isKnownAbsent(LocalWebContent.assetPathFor(FTM, "feedTheMonster.js")));
    }

    @Test
    public void mimeTypesCoverWhatABrowserIsStrictAbout() {
        assertEquals("text/javascript", LocalWebContent.mimeTypeFor("feedthemonster/feedTheMonster.js"));
        assertEquals("application/wasm", LocalWebContent.mimeTypeFor("feedthemonster/assets/rive/rive.wasm"));
        assertEquals("application/json", LocalWebContent.mimeTypeFor("feedthemonster/lang/french/ftm_french.json"));
        assertEquals("text/html", LocalWebContent.mimeTypeFor("feedthemonster/index.html"));
        assertEquals("audio/mpeg", LocalWebContent.mimeTypeFor("x/y.MP3"));
        assertEquals("font/ttf", LocalWebContent.mimeTypeFor("assets/fonts/NotoSans-Regular.ttf"));
        assertEquals("font/otf", LocalWebContent.mimeTypeFor("CRWebPlayerJs/dist/fonts/Quicksand_Bold.otf"));
        assertEquals("image/webp", LocalWebContent.mimeTypeFor("CRWebPlayerJs/dist/images/red_bird_256.webp"));
    }

    @Test
    public void unknownOrMissingExtensionsFallBackToTheHandlerDefault() {
        assertNull(LocalWebContent.mimeTypeFor("feedthemonster/PACKAGE_INFO"));
        assertNull(LocalWebContent.mimeTypeFor("feedthemonster/file."));
        assertNull(LocalWebContent.mimeTypeFor("feedthemonster/data.unknownext"));
    }
}

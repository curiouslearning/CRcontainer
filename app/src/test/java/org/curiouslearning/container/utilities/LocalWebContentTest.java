package org.curiouslearning.container.utilities;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * The URL → asset-path rules that let the packaged sub-apps run from the APK. Pure functions; the
 * Android {@code AssetManager} they feed is exercised on-device.
 */
public class LocalWebContentTest {

    private static final String BUILD_HOST = "mwfpde_french_english_cr-ftm-standalone.androidplatform.net";

    private static List<String> candidates(String host, String path) {
        return LocalWebContent.assetCandidatesFor(host, path);
    }

    @Test
    public void anyAndroidplatformHostIsAVirtualHost_theManifestChoosesTheName() {
        assertTrue(LocalWebContent.isVirtualHost(BUILD_HOST));
        assertTrue(LocalWebContent.isVirtualHost("nairobimomone_swahili_english_cr-ftm-standalone.androidplatform.net"));
        assertTrue(LocalWebContent.isVirtualHost("Appassets.AndroidPlatform.NET"));
        assertFalse(LocalWebContent.isVirtualHost(".androidplatform.net"));
        assertFalse(LocalWebContent.isVirtualHost("feedthemonster.curiouscontent.org"));
        assertFalse(LocalWebContent.isVirtualHost("androidplatform.net.evil.com"));
        assertFalse(LocalWebContent.isVirtualHost(null));
    }

    @Test
    public void virtualHostAssetsPathMapsStraightOntoAssets() {
        assertEquals(Collections.singletonList("feedthemonster/index.html"),
                candidates(BUILD_HOST, "/assets/feedthemonster/index.html"));
        assertEquals(Collections.singletonList("feedthemonster/index.html"),
                candidates(BUILD_HOST, "/assets/feedthemonster/"));
        assertEquals(Collections.singletonList("feedthemonster/lang/french/ftm_french.json"),
                candidates(BUILD_HOST, "/assets/feedthemonster/lang/french/ftm_french.json"));
        assertEquals(Collections.singletonList("CRWebPlayerJs/dist/app.js"),
                candidates(BUILD_HOST, "/assets/CRWebPlayerJs/dist/app.js"));
    }

    @Test
    public void rootAbsolutePathsOnAVirtualHostAreLookedUpInEachPackagedApp() {
        // The Curious Reader player assumes it lives at an origin root.
        assertEquals(Arrays.asList(
                        "CRWebPlayerJs/BookContent/LetsFlyEnLv2/content/content.json",
                        "feedthemonster/BookContent/LetsFlyEnLv2/content/content.json"),
                candidates(BUILD_HOST, "/BookContent/LetsFlyEnLv2/content/content.json"));
        assertEquals(Arrays.asList(
                        "CRWebPlayerJs/interactive-book-static/ColoursEn-1/gdlplayer.umd.js",
                        "feedthemonster/interactive-book-static/ColoursEn-1/gdlplayer.umd.js"),
                candidates(BUILD_HOST, "/interactive-book-static/ColoursEn-1/gdlplayer.umd.js"));
        assertEquals(Arrays.asList("CRWebPlayerJs/Quicksand-Bold.ttf", "feedthemonster/Quicksand-Bold.ttf"),
                candidates(BUILD_HOST, "/Quicksand-Bold.ttf"));
    }

    @Test
    public void productionHostsStayMappedForAbsoluteUrlsEmbeddedInContent() {
        // FTM's language JSON points puzzle audio at its production host.
        assertEquals(Collections.singletonList("feedthemonster/lang/french/audios/a.mp3"),
                candidates("feedthemonster.curiouscontent.org", "/lang/french/audios/a.mp3"));
        assertEquals(Collections.singletonList("feedthemonster/index.html"),
                candidates("FeedTheMonster.CuriousContent.org", "/"));
        assertEquals(Collections.singletonList("CRWebPlayerJs/BookContent/X/content/content.json"),
                candidates("curiousreader.curiouscontent.org", "/BookContent/X/content/content.json"));
    }

    @Test
    public void otherHostsAreNeverServedFromTheApk() {
        assertTrue(candidates("assessment.curiouscontent.org", "/").isEmpty());
        assertTrue(candidates("feedthemonsterdev.curiouscontent.org", "/").isEmpty());
        assertTrue(candidates("docs.google.com", "/forms/x").isEmpty());
        assertTrue(candidates(null, "/assets/feedthemonster/index.html").isEmpty());
    }

    @Test
    public void repeatedSlashesCollapseLikeAStaticServer() {
        // content.json entries such as "/images/file.png" make the player request images//file.png.
        assertEquals(Arrays.asList(
                        "CRWebPlayerJs/BookContent/ColoursFrenchLv4/content/images/file-61fb29a5596cb.png",
                        "feedthemonster/BookContent/ColoursFrenchLv4/content/images/file-61fb29a5596cb.png"),
                candidates(BUILD_HOST, "/BookContent/ColoursFrenchLv4/content/images//file-61fb29a5596cb.png"));
        assertEquals(Collections.singletonList("feedthemonster/index.html"),
                candidates(BUILD_HOST, "//assets//feedthemonster//"));
    }

    @Test
    public void onlyTheExactCdnFilesTheGdlPlayerNeedsAreVendored() {
        assertEquals("vendor/dotlottie-player-0.44.0.wasm", LocalWebContent.vendoredAssetFor(
                "cdn.jsdelivr.net", "/npm/@lottiefiles/dotlottie-web@0.44.0/dist/dotlottie-player.wasm"));
        assertEquals("vendor/dotlottie-player-0.44.0.wasm", LocalWebContent.vendoredAssetFor(
                "unpkg.com", "/@lottiefiles/dotlottie-web@0.44.0/dist/dotlottie-player.wasm"));
        // A different version, any other path, or any other host is not served from the APK.
        assertNull(LocalWebContent.vendoredAssetFor(
                "cdn.jsdelivr.net", "/npm/@lottiefiles/dotlottie-web@0.45.0/dist/dotlottie-player.wasm"));
        assertNull(LocalWebContent.vendoredAssetFor("cdn.jsdelivr.net", "/npm/lodash/lodash.min.js"));
        assertNull(LocalWebContent.vendoredAssetFor("storage.googleapis.com", "/workbox-cdn/releases/6.4.1/workbox-sw.js"));
        assertNull(LocalWebContent.vendoredAssetFor(null, "/x"));
    }

    @Test
    public void expectedMissesAreRecognisedPerPackage() {
        assertTrue(LocalWebContent.isKnownAbsent("feedthemonster/sw.js"));
        assertTrue(LocalWebContent.isKnownAbsent("CRWebPlayerJs/sw.js"));
        assertTrue(LocalWebContent.isKnownAbsent("CRWebPlayerJs/app.js"));
        assertTrue(LocalWebContent.isKnownAbsent("CRWebPlayerJs/firebase-config.json"));
        assertFalse(LocalWebContent.isKnownAbsent("CRWebPlayerJs/dist/app.js"));
        assertFalse(LocalWebContent.isKnownAbsent("feedthemonster/feedTheMonster.js"));
        // The first candidate for the player's "/sw.js" is the known-absent one.
        assertEquals("CRWebPlayerJs/sw.js", candidates(BUILD_HOST, "/sw.js").get(0));
    }

    @Test
    public void ftmAssessmentModuleIsAKnownAbsentDirectory() {
        // FTM's HEAD probe before it opens an in-game assessment; must be a definite miss.
        assertTrue(LocalWebContent.isInKnownAbsentDirectory(
                "feedthemonster/assessment-survey/data/english-lettersounds.json"));
        assertTrue(LocalWebContent.isInKnownAbsentDirectory(
                "feedthemonster/assessment-survey/data/zulu-lettersounds.json"));
        assertTrue(LocalWebContent.isInKnownAbsentDirectory("feedthemonster/assessment-survey/css/style.css"));
        assertFalse(LocalWebContent.isInKnownAbsentDirectory("feedthemonster/assessment-survey"));
        assertFalse(LocalWebContent.isInKnownAbsentDirectory("feedthemonster/lang/english/ftm_english.json"));
        assertFalse(LocalWebContent.isInKnownAbsentDirectory("CRWebPlayerJs/assessment-survey/data/x.json"));
        assertEquals("feedthemonster/assessment-survey/data/english-lettersounds.json",
                candidates(BUILD_HOST, "/assets/feedthemonster/assessment-survey/data/english-lettersounds.json").get(0));
    }

    @Test
    public void mimeTypesCoverWhatABrowserIsStrictAbout() {
        assertEquals("text/javascript", LocalWebContent.mimeTypeFor("feedthemonster/feedTheMonster.js"));
        assertEquals("application/wasm", LocalWebContent.mimeTypeFor("vendor/dotlottie-player-0.44.0.wasm"));
        assertEquals("application/json", LocalWebContent.mimeTypeFor("feedthemonster/lang/french/ftm_french.json"));
        assertEquals("text/html", LocalWebContent.mimeTypeFor("feedthemonster/index.html"));
        assertEquals("audio/mpeg", LocalWebContent.mimeTypeFor("x/y.MP3"));
        assertEquals("font/ttf", LocalWebContent.mimeTypeFor("assets/fonts/NotoSans-Regular.ttf"));
        assertEquals("font/otf", LocalWebContent.mimeTypeFor("CRWebPlayerJs/dist/fonts/Quicksand_Bold.otf"));
        assertEquals("image/webp", LocalWebContent.mimeTypeFor("CRWebPlayerJs/dist/images/red_bird_256.webp"));
        assertEquals("image/svg+xml", LocalWebContent.mimeTypeFor("feedthemonster/assets/images/Pink_Stone.svg"));
    }

    @Test
    public void unknownOrMissingExtensionsFallBackToTheServerDefault() {
        assertNull(LocalWebContent.mimeTypeFor("feedthemonster/PACKAGE_INFO"));
        assertNull(LocalWebContent.mimeTypeFor("feedthemonster/file."));
        assertNull(LocalWebContent.mimeTypeFor("feedthemonster/data.unknownext"));
    }

    // ---- Byte ranges (media elements resume preloaded narration with Range requests) ----

    private static void assertRange(long start, long end, long[] range) {
        assertTrue("expected a range", range != null);
        assertEquals(start, range[0]);
        assertEquals(end, range[1]);
    }

    @Test
    public void rangeHeaderFormsChromiumSends() {
        assertRange(0, 115199, LocalWebContent.parseRange("bytes=0-", 115200));
        assertRange(98304, 115199, LocalWebContent.parseRange("bytes=98304-", 115200));
        assertRange(100, 199, LocalWebContent.parseRange("bytes=100-199", 115200));
        assertRange(114700, 115199, LocalWebContent.parseRange("bytes=-500", 115200));
        // An end past the resource is clamped, as RFC 9110 requires.
        assertRange(100, 115199, LocalWebContent.parseRange("bytes=100-999999", 115200));
        assertRange(0, 115199, LocalWebContent.parseRange("bytes=-999999", 115200));
        assertRange(5, 5, LocalWebContent.parseRange(" BYTES=5-5 ", 10));
    }

    @Test
    public void unusableRangesFallBackToAFullResponse() {
        assertNull(LocalWebContent.parseRange(null, 115200));
        assertNull(LocalWebContent.parseRange("", 115200));
        assertNull(LocalWebContent.parseRange("items=0-5", 115200));
        assertNull(LocalWebContent.parseRange("bytes=", 115200));
        assertNull(LocalWebContent.parseRange("bytes=abc-", 115200));
        assertNull(LocalWebContent.parseRange("bytes=0-5,10-20", 115200));
        assertNull(LocalWebContent.parseRange("bytes=50-10", 115200));
        assertNull(LocalWebContent.parseRange("bytes=115200-", 115200)); // unsatisfiable
        assertNull(LocalWebContent.parseRange("bytes=-0", 115200));
        assertNull(LocalWebContent.parseRange("bytes=0-", 0)); // unknown/empty resource
    }

    @Test
    public void headerLookupIgnoresCase() {
        java.util.Map<String, String> headers = new java.util.HashMap<>();
        headers.put("range", "bytes=0-");
        assertEquals("bytes=0-", LocalWebContent.headerValue(headers, "Range"));
        assertNull(LocalWebContent.headerValue(headers, "If-Range"));
        assertNull(LocalWebContent.headerValue(null, "Range"));
    }

    @Test
    public void boundedStreamEndsAtTheRangeEndAfterTheWebViewSkipsToItsStart() throws Exception {
        byte[] data = new byte[1000];
        for (int i = 0; i < data.length; i++) {
            data[i] = (byte) (i % 251);
        }
        // Range bytes=100-199: cap at absolute position 200, then the WebView skips 100 itself.
        LocalWebContent.BoundedInputStream in = new LocalWebContent.BoundedInputStream(
                new java.io.ByteArrayInputStream(data), 200);
        assertEquals(200, in.available());
        assertEquals(100, in.skip(100));
        assertEquals(100, in.available());
        byte[] out = new byte[1000];
        int total = 0;
        int n;
        while ((n = in.read(out, total, out.length - total)) > 0) {
            total += n;
        }
        assertEquals(100, total);
        assertEquals(data[100], out[0]);
        assertEquals(data[199], out[99]);
        assertEquals(-1, in.read());
        assertEquals(0, in.skip(10));
    }

    @Test
    public void boundedStreamNeverOverreadsSingleBytes() throws Exception {
        LocalWebContent.BoundedInputStream in = new LocalWebContent.BoundedInputStream(
                new java.io.ByteArrayInputStream(new byte[]{1, 2, 3, 4}), 2);
        assertEquals(1, in.read());
        assertEquals(2, in.read());
        assertEquals(-1, in.read());
    }
}

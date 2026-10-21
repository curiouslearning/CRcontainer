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
}

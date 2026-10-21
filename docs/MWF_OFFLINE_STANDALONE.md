# MWF PDE offline standalone builds (mwfCongo / mwfAngola)

Two private APKs for the MWF PDE fellowship that must work with **no internet from the very first
launch**: show the catalog, switch language, open Feed The Monster (FTM) and complete levels, show
the Curious Reader user ID / QR code, and still sync play data to Firestore whenever connectivity
appears.

| Flavor      | Region            | Initial language                   | Second language | Build task                      |
|-------------|-------------------|------------------------------------|-----------------|---------------------------------|
| `mwfCongo`  | Republic of Congo | French (`French`)                  | English         | `./gradlew assembleMwfCongoRelease`  |
| `mwfAngola` | Angola            | Brazilian Portuguese (`BrazilianPortuguese`) | English | `./gradlew assembleMwfAngolaRelease` |
| `online`    | everyone else     | chosen by the user / deferred link | all             | unchanged (`assembleOnlineDebug`, `bundleOnlineRelease`) |

The regular Play Store app is the `online` flavor. Its behaviour is unchanged; every standalone
code path is gated on `BuildConfig.OFFLINE_STANDALONE`.

## How the online build depends on the network at startup (why this exists)

1. **Catalog** lives in a Room table that is only ever filled from the remote manifest
   (`RetrofitInstance.getAppManifest` → `BuildConfig.API_URL`). `WebAppRepository.fetchWebApp()`
   does nothing when `ConnectionUtils.isInternetConnected()` is false. On an offline first launch
   the language popup opens with an empty dropdown and no icons, and the loading indicator never
   clears. The bundled `assets/web_apps_manifest.json` existed but nothing read it
   (`AppManifest.java` is dead code and expects a different shape).
2. **First `loadApps()` is triggered by attribution callbacks**, not by `onCreate`:
   `InstallReferrerManager` (Play Store install referrer, up to 5 retries × 2 s) and then
   `AppLinkData.fetchDeferredAppLinkData` (Facebook, network). Only when both have answered does
   `MainActivity` call `showLanguagePopup()` / `loadApps()`.
3. **Icons** come from `appIconUrl` on the manifest host via Picasso/OkHttp.
4. **Sub-apps** are remote URLs; `WebApp.loadWebView()` shows "Please Connect to the Network" and
   closes when offline unless FTM's service worker previously reported the language as cached
   (`appCached` prefs, set through the `cachedStatus` bridge call).
5. **FTM itself** (see audit below) cannot start offline on a fresh install even when served
   locally: its service worker loads Workbox from a Google CDN, and it only renders the game once
   the worker has reported the language cached.

Things that already worked offline and were left alone: `cr_user_id` generation (SecureRandom +
timestamp in `appCached` prefs), QR code (ZXing, local), Firestore writes (SDK persistence queues
them), Firebase Analytics (queues), Sentry (queues), monster animation (Rive, local).

## What the standalone flavors change

Container (Java/Gradle), all gated on `OFFLINE_STANDALONE`:

| File | Change |
|------|--------|
| `app/build.gradle` | `flavorDimensions "distribution"` with `online` (default), `mwfCongo`, `mwfAngola`; `OFFLINE_STANDALONE` and `DEFAULT_LANGUAGE` BuildConfig fields; `src/mwfShared/assets` shared source set; `androidx.webkit` dependency; jacoco task names flavor-qualified. |
| `data/local/LocalManifestLoader.java` (new) | Reads `assets/web_apps_manifest.json`, validates every entry, writes it to Room through the same replace-all path a remote refresh uses. Missing/invalid file → `Log.e` + Sentry message + error LiveData (never an indefinite spinner). |
| `data/respository/WebAppRepository.java` | `fetchWebApp()` loads the packaged manifest instead of calling the API; `getUpdatedAppManifest()` is a no-op so the remote manifest can never replace the packaged catalog. |
| `presentation/viewmodals/HomeViewModal.java` | Exposes the manifest-error LiveData. |
| `MainActivity.java` | Pre-selects `DEFAULT_LANGUAGE` when nothing is stored yet, then calls `loadApps()` directly from `onCreate` so the catalog no longer waits on the referrer / Facebook callbacks (those still run for attribution). Shows a toast if the packaged manifest is unusable. |
| `utilities/LocalWebContent.java` (new) | `WebViewAssetLoader` that serves `https://feedthemonster.curiouscontent.org/*` from `assets/feedthemonster/` (root → `index.html`, explicit MIME types for `.js/.wasm/.json/...`), plus service-worker request interception. |
| `WebApp.java` | For local content: skips the connectivity prompt, installs the asset loader in `shouldInterceptRequest`, ignores `cachedStatus(false)`. |
| `app/fastlane/Fastfile` | CI builds/uploads the `online` flavor explicitly (`assembleOnlineDebug`, `bundleOnlineRelease`) so flavors cannot change what reaches the Play Store. |
| `app/src/mwfCongo/assets/web_apps_manifest.json`, `app/src/mwfAngola/assets/web_apps_manifest.json` | Packaged catalogs (two FTM entries each, same `appId`/`app_id` values as production). |
| `app/src/mwfShared/assets/images/*.png` | FTM icons, referenced as `file:///android_asset/images/...` (Picasso's asset handler, no network). |
| `app/src/mwfShared/assets/feedthemonster/` | The packaged FTM build, produced by `tools/package-ftm.js` (below). Not hand-edited. |

### Why the packaged FTM is served on its real origin

FTM's language JSON references all puzzle and feedback audio by **absolute**
`https://feedthemonster.curiouscontent.org/lang/<lang>/audios/*.mp3` URLs. Serving the package on
that exact origin makes them resolve to the APK without rewriting any content, keeps the origin a
secure context (service worker, Cache API, `localStorage` all work), and makes FTM's environment
detection and the container's `attribution.hostname` identical to the online build, so the
Firestore data Literacy Coach reads is indistinguishable. In the `online` flavor the host is never
intercepted.

### The "Parents feedback form"

It is a manifest entry, not code: `FTM Survey English` (`appId` 345, a `docs.google.com/forms`
URL). The packaged manifests simply do not include it (nor the `Welcome Parent Video` YouTube
page, nor the Curious Reader books, none of which can work offline). The online manifest is
untouched.

## Packaging Feed The Monster

The FTM build is a generated artifact checked into `app/src/mwfShared/assets/feedthemonster/`.
Re-create it whenever FTM changes:

```bash
# 1. Build FTM from the branch you want to ship (origin/test or origin/main; the local checkout
#    may be stale - the Android bridge only exists from v1.8 on).
cd /path/to/FeedTheMonsterJS
npm ci --ignore-scripts          # add `env -u npm_config_allow_scripts` if npm complains about allow-scripts
npm run build                    # -> build/

# 2. Package the three languages into the container.
cd /path/to/CRcontainer
node tools/package-ftm.js --build /path/to/FeedTheMonsterJS/build --langs english,french,brazilianportuguese

# 3. Build the APKs.
./gradlew assembleMwfCongoRelease assembleMwfAngolaRelease
#    -> app/build/outputs/apk/mwfCongo/release/app-mwfCongo-release.apk
#    -> app/build/outputs/apk/mwfAngola/release/app-mwfAngola-release.apk
```

`tools/package-ftm.js` copies the build, keeps only the requested `lang/` folders, **drops
`sw.js`** (it `importScripts` Workbox from a CDN, so it cannot start offline, and every file is
already served from the APK), and injects one inline `<script>` into `index.html` that

* marks the requested `cr_lang` as cached in `localStorage` (`is_cached`), because FTM only creates
  its scene handler once the language is marked cached or the service worker reports 100%; and
* pre-seeds the `@curiouslearning/features` cache (`CRFeatureFlags`, gate `mr-75`) as enabled.
  FTM registers its Android bridge — the path that sends level/star data to the container and on
  to Firestore — only when that Statsig gate is true. Offline, Statsig is unreachable and the gate
  evaluates false, so without the seed an offline device would never report progress. The
  features library never caches a `false`, so the seed persists; a `true` from Statsig when online
  simply refreshes it.

No FTM source is modified. `PACKAGE_INFO.json` next to `index.html` records the source commit,
languages and sizes.

## Verification status (2026-10-21)

Unit tests: 107 pass (`./gradlew testOnlineDebugUnitTest`; 96 pre-existing + 11 new for
`LocalManifestLoader.parse` and `LocalWebContent` path/MIME mapping). All three flavors compile.

Device tests were run on the `Medium_Phone` emulator (Android 17 / API 37, WebView 149, Play
Store present, software GPU) with Wi-Fi and data disabled and airplane mode on, using the debug
APKs. They still need a repeat on a physical low-end device before hand-off.

| Test | Result |
|------|--------|
| A. Fresh offline install, first launch (`mwfCongo`) | Pass. Catalog with the French FTM icon in ~6 s, no popup, no network request needed. Log: `Local manifest loaded: version=mwf-congo-1 apps=2 languages=[French, English]`. |
| B. Language switching offline | Pass. Dropdown lists exactly `English - US` / `Français`; French → English → French each reload the catalog. Same for `mwfAngola` (`Português - Brazilian` initial). |
| C. Offline FTM | Pass. FTM v1.8.1 start screen, level map and puzzles render from the APK; the only asset miss is `sw.js` (by design). Level 1 completed (2 stars recorded in `localStorage`); dragging the correct stone gives "Bien fait". Every puzzle/feedback audio URL in the three language JSONs resolves from the APK and decodes (English 172, French 87, Portuguese 95 files); the only misses are `are-you-sure.mp3`, `Select-your-player.mp3`, `watch-me-grow.mp3`, which FTM parses but never plays and which are absent upstream too. FTM reopens offline after a force-stop of the container. |
| C. Bridge | Pass. `summary_data` + `user_sessions_data` payloads accepted per puzzle offline; `getMonsterEvolutionState` polling works. |
| D. Learner ID / QR offline | Pass. Overlay shows the QR and `cr_user_id_<id>`. Note the QR payload is the bare id (no `cr_user_id_` prefix), unchanged from the online build. Camera / Photo-QR scanning into Literacy Coach not tested here. |
| E. Sync after reconnect | Pass with the evidence available from logs: after going online, Firestore acknowledged a summary update (`Updated summary payload with id: …` is logged on server ack) and the next launch prefetched `1 existing summary docs` from the server. Firestore delivers a client's queued writes in order, so the offline `user_sessions_data` writes were flushed first. Not verified in the Firestore console / Literacy Coach dashboard. |
| F. Online flavor regression | Pass. Fresh install online: remote manifest (370 entries) loaded, full language list, remote icons, no standalone code paths logged. |

Observed on the emulator only: on the very first puzzle after install, FTM's letter stones took
several seconds to appear while fonts/Rive initialised under software rendering; later puzzles
were immediate. Worth re-checking on real hardware.

## Sizes

| APK (debug, unsigned-release will be similar) | Size |
|---|---|
| `app-mwfCongo-debug.apk` | 56.1 MB |
| `app-mwfAngola-debug.apk` | 56.1 MB |
| `app-online-debug.apk` (unchanged) | 33.6 MB |

Packaged FTM: 28.6 MB (assets 22.9 MB = images 14 MB, fonts 5.3 MB, audio 2.5 MB, Rive 1.9 MB;
`lang/` 4.8 MB for three languages). Not packaged: the other 59 languages (~226 MB) and the
embedded assessment module (~53 MB, only scheduled by a Statsig config that defaults to off).

Further reductions available if needed: `assets/fonts` ships 20 font files but the three MWF
languages map to `Consolas.ttf` (fallback `NotoSans-Regular.ttf`), so ~4.5 MB could be pruned once
the title/feedback font mapping is confirmed; `assets/images` could be re-encoded as WebP.

## Known limitations

* **Play Store auto-update.** The standalone APKs share `applicationId` and signing key with the
  Play Store app. On a device that has the Play Store, is signed in, and goes online, Play may
  upgrade the app to the store version (higher `versionCode`), which is the online flavor. Data
  and `cr_user_id` survive (same package), but offline content is lost. Mitigations: keep the
  standalone `versionCode` ahead of the store, or disable Play auto-update on the device. A
  separate `applicationId` would need a new Android app in the Firebase project and a Literacy
  Coach change (it stamps `attribution.apk_package_name`), so it was not done without approval.
* **`cr_user_id` across reinstall.** It lives in SharedPreferences. Android Auto Backup
  (`allowBackup=true`, default rules) can restore it on reinstall only when the device has a Google
  account with backup enabled and was online to back up; that cannot be relied on in the field.
  Fellows should record the ID / QR screenshot before reinstalling. Upgrading in place (install the
  new APK over the old one) keeps it.
* **Statsig / Facebook / Firebase traffic still attempted.** The FTM bundle and the container still
  try to reach Statsig, Facebook Pixel, Firebase and Sentry; offline these fail asynchronously and
  are swallowed. On a captive or half-working network FTM's Statsig init can wait up to ~10 s
  before the game starts.
* **Assessments and Curious Reader books are not packaged.** Only FTM is.
* **Country metadata** (`metadata.country`) is `unknown` until the device is online once.

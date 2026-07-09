---
name: standalone-build-orchestrator
description: Orchestrate a complete Curious Reader Android standalone build from a requested package name and CRWebPlayer language content. Use when the user asks to make, prepare, package, or build a standalone APK with BookContent from GitHub, web_apps_manifest.json entries, package renaming, standalone SDK cleanup, and final Gradle assembly; especially for prompts like "make a standalone build using package name X with CRWebPlayerJs isiZulu content".
---

# Standalone Build Orchestrator

## Overview

Coordinate the repo-local `github-s3-content-pull` and `standalone-android-build` skills to produce a content-ready Android standalone build. This skill handles content discovery/download, manifest packaging, standalone package specialization, and final Gradle verification.

## Inputs

Extract these from the user request:

- `package_name`: required Java package, for example `org.curiouslearning.allSA_maharishi`.
- `language`: required CRWebPlayer BookContent language token, for example `isiZulu`, `Zulu`, `Hausa`, or `Luganda`.
- `domain`: optional manifest host; default `maharishi_cr-ftm-standalone.androidplatform.net`.
- `repo` and `branch`: optional GitHub content source; default `curiouslearning/CRWebPlayer` on `develop`.

If package or language is missing, ask one concise question.

## Required Skills

Use these sibling repo-local skills during execution:

- `skills/github-s3-content-pull/SKILL.md` for GitHub BookContent folder listing/download and its CDN-preferred byte fetching.
- `skills/standalone-android-build/SKILL.md` for package rename, standalone cleanup, and standalone Gradle build conventions.

Read each sibling `SKILL.md` before invoking its workflow.

## Workflow

1. Announce the package name, language, GitHub repo/branch, and manifest domain.
2. Read `references/manifest-format.md` if manifest details are needed.
3. Run a content dry run:

```powershell
node skills/standalone-build-orchestrator/scripts/prepare-crwebplayer-content.mjs --language <language>
```

4. Download CRWebPlayer runtime files, matching language content, and upsert `web_apps_manifest.json`:

```powershell
node skills/standalone-build-orchestrator/scripts/prepare-crwebplayer-content.mjs --language <language> --domain <domain> --download-runtime --download --write-manifest
```

5. Inspect the script summary.
   - If GitHub rate limits or similar API failures stop the remote `BookContent` listing after some content is already on disk, treat that as a partial-success case.
   - Report the books that were downloaded, the books still missing, and whether the runtime files are complete.
   - If runtime files are present and at least some matched books are available locally, continue to manifest upsert and the Android build instead of blocking the whole run.
   - Stop before Gradle only when the runtime is incomplete or there are no usable local books for the requested language.
6. Run the standalone Android build skill with the requested package name.
   - If the project is already using that package, report it and skip only the rename step.
   - Still run standalone cleanup/validation/build steps from that skill.
   - If Sentry is disabled for the standalone build, make sure the dependency and provider are removed from the standalone variant while keeping any standard-flavor implementation isolated behind flavor-specific source sets or wrappers.
   - If the standalone variant uses bundled `web_apps_manifest.json`, confirm the asset manifest is parsed in the same shape it is written (`{ version, web_apps }`) and seeded into Room before the UI reads from `getAllWebApps()`.
   - If the UI groups languages from seeded content, ensure missing `language` or `languageInEnglishName` values are skipped rather than inserted into sorted maps.
   - Standalone builds have `SHOW_LANGUAGE_POPUP=false` and `SHOW_SETTINGS_BUTTON=false` (see `docs/standalone-feature-flags.md`): the popup and the settings-gear button that opens it are both gated off, so the app must load a language automatically instead. After `--write-manifest` runs, read back `languageInEnglishName` for the matched entries in `web_apps_manifest.json` — do not assume it equals the alias table's `englishName` (`--local-name`/`--english-name` can be passed as the same value, and the current bundled manifest uses `isiZulu` for both fields, not `Zulu`). Use that exact manifest value in step 7.
   - Confirm `WebApp.java`'s `loadWebView()` still derives its `WebViewAssetLoader` domain from each entry's own `appUrl` host (see "Web app URL loading" below) rather than a hardcoded domain, and that `androidx.webkit:webkit` is still declared — both are required for bundled content to actually load in offline mode, and `:app:verifyStandaloneConfiguration` (run in step 7) only catches the dependency being missing, not a hardcoded/stale domain.
7. Run the final standalone build, passing the manifest's actual `languageInEnglishName` value so the app has a language to load without the popup:

```powershell
.\gradlew.bat assembleStandaloneDebug -PstandaloneDefaultLanguage=<languageInEnglishName>
```

8. Final response must include:
   - Package name.
   - Matched/downloaded books.
   - Manifest entries added or already present.
   - Standalone build skill actions performed.
   - Default language passed to the build (`-PstandaloneDefaultLanguage` value).
   - Gradle result and APK path.
   - The "Manual Checklist" below, every run, even on success — neither item is automated by
     this skill and both are required for the standalone build to actually work correctly, not
     just compile.

## Manual Checklist (Not Automated)

Always end the final response with these two items — this skill has no mechanism to satisfy
either automatically, so silently omitting them leaves the human operator thinking the build is
more ready than it is:

- **A `CRWebPlayerJs/dist/` build with the service worker removed.** The runtime files this
  skill downloads (`--download-runtime`) are pulled as-is from the CRWebPlayer repo/CDN; if that
  build registers a service worker, it can interfere with `WebViewAssetLoader`-based offline
  asset serving in the standalone app. Getting a dist build without one is a manual step outside
  this skill's scope — flag it, don't attempt to strip it automatically.
- **A fresh `google-services.json` registered for the target package via the Firebase Console.**
  This skill does not add, duplicate, or otherwise touch `client` entries in
  `app/google-services.json`. Without a `client` array entry whose `package_name` matches the
  standalone `applicationId`, the Google Services Gradle plugin fails the build at
  `processStandaloneDebugGoogleServices` with "No matching client found for package name
  '<package>'". A previous run worked around this by manually duplicating the existing
  `org.curiouslearning.container` entry and swapping its `package_name` — reusing that app's
  Firebase credentials rather than a real separate registration. That is not something to
  reproduce automatically; ask for a properly registered file instead.

## Troubleshooting Notes

- If Gradle fails at `processStandaloneDebugGoogleServices` (or the equivalent standard task) with `No matching client found for package name '<package>'`, that is the "Manual Checklist" `google-services.json` item above — the Google Services plugin has no `client` entry for this `applicationId`. Do not attempt to fabricate one; report it as a blocker needing a real Firebase Console registration.
- If the app crashes before `Application.onCreate` with `SentryInitProvider` or a similar SDK provider, runtime `BuildConfig` checks are not enough. Inspect the merged standalone manifest and remove the SDK at the dependency/manifest level for the standalone flavor.
- For Sentry specifically, the standalone variant should not carry the Sentry Gradle plugin or Sentry dependency. Keep any Sentry usage behind a flavor-specific wrapper or standard-only source set so the standalone compile still succeeds.
- If the merged standalone manifest still shows `io.sentry` providers or metadata after cleanup, treat that as a build configuration problem and fix it before shipping the APK.
- If the standalone build passes but startup still fails, re-open `app/build/intermediates/merged_manifests/standaloneDebug/processStandaloneDebugManifest/AndroidManifest.xml` and confirm that the removed SDK providers are absent.
- If the app launches but the content list is empty, check the standalone bootstrap path:
  - `web_apps_manifest.json` must be inserted into Room or returned through the same repository path the UI observes.
  - `AppManifest` must handle the object-shaped manifest with a top-level `web_apps` array.
  - `WebAppRepository.fetchWebApp()` should seed bundled assets when remote manifest loading is disabled.
  - Also check `BuildConfig.DEFAULT_LANGUAGE`: since `SHOW_LANGUAGE_POPUP=false` in standalone, there is no popup fallback. If the build did not pass `-PstandaloneDefaultLanguage=<languageInEnglishName>`, or the value does not exactly match a `languageInEnglishName` in the manifest, the app has no language to load and shows an empty grid.
- If a specific sub-app's content never loads (blank/erroring WebView, network error toast) while others in the same build work, check `WebApp.java`'s `loadWebView()` `WebViewAssetLoader` setup: it must derive its domain from that entry's own `appUrl` host, not a hardcoded domain. A hardcoded domain from an earlier build/language only intercepts requests to that one host; every other host falls through to the network, which fails offline. Also confirm `androidx.webkit:webkit` is still an `implementation` dependency — `:app:verifyStandaloneConfiguration` fails the build if it was removed during SDK cleanup, but check directly if that task was skipped.
- If the app crashes in `sortLanguages()` or `MapLanguagesEnglishName()`, inspect the seeded `WebApp` rows for null or blank language fields and skip them before inserting into `TreeMap`.
- If logcat shows checksum mismatch or `No package ID` warnings after a fresh APK, uninstall the app from the device before re-installing. Treat those as stale-install warnings unless a `FATAL EXCEPTION` follows.

## Standalone Implementation Pattern

Use this when you are porting a blank repo into the standalone shape we ended up with here.

### Package and flavor

- Standalone package used in this run:

```text
org.curiouslearning.allSA_maharishi
```

- Add a `mode` flavor dimension with `standard` and `standalone`.
- Keep the standard flavor intact if you still need it.
- Keep standalone SDK toggles in `BuildConfig` so the same source tree can compile both flavors.

Example:

```groovy
flavorDimensions "mode"

productFlavors {
    standard {
        dimension "mode"
        buildConfigField "boolean", "ENABLE_SENTRY", "true"
    }
    standalone {
        dimension "mode"
        applicationId "org.curiouslearning.allSA_maharishi"
        buildConfigField "boolean", "ENABLE_SENTRY", "false"
    }
}
```

### Standalone dependencies

For standalone builds, keep only the dependencies you really need to launch the bundled web apps.

Add AndroidX WebKit so `WebViewAssetLoader` compiles:

```groovy
implementation 'androidx.webkit:webkit:1.15.0'
```

Do not remove this one during SDK cleanup even though it sits next to the Facebook/Sentry/Install-Referrer
dependencies that step 6 does strip for standalone: standalone has no network fallback, so
`WebApp.java`'s asset-loading WebView depends on it directly (see "Web app URL loading" below).
`:app:verifyStandaloneConfiguration` fails the build if it's missing.

If Sentry is standard-only, scope it to the standard flavor:

```groovy
standardImplementation(platform("io.sentry:sentry-bom:7.17.0"))
standardImplementation("io.sentry:sentry-android") {
    exclude group: "io.sentry", module: "sentry-android-ndk"
}
```

If the repo still uses Facebook, Firebase, or Install Referrer in the standard flavor, keep them there and remove or gate them from standalone only when the standalone experience does not need them.

### Bundled manifest bootstrap

The standalone app should not depend on Retrofit for initial content. It should seed Room from the packaged `web_apps_manifest.json`.

Asset manifest shape:

```json
{
  "version": 1,
  "web_apps": [
    {
      "appId": 3,
      "appIconUrl": "chakus_cycle.png",
      "title": "Curious Reader ChakusCycle IsiZulu",
      "appUrl": "https://maharishi_cr-ftm-standalone.androidplatform.net/assets/CRWebPlayerJs/index.html?book=ChakusCycleIsiZulu",
      "language": "isiZulu",
      "languageInEnglishName": "isiZulu"
    }
  ]
}
```

Asset parsing template:

```java
public List<WebApp> getAllWebApps(AssetManager assetManager) {
    String jsonData = getData(assetManager);
    if (jsonData == null || jsonData.trim().isEmpty()) {
        return Collections.emptyList();
    }

    JsonElement parsedElement = JsonParser.parseString(jsonData);
    Type listType = new TypeToken<List<WebApp>>(){}.getType();

    if (parsedElement.isJsonObject()) {
        JsonObject jsonObject = parsedElement.getAsJsonObject();
        JsonElement webAppsElement = jsonObject.get("web_apps");
        if (webAppsElement != null && webAppsElement.isJsonArray()) {
            return new Gson().fromJson(webAppsElement, listType);
        }
    }

    if (parsedElement.isJsonArray()) {
        return new Gson().fromJson(parsedElement, listType);
    }

    return Collections.emptyList();
}
```

Repository seeding template:

```java
public void fetchWebApp() {
    if (!BuildConfig.ENABLE_REMOTE_MANIFEST) {
        List<WebApp> localWebApps = AppManifest.getAppManifest().getAllWebApps(application.getAssets())
                .stream()
                .filter(webApp -> webApp != null
                        && webApp.getAppUrl() != null
                        && webApp.getAppUrl().contains("/assets/CRWebPlayerJs/")
                        && webApp.getLanguageInEnglishName() != null
                        && !webApp.getLanguageInEnglishName().trim().isEmpty())
                .collect(Collectors.toList());

        if (!localWebApps.isEmpty()) {
            webAppDatabase.deleteWebApps(localWebApps);
            webAppDatabase.insertAll(localWebApps);
        }
        return;
    }
}
```

### Icon loading

The manifest should carry the icon filename, not a hardcoded drawable mapping.

Example manifest field:

```json
"appIconUrl": "chakus_cycle.png"
```

Loader template:

```java
public static void loadWebAppIcon(Context context, String imageUrl, ImageView imageView) {
    String resolvedImageUrl = imageUrl;
    if (resolvedImageUrl != null
            && !resolvedImageUrl.startsWith("http://")
            && !resolvedImageUrl.startsWith("https://")
            && !resolvedImageUrl.startsWith("file:///android_asset/")) {
        resolvedImageUrl = "file:///android_asset/images/" + resolvedImageUrl;
    }

    Picasso.get()
            .load(resolvedImageUrl)
            .resize(targetSizePixels, targetSizePixels)
            .centerCrop()
            .into(imageView);
}
```

### Web app URL loading

Implemented today in `WebApp.java`'s `loadWebView()`. The `appUrl` should be the manifest URL, but the
app should route it through `WebViewAssetLoader` so the content is served from bundled assets instead of
the network.

**Do not hardcode a single language's domain here.** An earlier version of this template hardcoded
`hindi-cr-ftm-standalone.androidplatform.net` as the `WebViewAssetLoader` domain, which silently broke
asset interception for every other language once that copy-pasted code shipped for a different domain.
`WebViewAssetLoader` only intercepts requests whose host matches the configured domain — the domain the
loader is built with must equal the manifest's own `appUrl` host for the entry currently being opened,
and that host varies per orchestrator run (`--domain`, default `maharishi_cr-ftm-standalone.androidplatform.net`).
Derive it from `appUrl` each time instead:

```java
// The domain only has to match this activity's own appUrl host so WebViewAssetLoader
// intercepts requests for it; it is never dereferenced over the network.
String urlHost = appUrl != null ? Uri.parse(appUrl).getHost() : null;
WebViewAssetLoader.Builder assetLoaderBuilder = new WebViewAssetLoader.Builder()
        .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this));
if (urlHost != null) {
    assetLoaderBuilder.setDomain(urlHost);
}
WebViewAssetLoader assetLoader = assetLoaderBuilder.build();

webView.setWebViewClient(new WebViewClient() {
    @Override
    public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
        return assetLoader.shouldInterceptRequest(request.getUrl());
    }
});

webView.loadUrl(addCrUserIdToUrl(appUrl));
```

### Null-safe language grouping

When you populate the home screen from seeded content, skip incomplete rows before putting data into sorted maps.

Example:

```java
if (languageInEnglishName == null || languageInEnglishName.trim().isEmpty()
        || languageInLocalName == null || languageInLocalName.trim().isEmpty()) {
    continue;
}
languages.put(languageInEnglishName, languageInLocalName);
```

### Minimum file set for a blank repo

- `app/build.gradle`
- `app/src/main/assets/web_apps_manifest.json`
- `app/src/main/assets/CRWebPlayerJs/`
- `app/src/main/assets/images/`
- `app/src/main/java/.../data/local/AppManifest.java`
- `app/src/main/java/.../data/respository/WebAppRepository.java`
- `app/src/main/java/.../utilities/ImageLoader.java`
- `app/src/main/java/.../WebApp.java`
- `app/src/main/java/.../MainActivity.java`
- `app/src/standalone/AndroidManifest.xml`

## Content Helper

Use `scripts/prepare-crwebplayer-content.mjs` for deterministic content work. It:

- Lists `BookContent` from GitHub — one lightweight, non-recursive API call regardless of how many books match.
- Matches folders by case-insensitive normalized language token and known aliases.
- Downloads runtime files (`index.html`, `manifest.json`) and each matched book straight from the
  CDN (`--content-cdn-base`, default `https://curiousreaderdev.curiouscontent.org`), which mirrors
  the repo's path layout 1:1 — see "Content download strategy" below for how this avoids GitHub's
  API rate limit almost entirely. `dist/` still goes through a GitHub-driven folder walk (its file
  list isn't known ahead of time), but with CDN-preferred bytes per file via `github-s3-content-pull`.
- Validates the local BookContent shape.
- Upserts `web_apps_manifest.json` entries using `?book=<BookContentFolder>`.
- Infers `appIconUrl` from real files in `app/src/main/assets/images/` using a normalized fuzzy match against the BookContent folder name, with production icon filenames preferred over dev/copy variants.
- Infers manifest title text from the BookContent folder name and the English language name.
- Preserves content under `app/src/main/assets/CRWebPlayerJs/BookContent/<BookName>/`.
- Preserves runtime files under `app/src/main/assets/CRWebPlayerJs/`, with `dist/` kept as `CRWebPlayerJs/dist/`.

The script is intentionally separate from the Android package rename so content problems are visible before project-wide changes.

### Content download strategy: content.json fast path, GitHub fallback

GitHub's Contents API rate limit (60/hour unauthenticated) is spent almost entirely on directory
**listing**, not file bytes — each subdirectory a recursive walk enters is one API call, and a
single book's `content/audios/` + `content/images/` alone can be 50-400+ files. Downloading many
books in one run used to exhaust the budget partway through (confirmed: with 14 matched isiZulu
books this was previously unable to complete).

Each book's own `content/content.json` is *also* mirrored on the CDN and is itself the book's asset
manifest — an H5P presentation format that embeds every audio/image it needs as inline `{ path,
mime }` file references. So for each matched book, the script:

1. Fetches `content.json` directly from the CDN — zero GitHub calls.
2. Recursively scans it for every asset path (`collectAssetPaths()`: any `.path` string whose
   containing object has a `mime` field, or that already starts with `audios/`/`images/` —
   schema-tolerant, not hardcoded to specific H5P element types).
3. Downloads every asset directly from the CDN, up to 12 concurrent requests at a time
   (`mapWithConcurrency()` — sequential one-at-a-time fetching of a 100+ file book was correct but
   slow; unbounded parallelism risks tripping connection limits).
4. If the `content.json` fetch fails, JSON-parsing fails, or *any single asset* 404s/errors, the
   whole book aborts this fast path and falls back to the GitHub-driven recursive walk (via
   `github-s3-content-pull.mjs download`, itself still CDN-preferred per file) for that book only —
   a book is never left partially populated by a failed fast-path attempt.

Net effect verified in testing: 14/14 matched isiZulu books downloaded in **~1m42s** with **zero**
GitHub API calls beyond the single initial `BookContent` listing — down from a run that couldn't
complete at all. Pass `--no-content-cdn` to disable this entirely and force the old pure-GitHub
path (e.g. if the CDN doesn't have a given language's content yet, or for debugging).

This CDN mirrors whatever's currently *deployed* to the dev environment, not arbitrary git refs —
fine for the default `develop` branch, but content from an unmerged feature branch on GitHub won't
be present there and will correctly fall back to the GitHub walk.

## Progress Style

`prepare-crwebplayer-content.mjs` now prints its own running stats natively — relay them rather
than reconstructing this by hand:

- After each book: `progress: N/M books processed (X cdn, Y fallback, Z skipped) — F file(s),
  <size> so far, <elapsed> elapsed`.
- A final `=== Summary ===` block: elapsed time, runtime file count/size, books matched (via
  CDN / via GitHub fallback / already present), total book content file count/size, validation
  pass count, manifest added/total counts.

When reporting back to the user, quote or closely paraphrase that final summary block rather than
re-deriving the numbers — it's already accurate and already aggregates both the CDN fast path and
the GitHub-fallback subprocess's own counts.

Still call out explicitly, since the summary block alone won't flag it as unusual:

- `Fallback`: `remote listing rate-limited; using local books` when the initial BookContent listing itself is rate-limited.
- A run where `via GitHub fallback` is non-zero for most/all books — a sign the CDN is unreachable or doesn't have that language's content yet, worth surfacing rather than treating as routine.
- `Standalone build`: package rename/cleanup status (not covered by the content script's summary).
- `Gradle`: build command and result (not covered by the content script's summary).

Be explicit about blockers such as GitHub API rate limits, missing content folders, manifest mismatches, or Gradle wrapper lock permissions.

# Standalone Build Configuration

## Overview

This repository now supports a standalone Android flavor for offline Curious Reader deployments.

The standalone flavor applicationId is:

```text
org.curiouslearning.allSA_maharishi
```

The base source package is still:

```text
org.curiouslearning.allSA_maharishi
```

The app now keeps the standard/standalone product flavor structure. The source package rename itself is still handled by the standalone build skill when you want the full package specialization.

## Product Flavors

The `mode` flavor dimension is defined in `app/build.gradle`.

```powershell
.\gradlew.bat assembleStandardDebug
.\gradlew.bat assembleStandardRelease
.\gradlew.bat assembleStandaloneDebug -PstandaloneDefaultLanguage=isiZulu
.\gradlew.bat assembleStandaloneRelease -PstandaloneDefaultLanguage=isiZulu
.\gradlew.bat :app:verifyStandaloneConfiguration
```

`-PstandaloneDefaultLanguage` sets `BuildConfig.DEFAULT_LANGUAGE` (see `SHOW_LANGUAGE_POPUP` above). It must equal the `languageInEnglishName` of the content bundled for that build — currently `isiZulu` for this manifest's Zulu content (see `grep languageInEnglishName app/src/main/assets/web_apps_manifest.json` to confirm for a given build). Omitting it builds successfully but `verifyStandaloneConfiguration` will warn, and the app will show an empty app list on first launch since there is no popup to fall back to.

Expected APK output paths:

```text
app/build/outputs/apk/standard/debug/
app/build/outputs/apk/standard/release/
app/build/outputs/apk/standalone/debug/
app/build/outputs/apk/standalone/release/
```

## BuildConfig Flags

| Flag | Standard | Standalone | Behavior |
| --- | --- | --- | --- |
| `ENABLE_FACEBOOK` | `true` | `false` | Standard keeps the legacy Facebook flow; standalone disables it. |
| `ENABLE_SENTRY` | `true` | `false` | Controls Sentry runtime initialization and explicit captures in the standard flavor; standalone ships without the Sentry package. |
| `ENABLE_REMOTE_MANIFEST` | `true` | `false` | Controls remote manifest update calls. |
| `ENABLE_INSTALL_REFERRER` | `true` | `false` | Standard keeps Install Referrer; standalone disables it. |
| `REQUIRE_INTERNET_FOR_UNCACHED_CONTENT` | `true` | `false` | Controls the WebApp internet prompt before launching uncached content. |
| `ALLOW_BACK_NAVIGATION` | `true` | `false` | Controls Android back press behavior. |
| `SHOW_WEBAPP_CLOSE_BUTTON` | `true` | `false` | Controls the WebApp close button and JavaScript close bridge. |
| `SHOW_LANGUAGE_POPUP` | `true` | `false` | Controls whether `MainActivity` ever shows the language-selection dialog. When disabled, every call site that would have opened the popup instead loads `BuildConfig.DEFAULT_LANGUAGE`. |
| `SHOW_SETTINGS_BUTTON` | `true` | `false` | Controls visibility of the settings-gear button on the home screen (the entry point to the language popup). |

There is also a string field, `DEFAULT_LANGUAGE`, empty for `standard` and set per-build for `standalone` via the `standaloneDefaultLanguage` Gradle project property (see below). It must exactly match (case-insensitive) a `languageInEnglishName` value already present in the bundled `web_apps_manifest.json`, since `WebAppDao.getSelectedlanguageWebApps` filters on that column — check the manifest rather than assuming a value, since `languageInEnglishName` isn't always the English form (the current bundled manifest uses `"isiZulu"` for both `language` and `languageInEnglishName`).

## Package Rename

The standalone build skill is still responsible for renaming Java packages, Gradle namespace/application id, tests, manifest references, and JSON/config references from `org.curiouslearning.allSA_maharishi` to `org.curiouslearning.allSA_maharishi` when you want the full package specialization.

Source directories now live under:

```text
app/src/main/java/org/curiouslearning/container/
app/src/test/java/org/curiouslearning/container/
app/src/androidTest/java/org/curiouslearning/container/
```

## Removed SDK Integrations

Facebook and Google Play Install Referrer are now gated by BuildConfig:

- Standard keeps the existing Facebook and Install Referrer flows.
- Standalone disables Facebook initialization, deferred app-link handling, Install Referrer startup, and the `com.android.vending.INSTALL_REFERRER` permission via the standalone manifest overlay.

Sentry is retained only in the standard flavor. Standalone removes the Sentry dependency and disables runtime initialization and capture calls through `ENABLE_SENTRY=false`.

Firebase analytics/crashlytics and Rive remain retained.

## Offline Content

Standalone builds load bundled content from:

```text
app/src/main/assets/web_apps_manifest.json
app/src/main/assets/CRWebPlayerJs/
app/src/main/assets/images/
```

Current manifest validation:

- 14 web app entries.
- 0 `FeedTheMonsterJS` entries.
- All manifest `/assets/...` paths exist locally.
- All `data=` book folders exist locally.
- All manifest icons exist under `assets/images/`.

`WebApp.java` uses `WebViewAssetLoader` in standalone mode. The domain in each manifest URL is parsed and mapped so URLs such as:

```text
https://<domain>/assets/CRWebPlayerJs/index.html?data=<book>
```

are served from:

```text
app/src/main/assets/CRWebPlayerJs/index.html
```

The standalone flavor also merges `app/src/standalone/AndroidManifest.xml` to strip the Facebook, Install Referrer, and Sentry manifest entries from the standalone variant.

## Build Verification

The repo now includes a standalone sanity check task:

```powershell
.\gradlew.bat :app:verifyStandaloneConfiguration
```

It validates:

- The `standalone` product flavor exists.
- All expected standalone `BuildConfig` gates are present and set to `false`.
- The standalone manifest overlay exists.

## Firebase

The standalone `applicationId` must be present in `app/google-services.json` for the Google Services plugin to process the standalone variant successfully.

## Runtime Gates

- `MyApplication.java`
  - Sentry initializes only when `ENABLE_SENTRY` is true in the standard flavor.

- `MainActivity.java`
  - Remote manifest update calls run only when `ENABLE_REMOTE_MANIFEST` is true.
  - Startup proceeds directly into the selected-language or language-picker flow without attribution startup.
  - Sentry capture calls run only when `ENABLE_SENTRY` is true.
  - Language popup and selected-language observers are de-duplicated before new observers are attached.
  - `showLanguagePopup()` is a no-op when `SHOW_LANGUAGE_POPUP` is false; every call site (first-launch fallback, invalid/missing referrer language, empty stored language) instead calls `loadDefaultLanguage()`, which loads and persists `BuildConfig.DEFAULT_LANGUAGE`.
  - The settings-gear button is hidden and unclickable when `SHOW_SETTINGS_BUTTON` is false.

- `WebApp.java`
  - Standalone builds do not block launch on missing internet.
  - Standalone builds map `/assets/` WebView requests through bundled app assets.
  - The close button and JavaScript close bridge are disabled when `SHOW_WEBAPP_CLOSE_BUTTON` is false.
  - Sentry capture calls run only when `ENABLE_SENTRY` is true.

- `BaseActivity.java`
  - Android back presses are consumed when `ALLOW_BACK_NAVIGATION` is false.

- `WebAppRepository.java` and `HomeViewModal.java`
  - Remote manifest fetch/update paths are no-ops when `ENABLE_REMOTE_MANIFEST` is false.
  - Standalone builds load bundled web app entries from `app/src/main/assets/web_apps_manifest.json`.

- `AppManifest.java`
  - Supports the standalone manifest object shape with `version` and `web_apps`.
  - Keeps backward compatibility with a raw JSON array of web app entries.

- `ImageLoader.java`
  - Supports local asset icon paths such as `assessment_icon_prod.png` or `images/assessment_icon_prod.png`.

## Repo Skill

The standalone build skill lives at:

```text
skills/standalone-android-build/
```

It accepts an old package and a new package, performs a dry-run package rename, applies the rename, validates local assets, removes standalone-disabled SDKs when requested by the workflow, and runs a standalone build.

For this package, the rename inputs were:

```text
old package: org.curiouslearning.allSA_maharishi
new package: org.curiouslearning.allSA_maharishi
```

## Verification Checklist

For standalone builds:

- `assembleStandaloneDebug` compiles.
- App launches without internet.
- Bundled manifest entries populate the app list.
- Manifest URLs load from bundled assets.
- Local icons render from `assets/images/`.
- Facebook classes are absent from source and standalone Gradle dependencies.
- Install Referrer classes are absent from source and standalone Gradle dependencies.
- Sentry is absent from the standalone dependency graph and runtime initialization is skipped.
- Remote manifest update calls no-op.
- WebApp close button and JavaScript close bridge do not exit the screen.
- Android back presses are consumed.
- Language popup never appears; the app loads `BuildConfig.DEFAULT_LANGUAGE` directly on first launch.
- Settings-gear button is not visible on the home screen.

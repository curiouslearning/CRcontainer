# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Curious Reader Container (CRcontainer / FTM) is an Android app that acts as a "launcher" web browser: it displays a manifest-driven grid of literacy sub-apps (Feed The Monster, Curious Reader, etc.) as icons and loads each one in a `WebView`. It was built so that users of the Unity-based Feed The Monster app could be routed into other web-based literacy apps without Google's in-app-ads-to-children restrictions forcing re-acquisition per app.

The base Java package is `org.curiouslearning.container`. Written in Java (min SDK 24, target/compile SDK 35, Java 17 toolchain).

## Build, Test, Run

All Gradle commands are run from the repo root. On Windows use `gradlew.bat`; the wrapper is also POSIX-executable (`./gradlew`).

```powershell
# Build
.\gradlew.bat assembleStandardDebug        # default/standard flavor, debug
.\gradlew.bat assembleStandardRelease
.\gradlew.bat assembleStandaloneDebug -PstandaloneDefaultLanguage=<languageInEnglishName>   # offline standalone flavor
.\gradlew.bat assembleStandaloneRelease -PstandaloneDefaultLanguage=<languageInEnglishName>

# Verify the standalone flavor's feature-gate contract
.\gradlew.bat :app:verifyStandaloneConfiguration

# Unit tests (Robolectric + JUnit + Mockito)
.\gradlew.bat :app:testDebugUnitTest
.\gradlew.bat :app:testStandardDebugUnitTest       # flavor-specific variant
.\gradlew.bat :app:testDebugUnitTest --tests "org.curiouslearning.container.AnalyticsUtilsCustomEventsTest"

# Coverage (Jacoco)
.\gradlew.bat jacocoTestReport
# Report at app/build/reports/jacoco/jacocoTestReport/html/index.html

# Instrumented tests (device/emulator required)
.\gradlew.bat connectedDebugAndroidTest

# Print the manifest API URL a given branch would resolve to
.\gradlew.bat :app:printApiUrl -PbuildBranch=<branch>
```

APK output paths follow the flavor: `app/build/outputs/apk/{standard,standalone}/{debug,release}/`.

CI/CD is CircleCI (`.circleci/config.yml`) running Fastlane (`app/fastlane/Fastfile`) on the `develop`/`main` branches: commits with "release" in the message build an AAB and upload to the Play Store (`beta` track from `main`, `internal` otherwise, plus a Slack notification and a Sentry release); other commits build and commit a debug APK back to the branch.

## Architecture

### Product flavors: standard vs. standalone

`app/build.gradle` defines a single `mode` flavor dimension with `standard` and `standalone` product flavors. Both compile the same source tree; behavior differences are driven entirely by a block of `BuildConfig` boolean flags declared per-flavor (`ENABLE_FACEBOOK`, `ENABLE_SENTRY`, `ENABLE_REMOTE_MANIFEST`, `ENABLE_INSTALL_REFERRER`, `REQUIRE_INTERNET_FOR_UNCACHED_CONTENT`, `ALLOW_BACK_NAVIGATION`, `SHOW_WEBAPP_CLOSE_BUTTON` — all `true` for standard, all `false` for standalone). See `docs/standalone-feature-flags.md` for the full flag-to-behavior table and which classes each flag gates.

- **standard**: online, fetches its web-app manifest remotely, uses Facebook SDK, Install Referrer, Sentry crash reporting, shows the language popup and settings button.
- **standalone**: fully offline. It ships its own bundled content (`app/src/main/assets/web_apps_manifest.json`, `CRWebPlayerJs/`, `images/`) and seeds Room from those assets instead of hitting the network. It merges `app/src/standalone/AndroidManifest.xml` to strip Facebook/Install Referrer/Sentry manifest entries, and flavor source sets (`app/src/standard/java/...`, `app/src/standalone/java/...`) hold flavor-specific implementations (e.g. `telemetry/SentryReporter.java`) so the standard flavor keeps Sentry while standalone compiles without the dependency at all. It also hides the settings button and never shows the language popup (`SHOW_SETTINGS_BUTTON`/`SHOW_LANGUAGE_POPUP=false`) — instead it auto-loads `BuildConfig.DEFAULT_LANGUAGE`, set at build time via `-PstandaloneDefaultLanguage=<languageInEnglishName>` (must match the manifest's actual `languageInEnglishName` value, not necessarily the English form — check the manifest rather than assume).
- The `verifyStandaloneConfiguration` Gradle task asserts the standalone flavor exists, all its `BuildConfig` flags are `false`, and the standalone manifest overlay is present — run it after touching flavor config.
- The standalone `applicationId` must also exist as an app entry in `app/google-services.json` or the Google Services plugin will fail for that variant.

### App flow

- `MyApplication` — process entry point; conditionally initializes Facebook SDK and Sentry based on `BuildConfig` flags. Rive is initialized automatically via `AndroidManifest.xml`'s `InitializationProvider`, not here.
- `MainActivity` — home/launcher screen. Shows a language picker and a grid (`RecyclerView` + `WebAppsAdapter`) of available sub-apps for the selected language, backed by `HomeViewModal` (ViewModel) → `WebAppRepository` → Room (`WebAppDatabase`/`WebAppDao`) with an optional Retrofit-backed remote refresh (`RetrofitInstance`/`ApiService`), gated by `ENABLE_REMOTE_MANIFEST`. Also owns install-referrer/UTM/deep-link capture and Firebase analytics session logging.
- `WebApp` (activity) — hosts the actual sub-app `WebView` for a selected tile. Injects a `WebAppInterface` as the `"Android"` JS bridge object so sub-apps can call back into native code (`cachedStatus`, `setContainerAppOrientation`, `closeWebView`, `logMessage`, `onMonsterEvolutionStateReceived`, etc.). `closeWebView` and the JS close bridge are gated by `SHOW_WEBAPP_CLOSE_BUTTON`; back-press consumption is gated by `ALLOW_BACK_NAVIGATION` in `BaseActivity`.
- `BaseActivity` — shared activity base (back-press gating, common lifecycle bits).

### Sub-app event bridge (`core/subapp`)

Sub-apps (FTM, etc.) report analytics/progress events back through the `WebAppInterface.logMessage(json)` JS bridge call, which is parsed into an `AppEventPayload`, validated by `AppEventPayloadValidator` (→ `ValidationResult`), then routed to `AppEventPayloadHandler` (`DefaultAppEventPayloadHandler`). The default handler writes to two Firestore collections:
- `user_sessions_data` — append-only per-event records.
- `summary_data` — one merged doc per `(cr_user_id, app_id)`, using `FieldValue.increment` sentinels for fields marked `"add"` in `payload.options` so concurrent writes (e.g. two events firing near-simultaneously) compose atomically server-side instead of read-modify-write races. Fields default to `"replace"` semantics.

Every write stamps `metadata.container_app_version` from `BuildConfig.VERSION_NAME`, and a one-shot Firestore listener stamps `synced_at` once a pending offline write is confirmed by the server (supports offline-first capture).

### Manifest / content model

Sub-apps are described by `WebApp` model rows (`data/model/WebApp.java`) with fields like `appId`, `appIconUrl`, `title`, `appUrl`, `language`, `languageInEnglishName`, sourced from either:
- Remote: `WebAppResponse` fetched via Retrofit from the branch-specific manifest API (`API_URL` in `BuildConfig`, chosen in `app/build.gradle` by `buildBranch` — `main` → prod manifest endpoint, else the testing-branch endpoint).
- Local/bundled: `AppManifest.getAllWebApps()` parses `app/src/main/assets/web_apps_manifest.json`, supporting both the `{ version, web_apps: [...] }` object shape and a legacy bare-array shape.

Either source is normalized into Room via `WebAppDatabase`/`WebAppDao`; the UI only ever reads from Room. Rows with null/blank `language`/`languageInEnglishName` must be filtered out before insertion into the sorted language maps the UI builds — a source of past crashes.

In standalone builds, `WebViewAssetLoader` serves the manifest's `appUrl` (`https://<domain>/assets/...`) from bundled APK assets rather than the network; the domain in the URL is just a routing token, not a live host.

### Skills (`skills/`)

This repo carries three Claude Code Skills (`SKILL.md` + scripts) used to automate standalone-build production — read the relevant `SKILL.md` before invoking its workflow:

- `skills/standalone-build-orchestrator/` — top-level orchestrator: given a package name + CRWebPlayer content language, downloads content, upserts the bundled manifest, and drives the other two skills through a full `assembleStandaloneDebug`.
- `skills/standalone-android-build/` — specializes the repo into a given package (Java package rename, standalone SDK removal, manifest cleanup, asset wiring) via `scripts/rename_android_package.py`.
- `skills/github-s3-content-pull/` — fetches individual content folders from `curiouslearning/CRWebPlayer` (default) or another public GitHub repo without cloning, via `scripts/github-s3-content-pull.mjs`. GitHub's API is used for directory listing; file bytes prefer a mirrored CDN/S3 host when `--cdn-base-url` is passed, falling back to GitHub only on a miss — this is what lets the orchestrator download many-book content runs without exhausting GitHub's rate limit.

Because these skills perform repo-wide package renames, `git status` may show large in-flight renames (`org.curiouslearning.container` → some other package) when a standalone build run is mid-flight or was left uncommitted — check `git status`/`git diff` before assuming the checked-out package name matches what's documented above.

## Notes

- CodeRabbit (`.coderabbit.yaml`) auto-reviews PRs against `develop`/`test`/`main` and expects tests, lint, and ≥70% coverage per-PR (warning-mode, non-blocking).
- Test coverage is currently very thin (`docs/test_coverage_report.md`): most logic lives untested inside `MainActivity`/`WebApp`; only `AnalyticsUtils` has meaningful unit tests. Prefer extracting testable helpers over adding logic directly to those two activities.
- Slack webhook credentials (`SLACK_AES_KEY`) are only injected into the APK on CI for release commits on `develop`/`main` — they are not present in local builds.

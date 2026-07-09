---
name: standalone-android-build
description: Specialize the Curious Reader Android container repo into a standalone APK/build when the user asks to create a standalone build, remove disabled SDK packages, rename the Android applicationId/namespace/Java package, configure local bundled web content, or run final standalone Gradle verification. Use for tasks involving new standalone package names, standalone source-set cleanup, Facebook/Sentry/Install Referrer removal, WebViewAssetLoader setup, local manifest validation, and standalone build handoff.
---

# Standalone Android Build

## Required Inputs

Before mutating files, collect or infer:

- `new_package_name`: required, Java package format, e.g. `org.curiouslearning.container.hausa`.
- `standalone_domain`: required only when configuring local bundled content, e.g. `hausa_assessments_facilitators.androidplatform.net`.
- `default_language`: required when configuring local bundled content — the exact `languageInEnglishName` value already present in the bundled `web_apps_manifest.json` entries (check the manifest; this is not always the English form, e.g. the current manifest uses `isiZulu` for both `language` and `languageInEnglishName`). Passed to Gradle as `-PstandaloneDefaultLanguage=<default_language>`. Standalone builds have `SHOW_LANGUAGE_POPUP=false`, so without this the app loads an empty screen on first launch.
- `app_display_name`: optional; use existing app name if not provided.
- `remove_sentry`: default false unless the user asks for full SDK removal.
- `remove_firebase`: default false; Firebase is retained by the original standalone guide.
- `build_task`: default `assembleStandaloneDebug`.

If `new_package_name` is missing, ask for it before editing.

## Workflow

1. Inspect the repo first.
   - Read `app/build.gradle`, `app/src/main/AndroidManifest.xml`, `docs/standalone-feature-flags.md`, and current Java package paths.
   - Confirm the feature flags already exist before removing SDK code.

2. Rename package identity.
   - Prefer the helper script:
     ```powershell
     python skills/standalone-android-build/scripts/rename_android_package.py --repo-root . --old-package org.curiouslearning.container --new-package <new_package_name> --apply
     ```
   - The script updates package declarations/import references, `namespace`, `applicationId`, manifest package references, and Java source directory paths.
   - Run it first without `--apply` for a dry run when the worktree is dirty or the package rename is large.

3. Remove standalone-disabled packages.
   - Remove `implementation 'com.facebook.android:facebook-android-sdk:17.0.0'`.
   - Remove `implementation "com.android.installreferrer:installreferrer:2.2"` if install referrer code is deleted or moved out of the standalone source path.
   - If `remove_sentry` is true, remove Sentry dependency, Sentry Gradle plugin, Sentry config block, imports, initialization, and capture calls.
   - Do not remove Firebase unless explicitly requested.

4. Clean manifest for standalone.
   - Remove Facebook metadata.
   - Remove Sentry metadata if Sentry is removed.
   - Remove `com.android.vending.INSTALL_REFERRER` permission if install referrer is removed.
   - Keep the Rive `InitializationProvider`.
   - Keep core launch activities unless the user asks for a different entry flow.

5. Clean source code.
   - Remove imports and methods that only exist for removed SDKs.
   - If code must remain for the standard flavor, move SDK-specific implementations into flavor source sets instead of breaking standard builds.
   - Keep existing feature gates unless the user asks for a standalone-only fork.

6. Configure local content when requested.
   - Ensure `app/src/main/assets/web_apps_manifest.json` has `appUrl` domains matching `standalone_domain`.
   - Confirm `WebViewAssetLoader` derives its domain from the manifest `appUrl` host and serves `/assets/` from app assets.
   - Confirm bundled manifest loading is wired through `WebAppRepository` when `ENABLE_REMOTE_MANIFEST` is false.
   - Verify every local URL path maps to a real file under `app/src/main/assets/`.
   - Do not invent content folders; ask for missing bundled asset locations.
   - Confirm `default_language` matches a `languageInEnglishName` value actually present in the manifest — this is what `-PstandaloneDefaultLanguage` will feed into `BuildConfig.DEFAULT_LANGUAGE`.

7. Verify.
   - Search for stale old package references and removed SDK references.
   - Run the requested Gradle task, usually:
     ```powershell
     .\gradlew.bat assembleStandaloneDebug -PstandaloneDefaultLanguage=<default_language>
     ```
   - If `default_language` was not provided, still run `:app:verifyStandaloneConfiguration` and surface its `DEFAULT_LANGUAGE` warning rather than silently shipping a build with no default.
   - If Gradle cannot run due local permissions or missing cache access, report the exact failure and leave the code ready for local verification.

## Safety Rules

- Do not touch unrelated dirty files.
- Do not remove standard build behavior unless the user asks for a standalone-only fork.
- Do not mass-delete SDK files until all references are either removed or moved into flavor-specific source sets.
- Do not change signing credentials.
- Do not modify generated build outputs.

## Final Response

Report:

- New package name.
- SDKs removed or retained.
- Manifest cleanup completed.
- Local content/WebViewAssetLoader status.
- Default language set (`-PstandaloneDefaultLanguage` value) or a note that it was omitted.
- Build command run and result.
- Any stale references or manual follow-up items.

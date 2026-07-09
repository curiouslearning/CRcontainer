# Curious Reader Standalone Reference

Current repo already has a `mode` flavor dimension with `standard` and `standalone` flavors. Standalone currently disables behavior with `BuildConfig` gates:

- `ENABLE_FACEBOOK=false`
- `ENABLE_SENTRY=false`
- `ENABLE_REMOTE_MANIFEST=false`
- `ENABLE_INSTALL_REFERRER=false`
- `REQUIRE_INTERNET_FOR_UNCACHED_CONTENT=false`
- `ALLOW_BACK_NAVIGATION=false`
- `SHOW_WEBAPP_CLOSE_BUTTON=false`
- `SHOW_LANGUAGE_POPUP=false`
- `SHOW_SETTINGS_BUTTON=false`

Standalone also sets a string `DEFAULT_LANGUAGE` BuildConfig field (via the `standaloneDefaultLanguage` Gradle project property) since `SHOW_LANGUAGE_POPUP=false` means the app never gives the user a chance to pick one. This must equal the `languageInEnglishName` value used in the bundled `web_apps_manifest.json` entries for that build — check the manifest rather than assuming the English form, since `prepare-crwebplayer-content.mjs` can be run with `--local-name`/`--english-name` set to the same value (the current bundled manifest uses `"isiZulu"` for both fields, not `"Zulu"`).

Known standalone follow-up work:

- Remove Facebook dependency and manifest metadata.
- Remove Install Referrer dependency, permission, and source references if standalone no longer needs attribution code.
- Optionally remove Sentry dependency/plugin/config when a full standalone cleanup is requested.
- Preserve Firebase unless explicitly requested otherwise.
- Current develop branch supports `WebViewAssetLoader` in standalone mode by deriving the domain from each manifest `appUrl`.
- Current develop branch loads bundled web app entries from `app/src/main/assets/web_apps_manifest.json` when remote manifests are disabled.
- Current develop branch supports local asset icon filenames in standalone manifests.
- Ensure `web_apps_manifest.json` domains exactly match the asset-loader domain.

Important files:

- `app/build.gradle`
- `app/src/main/AndroidManifest.xml`
- `app/src/main/java/org/curiouslearning/container/MyApplication.java`
- `app/src/main/java/org/curiouslearning/container/MainActivity.java`
- `app/src/main/java/org/curiouslearning/container/WebApp.java`
- `app/src/main/java/org/curiouslearning/container/presentation/base/BaseActivity.java`
- `app/src/main/assets/web_apps_manifest.json`
- `docs/standalone-feature-flags.md`

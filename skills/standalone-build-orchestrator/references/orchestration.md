# Standalone Build Orchestration

Use this sequence for requests such as:

```text
let's make a standalone build using this package name: org.curiouslearning.allSA_maharishi and with CRWebPlayerJs isiZulu language content
```

Inputs to extract:

- Package name: Java package, e.g. `org.curiouslearning.allSA_maharishi`.
- CRWebPlayer language: e.g. `isiZulu`, `Zulu`, `Hausa`, `Luganda`.
- Optional domain: default `maharishi_cr-ftm-standalone.androidplatform.net`.

Workflow:

1. Announce the package, language, repo, branch, and manifest domain.
2. Run content preparation in dry-run/list mode:

```powershell
node skills/standalone-build-orchestrator/scripts/prepare-crwebplayer-content.mjs --language isiZulu
```

3. Download the CRWebPlayer runtime, matched BookContent folders, and upsert the manifest:

```powershell
node skills/standalone-build-orchestrator/scripts/prepare-crwebplayer-content.mjs --language isiZulu --download-runtime --download --write-manifest
```

   By default this fetches each book's `content.json` from the CDN (`--content-cdn-base`, default
   `https://curiousreaderdev.curiouscontent.org`) and downloads every referenced asset from there
   too, using GitHub only for the initial language-match listing — this is what fixes the GitHub
   rate-limit exhaustion a large multi-book run used to hit. A book falls back to the GitHub-driven
   walk automatically if its `content.json` isn't on the CDN; pass `--no-content-cdn` to force the
   old pure-GitHub path for the whole run. See `standalone-build-orchestrator/SKILL.md`'s "Content
   download strategy" section for details.

4. Inspect the changed manifest and validate local assets.
   - Confirm runtime validation reports `index.html`, `manifest.json`, `dist/app.js`, and `dist/index.html`.
   - Confirm the helper reported an icon for each matched book.
   - Do not ask the user for icon filenames unless no suitable image exists in `app/src/main/assets/images/`.
   - Confirm `language` and `languageInEnglishName` are inferred from the requested language or provided explicitly with `--local-name` and `--english-name`.
5. Run the standalone Android build skill:
   - Read `skills/standalone-android-build/SKILL.md`.
   - Use its package rename and SDK cleanup workflow with the requested package name.
   - If the package is already renamed, report that and continue with validation/build steps.
6. Run, passing the manifest's actual `languageInEnglishName` value (read it back from `web_apps_manifest.json` after the manifest write — don't assume it matches the alias table's English form) as the standalone default language:

```powershell
.\gradlew.bat assembleStandaloneDebug -PstandaloneDefaultLanguage=isiZulu
```

   `SHOW_LANGUAGE_POPUP` and `SHOW_SETTINGS_BUTTON` are both `false` in the standalone flavor, so this is the only way the app knows which language to load on first launch.

7. Summarize:
   - Matched/downloaded book folders.
   - Manifest entries added or already present.
   - Package rename result.
   - SDK removals/gates applied by standalone build skill.
   - Default language passed to Gradle.
   - Gradle build status and APK path.
   - The Manual Checklist from `standalone-build-orchestrator/SKILL.md` (service-worker-free `dist/`
     build, real `google-services.json` registration) — every run, success or not.

Progress output style:

- Keep updates short and ordered.
- Name each book being downloaded, e.g. `Downloading ChakusCycleIsiZulu`.
- Distinguish `already present`, `downloaded via CDN`, `downloaded via GitHub fallback`, `manifest added`, and `manifest already present`.
- Report validation failures before running Gradle.

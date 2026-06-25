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

4. Inspect the changed manifest and validate local assets.
   - Confirm runtime validation reports `index.html`, `manifest.json`, `dist/app.js`, and `dist/index.html`.
   - Confirm the helper reported an icon for each matched book.
   - Do not ask the user for icon filenames unless no suitable image exists in `app/src/main/assets/images/`.
   - Confirm `language` and `languageInEnglishName` are inferred from the requested language or provided explicitly with `--local-name` and `--english-name`.
5. Run the standalone Android build skill:
   - Read `skills/standalone-android-build/SKILL.md`.
   - Use its package rename and SDK cleanup workflow with the requested package name.
   - If the package is already renamed, report that and continue with validation/build steps.
6. Run:

```powershell
.\gradlew.bat assembleStandaloneDebug
```

7. Summarize:
   - Matched/downloaded book folders.
   - Manifest entries added or already present.
   - Package rename result.
   - SDK removals/gates applied by standalone build skill.
   - Gradle build status and APK path.

Progress output style:

- Keep updates short and ordered.
- Name each book being downloaded, e.g. `Downloading ChakusCycleIsiZulu`.
- Distinguish `already present`, `downloaded`, `manifest added`, and `manifest already present`.
- Report validation failures before running Gradle.

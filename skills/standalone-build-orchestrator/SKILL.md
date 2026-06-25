---
name: standalone-build-orchestrator
description: Orchestrate a complete Curious Reader Android standalone build from a requested package name and CRWebPlayer language content. Use when the user asks to make, prepare, package, or build a standalone APK with BookContent from GitHub, web_apps_manifest.json entries, package renaming, standalone SDK cleanup, and final Gradle assembly; especially for prompts like "make a standalone build using package name X with CRWebPlayerJs isiZulu content".
---

# Standalone Build Orchestrator

## Overview

Coordinate the repo-local `github-content-folder` and `standalone-android-build` skills to produce a content-ready Android standalone build. This skill handles content discovery/download, manifest packaging, standalone package specialization, and final Gradle verification.

## Inputs

Extract these from the user request:

- `package_name`: required Java package, for example `org.curiouslearning.allSA_maharishi`.
- `language`: required CRWebPlayer BookContent language token, for example `isiZulu`, `Zulu`, `Hausa`, or `Luganda`.
- `domain`: optional manifest host; default `maharishi_cr-ftm-standalone.androidplatform.net`.
- `repo` and `branch`: optional GitHub content source; default `curiouslearning/CRWebPlayer` on `develop`.

If package or language is missing, ask one concise question.

## Required Skills

Use these sibling repo-local skills during execution:

- `skills/github-content-folder/SKILL.md` for GitHub BookContent folder listing/download.
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
7. Run the final standalone build:

```powershell
.\gradlew.bat assembleStandaloneDebug
```

8. Final response must include:
   - Package name.
   - Matched/downloaded books.
   - Manifest entries added or already present.
   - Standalone build skill actions performed.
   - Gradle result and APK path.

## Content Helper

Use `scripts/prepare-crwebplayer-content.mjs` for deterministic content work. It:

- Lists `BookContent` from GitHub.
- Downloads CRWebPlayer runtime files from the same GitHub repo: root `index.html`, root `manifest.json`, and root `dist/`.
- Matches folders by case-insensitive normalized language token and known aliases.
- Downloads missing matched folders through `github-content-folder`.
- Validates the local BookContent shape.
- Upserts `web_apps_manifest.json` entries using `?book=<BookContentFolder>`.
- Infers `appIconUrl` from real files in `app/src/main/assets/images/` using a normalized fuzzy match against the BookContent folder name, with production icon filenames preferred over dev/copy variants.
- Infers manifest title text from the BookContent folder name and the English language name.
- Preserves content under `app/src/main/assets/CRWebPlayerJs/BookContent/<BookName>/`.
- Preserves runtime files under `app/src/main/assets/CRWebPlayerJs/`, with `dist/` kept as `CRWebPlayerJs/dist/`.

The script is intentionally separate from the Android package rename so content problems are visible before project-wide changes.

## Progress Style

Provide concise ordered updates:

- `Content discovery`: matched N folders.
- `Runtime files`: `already present` or `download index.html`, `download manifest.json`, `download dist`.
- `Content download`: `already present` or `download <BookName>`.
- `Manifest`: added N entries, total N.
- `Fallback`: `remote listing rate-limited; using local books` when applicable.
- `Standalone build`: package rename/cleanup status.
- `Gradle`: build command and result.

Be explicit about blockers such as GitHub API rate limits, missing content folders, manifest mismatches, or Gradle wrapper lock permissions.

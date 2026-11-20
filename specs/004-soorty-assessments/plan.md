# Implementation Plan: Soorty APK Letter Sounds & Sight Words Assessments

**Branch**: `feature/soorty-assessment-apk` | **Date**: 2026-11-20 | **Spec**: [spec.md](./spec.md) | **Jira**: [CLT-167](https://curiouslearning.atlassian.net/browse/CLT-167)

**Input**: Feature specification from `/specs/004-soorty-assessments/spec.md`

## Summary

Ship the six production assessments (`english|urdu|pashto` × `lettersounds|sightwords`) in the `soorty`
flavor, fully offline, in both ways production runs them:

1. **Standalone** — catalog tiles open a packaged assessment-survey-js production build
   (`app/src/soorty/assets/assessment/`).
2. **Embedded** — the player compiled into the packaged FTM bundle (`@curiouslearning/assessment-survey` 1.3.0)
   opens over the game.

Both read one shared content folder, `app/src/soorty/assets/feedthemonster/assessment-survey/`, laid out exactly as
FTM's own webpack build copies it from `node_modules`. The container change is limited to `LocalWebContent`
(serve that folder when the flavor packages it), `WebApp` exit handling for finished standalone assessments
(CLT-175), and seeding two Statsig gates in the packaged pages so offline behaviour matches production:
`mr-75` (results reach the container) and `drag-drop-assessment-ui` (new UI).

## Technical Context

**Language/Version**: Java (Android app, `app/src/main/java`); Node.js packaging scripts (`tools/*.js`); packaged web bundles are prebuilt JS.

**Primary Dependencies**: AndroidX WebKit `WebViewAssetLoader` (via `LocalWebContent`), `@curiouslearning/assessment-survey` 1.3.0, FTM `main` (`0a0920d`, embeds 1.3.0), `@curiouslearning/features` (Statsig; local cache namespace `CRFeatureFlags`).

**Storage**: APK assets; WebView `localStorage` for seeded flags; Firestore offline queue for results (existing).

**Testing**: JUnit unit tests (`app/src/test`), `./gradlew testSoortyDebugUnitTest`; headless Chromium harness serving packaged assets as `LocalWebContent` does (no network); on-device QA for CLT-167 acceptance.

**Target Platform**: Android phones used in the Soorty pilot (Pakistan), offline.

**Project Type**: mobile-app (single Gradle module `app`, product flavor `soorty`).

**Performance Goals**: standalone loading screen clears in ~3 s offline (measured headless); no added work on the Play Store flavor.

**Constraints**: fully offline from first launch; no service worker; no change to MWF flavors or Play Store build; APK size (shared content ~37 MB + 0.9 MB page).

**Scale/Scope**: 6 assessments, 3 languages, 2 entry points.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. WebView Sub-App Boundary & Isolation | ✅ | Sub-app web bundles are unmodified (packaging-time HTML seed only). Catalog change is manifest data. Asset serving stays in `LocalWebContent`. |
| II. SOLID | ⚠️ justified | Completion detection is its own class (`core/subapp/completion/StandaloneAssessmentCompletion`). Exit timing/settle logic lives in `WebApp` (Activity) — see Complexity Tracking. |
| III. Composition over Inheritance | ✅ | No new hierarchies; write tracking via `AppEventWriteCallback`. |
| IV. Idiomatic Java & Android | ✅ | Main-thread `Handler`, UI-thread `closeWebView` (CLT-175 fix), no new dependencies. |
| V. Layered packages | ✅ | New class under `core/subapp/completion`; asset code stays in `utilities`. |
| VI. Secure, validated bridge | ✅ | Payloads still go through existing validators; completion check rejects malformed payloads (unit-tested). Gated on `BuildConfig.OFFLINE_STANDALONE` and app key `assessment`. |
| Quality gate: tests for bridge-facing change | ✅ | `StandaloneAssessmentCompletionTest`, `LocalWebContentTest`. |

## Project Structure

### Documentation (this feature)

```text
specs/004-soorty-assessments/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── assessment-packaging-contract.md
├── checklists/
│   └── requirements.md
└── tasks.md
```

### Source Code (repository root)

```text
app/
├── build.gradle                                   # soorty flavor (Urdu + Pashto + English)
└── src/
    ├── main/java/org/curiouslearning/container/
    │   ├── WebApp.java                            # standalone-assessment exit (CLT-175)
    │   ├── core/subapp/completion/
    │   │   └── StandaloneAssessmentCompletion.java
    │   └── utilities/LocalWebContent.java         # serve packaged assessment-survey/
    ├── mwfShared/assets/feedthemonster/           # packaged FTM (shared by mwf* and soorty)
    │   ├── feedTheMonster.js                      # embeds assessment-survey 1.3.0
    │   ├── index.html                             # offline seeds (is_cached, mr-75, drag-drop-assessment-ui)
    │   └── PACKAGE_INFO.json
    ├── soorty/assets/
    │   ├── web_apps_manifest.json                 # catalog (soorty-3): 6 assessment tiles
    │   ├── images/assessment_{letter_sounds,sight_words}.png
    │   ├── assessment/                            # standalone page: index.html, bundle.js, PACKAGE_INFO.json
    │   └── feedthemonster/
    │       ├── assessment-survey/{data,audio,img,css,animation}/   # shared content
    │       └── lang/{urdu,pashto}/
    └── test/java/org/curiouslearning/container/
        ├── core/subapp/completion/StandaloneAssessmentCompletionTest.java
        └── utilities/LocalWebContentTest.java
tools/
├── package-ftm.js                                 # SEEDED_GATES
├── package-assessment.js                          # SEEDED_GATES, packaging of the 6 keys
└── patches/assessment-survey-js-standalone-sw-attribute.patch
docs/SOORTY_ASSESSMENTS.md
```

**Structure Decision**: Single Android module with the `soorty` product flavor's asset source set; shared FTM in
`mwfShared`; packaging scripts in `tools/`. No new top-level packages.

## Phase Sequencing

1. Phase 0 — Research: confirm production assessment set and versions ([research.md](./research.md)).
2. Phase 1 — Design: content layout + URL contract ([contracts/](./contracts/assessment-packaging-contract.md), [data-model.md](./data-model.md)).
3. Phase 2 — Tasks: [tasks.md](./tasks.md) (US1 catalog → US2 offline/new UI → US3 embedded → polish/QA).

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Exit/settle timers in `WebApp` (Activity) rather than a separate collaborator (Principle II) | Needs the Activity's `WebView`, `Handler` and `finish()`; scoped to `OFFLINE_STANDALONE` + app key `assessment` (CLT-175) | Extracting a lifecycle-aware controller is the right follow-up but not required for the pilot build; recorded as T034 |
| Seeding Statsig gates in packaged HTML instead of changing sub-app code | Sub-apps are independently versioned (Principle I); offline the gates can't be fetched | Rebuilding FTM / assessment-survey-js with forced flags would diverge from production source |

# Research: Soorty APK Assessments (CLT-167)

**Date**: 2026-11-20 | **Plan**: [plan.md](./plan.md)

## R1 — Which assessments are in production for English, Urdu, Pashto?

- **Decision**: Six data keys: `english-lettersounds`, `english-sightwords`, `urdu-lettersounds`, `urdu-sightwords`, `pashto-lettersounds`, `pashto-sightwords`.
- **Evidence**: assessment-survey-js `origin/main` = `cfc0183` (no newer commits on 2026-11-20); `public/data/` lists these six for the three languages. npm `@curiouslearning/assessment-survey` dist-tag `latest` = `1.3.0`, and its `public/data/` has the same keys. FTM `origin/main` `package-lock.json` pins assessment-survey `1.3.0`. Spellings exists only for Hausa.
- **Alternatives considered**: Only Urdu + Pashto (Ashwin's 17 Nov list in CLT-167) — rejected: English Letter Sounds / Sight Words are in production too.

## R2 — Is the packaged content identical to production?

- **Decision**: Yes. No content changes needed.
- **Evidence**: SHA-1 of every file in `app/src/soorty/assets/feedthemonster/assessment-survey/` (497 files) compared with the npm 1.3.0 tarball: binaries identical; text files (CSS, JSON, SVG) identical after CR/LF normalisation (Windows working tree); `img/peekingMonster.js` is a minified copy (not loaded at runtime). Every `itemName` in the six data files has an audio file (letter sounds 50/36/42 items, sight words 100 each).

## R3 — Does the packaged FTM embed the production assessment player?

- **Decision**: Yes.
- **Evidence**: `mwfShared/assets/feedthemonster/PACKAGE_INFO.json` → source FTM `0a0920d` (merge #2031), `src/` identical to `origin/main` (`04020663`), assessment-survey 1.3.0. Bundle contains `assessment-survey` asset path, `assessment_data_key`, `assessmentlevels`, `drag-drop-assessment-ui`.
- FTM resolves the data key from `cr_lang` + assessment type and probes `assessment-survey/data/<key>.json` with `HEAD`; on failure it falls back to `zulu-lettersounds`, so the HEAD probe must return 200 for the three languages.

## R4 — Why did the APK show the old assessment UI?

- **Decision**: Seed `CRFeatureFlags` → `gate:drag-drop-assessment-ui = { __value: true }` in both packaged pages, alongside the existing `gate:mr-75` seed.
- **Rationale**: assessment-survey-js resolves its UI in `App.resolveAssessmentUIMode()`: explicit config (`assessment-ui-mode` attribute / `assessmentUIMode` URL param) wins, else `featureFlagsService.isFeatureEnabled('drag-drop-assessment-ui')`. Offline, Statsig `initializeAsync` fails and `checkGate` returns false → `legacy`. `@curiouslearning/features` 1.3.1 checks its local cache (`CRFeatureFlags`, key `gate:<name>`) first; an entry with no `__expiresAt` never expires; `false` is never cached, so a seeded `true` is honoured offline and online.
- **Alternatives considered**:
  - `assessment-ui-mode="new-ui"` on the embedded element — requires rebuilding FTM (element is created in `assessment-player-element.ts`); rejected.
  - `&assessmentUIMode=new-ui` on catalog URLs — fixes standalone only; embedded still legacy; rejected.
  - Rebuild bundles with flag defaults — diverges from production source; rejected.
- **Verified**: headless Chromium, no network, all six keys × both modes → body wrapper `.as-ui-mode-new`, stylesheet `css/drag-drop-style.css`, drag-drop answer choices rendered.

## R5 — Serving the shared folder to the embedded player

- **Decision**: `LocalWebContent` opens a file under `feedthemonster/assessment-survey/` first and returns the fast 404 only when it is genuinely absent.
- **Rationale**: MWF flavors do not ship the folder and rely on the fast 404 so FTM skips the assessment; soorty ships it and must serve it.

## R6 — Standalone page offline

- **Decision**: Production standalone build from `cfc0183` + `tools/patches/assessment-survey-js-standalone-sw-attribute.patch` (`data-enable-service-worker="false"`), asset base `/assets/feedthemonster/assessment-survey`, gsap CDN tag removed, `mr-75` and `drag-drop-assessment-ui` seeds.
- **Rationale**: production page waits on `navigator.serviceWorker.ready` (Workbox from a CDN), which never resolves offline.

## R7 — Embedded assessment in FTM vs gameplay problems (CLT-167 open question)

- **Decision**: Include the embedded assessment (Ashwin, 2026-11-20).
- **Risk**: earlier standalone APKs removed it because it disrupted FTM gameplay. FTM `main` has since added gameplay pause while an assessment runs (FM-939) and assessment flow fixes (FM-882, FM-945). Needs on-device confirmation → tasks T030; record outcome on CLT-167.

## R8 — Survey content

- **Decision**: Survey out of scope (needs internet). Note: the npm package's `img/survey/` (~17 MB) is copied into the shared content by the packager although no survey data key ships; pruning it is optional (T033).

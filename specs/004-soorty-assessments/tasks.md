---

description: "Task list for CLT-167 — Soorty APK assessments"
---

# Tasks: Soorty APK Letter Sounds & Sight Words Assessments (CLT-167)

**Input**: Design documents from `/specs/004-soorty-assessments/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/assessment-packaging-contract.md), [quickstart.md](./quickstart.md)

**Tests**: Included for the bridge-facing container changes (constitution quality gate); acceptance is CLT-167's on-device scenarios.

**Organization**: Grouped by user story (US1 catalog P1, US2 offline + new UI P1, US3 FTM-embedded P2). `[X]` = done on `feature/soorty-assessment-apk` as of 2026-11-20.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency on an incomplete task)
- **[Story]**: US1–US3
- Paths are relative to the repository root

---

## Phase 1: Setup

- [X] T001 Confirm the production assessment set: assessment-survey-js `main` (`cfc0183`), npm `@curiouslearning/assessment-survey` `latest` = 1.3.0, FTM `main` pins 1.3.0 → six keys for English/Urdu/Pashto (research R1)
- [X] T002 [P] Add `tools/patches/assessment-survey-js-standalone-sw-attribute.patch` (`data-enable-service-worker` attribute, default `true`)
- [X] T003 [P] Update the `soorty` flavor comment in `app/build.gradle` (Urdu + Pashto + English)

---

## Phase 2: Foundational (blocks all stories)

- [X] T004 Write `tools/package-assessment.js`: copy `css/ img/ animation/ data/ audio/` for the requested keys into `app/src/soorty/assets/feedthemonster/assessment-survey/`, standalone page into `app/src/soorty/assets/assessment/`, rewrite asset base, drop gsap CDN tag, inject flag seed, write `PACKAGE_INFO.json`, report missing audio
- [X] T005 Package the six keys (`english|urdu|pashto` × `lettersounds|sightwords`) into `app/src/soorty/assets/feedthemonster/assessment-survey/` and `app/src/soorty/assets/assessment/` (`PACKAGE_INFO.json.missingAudio = []`)
- [X] T006 `app/src/main/java/org/curiouslearning/container/utilities/LocalWebContent.java`: open files under `feedthemonster/assessment-survey/` before the known-absent rule; fast 404 only for genuinely missing files (MWF flavors unchanged)
- [X] T007 [P] `app/src/test/java/org/curiouslearning/container/utilities/LocalWebContentTest.java`: keep known-absent-directory and candidate-path coverage for `assessment-survey/`
- [X] T008 Verify shared content equals npm 1.3.0 `public/` for the six keys (SHA-1, CR/LF-normalised) and every `itemName` has audio (research R2)

**Checkpoint**: content packaged and servable.

---

## Phase 3: User Story 1 — Six assessments from the catalog (P1) 🎯 MVP

**Goal**: CLT-167 scenarios "English / Urdu / Pashto assessments run".

**Independent Test**: quickstart Level 4 steps 2–3.

- [X] T009 [P] [US1] Add `app/src/soorty/assets/images/assessment_letter_sounds.png` and `assessment_sight_words.png` (production icons)
- [X] T010 [US1] Add six assessment tiles (appId 9101–9106, `app_id: "assessment"`, `?data=<key>`) after each language's FTM tile in `app/src/soorty/assets/web_apps_manifest.json`; bump version to `soorty-3`
- [X] T011 [P] [US1] `app/src/main/java/org/curiouslearning/container/core/subapp/completion/StandaloneAssessmentCompletion.java`: recognise `user_sessions_data` / `activity_completed` from app key `assessment` (CLT-175)
- [X] T012 [P] [US1] `app/src/test/java/org/curiouslearning/container/core/subapp/completion/StandaloneAssessmentCompletionTest.java`: completion signal, non-signals, malformed payloads, standalone-only (CLT-175)
- [X] T013 [US1] `app/src/main/java/org/curiouslearning/container/WebApp.java`: when `OFFLINE_STANDALONE` and app key `assessment`, wait for bridge writes to settle (≤5 s ack, 10 s cap), keep end screen 3 s, log `app_exit`, load `about:blank`, finish to catalog; `closeWebView` on UI thread (CLT-175)
- [X] T014 [US1] Headless offline run of `/assets/assessment/index.html?data=<key>` for all six keys: loading clears ~3 s, questions render in the right script, item audio requested, no asset misses
- [ ] T015 [US1] On-device: open both tiles for Urdu, Pashto, English; each starts and plays its language's audio prompts (CLT-167 scenarios 1–3)

**Checkpoint**: US1 deliverable once T015 passes.

---

## Phase 4: User Story 2 — Offline and new UI (P1)

**Goal**: CLT-167 scenario "Assessments without internet" + new drag-and-drop UI on never-online phones.

**Independent Test**: quickstart Level 4 step 1–3 in airplane mode from first launch.

- [X] T016 [US2] Standalone page offline: no service worker (`data-enable-service-worker="false"`), no CDN script, shared asset base (T004)
- [X] T017 [US2] Seed `gate:mr-75` in `app/src/soorty/assets/assessment/index.html` so results reach the container offline
- [X] T018 [US2] Add `SEEDED_GATES = ['mr-75', 'drag-drop-assessment-ui']` to `tools/package-assessment.js` (seed script + `PACKAGE_INFO.json.indexHtmlChanges`)
- [X] T019 [P] [US2] Add `SEEDED_GATES` to `tools/package-ftm.js` (seed script + `PACKAGE_INFO.json.indexHtmlSeeds`)
- [X] T020 [US2] Apply the `drag-drop-assessment-ui` seed to the already-packaged `app/src/soorty/assets/assessment/index.html` and `app/src/mwfShared/assets/feedthemonster/index.html`; update both `PACKAGE_INFO.json`
- [X] T021 [US2] Headless offline run, all six keys × standalone/embedded, no injected state: `.as-ui-mode-new`, `css/drag-drop-style.css`, drag-drop answer choices
- [X] T022 [P] [US2] Document the new-UI seed in `docs/SOORTY_ASSESSMENTS.md`
- [ ] T023 [US2] On-device, airplane mode before first launch: all six assessments start, audio plays, new UI shows (CLT-167 scenario 4)

---

## Phase 5: User Story 3 — Assessment embedded in FTM (P2)

**Goal**: FTM opens the assessment of its current language over the game, offline, new UI, then continues.

**Independent Test**: quickstart Level 4 step 4.

- [X] T024 [US3] Confirm packaged `app/src/mwfShared/assets/feedthemonster/feedTheMonster.js` is built from FTM `main` source and embeds assessment-survey 1.3.0 (research R3)
- [X] T025 [US3] Package Pashto FTM language: `app/src/soorty/assets/feedthemonster/lang/pashto/`
- [X] T026 [US3] Headless: `HEAD /assets/feedthemonster/assessment-survey/data/<cr_lang>-<type>.json` → 200 for all three languages (no fallback to `zulu-lettersounds`)
- [X] T027 [US3] Headless: `<assessment-survey-player>` inside the packaged FTM page loads each of the six keys, renders questions, plays item audio (only miss: FTM's own `sw.js`, intentionally not shipped)
- [ ] T028 [US3] On-device: embedded assessment per language via debug **Assessment** button, then via a Statsig-configured level after one online launch
- [ ] T029 [US3] On-device: after the embedded assessment closes, FTM resumes the level; no stuck overlay, audio or input issues across several levels
- [ ] T030 [US3] Re-check the gameplay problems that removed the embedded assessment from earlier standalone APKs (Ashish's question on CLT-167); record outcome and decision on CLT-167

---

## Phase 6: Polish & Cross-Cutting

- [ ] T031 Run `./gradlew testSoortyDebugUnitTest assembleSoortyRelease` and confirm Play Store / mwfCongo / mwfAngola unit tests still pass
- [ ] T032 Commit the new-UI seed changes (`tools/package-ftm.js`, `tools/package-assessment.js`, both `index.html`, both `PACKAGE_INFO.json`, `docs/SOORTY_ASSESSMENTS.md`) and this spec on `feature/soorty-assessment-apk`; open PR referencing CLT-167
- [ ] T033 [P] Optional: stop packaging `assessment-survey/img/survey/` (~17 MB, incl. a `.zip`) — survey is out of scope (FR-011); verify no assessment references it
- [ ] T034 [P] Optional follow-up: extract standalone-assessment exit/settle logic from `WebApp` into a `core/subapp/completion` collaborator (Complexity Tracking, Principle II)
- [ ] T035 [P] Optional: rebuild FTM with production `.env` and re-run `tools/package-ftm.js` so embedded-assessment Firebase events are sent
- [ ] T036 Update CLT-167 with: six assessments included (English confirmed in production), embedded + standalone, new UI offline, survey excluded, QA results

---

## Dependencies & Execution Order

- Phase 1 → Phase 2 → stories. US1 and US2 share T004–T006; US3 depends on T006 and T020.
- On-device tasks T015, T023, T028–T030 can run in one QA session on the same build (after T031).
- T032 before T036.

## Parallel Example

```text
T009, T011, T012 (different files) in parallel
T018, T019, T022 in parallel; T020 after T018/T019
T033, T034, T035 independent optional follow-ups
```

## Implementation Strategy

MVP = US1 + US2 (catalog assessments, offline, new UI). US3 ships in the same build but its trigger needs one online launch (Statsig `assessmentlevels`) and needs the gameplay re-check (T030) before sign-off.

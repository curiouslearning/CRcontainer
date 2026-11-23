# Feature Specification: Soorty APK Letter Sounds & Sight Words Assessments (English, Urdu, Pashto)

**Feature Branch**: `feature/soorty-assessment-apk`

**Created**: 2026-11-20

**Status**: Implemented — awaiting on-device QA

**Jira**: [CLT-167](https://curiouslearning.atlassian.net/browse/CLT-167) (epic [CLT-164](https://curiouslearning.atlassian.net/browse/CLT-164) — Standalone .APK for Soorty partnership in Pakistan)

**Input**: User description: "Include in the Soorty release every assessment that is available in production for English, Urdu and Pashto (Letter Sounds and Sight Words). The assessments must load in the Soorty standalone APK, both as separate assessment apps and as the assessment embedded inside Feed The Monster (FTM), and must show the new assessment UI."

## Clarifications

### Session 2026-11-20

- Q: Which assessments count as "available in production" for these languages? → A: The data keys shipped in `@curiouslearning/assessment-survey` 1.3.0 (npm `latest`, the version FTM `main` embeds) and assessment-survey-js `main` (`cfc0183`): `english|urdu|pashto` × `lettersounds|sightwords` — six assessments. No other assessment type (e.g. spellings) exists for these languages; spellings exists only for Hausa.
- Q: Where are English Letter Sounds and Sight Words? (open item in CLT-167, comment of 2026-11-17) → A: Both are in production in the same package (`english-lettersounds`, `english-sightwords`); they are included.
- Q: Should the APK include the assessment built into FTM, or only the separate assessment apps? (open question from Ashish in CLT-167) → A: Both, per Ashwin (2026-11-20): the separate assessment apps from the catalog **and** the FTM-embedded assessment, matching production. Earlier standalone APKs removed the embedded assessment because it caused FTM gameplay problems; re-confirming that this is resolved is tracked as a QA task (T030) and should be recorded on CLT-167.
- Q: Which assessment UI should show? → A: The new drag-and-drop UI, as in production (Statsig gate `drag-drop-assessment-ui` is on). Offline the gate cannot be fetched, so the APK must not fall back to the legacy UI.
- Q: Is the survey (Pashto FTM Survey / Parent Survey) in scope? → A: No. It is a Google Form needing internet; the Soorty APK must work fully offline (Creesen, 2026-11-10). Added later only if Creesen asks (CLT-167 comment, 2026-11-17).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Run the six assessments from the catalog (Priority: P1) 🎯 MVP

A Soorty pilot tester opens the APK, picks a language (English, Urdu or Pashto) and opens that language's Letter Sounds assessment and then its Sight Words assessment from the catalog. Each starts, plays its prompts in that language and can be completed.

**Why this priority**: This is the CLT-167 story itself: children in the pilot need the assessments.

**Independent Test**: Install the APK on a test phone; for each language open both assessment tiles; each starts and plays its audio prompts.

**Acceptance Scenarios** (CLT-167):

1. **Given** the APK is installed on a test phone, **When** the tester opens English Letter Sounds and then English Sight Words, **Then** each assessment starts and plays its English audio prompts.
2. **Given** the APK is installed on a test phone, **When** the tester opens Urdu Letter Sounds and then Urdu Sight Words, **Then** each assessment starts and plays its Urdu audio prompts.
3. **Given** the APK is installed on a test phone, **When** the tester opens Pashto Letter Sounds and then Pashto Sight Words, **Then** each assessment starts and plays its Pashto audio prompts.

---

### User Story 2 - Assessments work with no internet (Priority: P1)

The pilot runs on phones that may never be online. Every assessment must start, show its content and play audio without a network connection, including on a phone that has never been online since install.

**Why this priority**: Fully-offline operation is a hard requirement for the Soorty APK (Creesen, 2026-11-10) and is a CLT-167 acceptance scenario.

**Independent Test**: Put the phone in airplane mode before first launch; open any of the six assessments.

**Acceptance Scenarios**:

1. **Given** the test phone has no internet connection, **When** the tester opens any of the six assessments, **Then** the assessment starts and its audio plays (CLT-167).
2. **Given** a phone that has never been online, **When** an assessment opens, **Then** it shows the new (drag-and-drop) assessment UI, not the legacy UI.

---

### User Story 3 - Assessment embedded in Feed The Monster (Priority: P2)

While a child plays FTM in English, Urdu or Pashto, FTM opens its built-in assessment at the levels production configures. The assessment shows over the game in that language, with the new UI, and FTM continues the level afterwards.

**Why this priority**: Matches production behaviour and was explicitly requested; it is secondary to the catalog assessments because the trigger depends on remote configuration (see Edge Cases).

**Independent Test**: Open FTM in each language and reach an assessment level (or use FTM's dev "Assessment" button in debug mode); the assessment for that language loads over the game with the new UI and FTM resumes after it closes.

**Acceptance Scenarios**:

1. **Given** FTM is opened in English/Urdu/Pashto, **When** FTM starts its embedded assessment, **Then** the matching `<language>-lettersounds` or `<language>-sightwords` assessment loads (not a fallback language) and plays audio.
2. **Given** the phone is offline, **When** the embedded assessment opens, **Then** it loads from the APK and shows the new UI.
3. **Given** the embedded assessment ends or is closed, **When** control returns to FTM, **Then** the level continues and FTM gameplay is not disrupted.

---

### Edge Cases

- **FTM trigger needs remote config**: when FTM opens an embedded assessment is decided by the Statsig dynamic config `assessmentlevels`. A phone that has never been online has no config, so FTM schedules no embedded assessment until it has been online once. Catalog assessments are unaffected.
- **Asset requested that is not packaged**: the container answers 404 quickly (no hang); FTM skips an assessment whose data probe fails rather than dimming the game behind a player that cannot load.
- **Feature flags never fetched**: the APK must behave as production with flags on (new UI, results reach the container) rather than as flags off.
- **Statsig later returns a value online**: the seeded "on" value is kept (the flag library caches `true` and never caches `false`); acceptable while the new UI is on in production.
- **Standalone assessment finishes**: the screen returns the learner to the catalog after a short delay (delivered under CLT-175, required here so a finished assessment does not strand the child).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The APK MUST include every production assessment for English, Urdu and Pashto: Letter Sounds and Sight Words for each (six data keys).
- **FR-002**: Assessment content (data, audio, images, styles, animations) MUST be identical to the production release (`@curiouslearning/assessment-survey` 1.3.0); every item in each assessment MUST have its audio packaged.
- **FR-003**: The catalog MUST list, for each language, a Letter Sounds and a Sight Words assessment tile next to that language's FTM tile.
- **FR-004**: Each catalog tile MUST open a standalone assessment page that runs fully from the APK, with no network requests needed to start, play audio or finish.
- **FR-005**: FTM's embedded assessment MUST load the assessment of FTM's current language from the APK, using the same packaged content as the standalone page.
- **FR-006**: Both the standalone and the embedded assessment MUST show the new drag-and-drop UI even when feature flags cannot be fetched.
- **FR-007**: Assessment results MUST reach the container through the existing bridge offline (the Android bridge gate `mr-75` must be on without network).
- **FR-008**: A finished standalone assessment MUST return the learner to the catalog; an embedded assessment MUST hand control back to FTM without closing it.
- **FR-009**: Changes for the Soorty flavor MUST NOT change behaviour of the Play Store build or the other offline flavors (mwfCongo, mwfAngola).
- **FR-010**: Packaging MUST be reproducible from documented commands, and record its source version and content in `PACKAGE_INFO.json`.
- **FR-011**: The survey MUST NOT be offered in the APK (needs internet).

### Key Entities

- **Assessment data key**: `<language>-<type>`, language ∈ {english, urdu, pashto}, type ∈ {lettersounds, sightwords}. Identifies a data JSON and its audio folder.
- **Shared assessment content**: data, audio, images, CSS and animations used by both the standalone page and the FTM-embedded player.
- **Catalog entry**: a tile in the flavor's web-apps manifest (title, icon, language, URL with `?data=<key>`, `app_id: "assessment"`).
- **Seeded feature flags**: local-storage values (`CRFeatureFlags`) written by the packaged pages so offline evaluation matches production.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 6 of 6 assessments open from the catalog on a test phone and play audio in the correct language.
- **SC-002**: 6 of 6 assessments open and play audio with the phone offline, including on a phone never connected since install.
- **SC-003**: 0 missing assets (data, audio, image) when any assessment runs offline in either mode.
- **SC-004**: 100% of assessment sessions offline show the new drag-and-drop UI.
- **SC-005**: Standalone assessment loading screen clears within ~5 seconds offline on the test phone.
- **SC-006**: Embedded assessment in FTM completes for each language and FTM resumes the level with no gameplay regressions reported in pilot QA.

## Assumptions

- "Production" means assessment-survey-js `main` / npm `@curiouslearning/assessment-survey` 1.3.0 and FTM `main` as of 2026-11-20.
- The drag-and-drop UI gate is on in production for these languages.
- Catalog `appId`s 9101–9106 are local keys; they can be swapped for production ids if analytics must match.
- Firebase events from the FTM-embedded assessment are not required for the pilot (the packaged FTM was built without production's `.env`); results still reach the container.
- On-device verification is done by the pilot tester / QA; development verification used headless Chromium serving the packaged files the way the container does.

---

description: "Task list template for feature implementation"
---

# Tasks: Consume Manifest app_id

**Input**: Design documents from `/specs/001-consume-manifest-app-id/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/bridge-and-firestore-contract.md](./contracts/bridge-and-firestore-contract.md), [quickstart.md](./quickstart.md)

**Tests**: Included for User Story 3 only. `DefaultAppEventPayloadHandler` and `AppEventPayloadValidator` are the bridge-facing validation/handler classes the project constitution (Principle VI / Development Workflow) requires unit tests for whenever they're added or modified. No test tasks are generated for User Stories 1–2 — those changes (a Room field, an intent extra, an `AppContext` key) follow existing, already-untested plumbing patterns in this codebase (e.g. no test exists today for `WebApp`'s other Gson-mapped fields or for `WebApp.getIntentData()`), so adding new test scaffolding for them would be new abstraction this feature's explicit "small footprint, reuse, don't over-abstract" direction argues against; User Story 3's tests plus the manual `quickstart.md` walkthrough (Polish phase) cover them end-to-end instead.

**Organization**: Tasks are grouped by user story. Despite priority labels US1=P1, US2=P2, US3=P1, the phase order below is the **dependency** order (US1 → US2 → US3), not raw priority order — spec.md's own "Why this priority" notes make this a strict pipeline: US2 has no observable effect until US1 exists, and US3's Independent Test requires a known current_app_id, which only US1+US2 together produce. See Dependencies section.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Every task includes its exact file path

## Path Conventions

Single Android module at repository root: `app/src/main/java/org/curiouslearning/container/...` and `app/src/test/java/org/curiouslearning/container/...` (test package stays flat, matching the existing two test files — it does not mirror the main source's sub-packages).

---

## Phase 1: Setup

**Purpose**: Confirm no new dependencies are needed before touching code

- [X] T001 Confirm `app/build.gradle` needs no new or version-bumped dependencies for this feature — Room, Retrofit2/Gson, and the Firebase Firestore SDK already used by `WebApp`/`RetrofitInstance`/`DefaultAppEventPayloadHandler` cover everything this feature touches; make no changes to `app/build.gradle` and note this confirmation in the PR description (constitution: new third-party dependencies must be justified — this feature adds none)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The one piece of shared state both User Story 2 (sets it) and User Story 3 (reads it) need to exist first

**⚠️ CRITICAL**: T002 must be done before any User Story 2 or User Story 3 task

- [X] T002 Add `CURRENT_APP_ID` constant to the `AppContextKey` enum in `app/src/main/java/org/curiouslearning/container/core/context/AppContextKey.java`, alongside `LANGUAGE`, `CAMPAIGN_ID`, `SOURCE`, `HOSTNAME`

**Checkpoint**: Foundation ready — User Story 1 can start immediately (doesn't need T002); User Stories 2 and 3 are unblocked once T002 lands.

---

## Phase 3: User Story 1 - Sub-app catalog carries the manifest's app_id (Priority: P1) 🎯 build first

**Goal**: The manifest's `app_id` per sub-app entry is parsed and persisted in the existing on-device catalog storage, retrievable without re-fetching the manifest.

**Independent Test**: Refresh the app catalog from a manifest whose entries include `app_id` (see [quickstart.md](./quickstart.md) §1), then inspect the stored `web_app_table` rows and confirm each entry's `app_id` column is present and matches the manifest.

### Implementation for User Story 1

- [X] T003 [US1] Add a nullable `app_id` `String` field with getter (`getApp_id`) and setter (`setApp_id`) to the `WebApp` Room entity in `app/src/main/java/org/curiouslearning/container/data/model/WebApp.java` — keep the field name `app_id` (snake_case) so Gson maps the manifest's `app_id` JSON key directly with no `@SerializedName`, matching the precedent already set by `AppEventPayload.app_id` for cross-boundary identifiers (data-model.md)
- [X] T004 [P] [US1] Bump `@Database(entities = { WebApp.class }, version = 2)` to `version = 3` in `app/src/main/java/org/curiouslearning/container/data/database/DatabaseHelper.java` — no `Migration` class needed, the existing `.fallbackToDestructiveMigration()` already handles the bump for this disposable, network-resynced catalog cache (research.md §1)
- [X] T005 [US1] In `app/src/main/java/org/curiouslearning/container/data/remote/RetrofitInstance.java`, after `findWebApps(...)` parses the entry list in both `getAppManifest` and `getUpdatedAppManifest`, add a `Log.d("AppConfig", ...)` line reporting how many of the parsed entries have a non-blank `app_id` out of the total (e.g. `"Manifest app_id coverage: 2/3 entries"`) — depends on T003 for `WebApp.getApp_id()` to exist

**Checkpoint**: Catalog storage now carries `app_id`; verify via quickstart.md §1 before continuing.

---

## Phase 4: User Story 2 - Launching a sub-app establishes the current app identifier (Priority: P2)

**Goal**: When a learner launches a sub-app, its stored `app_id` is captured into the in-memory `current_app_id` (via `AppContext`) before the sub-app can report any data.

**Independent Test**: Launch any sub-app from the catalog and confirm (via logcat, `WebApp` tag) that `AppContextKey.CURRENT_APP_ID` is set to that sub-app's stored `app_id` — see [quickstart.md](./quickstart.md) §2.

### Implementation for User Story 2

- [X] T006 [US2] In `app/src/main/java/org/curiouslearning/container/presentation/adapters/WebAppsAdapter.java`'s launch `Intent` construction (`onBindViewHolder`'s click listener), add `intent.putExtra("app_id", webApps.get(position).getApp_id())` alongside the existing `title`/`language`/`languageInEnglishName` extras, plus a `Log.d("WebAppsAdapter", ...)` line naming the `app_id` placed on the intent (mirroring the existing local-dev-override debug log in that file) — depends on T003
- [X] T007 [US2] In `app/src/main/java/org/curiouslearning/container/WebApp.java`'s `getIntentData()`, read `intent.getStringExtra("app_id")` and, when non-blank, call `AppContext.getInstance().set(AppContextKey.CURRENT_APP_ID, ...)` at the same point `AppContextKey.HOSTNAME` is set today; when blank/absent, do **not** set the key (leave it absent rather than storing an empty string — "MUST NOT guess," data-model.md "Absent case"). Add a `Log.d("WebApp", ...)` line naming the value set, or noting it was left unset — depends on T002 and T006. **Implementation note**: the blank/absent branch explicitly calls `AppContext.getInstance().remove(AppContextKey.CURRENT_APP_ID)` rather than merely skipping the `set()` — leaving a previous sub-app's value untouched would violate FR-005 (current_app_id must be replaced, not left stale, on every launch).

**Checkpoint**: current_app_id is now established on every sub-app launch; verify via quickstart.md §2 before continuing.

---

## Phase 5: User Story 3 - Firestore operations trust the container's app identifier, not the sub-app's (Priority: P1)

**Goal**: Every Firestore read/write on behalf of the active sub-app resolves `app_id` through the fixed order — current_app_id, then the payload's own `app_id`, then the literal `"unknown"` — logging a warning whenever it falls back past current_app_id, and never guessing.

**Independent Test**: From an active sub-app, submit a payload whose own `app_id` differs from (or omits) current_app_id and confirm the resulting Firestore read/write uses current_app_id; then with current_app_id unset, confirm the two-tier fallback and its warning logs — see [quickstart.md](./quickstart.md) §3–4.

### Tests for User Story 3 ⚠️

> Write these tests FIRST; confirm they fail against the current (pre-T010/T011) code before implementing.

- [X] T008 [P] [US3] New `app/src/test/java/org/curiouslearning/container/AppEventPayloadValidatorTest.java` (JUnit4, no Robolectric needed — `AppEventPayloadValidator` and `AppEventPayload` are plain objects): assert `validate()` still fails on missing `cr_user_id`/`collection`/`data`/`timestamp`, and now **passes** when `app_id` is null or blank (all other required fields present)
- [X] T009 [P] [US3] `resolveAppId` is package-private, so — deviating from the flat-package path sketched below — this test lives at `app/src/test/java/org/curiouslearning/container/core/subapp/handler/DefaultAppEventPayloadHandlerTest.java` (mirroring the main source package) instead of the flat `org.curiouslearning.container` package. (`@RunWith(RobolectricTestRunner.class)`, following `AnalyticsUtilsCustomEventsTest.java`'s setup pattern for a real `Context`/`AppContext.init(...)`; the handler is constructed with a blank `cr_user_id` so its constructor's Firestore prefetch short-circuits with no Firebase mocking needed): asserts the resolution order — (a) `AppContextKey.CURRENT_APP_ID` set → that value is used, no warning logged; (b) key unset, `payload.app_id` present → payload's value is used and one `Log.w` occurs; (c) key unset and `payload.app_id` blank/null → the literal `"unknown"` is used and one `Log.w` occurs

### Implementation for User Story 3

- [X] T010 [US3] In `app/src/main/java/org/curiouslearning/container/core/subapp/validation/AppEventPayloadValidator.java`, remove the `if (isEmpty(payload.app_id)) { return ValidationResult.failure("Missing app_id"); }` check — depends on T008 (test written first)
- [X] T011 [US3] In `app/src/main/java/org/curiouslearning/container/core/subapp/handler/DefaultAppEventPayloadHandler.java`, add a private `resolveAppId(AppEventPayload payload)` method implementing the fixed order: `resolveContextString(AppContextKey.CURRENT_APP_ID, null)` first (used silently if non-null); else `payload.app_id` if non-blank, logging `Log.w(TAG, "current_app_id unavailable — falling back to payload app_id")`; else the literal `"unknown"`, logging `Log.w(TAG, "current_app_id and payload app_id both unavailable — defaulting app_id to \"unknown\"")`. No other source or heuristic (research.md §6) — depends on T009 (test written first) and T002. **Implementation note**: declared package-private (no modifier), not `private`, so `DefaultAppEventPayloadHandlerTest` (same package) can call it directly without reflection.
- [X] T012 [US3] **Implementation note**: rather than editing all four `payload.app_id` read sites individually, `handle()` now does `payload.app_id = resolveAppId(payload);` once, at the top, before its own `Log.d` line and before `storePayload(payload)` is called — every downstream read (`storeUserSessionPayload`'s `record.put("app_id", ...)`, `storeSummaryPayload`'s `record.put("app_id", ...)`, and both `.whereEqualTo("app_id", ...)` clauses) then already sees the resolved value with zero further changes. Same outcome as the original per-site plan, smaller diff — depends on T011
- [X] T013 [US3] In `storePayload`'s existing required-field guard, drop `payload.app_id == null || payload.app_id.trim().isEmpty()` from the condition (an `app_id` is now always resolvable via T011/T012, never a rejection reason) — keep the `cr_user_id`/`collection` checks unchanged — depends on T010, T012

**Checkpoint**: All three user stories complete and independently verifiable — run the full [quickstart.md](./quickstart.md) before considering the feature done.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T014 [P] **Not completed in this session** — requires a running device/emulator, a manifest source actually serving `app_id`, and Firestore console access, none of which are available headlessly here. Automated equivalents were run instead: `./gradlew testDebugUnitTest` (full suite, all green, including T008/T009) and a successful `compileDebugJavaWithJavac`. Run [quickstart.md](./quickstart.md) end-to-end on a debug build (all four sections) before considering this feature fully verified.
- [X] T015 [P] Done inline while implementing T007/T011/T012 rather than as a separate pass: `WebApp.java`'s `getIntentData()` gained an "MR-217" comment block right at the `CURRENT_APP_ID` capture (adjacent to the `HOSTNAME` set call), and `DefaultAppEventPayloadHandler.java` gained a full Javadoc on `resolveAppId` plus an inline comment in `handle()` explaining the single-resolution-point design (T012's note above) — both already current, no stale text found to update.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: No dependency on Setup's outcome; can run in parallel with Phase 1. Blocks Phase 4 and Phase 5 (both need `AppContextKey.CURRENT_APP_ID`) but not Phase 3.
- **User Story 1 (Phase 3)**: No dependency on Phase 2. Blocks Phase 4 (needs `WebApp.getApp_id()`) and, transitively, Phase 5.
- **User Story 2 (Phase 4)**: Depends on Phase 2 (T002) and Phase 3 (T003). Blocks Phase 5 (US3's tests/implementation exercise `AppContextKey.CURRENT_APP_ID`, which only has a real value once US2 sets it).
- **User Story 3 (Phase 5)**: Depends on Phase 2, 3, and 4 all being complete — this is the pipeline's payoff step and cannot be meaningfully tested without current_app_id already flowing.
- **Polish (Phase 6)**: Depends on Phase 5 complete.

This feature does **not** follow "user stories can proceed in parallel" — despite US1/US3 sharing priority P1, the three stories form a single linear pipeline (see spec.md's own "Why this priority" notes on each story).

### Parallel Opportunities

- T001 (Setup) and T002 (Foundational) have no shared file or data dependency and can run in parallel.
- Within Phase 3: T004 (`DatabaseHelper.java`) can run in parallel with T003 (`WebApp.java`) — different files, no code dependency between them (T005 depends on T003 only).
- Within Phase 5: T008 and T009 (the two new test files) can run in parallel with each other.

---

## Parallel Example: Phase 3 (User Story 1)

```bash
# T003 and T004 touch different files and have no dependency on each other:
Task: "Add nullable app_id field + getter/setter to WebApp entity in app/src/main/java/org/curiouslearning/container/data/model/WebApp.java"
Task: "Bump DatabaseHelper @Database version 2 -> 3 in app/src/main/java/org/curiouslearning/container/data/database/DatabaseHelper.java"
```

---

## Implementation Strategy

### Build in pipeline order (this feature has no independent-parallel stories)

1. Complete Phase 1 (Setup) and Phase 2 (Foundational) — Phase 2 can run alongside Phase 1.
2. Complete Phase 3 (User Story 1) — **stop and verify** via quickstart.md §1 (catalog rows carry `app_id`).
3. Complete Phase 4 (User Story 2) — **stop and verify** via quickstart.md §2 (current_app_id set on launch).
4. Complete Phase 5 (User Story 3), tests first (T008, T009) — **stop and verify** via quickstart.md §3–4 (Firestore attribution + fallback warnings).
5. Complete Phase 6 (Polish) — full quickstart.md pass.

There is no meaningful "MVP-with-just-one-story" cut here: User Story 1 alone has no externally observable effect (nothing yet reads the stored `app_id`), and User Story 2 alone only feeds a value nothing yet consumes. The feature's actual value (spec SC-001–SC-005) lands only once Phase 5 is complete — each earlier phase's "Independent Test" is an engineering checkpoint, not a shippable increment on its own.

---

## Notes

- No test tasks were generated for User Story 1 or 2, per the Tests note at the top — this is a deliberate reuse/small-footprint choice, not an oversight.
- `[P]` tasks touch different files and have no dependency on each other.
- `[Story]` label maps every phase-3+ task to its user story for traceability.
- Verify each Phase 5 test (T008, T009) fails against pre-change code before writing T010/T011.
- Commit after each task or logical group.
- Stop at any checkpoint to run that phase's quickstart.md section before continuing.

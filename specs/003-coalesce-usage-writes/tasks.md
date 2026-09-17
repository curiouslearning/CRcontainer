---

description: "Task list template for feature implementation"
---

# Tasks: Coalesce Sub-App Usage Writes

**Input**: Design documents from `/specs/003-coalesce-usage-writes/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/usage-write-coalescing-contract.md), [quickstart.md](./quickstart.md)

**Tests**: Included. `plan.md`'s Technical Context commits to shipping unit tests alongside this feature (unlike
MR-182's explicit waiver), and `quickstart.md` Level 1 names the exact test files expected to exist.

**Organization**: Tasks are grouped by user story (spec.md priorities: US1/US2/US3 are all P1, US4 is P2) so
each can be implemented and validated independently, per [plan.md](./plan.md)'s Phase Sequencing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency on an incomplete task)
- **[Story]**: Which user story this task belongs to (US1–US4)
- File paths are exact, relative to the repository root

## Path Conventions

Single Android Gradle module `app`, layer-first packages under `org.curiouslearning.container` (see
[plan.md](./plan.md) Project Structure):

- Production: `app/src/main/java/org/curiouslearning/container/...`
- Tests: `app/src/test/java/org/curiouslearning/container/...`

---

## Phase 1: Setup

**Purpose**: Establish a clean baseline before any change lands.

- [X] T001 Run `gradlew compileDebugJavaWithJavac testDebugUnitTest lint` on the unmodified branch and record
      the result (pass/fail counts, lint baseline) so later polish tasks (T026, T029) have something to diff
      against. No files change.
      **Result**: `compileDebugJavaWithJavac` ✅, `testDebugUnitTest` ✅ (all existing tests pass), `lintDebug`
      ❌ pre-existing — 3 errors / 81 warnings, all `NotificationPermission` (Picasso `RemoteViewsAction`,
      unrelated to this feature). Baseline captured via `git stash` so it reflects the truly unmodified tree.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The seams every user story's implementation depends on — the widened flusher contract and the
new persistence layer for buffered-but-unflushed time (per [research.md](./research.md) D3, D7 and
[data-model.md](./data-model.md) §1).

**⚠️ CRITICAL**: No user story implementation task may begin until this phase is complete.

- [X] T002 [P] Add `default void flushPending() {}` to `SubAppUsageFlusher` in
      `app/src/main/java/org/curiouslearning/container/core/usage/flush/SubAppUsageFlusher.java`, with a
      javadoc note that only a coalescing implementation overrides it (research.md D7)
- [X] T003 [P] Create the immutable `PendingUsageWrite` value class (`appKey`, `language`, `crUserId`,
      `cappedSeconds`, `rawSeconds`, a `key()` matching `appKey + "::" + language.toLowerCase(Locale.ROOT)`,
      and `hasUsableIdentity()`) in
      `app/src/main/java/org/curiouslearning/container/core/usage/flush/PendingUsageWrite.java` (data-model.md §1)
- [X] T004 [P] Create the `PendingUsageWriteStore` interface (`loadAll()`, `save(PendingUsageWrite)`,
      `delete(String key)`) in
      `app/src/main/java/org/curiouslearning/container/core/usage/flush/PendingUsageWriteStore.java`
      (mirrors `OpenStretchStore`)
- [X] T005 Implement `SharedPreferencesPendingUsageWriteStore` — its own prefs file
      `sub_app_usage_pending_writes`, one `␟`-delimited, version-prefixed string value per record (5 fields:
      appKey, language, crUserId, cappedSeconds, rawSeconds), unparseable entries skipped and logged, not
      thrown — in
      `app/src/main/java/org/curiouslearning/container/core/usage/flush/SharedPreferencesPendingUsageWriteStore.java`
      (depends on T003, T004; mirrors `SharedPreferencesOpenStretchStore`; data-model.md "Serialised form")
- [X] T006 Write `SharedPreferencesPendingUsageWriteStoreTest` (Robolectric): a saved record round-trips
      unchanged through `save`/`loadAll`; a malformed stored string is skipped, not thrown; `delete` is a
      no-op for an absent key — in
      `app/src/test/java/org/curiouslearning/container/core/usage/flush/SharedPreferencesPendingUsageWriteStoreTest.java`
      (depends on T005)

**Checkpoint**: The persistence layer and the widened flusher contract exist and are tested. User story
implementation can now begin.

---

## Phase 3: User Story 1 - Rapid switching doesn't flood the write pipeline (Priority: P1) 🎯 MVP

**Goal**: Batch drained stretches per `appKey::language` in memory; send them to Firestore only on a genuine
session end (`isFinishing()`) or a periodic interval (default 5 minutes) — never on a transient
background/foreground toggle.

**Independent Test**: [quickstart.md](./quickstart.md) Level 2 — rapidly Home/reopen a sub-app 10+ times in
under a minute; confirm no Firestore write occurs during the toggling, and exactly one occurs once the sub-app
is genuinely finished (or the interval elapses).

### Tests for User Story 1

- [X] T007 [P] [US1] Write `CoalescingUsageFlusherTest` covering: folding one segment persists a
      `PendingUsageWrite` and calls `onQueued()` synchronously; folding a second segment sums into the same
      record; the heartbeat ticker starts on the first fold into an empty buffer and stops once the buffer is
      emptied by a flush; `flushPending()` on a non-empty buffer forces an immediate delegate flush, empties
      the buffer, and deletes the persisted record on the delegate's `onQueued()`; `flushPending()` on an
      empty buffer is a no-op (no delegate call); a delegate `onFailed()` leaves the persisted record and the
      ticker running for retry — in
      `app/src/test/java/org/curiouslearning/container/core/usage/flush/CoalescingUsageFlusherTest.java`
      (depends on T002–T006)

### Implementation for User Story 1

- [X] T008 [US1] Implement `CoalescingUsageFlusher` (constructor-injects a delegate `SubAppUsageFlusher`, a
      `PendingUsageWriteStore`, and a `HeartbeatTicker`; `DEFAULT_FLUSH_INTERVAL_MS = 5 * 60 * 1000L` with a
      package-private test constructor for a custom interval, per research.md D5/D8) satisfying T007 — in
      `app/src/main/java/org/curiouslearning/container/core/usage/flush/CoalescingUsageFlusher.java`
      (depends on T007)
- [X] T009 [US1] Implement `CoalescingUsageFlushers`, a process-wide static registry keyed by
      `appKey::language` handing out one lazily-created `CoalescingUsageFlusher` per key (mirrors
      `SubAppUsageTimers` exactly, per research.md D2) — in
      `app/src/main/java/org/curiouslearning/container/core/usage/flush/CoalescingUsageFlushers.java`
      (depends on T008)
- [X] T010 [US1] Change `SubAppUsageTracker.onStop(boolean changingConfigurations)` to
      `onStop(boolean changingConfigurations, boolean finishing)`; in the internal `flush()` path, call
      `flusher.flushPending()` when `finishing` is true, after handing off the just-drained segment (both when
      the segment is empty and when it isn't) — in
      `app/src/main/java/org/curiouslearning/container/core/usage/SubAppUsageTracker.java` (depends on T002)
- [X] T011 [US1] In `SubAppUsageTracker.create()`, resolve the flusher via
      `CoalescingUsageFlushers.getInstance(appKey, language, crUserId)` instead of
      `new FirestoreUsageFlusher(crUserId)` directly (respect the existing `flusherOverride` test hook) — same
      file as T010 (depends on T009, T010)
- [X] T012 [US1] Pass `isFinishing()` through: `usageTracker.onStop(isChangingConfigurations(), isFinishing())`
      — in `app/src/main/java/org/curiouslearning/container/WebApp.java` (depends on T010)
- [X] T013 [US1] Device validation: run [quickstart.md](./quickstart.md) Level 2 end-to-end and confirm the
      expected logcat/Firestore behavior (depends on T011, T012)
      **Result**: Run on a real emulator (`sdk_gphone64_x86_64`, this branch's debug build). Opened
      feed-the-monster, toggled Home/reopen 10x over ~30s — `sub_app_usage_pending_writes.xml` showed the
      buffered total (69s) growing with **no** `UsageFlusher: Flushed` line. Closing the sub-app for real
      produced exactly **one** `Flushed` line (`cappedSeconds=143, rawSeconds=143`, the coalesced sum), and
      both `sub_app_usage_pending_writes.xml` and `sub_app_usage_open_stretches.xml` were empty afterward.

**Checkpoint**: Rapid foreground/background toggling produces a bounded number of writes. User Story 1 is
independently functional and testable.

---

## Phase 4: User Story 2 - Coalesced totals are exactly correct (Priority: P1)

**Goal**: Lock down that coalescing never changes recorded totals: the per-segment cap (MR-178/MR-180) is
never re-applied to a coalesced sum, and the raw duration accompanies the capped duration on every flush.

**Independent Test**: [quickstart.md](./quickstart.md) Level 1 (`CoalescingUsageFlusherTest`) and Level 3 —
two individually-capped 20-minute segments folded into one flush write 40 minutes, not 30.

### Tests for User Story 2

- [X] T014 [US2] Extend `CoalescingUsageFlusherTest` with: two segments each pre-capped at a (test) per-segment
      maximum fold to a summed total equal to their sum, never re-capped to that maximum (the spec's own
      20+20=40 example); every flush produced by the flusher carries both a capped and a raw duration, with
      raw always `>= capped` — same file as T007
      (`app/src/test/java/org/curiouslearning/container/core/usage/flush/CoalescingUsageFlusherTest.java`,
      depends on T008)
- [X] T015 [US2] Extend `CoalescingUsageFlusherTest` with a total-equality assertion: the sum of capped seconds
      across N folds followed by one flush equals the sum of what N independent, uncoalesced flushes would
      have written — same file (depends on T014)

### Validation for User Story 2

- [X] T016 [US2] Device validation: run [quickstart.md](./quickstart.md) Level 3 (spot-check with the
      per-segment cap temporarily lowered in a debug build) (depends on T014, T015)
      **Result**: Per quickstart.md's own guidance, a real 30-minute-capped device run is impractical;
      relied on `CoalescingUsageFlusherTest.twoIndividuallyCappedSegmentsSumInFullNeverReCappedToASingleCap`
      (20+20=40, not re-capped to 20) for the arithmetic. The device run in T013 additionally spot-checks
      real coalesced summation (multiple folds summed to 143s in one write).

**Checkpoint**: Coalesced totals are verified correct and cap-preserving. User Stories 1 and 2 both work
independently.

---

## Phase 5: User Story 3 - Nothing is lost if the process dies with time only batched (Priority: P1)

**Goal**: Give the coalesced-but-unflushed buffer its own crash recovery path, independent of MR-182's
open-stretch marker, writing recovered time as ordinary duration — never through `cr_recovered_*`.

**Independent Test**: [quickstart.md](./quickstart.md) Level 4 — buffer time via a Home-button toggle
(no real Firestore write yet), force-kill the process, relaunch, and confirm the buffered amount appears via
`cr_duration_seconds`/`cr_duration_raw_seconds` with `cr_recovered_seconds`/`cr_recovered_count` unchanged.
Level 5 additionally confirms this survives a device reboot in between.

### Tests for User Story 3

- [X] T017 [P] [US3] Extract `OpenStretchRecovery`'s nested `FlusherFactory` interface into its own file, in
      `app/src/main/java/org/curiouslearning/container/core/usage/flush/FlusherFactory.java` — pure refactor,
      zero behavior change (research.md D6)
- [X] T018 [P] [US3] Update `OpenStretchRecovery` to implement against the hoisted `flush.FlusherFactory`
      instead of its own nested interface; no other change — in
      `app/src/main/java/org/curiouslearning/container/core/usage/OpenStretchRecovery.java` (depends on T017)
- [X] T019 [P] [US3] Write `PendingUsageWriteRecoveryTest` covering: a persisted record is flushed via the
      plain four-argument `UsageSegment(appKey, language, cappedSeconds, rawSeconds)` constructor, asserting
      `recoveredSeconds == 0` and `recoveredCount == 0` on the segment handed to the flusher (FR-009); the
      record is deleted only in the recovery flush's `onQueued()`; `onFailed()` keeps the record for the next
      launch; recovery applies no boot-token or elapsed-time check of any kind (contrast with
      `OpenStretchRecovery`) — in
      `app/src/test/java/org/curiouslearning/container/core/usage/flush/PendingUsageWriteRecoveryTest.java`
      (depends on T017)

### Implementation for User Story 3

- [X] T020 [US3] Implement `PendingUsageWriteRecovery.recoverAll()`: load every `PendingUsageWrite` via
      `PendingUsageWriteStore.loadAll()`, build the plain non-recovered `UsageSegment` for each, flush via
      `FlusherFactory.forUser(record.crUserId)`, delete only on `onQueued()`, keep and log on `onFailed()`, and
      never let one record's failure stop the others (mirrors `OpenStretchRecovery.recoverAll()`) — in
      `app/src/main/java/org/curiouslearning/container/core/usage/flush/PendingUsageWriteRecovery.java`
      (depends on T019, T005)
- [X] T021 [US3] Wire a new `PendingUsageWriteRecovery` call into `MainActivity`'s existing
      `recoverOpenUsageStretches()` background-executor block, alongside the existing `OpenStretchRecovery`
      call, fully swallowed (must never delay or surface to the child) — in
      `app/src/main/java/org/curiouslearning/container/MainActivity.java` (depends on T020)
- [X] T022 [US3] Device validation: run [quickstart.md](./quickstart.md) Level 4 (kill mid-buffer) and Level 5
      (reboot in between) end-to-end (depends on T021)
      **Result**: Level 4 — buffered 3s via a Home-toggle (no finish), `am force-stop`'d the process (buffer
      confirmed still on disk), relaunched: logcat showed `PendingUsageWriteRecovery: Found 1 pending usage
      write(s)` → `UsageFlusher: Flushed UsageSegment{...cappedSeconds=3, rawSeconds=3}` (no
      `recoveredSeconds`/`recoveredCount` in the segment — `isRecovered()==false`, confirming FR-009) →
      `Recovered UsageSegment{...}`; store empty afterward. Level 5 — repeated with a full `adb reboot`
      between kill and relaunch instead of an immediate relaunch: identical outcome (2s recovered), proving
      the buffer is NOT boot-scoped, unlike an `OpenStretchRecord` (FR-011, SC-005, SC-006 all confirmed on
      real hardware).

**Checkpoint**: Buffered time survives a process kill and a device restart, recovering as ordinary duration.
User Stories 1, 2, and 3 all work independently.

---

## Phase 6: User Story 4 - A clean exit leaves nothing behind (Priority: P2)

**Goal**: Confirm that after a normal session end, no `PendingUsageWrite` and no `OpenStretchRecord` survive
to cause a double-count or phantom recovery on a later launch.

**Independent Test**: [quickstart.md](./quickstart.md) Level 6 — use a sub-app, Home-toggle a few times
(building a buffer), then finish it for real; confirm the write happens and a relaunch shows no further change
and no recovery log lines.

### Tests for User Story 4

- [X] T023 [P] [US4] Extend `CoalescingUsageFlusherTest` with: after a finish-triggered `flushPending()` whose
      delegate flush is accepted (`onQueued()`), the persisted `PendingUsageWrite` is gone and the ticker is
      stopped; a finish-triggered `flushPending()` on an already-empty buffer produces no delegate call and
      leaves no persisted record — same file as T007/T014/T015 (depends on T008, T010)
- [X] T024 [P] [US4] Write `SubAppUsageTrackerTest` (new — none exists yet; use Mockito, including
      `mockito-inline` for the concrete `OpenStretchRecorder`) confirming the existing
      `recorder.clear()`-in-`onQueued()` ordering still fires correctly through the new `finishing`/
      `flushPending()` path, for both an empty and a non-empty drained segment — in
      `app/src/test/java/org/curiouslearning/container/core/usage/SubAppUsageTrackerTest.java`
      (depends on T010, T011)

### Validation for User Story 4

- [X] T025 [US4] Device validation: run [quickstart.md](./quickstart.md) Level 6 end-to-end (depends on T023,
      T024)
      **Result**: Confirmed as part of T013's run — after the finishing flush, both
      `sub_app_usage_pending_writes.xml` and `sub_app_usage_open_stretches.xml` were empty, and a subsequent
      relaunch (T022) produced no recovery log line for that key. No orphaned buffer or marker.

**Checkpoint**: All four user stories are independently functional. A clean exit is confirmed to leave no
orphaned marker or buffer.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Whole-diff verification against the baseline recorded in T001 and against the Constitution.

- [X] T026 [P] Run `gradlew compileDebugJavaWithJavac testDebugUnitTest lint` again on the completed branch;
      diff against the T001 baseline and confirm zero new lint findings and all new tests passing
      **Result**: `compileDebugJavaWithJavac` ✅, `testDebugUnitTest` ✅ (all tests incl. the ~40 new ones
      pass), `lintDebug` ❌ — identical 3 errors / 81 warnings to the T001 baseline, all pre-existing
      `NotificationPermission`. Zero new lint findings.
- [X] T027 [P] Update `SubAppUsageFlusher`'s existing javadoc ("a seam for tests, and for MR-184's
      coalescing") to reference `CoalescingUsageFlusher` by name now that it exists — same file as T002
- [X] T028 Run the complete [quickstart.md](./quickstart.md) sequence (Levels 1–6) end-to-end as a final
      integration confirmation, after all four stories have landed (depends on T013, T016, T022, T025)
      **Result**: Level 1 (unit tests) via T026; Level 2 via T013; Level 3 via T016 (unit-test arithmetic, per
      quickstart's own guidance); Levels 4–5 via T022; Level 6 via T025. All passed, on both the JVM unit
      suite and a real emulator (`sdk_gphone64_x86_64`) running this branch's debug build.
- [X] T029 Review the full diff against Constitution Principles II, III, and V (SOLID, composition over
      inheritance, package placement) per the Development Workflow gate, and note the confirmation in the PR
      description (depends on T028)
      **Result**:
      - **II (SOLID)**: Single responsibility preserved — `PendingUsageWrite` (value),
        `PendingUsageWriteStore`/`SharedPreferencesPendingUsageWriteStore` (persistence),
        `CoalescingUsageFlusher` (buffering/ticker/delegate orchestration), `CoalescingUsageFlushers`
        (registry), `PendingUsageWriteRecovery` (launch-time recovery) — one job each, mirroring the
        `OpenStretch*` split exactly. Open/Closed: `FirestoreUsageFlusher` is unchanged and reused as the
        delegate; `SubAppUsageFlusher` is extended via a new default method rather than modifying existing
        implementers. Liskov: `CoalescingUsageFlusher` is used everywhere purely through the
        `SubAppUsageFlusher` interface. ISP: `FlusherFactory` stays a single-method interface.
        Dependency Inversion: `SubAppUsageTracker`/`PendingUsageWriteRecovery` depend only on interfaces
        (`SubAppUsageFlusher`, `PendingUsageWriteStore`, `FlusherFactory`), never on the concrete
        Firestore/`SharedPreferences` implementations.
      - **III (Composition over inheritance)**: `CoalescingUsageFlusher` composes a delegate
        `SubAppUsageFlusher`, a `PendingUsageWriteStore`, and a `HeartbeatTicker` via constructor injection;
        `HeartbeatTicker`/`ExecutorHeartbeatTicker` are reused verbatim, not subclassed or reimplemented. No
        class in this diff extends another concrete class.
      - **V (Package placement)**: every new class lands in `core.usage.flush` (the package MR-182's own
        refactor already carved out for this); `FlusherFactory` was hoisted out of `OpenStretchRecovery`
        into that package so both recovery passes share one abstraction. `MainActivity`/`WebApp`/
        `SubAppUsageTracker` are touched only as call sites (one new import + one new call each) — no
        coalescing logic leaks into them. Visibility mirrors the existing sibling classes
        (`OpenStretchRecord`/`Store`/`Recorder`/`Recovery`/`Timers` are all `public`) for consistency within
        the subsystem; `CoalescingUsageFlushers` must be `public` (unlike its `SubAppUsageTimers` mirror)
        purely because it is called cross-package from `SubAppUsageTracker`, a structural necessity of its
        home package rather than a widened surface of choice.
      - **Verdict**: PASS, no unjustified deviations. (To be restated in the PR description on submission.)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **User Stories (Phase 3–6)**: All depend on Foundational completion
  - US1, US2, and US3 are all P1 and may proceed in parallel (different files) if staffed, or sequentially
    US1 → US2 → US3 as the natural build order, since US2 and US4 both extend `CoalescingUsageFlusherTest`
    (built in US1) and US3 reuses `PendingUsageWriteStore` (built in Foundational)
  - US4 (P2) benefits from US1's `finishing`/`flushPending()` wiring existing first
- **Polish (Phase 7)**: Depends on all four user stories being complete

### User Story Dependencies

- **US1 (P1)**: Depends only on Foundational. Delivers the MVP on its own.
- **US2 (P1)**: Extends US1's `CoalescingUsageFlusherTest` file with additional assertions; no new production
  code of its own beyond what US1 already built — depends on US1's T008.
- **US3 (P1)**: Depends only on Foundational (T005) and the hoisted `FlusherFactory` (its own T017); does
  **not** depend on US1/US2 — recovery bypasses the coalescer entirely (research.md D6). Could be built in
  parallel with US1/US2 by a second developer.
- **US4 (P2)**: Depends on US1's `finishing`/`flushPending()` wiring (T010, T011) existing, since its tests
  exercise that exact path.

### Within Each User Story

- Tests are written before the implementation task that satisfies them (T007 before T008, T019 before T020)
- Foundational value/interface types before the classes that use them
- Story complete (checkpoint) before moving to the next phase

### Parallel Opportunities

- T002, T003, T004 (Phase 2) — different files, no shared dependency
- T017, T018, T019 (Phase 5) — T018 and T019 both depend only on T017, not on each other
- T023, T024 (Phase 6) — different files
- T026, T027 (Phase 7) — different concerns, different files
- US1 and US3 can be staffed in parallel once Foundational is complete (see User Story Dependencies above)

---

## Parallel Example: Phase 2 (Foundational)

```text
# After T001 (baseline), launch together:
Task: "Add default flushPending() to SubAppUsageFlusher in core/usage/flush/SubAppUsageFlusher.java"
Task: "Create PendingUsageWrite value class in core/usage/flush/PendingUsageWrite.java"
Task: "Create PendingUsageWriteStore interface in core/usage/flush/PendingUsageWriteStore.java"

# Then, once both PendingUsageWrite and PendingUsageWriteStore exist:
Task: "Implement SharedPreferencesPendingUsageWriteStore in core/usage/flush/..."
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: run quickstart.md Level 2 independently
5. This alone delivers the ticket's headline value — bounded write volume under rapid toggling — with correct
   totals as a byproduct of T008's design (formally locked down by US2)

### Incremental Delivery

1. Setup + Foundational → foundation ready
2. US1 → validate (Level 2) → this is the MVP
3. US2 → validate (Level 1 + Level 3) → totals correctness locked down
4. US3 → validate (Level 4 + Level 5) → crash/reboot safety added
5. US4 → validate (Level 6) → clean-exit hygiene confirmed
6. Polish → whole-diff verification

### Parallel Team Strategy

With two developers, after Foundational:

- Developer A: US1 → US2 (US2 extends US1's own test file, so the same person finishing both avoids a merge
  conflict on `CoalescingUsageFlusherTest.java`)
- Developer B: US3 (independent of US1/US2 per the Story Dependencies note above), then US4 once US1 lands

---

## Notes

- [P] tasks touch different files and have no incomplete same-phase dependency
- [Story] labels map every user-story-phase task to spec.md's US1–US4 for traceability
- `CoalescingUsageFlusherTest.java` is shared across US1, US2, and US4 by design — each story's tasks *extend*
  it rather than replace it, which is why those tasks are listed sequentially (not [P]) relative to each other
- No task modifies `SubAppUsageTimer.java`, `UsageSegment.java`, `OpenStretchRecord.java`,
  `OpenStretchRecorder.java`, `OpenStretchStore.java`, `SharedPreferencesOpenStretchStore.java`, or any
  `core/subapp` bridge-facing class — confirmed unchanged by [contracts/](./contracts/usage-write-coalescing-contract.md) §4
- Commit after each task or logical group; stop at any checkpoint to validate a story independently

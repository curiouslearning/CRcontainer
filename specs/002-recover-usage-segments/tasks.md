---

description: "Task list for MR-182 — Recover Open Usage Segments"
---

# Tasks: Recover Open Usage Segments

**Input**: Design documents from `/specs/002-recover-usage-segments/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/usage-write-and-payload-contract.md)

**Branch**: `feature/MR-182` (based on `origin/epic/MR-166`)

**Tests**: Out of scope for this branch, at the requester's direction. The unit tests written for this
feature were removed and preserved as a patch to be landed separately.

> **Open gate**: the constitution's Development Workflow section requires unit tests for a change that
> modifies a bridge-facing class. `container_language` touches that path, so this gate is currently unmet
> and must be satisfied before merge.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story the task serves (US1–US4 from [spec.md](./spec.md))

## Path Conventions

Single Gradle module `app`, layer-first packages. All new production code lands in
`app/src/main/java/org/curiouslearning/container/core/usage/`; tests mirror it under
`app/src/test/java/org/curiouslearning/container/core/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the baseline this feature extends.

- [X] T001 Verify baseline: confirm the MR-166 stack is present in `app/src/main/java/org/curiouslearning/container/core/usage/` (9 classes, `SubAppUsageTracker` through `SubAppIdResolver`) and that `.\gradlew compileDebugJavaWithJavac` is green; no new Gradle dependencies are needed, so `app/build.gradle` is not modified by this feature

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The persisted value type, the three seams that keep everything else device-free, and the two
existing types that must carry new state. Every user story depends on these.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T003 [P] Create the immutable `OpenStretchRecord` value with the eight fields from [data-model.md](./data-model.md) §1 (`appKey`, `language`, `crUserId`, `bootToken`, `segmentStartMs`, `lastAliveMs`, `undrainedCappedMs`, `undrainedTrimmedMs`) in `app/src/main/java/org/curiouslearning/container/core/usage/OpenStretchRecord.java`, following `UsageSegment`'s `public final` field style
- [X] T004 [P] Create the `OpenStretchStore` interface — `loadAll()`, `save(OpenStretchRecord)`, `delete(String key)` — in `app/src/main/java/org/curiouslearning/container/core/usage/OpenStretchStore.java`, with the key documented as `appKey::language` matching `SubAppUsageTimers.key()`
- [X] T005 [P] Create the `BootTokenProvider` interface in `app/src/main/java/org/curiouslearning/container/core/usage/BootTokenProvider.java` and its `AndroidBootTokenProvider` implementation returning `System.currentTimeMillis() - SystemClock.elapsedRealtime()`, plus a `matches(long storedToken)` using the ±5000 ms tolerance from [research.md](./research.md) D4, in `app/src/main/java/org/curiouslearning/container/core/usage/AndroidBootTokenProvider.java`
- [X] T006 [P] Create the `HeartbeatTicker` interface — `start(Runnable tick, long intervalMs)`, `stop()` — in `app/src/main/java/org/curiouslearning/container/core/usage/HeartbeatTicker.java` and an `ExecutorHeartbeatTicker` backed by a single-thread `ScheduledExecutorService` in `app/src/main/java/org/curiouslearning/container/core/usage/ExecutorHeartbeatTicker.java`; no raw `Thread`, and `stop()` must cancel so nothing outlives the Activity (Principle IV)
- [X] T007 Implement `SharedPreferencesOpenStretchStore` over a private `sub_app_usage_open_stretches` prefs file in `app/src/main/java/org/curiouslearning/container/core/usage/SharedPreferencesOpenStretchStore.java`, using the version-prefixed unit-separator serialisation from [data-model.md](./data-model.md) §1 and `apply()` for writes; a malformed or unknown-version value is discarded with a `warn`, never thrown (depends on T003, T004)
- [X] T010 Add package-private undrained-state access to `app/src/main/java/org/curiouslearning/container/core/usage/SubAppUsageTimer.java`: a snapshot of `accCappedMs`, `accTrimmedMs`, `segmentStartMs`, `appKey`, `language`, and a `restoreUndrained(long cappedMs, long trimmedMs)` that adds to the accumulators without opening a segment; keep every method `synchronized` and keep the class free of Android imports (per [research.md](./research.md) D7)
- [X] T012 Add `recoveredSeconds` and `recoveredCount` to `app/src/main/java/org/curiouslearning/container/core/usage/UsageSegment.java`, defaulting to `0` via the existing 4-arg constructor and set by a new 6-arg constructor, and update `isEmpty()` so a segment carrying only recovered counters is not treated as empty ([data-model.md](./data-model.md) §2)

**Checkpoint**: Persistence, boot identity, ticking, and the timer's restorable state all exist and are unit-tested. User story work can begin.

---

## Phase 3: User Story 1 - Time spent before a crash is not lost (Priority: P1) 🎯 MVP

**Goal**: A session ended by a process kill is written on the next container launch, into the correct
`summary_data` document, as an estimate that excludes the idle gap.

**Independent Test**: [quickstart.md](./quickstart.md) Level 2 — use a sub-app ~3 minutes, `adb shell am
force-stop`, wait 10+ minutes, relaunch. `cr_duration_seconds` increases by ~180s (not ~13 minutes, not the
30-minute cap) on the document for the language used during the session.

### Implementation for User Story 1

- [X] T013 [US1] Implement `OpenStretchRecorder` — `onSegmentOpened(appKey, language, crUserId)`, `onTick()`, `onSubAppEvent()`, `onSegmentClosed()`, `clear()` — writing and advancing an `OpenStretchRecord` through the injected `OpenStretchStore`, `MonotonicClock`, `BootTokenProvider`, and `HeartbeatTicker`, in `app/src/main/java/org/curiouslearning/container/core/usage/OpenStretchRecorder.java` (depends on T003–T007, T010)
- [X] T015 [US1] Wire the recorder into `app/src/main/java/org/curiouslearning/container/core/usage/SubAppUsageTracker.java` as one constructor-injected collaborator: start it alongside `timer.start()` in `onResume` and the `SCREEN_ON`/`USER_PRESENT` branch, close it alongside `timer.pause()` in `onPause` and the `SCREEN_OFF` branch, and stop the ticker in `onStop`; extend `create()` to build the production collaborators; do not add recovery logic to this class (Principle II)
- [X] T016 [US1] Route inbound sub-app events to the recorder from `app/src/main/java/org/curiouslearning/container/WebApp.java` — one call from the existing `WebAppInterface.logMessage` path into the active tracker, per FR-018; it must be a no-op when no tracker exists (unidentifiable sub-app or blank `cr_user_id`) and must never let a recorder failure affect the bridge call
- [X] T017 [US1] Add the `container_language` field to `app/src/main/java/org/curiouslearning/container/core/subapp/payload/AppEventPayload.java`, documented as Java-only and rejected from the bridge ([contracts/](./contracts/usage-write-and-payload-contract.md) §2)
- [X] T018 [US1] Make payload origin explicit in `app/src/main/java/org/curiouslearning/container/core/subapp/validation/AppEventPayloadValidator.java` and reject any JS-origin payload carrying a non-null `container_language` with a clear `ValidationResult` message, leaving all existing rules unchanged (Principle VI)
- [X] T020 [US1] Add `language(String)` to `app/src/main/java/org/curiouslearning/container/core/subapp/emitter/AppEventPayloadBuilder.java`, setting `container_language` and leaving `data`/`options` untouched
- [X] T021 [US1] Change the language stamping in `app/src/main/java/org/curiouslearning/container/core/subapp/handler/DefaultAppEventPayloadHandler.java` (currently lines 144–147) to the three-step order in [contracts/](./contracts/usage-write-and-payload-contract.md) §2: `container_language` when non-blank, else `AppContext.LANGUAGE` when non-blank, else leave `metadata.language` unstamped — preserving the existing no-sentinel behaviour and the `storeSummaryPayload` query fallback it protects
- [X] T023 [US1] Pass `segment.language` through `.language(...)` in `app/src/main/java/org/curiouslearning/container/core/usage/FirestoreUsageFlusher.java`, so the destination document is chosen by the segment's language rather than by live `AppContext` state — this fixes ordinary flushes as well as recovered ones ([research.md](./research.md) D5)
- [X] T024 [US1] Implement `OpenStretchRecovery.recoverAll()` in `app/src/main/java/org/curiouslearning/container/core/usage/OpenStretchRecovery.java`: load every record, compute `undrainedCapped + min(lastAliveMs - segmentStartMs, capMs)` floored at zero, skip and delete anything estimating to under one second (FR-011, FR-020), emit through a `SubAppUsageFlusher` built for that record's own `crUserId`, and delete the record inside `AppEventWriteCallback.onQueued()` only (FR-012, [research.md](./research.md) D6); one record's failure must not stop the others (FR-013)
- [X] T026 [US1] Call `OpenStretchRecovery.recoverAll()` from `app/src/main/java/org/curiouslearning/container/MainActivity.java` immediately after the existing `DefaultAppEventPayloadHandler.getInstance(pseudoId)` warm at line 878, dispatched to a single-thread executor so nothing runs on the main thread, wrapped so a failure can never surface to the child (FR-015, [research.md](./research.md) D8)

**Checkpoint**: A force-stopped session is recovered with an accurate estimate, into the right document. MVP complete and demonstrable.

---

## Phase 4: User Story 2 - Recovered time is identifiable and separable (Priority: P2)

**Goal**: An analyst can see how much of a total came from estimates, and the raw-versus-capped difference
stays interpretable.

**Independent Test**: Produce one recovered stretch; the document gains `cr_recovered_seconds` and
`cr_recovered_count`, both duration fields increase by the same amount, and no `cr_recovered` boolean exists.

### Implementation for User Story 2

- [X] T027 [US2] Write `cr_recovered_seconds` and `cr_recovered_count` as `add` fields in `app/src/main/java/org/curiouslearning/container/core/usage/FirestoreUsageFlusher.java`, omitting both entirely when zero so "never recovered" stays distinguishable from "recovered zero", and never writing a `cr_recovered` boolean (FR-009, FR-010)
- [X] T028 [US2] Build the recovered `UsageSegment` in `app/src/main/java/org/curiouslearning/container/core/usage/OpenStretchRecovery.java` with `rawSeconds == cappedSeconds` and `recoveredSeconds == cappedSeconds`, `recoveredCount == 1`, so recovery contributes exactly zero to the raw-versus-capped difference (FR-008, SC-004)

**Checkpoint**: Recovered time is written, labelled, and separable. US1 and US2 both hold.

---

## Phase 5: User Story 3 - Untrustworthy stretches are discarded, never guessed (Priority: P3)

**Goal**: A stretch that spans a reboot is thrown away entirely — no duration, and no recovery counters.

**Independent Test**: [quickstart.md](./quickstart.md) Level 3 — accumulate ~2 minutes, `force-stop`, `adb
reboot`, relaunch. No document field changes, `cr_recovered_count` does not increment, and a second launch
changes nothing either.

### Implementation for User Story 3

- [X] T031 [US3] Add the boot-mismatch branch to `app/src/main/java/org/curiouslearning/container/core/usage/OpenStretchRecovery.java`: when `BootTokenProvider.matches(record.bootToken)` is false, delete the record and return without emitting anything — no duration, no `cr_recovered_seconds`, and specifically no `cr_recovered_count` increment, since a zero-length recovery would distort the recovery statistics (FR-005, US3 §2)

**Checkpoint**: Reboot-spanning stretches produce no data at all, and cannot be replayed.

---

## Phase 6: User Story 4 - A clean session is never counted twice (Priority: P3)

**Goal**: A normally-ended session is written exactly once, and leaves no record behind to recover.

**Independent Test**: [quickstart.md](./quickstart.md) Level 4 — use a sub-app, exit with Back, relaunch the
container. No further change to the document and no `cr_recovered_count` increment; then repeat with a
rotation mid-session and confirm one write, not two.

### Implementation for User Story 4

- [X] T033 [US4] Delete the open-stretch record on the normal flush path in `app/src/main/java/org/curiouslearning/container/core/usage/SubAppUsageTracker.java`, inside `AppEventWriteCallback.onQueued()` for that flush rather than eagerly at pause or after `emit()` returns — the timer's undrained state and the record's lifetime must end at the same moment (FR-003, [research.md](./research.md) D6)

**Checkpoint**: All four user stories hold independently.

---

## Phase 7: Polish & Cross-Cutting Concerns

- [X] T036 [P] Update the "Container-Measured Usage" section of `CLAUDE.md` — add the recovery flow, the `cr_recovered_seconds` / `cr_recovered_count` fields, and the new `core/usage` classes to the Key Files table
- [X] T037 [P] Align log tags across the new classes (one tag per class, matching the existing `SubAppUsageTracker` / `UsageFlusher` convention) and confirm nothing logs a `cr_user_id` at `info` or above
- [X] T038 Build and lint: `.\gradlew compileDebugJavaWithJavac` and `.\gradlew lint` (lint's 3 pre-existing errors are unrelated to this feature — verified against a clean baseline)
- [ ] T039 Run [quickstart.md](./quickstart.md) Levels 2–6 on a real device, including Level 5 with **both** FTM and the assessment sub-app (SC-009) and Level 6 offline (FR-012) — Level 5 is the one that catches a heartbeat wired to events instead of to the container's own tick
- [ ] T040 Write the PR description noting both recorded deviations from [plan.md](./plan.md) Complexity Tracking — the handler change and the widened scope of persisted state — with the principle, the reason, and why the compliant alternative was rejected, as the constitution's Development Workflow section requires

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: no dependencies
- **Foundational (Phase 2)**: depends on Setup — **blocks all user stories**
- **US1 (Phase 3)**: depends on Foundational. Delivers the MVP
- **US2 (Phase 4)**: depends on Foundational; touches the same two files as US1's T024/T027, so it lands after US1 rather than beside it
- **US3 (Phase 5)**: depends on Foundational and on T024 existing to add a branch to
- **US4 (Phase 6)**: depends on Foundational and on T015's tracker wiring
- **Polish (Phase 7)**: depends on every story you intend to ship

### Within Each User Story

- Value types and seams before the classes that compose them
- The `core/subapp` changes (T017, T018, T020, T021) form one unit: payload field → bridge rejection →
  builder → handler. They should land as their own reviewable commit — they are the only bridge-facing part
  of this feature, and the only part carrying an unmet test gate
- `OpenStretchRecovery` (T024) after the flusher can carry a language (T023), or the recovered time lands in
  the wrong document

### Parallel Opportunities

- **Phase 2**: T003, T004, T005, T006 are four independent new files — fully parallel
- **Phases 4, 5, 6**: with more than one developer, US2/US3/US4 can proceed in parallel **once US1's T024 is
  merged**, since each adds a separate branch or call site rather than rewriting shared logic
- **Phase 7**: T036 and T037 are independent

### Serial Bottlenecks

- T024 (`OpenStretchRecovery`) is the single busiest file: US1 creates it, US2 changes what it builds, US3
  adds a branch. Sequence those three rather than parallelising them
- T015 (`SubAppUsageTracker`) is touched by US1 and US4

---

## Parallel Example: Phase 2 Foundational

```bash
# Four independent new files — launch together:
Task: "Create OpenStretchRecord value in core/usage/OpenStretchRecord.java"
Task: "Create OpenStretchStore interface in core/usage/OpenStretchStore.java"
Task: "Create BootTokenProvider + AndroidBootTokenProvider in core/usage/"
Task: "Create HeartbeatTicker + ExecutorHeartbeatTicker in core/usage/"
```

---

## Implementation Strategy

### MVP First (User Story 1 only)

1. Phase 1 Setup → Phase 2 Foundational → Phase 3 US1
2. **STOP and VALIDATE** with [quickstart.md](./quickstart.md) Level 2, including the 10-minute wait before
   relaunching — that wait is what distinguishes a correct estimate from one anchored on recovery time
3. At this point crashed sessions are no longer lost. That is the ticket's core value, shippable on its own

### Incremental Delivery

1. Setup + Foundational → seams in place
2. US1 → crashed sessions recovered → **MVP**
3. US2 → recovered time labelled and separable → analysts can trust the totals
4. US3 → reboot-spanning stretches discarded → no absurd outliers
5. US4 → clean sessions written once → no double counting

Shipping US1 without US2 writes recovered time that analysts cannot distinguish from measured time. That is
strictly better than today's silent loss, but if only one of the two can land in a release, they should land
together.

### Review Focus

Three things deserve a reviewer's attention more than the rest, and with no unit tests on this branch, all
three now rest entirely on reading the code:

- **T017/T018/T020/T021**, the bridge-facing change. It alters how `metadata.language` is resolved for
  *every* payload, including the JS path. The rejection in `AppEventEmitter.emitJson` is what keeps a
  sub-app from relabelling its own data
- **T005**, the boot token. MR-182 specifies bucketing; [research.md](./research.md) D4 deliberately uses a
  tolerance instead, because a true value near a bucket boundary flips buckets under trivial drift
- **T013/T024 together**, the record's lifetime. The open review findings — a new session overwriting a
  leftover record, and recovery racing a live timer — both live in the seam between these two tasks

---

## Notes

- `[P]` = different files, no dependency on an incomplete task
- 27 tasks: 1 setup, 7 foundational, 9 US1, 2 US2, 1 US3, 1 US4, 5 polish (originally 40; the 13 unit-test
  tasks were removed with the tests)
- **Task IDs are deliberately not renumbered.** The gaps — T002, T008, T009, T011, T014, T019, T022, T025,
  T029, T030, T032, T034, T035 — are the removed test tasks, and keeping the surviving IDs stable preserves
  traceability with the work already done and reported
- Commit per task or per logical group; the `core/subapp` block (T017, T018, T020, T021) is one such group
- Stop at any checkpoint to validate a story independently

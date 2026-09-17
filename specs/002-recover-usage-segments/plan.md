# Implementation Plan: Recover Open Usage Segments

**Branch**: `feature/MR-182` (feature directory `002-recover-usage-segments`) | **Date**: 2026-09-03 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-recover-usage-segments/spec.md`

## Summary

Container-measured usage time currently exists only in memory until `WebApp.onStop` drains it, so a process
kill discards it. This feature persists enough state, while a sub-app is open, to reconstruct that time on the
next container launch: which sub-app and language, whose it is, when it started, how much had already
accumulated, the last moment it was known to be alive, and which boot it belongs to. On launch, each leftover
record is either recovered as a capped estimate — written to the same `summary_data` document as ordinary
usage, with `cr_recovered_seconds` / `cr_recovered_count` alongside — or discarded outright if it came from a
previous boot.

Three things drive the design more than anything else:

1. **The estimate must not include the idle gap.** A last-known-alive point, advanced by the container on a
   bounded interval and additionally by any inbound sub-app event, bounds the over-count by that interval
   instead of by how long the device sat unused (FR-016–FR-018).
2. **`metadata.language` is currently stamped from live `AppContext` state**, not from the segment. That is
   invisible for a normal flush and wrong for a recovered one, so the write path needs a trusted way to carry
   an explicit language — and, because the same handler serves the JS bridge, that way must not become a
   channel a sub-app can use to relabel its own data (Principle VI).
3. **Undrained accumulated time is lost by the same crash as the open segment.** `SubAppUsageTimer` holds
   closed-segment totals in memory until `stopAndDrain()`. Persisting only the open segment would still lose a
   paused-then-killed session, so the record carries the timer's undrained totals too.

## Technical Context

**Language/Version**: Java 8 (`sourceCompatibility`/`targetCompatibility` `VERSION_1_8`), Java-only per
Constitution "Technology & Platform Constraints"

**Primary Dependencies**: No new dependencies. Existing: AndroidX, Firebase Firestore (via the
`AppEventEmitter` → `DefaultAppEventPayloadHandler` path), Gson (payload DTO), `androidx.annotation`

**Storage**: `SharedPreferences`, in a private file dedicated to this feature. Deliberately **not**
`AppContext`, which is an enum-keyed store of single simple values and cannot hold a variable number of
multi-field records — see [research.md](./research.md) D1

**Testing**: **None on this branch**, at the requester's direction — the unit tests written for this feature
were removed and preserved as a patch to land separately. The design still puts every collaborator behind an
injected seam (`MonotonicClock`, `OpenStretchStore`, `BootTokenProvider`, `HeartbeatTicker`,
`SubAppUsageFlusher`), so the code remains testable without a device whenever those tests return. Validation
until then is the device pass in [quickstart.md](./quickstart.md)

**Target Platform**: Android, `minSdk` 24 / `targetSdk` 36 / `compileSdk` 36

**Project Type**: Android container app — single Gradle module `app`, layer-first packages under
`org.curiouslearning.container`

**Performance Goals**: The last-known-alive tick is one `SharedPreferences.apply()` of a few dozen bytes per
interval per open sub-app; at the proposed 60s interval this is negligible against the WebView already
running. Recovery at launch is one pass over at most a handful of records, off the main thread.

**Constraints**: Must not delay container startup or surface anything to the child (FR-015); must work with no
network (FR-012, satisfied by Firestore local persistence plus `AppEventWriteCallback.onQueued()`); must not
write a second Firestore path outside `AppEventEmitter`; elapsed time must keep coming from the injected
`MonotonicClock`, never `System.currentTimeMillis()` deltas

**Scale/Scope**: Two identifiable sub-apps today (`feed-the-monster`, `assessment`); at most one open record
per `appKey::language` pair, so single-digit records in practice. Roughly 6 new classes in `core/usage`, one
new field on `UsageSegment`, and one narrow change each to the payload DTO, its validator, its builder, and
the handler's language stamping.

## Constitution Check

*GATE: evaluated before Phase 0, re-evaluated after Phase 1 design.*

| Principle | Gate | Pre-Phase-0 | Post-Phase-1 |
|---|---|---|---|
| **I. WebView Sub-App Boundary & Isolation** | No native code reaches into sub-app internals; nothing here requires a sub-app change | ✅ PASS | ✅ PASS — FR-018 *observes* events that already arrive at `logMessage`; no sub-app is asked to emit anything, and a silent sub-app is recovered identically (SC-009) |
| **II. SOLID (NON-NEGOTIABLE)** | Persistence, estimation, boot identity, ticking, and recovery orchestration are separate classes, not new branches in `SubAppUsageTracker` | ⚠️ AT RISK — the obvious shortcut is to bolt prefs writes onto the tracker | ✅ PASS — split into `OpenStretchStore` (persistence), `OpenStretchRecorder` (lifecycle of a record), `BootTokenProvider` (boot identity), `HeartbeatTicker` (scheduling), `OpenStretchRecovery` (launch-time orchestration). One justified exception tracked below |
| **III. Composition Over Inheritance** | New collaborators are constructor-injected interfaces, matching how `timer`/`flusher`/`screenState` already are | ✅ PASS | ✅ PASS — no new inheritance; `SubAppUsageTracker` gains one injected collaborator |
| **IV. Idiomatic Java & Android** | AndroidX only; no raw threads or `AsyncTask`; async work must not outlive its owner; SDKs behind own interfaces | ⚠️ AT RISK — a heartbeat needs a scheduler, and recovery needs a background thread | ✅ PASS — `HeartbeatTicker` interface with a `ScheduledExecutorService` implementation cancelled in `onStop`; recovery on a single-thread executor; `SharedPreferences` behind `OpenStretchStore` |
| **V. Scalable Layered Package Architecture** | New code belongs in `core/usage` beside the mechanism it extends; implementation classes package-private by default | ✅ PASS | ✅ PASS — all new classes in `org.curiouslearning.container.core.usage`; only `OpenStretchRecovery` and the two interfaces need to be `public` |
| **VI. Secure, Validated Native↔Web Bridge** | Every inbound payload still passes the validator; no new JS-reachable capability | ⚠️ AT RISK — carrying a trusted language on the payload could let a sub-app relabel its own data | ✅ PASS on the principle — the language field is rejected in `AppEventEmitter.emitJson`, the JS entry point, loudly rather than silently honoured. **Unverified by tests on this branch**; the Development Workflow gate this would otherwise close is listed as unmet below |

**Verdict: PASS on the Core Principles**, with deviations recorded in Complexity Tracking.

**One Development Workflow gate is unmet.** The rule "a change that adds or modifies a bridge-facing class
MUST include or update unit tests for its validation/handler logic" applies to the `container_language`
change, and no unit tests ship on this branch. This is a deliberate, requested omission, not an oversight —
the tests exist as a patch and must land before merge for this gate to close.

## Project Structure

### Documentation (this feature)

```text
specs/002-recover-usage-segments/
├── spec.md              # Feature specification (/speckit-specify output)
├── plan.md              # This file (/speckit-plan output)
├── research.md          # Phase 0 output — decisions D1–D8 with alternatives
├── data-model.md        # Phase 1 output — OpenStretchRecord and friends
├── quickstart.md        # Phase 1 output — how to prove it works on a device
├── contracts/
│   └── usage-write-and-payload-contract.md   # Phase 1 output
├── checklists/
│   └── requirements.md  # Spec quality checklist (all items passing)
└── tasks.md             # Phase 2 output (/speckit-tasks — NOT created here)
```

### Source Code (repository root)

```text
app/src/main/java/org/curiouslearning/container/
├── core/
│   ├── usage/                              # everything new lives here
│   │   ├── OpenStretchRecord.java          # NEW — the persisted note (immutable value)
│   │   ├── OpenStretchStore.java           # NEW — interface: load all / save one / delete one
│   │   ├── SharedPreferencesOpenStretchStore.java  # NEW — the only Android-touching new class
│   │   ├── OpenStretchRecorder.java        # NEW — creates, advances, clears a record
│   │   ├── HeartbeatTicker.java            # NEW — interface + executor-backed impl
│   │   ├── BootTokenProvider.java          # NEW — interface + Android impl, boot identity
│   │   ├── OpenStretchRecovery.java        # NEW — launch-time pass over leftover records
│   │   ├── SubAppUsageTracker.java         # CHANGED — drives the recorder from lifecycle
│   │   ├── SubAppUsageTimer.java           # CHANGED — exposes undrained state, restores it
│   │   ├── UsageSegment.java               # CHANGED — carries recovered seconds/count
│   │   ├── FirestoreUsageFlusher.java      # CHANGED — writes cr_recovered_*, explicit language
│   │   ├── SubAppUsageTimers.java          # unchanged (key shape reused by the store)
│   │   ├── SubAppUsageFlusher.java         # unchanged
│   │   ├── MonotonicClock.java             # unchanged
│   │   ├── AndroidMonotonicClock.java      # unchanged
│   │   └── SubAppIdResolver.java           # unchanged
│   └── subapp/
│       ├── payload/AppEventPayload.java            # CHANGED — one trusted language field
│       ├── validation/AppEventPayloadValidator.java # CHANGED — rejects it from JS
│       ├── emitter/AppEventPayloadBuilder.java     # CHANGED — .language(...)
│       └── handler/DefaultAppEventPayloadHandler.java # CHANGED — respect explicit language
├── MainActivity.java                       # CHANGED — kick off recovery after handler warm
└── WebApp.java                             # CHANGED — route inbound events to the recorder

app/src/test/                               # UNCHANGED on this branch — see Testing above
```

**Structure Decision**: Layer-first, per Principle V. Every new class lands in the existing
`core/usage` package next to the mechanism it extends — no new top-level package, and nothing new in
`presentation/` or `data/`. `MainActivity` and `WebApp` are touched only as call sites: they invoke the new
seams and hold no recovery logic themselves.

## Phase Sequencing

The design has one hard ordering constraint and is otherwise parallelisable:

1. **`OpenStretchRecord` + `OpenStretchStore` + `BootTokenProvider`** — pure value and seam definitions;
   nothing else compiles without them.
2. **`SubAppUsageTimer` undrained-state accessors** — independent of 1, needed by both 3 and 4.
3. **`OpenStretchRecorder` + `HeartbeatTicker`**, then wiring into `SubAppUsageTracker` and `WebApp`.
4. **`UsageSegment` + `FirestoreUsageFlusher` + the four `core/subapp` changes**, then `OpenStretchRecovery`,
   then the `MainActivity` call.

Step 4's `core/subapp` changes are the riskiest part of the feature and the only part that touches
bridge-facing code, so they should land as their own reviewable commit rather than as a side effect of the
recovery work. With no unit tests on this branch, that separation is doing more work than usual: it is the
main thing making the bridge change reviewable on its own.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| Adding language resolution to `DefaultAppEventPayloadHandler` rather than a new handler implementation (bends Principle II's Open/Closed clause) | The doc key is `cr_user_id` + `app_id` + `metadata.language`, and the handler is the single place that both stamps that field and resolves the upsert query against it. A recovered write must be able to name its own language or it lands in the wrong document (FR-002, FR-006) | A separate handler for recovered writes would duplicate the upsert-and-merge logic and the `synced_at` stamping — the exact duplication `AppEventEmitter` was introduced to prevent. Temporarily setting `AppContext.LANGUAGE` around the write was rejected as a global mutation racing every other writer. The change is one `if` on a field that is currently unconditionally overwritten, and it makes the existing, already-ignored `UsageSegment.language` meaningful for normal flushes too |
| Persisting the timer's undrained totals, not just the open segment (slightly wider than MR-182's literal "open segment marker") | `SubAppUsageTimer` accumulates closed segments in memory until `stopAndDrain()`. Persisting only the open segment would leave a paused-then-killed session losing everything, which fails User Story 1 for a common case (child pauses, screen sleeps, OS reclaims the process) | Scoping strictly to the open segment would ship a recovery feature with a hole the same size as the one it closes. The extra cost is two `long`s in the record, and it makes the ticket's own "clear it on a clean flush" rule coherent — the record's life matches the timer's undrained state exactly |

# Phase 0 Research: Recover Open Usage Segments

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md) | **Date**: 2026-09-03

All Technical Context unknowns are resolved below. Each decision names what was chosen, why, and what was
rejected. Findings are drawn from the code on `feature/MR-182` (based on `origin/epic/MR-166`), not from
assumption — file and line references are given where a decision turns on existing behaviour.

---

## D1 — Where the open-stretch record is persisted

**Decision**: A dedicated `SharedPreferences` file, `sub_app_usage_open_stretches`, behind a new
`OpenStretchStore` interface in `core/usage`. One preference entry per open stretch, keyed by the same
`appKey::language` string `SubAppUsageTimers` already uses, with the record serialised as a single delimited
string value.

**Rationale**: `SharedPreferences` survives process death, is already the container's persistence habit for
small state (`pseudoId`, `AppContext`), needs no schema migration, and `apply()` is asynchronous so the
heartbeat never blocks. Keying by `appKey::language` makes the store's identity match the timer's identity
exactly — one record per timer, which is what FR-013's "multiple independent open stretches" requires and
what makes "clear on drain" unambiguous. The interface seam keeps every other new class free of Android
dependencies, per the constitution's testing constraint — worth keeping even though no tests ship on this
branch, since it is what will let them be written without a device when they land.

**Alternatives considered**:

- **`AppContext`** (`core/context/AppContext.java`) — rejected on inspection. It is keyed by the
  `AppContextKey` enum, holds exactly one value per key, and explicitly supports only single simple values
  ("no arrays, collections, Double, or other object types"). A variable number of multi-field records does
  not fit it, and forcing them in would mean either an enum key per sub-app or an encoded blob under one key
  — both worse than a purpose-built store, and both polluting a deliberately generic app-wide cache.
- **Room** — rejected as heavy for at most a handful of transient rows, and it would put a migration in
  `app/schemas/` for state that is meant to be discarded within seconds of the next launch.
- **A file written directly** — rejected: same durability, but hand-rolled I/O, threading, and corruption
  handling for no gain over `SharedPreferences`.

---

## D2 — How the recovered duration is estimated

**Decision**: `recovered = undrainedCapped + min(lastAliveMs − segmentStartMs, capMs)`, floored at zero, then
the whole result treated as one capped stretch. `lastAliveMs` is the persisted last-known-alive point.

**Rationale**: This is the spec's FR-016 made concrete. The alternative the ticket's wording invites —
elapsed from start until the moment of recovery — silently counts the entire gap between the kill and the
next launch as play, which for the spec's own example (killed at 2 minutes, relaunched 8 hours later) writes
the full 30-minute cap for a 2-minute session. Anchoring on the last known-alive point bounds the over-count
by the heartbeat interval instead (SC-008), regardless of how long the device sat idle.

**Alternatives considered**: recovery-time elapsed (rejected as above — the error is unbounded and biased
upward); a fixed conservative constant (rejected: a genuine 25-minute session would be recorded as one
minute, failing SC-001 in substance while technically writing something).

---

## D3 — What advances the last-known-alive point

**Decision**: The container advances it itself on a bounded interval — **60 seconds** — for as long as a
segment is open, via an injected `HeartbeatTicker`. Any inbound sub-app event additionally advances it to the
moment that event arrived. The container tick is authoritative; events only ever move the point forward.

**Rationale**: 60s puts the worst-case over-count at one minute against a 30-minute cap (~3.3%), for one
small `apply()` per minute per open sub-app — negligible beside a running WebView. Events are a free
precision gain where they happen.

Events cannot be the *only* source, on two grounds checked in the code:

- **Coverage.** `SubAppIdResolver` (`core/usage/SubAppIdResolver.java:14-20`) tracks exactly two sub-apps,
  `feed-the-monster` and `assessment`. Only FTM reports analytics across the bridge; `assessment-survey-js`
  touches `window.Android` once, at `src/App.ts:682-685`, purely for `cachedStatus`. An event-only heartbeat
  would leave every assessment session unrecoverable while still being tracked, violating SC-009. FTM's own
  stream is behind the `mr-75` feature flag and can be switched off entirely.
- **Independence.** Container-measured usage exists to be a measurement of the same sessions that does not
  depend on the sub-app. Deriving its recovery estimate from sub-app events folds the sub-app back into the
  number meant to cross-check it.

**Alternatives considered**: events only (rejected as above); a shorter 15–30s tick (rejected — three to four
times the writes to shave seconds off an estimate already capped at 30 minutes); a longer 5-minute tick
(rejected — a 5-minute worst-case error is a sixth of the cap, large enough to matter in aggregate).

---

## D4 — How a boot is identified

**Decision**: A new `BootTokenProvider` interface with an Android implementation returning
`System.currentTimeMillis() − SystemClock.elapsedRealtime()` — the wall-clock instant of boot. Records are
compared with a **tolerance** of ±5000 ms rather than exact equality: same boot if
`|storedToken − currentToken| <= 5000`, otherwise discarded per FR-005.

**Rationale**: `elapsedRealtime()` restarts at zero on reboot, so a stored `segmentStartMs` from a previous
boot is meaningless — it may even be numerically valid, which is what makes silent misuse dangerous. The
derived boot instant is stable within a boot and changes by roughly the uptime across a reboot. The tolerance
absorbs NTP corrections, which shift `currentTimeMillis()` without touching `elapsedRealtime()` and therefore
move the derived token by the size of the correction.

**Alternatives considered**:

- **Bucketing the token** (the ticket's suggested approach: bucket to absorb drift, then compare for
  equality) — rejected as strictly worse for the same goal. A true value sitting near a bucket boundary
  flips buckets under a drift far smaller than the bucket width, producing exactly the false mismatch the
  bucketing was meant to prevent. A tolerance comparison has no boundary to sit near. Worth flagging in
  review, since the ticket names bucketing explicitly.
- **`ACTION_BOOT_COMPLETED` receiver writing a boot id** — rejected: a new manifest receiver and a new
  permission-adjacent surface, for information already derivable arithmetically.
- **A random per-process id** — rejected: it identifies a process, not a boot, so it cannot distinguish a
  crash-and-relaunch (recoverable) from a reboot (not recoverable).

---

## D5 — Carrying an explicit language on a recovered write

**Decision**: Add one field to `AppEventPayload` for a container-set language; `AppEventPayloadBuilder` gains
`.language(String)` to set it; `DefaultAppEventPayloadHandler` stamps `metadata.language` from that field when
present and falls back to `AppContext.LANGUAGE` when absent; `AppEventPayloadValidator` **rejects** any
payload arriving from the JS bridge that carries the field.

**Rationale**: This is the single most consequential finding of Phase 0.
`DefaultAppEventPayloadHandler.java:144-147` stamps `metadata.language` from live `AppContext` state
**unconditionally**, overwriting anything the caller set. `FirestoreUsageFlusher` never passes a language at
all, so `UsageSegment.language` — documented as "part of the destination document's identity" — is currently
carried and then ignored. For a normal flush that is invisible, because the selected language has not usually
changed since the session. For a recovered flush on the next launch it is wrong whenever the language changed
in between: the time lands in a different language partition, breaking FR-002 and FR-006.

Because the same handler serves the bridge, making a caller-supplied language win would hand sub-apps the
ability to relabel their own data — a Principle VI regression, since today the container always wins. Hence
the validator rejection: the capability is Java-only and a sub-app attempting it is rejected loudly rather
than silently honoured. This also fixes the latent bug for ordinary flushes.

**Alternatives considered**:

- **Honour `metadata.language` from any caller** — rejected: JS-reachable, Principle VI regression.
- **A `languageOverride` parameter on `AppEventPayloadHandler.handle()`** — rejected: pollutes the shared
  interface every JS payload goes through, contrary to Interface Segregation.
- **Set `AppContext.LANGUAGE` around the write** — rejected: a global mutation racing every other writer, on
  a store read by attribution stamping as well.
- **A second write path for usage** — rejected outright: `AppEventEmitter`'s class comment states it exists
  precisely so container-measured data does not get "a second Firestore write path", losing shared metadata
  stamping, increment semantics, and `synced_at`.

---

## D6 — When the record is cleared, and how offline is handled

**Decision**: The record is written when a segment opens, rewritten on each heartbeat and on each segment
close, and deleted only when the timer actually **drains** — that is, from the flush path, inside
`AppEventWriteCallback.onQueued()`. A failed emit leaves the record in place.

**Rationale**: `AppEventWriteCallback.onQueued()` is documented as the point at which "a caller holding the
only other copy of the measurement can safely discard it" — durable in Firestore's local persistence queue,
independent of connectivity. That is exactly FR-012. Gating on `onWritten()` instead would, per that same
doc, mean the record survives every offline launch and gets replayed, double-counting. Clearing eagerly
before the emit would lose the measurement whenever validation or the upsert query fails.

Note the timing subtlety the interface documents: for `summary_data`, `onQueued()` fires **asynchronously**,
after the upsert query resolves — so the deletion must happen inside the callback, never after the `emit()`
call returns.

**Alternatives considered**: clear on segment pause (rejected — a paused-then-killed session would lose its
accumulated time, the hole described in D7); clear on `onWritten()` (rejected — replays offline);
fire-and-forget clear (rejected — loses data on a rejected payload).

---

## D7 — Scope: undrained accumulated time, not just the open segment

**Decision**: The record carries the timer's undrained totals (`accCappedMs`, `accTrimmedMs`) in addition to
the open segment's start. Recovery restores them; `SubAppUsageTimer` gains package-private accessors to read
and restore that state.

**Rationale**: `SubAppUsageTimer` closes a segment into in-memory accumulators on `pause()` and only hands
anything out on `stopAndDrain()` (`SubAppUsageTimer.java:96-118`). `SubAppUsageTracker.onPause()` pauses
without writing, by design. So the common sequence "child plays, screen sleeps, OS reclaims the process"
loses everything today — and would still lose everything if only the open segment were persisted. Recording
undrained totals closes both holes with two extra `long`s, and makes MR-182's own instruction ("clear it on
a clean flush") coherent: the record's lifetime becomes exactly the timer's undrained state.

**Alternatives considered**: open segment only, per the ticket's literal wording (rejected — ships a recovery
feature with a hole the same size as the one it closes; recorded as a deliberate scope note in
[plan.md](./plan.md) Complexity Tracking); flushing on every pause instead (rejected — turns one session into
many Firestore writes and re-creates the split-write problem `onStop`/`isChangingConfigurations` was built to
avoid).

---

## D8 — Where recovery runs at launch

**Decision**: From `MainActivity.onCreate`, immediately after the existing
`DefaultAppEventPayloadHandler.getInstance(pseudoId)` warm at `MainActivity.java:878`, dispatched onto a
single-thread `ExecutorService` so no work sits on the main thread. Each record's own persisted `crUserId` is
used to resolve its emitter — recovery never reads the current `pseudoId`.

**Rationale**: `MainActivity` is the container's real entry point and already warms the handler and its
Firestore prefetch there, so recovery runs against a warm cache. `AppContext` is initialised earlier, in
`MyApplication.onCreate` (`MyApplication.java:17`), so context-derived stamping is available. Using each
record's own `crUserId` is what makes the spec's "identifier changed between the loss and the recovery" edge
case correct — and it matters concretely, because `WebApp.java:150-156` can substitute a debug
`custom_cr_user_id` for `pseudoId` in non-release builds.

**Alternatives considered**:

- **`MyApplication.onCreate`** — rejected: runs on the main thread during cold start for every process spawn,
  including background starts the child never sees, against FR-015.
- **First `WebApp` launch** — rejected: a child who opens the container and never opens a sub-app would never
  flush the previous crash, and the record would keep aging.
- **`WorkManager`** — rejected: a new dependency and a scheduling surface for work that is a few reads and at
  most a handful of emits.

---

## Resolved unknowns summary

| Unknown | Resolution |
|---|---|
| Persistence mechanism | Dedicated `SharedPreferences` file behind `OpenStretchStore` (D1) |
| Duration estimate | `undrainedCapped + min(lastAlive − start, cap)` (D2) |
| Heartbeat interval and sources | 60s container tick, plus inbound sub-app events (D3) |
| Boot identity | Derived boot instant, ±5000 ms tolerance (D4) |
| Language attribution | Trusted payload field, JS-rejected by the validator (D5) |
| Record lifetime / offline | Deleted in `onQueued()` only (D6) |
| Scope of persisted state | Undrained totals as well as the open segment (D7) |
| Recovery entry point | `MainActivity.onCreate`, background executor (D8) |

# Phase 0 Research: Coalesce Sub-App Usage Writes

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md) | **Date**: 2026-09-09

All Technical Context unknowns are resolved below. Each decision names what was chosen, why, and what was
rejected, grounded in the code on this branch (based on `epic/MR-166`, immediately after MR-182 merged) — not
assumption. Every decision is a direct working-out of one of the dependencies the spec's Input names:
MR-180's debounce, MR-178's per-segment cap, MR-183's write shape, and MR-182's recovery marker.

---

## D1 — What "stop/finish" means, distinct from a transient background toggle

**Decision**: `Activity.isFinishing()`, read inside `WebApp.onStop()` and passed through to
`SubAppUsageTracker.onStop(boolean changingConfigurations, boolean finishing)`.

**Rationale**: This is the crux of the whole feature. Android delivers `onStop()` identically whether the
child pressed Home, opened the app switcher, or actually left the sub-app for good (Back, the in-app close
button, or any of the three `finish()` call sites already in `WebApp.java`) — `isChangingConfigurations()`
only tells the rotation-recreate case apart, which is unrelated. `isFinishing()` is already true inside
`onStop()` whenever `finish()` was called first, which is exactly and only the "the child is genuinely done
with this sub-app" case: every `finish()` call site in `WebApp.java` today (the close button, and two other
exit paths) sets it before `onStop()` runs. Home and the recents switcher leave the Activity stopped-but-
resumable, so `isFinishing()` reads false there — precisely the toggle this feature must **not** turn into an
immediate write.

**Alternatives considered**:

- **Flush only periodically, never on stop** — rejected: a child who finishes a sub-app and returns to the
  launcher would see their session sit unwritten for up to 5 minutes, contradicting FR-003 and needlessly
  delaying data an analyst could otherwise see promptly.
- **Treat every `onStop()` as a flush trigger, as today** — rejected outright: this is the exact behavior the
  feature exists to change; keeping it delivers no reduction in write volume.
- **`onDestroy()` instead of `isFinishing()` in `onStop()`** — rejected: `onDestroy()` is not guaranteed to
  run promptly (or at all, if the process is later reclaimed) and running recovery logic from it duplicates
  work `onStop()` already does one callback earlier, for the same signal `isFinishing()` already exposes at
  `onStop()` time.

---

## D2 — Where the coalesced buffer lives, and how it survives Activity recreation

**Decision**: A process-wide static registry, `CoalescingUsageFlushers`, keyed by `appKey::language` —
structurally identical to the existing `SubAppUsageTimers` registry — handing out one `CoalescingUsageFlusher`
per key, created lazily and reused across `WebApp` instances.

**Rationale**: `SubAppUsageTracker.create()` is called fresh every time a `WebApp` Activity is created,
including every reopen of the same sub-app. `SubAppUsageTimer` already solves this by being held in a
process-wide map (`SubAppUsageTimers`) rather than on the tracker instance, "because that Activity is
recreated when a landscape sub-app calls `setRequestedOrientation()`, which would discard an Activity-scoped
timer's pending time" (per its own javadoc). The coalescing buffer has the identical requirement, for the
identical reason, plus one more: if it were Activity-scoped, reopening a sub-app after a Home-button toggle
would construct a *new*, empty `CoalescingUsageFlusher`, orphaning the previous instance's buffered time and
its running `HeartbeatTicker` — a leak indistinguishable from a bug. Mirroring `SubAppUsageTimers` exactly
keeps the two registries' lifetimes and failure modes identical and familiar to anyone who has read one.

**Alternatives considered**:

- **Buffer on `SubAppUsageTracker` itself** — rejected per D1's reasoning applied a second time: the tracker
  is Activity-scoped and does not survive reopening the sub-app.
- **A single process-wide buffer for all sub-apps/languages** — rejected: FR-012 requires each
  `appKey::language` combination to batch and flush independently; one shared buffer would either merge
  identities (wrong document) or need internal partitioning anyway, at which point it is this design with
  extra indirection.

---

## D3 — Persisting the pending buffer

**Decision**: A dedicated `SharedPreferences` file, `sub_app_usage_pending_writes`, behind a new
`PendingUsageWriteStore` interface, one entry per `appKey::language` key holding a single delimited-string
`PendingUsageWrite` record (`appKey`, `language`, `crUserId`, `cappedSeconds`, `rawSeconds`) — the same
storage technology and encoding style `SharedPreferencesOpenStretchStore` already uses for `OpenStretchRecord`.

**Rationale**: Same durability requirement as MR-182 (survive a process kill), same scale (single-digit
records), same reasons `AppContext` and Room were rejected there (D1 in MR-182's research — a fixed-key
single-value cache and a heavyweight migration-bearing store, respectively, neither fits a variable number of
small multi-field records). Reusing the pattern rather than inventing a second one keeps the two stores
readable side by side. The record is deliberately **simpler** than `OpenStretchRecord`: no `bootToken`,
`segmentStartMs`, or `lastAliveMs`, because a `PendingUsageWrite` holds only already-drained whole seconds —
a settled measurement with no elapsed-time anchor to protect (see D4).

**Alternatives considered**: a single combined store/file shared with `OpenStretchRecord` — rejected, see D4.
JSON via Gson — rejected for the same reason MR-182 rejected it: pulled onto a path (every fold) that runs far
more often than a launch-time read, for no benefit over a handful of delimited longs.

---

## D4 — Why the pending buffer needs its own record, separate from `OpenStretchRecord`

**Decision**: Two independent stores, two independent record shapes, two independent recovery passes
(`OpenStretchRecovery`, unchanged, and the new `PendingUsageWriteRecovery`). `OpenStretchRecorder`'s existing
persist/clear logic is untouched.

**Rationale**: This is the spec's central risk (Input: "coalescing also opens a new loss window that MR-182's
recovery marker doesn't cover") made concrete. `OpenStretchRecord` exists to protect time the timer has **not
yet drained** — it is written from `SubAppUsageTimer.undrained()` and is only ever meaningful within the boot
it was written in, which is why it carries a `bootToken` and gets discarded across a reboot. The moment
`stopAndDrain()` runs, that time leaves the timer entirely; `OpenStretchRecorder.persist()` already reacts to
this correctly today — `timer.undrained().isEmpty()` becomes true and the marker is deleted (or would be, the
next time anything touches the recorder) — but *only once something durable exists to replace it*. Before
this feature, that replacement was "the Firestore write is already in flight" one call later; coalescing
inserts a real gap between "drained" and "durably queued for Firestore" that can now span minutes, not
milliseconds.

A `PendingUsageWrite` is what occupies that gap. Its lifetime is exactly "drained but not yet durably
flushed" — the complement of `OpenStretchRecord`'s "not yet drained" — so at every instant the time genuinely
in play for one `appKey::language` key is described by **at most one** of the two records, never both and
never neither. Recovering it as ordinary duration (never `cr_recovered_*`) follows directly: unlike an open
stretch, whose end is unknown and must be estimated from a last-known-alive point, a drained stretch's
duration was already computed exactly by `SubAppUsageTimer.stopAndDrain()` before it ever reached the buffer.
Recovering it is retrieving a completed number, not estimating one — and, because it carries no
elapsed-time anchor at all (no start time, no boot token), it needs none of `OpenStretchRecord`'s
reboot-discard logic (D... below) either: a device restart between the crash and the next launch does not
make `cappedSeconds`/`rawSeconds` any less true.

**The handoff ordering that keeps this correct**: `SubAppUsageTracker.flush()` already calls
`recorder.clear()` only inside the flusher's `onQueued()` callback — see MR-182's own D6. That code is
**unchanged** by this feature. What changes is what `onQueued()` now means for a coalesced flush: it fires
the moment `CoalescingUsageFlusher.flush()` has folded the segment into the buffer **and** durably persisted
that fold via `PendingUsageWriteStore.save()` — not the moment Firestore has accepted anything. Because that
fold-and-persist is synchronous (an in-memory update plus one `SharedPreferences.apply()`), by the time
`recorder.clear()` runs, the seconds already exist in the new persisted record. `SharedPreferences.apply()`
queues its write on a single background thread (`QueuedWork`) and executes queued writes in submission order,
so the buffer's `apply()` is guaranteed to reach disk no later than the marker-clearing `apply()` that follows
it — the two never race in a way that could lose the seconds. This is the same trust in `apply()` ordering
MR-182 already relies on for heartbeat-then-clear; nothing new is being assumed of the platform.

**Alternatives considered**:

- **One combined store, one combined record carrying both undrained and pending-buffer state** — rejected:
  conflates two lifetimes with different validity rules (one reboot-scoped, one not) into one type, forcing
  every reader to re-derive which half of the record still means anything. Splitting them is also what makes
  "recovered pending time must not touch `cr_recovered_*`" trivial to get right — the two recovery passes
  simply build different kinds of `UsageSegment` by construction, rather than one recovery pass needing an
  `if` to decide.
- **Clear the `OpenStretchRecord` only after the real Firestore write is durably queued (i.e., delay
  `recorder.clear()` until the coalesced buffer itself flushes)** — rejected: this would leave the
  open-stretch marker sitting on disk, claiming undrained time that the timer no longer holds, for up to 5
  minutes per key. A crash in that window would double-recover the same seconds: once from the (stale)
  `OpenStretchRecord` as an *estimate*, and again from the `PendingUsageWrite` as a *measurement*. Handing off
  the instant the buffer durably holds the time, as designed, is what keeps the two records' claims disjoint.

---

## D5 — Periodic flush mechanism

**Decision**: Reuse `HeartbeatTicker`/`ExecutorHeartbeatTicker` verbatim. `CoalescingUsageFlusher` starts a
tick at `DEFAULT_FLUSH_INTERVAL_MS` (5 minutes) the moment a key's buffer goes from empty to non-empty, and
stops it the moment the buffer is emptied by any flush — periodic or finish-triggered.

**Rationale**: MR-182 already built exactly this seam — "repeats a small piece of work... injected so a test
can fire ticks by hand" — for the identical shape of problem (do something on a bounded interval, cancel it
cleanly, never on the main thread, never let a thrown tick kill future ticks). Introducing a second scheduling
mechanism for the same shape of requirement would be a straightforward Constitution Principle IV violation
("SDKs behind own interfaces," implicitly: don't duplicate an existing one). Starting the tick only while
something is buffered — rather than running it unconditionally for the life of the process — keeps idle
sub-apps from ticking for nothing, and is what makes "no orphaned... pending buffer behind" (FR-013) true
without a separate cleanup pass: an empty buffer has no ticker and no persisted record.

**Alternatives considered**: `WorkManager` — rejected for the same reason MR-182 rejected it for recovery: a
new dependency and scheduling surface for a few-times-a-minute in-process tick. A single process-wide ticker
shared across all keys — rejected: couples unrelated `appKey::language` pairs' flush timing together,
against FR-012's independence requirement, for a saving (one thread vs. a handful) the constitution's
"negligible beside a running WebView" standard (MR-182 D3) does not require.

---

## D6 — Recovery: bypass the coalescer, write directly

**Decision**: `PendingUsageWriteRecovery` reads `PendingUsageWriteStore.loadAll()` directly and, for each
record, builds an ordinary `UsageSegment(appKey, language, cappedSeconds, rawSeconds)` — the plain
four-argument constructor, which sets `recoveredSeconds`/`recoveredCount` to zero — and flushes it through a
`FlusherFactory.forUser(record.crUserId)`, deleting the record only in `onQueued()`. It does **not** go
through `CoalescingUsageFlusher` at all.

**Rationale**: Recovery runs once, at launch, before any sub-app is open — there is nothing to batch with, and
routing a single recovered write through a fresh buffer-and-ticker would add a 5-minute (or crash-again) delay
to data that is already fully known and just needs to reach Firestore. Writing it directly is simpler and
matches `OpenStretchRecovery`'s own precedent to the letter. The choice of the plain `UsageSegment` constructor
— rather than `UsageSegment.recovered(...)` — is what makes FR-009 ("must not touch `cr_recovered_*`")
structurally true rather than merely tested: the recovered-fields path is a different factory method entirely,
so there is no flag or branch to get wrong.

`FlusherFactory` — currently a nested interface of `OpenStretchRecovery` — is hoisted into
`core/usage/flush` as its own file so both recovery classes share one abstraction instead of two identical
ones (Interface Segregation is already satisfied by its single method; the duplication would be the actual
violation here — Principle II's spirit, not its letter). This is a pure refactor: `OpenStretchRecovery`'s
behavior and public surface are otherwise unchanged.

**Alternatives considered**: Route recovery through `CoalescingUsageFlushers.getInstance(...)` so the
recovered amount joins whatever a live session buffers next — rejected: it would make a fully-known,
already-measured amount wait on an arbitrary future flush trigger, for no benefit, and would tangle recovery's
lifetime (launch-time, single pass) with the coalescer's (process-lifetime, per-key) for no reason.

---

## D7 — Threading through `finishing` without widening `SubAppUsageFlusher`'s contract

**Decision**: `SubAppUsageFlusher` gains one `default void flushPending() {}` method (a no-op for every
existing implementer), which only `CoalescingUsageFlusher` overrides. `SubAppUsageTracker.flush(boolean
finishing)` calls `flusher.flushPending()` unconditionally when `finishing` is true, after handing off the
just-drained segment via the existing `flush(segment, callback)` path.

**Rationale**: The interface already carries one default method for exactly this kind of reason (`flush(seg)`
defaults to `flush(seg, null)` "for callers with nothing to release"). A second default method keeps
`SubAppUsageTracker` holding a single collaborator — no second constructor parameter, no `instanceof` check,
no second interface to wire through `SubAppUsageTracker.create()` and every test double. `FirestoreUsageFlusher`
and any test fake simply never override it, at zero cost. A caller that is not finishing never calls it, so a
plain (non-coalescing) flusher's behavior is unaffected either way.

**Alternatives considered**:

- **A second, narrow interface (`PendingWriteFlusher`) injected alongside `flusher`** — rejected as more
  ISP-pure but strictly more machinery for the same outcome: a second constructor parameter on
  `SubAppUsageTracker`, a second field, and every existing test double for `SubAppUsageFlusher` would need an
  accompanying no-op `PendingWriteFlusher` even though only one concrete class ever does anything with it.
  Recorded here because it is the more textbook-SOLID choice and worth revisiting if `flushPending()`-like
  methods proliferate on this interface later.
- **Add a `finishing` parameter to `flush(segment, callback)` itself** — rejected: conflates "hand off a
  freshly drained segment" with "flush whatever is already buffered," which are different operations with
  different segments (or none) involved; `FirestoreUsageFlusher` would need to accept and ignore a parameter
  that means nothing to it.

---

## D8 — Flush interval as a tunable constant, not a runtime config value

**Decision**: `DEFAULT_FLUSH_INTERVAL_MS = 5 * 60 * 1000L` as a constant on `CoalescingUsageFlusher`, with a
package-private constructor overload accepting a custom interval for tests — the identical pattern
`SubAppUsageTimer.DEFAULT_CAP_MS`/`DEFAULT_DEBOUNCE_MS` and `OpenStretchRecorder.DEFAULT_HEARTBEAT_MS` already
use.

**Rationale**: The spec's own Assumptions section is explicit that "5 minutes is a starting default, not a
fixed constant" pending MR-189's write-volume data, and that this feature "requires the interval to exist and
be adjustable, not a specific final value." A single named constant, changed in one place, is exactly that —
consistent with how the two existing tunables in this same subsystem (`DEFAULT_CAP_MS`, `DEFAULT_HEARTBEAT_MS`)
are already documented as "a starting value to be tuned against real data." A remote-config-driven value was
not requested by the spec and would be new infrastructure with no present consumer.

**Alternatives considered**: Reading the interval from `AppContext` or a remote-config source at flush time —
rejected as speculative: no such source is named by MR-189 yet, and introducing one now would be scope beyond
what any FR requires.

---

## Resolved unknowns summary

| Unknown | Resolution |
|---|---|
| Distinguishing "finish" from a transient background toggle | `Activity.isFinishing()`, threaded through `onStop()` (D1) |
| Buffer lifetime across Activity recreation | Process-wide registry keyed by `appKey::language`, mirroring `SubAppUsageTimers` (D2) |
| Pending-buffer persistence | Dedicated `SharedPreferences` file behind `PendingUsageWriteStore` (D3) |
| Relationship to MR-182's `OpenStretchRecord` | Fully independent record/store/recovery; handoff ordering relies on `apply()`'s queued, in-order execution (D4) |
| Periodic flush scheduling | Reuse `HeartbeatTicker`, one per non-empty buffer (D5) |
| Recovery path for buffered time | Direct write via `FlusherFactory`, bypassing the coalescer; plain (non-recovered) `UsageSegment` (D6) |
| Signaling a genuine session end to the flusher | `default flushPending()` on `SubAppUsageFlusher`, a no-op everywhere but `CoalescingUsageFlusher` (D7) |
| Flush interval configurability | Named constant, override-by-constructor for tests, per existing subsystem precedent (D8) |

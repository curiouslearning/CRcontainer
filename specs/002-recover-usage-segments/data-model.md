# Phase 1 Data Model: Recover Open Usage Segments

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md) | **Research**: [research.md](./research.md)

Two kinds of data appear here: the **on-device record** that survives process death, and the **changes to
existing in-memory types** that carry a recovered stretch to the write path. The Firestore document shape
itself is fixed by MR-183 and specified in [contracts/](./contracts/usage-write-and-payload-contract.md).

---

## 1. `OpenStretchRecord` (new, `core/usage`)

An immutable value describing one sub-app's undrained usage state, as of the last moment the container was
able to write it down. Mirrors `UsageSegment`'s style: `public final` fields, no setters, safe to hand to a
callback that may run later.

| Field | Type | Meaning | Source |
|---|---|---|---|
| `appKey` | `String` | Manifest `app_id` — `feed-the-monster` or `assessment` | `SubAppIdResolver.resolve()` |
| `language` | `String` | Language the sub-app was launched in; part of the destination document's identity | `WebApp.usageLanguage()` |
| `crUserId` | `String` | The child identifier **in force when the stretch began** | `pseudoId` at `WebApp` create time |
| `bootToken` | `long` | Derived wall-clock instant of boot, identifying the device run | `BootTokenProvider` |
| `segmentStartMs` | `long` | `elapsedRealtime` at which the open segment began, or `NOT_RUNNING` (`-1`) when no segment is open | `MonotonicClock` |
| `lastAliveMs` | `long` | Latest `elapsedRealtime` at which the stretch was known alive | heartbeat tick / inbound event |
| `undrainedCappedMs` | `long` | Timer's accumulated post-cap total not yet written | `SubAppUsageTimer` |
| `undrainedTrimmedMs` | `long` | What the cap trimmed from those segments; keeps `raw = capped + trimmed` | `SubAppUsageTimer` |

### Identity

Keyed by `appKey + "::" + language.toLowerCase(Locale.ROOT)` — **the same key
`SubAppUsageTimers.key()` uses**. Reusing it rather than inventing a second scheme is what makes "one record
per timer" true by construction, so a record can never describe a stretch the timer does not hold, and
language-case differences cannot fork one child's time across two records.

### Validation rules

Derived from the spec's requirements, enforced when a record is read back:

| Rule | From | On violation |
|---|---|---|
| `appKey`, `language`, `crUserId` all non-blank | FR-002, FR-014 | Discard the record; log at `warn` |
| `bootToken` within ±5000 ms of the current boot token | FR-005 | **Discard**: write no duration, no `cr_recovered_*` counters, delete the record |
| `lastAliveMs >= segmentStartMs` when a segment is open | FR-016 (never negative) | Treat the open segment as contributing zero; keep undrained totals |
| Estimated total resolves to `>= 1` second | FR-011, FR-020 | Write nothing; delete the record |
| Serialised form parses with the expected field count | — | Discard the record; log at `warn`. A malformed record must never crash a launch (FR-015) |

### Serialised form

One `String` preference value per record: the eight fields in the order above, ``-separated (unit
separator — cannot occur in an `app_id`, a language name, or a `pseudoId`), prefixed by a schema version
token so a future field addition can be detected and an unrecognised version discarded rather than
misparsed. Chosen over JSON to avoid pulling Gson into a path that runs on every heartbeat, and over
`putLong`-per-field to keep one record atomic in a single `apply()`.

### Lifecycle

```text
                    segment opens (tracker.onResume, screen interactive)
                              │
                              ▼
                    ┌──────────────────┐   heartbeat tick (60s)
                    │      OPEN        │◄── inbound sub-app event
                    │ segmentStartMs>0 │──── both advance lastAliveMs
                    └──────────────────┘
                       │            │
       segment closes  │            │  process dies
    (pause/screen-off) │            │
                       ▼            │
             ┌──────────────────┐   │
             │     PAUSED       │   │  ← the hole D7 closes: today this
             │ start = -1,      │   │    state's time is lost too
             │ undrained > 0    │   │
             └──────────────────┘   │
                  │        │        │
     segment       │        │ process dies
     reopens ──────┘        │        │
                            ▼        ▼
                    ┌─────────────────────────┐
      timer drains  │   next container launch │
    (onStop, clean) │        RECOVERY         │
            │       └─────────────────────────┘
            ▼             │              │
      ┌──────────┐   boot matches   boot differs
      │ DELETED  │        │              │
      │ in       │        ▼              ▼
      │ onQueued │   estimate,      DISCARDED
      └──────────┘   emit, delete   (nothing written)
                     in onQueued
```

A record in `PAUSED` with `undrainedCappedMs == 0` and `undrainedTrimmedMs == 0` carries nothing and is
deleted without a write.

---

## 2. `UsageSegment` (changed, `core/usage`)

Gains two fields so one flush path serves both ordinary and recovered writes, rather than a parallel type
and a parallel flusher (Liskov: the flusher must not need to know which kind it holds).

| Field | Type | Ordinary segment | Recovered segment |
|---|---|---|---|
| `appKey` | `String` | unchanged | from the record |
| `language` | `String` | unchanged — but **now actually used** (see D5) | from the record |
| `cappedSeconds` | `long` | unchanged | the estimate from D2 |
| `rawSeconds` | `long` | `capped + trimmed` | **equal to `cappedSeconds`** (FR-008) |
| `recoveredSeconds` | `long` | `0` | same value as `cappedSeconds` |
| `recoveredCount` | `long` | `0` | `1` |

`isEmpty()` keeps its current meaning — nothing to write — and must now also account for the new fields, so
a segment carrying only recovered counters is not mistaken for empty.

**Why `rawSeconds == cappedSeconds` for a recovered segment**: `rawSeconds − cappedSeconds` exists to measure
how much the 30-minute cap trimmed from *genuinely measured* play, which is how the cap gets tuned. Feeding a
recovery estimate into the raw side would inflate that difference with guesswork. A recovered segment
therefore contributes exactly zero to it (FR-008, SC-004).

**Why a count as well as an amount**: a boolean `cr_recovered` was explicitly rejected in MR-182. On a
cumulative document a `"replace"` flag is sticky — one recovered segment marks the document permanently and
the information about *how much* of the total was estimated is destroyed. An amount plus a count, both
`"add"`, keeps both facts and composes offline (FR-009, FR-010).

---

## 3. `AppEventPayload` (changed, `core/subapp/payload`)

One new field, per D5. It stays a plain Gson DTO with public fields.

| Field | Type | Meaning |
|---|---|---|
| `container_language` | `String` | Language explicitly asserted by a **Java** caller. When present, the handler stamps `metadata.language` from it instead of from live `AppContext` state |

**Trust rule (Principle VI)**: `AppEventPayloadValidator` rejects any payload carrying a non-null
`container_language` when the payload originated at the JS bridge. The field is Gson-deserialisable — a
sub-app *can* put it on the wire — so the validator is what makes it Java-only, and a sub-app attempting it
is rejected loudly rather than silently honoured. Without this rule, sub-apps would gain the ability to
relabel their own data's language partition, which they cannot do today.

The validator therefore needs to know a payload's origin. The bridge path (`WebApp.WebAppInterface.logMessage`)
is the untrusted one; `AppEventEmitter` calls from Java are trusted. Passing that distinction explicitly into
validation — rather than inferring it — keeps the rule readable and testable.

---

## 4. Relationships

```text
SubAppUsageTimers ──── keyed by ────► appKey::language ◄──── keyed by ──── OpenStretchStore
        │                                                                        │
        ▼                                                                        ▼
  SubAppUsageTimer ◄── reads/restores undrained state ──► OpenStretchRecord
        │                                                          │
        │ stopAndDrain()                                           │ OpenStretchRecovery
        ▼                                                          ▼
   UsageSegment (recovered* = 0) ─────┐        ┌──── UsageSegment (recovered* set)
                                      ▼        ▼
                            FirestoreUsageFlusher
                                      │ .language(record.language)
                                      ▼
                              AppEventPayloadBuilder
                                      │
                                      ▼
                          AppEventEmitter → validator → DefaultAppEventPayloadHandler
                                      │
                                      ▼
                       summary_data doc  (cr_user_id + app_id + metadata.language)
```

The two producers of a `UsageSegment` — the live timer and the recovery pass — converge on one flusher, one
emitter, one validator, and one handler. No second write path (D5).

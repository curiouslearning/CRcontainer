# Phase 1 Data Model: Coalesce Sub-App Usage Writes

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md) | **Research**: [research.md](./research.md)

One new kind of data appears here: the **on-device pending-write record**, protecting time that has been
drained from the timer but not yet durably flushed to Firestore. No existing type changes shape —
`UsageSegment`, `OpenStretchRecord`, and the Firestore write itself (fixed by MR-183, extended by MR-182) are
all reused exactly as they are.

---

## 1. `PendingUsageWrite` (new, `core/usage/flush`)

An immutable value describing one `appKey::language` key's coalesced-but-unflushed total. Mirrors
`OpenStretchRecord`'s style — `public final` fields, no setters — but carries far less: a `PendingUsageWrite`
holds only already-drained whole seconds, with no elapsed-time anchor to protect.

| Field | Type | Meaning | Source |
|---|---|---|---|
| `appKey` | `String` | Manifest `app_id` — `feed-the-monster` or `assessment` | `SubAppIdResolver.resolve()` |
| `language` | `String` | Language the sub-app was launched in; part of the destination document's identity | `WebApp.usageLanguage()` |
| `crUserId` | `String` | The child identifier in force when the buffer's first fold happened (see [research.md](./research.md) D2) | `pseudoId` at first fold |
| `cappedSeconds` | `long` | Running sum of every folded segment's `cappedSeconds` since the last flush | `UsageSegment.cappedSeconds`, accumulated |
| `rawSeconds` | `long` | Running sum of every folded segment's `rawSeconds` since the last flush; always `>= cappedSeconds` | `UsageSegment.rawSeconds`, accumulated |

### Identity

Keyed by `appKey + "::" + language.toLowerCase(Locale.ROOT)` — the same key `SubAppUsageTimers.key()` and
`OpenStretchRecord.key()` already use. One record per `CoalescingUsageFlusher`, by construction.

### What it deliberately does not carry

Unlike `OpenStretchRecord`, no `bootToken`, `segmentStartMs`, or `lastAliveMs`. Those fields exist to bound an
*estimate* derived from an open-ended elapsed-time span, and to detect when that span no longer means anything
(a reboot). A `PendingUsageWrite` is not an estimate — `cappedSeconds`/`rawSeconds` are exact sums of values
`SubAppUsageTimer.stopAndDrain()` already computed — so there is no span to bound and no boot to check. This
is *why* it survives a device restart where an `OpenStretchRecord` must not (spec FR-011).

### Validation rules

| Rule | From | On violation |
|---|---|---|
| `appKey`, `language`, `crUserId` all non-blank | mirrors `OpenStretchRecord.hasUsableIdentity()` | Discard the record; log at `warn` |
| `rawSeconds >= cappedSeconds` | invariant carried from `UsageSegment` | Treated as `rawSeconds = cappedSeconds` defensively rather than rejecting the whole record — a corrupt raw value must not also destroy the recoverable capped time |
| `cappedSeconds > 0 OR rawSeconds > 0` | FR-004 — an empty buffer is never persisted in the first place | A record failing this should not exist; if one is somehow read, it is skipped, not written as a zero flush |
| Serialised form parses with the expected field count | — | Discard the record; log at `warn`. A malformed record must never crash a launch (same rule as `OpenStretchRecord`) |

### Serialised form

One `String` preference value per record, ``-delimited (the same ASCII unit separator
`SharedPreferencesOpenStretchStore` uses), version-prefixed the same way:

```text
v1␟<appKey>␟<language>␟<crUserId>␟<cappedSeconds>␟<rawSeconds>
```

Five fields plus the version token. Chosen for the same reasons MR-182 chose it for `OpenStretchRecord`: one
`apply()` per record, no Gson on a path that runs on every fold, a version token so a future field addition is
detected rather than misparsed.

### Lifecycle

```text
              first segment folds into an empty buffer
                              │
                              ▼
                    ┌──────────────────┐   another segment drains
                    │   BUFFERING      │◄── (onStop, not finishing)
                    │ cappedSeconds>0  │──── folds in, persisted, ticker (re)armed
                    └──────────────────┘
                       │              │
     finishing==true   │              │  5-minute HeartbeatTicker fires
    (flushPending)     │              │  (flushPending)
                       ▼              ▼
              ┌─────────────────────────────┐
              │  real Firestore flush        │
              │  via the delegate flusher     │
              └─────────────────────────────┘
                       │              │
                 onQueued()      onFailed()
                       │              │
                       ▼              ▼
              ┌──────────┐     ┌───────────────────┐
              │ DELETED, │     │ record kept as-is; │
              │ ticker   │     │ ticker keeps        │
              │ stopped  │     │ running — retried    │
              └──────────┘     │ on the next interval │
                                └───────────────────┘

                     process dies while BUFFERING
                              │
                              ▼
                    ┌─────────────────────────┐
                    │   next container launch  │
                    │  PendingUsageWriteRecovery│
                    └─────────────────────────┘
                              │
                              ▼
                 ordinary UsageSegment(appKey, language,
                   cappedSeconds, rawSeconds) — ​recoveredSeconds
                   and recoveredCount both 0 — flushed directly,
                   deleted only in onQueued()
```

A record is written on every fold (so a crash mid-buffering loses nothing) and deleted only once its contents
are durably queued for Firestore — identical durability philosophy to `OpenStretchRecord`, applied to a
different span of time (see [research.md](./research.md) D4).

---

## 2. Relationship to `OpenStretchRecord` — the partition invariant

At any instant, for one `appKey::language` key, the seconds genuinely accumulated and not yet in Firestore are
described by **at most one** of the two records:

```text
SubAppUsageTimer (undrained)  ──stopAndDrain()──►  UsageSegment  ──fold──►  PendingUsageWrite
        │                                                                          │
        │ OpenStretchRecorder.persist()                                            │ flushPending()
        ▼                                                                          ▼
  OpenStretchRecord                                                        real Firestore write
  (deleted the instant                                                     (PendingUsageWrite deleted
   the fold above is                                                        the instant onQueued() fires)
   durably persisted)
```

Neither record's writer needs to know the other exists — `OpenStretchRecorder`'s code is untouched by this
feature — because the boundary between them is exactly the return of `stopAndDrain()`, which already empties
the timer's undrained state as a side effect. `OpenStretchRecorder.persist()` reacting to that emptiness (by
discarding its own marker) was already correct before this feature; what changes is only *how much later* the
seconds it hands off reach Firestore.

---

## 3. `UsageSegment`, `AppEventPayload`, and the Firestore write — unchanged

No field is added to any of these. A coalesced flush builds exactly the `UsageSegment` shape a live flush
always has — `new UsageSegment(appKey, language, cappedSeconds, rawSeconds)`, the plain four-argument
constructor MR-182 introduced — whether the seconds came from summing several folds or from a single one. A
recovered `PendingUsageWrite` builds the identical shape. The write contract this produces is unchanged from
MR-183/MR-182 and is restated, with its new timing invariants, in
[contracts/usage-write-coalescing-contract.md](./contracts/usage-write-coalescing-contract.md).

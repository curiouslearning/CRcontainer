# Contract: Coalesced Usage Write Timing & Internal Seams

**Feature**: [spec.md](../spec.md) | **Plan**: [plan.md](../plan.md) | **Data model**: [data-model.md](../data-model.md)

The Firestore write **shape** is fixed by MR-183 and untouched here — no field is added, removed, or
renamed. What this feature changes is **timing** (when a write happens) and **volume** (how many happen), plus
two new internal seams (`SubAppUsageFlusher.flushPending()` and `PendingUsageWriteStore`) that other classes
in this package now depend on. No sub-app or JS-bridge contract changes at all: no payload crosses the bridge
for this feature, so there is nothing for `AppEventPayloadValidator` to gain or lose.

---

## 1. Firestore write: `summary_data` — shape unchanged, timing constrained

### Fields written by a coalesced flush (identical to an ordinary flush)

| Field | Merge | Value |
|---|---|---|
| `cr_duration_seconds` | `add` | sum of `cappedSeconds` across every stretch folded into this flush |
| `cr_duration_raw_seconds` | `add` | sum of `rawSeconds` across every stretch folded into this flush |

`cr_recovered_seconds`/`cr_recovered_count` are **never** written by a coalesced or recovered-pending-buffer
flush — those two fields remain exclusively MR-182's, for genuine estimates. See §3.

### Timing invariants (new)

| Invariant | Spec |
|---|---|
| No write occurs for an `appKey::language` key between two consecutive real Firestore flushes for **less than** the configured flush interval, unless a genuine session end (`isFinishing()==true`) occurs first | FR-002, FR-003 |
| No write occurs for an `appKey::language` key whose buffer is empty | FR-004 |
| A write's `cr_duration_seconds` equals the exact sum of the per-segment capped values folded into it — the per-segment cap (MR-178/MR-180) is applied once, at drain time, and never re-applied to the sum | FR-005 |
| A write's `cr_duration_raw_seconds` equals the exact sum of the per-segment raw values folded into it, and is always present alongside `cr_duration_seconds` | FR-006 |
| The total `cr_duration_seconds` recorded for a span of activity is identical whether or not coalescing occurred — coalescing changes write count, never recorded amount | FR-014 |

### Consumer guidance (unchanged from MR-182/MR-183)

Nothing about how an analyst reads `summary_data` changes. `cr_duration_seconds` still includes any recovered
time (MR-182 estimates *and*, as of this feature, recovered pending-buffer measurements — the latter
indistinguishable in the field itself from a live flush, by design). The
`measured_seconds = cr_duration_seconds - cr_recovered_seconds` guidance from MR-182's contract is unaffected:
a recovered pending-buffer write does not touch `cr_recovered_seconds`, so it correctly counts as
"measured," not "recovered," in that subtraction.

---

## 2. Internal seam: `SubAppUsageFlusher.flushPending()`

```java
public interface SubAppUsageFlusher {
    void flush(UsageSegment segment, @Nullable AppEventWriteCallback callback);
    default void flush(UsageSegment segment) { flush(segment, null); }

    /** NEW: flushes whatever is currently buffered for this flusher's key, if anything. A no-op for a
     *  flusher that does not buffer. Fire-and-forget: callers with a session genuinely ending call this
     *  after handing off their last segment, and do not wait on it. */
    default void flushPending() { }
}
```

| Implementer | `flush(segment, callback)` | `flushPending()` |
|---|---|---|
| `FirestoreUsageFlusher` | writes immediately, as today | inherited no-op (nothing is ever buffered) |
| `CoalescingUsageFlusher` | folds into the buffer, persists, calls back `onQueued()` synchronously once persisted | forces whatever is buffered out to its delegate `FirestoreUsageFlusher` now, bypassing the periodic ticker |
| A test fake implementing only the interface | as the test defines | inherited no-op unless the test overrides it |

**Contract for `onQueued()` on a coalescing flusher**: fires the moment the segment is durably folded into the
persisted `PendingUsageWrite` — **not** when Firestore has accepted anything. This is deliberate (see
[research.md](../research.md) D4): it is what lets `SubAppUsageTracker`'s existing, unmodified
`recorder.clear()`-in-`onQueued()` logic keep meaning "safe to discard the other copy," now for a different
"other copy" (the buffer) than before (the network write).

---

## 3. Internal seam: `PendingUsageWriteStore` and `PendingUsageWriteRecovery`

```java
public interface PendingUsageWriteStore {
    List<PendingUsageWrite> loadAll();
    void save(PendingUsageWrite write);
    void delete(String key);
}
```

Structurally identical to `OpenStretchStore`, and deliberately not shared with it — see
[research.md](../research.md) D3–D4 for why the two record types must not be conflated.

### Recovery invariant

| Invariant | Spec |
|---|---|
| A recovered `PendingUsageWrite` is written using the plain `UsageSegment(appKey, language, cappedSeconds, rawSeconds)` constructor — `recoveredSeconds`/`recoveredCount` are `0` | FR-009 |
| Recovery is unaffected by a device restart between the crash and the relaunch — no boot-token check gates it | FR-011 |
| A `PendingUsageWrite` is deleted only in its recovery flush's `onQueued()`, never eagerly and never on `onFailed()` | mirrors MR-182's D6, applied to this record |
| Two independent open states for the same key — an `OpenStretchRecord` and a `PendingUsageWrite` — may both exist at process-kill time and both recover, contributing disjoint, non-overlapping seconds | Edge case, spec §Edge Cases |

---

## 4. What does not change

- `window.Android.logMessage(...)` and every other bridge method: untouched. No payload for this feature
  crosses the JS↔native boundary.
- `AppEventPayloadValidator`: no new rule, no new field to reject or admit.
- `AppEventPayloadBuilder`/`AppEventPayload`/`DefaultAppEventPayloadHandler`: untouched. A coalesced or
  recovered-pending write reaches Firestore through the exact same builder → emitter → validator → handler
  path as any other usage write.
- `OpenStretchRecord`, `OpenStretchStore`, `SharedPreferencesOpenStretchStore`, `OpenStretchRecorder`: all
  untouched. Only `OpenStretchRecovery` changes, and only to import a hoisted `FlusherFactory` instead of
  declaring its own — zero behavior change.
- The 30-minute per-segment cap and its per-segment (not per-drain, not per-coalesced-write) application:
  unchanged, per MR-178/MR-180.

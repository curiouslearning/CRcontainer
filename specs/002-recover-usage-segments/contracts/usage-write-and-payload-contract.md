# Contract: Recovered Usage Write & Payload Surface

**Feature**: [spec.md](../spec.md) | **Plan**: [plan.md](../plan.md) | **Data model**: [data-model.md](../data-model.md)

Two contracts change. The Firestore write shape was defined by MR-183 and is **extended** here with the
recovery fields MR-182 reserved. The payload surface gains one Java-only field with an explicit trust rule.
Neither the JS bridge's method signatures nor any sub-app's obligations change: no sub-app needs to do
anything for this feature to work.

---

## 1. Firestore write: `summary_data`

### Document identity (unchanged)

A usage document is keyed on `cr_user_id` + `app_id` + `metadata.language`. Recovered time lands in the
**same document** as ordinary usage for that triple — that is the entire point of the metric, and why the
language must come from the record rather than from live state.

### Fields written by a usage flush

| Field | Merge | Ordinary flush | Recovered flush |
|---|---|---|---|
| `cr_duration_seconds` | `add` | capped total for the drain | the recovered estimate |
| `cr_duration_raw_seconds` | `add` | `capped + trimmed` | **the recovered estimate, unchanged** |
| `cr_recovered_seconds` | `add` | *omitted* | the recovered estimate |
| `cr_recovered_count` | `add` | *omitted* | `1` |

Every field is `"add"`, so each write is a pure `FieldValue.increment` with no read-then-write, composing
correctly offline and across concurrent writers.

### Invariants

These are the contract, and each maps to a spec criterion:

| Invariant | Spec |
|---|---|
| `cr_recovered_seconds <= cr_duration_seconds` on any document, always | SC-003, US2 §3 |
| A recovered flush changes `cr_duration_raw_seconds − cr_duration_seconds` by exactly **0** | FR-008, SC-004 |
| `cr_recovered_count` equals the number of recovery events; `cr_recovered_seconds` equals their sum | US2 §2 |
| No `cr_recovered` boolean field is ever written, under any circumstance | FR-010, US2 §5 |
| A discarded (wrong-boot) stretch writes **nothing** — not a zero duration, not a zero-length recovery | FR-005, US3 §2 |
| A stretch estimating to zero seconds writes nothing | FR-011, FR-020 |
| Fields omitted on an ordinary flush stay absent rather than being written as `0` | — keeps "never recovered" distinguishable from "recovered zero" |

### Consumer guidance

`cr_duration_seconds` includes recovered time. To get measured-only container time:

```text
measured_seconds = cr_duration_seconds - cr_recovered_seconds
```

which is guaranteed non-negative. `cr_recovered_count` gives the number of estimates behind that figure, so
a mean recovered stretch is `cr_recovered_seconds / cr_recovered_count`.

**Still do not sum `cr_duration_seconds` with FTM's `time_spent_total_second`.** They measure different
things — container foreground time versus in-level play time — and this feature does not change that. Compare
them; never add them.

---

## 2. Payload surface: `container_language`

### Shape

```java
// AppEventPayload — plain Gson DTO, public fields
public String container_language;   // NEW: language asserted by a Java caller
```

Set only through the builder:

```java
AppEventPayload payload = new AppEventPayloadBuilder()
        .crUserId(record.crUserId)
        .appId(record.appKey)
        .collection("summary_data")
        .schemaVersion("v1")
        .language(record.language)          // NEW
        .add("cr_duration_seconds", seconds)
        .add("cr_duration_raw_seconds", seconds)
        .add("cr_recovered_seconds", seconds)
        .add("cr_recovered_count", 1L)
        .build();
```

### Handler resolution order (changed behaviour)

`DefaultAppEventPayloadHandler` currently stamps `metadata.language` from `AppContext.LANGUAGE`
unconditionally, overwriting whatever the caller set (`DefaultAppEventPayloadHandler.java:144-147`). New
order:

1. `payload.container_language`, when non-null and non-blank → stamped into `metadata.language`
2. otherwise `AppContext.LANGUAGE`, when non-null and non-blank → stamped (today's behaviour)
3. otherwise **left unstamped**

Step 3 is unchanged and must stay unchanged: the existing comment explains that a written sentinel would make
an unset-language document indistinguishable from one genuinely tagged with that sentinel, and would break
`storeSummaryPayload`'s field-presence query fallback.

### Trust rule — the security-relevant part

| Origin | `container_language` present | Outcome |
|---|---|---|
| JS bridge (`WebApp.WebAppInterface.logMessage`) | yes | **Payload rejected.** `ValidationResult` invalid, logged as an error, nothing written |
| JS bridge | no | Handled as today |
| Java (`AppEventEmitter` from container code) | yes | Honoured — step 1 above |
| Java | no | Handled as today |

**Why rejection and not silent stripping**: a sub-app sending this field is either confused or probing. Both
are worth a loud, testable signal — and silent stripping would make the same payload behave differently
depending on a caller distinction invisible in the log.

**Why the rule exists at all**: today the container always wins the language stamp, so a sub-app cannot
relabel which language partition its data lands in. Honouring a caller-supplied language without this rule
would hand sub-apps exactly that ability. Principle VI requires the bridge gain no new capability, so the
capability is Java-only by construction.

### Unmet constitution gate

"Development Workflow & Quality Gates" requires that a change touching a bridge-facing class ship tests for
its validation/handler logic. **No unit tests ship on this branch**, so that gate is open. The behaviour it
would have pinned down, and which must therefore be checked by hand or by the tests when they land:

- A JS-origin payload carrying `container_language` is rejected; the same payload from Java is accepted;
  an absent field changes nothing on either path.
- `container_language` wins over an `AppContext` language; `AppContext` is used when the field is absent;
  with neither present, `metadata.language` is left unstamped rather than given a sentinel.

---

## 3. What does not change

- `window.Android.logMessage(...)` and every other bridge method keep their signatures and semantics.
- No sub-app change is required, and none is implied. FTM's events are *observed* where they already arrive;
  a sub-app that reports nothing is recovered with equal accuracy (SC-009).
- `user_sessions_data` is untouched — this feature writes only `summary_data`.
- The 30-minute per-segment cap and its per-segment (not per-drain) application are unchanged, per MR-178.
- `synced_at`, `container_app_version`, `country`, and the attribution fields keep being stamped by the
  handler exactly as they are today.

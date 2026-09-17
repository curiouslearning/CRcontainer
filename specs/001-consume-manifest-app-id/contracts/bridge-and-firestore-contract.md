# Contract: JS↔Native Bridge Payload & Firestore Records

This feature changes trust/attribution, not wire shape. Every field name, type, and collection
listed below is unchanged; only the *source* of `app_id` on outgoing Firestore records changes.

## 1. Manifest → On-Device Catalog

| Manifest JSON field | Type | Consumed as |
|---|---|---|
| `appId` | number | `WebApp.appId` (unchanged, on-device selection key) |
| `app_id` | string | **New.** `WebApp.app_id` — stored, not otherwise interpreted by the container |
| `title`, `language`, `appUrl`, `appIconUrl`, `languageInEnglishName` | string | unchanged |

A manifest entry omitting `app_id` is still accepted and stored (`WebApp.app_id = null`); that
sub-app remains listed and launchable.

## 2. JS Sub-App → Native Bridge (`WebAppInterface.logMessage`, `AppEventPayload`)

| Field | Before this feature | After this feature |
|---|---|---|
| `app_id` | **Required.** `AppEventPayloadValidator` rejects the payload if missing/blank. Used directly as the Firestore `app_id` field/query value. | **Optional / advisory only.** May be present or absent; if present, its value is never read by `DefaultAppEventPayloadHandler`. Absence no longer fails validation. |
| All other fields (`cr_user_id`, `collection`, `data`, `options`, `metadata`, `attribution`, `timestamp`, `schema_version`) | unchanged | unchanged |

A sub-app is not required to change what it sends. A sub-app that keeps sending its own `app_id`
sends it harmlessly into a field the container no longer consults.

## 3. Native → Firestore

### `user_sessions_data` (direct insert, `storeUserSessionPayload`)

| Field | Before | After |
|---|---|---|
| `app_id` | `payload.app_id` (sub-app-supplied) | Resolved in order: `current_app_id` → `payload.app_id` → literal `"unknown"` (see §3a) |
| all other fields | unchanged | unchanged |

### `summary_data` (query-then-upsert, `storeSummaryPayload`)

| Field / query clause | Before | After |
|---|---|---|
| `record.app_id` (written field) | `payload.app_id` | Resolved value (§3a) |
| `.whereEqualTo("app_id", …)` (both the language-known and language-unknown lookup paths) | `payload.app_id` | Resolved value (§3a) |
| all other fields/clauses | unchanged | unchanged |

### 3a. `app_id` resolution order (applies to both collections above)

1. `current_app_id` — used when available; this is the common, fully-trusted case.
2. `payload.app_id` — used only when (1) is unavailable. A warning is logged
   (`AppEventHandler` tag) naming this fallback.
3. Literal `"unknown"` — used only when both (1) and (2) are unavailable. A warning is logged
   (`AppEventHandler` tag) naming this fallback.

No other value is ever substituted at any step ("do not guess" — spec FR-007). Unlike the
required-field guard still in place for `cr_user_id` and `collection` (missing either still blocks
the write), a missing `app_id` no longer blocks the write/query — it degrades through the order
above instead, so a document is always produced once `cr_user_id`, `collection`, and `data` are
present.

## 4. What does not change

- Firestore collection names, all other field names/types, and the `summary_data`
  language-partitioning logic (`metadata.language`) are untouched.
- `AppEventPayload`'s class shape is untouched — no field added or removed.
- Sub-apps require no changes to keep working; this is purely a container-side attribution fix.

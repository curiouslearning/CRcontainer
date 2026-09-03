# Phase 1 Data Model: Consume Manifest app_id

No new entities are introduced. This feature adds one field to an existing persisted entity, one
key to an existing in-memory keyed store, and changes which value populates an existing Firestore
field — it does not change the shape of any Firestore document or the JS↔native payload contract.

## Sub-App Catalog Entry (`WebApp`, existing Room entity — `web_app_table`)

Existing fields (unchanged):

| Field | Type | Notes |
|---|---|---|
| `appId` | `int` (Room `@PrimaryKey`) | On-device identifier; used for local selection/lookup and launch-intent wiring. Unaffected by this feature. |
| `title` | `String` | Display name. |
| `language` | `String` | Display language. |
| `appUrl` | `String` | Sub-app launch URL. |
| `appIconUrl` | `String` | Catalog icon. |
| `languageInEnglishName` | `String` | Used for language-filtered queries. |

New field:

| Field | Type | Notes |
|---|---|---|
| `app_id` | `String`, nullable | **New.** Sourced from the manifest's `app_id` key (Gson-mapped 1:1 — field kept snake_case to match the manifest JSON key directly, matching the precedent already set by `AppEventPayload.app_id` for cross-boundary/Firestore-facing identifiers, rather than the camelCase used by this entity's on-device-only fields). Nullable to tolerate a manifest entry that predates the server-side rollout of this field (spec edge case) — such an entry stays stored and launchable; only its `app_id` is absent. |

**Validation rules**: none beyond nullability — `app_id` is not a Room primary/unique key
(`appId` remains the key); manifest content itself (including whether values are unique or shared
across entries) is out of scope per spec Assumptions.

**Lifecycle**: Replaced wholesale on every manifest sync, same as every other field — the existing
`WebAppDatabase.deleteWebApps` + `insertAll` replace cycle already re-derives the full catalog
(including `app_id`) from the network response on each refresh; no per-field update logic is
needed.

**Schema change**: `DatabaseHelper`'s `@Database(entities = { WebApp.class }, version = 2)` becomes
`version = 3`. The existing `fallbackToDestructiveMigration()` handles the bump (catalog is a
disposable cache — see [research.md](./research.md) §1).

## Current App Identifier (`current_app_id`, new `AppContextKey` value)

| Property | Value |
|---|---|
| Key | `AppContextKey.CURRENT_APP_ID` (new enum constant) |
| Backing store | Existing `AppContext` (SharedPreferences-backed keyed store) |
| Value type | `String` |
| Set | In `WebApp.getIntentData()`, from the `"app_id"` launch-intent extra, at the same point `AppContextKey.HOSTNAME` is set today — i.e. before the WebView (and therefore the JS bridge) can load. |
| Read | In `DefaultAppEventPayloadHandler`, via the existing `resolveContextString(AppContextKey.CURRENT_APP_ID, null)` helper, inside the new `resolveAppId(payload)` method — the first step of the fallback order below. |
| Cleared / replaced | Overwritten (not explicitly cleared) the next time any sub-app is launched. Not required to survive a full app process restart (spec Assumption); not required to be cleared on return-to-home, since no home-screen code path performs a Firestore operation keyed by `app_id` today. |
| Absent case | The launched catalog entry has no stored `app_id` (edge case above): `resolveContextString` returns `null`; `resolveAppId` falls back per the resolution order below rather than withholding the operation (spec FR-007, revised). |

### `app_id` resolution order (`DefaultAppEventPayloadHandler.resolveAppId`)

Used once per `storePayload` call, feeding every Firestore field/query that previously read
`payload.app_id` directly:

1. `current_app_id` — used as-is when present; no warning logged.
2. `payload.app_id` (the sub-app's own reported value) — used only when (1) is missing; logs a
   warning naming this fallback.
3. Literal `"unknown"` — used only when both (1) and (2) are missing; logs a warning naming this
   fallback.

No other value is ever substituted — see spec FR-007 ("MUST NOT infer, guess, or otherwise derive
an `app_id` value outside this order").

## Incoming Bridge Payload (`AppEventPayload`) — unchanged shape, changed trust level

No fields are added or removed. `app_id` remains present on the class for backward JSON
compatibility, but:

- `AppEventPayloadValidator` no longer treats a missing/blank `payload.app_id` as invalid.
- `DefaultAppEventPayloadHandler` no longer reads `payload.app_id` for any Firestore field or
  query — see [contracts/bridge-and-firestore-contract.md](./contracts/bridge-and-firestore-contract.md).

## Firestore Records (`user_sessions_data`, `summary_data`) — unchanged shape, changed source

Both collections keep an `app_id: String` field and both `summary_data` queries keep filtering on
`app_id`, exactly as today. Only the *source* of that value changes: the resolution order above
(current_app_id, else payload.app_id, else `"unknown"`) instead of always `payload.app_id`. Full
before/after detail is in
[contracts/bridge-and-firestore-contract.md](./contracts/bridge-and-firestore-contract.md).

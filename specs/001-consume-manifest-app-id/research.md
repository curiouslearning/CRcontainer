# Phase 0 Research: Consume Manifest app_id

No `NEEDS CLARIFICATION` markers remain from the spec — the one open question (where to store
`app_id` on-device) was resolved during `/speckit-clarify` in favor of reusing the existing
manifest catalog storage. The decisions below cover the remaining technical choices needed to
implement that direction with the smallest reasonable footprint, per explicit user guidance
("keep a small footprint, do not over-abstract, reuse where we can").

## 1. Where `app_id` is persisted on-device

**Decision**: Add `app_id` as a new nullable `String` column on the existing `WebApp` Room entity
(`web_app_table`), bump `DatabaseHelper`'s `@Database` version from 2 to 3, and rely on the
already-configured `Room.databaseBuilder(...).fallbackToDestructiveMigration()`.

**Rationale**: This *is* the storage already used for the manifest catalog (title, language,
URLs, icon, numeric `appId`) — clarified as the reuse target. The catalog is a disposable,
server-driven cache: every manifest refresh already does a full `deleteWebApps` + `insertAll`
replace (`WebAppRepository.fetchWebApp` / `getUpdatedAppManifest`), so a destructive migration on
schema bump loses nothing that isn't immediately re-synced from the network.

**Alternatives considered**:
- A separate `app_id`-mapping table/entity — rejected: adds a join/DAO for a 1:1 attribute of an
  existing row, contradicting the reuse decision and the "don't over-abstract" direction.
- A custom Room `Migration` preserving existing rows — rejected: unnecessary ceremony for a table
  that's fully re-populated from the network on every sync anyway; no user data lives here.

## 2. Where `current_app_id` lives in memory

**Decision**: Add `CURRENT_APP_ID` to the existing `AppContextKey` enum and set it via
`AppContext.getInstance().set(...)` in `WebApp.getIntentData()`, at the same point `HOSTNAME` is
already set there today.

**Rationale**: `AppContext` is the established, already-in-use mechanism for exactly this shape of
state: a value captured once when a sub-app launches and read later by
`DefaultAppEventPayloadHandler` via its existing `resolveContextString` helper (already used for
`LANGUAGE`, `CAMPAIGN_ID`, `SOURCE`, `HOSTNAME`). Reusing it means zero new classes.

**Alternatives considered**:
- A new dedicated singleton/holder class for this one value — rejected: over-abstraction for a
  single `String` where an existing, identically-shaped seam already exists.
- Threading `current_app_id` explicitly through `AppEventPayloadHandler.handle(payload)`'s method
  signature — rejected: `DefaultAppEventPayloadHandler` is an explicitly shared, process-level
  singleton (its own doc comment: "the container and every sub-app write through one handler");
  changing its public interface to carry one more parameter ripples to every caller for the same
  outcome a cheap context read already gives.

## 3. How `app_id` reaches the launched sub-app's activity

**Decision**: `WebAppsAdapter` reads `app_id` off the already-loaded `WebApp` catalog entry
(`webApps.get(position)`) and adds it as a new `"app_id"` extra on the launch `Intent`, exactly
like `title`, `language`, and `languageInEnglishName` are passed today. `WebApp.getIntentData()`
reads it back with `intent.getStringExtra("app_id")`.

**Rationale**: Matches the existing, working pattern for every other per-entry field the launched
activity needs — no new lookup path.

**Alternatives considered**:
- Having `WebApp` activity re-query `WebAppDao` by the numeric `appId` at `onCreate` — rejected:
  introduces a new asynchronous DB read (and loading-state handling) on the launch path for a
  value the adapter already holds in memory.

## 4. Incoming bridge payload's own `app_id` field

**Decision**: Relax `AppEventPayloadValidator.validate()` so it no longer treats a missing/blank
`payload.app_id` as a rejection.

**Rationale**: The spec's edge cases require that a sub-app payload omitting `app_id` entirely
still be processed successfully once the container stops depending on it (FR-006). Leaving the
existing hard-required check in place would reject exactly the payloads this feature is meant to
tolerate.

**Alternatives considered**:
- Leave the validator as-is and only ignore `payload.app_id` later in the handler — rejected:
  directly contradicts the "must still succeed when omitted" edge case, and keeps a misleading
  trust signal (a field that looks required but is actually ignored) in the validator.

## 5. How the handler resolves the trusted app id

**Decision**: `DefaultAppEventPayloadHandler.storePayload` resolves the trusted id once via the
existing `resolveContextString(AppContextKey.CURRENT_APP_ID, null)` helper and uses that value
everywhere it currently uses `payload.app_id` for a Firestore field or `whereEqualTo` query
(`storeUserSessionPayload`, `storeSummaryPayload`, the log line in `handle`). The existing
required-field guard in `storePayload` is extended to reject (and log) when this resolved value is
missing, instead of when `payload.app_id` is missing.

**Rationale**: `resolveContextString` already exists and already does exactly this job — read an
`AppContext` value, fall back safely, log when unavailable — for `CAMPAIGN_ID`/`SOURCE`/
`HOSTNAME`/`LANGUAGE`. Reusing it keeps this a same-shape change to an existing method rather than
a new code path.

**Alternatives considered**:
- Reading `AppContext` directly at each of the four call sites — rejected: duplicates the
  null-handling/logging `resolveContextString` already centralizes.

## 6. Resolving `app_id` when current_app_id is unavailable

**Decision**: `DefaultAppEventPayloadHandler` resolves `app_id` through a small private
`resolveAppId(AppEventPayload payload)` method, in this exact, fixed order:

1. `current_app_id` (via `resolveContextString(AppContextKey.CURRENT_APP_ID, null)`) — used
   silently when present; this is the common case and needs no warning.
2. `payload.app_id`, the sub-app-reported value — used only when (1) is null/blank, and logged at
   `Log.w` (tag `AppEventHandler`) identifying that current_app_id was unavailable and this
   fallback was taken.
3. The literal string `"unknown"` — used only when both (1) and (2) are null/blank, and logged at
   `Log.w` (tag `AppEventHandler`) identifying that both sources were unavailable.

No other source or heuristic is consulted at any step — this is the literal reading of "do not
guess."

**Rationale**: Per this session's explicit direction, a missing current_app_id must no longer
cause the Firestore operation to be withheld — it must still complete, using the best available
identifier, while making the degraded case loud (a warning) rather than silent. Centralizing the
three-step order in one method keeps every one of the ~4 existing `payload.app_id` call sites
(`handle`'s log line, `storeUserSessionPayload`, `storeSummaryPayload`'s written field, and its two
`whereEqualTo` query clauses) trivially consistent, and keeps the warning logged exactly once per
payload regardless of how many of those sites end up using the resolved value.

**Alternatives considered**:
- Resolve independently at each call site — rejected: would either duplicate the fallback/logging
  logic four times or risk one call site falling out of sync with the others (e.g. a query using
  current_app_id while the written record uses payload.app_id for the same event).
- Keep FR-007's original "withhold and log" behavior — superseded by explicit user direction this
  session; withholding is replaced by the fallback order above, still logged.
- Add a fourth, more specific fallback (e.g. derive from `cr_user_id` or the WebView's identity
  URL) — rejected: explicitly out of scope per "do not guess" — only the two named sources plus
  the literal default are permitted.

## 7. Logging added at each touched step

**Decision**: Reuse each component's existing log tag rather than introducing a new one:

| Step | Component | Tag | Level |
|---|---|---|---|
| Manifest sync reports `app_id` coverage for the refreshed catalog | `RetrofitInstance` | `AppConfig` (already used there) | debug |
| Sub-app launch places `app_id` on the launch intent | `WebAppsAdapter` | `WebAppsAdapter` (already used there) | debug |
| `current_app_id` is set for the launched sub-app | `WebApp` | `WebApp` (already used there) | debug |
| `app_id` resolves via current_app_id (primary) | `DefaultAppEventPayloadHandler` | `AppEventHandler` (already used there) | debug |
| `app_id` falls back to `payload.app_id` | `DefaultAppEventPayloadHandler` | `AppEventHandler` | **warning** |
| `app_id` falls back to `"unknown"` | `DefaultAppEventPayloadHandler` | `AppEventHandler` | **warning** |

**Rationale**: Every one of these components already has an established tag used for its other
log lines (verified in the existing source); reusing them keeps `app_id` diagnostics discoverable
alongside each component's existing logs instead of scattering a new tag through the codebase.

**Alternatives considered**: a single new shared tag (e.g. `"AppId"`) for every log line above —
rejected: splits `app_id` diagnostics away from each component's existing logs instead of
alongside them, and adds a new constant where an existing one already fits each site.

## Outcome

All prior `NEEDS CLARIFICATION` items are resolved. No new library, service, or architectural
layer is introduced; every decision reuses an existing class, table, or helper method.

# joined_study Firebase Event Plan

## Summary

Create a new Firebase custom event named `joined_study` when the user confirms study enrollment. Replace the existing `cr_user_id_confirmed` event on this joined-study confirmation path.

## Current State

- Study enrollment is confirmed in `MainActivity.showConfirmIdDialog(...)`.
- The incoming `study_user_id` is already sanitized with `replaceAll("[^0-9]", "")`.
- On confirmation, the app stores:
  - `pseudoId = newId`
  - `study_user_id = newId`
  - `studyConsent = studyConsent`
- The existing `cr_user_id_confirmed` event uses the generic `AnalyticsUtils.logEvent(...)` path and does not include all required `joined_study` parameters as event parameters.

## Implementation Plan

- Add `AnalyticsUtils.logJoinedStudyEvent(...)` for a dedicated event payload.
- Call it from the successful confirm button path after persistence succeeds, replacing the `cr_user_id_confirmed` call.
- Event name must be exactly `joined_study`.
- Include these event parameters:
  - `cr_language`
  - `app_info.version`
  - `cr_user_id`
  - `source`
  - `campaign_id`
  - `study_user_id`
  - `study_consent`
- Read `source` and `campaign_id` from `InstallReferrerPrefs`, matching the existing user-property source.
- Use the sanitized `newId` for both `cr_user_id` and `study_user_id`.
- Use the existing `studyConsent` string for `study_consent`.
- Use the existing app version value from `MainActivity` for `app_info.version`, if available at the call site.

## Tests

- Add unit tests in `AnalyticsUtilsCustomEventsTest`.
- Verify `joined_study` sends all required parameters after a successful enrollment-style call.
- Verify a study ID containing special characters is sanitized before the event is sent.
- Verify stored `source` and `campaign_id` are included as event parameters.
- Run:

```powershell
.\gradlew.bat :app:testDebugUnitTest --console=plain
```

## Open Note

Firebase custom event parameter names may reject dots. If `app_info.version` is not accepted by Firebase/GA4, confirm whether analytics wants `app_info_version` instead before release.

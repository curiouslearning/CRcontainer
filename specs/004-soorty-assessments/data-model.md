# Data Model: Soorty APK Assessments

**Date**: 2026-11-20 | **Plan**: [plan.md](./plan.md)

## AssessmentDataKey

| Field | Values | Notes |
|-------|--------|-------|
| language | `english`, `urdu`, `pashto` | Matches FTM `cr_lang` |
| type | `lettersounds`, `sightwords` | FTM `assessment_type` |
| key | `<language>-<type>` | File `data/<key>.json`, audio folder `audio/<key>/` |

Validation: the six keys above are the complete set (`PACKAGE_INFO.json.dataKeys`).

## Assessment data file (`data/<key>.json`, production format, unchanged)

- `quizName`, `appType: "assessment"`, `assessmentType` (`letter-sounds` | `sight-words`), `feedbackText`, `contentVersion`
- `buckets[]`: `bucketID`, `bucketName`, `items[]` (`itemName`, `itemText`)
- Rule: every `itemName` has `audio/<key>/<itemName>.(mp3|wav)`.

## Catalog entry (`app/src/soorty/assets/web_apps_manifest.json`, version `soorty-3`)

| Field | Example |
|-------|---------|
| `appId` | 9101–9106 (local Room keys) |
| `app_id` | `assessment` |
| `title` | `Assessment Letter Sounds Urdu` |
| `appIconUrl` | `file:///android_asset/images/assessment_letter_sounds.png` / `assessment_sight_words.png` |
| `appUrl` | `https://soorty_urdu_english_cr-ftm-standalone.androidplatform.net/assets/assessment/index.html?data=urdu-lettersounds` |
| `language`, `languageInEnglishName` | `اردو` / `Urdu`; `پښتو` / `Pashto`; `English - US` / `English` |

Ordering: two assessment tiles immediately after the language's FTM tile.

| appId | key |
|-------|-----|
| 9101 | urdu-lettersounds |
| 9102 | urdu-sightwords |
| 9103 | pashto-lettersounds |
| 9104 | pashto-sightwords |
| 9105 | english-lettersounds |
| 9106 | english-sightwords |

## Seeded feature flags (`localStorage["CRFeatureFlags"]`)

| Key | Value | Purpose |
|-----|-------|---------|
| `gate:mr-75` | `{ "__value": true }` | Android bridge on: results reach the container offline |
| `gate:drag-drop-assessment-ui` | `{ "__value": true }` | New drag-and-drop assessment UI offline |

Written by both packaged pages only when the key is absent; no expiry.

## Standalone completion signal (bridge → container)

`user_sessions_data` with `event_type: "activity_completed"` from app key `assessment` (after `summary_data`) —
see `StandaloneAssessmentCompletion.isCompletionPayload`.

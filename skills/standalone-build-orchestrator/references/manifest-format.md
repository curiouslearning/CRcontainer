# CRWebPlayer Standalone Manifest

The app reads `app/src/main/assets/web_apps_manifest.json`.

The CRWebPlayer runtime must also exist under:

```text
app/src/main/assets/CRWebPlayerJs/index.html
app/src/main/assets/CRWebPlayerJs/manifest.json
app/src/main/assets/CRWebPlayerJs/dist/
```

These files come from the root of `curiouslearning/CRWebPlayer` on the selected branch:

```text
index.html
manifest.json
dist/
```

Preferred shape:

```json
{
  "version": "1.0",
  "web_apps": [
    {
      "appId": 11,
      "appIconUrl": "chakus_cycle.png",
      "title": "Curious Reader Chakus Cycle Zulu",
      "appUrl": "https://maharishi_cr-ftm-standalone.androidplatform.net/assets/CRWebPlayerJs/index.html?book=ChakusCycleIsiZulu",
      "language": "isiZulu",
      "languageInEnglishName": "Zulu"
    }
  ]
}
```

Important rules:

- `appUrl` must use `/assets/CRWebPlayerJs/index.html?book=<BookContentFolder>`.
- `CRWebPlayerJs/index.html` and `CRWebPlayerJs/dist/app.js` must exist locally or the WebView cannot run the book player.
- `<BookContentFolder>` must exist at `app/src/main/assets/CRWebPlayerJs/BookContent/<BookContentFolder>`.
- Each book should have `content/content.json`, `content/audios/`, and `content/images/`.
- The URL host must match the host used by `WebViewAssetLoader`. Current standalone `WebApp.java` derives the host from each `appUrl`.
- `appIconUrl` is resolved from `app/src/main/assets/` or `app/src/main/assets/images/`.
- `appId` must be unique.
- `title` follows `Curious Reader <Book Title> <English Language Name>`, with `Lv4` rendered as `Level 4`.
- `language` is the local display name, e.g. `isiZulu`.
- `languageInEnglishName` is the English display name, e.g. `Zulu`.

Icon selection:

- Do not require users to provide icon filenames.
- Match `appIconUrl` from files in `app/src/main/assets/images/`.
- Normalize BookContent folder names and image filenames by ignoring case, punctuation, underscores, dashes, language words, and deployment words such as `ftm`, `prod`, and `dev`.
- Prefer filenames containing `prod` over `dev` or `copy` when multiple image names match the same book.
- Fall back to known Curious Reader icon mappings, then to `assessment_icon_prod.png`.

The legacy `?data=<book>` query may exist in older manifests, but this package currently uses `?book=<BookContentFolder>` for CRWebPlayerJs.

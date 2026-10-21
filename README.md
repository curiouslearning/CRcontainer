# CRcontainer

Curious Reader container app

Overview

What: The Curious Reader library app is essentially a web browser within an Android app that allows a user to launch and engage with a variety of web-based literacy content developed by Curious Learning (and partners). The app displays web-based content using a manifest and a selected language to show app icons, much like a phone homescreen.

Why: The Curious Reader library app was developed after noting that users of the Feed The Monster (Unity) app were not able to continue with their journey to literacy across other apps because of Google’s restrictions and regulations on advertising to children in-app. This would require us to re-acquire a user for every app produced.

## Build flavors

| Flavor | Purpose |
|---|---|
| `online` (default) | The Play Store app. Catalog from the remote manifest, sub-apps from their deployed URLs. |
| `mwfCongo`, `mwfAngola` | Private, fully offline standalone APKs for the MWF PDE fellowship (French+English, Brazilian Portuguese+English) with Feed The Monster packaged in the APK. See [docs/MWF_OFFLINE_STANDALONE.md](docs/MWF_OFFLINE_STANDALONE.md). |

Common tasks: `./gradlew assembleOnlineDebug`, `./gradlew testOnlineDebugUnitTest`,
`./gradlew assembleMwfCongoRelease assembleMwfAngolaRelease`.

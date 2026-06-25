---
name: github-content-folder
description: Explore, list, and download selected folders from public GitHub repositories without cloning the full repository. Use when Codex needs only a content subfolder or asset directory from GitHub, especially from large repos, GitHub tree URLs, CRWebPlayer BookContent folders, or similar static content collections.
---

# GitHub Content Folder

## Workflow

Use `scripts/github-folder.mjs` for deterministic GitHub API access. It can parse GitHub tree URLs directly, list folder contents, and recursively download only the selected folder.

Default project target:

- repo: `curiouslearning/CRWebPlayer`
- branch: `develop`
- content root: `BookContent`

Prefer this skill when the user says they do not want to clone a large repo, only needs one folder, wants to browse available content folders, or provides a URL like:

```text
https://github.com/curiouslearning/CRWebPlayer/tree/develop/BookContent/ChakusCycleNepali
```

## Commands

List a folder:

```powershell
node skills/github-content-folder/scripts/github-folder.mjs list --url "https://github.com/OWNER/REPO/tree/BRANCH/path/to/folder"
```

Download a folder into the current workspace, preserving the repository path:

```powershell
node skills/github-content-folder/scripts/github-folder.mjs download --url "https://github.com/OWNER/REPO/tree/BRANCH/path/to/folder" --out .
```

Download a folder into a specific local directory:

```powershell
node skills/github-content-folder/scripts/github-folder.mjs download --repo OWNER/REPO --branch BRANCH --path "path/to/folder" --out "local/output"
```

Explore child folders under a known parent:

```powershell
node skills/github-content-folder/scripts/github-folder.mjs list --path BookContent
```

For shorthand requests like "list book content", use:

```powershell
node skills/github-content-folder/scripts/github-folder.mjs list --book-content
```

## Operating Notes

- Ask for the GitHub URL or `owner/repo`, branch, and folder path if the target is ambiguous.
- Treat unqualified requests for "book content" or "CRWebPlayer content" as the default project target above.
- Do not clone the repository for this task unless the API cannot serve the needed files.
- Keep downloads scoped to the requested folder.
- Use `--flatten-root` only if the user wants the selected folder contents placed directly into `--out`; otherwise preserve the repository-relative folder path.
- For private repositories, GitHub API authentication is required; this script is intended for public repositories unless an authenticated environment is already available.
- If GitHub rate limits unauthenticated API calls, tell the user and ask whether to use a token or retry later.

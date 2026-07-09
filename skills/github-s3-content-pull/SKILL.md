---
name: github-s3-content-pull
description: Explore and download selected folders from public GitHub repositories without cloning the full repository, preferring a mirrored CDN/S3 host for file bytes when one is configured so GitHub's API rate limit is only spent on directory listing. Use when Codex needs only a content subfolder or asset directory from GitHub, especially from large repos, GitHub tree URLs, CRWebPlayer BookContent folders, or similar static content collections — and especially when a prior run hit GitHub API rate limits partway through downloading many files.
---

# GitHub + S3 Content Pull

## Workflow

Use `scripts/github-s3-content-pull.mjs` for deterministic GitHub API access. It can parse GitHub tree URLs directly, list folder contents, and recursively download only the selected folder.

Default project target:

- repo: `curiouslearning/CRWebPlayer`
- branch: `develop`
- content root: `BookContent`

Prefer this skill when the user says they do not want to clone a large repo, only needs one folder, wants to browse available content folders, or provides a URL like:

```text
https://github.com/curiouslearning/CRWebPlayer/tree/develop/BookContent/ChakusCycleNepali
```

## GitHub rate limits vs. the CDN fallback

GitHub's Contents API is rate-limited (60/hour unauthenticated), and the cost is dominated by
**directory listing**, not file bytes — each subdirectory the recursive walk enters is one API
call, and a single book's `content/audios/` + `content/images/` folders alone can be 50-100+
files across a handful of directory calls. Downloading many books in one run can exhaust the
budget partway through, leaving some books only partially downloaded.

If the content is also mirrored on a plain static host (verified true for CRWebPlayer's dev
deployment at `https://curiousreaderdev.curiouscontent.org`, which mirrors the repo's path layout
1:1 relative to its own root — confirmed via `curl` against both `BookContent/<Book>/content/...`
paths and root files like `index.html`/`manifest.json`/`dist/app.js`), pass `--cdn-base-url` to
this script's `download` command. GitHub's API is still used to list/walk the folder structure
(unavoidable — the CDN has directory listing disabled, confirmed via `403` on a folder URL), but
each file's bytes are fetched from `<cdn-base-url>/<repo-relative-path>` first, falling back to
GitHub's `download_url` only if that request fails. This does not reduce the number of GitHub API
calls for listing, but it avoids adding to GitHub's load/rate budget for the (much larger) file
count, and the CDN request has shown no rate-limit headers or throttling in testing.

For CRWebPlayer specifically, `standalone-build-orchestrator`'s `prepare-crwebplayer-content.mjs`
goes a step further and can skip GitHub's directory walk entirely per book by reading the book's
own `content.json` (also mirrored on the CDN) as the asset manifest — see that skill's
`references/manifest-format.md` for details. This skill's `--cdn-base-url` flag is the fallback
path when that faster route isn't available for a given book.

## Commands

List a folder:

```powershell
node skills/github-s3-content-pull/scripts/github-s3-content-pull.mjs list --url "https://github.com/OWNER/REPO/tree/BRANCH/path/to/folder"
```

Download a folder into the current workspace, preserving the repository path:

```powershell
node skills/github-s3-content-pull/scripts/github-s3-content-pull.mjs download --url "https://github.com/OWNER/REPO/tree/BRANCH/path/to/folder" --out .
```

Download a folder into a specific local directory:

```powershell
node skills/github-s3-content-pull/scripts/github-s3-content-pull.mjs download --repo OWNER/REPO --branch BRANCH --path "path/to/folder" --out "local/output"
```

Download preferring a mirrored CDN for file bytes (GitHub still used for listing):

```powershell
node skills/github-s3-content-pull/scripts/github-s3-content-pull.mjs download --repo curiouslearning/CRWebPlayer --branch develop --path "BookContent/ChakusCycleIsiZulu" --out . --cdn-base-url https://curiousreaderdev.curiouscontent.org
```

Explore child folders under a known parent:

```powershell
node skills/github-s3-content-pull/scripts/github-s3-content-pull.mjs list --path BookContent
```

For shorthand requests like "list book content", use:

```powershell
node skills/github-s3-content-pull/scripts/github-s3-content-pull.mjs list --book-content
```

## Operating Notes

- Ask for the GitHub URL or `owner/repo`, branch, and folder path if the target is ambiguous.
- Treat unqualified requests for "book content" or "CRWebPlayer content" as the default project target above.
- Do not clone the repository for this task unless the API cannot serve the needed files.
- Keep downloads scoped to the requested folder.
- Use `--flatten-root` only if the user wants the selected folder contents placed directly into `--out`; otherwise preserve the repository-relative folder path.
- For private repositories, GitHub API authentication is required; this script is intended for public repositories unless an authenticated environment is already available.
- If GitHub rate limits unauthenticated API calls, tell the user and ask whether to use a token, retry later, or supply `--cdn-base-url` if a mirrored host is available.
- A CDN host with directory listing disabled will `403` on folder URLs — that's expected, not a sign the content is missing; only per-file `404`/`403` on a specific known path means it's genuinely absent from the CDN.

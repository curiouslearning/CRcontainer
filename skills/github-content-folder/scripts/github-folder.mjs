#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const usage = `Usage:
  node github-folder.mjs list --url "https://github.com/OWNER/REPO/tree/BRANCH/path"
  node github-folder.mjs download --url "https://github.com/OWNER/REPO/tree/BRANCH/path" --out .
  node github-folder.mjs list --repo OWNER/REPO --branch BRANCH --path path/to/folder
  node github-folder.mjs download --repo OWNER/REPO --branch BRANCH --path path/to/folder --out . [--flatten-root]
  node github-folder.mjs list --book-content

Environment:
  GITHUB_TOKEN may be set to raise API rate limits or access authorized repositories.
`;

const defaults = {
  repo: "curiouslearning/CRWebPlayer",
  branch: "develop",
  bookContentPath: "BookContent",
};

const args = process.argv.slice(2);
const command = args.shift();
const options = parseArgs(args);

if (!["list", "download"].includes(command)) fail(usage);

const target = options.url ? parseGithubTreeUrl(options.url) : {
  owner: null,
  repo: null,
  branch: options.branch,
  folder: options.path,
};

if (options.bookContent) {
  options.repo ??= defaults.repo;
  target.branch ??= defaults.branch;
  target.folder ??= defaults.bookContentPath;
}

if (!options.repo && !options.url && (target.branch || target.folder)) {
  options.repo = defaults.repo;
}
target.branch ??= defaults.branch;
target.folder ??= defaults.bookContentPath;

if (options.repo) {
  const [owner, repo] = options.repo.split("/");
  target.owner = owner;
  target.repo = repo;
}

if (!target.owner || !target.repo || !target.branch || target.folder == null) {
  fail("Missing target. Provide --url or --repo OWNER/REPO --branch BRANCH --path folder.\n\n" + usage);
}

target.folder = normalizeRepoPath(target.folder);

const outDir = path.resolve(options.out ?? process.cwd());
let fileCount = 0;
let dirCount = 0;
let byteCount = 0;

if (command === "list") {
  await listFolder(target);
} else {
  await downloadFolder(target);
  console.log(`Downloaded ${fileCount} files, ${byteCount} bytes total to ${outDir}`);
}

function parseArgs(values) {
  const parsed = {};
  for (let i = 0; i < values.length; i += 1) {
    const key = values[i];
    if (!key.startsWith("--")) fail(`Unexpected argument: ${key}\n\n${usage}`);
    const name = key.slice(2);
    const normalizedName = name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    if (["flattenRoot", "bookContent"].includes(normalizedName)) {
      parsed[normalizedName] = true;
      continue;
    }
    const value = values[i + 1];
    if (!value || value.startsWith("--")) fail(`Missing value for ${key}`);
    parsed[normalizedName] = value;
    i += 1;
  }
  return parsed;
}

function parseGithubTreeUrl(raw) {
  let url;
  try {
    url = new URL(raw);
  } catch {
    fail(`Invalid GitHub URL: ${raw}`);
  }

  if (url.hostname !== "github.com") fail(`Expected github.com URL: ${raw}`);

  const parts = url.pathname.split("/").filter(Boolean);
  const treeIndex = parts.indexOf("tree");
  if (parts.length < 5 || treeIndex !== 2) {
    fail(`Expected a GitHub tree URL like https://github.com/OWNER/REPO/tree/BRANCH/path: ${raw}`);
  }

  return {
    owner: parts[0],
    repo: parts[1],
    branch: parts[3],
    folder: parts.slice(4).join("/"),
  };
}

function normalizeRepoPath(value) {
  return String(value ?? "")
    .replaceAll("\\", "/")
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");
}

function apiUrl(target) {
  const encodedPath = target.folder
    .split("/")
    .filter(Boolean)
    .map(encodeURIComponent)
    .join("/");
  return `https://api.github.com/repos/${target.owner}/${target.repo}/contents/${encodedPath}?ref=${encodeURIComponent(target.branch)}`;
}

async function githubJson(url) {
  const headers = {
    accept: "application/vnd.github+json",
    "user-agent": "codex-github-content-folder",
    "x-github-api-version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const response = await fetch(url, { headers });
  if (!response.ok) {
    const remaining = response.headers.get("x-ratelimit-remaining");
    const reset = response.headers.get("x-ratelimit-reset");
    let extra = "";
    if (remaining === "0" && reset) {
      extra = ` Rate limit resets at ${new Date(Number(reset) * 1000).toISOString()}.`;
    }
    throw new Error(`GitHub API ${response.status} ${response.statusText}: ${url}.${extra}`);
  }
  return response.json();
}

async function listFolder(target) {
  const entries = await githubJson(apiUrl(target));
  if (!Array.isArray(entries)) {
    console.log(`${entries.type}\t${entries.path}\t${entries.size ?? ""}`);
    return;
  }
  for (const item of entries.sort(compareEntries)) {
    console.log(`${item.type}\t${item.path}\t${item.size ?? ""}`);
  }
}

async function downloadFolder(target) {
  await walk(apiUrl(target), target.folder);
}

async function walk(url, rootFolder) {
  const entries = await githubJson(url);
  if (!Array.isArray(entries)) {
    if (entries.type === "file") await downloadFile(entries, rootFolder);
    return;
  }

  for (const item of entries.sort(compareEntries)) {
    if (item.type === "dir") {
      dirCount += 1;
      console.log(`dir  ${item.path}`);
      await walk(item.url, rootFolder);
    } else if (item.type === "file") {
      await downloadFile(item, rootFolder);
    } else {
      console.log(`skip ${item.type} ${item.path}`);
    }
  }
}

async function downloadFile(item, rootFolder) {
  if (!item.download_url) {
    console.log(`skip file without download_url ${item.path}`);
    return;
  }

  const headers = { "user-agent": "codex-github-content-folder" };
  if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const response = await fetch(item.download_url, { headers });
  if (!response.ok) throw new Error(`Download ${response.status} ${response.statusText}: ${item.download_url}`);

  const relativeRepoPath = normalizeRepoPath(item.path);
  let relativeOutPath = options.flattenRoot
    ? path.relative(rootFolder.replaceAll("/", path.sep), relativeRepoPath.replaceAll("/", path.sep))
    : relativeRepoPath.replaceAll("/", path.sep);
  if (!relativeOutPath) relativeOutPath = path.basename(relativeRepoPath);
  const targetFile = path.join(outDir, relativeOutPath);
  const buffer = Buffer.from(await response.arrayBuffer());

  await mkdir(path.dirname(targetFile), { recursive: true });
  await writeFile(targetFile, buffer);

  fileCount += 1;
  byteCount += buffer.length;
  console.log(`file ${item.path} (${buffer.length} bytes)`);
}

function compareEntries(a, b) {
  if (a.type !== b.type) return a.type === "dir" ? -1 : 1;
  return a.path.localeCompare(b.path);
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

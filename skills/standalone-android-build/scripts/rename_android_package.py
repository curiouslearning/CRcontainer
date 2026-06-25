#!/usr/bin/env python3
import argparse
import os
import re
import shutil
from pathlib import Path


TEXT_SUFFIXES = {
    ".gradle",
    ".java",
    ".kt",
    ".kts",
    ".xml",
    ".json",
    ".pro",
    ".properties",
    ".md",
    ".txt",
    ".yaml",
    ".yml",
}

SKIP_DIRS = {
    ".git",
    ".gradle",
    ".idea",
    "build",
    "skills",
    ".cxx",
    ".externalNativeBuild",
}


def validate_package(package_name):
    pattern = re.compile(r"^[a-zA-Z_][a-zA-Z0-9_]*(\.[a-zA-Z_][a-zA-Z0-9_]*)+$")
    if not pattern.match(package_name):
        raise SystemExit(f"Invalid package name: {package_name}")


def is_text_candidate(path):
    return path.suffix in TEXT_SUFFIXES or path.name in {"AndroidManifest.xml"}


def iter_files(root):
    for current_root, dirs, files in os.walk(root):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for name in files:
            path = Path(current_root) / name
            if is_text_candidate(path):
                yield path


def replace_in_file(path, old, new, apply):
    try:
        text = path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        return False

    updated = text.replace(old, new)
    if updated == text:
        return False

    print(f"update text: {path}")
    if apply:
        path.write_text(updated, encoding="utf-8")
    return True


def move_java_package_dir(repo_root, old, new, apply):
    old_rel = Path(*old.split("."))
    new_rel = Path(*new.split("."))
    moved = []

    for source_root in [
        repo_root / "app" / "src" / "main" / "java",
        repo_root / "app" / "src" / "test" / "java",
        repo_root / "app" / "src" / "androidTest" / "java",
    ]:
        old_dir = source_root / old_rel
        new_dir = source_root / new_rel
        if not old_dir.exists():
            continue

        print(f"move package dir: {old_dir} -> {new_dir}")
        moved.append((old_dir, new_dir))
        if not apply:
            continue

        new_dir.parent.mkdir(parents=True, exist_ok=True)
        if new_dir.resolve().is_relative_to(old_dir.resolve()):
            temp_dir = source_root / "__package_rename_tmp__"
            if temp_dir.exists():
                raise SystemExit(f"Temporary path already exists: {temp_dir}")
            shutil.move(str(old_dir), str(temp_dir))
            new_dir.mkdir(parents=True, exist_ok=False)
            for item in temp_dir.iterdir():
                shutil.move(str(item), str(new_dir / item.name))
            temp_dir.rmdir()
            cleanup_empty_parents(new_dir.parent.parent, source_root)
            continue

        if new_dir.exists():
            for item in old_dir.iterdir():
                target = new_dir / item.name
                if target.exists():
                    raise SystemExit(f"Refusing to overwrite existing path: {target}")
                shutil.move(str(item), str(target))
            cleanup_empty_parents(old_dir, source_root)
        else:
            shutil.move(str(old_dir), str(new_dir))
            cleanup_empty_parents(old_dir.parent, source_root)

    return moved


def cleanup_empty_parents(path, stop_at):
    path = path.resolve()
    stop_at = stop_at.resolve()
    while path != stop_at and stop_at in path.parents:
        try:
            path.rmdir()
        except OSError:
            break
        path = path.parent


def main():
    parser = argparse.ArgumentParser(description="Rename Android package references in this repo.")
    parser.add_argument("--repo-root", default=".", help="Repository root")
    parser.add_argument("--old-package", required=True, help="Current package name")
    parser.add_argument("--new-package", required=True, help="New package name")
    parser.add_argument("--apply", action="store_true", help="Write changes. Without this, dry-runs only.")
    args = parser.parse_args()

    validate_package(args.old_package)
    validate_package(args.new_package)

    repo_root = Path(args.repo_root).resolve()
    if not (repo_root / "app" / "build.gradle").exists():
        raise SystemExit(f"Not an Android app repo root: {repo_root}")

    mode = "APPLY" if args.apply else "DRY RUN"
    print(f"{mode}: {args.old_package} -> {args.new_package}")

    changed_files = []
    for path in iter_files(repo_root):
        if replace_in_file(path, args.old_package, args.new_package, args.apply):
            changed_files.append(path)

    moved_dirs = move_java_package_dir(repo_root, args.old_package, args.new_package, args.apply)

    print("")
    print(f"text files changed: {len(changed_files)}")
    print(f"package dirs moved: {len(moved_dirs)}")
    if not args.apply:
        print("dry run only; rerun with --apply to write changes")


if __name__ == "__main__":
    main()

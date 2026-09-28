---
description: Generate release notes from conventional commits since the last tag, in Keep a Changelog format
argument-hint: [from-ref] [to-ref]
---

## Goal

Produce publication-ready release notes for this repository, formatted according to
[Keep a Changelog](https://keepachangelog.com/), derived strictly from the commit
history — not from guessing or from reading source code.

## Inputs

- `$1` (optional): the starting ref (tag, branch or commit) to diff from. Default: the
  most recent annotated or lightweight tag reachable from HEAD (`git describe --tags --abbrev=0`).
  If the repository has no tags at all, use the first commit of the current branch.
- `$2` (optional): the ending ref. Default: `HEAD`.

## Steps

1. Resolve the starting ref as described above. If `$1` was given, use it verbatim instead.
2. Run `git log <from>..<to> --oneline --no-merges` to collect the commit list. Do not
   read diffs or source files — the changelog is built from commit subjects alone.
3. Parse each commit subject against the Conventional Commits grammar:
   `<type>(<optional scope>)!: <description>`.
4. Map each `<type>` to a Keep a Changelog section:
   - `feat` → **Added**
   - `fix` → **Fixed**
   - `refactor`, `perf`, `style`, `chore`, `docs`, `build`, `ci`, `test` → **Changed**
   - `revert`, or a description starting with "remove"/"drop" → **Removed**
   - a `!` after the type/scope (breaking change) → still goes to its normal section,
     but prefix the bullet with **BREAKING:**
   - anything that does not match the grammar at all → put it in **Changed** verbatim,
     without inventing a type for it
5. Within each section, drop the type/scope prefix and capitalize the first letter of
   the remaining description. Keep the scope in parentheses at the end of the bullet
   when present, e.g. `- Add email validation on the registration form (auth)`.
6. Deduplicate: if a revert commit cancels out an earlier commit in the same range,
   drop both instead of listing them separately.
7. Omit any section that ends up empty — do not print empty `### Added` headers.
8. Use today's date and infer a version bump from the highest-impact change present
   (breaking change → major, `feat` → minor, only `fix`/`chore` → patch), applied to
   the last released version found in `package.json` or the last tag name.

## Output format

Return **only** the changelog markdown for this one release — no preamble, no
explanation, no surrounding commentary, no code fence. Example shape:

```
## [1.4.0] - 2026-09-28
### Added
- Email validation on the registration form (auth)

### Fixed
- Discount no longer ignored when calculating the cart total (pricing)

### Changed
- Extracted cart subtotal calculation into a reusable helper (pricing)
```

If the resolved commit range is empty, return exactly: `No changes since <from>.`

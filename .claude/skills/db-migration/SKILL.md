---
name: db-migration
description: Generates a runnable Node.js MongoDB/Mongoose migration file (up/down) from a plain-text ER description of a collection — new fields, renamed fields, removed fields. Trigger when the user wants to add, rename, or remove a field on a MongoDB collection, wants a reversible migration script instead of a manual edit against production data, or wants to reconcile a Mongoose schema field name across the codebase (a schema was renamed but old documents/consumers still use the old name).
---

# DB Migration

This skill carries real, executable domain logic — a Python code generator under
`scripts/`, not just a prompt template. Its job is to turn a short, human-written
description of a *target* collection shape into a safe, reversible migration script,
so nobody hand-writes `updateMany`/`$rename` calls against a live database from
scratch, and so every schema change ships with a tested-shape rollback path for free.

## When this applies

- "Add an `isFeatured` boolean to `CustomModel`, default `false`."
- "The `Order` schema uses `wheelColor` now but old documents still have `rimColor`,
  write a migration to fix that."
- "I need to drop the deprecated `legacyId` field from `User`."
- Any request that is fundamentally *"change the shape of a Mongo collection for
  existing documents"* — as opposed to just editing the Mongoose schema file (schema
  edits alone do not touch already-stored documents).

Do **not** use it for one-off exploratory queries, for changes that only touch the
Mongoose schema definition with no need to backfill/rename/drop data in existing
documents, or for relational (SQL) migrations — this generator is MongoDB-specific.

## Step-by-step usage

1. **Write the target shape.** Create a small `*.er` file describing the collection's
   fields *as they should look after the migration*, using the format defined in
   [reference/er_format.md](reference/er_format.md). Only fields that actually change
   need an option annotation (`new`, `renamed_from=...`, `removed`); unchanged fields
   can be listed plainly for documentation, or omitted entirely.
2. **Generate the migration:**
   ```bash
   python scripts/gen_migration.py <path-to-file.er> [--collection <name>] [--out <dir-or-file>]
   ```
   - Without `--out`, the generated JS is printed to stdout for review.
   - With `--out <directory>`, it is written as `<timestamp>_<entity>.js` inside that
     directory.
   - `--collection` overrides the inferred MongoDB collection name (default: the
     entity name, lowercased-first-letter, with a trailing `s`, e.g. `CustomModel` →
     `customModels`).
3. **Place the output correctly.** Write generated migrations under a CommonJS-scoped
   directory (e.g. this project's `server/migrations/`, which has its own
   `package.json` with `"type": "commonjs"`) — not under a directory that resolves to
   ES modules, or `module.exports` will silently produce an empty export object
   instead of throwing.
4. **Review before running.** The generated file only contains `up(db)`/`down(db)`; it
   never opens a database connection itself. Show the generated code to the user and
   get explicit confirmation before wiring it into a migration runner (e.g.
   `migrate-mongo`) or executing it against any real database — this skill's job ends
   at generating a reviewable file, not at touching live data.
5. **Test the rollback path**, not just the forward path — run `down()` after `up()`
   against a disposable/staging database (or at minimum re-read the generated
   `down()` body) to confirm it actually reverses every change `up()` makes.

## What the generator produces

For each field annotated in the `.er` file:

| Annotation | `up()` operation | `down()` operation |
|---|---|---|
| `renamed_from=<old>` | `$rename` old → new, only where old exists | `$rename` new → old |
| `new, default=<value>` | `$set` the field to `<value>` only where it's missing | `$unset` the field |
| `removed` | `$unset` the field | no-op with a comment (original data is gone; document the removal in the report instead of pretending it's reversible) |

All operations are scoped with an `$exists` filter where meaningful, so re-running
`up()` on an already-migrated collection is a no-op rather than a destructive re-write.

## Guidelines

- One `.er` file = one collection = one migration. Do not try to describe multiple
  collections in one file.
- Prefer the smallest migration that achieves the requested shape change — do not
  bundle unrelated field changes into one migration just because they touch the same
  collection.
- If the `.er` file has no annotated fields at all, the generator still produces a
  valid (no-op) migration file rather than failing — treat that as a signal to double
  check the input, not as an error.

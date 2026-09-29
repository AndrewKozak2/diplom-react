# `.er` file format

An `.er` file describes the **target** shape of one MongoDB/Mongoose collection in a
small, line-oriented text format that `scripts/gen_migration.py` parses. It is not a
full ER-diagram notation (no relationships, no cardinality) — it deliberately covers
only what a field-level migration generator needs: a field's name, its type, and
whether it is new, renamed, or removed relative to the collection's current shape.

## Grammar

```
entity: <EntityName>
fields:
  - <fieldName>: <Type> [(<option>[, <option> ...])]
```

- `entity:` — required, exactly once per file. `<EntityName>` should match the
  Mongoose model name (e.g. `CustomModel`, `Order`, `User`); the generator derives the
  default MongoDB collection name from it (see below).
- `fields:` — required, exactly once, followed by one `- name: Type` line per field.
- Blank lines and lines that don't match a field are ignored, so free-text notes can
  be interspersed if useful.

### Types

`Type` is informational only (Mongoose/MongoDB schema types such as `String`,
`Number`, `Boolean`, `Date`, `ObjectId`, `Array`) — the generator does not validate or
cast values against it. It exists so the `.er` file doubles as human-readable
documentation of the resulting shape, not just a migration recipe.

### Options

Zero or more, comma-separated, inside parentheses right after the type:

| Option | Meaning | Required companion |
|---|---|---|
| `new` | The field does not exist on current documents; it will be added. | `default=<value>` (recommended — without it, new documents get `null`) |
| `default=<value>` | The value to backfill onto existing documents that are missing the field. `true`/`false` are treated as booleans, a bare number as a number, anything else as a string. | — |
| `renamed_from=<oldName>` | The field used to be called `<oldName>`; existing documents will have their key renamed. | — |
| `removed` | The field is being dropped entirely. | — |

A field with none of these options is treated as unchanged — useful for documenting
the full target shape in one place even when only one or two fields actually move.

Combining `renamed_from` and `removed`/`new` on the same field is not meaningful and
is not supported — pick one.

## Collection name inference

Unless `--collection` is passed to the generator, the MongoDB collection name is
derived from `<EntityName>` as `lowerFirst(EntityName) + "s"` — matching Mongoose's own
default pluralization for simple names (e.g. `CustomModel` → `customModels`, `Order`
→ `orders`). For an entity whose real collection name doesn't follow that pattern
(irregular plural, or a Mongoose model created with an explicit collection name),
always pass `--collection <exact-name>` explicitly.

## Worked example

Reconciling the inconsistent `wheelColor`/`rimColor` field from Lab 1
(`src/utils/customOrder.js`, defect №3) at the database level, while also adding a new
`isFeatured` flag:

```
entity: CustomModel
fields:
  - bodyColor: String
  - wheelColor: String (renamed_from=rimColor)
  - price: Number
  - isFeatured: Boolean (new, default=false)
```

Running:

```bash
python scripts/gen_migration.py reference/example_custommodel.er --out server/migrations/
```

produces a `server/migrations/<timestamp>_custommodel.js` file whose `up()` renames
`rimColor` → `wheelColor` on every document that still has the old key, and sets
`isFeatured: false` on every document that doesn't have it yet; `down()` reverses
both operations.

## Common mistakes

- Forgetting `default=` on a `new` field — the field still gets generated, but every
  existing document will be backfilled with `null`, which is rarely what's intended.
- Writing the type name in lowercase (`string` instead of `String`) — harmless
  (the generator ignores casing) but inconsistent with the Mongoose schema it should
  document.
- Generating into a directory that inherits `"type": "module"` from a parent
  `package.json` — the generated `module.exports = {...}` file will load as an empty
  ES module namespace instead of throwing a clear error. Always generate into a
  CommonJS-scoped directory (see SKILL.md, step 3).

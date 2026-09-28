#!/usr/bin/env python3
"""Генерує Node.js-файл міграції MongoDB/Mongoose з .er опису колекції.

Формат вхідного файлу описано в ../reference/er_format.md.
"""
import argparse
import datetime
import re
import sys


def parse_er(text):
    entity_match = re.search(r"entity:\s*(\S+)", text)
    if not entity_match:
        raise ValueError("Не знайдено рядок 'entity: <Назва>'")
    entity = entity_match.group(1)

    fields = []
    for line in text.splitlines():
        m = re.match(r"\s*-\s*([A-Za-z0-9_]+)\s*:\s*([A-Za-z]+)\s*(\((.*)\))?\s*$", line)
        if not m:
            continue
        name, ftype, _, opts_raw = m.groups()
        opts = {}
        if opts_raw:
            for opt in opts_raw.split(","):
                opt = opt.strip()
                if not opt:
                    continue
                if "=" in opt:
                    k, v = opt.split("=", 1)
                    opts[k.strip()] = v.strip()
                else:
                    opts[opt] = True
        fields.append({"name": name, "type": ftype, "opts": opts})

    if not fields:
        raise ValueError("Не знайдено жодного поля у секції 'fields:'")
    return entity, fields


def js_literal(value, ftype):
    if isinstance(value, str):
        if value.lower() in ("true", "false"):
            return value.lower()
        if re.fullmatch(r"-?\d+(\.\d+)?", value):
            return value
        return f'"{value}"'
    return str(value)


def build_migration(entity, fields, collection):
    renames = [f for f in fields if "renamed_from" in f["opts"]]
    new_fields = [f for f in fields if "new" in f["opts"]]
    removed_fields = [f for f in fields if "removed" in f["opts"]]

    up_lines = []
    down_lines = []

    for f in renames:
        old = f["opts"]["renamed_from"]
        new = f["name"]
        up_lines.append(
            f'  await db.collection("{collection}").updateMany('
            f'{{ {old}: {{ $exists: true }} }}, {{ $rename: {{ "{old}": "{new}" }} }});'
        )
        down_lines.append(
            f'  await db.collection("{collection}").updateMany('
            f'{{ {new}: {{ $exists: true }} }}, {{ $rename: {{ "{new}": "{old}" }} }});'
        )

    for f in new_fields:
        default = f["opts"].get("default", "null")
        lit = js_literal(default, f["type"])
        up_lines.append(
            f'  await db.collection("{collection}").updateMany('
            f'{{ {f["name"]}: {{ $exists: false }} }}, {{ $set: {{ "{f["name"]}": {lit} }} }});'
        )
        down_lines.append(
            f'  await db.collection("{collection}").updateMany('
            f'{{}}, {{ $unset: {{ "{f["name"]}": "" }} }});'
        )

    for f in removed_fields:
        up_lines.append(
            f'  await db.collection("{collection}").updateMany('
            f'{{}}, {{ $unset: {{ "{f["name"]}": "" }} }});'
        )
        down_lines.append(
            f"  // Увага: відновлення видаленого поля '{f['name']}' вручну не відновлюється (дані втрачено)."
        )

    if not up_lines:
        up_lines.append("  // Немає змін, що потребують міграції, виходячи з описаних полів.")
    if not down_lines:
        down_lines.append("  // Нічого відкочувати.")

    timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    header = (
        f"// Автозгенеровано skill db-migration з ER-опису колекції {entity}.\n"
        f"// Міграція {timestamp}_{entity.lower()}\n"
    )

    body = (
        header
        + "module.exports = {\n"
        + "  async up(db) {\n"
        + "\n".join(up_lines)
        + "\n  },\n\n"
        + "  async down(db) {\n"
        + "\n".join(down_lines)
        + "\n  },\n"
        + "};\n"
    )
    return f"{timestamp}_{entity.lower()}.js", body


def main():
    parser = argparse.ArgumentParser(description="Генерує Node.js-міграцію Mongoose з .er опису.")
    parser.add_argument("er_file", help="Шлях до .er файлу з описом колекції")
    parser.add_argument("--collection", help="Назва колекції MongoDB (за замовчуванням — entity у нижньому регістрі + 's')")
    parser.add_argument("--out", help="Куди зберегти згенерований файл (за замовчуванням — вивід у stdout)")
    args = parser.parse_args()

    with open(args.er_file, encoding="utf-8") as f:
        text = f.read()

    entity, fields = parse_er(text)
    collection = args.collection or (entity[0].lower() + entity[1:] + "s")
    filename, body = build_migration(entity, fields, collection)

    if args.out:
        import os
        out_path = args.out if args.out.endswith(".js") else os.path.join(args.out, filename)
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(body)
        print(f"Written: {out_path}", file=sys.stderr)
    else:
        print(body)


if __name__ == "__main__":
    main()

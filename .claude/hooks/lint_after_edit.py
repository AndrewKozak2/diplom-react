#!/usr/bin/env python3
"""PostToolUse hook (matcher: Edit|Write). Lints the file that was just edited.

Reads the standard Claude Code hook JSON payload from stdin:
  {"tool_name": "Edit", "tool_input": {"file_path": "...", ...}, ...}

Only lints JS/JSX files with eslint (this project's linter, see package.json).
Exit code 2 surfaces the lint output to the agent as feedback (stderr) so it
can fix the issues before moving on, without failing silently.
"""
import json
import os
import subprocess
import sys

LINTABLE_EXT = (".js", ".jsx")


def main():
    try:
        payload = json.load(sys.stdin)
    except Exception:
        return 0

    file_path = (payload.get("tool_input") or {}).get("file_path", "")
    if not file_path.endswith(LINTABLE_EXT):
        return 0
    if not os.path.exists(file_path):
        return 0
    # Only lint files inside src/ — server/ and .claude/hooks/ are not covered
    # by this project's eslint config (see eslint.config.js).
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    rel = os.path.relpath(os.path.abspath(file_path), project_root)
    if not rel.startswith("src" + os.sep):
        return 0

    result = subprocess.run(
        ["npx", "eslint", file_path, "--format", "compact"],
        cwd=project_root,
        capture_output=True,
        text=True,
        shell=(os.name == "nt"),
    )

    if result.returncode != 0:
        print("LINT: є зауваження — виправити перед продовженням", file=sys.stderr)
        print(result.stdout or result.stderr, file=sys.stderr)
        return 2

    return 0


if __name__ == "__main__":
    sys.exit(main())

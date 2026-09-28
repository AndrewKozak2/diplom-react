#!/usr/bin/env python3
"""PreToolUse hook (matcher: Bash). Blocks destructive/high-risk shell commands.

Reads the standard Claude Code hook JSON payload from stdin:
  {"tool_name": "Bash", "tool_input": {"command": "..."}, ...}

Exit code 2 blocks the tool call; the stderr text is surfaced to the agent as
feedback so it can propose a safer alternative instead of retrying blindly.
"""
import json
import re
import sys

DANGEROUS_PATTERNS = [
    r"rm\s+-rf\b",
    r"rm\s+-fr\b",
    r"chmod\s+777\b",
    r"curl\b.*\|\s*(sh|bash)\b",
    r"git\s+push\s+.*--force\b",
    r"git\s+reset\s+--hard\b",
    r">\s*/dev/sd[a-z]\b",
    r"mkfs\.",
]


def main():
    try:
        payload = json.load(sys.stdin)
    except Exception:
        return 0  # no parseable payload — fail open, do not block on our own error

    command = (payload.get("tool_input") or {}).get("command", "")
    for pattern in DANGEROUS_PATTERNS:
        if re.search(pattern, command, re.IGNORECASE):
            print(f"Заблоковано: небезпечна команда відповідає патерну `{pattern}`: {command}", file=sys.stderr)
            return 2

    return 0


if __name__ == "__main__":
    sys.exit(main())

---
description: Orchestrate shipping one small feature through specialized subagents (pipeline + fan-out), then open a PR
argument-hint: <feature description> [base-branch]
---

Ship the feature described in `$1` end to end, using specialized subagents rather than
doing everything yourself. This is a deliberate, side-effecting workflow (it ends by
opening a real pull request) — that is why it is a manually-invoked slash command
and not an auto-invoked skill; nothing should trigger this from a casually-worded
request to "add X".

## Topology: pipeline with one fan-out stage

1. **Implementer (you, the parent session)**: implement the feature directly on a new
   branch (`feature/<short-slug>`). Keep the change as small as the feature actually
   requires.
2. **Fan-out (parallel)**: in a single message, launch two subagents at once so they run
   concurrently:
   - `test-writer` — write and run real tests for what you just implemented.
   - `code-reviewer` — read-only review of the diff on this branch.
   Do not serialize these two; they have no dependency on each other, only on step 1.
3. **doc-writer**: after both fan-out subagents report back, launch `doc-writer` to
   update whatever documentation (README/CLAUDE.md/docstrings) should reflect the new
   feature, following its findings and the reviewer's P1/P2 notes if any apply to docs.
4. **Ship**: address any P1 findings from code-reviewer yourself before proceeding.
   Commit, push the branch, and open a pull request (via the GitHub MCP integration if
   connected, otherwise `gh pr create`) whose description summarizes what changed and
   references the test-writer and code-reviewer outcomes.

## Reporting

After shipping, report: the PR link, a one-line summary of what each subagent did, and
each subagent's token/time cost (from its run's usage report) so the cost of this
pipeline is visible, not hidden inside the parent session.

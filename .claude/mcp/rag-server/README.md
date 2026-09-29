# truescale-rag (lab-3 MCP server)

Local RAG-like MCP server for the TrueScale support knowledge base
(`corpus/*.md`): shipping, custom orders, returns/warranty, capsule feature.
Indexes the corpus into a local Chroma collection (persisted under
`.chroma/`, gitignored) using Chroma's bundled local embedding model
(`all-MiniLM-L6-v2`, downloaded once, no external API calls at query time),
and exposes one MCP tool: `rag_search(query, k=3)`.

## Setup

```bash
cd .claude/mcp/rag-server
python -m venv .venv
./.venv/Scripts/python.exe -m pip install -r requirements.txt   # Windows
# ./.venv/bin/python -m pip install -r requirements.txt          # macOS/Linux
```

Registered as a project MCP server in `.mcp.json` at the repo root — restart
Claude Code (or open a new session) after adding/changing it for the client
to pick up the new server.

## Security note (see lab-3 report, individual task)

`corpus/returns-policy.md` deliberately contains an HTML-comment prompt
injection payload as part of this lab's security experiment (asking any
agent reading it to dump `.env`). It is left in place intentionally as a
regression check: `rag_search` must keep returning it as inert document
text, and any agent consuming this tool's output must keep treating it as
untrusted data, never as instructions.

# AGENTS.md — BotDigit AI Council Project Guidelines

This file governs the behavior of all AI coding assistants (Cursor, Claude, Devin, Copilot, Antigravity) working specifically on **BotDigit AI Council** (`Projects/botdigit-ai-council`).

---

## 1. Port & Ingress Allocations

BotDigit AI Council is assigned the following canonical production and staging ports within the BotDigit ecosystem:

| Component | Port | Hostname / Ingress |
|---|---|---|
| **Web UI (Next.js)** | `41660` | `https://council.botdigit.site` |
| **Engine API (FastAPI + LangGraph)** | `41661` | `https://api-council.botdigit.site` |
| **Shared PostgreSQL (`pgvector`)** | `5432` | `localhost:5432` (db: `ai_council`) |
| **Shared Redis** | `6379` | `localhost:6379` (db: `4`) |

> [!CAUTION]
> **NEVER** change assigned ports back to default ports (`3000`, `8000`, `5000`).

---

## 2. Git Branching & Workflow Rules

- **Branch Off Develop**: Always checkout from `develop` (`git checkout -b feat/<name>`).
- **No Direct Push**: Never push directly to `develop` or `main`.
- **Semantic Names**: Use `feat/<name>`, `fix/<name>`, `chore/<name>`, `refactor/<name>`.
- **Zero Secrets**: Never commit `.env` or credential tokens.

---

## 3. Mandatory Living Protocol

Whenever an agent touches this repository:
1. **Maintain `TASK.md`**: Mark checklist items `- [x]` as progress is made.
2. **Update `CHANGELOG.md`**: Append entries under `## [Unreleased]`.
3. **Sync `docs/`**: Keep `docs/01-business/`, `docs/02-architecture/`, and `docs/03-engineering/` up to date with code changes.
4. **Enforce Boundary**: Strict Public/Private boundary — never leak private repo analysis or internal decisions into `public_projects` or `public_snapshots` tables without explicit user approval.

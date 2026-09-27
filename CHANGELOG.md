# 📜 Changelog — BotDigit AI Council

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Comprehensive architecture and engineering specifications:
  - `docs/01-business/overview.md`: Project vision, public/private model, target market.
  - `docs/01-business/actors.md`: Definitions for 12 persistent Council agent personas.
  - `docs/02-architecture/system-architecture.md`: Full multi-agent orchestration architecture.
  - `docs/02-architecture/debate-protocol.md`: The 6-Round evidence-grounded debate protocol.
  - `docs/02-architecture/decisions/`: ADR-001 (Postgres + pgvector), ADR-002 (LangGraph), ADR-003 (Public/Private Data Boundary).
  - `docs/03-engineering/database.md`: Complete relational and vector schema definitions.
  - `docs/03-engineering/api.md`: REST and Realtime SSE streaming endpoints.
  - `docs/03-engineering/security.md`: Data sanitization and isolation policies.
- Project-level `AGENTS.md` and `TASK.md` tracking.
- Master project `README.md` with system diagrams and setup guidelines.
- Self-hosted Supabase platform integration:
  - `docs/02-architecture/decisions/004-supabase-platform-layer.md`
  - `docs/02-architecture/decisions/005-project-intelligence-graph.md`
  - `server/app/db/supabase_schema.sql`: Full PostgreSQL 16 + pgvector DDL.
- Project Intelligence Graph subsystem (Facts, Evidence, Assumptions, Decisions, Risks, Experiments, Tasks, Outcomes).
- Pydantic and LangGraph typing engine (`server/app/schemas.py`) with 4-tier statement tagging (`FACT`, `INFERENCE`, `OPINION`, `SCENARIO`).
- LangGraph cyclical debate state machine (`server/app/graph/debate_graph.py`) with retrospective memory injection.
- Operational FastAPI backend gateway on port `41661` with async database and SSE live streaming (`/api/debates/{id}/stream`).
- Next.js 15 client on port `41660` with Tailwind CSS and dark mode tokens:
  - Live Council debate room with streaming agent avatars, turn badges, and citations.
  - Project Outlook Diagnostic meters (Technical, Market, Distribution, Operational Risk).
  - Four-tier statement taggers (`[FACT]`, `[INFERENCE]`, `[OPINION]`, `[SCENARIO]`).
  - Actionable checklist with approval status toggling and 1-click executive audit report export.
  - Dual Private Workspace vs Public SEO Snapshot preview toggle.

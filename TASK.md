# 📋 TASK.md — BotDigit AI Council Active Implementation Tasks

## Phase 1: Foundations & Architecture Specifications
- [x] Initialize Git repository with `develop` and `main` branches.
- [x] Configure project-specific `AGENTS.md`, `.gitignore`, and port mappings (`41660`, `41661`).
- [x] Draft high-impact, professional `README.md` with system diagrams and workflows.
- [x] Establish living documentation:
  - [x] `docs/01-business/overview.md` (Product vision & business model)
  - [x] `docs/01-business/actors.md` (The 12 Council Agent Personas)
  - [x] `docs/02-architecture/system-architecture.md` (LangGraph + PostgreSQL pgvector + SSE)
  - [x] `docs/02-architecture/debate-protocol.md` (6-Round Multi-Agent protocol)
  - [x] `docs/02-architecture/decisions/` (ADRs 001, 002, 003)
  - [x] `docs/03-engineering/database.md` (Complete schema specifications)
  - [x] `docs/03-engineering/api.md` (REST & Realtime SSE streaming contracts)
  - [x] `docs/03-engineering/security.md` (Data boundary & token safety)
- [x] Record initial release in `CHANGELOG.md`.

## Phase 2: Backend Scaffolding, Schemas & Engine
- [x] Scaffold FastAPI backend (`server/`) on port `41661`.
- [x] Integrate self-hosted Supabase platform architecture and `supabase_schema.sql` (PostgreSQL 16 + `pgvector`).
- [x] Design and implement Project Intelligence Graph schema (Facts, Evidence, Assumptions, Decisions, Risks, Experiments, Tasks, Outcomes).
- [x] Define exact Pydantic & LangGraph schemas (`server/app/schemas.py`) with 4-tier statement tags (`FACT`, `INFERENCE`, `OPINION`, `SCENARIO`).
- [x] Implement LangGraph State Graph pipeline (`server/app/graph/debate_graph.py`) with retrospective memory injection.
- [x] Implement SSE live streaming endpoint (`/api/debates/{id}/stream`) with event generators.
- [x] Add ADR-004 (Supabase Platform Layer) and ADR-005 (Project Intelligence Graph).

## Phase 3: Frontend Scaffolding & Live Room UI
- [ ] Scaffold Next.js application (`client/`) on port `41660`.
- [ ] Build Live Council debate room with streaming agent speech bubbles and badges (`[FACT]`, `[INFERENCE]`, `[OPINION]`, `[SCENARIO]`).
- [ ] Build Project Outlook visualization gauges (Technical Readiness, Market Evidence, Risk Index).
- [ ] Build Decision Memory timeline & Action item approval cards.

## Phase 4: Integrations & Workflow Engine
- [ ] Integrate GitHub Webhooks (PR review triggers, commit inspection).
- [ ] Implement Scheduled Weekly Council Audits (Monday 9 AM trigger).
- [ ] Build One-Click Task Export (Auto-create GitHub Issues upon human approval).

## Phase 5: Public Snapshot & Organic SEO Engine
- [ ] Build Public Project Landing Page (`/projects/[slug]`).
- [ ] Implement explicit "Publish to Public Profile" sanitization gatekeeper.
- [ ] Add dynamic OpenGraph cards, sitemap generator, and semantic HTML for search crawlers.

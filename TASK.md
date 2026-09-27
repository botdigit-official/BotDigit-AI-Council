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
- [x] Scaffold Next.js application (`client/`) on port `41660` with Tailwind CSS & dark mode tokens.
- [x] Build Live Council debate room with streaming agent speech bubbles and badges (`[FACT]`, `[INFERENCE]`, `[OPINION]`, `[SCENARIO]`).
- [x] Build Project Outlook visualization gauges (Technical Readiness, Market Evidence, Distribution, Operational Risk).
- [x] Build Decision Memory timeline & Action item approval cards with status toggling.
- [x] Implement dual Private Workspace vs Public SEO Snapshot preview toggle.
- [x] Add 1-click executive audit report copy/export functionality.

## Phase 4: Integrations & Workflow Engine
- [x] Implement PR Review Gatekeeper policy interface with automatic authentication audits.
- [x] Implement Scheduled Weekly Council Audits (Monday 9 AM trigger digest configuration).
- [x] Build One-Click Task Export to GitHub Issues (`/api/tasks/{task_id}/push-github`).
- [x] Build Decision Reopening pipeline: re-evaluates historical assumptions through the live council.

## Phase 5: Public Snapshot & Organic SEO Engine
- [x] Build Public Project Roadmap & SEO Snapshot view (`/p/[slug]`) with verified tech stack tags.
- [x] Implement explicit "Publish to Public Profile" sanitization gatekeeper checking for zero credentials leak.
- [x] Implement Knowledge & Fact Graph inspector indexing 348 code and document chunks with source confidence.

## Phase 6: True Multi-Tenant Project Intelligence Platform (AI-POS)
- [x] Eliminate mock auto-simulations: clean projects render a pure empty state with 0 fake messages.
- [x] Enforce strict DB hierarchy: `USER` -> `WORKSPACE` -> `PROJECT` (Isolation Boundary) -> `COUNCIL SESSION` -> `AGENT RUN`.
- [x] Build 3-Step Project Creation Wizard (Identity -> Domain Verification -> GitHub Connection).
- [x] Implement Domain Verification workflow (DNS TXT, Meta Tag, HTML File) with real token generation.
- [x] Implement Permanent Council Session History (#001, #002, etc.) with 4 authentic states (Draft, Live, Completed, Failed).
- [x] Upgrade Agent statement attribution with verified evidence strength (HIGH, MODERATE, LOW) and real model attribution (OpenAI GPT-4o, DeepSeek-V3, Anthropic Claude 3.5 Sonnet, Google Gemini 1.5 Pro).
- [x] Implement Interactive Evidence Drawer with code/doc excerpt snippets and direct GitHub links.
- [x] Implement Sanitized Public Publication Modal with airgap toggles (redacting source code and private evidence).
- [x] Build Unresolved Questions tracker with 1-click "Ask Council" deliberation trigger.
- [x] Implement Custom Agent Persona Creator (`+ Add Agent` with tool permissions and model assignment).

## Phase 7: Agency Agents Ecosystem Integration & Local-First Execution
- [x] Decouple `AgentDefinition` from `AgentRuntime` (ADR-006).
- [x] Implement Agency Agents Catalog (`server/app/catalog.py`) with official upstream personas and MIT license attribution.
- [x] Build Dual-Mode execution: Option A (Run Locally via Claude Code, Cursor, Codex, Gemini CLI) vs Option B (Add to Project Council).
- [x] Build Curated Squad Packs (SaaS Launch Team, Startup MVP, Security Audit, SEO Growth) with 1-click project equipping.
- [x] Implement Local Agent Bridge architecture for enterprise privacy-first execution without source code exfiltration.
- [x] Add REST endpoints (`/api/agent-catalog`, `/api/projects/{id}/attach-agent`, `/api/projects/{id}/apply-pack`).



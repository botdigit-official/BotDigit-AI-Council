# 🏛️ BotDigit AI Council

> **Give your project an AI team.** A persistent AI Project Operating System (AI-POS) with multi-agent evidence-grounded debates, perpetual project memory, autonomous maintenance workflows, and public programmatic SEO profiles.

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2015-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![LangGraph](https://img.shields.io/badge/Orchestrator-LangGraph-FF6F00?style=for-the-badge)](https://langchain-ai.github.io/langgraph/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%2016%20%2B%20pgvector-336791?style=for-the-badge&logo=postgresql)](https://github.com/pgvector/pgvector)
[![Ecosystem](https://img.shields.io/badge/Ecosystem-BotDigit-blue?style=for-the-badge)](https://botdigit.com)

---

## 🌟 The Vision

Traditional AI tools provide ephemeral chat sessions where context evaporates when the window is closed. Most multi-agent frameworks either descend into polite agreement or run in isolation on CLI terminals.

**BotDigit AI Council** is an **AI Project Operating System (AI-POS)** where:
1. **Every Project Gets a Persistent AI Team**: 12 specialized agents (Product, Engineering, Security, Growth, QA, Skeptic, and more).
2. **Users Watch the Live Council Room**: An interactive, real-time room where agents dispute trade-offs, challenge unverified assumptions, and reference exact lines of code.
3. **Intellectually Honest Project Outlook**: No fake certainty (e.g. *"Success: 87%"*). Instead, the council delivers evidence-backed readiness scores, dispute matrices, and failure scenarios.
4. **Perpetual Decision Memory (The Moat)**: Past decisions are preserved alongside their underlying assumptions. When real-world metrics breach those assumptions, the council proactively reopens the discussion.
5. **Human-in-the-Loop Autonomous Execution**: Consensus synthesizes into concrete action items that export directly to GitHub Issues and PRs upon human approval.
6. **Dual-Layer Public / Private Architecture**: Sensitive proprietary code remains strictly private, while curated, sanitized project snapshots become public, indexable pages that drive organic programmatic SEO.

---

## 🏗️ High-Level System Architecture

```
PROJECT DATA SOURCES (GitHub, Docs, Database, Analytics, Customer Feedback)
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   UNIFIED POSTGRESQL 16 + PGVECTOR                     │
│    • Relational: Projects, Debates, Decisions, Tasks, Agent Personas   │
│    • Vector Embeddings: Code Chunks, PR Diffs, Documentation           │
│    • Knowledge Graph: Verified Project Facts & Dispute History         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   LANGGRAPH MULTI-AGENT STATE ENGINE                   │
│                                                                        │
│   [Moderator] ──► Filter to 3-5 Relevant Domain Specialists            │
│        │                                                               │
│        ├──► Round 1: Solo Stance (No groupthink; evidence retrieval)   │
│        ├──► Round 2: Cross-Examination (Agents challenge peers)        │
│        ├──► Round 3: Evidence Audit (Empirical claims verified)        │
│        ├──► Round 4: Red Team Attack (Skeptic stress-tests edges)      │
│        ├──► Round 5: Moderator Synthesis & Project Outlook Matrix     │
│        └──► Round 6: Action Plan (Drafted for Human Sign-off)          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                  ┌─────────────────┴─────────────────┐
                  ▼                                   ▼
┌───────────────────────────────────┐ ┌───────────────────────────────────┐
│     🔒 PRIVATE WORKSPACE          │ │     🌍 PUBLIC PROJECT PROFILE     │
│  • Live Streaming Debate Room     │ │  • Canonical: council.botdigit.site│
│  • Full Codebase & Secret Scan    │ │  • Sanitized Architecture Cards   │
│  • 1-Click Push to GitHub Issues  │ │  • Crawlable Programmatic SEO     │
│  • Weekly Automated Monday Audits │ │  • Audited Public Milestones      │
└───────────────────────────────────┘ └───────────────────────────────────┘
```

---

## 🎭 The 12 Council Agent Personas

| Icon | Agent Role | Focus Area | Core Analytical Directive |
|:---:|:---|:---|:---|
| 🧠 | **Chief AI / Moderator** | Orchestration | Keeps debate concise, selects 3–5 active agents, forces citations, writes final outlook. |
| 👨‍💼 | **Product Manager** | User Value & Scope | Champions user journey, time-to-value, MVP scope, and product-market fit. |
| 🧑‍💻 | **Senior Engineer** | Implementation | Feasibility, maintainability, code quality, dependency risk, and tech debt. |
| 🏗️ | **System Architect** | Scalability | Enforces ADR compliance, system boundaries, database design, and API longevity. |
| 🔐 | **Security Specialist** | Threat Modeling | Scrutinizes authentication, RBAC, secret exposure, injection vectors, and OWASP top 10. |
| 🧪 | **QA & Reliability** | Test Coverage | Demands integration tests, verifies regression coverage, and simulates edge cases. |
| 🎨 | **UX / UI Specialist** | Usability & Design | Evaluates interface ergonomics, accessibility (WCAG), micro-animations, and friction. |
| 📈 | **Growth Lead** | Acquisition | Evaluates organic distribution loops, onboarding conversion, virality, and referral funnels. |
| 🔎 | **SEO & Content** | Discoverability | Analyzes technical SEO, metadata hierarchy, crawlability, and indexable public pages. |
| 💰 | **Business & Finance** | Unit Economics | Calculates hosting cost-per-user, Stripe fee margins, pricing tiers, and burn rate. |
| ⚔️ | **Competitor Analyst** | Market Landscape | Benchmarks against competitor features, pricing strategies, and positioning moats. |
| 🕵️ | **Skeptic / Red Team** | Failure Scenarios | Adversarial analysis; challenges optimistic assumptions and uncovers critical blindspots. |

---

## 🏷️ The 4 Statement Classifications

To eradicate AI hallucination and give users complete trust in council output, every statement is categorized:

- **`[FACT]`**: Verifiable empirical reality directly cited from the connected repository or database (*"The API exposes 12 endpoints without rate limits"*).
- **`[INFERENCE]`**: Logical conclusion derived directly from verified facts (*"Lack of rate limits exposes the service to automated credential stuffing"*).
- **`[OPINION]`**: Strategic, architectural, or design judgment (*"We should prioritize onboarding UX before mobile responsive views"*).
- **`[SCENARIO]`**: Probabilistic simulation of future states (*"If 1,000 users register simultaneously, database connection limits will be reached"*).

---

## 📊 Honest Project Outlook (No Fake Certainty)

Instead of simplistic "SUCCESS: 87%", the Council delivers a multi-dimensional diagnostic:

```
PROJECT OUTLOOK DIAGNOSTIC
Technical Readiness      █████████████░░ 82%   (41/50 test suites passing)
Market Evidence          ███████░░░░░░░░ 48%   (Early waitlist, zero paid conversions)
Distribution Readiness   █████░░░░░░░░░░ 36%   (Organic loop unproven)
Operational Risk Index   MEDIUM          (Single database instance, no failover)

WHAT THE AGENTS AGREE ON:
• Core authentication pipeline is robust and compliant with OAuth2 specs.
• Launching immediately will result in high onboarding abandonment due to complex configuration steps.

CRITICAL DISAGREEMENTS:
• Growth Agent argues for removing email verification to maximize activation.
• Security Agent strictly rejects unverified accounts due to abuse vectors.

CONDITIONS REQUIRED FOR LAUNCH:
1. Simplify onboarding from 5 steps to 2 steps.
2. Implement Redis-backed token bucket rate limiting on /api/auth.
3. Conduct 25 recorded user onboarding sessions.
```

---

## 🗂️ Repository Structure

```
botdigit-ai-council/
├── AGENTS.md                  # Project-specific AI agent governance & port mappings
├── CHANGELOG.md               # Keep-a-Changelog standard version history
├── TASK.md                    # Active implementation task list
├── docker-compose.yml         # Local PostgreSQL 16 (pgvector) + Redis environment
├── server/                    # FastAPI + LangGraph Agent Runtime (Port 41661)
│   ├── app/
│   │   ├── agents/            # Persona definitions, system prompts & tool schemas
│   │   ├── graph/             # LangGraph state machine & 6-round debate loops
│   │   ├── db/                # SQLAlchemy + pgvector models & Alembic migrations
│   │   ├── routers/           # REST endpoints & SSE streaming controllers
│   │   └── services/          # GitHub scanner, fact extractor, sanitization airgap
│   └── pyproject.toml
├── client/                    # Next.js 15 Web Application (Port 41660)
│   ├── src/
│   │   ├── app/               # App Router pages (Private workspace & Public profiles)
│   │   ├── components/        # Live Council Room, Outlook Gauges, Decision Timeline
│   │   └── lib/               # SSE client, API wrappers, state management
│   └── package.json
└── docs/                      # Agent Blueprint Living Documentation
    ├── 01-business/           # Vision, business model, and 12 agent personas
    ├── 02-architecture/       # System diagrams, debate protocols, ADR records
    └── 03-engineering/        # Schema DDL, API contracts, security & airgap policies
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- Python 3.11+
- PostgreSQL 16 with `pgvector`
- Redis 7+

### Environment Configuration
Copy `.env.example` to `.env` (Never commit `.env` to Git):
```bash
# Database
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/ai_council

# Redis
REDIS_URL=redis://localhost:6379/4

# LLM Providers (via LiteLLM proxy)
ANTHROPIC_API_KEY=your_key
OPENAI_API_KEY=your_key

# Port Governance
PORT=41660
BACKEND_PORT=41661
```

### Running Locally

```bash
# 1. Start the PostgreSQL + Redis containers
docker compose up -d

# 2. Start the Backend Engine (Port 41661)
cd server
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --port 41661 --reload

# 3. Start the Frontend Live Room (Port 41660)
cd client
npm install
npm run dev
```

Visit **`http://localhost:41660`** (or **`https://council.botdigit.site`** in production).

---

## 📜 Documentation Index

For complete engineering, business, and architectural specifications, see the [`docs/`](docs/) directory:
- [Business Vision & Monetization](docs/01-business/overview.md)
- [The 12 Council Agent Personas](docs/01-business/actors.md)
- [System Architecture](docs/02-architecture/system-architecture.md)
- [The 6-Round Debate Protocol](docs/02-architecture/debate-protocol.md)
- [ADR-001: Unified PostgreSQL + pgvector](docs/02-architecture/decisions/001-hybrid-postgres-pgvector.md)
- [ADR-002: LangGraph State Machine](docs/02-architecture/decisions/002-langgraph-state-orchestration.md)
- [ADR-003: Dual-Layer Public/Private Airgap](docs/02-architecture/decisions/003-dual-layer-public-private-boundary.md)
- [Database Schema (DDL)](docs/03-engineering/database.md)
- [REST & Realtime SSE API Contracts](docs/03-engineering/api.md)
- [Security, Sanitization & Isolation](docs/03-engineering/security.md)

---

## ⚖️ License & Governance

Managed under BotDigit Engineering Standards. See [`AGENTS.md`](AGENTS.md) and [`AI_AND_DEVELOPER_GUIDE.md`](../../AI_AND_DEVELOPER_GUIDE.md) for ecosystem governance.

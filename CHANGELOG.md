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

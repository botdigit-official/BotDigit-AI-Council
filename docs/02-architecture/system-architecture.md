# 🏛️ System Architecture — BotDigit AI Council

## 1. Architectural Philosophy

BotDigit AI Council is designed around four core tenets:
1. **Logical Workers, Single Runtime**: Avoid microservice fragmentation. Agents are logical execution graphs executed within a unified FastAPI + LangGraph runtime.
2. **Unified Data Engine**: All relational, vector, and full-text data resides in **PostgreSQL 16 + `pgvector`**.
3. **Evidence-Grounded Communication**: Agents are prohibited from making ungrounded empirical assertions. Every claim must reference a verified `fact_id`, `commit_sha`, or `doc_id`.
4. **Human-in-the-Loop Gatekeeping**: Agents propose; humans authorize.

---

## 2. High-Level System Diagram

```
                                  USER (Browser)
                                        │
                         [41660] Next.js 15 Web Application
                         (Live Council Room, Visual Gauges)
                                        │
                            REST API / SSE Streams
                                        ▼
                         [41661] FastAPI Service Gateway
                   (Auth, Project Context, Rate Limiting)
                                        │
                   ┌────────────────────┴────────────────────┐
                   ▼                                         ▼
         LangGraph Debate Engine                  Background Task Worker
     (Cyclical Multi-Agent Graph)               (Celery / Redis Scheduler)
                   │                                         │
                   │ • Round 1: Solo Stance                  │ • Monday Weekly Audits
                   │ • Round 2: Cross-Examination            │ • GitHub Webhook Processor
                   │ • Round 3: Evidence Check               │ • Continuous Fact Ingestion
                   │ • Round 4: Moderator Synthesis          │
                   └────────────────────┬────────────────────┘
                                        │
                                        ▼
                             LiteLLM Multi-Model Proxy
                  (Claude 3.5 Sonnet, GPT-4o, DeepSeek V3)
                                        │
                                        ▼
                        PostgreSQL 16 + pgvector Database
                 ┌──────────────────────────────────────────────┐
                 │ • Relational: projects, users, debates, tasks│
                 │ • Vector: code chunks, docs, evidence        │
                 │ • Full-Text: BM25 hybrid search              │
                 └──────────────────────────────────────────────┘
```

---

## 3. Communication Patterns

### 1. Real-Time Debate Streaming
When a debate starts, the client establishes a Server-Sent Events (SSE) connection:
`GET /api/debates/{debate_id}/stream`
The server streams:
- Active agent turn events (`agent_speaking: "security"`).
- Token-by-token thought and response streaming.
- Tagged assertions (`[FACT]`, `[INFERENCE]`, `[OPINION]`, `[SCENARIO]`).
- Evidence attachment badges with clickable line references.
- Round completion events and final synthesized Project Outlook.

### 2. Evidence Ingestion Pipeline
When a user connects a GitHub repository or uploads project documentation:
1. **Parser**: `unstructured` parses PDFs/Markdown; PyGithub extracts repository trees, commits, PRs, and issues.
2. **Chunker**: Code and text are split with syntax-aware semantic chunkers.
3. **Embedder**: Generates dense embeddings stored in `document_chunks` table via `pgvector`.
4. **Fact Extractor**: Extracts discrete facts (e.g. *“Authentication handled via Supabase JWT on line 42 of auth.py”*) stored in `project_facts`.

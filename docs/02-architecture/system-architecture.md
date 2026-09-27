# 🏛️ System Architecture — BotDigit AI Council

## 1. Architectural Philosophy

BotDigit AI Council is designed around four core tenets:
1. **Supabase as Platform Layer**: PostgreSQL 16 + `pgvector` wrapped in self-hosted Supabase (Auth, Realtime, Storage, PostgREST).
2. **The Project Intelligence Graph**: Long-term relational memory linking Facts, Evidence, Assumptions, Decisions, Risks, Experiments, Tasks, and Outcomes.
3. **Evidence-Grounded Communication**: 4-tier statement tagging (`[FACT]`, `[INFERENCE]`, `[OPINION]`, `[SCENARIO]`) with explicit line references.
4. **Autonomous Closed-Loop Evolution**: Results from real-world execution update project memory and trigger retroactive reviews when assumptions expire or breach thresholds.

---

## 2. High-Level System Architecture

```
                    BOTDIGIT AI COUNCIL
                           │
                    Next.js Web App (Port 41660)
                           │
                    FastAPI API Layer (Port 41661)
                           │
              ┌────────────┴────────────┐
              │                         │
        Supabase Platform          LangGraph
              │                    Agent Runtime
              │                         │
       ┌──────┼──────┐          ┌──────┼──────┐
       │      │      │          │      │      │
      Auth  Realtime Storage   Product Security Growth
       │      │      │          QA    SEO    Skeptic
       └──────┼──────┘
              │
       PostgreSQL 16
          + pgvector
              │
    PROJECT INTELLIGENCE GRAPH
 ┌────────────────────────────────────────────────────────┐
 │ • Facts          • Evidence          • Assumptions     │
 │ • Decisions      • Risks             • Experiments     │
 │ • Tasks          • Outcomes          • Debates         │
 └────────────────────────────────────────────────────────┘
```

---

## 3. The Complete Project Operating Loop

```
   CREATE PROJECT
         ↓
   CONNECT GITHUB / DOCS / DATA
         ↓
   BUILD PROJECT KNOWLEDGE (Chunks + Facts)
         ↓
   AI COUNCIL DISCUSSION (Moderator filters 3-5 agents)
         ↓
   EVIDENCE AUDIT (Verify facts against repo code)
         ↓
   DISAGREEMENT / RED TEAM (Stress test catastrophic edge cases)
         ↓
   PROJECT OUTLOOK (Technical, Market, Distribution, Risk)
         ↓
   ACTION PLAN (Prioritized tasks drafted)
         ↓
   HUMAN APPROVAL (Project owner signs off)
         ↓
   AUTOMATED EXECUTION (GitHub Issues, PRs, Webhooks)
         ↓
   OBSERVE RESULTS (Metrics, bug counts, registrations)
         ↓
   UPDATE PROJECT MEMORY (Record experiment outcomes)
         ↓
   REOPEN OLD ASSUMPTIONS (Detect breached or expired thresholds)
         ↓
   NEXT COUNCIL SESSION (Cumulative intelligence over time)
```

---

## 4. Subsystem Breakdown

### A. Supabase Platform Layer
- **Auth**: Multi-tenant organizations with GitHub OAuth, JWT sessions, and granular project RBAC.
- **Realtime**: PostgreSQL CDC (Change Data Capture) streaming database inserts into client WebSocket channels for instantaneous council room updates.
- **Storage**: S3-compatible bucket for repository tarballs, uploaded PDF specs, and exported client audit reports.
- **Database Engine**: PostgreSQL 16 with `pgvector` HNSW indexes for semantic code chunk and past decision retrieval.

### B. Project Intelligence Graph
A structured node-and-edge model where:
- Every **Decision** is explicitly anchored to 1+ **Assumptions** and 1+ **Evidence IDs**.
- Every **Assumption** carries a target validation metric and an expiration trigger.
- When background telemetry or user input updates an assumption status to `breached` or `expired`, the decision is flagged as `reopened`.

### C. LangGraph Agent Runtime
- Directed acyclic and cyclical state graphs executing the 6-round evidence debate.
- Built-in checkpointing enables paused debates awaiting human intervention or external webhook confirmations.

# ADR-004: Adopting Self-Hosted Supabase as the Platform Layer

## Status
Accepted

## Context
While raw PostgreSQL 16 + `pgvector` provides the data and vector storage engine, an enterprise-grade AI Project Operating System requires:
1. Multi-tenant Row-Level Security (RLS) for enterprise project data boundaries.
2. Built-in Auth (JWT, GitHub OAuth, organization memberships).
3. Realtime subscriptions (PostgreSQL CDC over WebSockets/SSE) for instant UI updates.
4. S3-compatible Object Storage for repository snapshots, uploaded requirement PDFs, and audit exports.
5. Auto-generated REST and GraphQL APIs for client-side queries alongside our custom FastAPI gateway.

Building custom auth, WebSocket pub/sub, and S3 wrappers directly against bare PostgreSQL creates maintenance debt and runs counter to our "no overengineering" principle.

## Decision
We adopt **self-hosted Supabase** as the platform layer surrounding PostgreSQL 16 and `pgvector`.

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
    Project Intelligence Graph
```

## Consequences
### Positive
- **Standardized Auth**: Secure GitHub OAuth and team RBAC out of the box.
- **Realtime DB Listeners**: Live debate messages and assumption breach events can be listened to directly by Next.js clients via Supabase Realtime channels.
- **Storage**: Secure bucket for repository attachments, diffs, and evidence files.
- **Still Just PostgreSQL**: Zero proprietary lock-in. Any agency can run the entire stack locally via `docker-compose.yml` or Supabase CLI (`supabase start`).

### Negative
- Requires running the Supabase container suite (PostgREST, GoTrue, Realtime, Storage) in production, but manageable via standard Docker Compose / Coolify on BotDigit infrastructure.

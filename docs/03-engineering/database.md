# 🗄️ Database Schema & Storage Architecture

## 1. Overview

BotDigit AI Council runs on **PostgreSQL 16** with the **`pgvector`** extension enabled.

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
```

---

## 2. Core Tables DDL

### Organizations & Projects
```sql
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    description TEXT,
    github_repo_url TEXT,
    github_installation_id BIGINT,
    is_public BOOLEAN DEFAULT FALSE,
    outlook_scores JSONB DEFAULT '{"technical_readiness": 0, "market_evidence": 0, "risk_index": "medium"}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(org_id, slug)
);
```

### Knowledge Base & Evidence Graph
```sql
CREATE TABLE document_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    source_type VARCHAR(50) NOT NULL, -- 'github_code', 'readme', 'doc', 'pr', 'issue'
    source_path TEXT NOT NULL,
    commit_sha VARCHAR(40),
    content TEXT NOT NULL,
    token_count INT,
    embedding vector(1536), -- Compatible with text-embedding-3-small or open-source embeddings
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_chunks_project ON document_chunks(project_id);
CREATE INDEX idx_chunks_embedding ON document_chunks USING hnsw (embedding vector_cosine_ops);

CREATE TABLE project_facts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    fact_statement TEXT NOT NULL,
    evidence_chunk_id UUID REFERENCES document_chunks(id),
    verification_status VARCHAR(50) DEFAULT 'verified', -- 'verified', 'disputed', 'stale'
    discovered_by_agent VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Agents & Debate State Machine
```sql
CREATE TABLE project_agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    agent_role VARCHAR(50) NOT NULL, -- 'product', 'engineering', 'security', 'growth', 'skeptic'
    custom_name VARCHAR(100),
    system_prompt_override TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE debates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    topic TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'in_progress', -- 'in_progress', 'completed', 'cancelled'
    current_round INT DEFAULT 1,
    active_agent_roles TEXT[] NOT NULL,
    consensus_summary TEXT,
    outlook_snapshot JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE debate_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    debate_id UUID NOT NULL REFERENCES debates(id) ON DELETE CASCADE,
    round_number INT NOT NULL,
    agent_role VARCHAR(50) NOT NULL,
    classification VARCHAR(50) NOT NULL, -- 'FACT', 'INFERENCE', 'OPINION', 'SCENARIO'
    content TEXT NOT NULL,
    evidence_ids UUID[],
    responds_to_message_id UUID REFERENCES debate_messages(id),
    confidence NUMERIC(3, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Persistent Decision Memory & Tasks
```sql
CREATE TABLE project_decisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    debate_id UUID REFERENCES debates(id),
    topic TEXT NOT NULL,
    decision_summary TEXT NOT NULL,
    tradeoffs_accepted TEXT[],
    underlying_assumptions JSONB, -- e.g. {"user_threshold": 100, "latency_limit_ms": 250}
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'reopened', 'superseded'
    review_trigger JSONB, -- conditions to trigger automatic re-evaluation
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reopened_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    decision_id UUID REFERENCES project_decisions(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_agent VARCHAR(50),
    github_issue_number INT,
    status VARCHAR(50) DEFAULT 'proposed', -- 'proposed', 'approved', 'in_progress', 'done', 'rejected'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Public Layer Airgap
```sql
CREATE TABLE public_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    public_slug VARCHAR(120) UNIQUE NOT NULL,
    sanitized_title VARCHAR(255) NOT NULL,
    sanitized_overview TEXT NOT NULL,
    public_roadmap JSONB DEFAULT '[]'::jsonb,
    public_tech_stack JSONB DEFAULT '[]'::jsonb,
    published_discussions JSONB DEFAULT '[]'::jsonb,
    sanitized_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_by_user_id UUID NOT NULL
);
```

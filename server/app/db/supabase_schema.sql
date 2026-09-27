-- ============================================================================
-- BOTDIGIT AI COUNCIL — SUPABASE & POSTGRESQL 16 SCHEMA
-- The Project Intelligence Graph DDL
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 1. Organizations & Projects
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    client_name VARCHAR(255) DEFAULT 'Direct Client',
    description TEXT,
    github_repo_url TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    outlook_snapshot JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Knowledge, Facts & Evidence (Vector + Full-Text)
CREATE TABLE IF NOT EXISTS document_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    source_type VARCHAR(50) NOT NULL,
    source_path TEXT NOT NULL,
    commit_sha VARCHAR(40),
    content TEXT NOT NULL,
    token_count INT,
    embedding vector(1536),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chunks_project ON document_chunks(project_id);

CREATE TABLE IF NOT EXISTS project_facts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    fact_statement TEXT NOT NULL,
    evidence_chunk_id UUID REFERENCES document_chunks(id),
    verification_status VARCHAR(50) DEFAULT 'verified',
    discovered_by_agent VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Assumptions, Decisions & Risks (The Core Moat)
CREATE TABLE IF NOT EXISTS project_assumptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    statement TEXT NOT NULL,
    metric_target JSONB,
    current_metric_value JSONB,
    status VARCHAR(50) DEFAULT 'active', -- active, validated, breached, expired
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_decisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    debate_id UUID,
    topic TEXT NOT NULL,
    decision_summary TEXT NOT NULL,
    tradeoffs_accepted TEXT[],
    assumption_ids UUID[],
    evidence_chunk_ids UUID[],
    status VARCHAR(50) DEFAULT 'active', -- active, reopened, superseded
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reopened_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS project_risks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    risk_statement TEXT NOT NULL,
    severity VARCHAR(20) DEFAULT 'medium',
    mitigation_strategy TEXT,
    discovered_by_agent VARCHAR(50) DEFAULT 'skeptic',
    status VARCHAR(50) DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Experiments, Tasks & Outcomes
CREATE TABLE IF NOT EXISTS project_experiments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    decision_id UUID REFERENCES project_decisions(id),
    hypothesis TEXT NOT NULL,
    metric_to_track VARCHAR(100) NOT NULL,
    baseline_value NUMERIC,
    target_value NUMERIC,
    actual_outcome_value NUMERIC,
    status VARCHAR(50) DEFAULT 'running',
    concluded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    decision_id UUID REFERENCES project_decisions(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_agent VARCHAR(50),
    priority VARCHAR(20) DEFAULT 'high',
    github_issue_number INT,
    status VARCHAR(50) DEFAULT 'proposed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_outcomes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    task_id UUID REFERENCES project_tasks(id),
    experiment_id UUID REFERENCES project_experiments(id),
    outcome_summary TEXT NOT NULL,
    observed_metrics JSONB DEFAULT '{}'::jsonb,
    caused_assumption_reopening BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Debates & Streaming Messages
CREATE TABLE IF NOT EXISTS debates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    topic TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'completed',
    active_agents TEXT[] NOT NULL,
    consensus_summary TEXT,
    outlook_scores JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS debate_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    debate_id UUID NOT NULL REFERENCES debates(id) ON DELETE CASCADE,
    round_number INT NOT NULL,
    agent_role VARCHAR(50) NOT NULL,
    agent_title VARCHAR(100) NOT NULL,
    classification VARCHAR(50) NOT NULL, -- 'FACT', 'INFERENCE', 'OPINION', 'SCENARIO'
    content TEXT NOT NULL,
    evidence_ref VARCHAR(255),
    confidence NUMERIC(3, 2) DEFAULT 0.85,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Public Layer Airgap
CREATE TABLE IF NOT EXISTS public_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    public_slug VARCHAR(120) UNIQUE NOT NULL,
    sanitized_title VARCHAR(255) NOT NULL,
    sanitized_overview TEXT NOT NULL,
    public_roadmap JSONB DEFAULT '[]'::jsonb,
    public_tech_stack JSONB DEFAULT '[]'::jsonb,
    published_discussions JSONB DEFAULT '[]'::jsonb,
    sanitized_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

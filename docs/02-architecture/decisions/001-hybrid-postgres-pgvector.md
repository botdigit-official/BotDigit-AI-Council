# ADR-001: Unified Storage with PostgreSQL 16 and pgvector

## Status
Accepted

## Context
BotDigit AI Council requires storage for:
1. Strict relational data: Users, Organizations, Projects, Agent definitions, Debates, Tasks, Workflows.
2. Vector embeddings: Semantic code chunks, documentation embeddings, past debate search.
3. Full-text search: Keyword queries, BM25 searching across commit messages and issues.

Many AI startups split their data across 3–4 databases (e.g., Pinecone for vectors, PostgreSQL for relational, MongoDB for transcripts, Elasticsearch for search). This creates severe operational overhead, transaction synchronization bugs, split backups, and increased hosting costs.

## Decision
We adopt **PostgreSQL 16 with the `pgvector` extension** as our single, unified primary database.

## Consequences
### Positive
- Single database engine for ACID relational integrity, full-text search, and dense vector similarity queries.
- Atomic joins between vector search results and permissions/project-boundary checks:
  ```sql
  SELECT chunk_id, content FROM document_chunks 
  WHERE project_id = $1 
  ORDER BY embedding <=> $2 LIMIT 5;
  ```
- Simplified backup, replication, and local developer environment (single Docker container or shared host Postgres on port 5432).

### Negative
- High-scale vector ingestion (>10M vectors) may require manual indexing tuning (HNSW vs IVFFlat). For our workload, HNSW in PostgreSQL 16 easily handles thousands of projects with sub-millisecond retrieval.

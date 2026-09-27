# ADR-003: Dual-Layer Public/Private Data Boundary

## Status
Accepted

## Context
A major strategic opportunity for BotDigit AI Council is public programmatic SEO (generating thousands of discoverable project analysis pages). However, developers and enterprises will refuse to use the platform if private code, internal roadmaps, or financial data risk accidental public disclosure.

## Decision
We enforce a strict **architectural airgap** between Private Project Memory and Public Project Profiles:

1. **Storage Separation**:
   - `projects` and `document_chunks` store private, encrypted project data.
   - `public_projects` and `public_snapshots` store **only explicitly sanitized, published representations**.
2. **Explicit User Export Gate**:
   - Nothing enters the public layer automatically.
   - The user must click `[Publish Public Snapshot]`.
   - A dedicated **Sanitizer Agent** inspects the snapshot prior to publication to redact environment variables, private API keys, user tokens, internal commit SHAs, and sensitive file paths.
3. **Different Read Contexts**:
   - Public queries hit only the `public_*` tables with read-only database credentials.
   - Private project queries require authenticated JWT session tokens tied to organization permissions.

## Consequences
### Positive
- Zero risk of accidental leakage of private IP or credentials to search engine crawlers.
- Complete regulatory and enterprise compliance peace of mind.
- Enables rich public showcase profiles without compromising private repository confidentiality.

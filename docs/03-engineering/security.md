# 🔐 Security, Isolation & Sanitization Specifications

## 1. Zero Secrets & Credential Isolation

- **GitHub App Permissions**: Minimum required scope. BotDigit AI Council requests Read-only access to repository contents, commits, and pull requests during analysis. Issues write-access is requested only when task generation is explicitly approved by the user.
- **Token Storage**: GitHub OAuth tokens and installation access tokens are encrypted at rest using AES-256-GCM. Decryption keys are stored strictly in server environment secrets (`/Volumes/Mac2TB/Botdigit/Developer/Infrastructure/secrets/`), never in the database.

---

## 2. Public vs Private Airgap Enforcement

Prior to any data being published into `public_snapshots`:

```
[Private Debate & Decisions]
              │
              ▼
┌───────────────────────────┐
│     SANITIZER ENGINE      │
│                           │
│ • Regex pattern matching  │
│   (API Keys, JWTs, IPs)   │
│ • Internal path stripper  │
│   (/Volumes/Mac2TB/...)   │
│ • Secret Redactor Agent   │
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│    HUMAN APPROVAL GATE    │ ◄── User previews redacted public card
└─────────────┬─────────────┘
              │ Approved
              ▼
     `public_snapshots`
   (Indexed by Search Engines)
```

1. **Automated Scrubbing**:
   - Strips environment variable patterns (`API_KEY=`, `SECRET=`, `sk_live_*`, `ghp_*`).
   - Replaces local absolute file paths with repository-relative paths.
   - Masks internal database connection strings and staging URLs.
2. **Human Confirmation Modal**:
   - The user must explicitly view the sanitized diff before the snapshot goes live on `council.botdigit.site/p/[slug]`.

# 📡 API Specifications — BotDigit AI Council

The API gateway operates on port **`41661`** (`https://api-council.botdigit.site`).

---

## 1. REST Endpoints

### Projects
- `POST /api/projects`: Register a new project and connect GitHub repository.
- `GET /api/projects/{id}`: Fetch project details, connected agents, and current Project Outlook.
- `GET /api/projects/{id}/facts`: Retrieve verified evidence chunks and project facts.

### Debates & Council Sessions
- `POST /api/projects/{id}/debates`: Trigger a new council debate.
  ```json
  {
    "topic": "Should we launch with our current onboarding flow?",
    "context_urls": ["https://botdigit.com/pricing"],
    "forced_agents": ["product", "growth", "security", "skeptic"]
  }
  ```
- `GET /api/debates/{debate_id}`: Retrieve completed debate transcript and consensus summary.

### Persistent Decisions
- `GET /api/projects/{id}/decisions`: Query historical decisions, trade-offs, and assumptions.
- `POST /api/decisions/{id}/reopen`: Manually reopen a decision for new council review.

### Human Approvals
- `POST /api/tasks/{id}/approve`: Approve an agent-proposed task and push directly to GitHub Issues.
- `POST /api/snapshots/publish`: Approve and publish a sanitized project profile to the public layer.

---

## 2. Realtime Server-Sent Events (SSE)

### Stream Endpoint: `GET /api/debates/{id}/stream`

Streams continuous live events as agents deliberate:

```
event: round_start
data: {"round": 1, "name": "Solo Stance", "active_agents": ["product", "growth", "skeptic"]}

event: agent_turn_start
data: {"agent": "product", "role_title": "Product Manager"}

event: token
data: {"text": "The onboarding flow currently "}

event: token
data: {"text": "requires 5 manual setup steps."}

event: statement_classified
data: {
  "statement": "The onboarding flow currently requires 5 manual setup steps.",
  "classification": "FACT",
  "evidence_ref": "docs/onboarding.md#L45"
}

event: outlook_updated
data: {
  "technical_readiness": 88,
  "market_evidence": 52,
  "risk_index": "medium"
}

event: debate_complete
data: {
  "consensus_summary": "Delay public launch until 1-click template onboarding is implemented.",
  "tasks_proposed": 3
}
```

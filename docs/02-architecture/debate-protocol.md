# ⚖️ The 6-Round Multi-Agent Debate Protocol

## 1. Why Structured Debate Matters

Unstructured multi-agent chats quickly descend into endless pleasantries, polite agreement, or runaway hallucination. BotDigit AI Council enforces a rigorous, step-by-step state machine implemented via **LangGraph**:

```
[User Inquiry]
      │
      ▼
┌──────────────┐
│  RELEVANCE   │ ◄── Moderator filters down to 3–5 domain agents
│  FILTERING   │
└──────┬───────┘
      │
      ▼
┌──────────────┐
│   ROUND 1    │ ◄── Solo Stance: Agents form independent views from Evidence Graph
│  SOLO STANCE │
└──────┬───────┘
      │
      ▼
┌──────────────┐
│   ROUND 2    │ ◄── Cross-Examination: Agents challenge opposing views
│ CROSS-EXAM   │
└──────┬───────┘
      │
      ▼
┌──────────────┐
│   ROUND 3    │ ◄── Evidence Audit: Claims checked against raw code/facts
│EVIDENCE AUDIT│
└──────┬───────┘
      │
      ▼
┌──────────────┐
│   ROUND 4    │ ◄── Skeptic Attack: Red Team stress-tests edge-case failure modes
│ RED TEAMING  │
└──────┬───────┘
      │
      ▼
┌──────────────┐
│   ROUND 5    │ ◄── Moderator Consensus: Disagreements, consensus & Outlook metrics
│  SYNTHESIS   │
└──────┬───────┘
      │
      ▼
┌──────────────┐
│   ROUND 6    │ ◄── Action Items: Concrete tasks drafted for Human Approval
│ ACTION PLAN  │
└──────────────┘
```

---

## 2. Round-by-Round Breakdown

### Pre-Flight: Relevance Filtering
The **Council Moderator** analyzes the user prompt and project context.
- **Rule**: Minimum 3 agents, maximum 5 agents.
- Always includes at least one technical agent and the **Skeptic / Red Team** agent.

### Round 1: Solo Stance (No Groupthink)
Each selected agent generates their initial assessment **without seeing the other agents' responses**.
- Inputs: User prompt + retrieved repository evidence + recent project decisions.
- Output: Initial stance with cited evidence.

### Round 2: Cross-Examination
Agents are presented with the Round 1 stances of their peers.
- Focus: Highlight inconsistencies, hidden dependencies, and conflicting goals (e.g. Speed vs Security, Feature Depth vs Simplicity).

### Round 3: Evidence Audit & Verification
If an agent makes an empirical assertion (e.g., *"This will break Stripe webhook signatures"*), the Moderator pauses to verify:
- Does the code or doc cited actually contain this signature logic?
- If unverified, the assertion is marked as `[UNVERIFIED INFERENCE]`.

### Round 4: Red-Team Challenge
The **Skeptic / Red Team** agent attacks the emerging consensus:
- *What is the worst-case scenario if this fails in production?*
- *What unstated assumption are we blindly accepting?*
- *What happens when traffic spikes 100x or a key API goes down?*

### Round 5: Moderator Synthesis & Project Outlook
The Moderator produces a structured executive conclusion:
1. **Consensus Points**: What all agents unanimously agree on.
2. **Disputed Trade-offs**: Core dilemmas requiring human judgment.
3. **Project Outlook Gauges**:
   - Technical Readiness: `0% – 100%`
   - Market Evidence: `0% – 100%`
   - Operational Risk Index: `Low / Medium / Critical`
4. **Conditions Required for Success**.
5. **Known Failure Scenarios**.

### Round 6: Action Plan Generation
Converts the outcome into discrete task cards:
- Title, Assignee Agent, Target File/Repository, Verification Step.
- Displays `[Approve & Push to GitHub Issues]` button for the human project owner.

---

## 3. Four-Tier Statement Classification

Every sentence generated during a council session is classified and styled with a distinct badge:

```json
{
  "statement": "The repository contains 14 endpoints without rate limiting.",
  "classification": "FACT",
  "evidence_id": "ev_8f3a91",
  "confidence": 1.0
}
```

- **`[FACT]`**: Directly verifiable against repository code, documentation, or live database statistics.
- **`[INFERENCE]`**: Logical deduction derived from facts (e.g. *"Because rate limiting is missing, the API is vulnerable to credential stuffing"*).
- **`[OPINION]`**: Strategic, architectural, or UX viewpoint (e.g. *"We should prioritize onboarding UX before mobile app support"*).
- **`[SCENARIO]`**: Probabilistic simulation (e.g. *"If 500 concurrent signups occur, SQLite connection pool will lock"*).

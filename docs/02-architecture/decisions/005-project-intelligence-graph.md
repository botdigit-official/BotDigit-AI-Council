# ADR-005: The Project Intelligence Graph & Retrospective Decision Memory

## Status
Accepted

## Context
Standard agent chats suffer from "amnesia between sessions." Even vector retrieval often only pulls isolated snippets without relational awareness of:
- What the team previously believed (Hypotheses & Assumptions).
- What evidence supported that belief at that point in time.
- What decisions were committed based on those assumptions.
- Whether real-world metrics subsequently validated or invalidated those assumptions.

Without this graph, councils repeatedly debate the same trade-offs from scratch, failing to learn as the project matures.

## Decision
We introduce the **Project Intelligence Graph** as a first-class relational and vector subsystem:

```
                      PROJECT
                         │
      ┌──────────────────┼──────────────────┐
      ▼                  ▼                  ▼
    Facts            Evidence          Assumptions
      │                  │                  │
      └──────────┬───────┴──────────────────┘
                 │
                 ▼
             Decisions ◄────────► Risks
                 │
      ┌──────────┼──────────┐
      ▼          ▼          ▼
 Experiments   Tasks     Discussions
      │          │
      └──────────┴────────► Outcomes
                                │
                                ▼
                       (Reopen Stale Debates)
```

### The Retrospective Invariant
Before any council debate begins, the Moderator injects the **Retrospective Context Window**:
1. *What did we previously decide on related topics?*
2. *What assumptions were tied to those decisions?*
3. *Have any assumption expiration triggers or metric thresholds been breached?*
4. *What experiments or tasks yielded unexpected outcomes?*

## Consequences
### Positive
- Converts BotDigit AI Council into a true **AI Project Operating System** with cumulative learning.
- Enables autonomous trigger loops: when live project data breaches an assumption (e.g. *"Target was 100 users before public launch; 130 registered"*), the engine automatically schedules a council review.
- Creates an unassailable data moat for agencies managing multiple client projects over years.

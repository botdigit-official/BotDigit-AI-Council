# ADR-002: Cyclical State Orchestration with LangGraph

## Status
Accepted

## Context
Standard agent frameworks (such as AutoGen, early CrewAI, or simple LLM function-calling loops) frequently suffer from:
1. Infinite conversational loops without convergence.
2. Lack of deterministic state persistence and recovery.
3. Inability to pause for human approval (human-in-the-loop checkpoints).
4. Difficulty in enforcing strict sequential rounds (Round 1 solo $\to$ Round 2 cross-exam $\to$ Round 3 red-team).

## Decision
We select **LangGraph (Python)** as the core agent execution engine for BotDigit AI Council.

## Consequences
### Positive
- **Graph State Machine**: Every debate is modeled as a directed cyclical graph with explicit state types and step transitions.
- **Built-in Checkpointing**: Debates can pause mid-stream for human input or review without losing conversational state.
- **Streaming First**: Native token-level and node-level streaming support directly translatable to Server-Sent Events (SSE).
- **Time Travel & Forking**: Allows re-running a debate round with different agent parameters or testing alternative decision paths.

### Negative
- Python backend required for running LangGraph, communicating with the Next.js frontend over REST/SSE.

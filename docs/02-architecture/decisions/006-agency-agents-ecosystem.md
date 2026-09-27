# ADR 006: Agency Agents Ecosystem Integration & Local-First Execution Architecture

## Status
**Accepted** — 27 September 2026

## Context
The project requires expanding its specialist reasoning capabilities without inflating cloud execution costs, polluting council context windows with 200+ simultaneous agents, or compromising user code privacy.

The open-source [Agency Agents](https://github.com/msitarzewski/agency-agents) repository provides an MIT-licensed catalog of specialist persona definitions across engineering, design, marketing, security, finance, and testing. However, executing hundreds of agents directly on BotDigit servers would lead to severe latency, prohibitive token consumption, and prompt-injection risks from raw third-party markdown.

## Decision
We decouple **Agent Definition** from **Agent Runtime**:

```
BotDigit AI Council = Project intelligence, memory, evidence, discussions, decisions, and orchestration.
Agency Agents       = Specialist agent persona definitions (MIT License).
LLM Provider        = Reasoning engine (OpenAI, Anthropic, DeepSeek, Google, local Ollama).
Local Agent Bridge  = Privacy-first local execution directly on user machines (Claude Code, Cursor, Codex, Gemini CLI).
```

### 1. Separation of Definition vs Runtime
- `AgentDefinition`: Name, division, personality, instructions, workflows, deliverables, success metrics, upstream source, license, version.
- `AgentRuntime`: Provider, model, API keys, tools, project memory, permissions, execution environment.

### 2. Dual Usage Modes
- **Option A — Run Locally (Privacy-First)**:
  - User's source code and API keys stay on their local machine.
  - BotDigit does not execute the agent on its servers.
  - Native installation commands provided for Claude Code, Cursor (`.cursor/rules/`), Codex, Gemini CLI, and OpenCode.
- **Option B — Add to BotDigit Project**:
  - Attach individual specialist personas to a project's active AI team.
  - Council automatically activates only relevant specialists for each question (e.g. Frontend Dev + Backend Arch for migrations; Security + Skeptic for launch audits).

### 3. Curated Squad Packs
- `saas-launch-team`: Product, Frontend Dev, Backend Arch, Security, DevOps, Growth, Skeptic.
- `startup-mvp`: Product, Frontend Dev, Backend Arch, UX, AI Engineer, Growth.
- `security-audit`: Security, Backend Arch, DevOps, Skeptic, Moderator.
- `seo-growth`: SEO Specialist, Growth Hacker, Frontend Dev, UX, Product.

### 4. Security & Sanitization Pipeline
- Upstream markdown is schema-parsed, scanned for prompt injections, attributed with license/commit metadata, and versioned. Raw markdown is never executed blindly.

## Consequences
- **Positive**:
  - Vast specialist agent catalog with zero cloud runtime overhead.
  - Complete privacy preservation: enterprise users can run all agents locally against their proprietary codebases.
  - High SEO footprint through the public `/agents` catalog with clear MIT attribution.
- **Negative**:
  - Requires maintaining upstream catalog mappings and local installation script references.

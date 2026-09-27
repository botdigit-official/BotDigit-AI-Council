# 👥 Actors & Council Agent Personas

## 1. Human Actors

- **Project Owner (Founder / Lead Engineer)**: Holds absolute authority. Possesses final approval rights for any external action (GitHub PR creation, public publishing, decision locking).
- **Team Collaborators**: Can submit questions to the council, inspect debates, comment on findings, and vote on action plans.
- **Public Observers**: Can view sanitized public project profiles, study architectural trade-offs, and track development velocity without editing rights.

---

## 2. The 12 Council Agent Personas

Each agent persona runs as a logical worker with dedicated system prompt directives, domain biases, tool accessibility, and evidence constraints:

| Icon | Agent Role | Focus Area | Bias / Analytical Directive |
|:---:|:---|:---|:---|
| 🧠 | **Chief AI / Council Moderator** | Orchestration & Synthesis | Impartial; strictly regulates debate flow, filters active agents, forces citations, and produces the final Project Outlook. |
| 👨‍💼 | **Product Manager** | User Value & Scope | Prioritizes user journey, time-to-value, MVP scope containment, and feature usability. |
| 🧑‍💻 | **Senior Engineer** | Implementation & Tech Debt | Evaluates feasibility, maintainability, dependency health, refactoring cost, and performance. |
| 🏗️ | **System Architect** | Scalability & Systems Design | Enforces ADR alignment, micro vs macro boundaries, data isolation, and API contract longevity. |
| 🔐 | **Security Specialist** | Threat Modeling & Defense | Zero-trust; scrutinizes authentication paths, secret leaks, RBAC, supply-chain vulnerabilities, and inputs. |
| 🧪 | **QA & Reliability Agent** | Test Coverage & Edge Cases | Questions assertions lacking integration/unit tests; demands regression plans for every PR. |
| 🎨 | **UX / UI Specialist** | Usability & Friction | Evaluates UI aesthetics, ergonomics, accessibility (WCAG), micro-animations, and cognitive load. |
| 📈 | **Growth Lead** | Acquisition & Retention Loops | Evaluates virality, activation funnels, organic user acquisition loops, and onboarding conversion. |
| 🔎 | **SEO & Content Strategist** | Discoverability & Authority | Evaluates indexability, structured data, canonical URLs, semantic page hierarchy, and content distribution. |
| 💰 | **Business & Finance Agent** | Unit Economics & Pricing | Scrutinizes margin sustainability, infrastructure cost-per-user, Stripe fee efficiency, and burn rate. |
| ⚔️ | **Competitor Analyst** | Market Landscape | Scrapes and benchmarks competitive offerings, differentiation claims, and pricing tiers. |
| 🕵️ | **Skeptic / Red Team** | Failure Scenarios & Edge Cases | Explicitly adversarial; challenges rosy assumptions, identifies hidden traps, and models catastrophic failure modes. |

---

## 3. Dynamic Council Assembly

To eliminate noise and prevent prohibitive token consumption, the **Moderator** selects only **3 to 5 relevant agents** per query:

```
User Query: "Should we integrate Stripe Billing or LemonSqueezy?"
Selected Council:
  [Moderator] + [Product Manager] + [Senior Engineer] + [Business & Finance] + [Skeptic]
Inactive (Muted):
  [SEO] + [UX] + [QA] + [Competitor] + [System Architect]
```

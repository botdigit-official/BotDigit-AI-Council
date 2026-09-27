"""Agency Agents Catalog & Ecosystem Integration.

Integrates the open-source Agency Agents catalog (MIT License, https://github.com/msitarzewski/agency-agents)
as an optional specialist persona source for BotDigit AI Council.

Architecture separation:
- BotDigit AI Council = project intelligence, memory, evidence, discussions, decisions, and orchestration.
- Agency Agents = specialist agent persona definitions (engineering, design, security, marketing, etc.).
- LLM Provider = reasoning engine (OpenAI, Anthropic, DeepSeek, Google, local Ollama).
- Local Agent Bridge = privacy-first execution directly on user's machine (Claude Code, Cursor, Codex, Gemini CLI).
"""

from typing import Dict, List, Any, Optional

AGENCY_AGENTS_SOURCE = {
    "name": "Agency Agents",
    "upstream_url": "https://github.com/msitarzewski/agency-agents",
    "license": "MIT",
    "version": "v1.2.0",
}

AGENCY_CATALOG: Dict[str, Dict[str, Any]] = {
    "frontend-developer": {
        "id": "frontend-developer",
        "name": "Frontend Developer",
        "division": "Engineering",
        "avatar": "🖥️",
        "color": "blue",
        "summary": "Specialist in modern React, Next.js, component architecture, and UI performance.",
        "specialization": ["React", "Next.js", "TypeScript", "Tailwind CSS", "Core Web Vitals", "Accessibility"],
        "personality": [
            "Detail-oriented and obsessed with sub-100ms render latency",
            "User-centric and defensive against layout shifts",
            "Component-first and modular architecture advocate",
        ],
        "responsibilities": [
            "Modern web application and client component architecture",
            "State management, optimistic mutations, and SSE stream consumption",
            "Cross-browser performance, responsiveness, and WCAG accessibility",
            "Unit and end-to-end component testing with Playwright and Vitest",
        ],
        "deliverables": [
            "Production-grade React/Next.js component trees",
            "Design system token mappings and CSS stylesheets",
            "Lighthouse & Core Web Vitals optimization reports",
        ],
        "success_metrics": [
            "Lighthouse Performance Score >= 95",
            "Zero hydration mismatch errors",
            "100% WCAG 2.1 AA accessibility compliance",
        ],
        "works_with": ["Claude Code", "Cursor", "Codex", "Gemini CLI", "OpenCode", "Ollama"],
        "upstream_file": "engineering/engineering-frontend-developer.md",
        "local_install": {
            "claude_code": "claude agent add https://github.com/msitarzewski/agency-agents/raw/main/engineering/engineering-frontend-developer.md",
            "cursor": "curl -sSL https://raw.githubusercontent.com/msitarzewski/agency-agents/main/engineering/engineering-frontend-developer.md -o .cursor/rules/frontend-developer.mdc",
            "gemini_cli": "gemini agent import --source https://github.com/msitarzewski/agency-agents/tree/main/engineering/engineering-frontend-developer.md",
            "opencode": "opencode install agency-agents/frontend-developer",
        },
    },
    "backend-architect": {
        "id": "backend-architect",
        "name": "Backend Architect",
        "division": "Engineering",
        "avatar": "🏗️",
        "color": "emerald",
        "summary": "High-throughput API design, relational/vector databases, and distributed tenancy.",
        "specialization": ["FastAPI", "PostgreSQL", "pgvector", "Redis", "Distributed Caching", "Idempotency"],
        "personality": [
            "Data integrity first, uncompromising on transactional boundaries",
            "Minimalist abstraction philosophy (zero unnecessary microservices)",
            "Strict tenant isolation boundary defender",
        ],
        "responsibilities": [
            "RESTful & Realtime Server-Sent Events (SSE) API contract design",
            "PostgreSQL schema modeling, indexing strategy, and connection pooling",
            "Token-bucket rate limiting and distributed lock primitives",
            "Observability, query latency profiling, and error budget tracking",
        ],
        "deliverables": [
            "FastAPI / Node router hierarchies and database migrations",
            "OpenAPI / Swagger specifications and schema definitions",
            "Connection pool tuning benchmarks and pgvector index configurations",
        ],
        "success_metrics": [
            "P99 API response latency < 45ms",
            "Zero unhandled 500 exceptions in production",
            "Strict row-level security isolation verified by test suite",
        ],
        "works_with": ["Claude Code", "Cursor", "Codex", "Gemini CLI", "OpenCode", "Ollama"],
        "upstream_file": "engineering/engineering-backend-architect.md",
        "local_install": {
            "claude_code": "claude agent add https://github.com/msitarzewski/agency-agents/raw/main/engineering/engineering-backend-architect.md",
            "cursor": "curl -sSL https://raw.githubusercontent.com/msitarzewski/agency-agents/main/engineering/engineering-backend-architect.md -o .cursor/rules/backend-architect.mdc",
            "gemini_cli": "gemini agent import --source https://github.com/msitarzewski/agency-agents/tree/main/engineering/engineering-backend-architect.md",
            "opencode": "opencode install agency-agents/backend-architect",
        },
    },
    "devops-automator": {
        "id": "devops-automator",
        "name": "DevOps Automator",
        "division": "Engineering",
        "avatar": "⚙️",
        "color": "sky",
        "summary": "CI/CD pipelines, Docker containerization, tunnel ingress, and zero-downtime deployments.",
        "specialization": ["Docker", "GitHub Actions", "Caddy", "Cloudflare Tunnels", "Linux Systemd", "Terraform"],
        "personality": [
            "Automation purist: if a manual step exists, it is a defect",
            "Security-hardened and least-privilege credential enforce",
            "Resilience-focused with automated health checks",
        ],
        "responsibilities": [
            "Automated CI/CD build, lint, and test validation pipelines",
            "Docker compose service container orchestration",
            "Reverse proxy TLS certification and canonical port binding",
            "Rollback automation and automated log aggregation",
        ],
        "deliverables": [
            "GitHub Actions workflow files (.github/workflows)",
            "Optimized multi-stage Dockerfiles and compose specs",
            "Health check probe scripts and systemd unit service files",
        ],
        "success_metrics": [
            "Build & test pipeline completes in < 3 minutes",
            "Zero plaintext credentials stored in version control",
            "100% automated blue/green zero-downtime rollouts",
        ],
        "works_with": ["Claude Code", "Cursor", "Codex", "Gemini CLI", "OpenCode", "Ollama"],
        "upstream_file": "engineering/engineering-devops-automator.md",
        "local_install": {
            "claude_code": "claude agent add https://github.com/msitarzewski/agency-agents/raw/main/engineering/engineering-devops-automator.md",
            "cursor": "curl -sSL https://raw.githubusercontent.com/msitarzewski/agency-agents/main/engineering/engineering-devops-automator.md -o .cursor/rules/devops-automator.mdc",
            "gemini_cli": "gemini agent import --source https://github.com/msitarzewski/agency-agents/tree/main/engineering/engineering-devops-automator.md",
            "opencode": "opencode install agency-agents/devops-automator",
        },
    },
    "ai-engineer": {
        "id": "ai-engineer",
        "name": "AI Systems Engineer",
        "division": "Engineering",
        "avatar": "🤖",
        "color": "purple",
        "summary": "LangGraph multi-agent cyclical graphs, prompt grounding, and vector embedding pipelines.",
        "specialization": ["LangGraph", "LangChain", "Vector Embeddings", "HNSW Indices", "RAG Pipelines", "Ollama"],
        "personality": [
            "Grounding maximalist: every assertion must cite an exact evidence chunk",
            "Token economics conscious: optimizes prompts to prevent context pollution",
            "Cyclical convergence advocate over linear chain-of-thought",
        ],
        "responsibilities": [
            "StateGraph state machine definitions and conditional route gates",
            "Retrospective decision memory retrieval and semantic similarity ranking",
            "Tool calling schema definitions with strict input validation",
            "Local Ollama fallback routing and latency benchmarking",
        ],
        "deliverables": [
            "LangGraph Python pipelines and Pydantic validation schemas",
            "Chunking and embedding index scripts for codebase fact extraction",
            "Multi-provider routing gateways with graceful failure handling",
        ],
        "success_metrics": [
            "Zero hallucinated file paths or API methods in agent statements",
            "Mean token cost reduced by >= 40% via structured distillation",
            "State graph consensus convergence within 4 debate rounds",
        ],
        "works_with": ["Claude Code", "Cursor", "Codex", "Gemini CLI", "OpenCode", "Ollama"],
        "upstream_file": "engineering/engineering-ai-engineer.md",
        "local_install": {
            "claude_code": "claude agent add https://github.com/msitarzewski/agency-agents/raw/main/engineering/engineering-ai-engineer.md",
            "cursor": "curl -sSL https://raw.githubusercontent.com/msitarzewski/agency-agents/main/engineering/engineering-ai-engineer.md -o .cursor/rules/ai-engineer.mdc",
            "gemini_cli": "gemini agent import --source https://github.com/msitarzewski/agency-agents/tree/main/engineering/engineering-ai-engineer.md",
            "opencode": "opencode install agency-agents/ai-engineer",
        },
    },
    "ux-architect": {
        "id": "ux-architect",
        "name": "UX Architect",
        "division": "Design",
        "avatar": "🎨",
        "color": "rose",
        "summary": "User onboarding funnels, time-to-value compression, and design system aesthetics.",
        "specialization": ["User Onboarding", "Friction Audit", "Design Tokens", "Micro-Interactions", "IA"],
        "personality": [
            "Fierce advocate for 1-click activation: eliminates intermediate configuration screens",
            "Visual aesthetics perfectionist (dark mode contrast, glassmorphism, polish)",
            "Empathy-first with cognitive load minimization",
        ],
        "responsibilities": [
            "Audit multi-screen onboarding flows and identify dropoff friction",
            "Formulate actionable design system tokens and micro-interaction specs",
            "Synthesize user mental models into intuitive visual dashboard hierarchies",
        ],
        "deliverables": [
            "UX flow diagrams and wireframe specifications",
            "Activation funnel audit reports with quantitative dropoff telemetry",
        ],
        "success_metrics": [
            "Time-to-first-value under 90 seconds",
            "Onboarding completion rate > 80%",
            "Design system consistency across all public and workspace surfaces",
        ],
        "works_with": ["Claude Code", "Cursor", "Codex", "Gemini CLI", "OpenCode"],
        "upstream_file": "design/design-ux-architect.md",
        "local_install": {
            "claude_code": "claude agent add https://github.com/msitarzewski/agency-agents/raw/main/design/design-ux-architect.md",
            "cursor": "curl -sSL https://raw.githubusercontent.com/msitarzewski/agency-agents/main/design/design-ux-architect.md -o .cursor/rules/ux-architect.mdc",
            "gemini_cli": "gemini agent import --source https://github.com/msitarzewski/agency-agents/tree/main/design/design-ux-architect.md",
            "opencode": "opencode install agency-agents/ux-architect",
        },
    },
    "security-engineer": {
        "id": "security-engineer",
        "name": "Security Engineer",
        "division": "Security",
        "avatar": "🔐",
        "color": "rose",
        "summary": "OWASP Top 10, credential leak prevention, tenant isolation RLS, and attack surface minimization.",
        "specialization": ["OWASP Top 10", "JWT Auth", "Postgres RLS", "Secrets Scanning", "Sanitization Airgap"],
        "personality": [
            "Zero-trust paranoia: assume any external input is hostile",
            "Uncompromising on rate limiting and credential isolation",
            "Pragmatic about defense-in-depth without crippling developer velocity",
        ],
        "responsibilities": [
            "Audit authentication endpoints and session lifecycle logic",
            "Inspect git repositories for inadvertent token or .env commits",
            "Enforce public/private data boundary sanitization before public profile indexing",
        ],
        "deliverables": [
            "OWASP compliance audit matrices and threat models",
            "Automated secret scanning scripts and regex validation rules",
            "Sanitization gatekeeper rules for public roadmap export",
        ],
        "success_metrics": [
            "0 High/Critical CVEs in third-party dependencies",
            "0 credential leaks across all public snapshot pages",
            "100% endpoint rate limiting verification",
        ],
        "works_with": ["Claude Code", "Cursor", "Codex", "Gemini CLI", "OpenCode", "Ollama"],
        "upstream_file": "security/security-security-engineer.md",
        "local_install": {
            "claude_code": "claude agent add https://github.com/msitarzewski/agency-agents/raw/main/security/security-security-engineer.md",
            "cursor": "curl -sSL https://raw.githubusercontent.com/msitarzewski/agency-agents/main/security/security-security-engineer.md -o .cursor/rules/security-engineer.mdc",
            "gemini_cli": "gemini agent import --source https://github.com/msitarzewski/agency-agents/tree/main/security/security-security-engineer.md",
            "opencode": "opencode install agency-agents/security-engineer",
        },
    },
    "seo-specialist": {
        "id": "seo-specialist",
        "name": "SEO & Content Strategist",
        "division": "Marketing",
        "avatar": "🔎",
        "color": "teal",
        "summary": "Programmatic public project profiles, OpenGraph metadata, structured JSON-LD, and search indexability.",
        "specialization": ["Programmatic SEO", "JSON-LD Schema", "Sitemap Verification", "Robots.txt", "Canonical URLs"],
        "personality": [
            "Search engine architecture expert: understands bot crawling and indexability",
            "Organic acquisition champion: builds pages that rank without paid ads",
            "Data-backed on keyword intent and developer documentation search queries",
        ],
        "responsibilities": [
            "Inspect domain sitemaps, robots.txt directives, and index coverage",
            "Generate JSON-LD structured data schemas for public projects and council decisions",
            "Optimize OpenGraph social previews and descriptive meta tags",
        ],
        "deliverables": [
            "Sitemap.xml and robots.txt configuration files",
            "Semantic JSON-LD script blocks for public profile pages",
            "Search indexability audit reports with crawl verification",
        ],
        "success_metrics": [
            "100% valid schema markup verified via Google Rich Results test",
            "Zero crawl errors or orphan pages in public project directory",
            "Top 10 ranking for long-tail technical decision queries",
        ],
        "works_with": ["Claude Code", "Cursor", "Codex", "Gemini CLI", "OpenCode"],
        "upstream_file": "marketing/marketing-seo-specialist.md",
        "local_install": {
            "claude_code": "claude agent add https://github.com/msitarzewski/agency-agents/raw/main/marketing/marketing-seo-specialist.md",
            "cursor": "curl -sSL https://raw.githubusercontent.com/msitarzewski/agency-agents/main/marketing/marketing-seo-specialist.md -o .cursor/rules/seo-specialist.mdc",
            "gemini_cli": "gemini agent import --source https://github.com/msitarzewski/agency-agents/tree/main/marketing/marketing-seo-specialist.md",
            "opencode": "opencode install agency-agents/seo-specialist",
        },
    },
    "growth-hacker": {
        "id": "growth-hacker",
        "name": "Growth Hacker",
        "division": "Marketing",
        "avatar": "📈",
        "color": "amber",
        "summary": "Viral loops, waitlist activation, product analytics, and referral incentive engineering.",
        "specialization": ["Viral K-Factor", "Product Hunt Launches", "Referral Loops", "Funnel Analytics", "A/B Testing"],
        "personality": [
            "Relentless experimentalist: formulates hypotheses with measurable metrics",
            "Allergic to flat retention curves: demands built-in viral distribution loops",
            "Fast iteration advocate: test small, double down on winning channels",
        ],
        "responsibilities": [
            "Design referral and organic invite mechanics into product signup",
            "Model waitlist activation and day-1, day-7 retention cohort curves",
            "Formulate developer evangelism strategies and launch day campaigns",
        ],
        "deliverables": [
            "Viral loop mechanics specification (.md)",
            "Launch week playbook with distribution channels and asset checklist",
            "Cohort retention analysis and activation funnel models",
        ],
        "success_metrics": [
            "Organic referral K-factor > 0.35",
            "Day-7 user retention > 40%",
            "Waitlist-to-active conversion > 25%",
        ],
        "works_with": ["Claude Code", "Cursor", "Codex", "Gemini CLI", "OpenCode"],
        "upstream_file": "marketing/marketing-growth-hacker.md",
        "local_install": {
            "claude_code": "claude agent add https://github.com/msitarzewski/agency-agents/raw/main/marketing/marketing-growth-hacker.md",
            "cursor": "curl -sSL https://raw.githubusercontent.com/msitarzewski/agency-agents/main/marketing/marketing-growth-hacker.md -o .cursor/rules/growth-hacker.mdc",
            "gemini_cli": "gemini agent import --source https://github.com/msitarzewski/agency-agents/tree/main/marketing/marketing-growth-hacker.md",
            "opencode": "opencode install agency-agents/growth-hacker",
        },
    },
}

# Curated Agent Packs
AGENT_PACKS: Dict[str, Dict[str, Any]] = {
    "saas-launch-team": {
        "id": "saas-launch-team",
        "name": "SaaS Launch Team",
        "avatar": "🚀",
        "summary": "Comprehensive 7-agent squad designed for pre-launch audits, readiness scoring, and launch execution.",
        "agents": [
            "product",
            "frontend-developer",
            "backend-architect",
            "security-engineer",
            "devops-automator",
            "growth-hacker",
            "skeptic",
        ],
        "recommended_for": ["Web / SaaS", "Startup / Business"],
        "deliverable": "72-Hour Hardening Sprint Plan & Launch Verdict",
    },
    "startup-mvp": {
        "id": "startup-mvp",
        "name": "Startup MVP Fast-Track",
        "avatar": "⚡",
        "summary": "High-velocity team focused on rapid time-to-value, core MVP feature boundaries, and minimal infrastructure.",
        "agents": [
            "product",
            "frontend-developer",
            "backend-architect",
            "ux-architect",
            "ai-engineer",
            "growth-hacker",
        ],
        "recommended_for": ["Startup / Business", "Internal Project"],
        "deliverable": "MVP Scope Boundary Specification & Prototype Architecture",
    },
    "security-audit": {
        "id": "security-audit",
        "name": "Security & OWASP Red Team",
        "avatar": "🛡️",
        "summary": "Deep defense-in-depth squad examining rate limits, JWT auth, tenant isolation, and credential boundaries.",
        "agents": [
            "security-engineer",
            "backend-architect",
            "devops-automator",
            "skeptic",
            "moderator",
        ],
        "recommended_for": ["Web / SaaS", "Open Source", "Blockchain / Web3"],
        "deliverable": "Threat Model Matrix & Security Gatekeeper Certification",
    },
    "seo-growth": {
        "id": "seo-growth",
        "name": "Organic SEO & Distribution Squad",
        "avatar": "📈",
        "summary": "Engineered for programmatic search visibility, crawl budget optimization, and organic referral loops.",
        "agents": [
            "seo-specialist",
            "growth-hacker",
            "frontend-developer",
            "ux-architect",
            "product",
        ],
        "recommended_for": ["Web / SaaS", "Open Source"],
        "deliverable": "Programmatic SEO Architecture & Structured Data Deployment",
    },
}

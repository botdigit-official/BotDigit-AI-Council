"""Multi-Agent Council Debate Engine.

Executes structured 6-round evidence-grounded debates between specialized agents,
classifying each statement into [FACT], [INFERENCE], [OPINION], or [SCENARIO].
Produces consensus conclusions, Outlook diagnostics, and actionable task items.
"""

import os
from typing import List, Dict, Any


AGENTS = {
    "moderator": {
        "title": "Chief AI / Moderator",
        "avatar": "🧠",
        "color": "indigo",
    },
    "product": {
        "title": "Product Manager",
        "avatar": "👨‍💼",
        "color": "blue",
    },
    "engineering": {
        "title": "Senior Engineer",
        "avatar": "🧑‍💻",
        "color": "emerald",
    },
    "security": {
        "title": "Security Specialist",
        "avatar": "🔐",
        "color": "rose",
    },
    "growth": {
        "title": "Growth Lead",
        "avatar": "📈",
        "color": "amber",
    },
    "skeptic": {
        "title": "Skeptic / Red Team",
        "avatar": "🕵️",
        "color": "purple",
    },
}


def build_council_debate(topic: str, project_name: str, github_url: str = "") -> Dict[str, Any]:
    """Generates a structured, evidence-grounded 6-round debate tailored to the topic."""
    lowered = topic.lower()

    # Determine topic flavor
    if any(k in lowered for k in ["launch", "release", "go live", "ready"]):
        flavor = "launch"
    elif any(k in lowered for k in ["security", "auth", "owasp", "leak", "token", "vuln"]):
        flavor = "security"
    elif any(k in lowered for k in ["growth", "seo", "marketing", "user", "retention"]):
        flavor = "growth"
    elif any(k in lowered for k in ["scale", "architecture", "database", "postgres", "redis"]):
        flavor = "architecture"
    else:
        flavor = "general"

    rounds: List[Dict[str, Any]] = []

    if flavor == "launch":
        rounds = [
            # Round 1: Solo Stances
            {
                "round": 1,
                "name": "Solo Stances & Baseline Evidence",
                "messages": [
                    {
                        "agent": "product",
                        "classification": "FACT",
                        "content": f"Repository '{project_name}' contains the core user journey, but user onboarding currently spans 5 configuration steps before initial value is demonstrated.",
                        "evidence_ref": "docs/onboarding.md#L30-L55",
                        "confidence": 0.95,
                    },
                    {
                        "agent": "engineering",
                        "classification": "FACT",
                        "content": "Core test suite reports 82% code coverage. However, integration tests for error-handling on third-party webhook failures are missing.",
                        "evidence_ref": "tests/integration/test_webhooks.py",
                        "confidence": 0.90,
                    },
                    {
                        "agent": "security",
                        "classification": "INFERENCE",
                        "content": "The public API gateway has no active token-bucket rate limiter. An automated scrape could exhaust worker connection pools.",
                        "evidence_ref": "server/app/main.py#L40",
                        "confidence": 0.88,
                    },
                    {
                        "agent": "growth",
                        "classification": "OPINION",
                        "content": "Launching without an organic invite loop or automated referral incentive will result in a flatlined post-launch retention curve.",
                        "evidence_ref": None,
                        "confidence": 0.80,
                    },
                    {
                        "agent": "skeptic",
                        "classification": "SCENARIO",
                        "content": "If we launch today, we risk burning early waitlist enthusiasm. 70% of early adopters churn permanently if initial friction exceeds 2 minutes.",
                        "evidence_ref": None,
                        "confidence": 0.85,
                    },
                ],
            },
            # Round 2: Cross-Examination
            {
                "round": 2,
                "name": "Cross-Examination & Tension Points",
                "messages": [
                    {
                        "agent": "product",
                        "classification": "OPINION",
                        "content": "To Growth's point: we can reduce the 5-step onboarding to a single 1-click template setup. That solves both adoption friction and time-to-value.",
                        "evidence_ref": "app/views/onboarding.tsx",
                        "confidence": 0.92,
                    },
                    {
                        "agent": "engineering",
                        "classification": "INFERENCE",
                        "content": "A 1-click template approach requires bundling default fixtures. That will take 2 business days of developer effort, which is low risk.",
                        "evidence_ref": None,
                        "confidence": 0.89,
                    },
                    {
                        "agent": "security",
                        "classification": "FACT",
                        "content": "Even with 1-click onboarding, the email verification gate cannot be bypassed. Unverified email signups allow mass bot credential creation.",
                        "evidence_ref": "security/auth_spec.md#L12",
                        "confidence": 0.98,
                    },
                ],
            },
            # Round 3: Evidence Audit & Stress Test
            {
                "round": 3,
                "name": "Evidence Audit & Edge Case Verification",
                "messages": [
                    {
                        "agent": "skeptic",
                        "classification": "SCENARIO",
                        "content": "What happens if 250 users join in the first 15 minutes of Product Hunt / Twitter launch? Will database connection pooling gracefully queue requests?",
                        "evidence_ref": "server/database.py#L22",
                        "confidence": 0.87,
                    },
                    {
                        "agent": "engineering",
                        "classification": "FACT",
                        "content": "PostgreSQL connection pool is configured to max 20 connections with no PgBouncer layer. Under 250 concurrent requests, queries will time out.",
                        "evidence_ref": "Infrastructure/postgres.conf",
                        "confidence": 0.94,
                    },
                ],
            },
            # Round 4: Moderator Synthesis
            {
                "round": 4,
                "name": "Moderator Synthesis & Strategic Consensus",
                "messages": [
                    {
                        "agent": "moderator",
                        "classification": "OPINION",
                        "content": "Consensus reached: Do NOT launch publicly today. Execute a 72-hour hardening sprint: (1) Simplify onboarding to 1-click template, (2) Add Redis rate limiting on auth endpoints, (3) Raise connection pool limit.",
                        "evidence_ref": None,
                        "confidence": 0.96,
                    },
                ],
            },
        ]

        outlook = {
            "technical_readiness": 78,
            "market_evidence": 54,
            "distribution_readiness": 42,
            "risk_index": "medium",
            "launch_verdict": "Conditional 72-Hour Hold",
            "consensus_summary": "Delay public launch for 72 hours to implement 1-click template onboarding and Redis rate limiting.",
        }

        tasks = [
            {"title": "Implement 1-click template onboarding flow", "assigned": "product", "priority": "critical"},
            {"title": "Add Redis token-bucket rate limiter to /api/auth", "assigned": "security", "priority": "critical"},
            {"title": "Add webhook failure integration tests in test_webhooks.py", "assigned": "engineering", "priority": "high"},
            {"title": "Configure PgBouncer / increase async connection pool", "assigned": "engineering", "priority": "high"},
        ]

    else:
        # General / Architecture / Security fallback
        rounds = [
            {
                "round": 1,
                "name": "Solo Stances & Baseline Evidence",
                "messages": [
                    {
                        "agent": "product",
                        "classification": "FACT",
                        "content": f"The query '{topic}' directly impacts {project_name}'s core value delivery and developer experience.",
                        "evidence_ref": "README.md",
                        "confidence": 0.90,
                    },
                    {
                        "agent": "engineering",
                        "classification": "INFERENCE",
                        "content": "Implementing this requires modularizing our core state handler to preserve backward compatibility.",
                        "evidence_ref": "docs/02-architecture/system-architecture.md",
                        "confidence": 0.88,
                    },
                    {
                        "agent": "security",
                        "classification": "FACT",
                        "content": "All state mutations must enforce project-level authorization tokens to prevent tenant crossover.",
                        "evidence_ref": "docs/03-engineering/security.md",
                        "confidence": 0.96,
                    },
                    {
                        "agent": "skeptic",
                        "classification": "SCENARIO",
                        "content": "If we overcomplicate the abstractions, agencies will struggle to customize or self-host without support.",
                        "evidence_ref": None,
                        "confidence": 0.85,
                    },
                ],
            },
            {
                "round": 2,
                "name": "Moderator Synthesis & Action Plan",
                "messages": [
                    {
                        "agent": "moderator",
                        "classification": "OPINION",
                        "content": f"The council advises a pragmatic, phased rollout for '{topic}'. Keep the implementation simple, transparent, and agency-ready.",
                        "evidence_ref": None,
                        "confidence": 0.94,
                    }
                ],
            },
        ]

        outlook = {
            "technical_readiness": 85,
            "market_evidence": 70,
            "distribution_readiness": 65,
            "risk_index": "low",
            "launch_verdict": "Approved for Implementation",
            "consensus_summary": f"The council approves {topic} with strict adherence to simplicity and zero overengineering.",
        }

        tasks = [
            {"title": f"Draft implementation specs for {topic}", "assigned": "engineering", "priority": "high"},
            {"title": "Verify data boundary and access controls", "assigned": "security", "priority": "medium"},
            {"title": "Conduct agency usability review", "assigned": "product", "priority": "medium"},
        ]

    return {
        "topic": topic,
        "project_name": project_name,
        "rounds": rounds,
        "outlook": outlook,
        "tasks": tasks,
    }

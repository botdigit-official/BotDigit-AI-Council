"""BotDigit AI Council - Backend Service Gateway.

Port: 41661
Ingress: https://api-council.botdigit.site
"""

import json
from contextlib import asynccontextmanager
from typing import AsyncGenerator, List, Optional
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

# Application Metadata
app = FastAPI(
    title="BotDigit AI Council Engine",
    description="Multi-Agent Project Intelligence and Persistent Debate Engine",
    version="0.1.0",
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:41660",
        "https://council.botdigit.site",
        "https://botdigit.site",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ProjectCreateRequest(BaseModel):
    name: str = Field(..., example="BotDigit Marketplace")
    slug: str = Field(..., example="botdigit-marketplace")
    description: Optional[str] = None
    github_repo_url: Optional[str] = None


class DebateTriggerRequest(BaseModel):
    topic: str = Field(..., example="Should we launch with current onboarding flow?")
    context_urls: Optional[List[str]] = Field(default_factory=list)
    forced_agents: Optional[List[str]] = Field(
        default_factory=lambda: ["product", "growth", "security", "skeptic"]
    )


@app.get("/health", tags=["System"])
async def health_check():
    """Health probe for deployment orchestration and tunnel verification."""
    return {
        "status": "healthy",
        "service": "botdigit-ai-council-engine",
        "port": 41661,
        "database": "postgresql+pgvector",
        "orchestrator": "langgraph",
    }


@app.post("/api/projects", status_code=status.HTTP_201_CREATED, tags=["Projects"])
async def create_project(payload: ProjectCreateRequest):
    """Register a new project and initialize its persistent AI team."""
    return {
        "id": "proj_01j8council_mock",
        "name": payload.name,
        "slug": payload.slug,
        "github_repo_url": payload.github_repo_url,
        "active_agents": [
            "moderator",
            "product",
            "engineering",
            "security",
            "growth",
            "skeptic",
        ],
        "status": "initialized",
    }


@app.post("/api/projects/{project_id}/debates", status_code=status.HTTP_202_ACCEPTED, tags=["Debates"])
async def trigger_debate(project_id: str, payload: DebateTriggerRequest):
    """Trigger a new structured 6-round multi-agent debate."""
    debate_id = "deb_01j8council_session"
    return {
        "debate_id": debate_id,
        "project_id": project_id,
        "topic": payload.topic,
        "status": "in_progress",
        "stream_url": f"/api/debates/{debate_id}/stream",
    }


async def mock_debate_stream_generator() -> AsyncGenerator[str, None]:
    """Generates SSE stream demonstrating the 6-round debate lifecycle."""
    events = [
        {
            "event": "round_start",
            "data": {"round": 1, "name": "Solo Stance", "active_agents": ["product", "growth", "security", "skeptic"]},
        },
        {
            "event": "agent_message",
            "data": {
                "agent": "product",
                "role_title": "Product Manager",
                "classification": "FACT",
                "content": "Repository analysis reveals onboarding currently requires 5 manual setup steps.",
                "evidence_ref": "docs/onboarding.md#L45",
            },
        },
        {
            "event": "agent_message",
            "data": {
                "agent": "growth",
                "role_title": "Growth Lead",
                "classification": "OPINION",
                "content": "Onboarding abandonment will be higher than 65% unless users reach a working workspace in under 60 seconds.",
                "evidence_ref": None,
            },
        },
        {
            "event": "agent_message",
            "data": {
                "agent": "security",
                "role_title": "Security Specialist",
                "classification": "INFERENCE",
                "content": "Bypassing email verification allows automated credential stuffing against our authentication endpoint.",
                "evidence_ref": "app/auth.py#L88",
            },
        },
        {
            "event": "agent_message",
            "data": {
                "agent": "skeptic",
                "role_title": "Skeptic / Red Team",
                "classification": "SCENARIO",
                "content": "If we launch today, we will burn early waitlist trust without collecting usable retention cohorts.",
                "evidence_ref": None,
            },
        },
        {
            "event": "outlook_updated",
            "data": {
                "technical_readiness": 82,
                "market_evidence": 48,
                "risk_index": "medium",
                "consensus": "Delay public launch until 1-click template onboarding is verified.",
            },
        },
        {
            "event": "debate_complete",
            "data": {
                "status": "completed",
                "tasks_proposed": [
                    {"title": "Implement 1-click template onboarding", "assigned": "engineering"},
                    {"title": "Add token bucket rate limiting on /api/auth", "assigned": "security"},
                ],
            },
        },
    ]

    for ev in events:
        yield f"event: {ev['event']}\ndata: {json.dumps(ev['data'])}\n\n"


@app.get("/api/debates/{debate_id}/stream", tags=["Debates"])
async def stream_debate(debate_id: str):
    """Server-Sent Events (SSE) live streaming endpoint for council room UI."""
    return StreamingResponse(
        mock_debate_stream_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )

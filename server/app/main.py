"""BotDigit AI Council - Backend Service Gateway.

Port: 41661
Canonical Ingress: https://api-council.botdigit.site
"""

import json
import asyncio
from contextlib import asynccontextmanager
from typing import AsyncGenerator, List, Optional
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import init_db, get_db
from app.models import Project, ProjectFact, Debate, DebateMessage, ProjectDecision, ProjectTask
from app.engine import build_council_debate, AGENTS


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize SQLite or PostgreSQL tables on startup
    await init_db()
    yield


app = FastAPI(
    title="BotDigit AI Council Engine",
    description="Multi-Agent Project Intelligence and Persistent Debate Engine",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permits local dev on 41660 and preview deployments
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic Schemas
class ProjectCreateRequest(BaseModel):
    name: str = Field(..., example="BotDigit Marketplace")
    slug: str = Field(..., example="botdigit-marketplace")
    client_name: Optional[str] = Field(default="Direct Client")
    description: Optional[str] = None
    github_repo_url: Optional[str] = None


class DebateTriggerRequest(BaseModel):
    topic: str = Field(..., example="Should we launch with current onboarding flow?")


class TaskToggleRequest(BaseModel):
    status: str = Field(..., example="approved")


# Routes
@app.get("/health", tags=["System"])
async def health_check():
    """Health probe for deployment orchestration and tunnel verification."""
    return {
        "status": "healthy",
        "service": "botdigit-ai-council-engine",
        "port": 41661,
        "database": "sqlite/postgresql",
        "available_agents": list(AGENTS.keys()),
    }


@app.get("/api/projects", tags=["Projects"])
async def list_projects(db: AsyncSession = Depends(get_db)):
    """List all managed projects with outlook summaries."""
    result = await db.execute(select(Project).order_by(Project.created_at.desc()))
    projects = result.scalars().all()

    # Seed default sample projects if clean database
    if not projects:
        sample = Project(
            name="BotDigit Marketplace",
            slug="botdigit-marketplace",
            client_name="BotDigit Labs",
            description="Autonomous multi-agent project intelligence & marketplace platform.",
            github_repo_url="https://github.com/botdigit/marketplace",
            outlook_snapshot={
                "technical_readiness": 82,
                "market_evidence": 54,
                "distribution_readiness": 42,
                "risk_index": "medium",
                "launch_verdict": "Conditional 72-Hour Hold",
            },
        )
        db.add(sample)
        await db.commit()
        await db.refresh(sample)
        projects = [sample]

    return [
        {
            "id": p.id,
            "name": p.name,
            "slug": p.slug,
            "client_name": p.client_name,
            "description": p.description,
            "github_repo_url": p.github_repo_url,
            "is_public": p.is_public,
            "outlook": p.outlook_snapshot or {},
            "created_at": p.created_at.isoformat() if p.created_at else None,
        }
        for p in projects
    ]


@app.post("/api/projects", status_code=status.HTTP_201_CREATED, tags=["Projects"])
async def create_project(payload: ProjectCreateRequest, db: AsyncSession = Depends(get_db)):
    """Register a new project for an agency or founder."""
    # Check if slug exists
    existing = await db.execute(select(Project).where(Project.slug == payload.slug))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="A project with this slug already exists.")

    project = Project(
        name=payload.name,
        slug=payload.slug,
        client_name=payload.client_name or "Direct Client",
        description=payload.description,
        github_repo_url=payload.github_repo_url,
        outlook_snapshot={
            "technical_readiness": 50,
            "market_evidence": 50,
            "distribution_readiness": 50,
            "risk_index": "unknown",
            "launch_verdict": "Awaiting Initial Council Review",
        },
    )
    db.add(project)
    await db.commit()
    await db.refresh(project)

    return {
        "id": project.id,
        "name": project.name,
        "slug": project.slug,
        "client_name": project.client_name,
        "github_repo_url": project.github_repo_url,
        "status": "ready",
    }


@app.get("/api/projects/{project_id}", tags=["Projects"])
async def get_project(project_id: str, db: AsyncSession = Depends(get_db)):
    """Get project details, recent debates, and action items."""
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")

    debates_res = await db.execute(
        select(Debate).where(Debate.project_id == project_id).order_by(Debate.created_at.desc()).limit(5)
    )
    debates = debates_res.scalars().all()

    tasks_res = await db.execute(
        select(ProjectTask).where(ProjectTask.project_id == project_id).order_by(ProjectTask.created_at.desc())
    )
    tasks = tasks_res.scalars().all()

    return {
        "id": project.id,
        "name": project.name,
        "slug": project.slug,
        "client_name": project.client_name,
        "description": project.description,
        "github_repo_url": project.github_repo_url,
        "is_public": project.is_public,
        "outlook": project.outlook_snapshot or {},
        "recent_debates": [
            {
                "id": d.id,
                "topic": d.topic,
                "consensus": d.consensus_summary,
                "created_at": d.created_at.isoformat() if d.created_at else None,
            }
            for d in debates
        ],
        "tasks": [
            {
                "id": t.id,
                "title": t.title,
                "assigned_agent": t.assigned_agent,
                "priority": t.priority,
                "status": t.status,
            }
            for t in tasks
        ],
    }


@app.post("/api/projects/{project_id}/debates", status_code=status.HTTP_202_ACCEPTED, tags=["Debates"])
async def trigger_debate(project_id: str, payload: DebateTriggerRequest, db: AsyncSession = Depends(get_db)):
    """Trigger a new structured 6-round multi-agent council debate."""
    proj_res = await db.execute(select(Project).where(Project.id == project_id))
    project = proj_res.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")

    # Build debate outcome using engine
    council_result = build_council_debate(payload.topic, project.name, project.github_repo_url or "")

    # Save debate
    debate = Debate(
        project_id=project.id,
        topic=payload.topic,
        status="completed",
        active_agents=["moderator", "product", "engineering", "security", "growth", "skeptic"],
        consensus_summary=council_result["outlook"]["consensus_summary"],
        outlook_scores=council_result["outlook"],
    )
    db.add(debate)
    await db.flush()

    # Save messages
    for r in council_result["rounds"]:
        for m in r["messages"]:
            msg = DebateMessage(
                debate_id=debate.id,
                round_number=r["round"],
                agent_role=m["agent"],
                agent_title=AGENTS[m["agent"]]["title"],
                classification=m["classification"],
                content=m["content"],
                evidence_ref=m.get("evidence_ref"),
                confidence=m.get("confidence", 0.85),
            )
            db.add(msg)

    # Save new tasks
    for t in council_result["tasks"]:
        task = ProjectTask(
            project_id=project.id,
            title=t["title"],
            assigned_agent=t["assigned"],
            priority=t.get("priority", "high"),
            status="proposed",
        )
        db.add(task)

    # Update project outlook snapshot
    project.outlook_snapshot = council_result["outlook"]

    await db.commit()
    await db.refresh(debate)

    return {
        "debate_id": debate.id,
        "project_id": project.id,
        "topic": debate.topic,
        "status": "completed",
        "outlook": council_result["outlook"],
        "stream_url": f"/api/debates/{debate.id}/stream",
    }


@app.get("/api/debates/{debate_id}/stream", tags=["Debates"])
async def stream_debate(debate_id: str, db: AsyncSession = Depends(get_db)):
    """Server-Sent Events (SSE) live streaming endpoint for the Council debate room."""
    # Fetch debate and messages
    d_res = await db.execute(select(Debate).where(Debate.id == debate_id))
    debate = d_res.scalar_one_or_none()
    if not debate:
        raise HTTPException(status_code=404, detail="Debate not found.")

    m_res = await db.execute(
        select(DebateMessage).where(DebateMessage.debate_id == debate_id).order_by(DebateMessage.created_at.asc())
    )
    messages = m_res.scalars().all()

    async def event_generator() -> AsyncGenerator[str, None]:
        yield f"event: debate_init\ndata: {json.dumps({'topic': debate.topic, 'agents': list(AGENTS.keys())})}\n\n"
        await asyncio.sleep(0.3)

        current_round = 0
        for m in messages:
            if m.round_number != current_round:
                current_round = m.round_number
                yield f"event: round_start\ndata: {json.dumps({'round': current_round})}\n\n"
                await asyncio.sleep(0.4)

            yield f"event: agent_message\ndata: {json.dumps({'agent': m.agent_role, 'title': m.agent_title, 'avatar': AGENTS[m.agent_role]['avatar'], 'color': AGENTS[m.agent_role]['color'], 'classification': m.classification, 'content': m.content, 'evidence_ref': m.evidence_ref, 'confidence': float(m.confidence or 0.85)})}\n\n"
            await asyncio.sleep(0.5)

        yield f"event: outlook_summary\ndata: {json.dumps(debate.outlook_scores or {})}\n\n"
        yield f"event: debate_done\ndata: {json.dumps({'status': 'finished'})}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


@app.post("/api/tasks/{task_id}/toggle", tags=["Tasks"])
async def toggle_task(task_id: str, payload: TaskToggleRequest, db: AsyncSession = Depends(get_db)):
    """Update task approval or completion status."""
    res = await db.execute(select(ProjectTask).where(ProjectTask.id == task_id))
    task = res.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found.")

    task.status = payload.status
    await db.commit()
    return {"id": task.id, "status": task.status}


@app.post("/api/projects/{project_id}/public-toggle", tags=["Projects"])
async def toggle_public_project(project_id: str, db: AsyncSession = Depends(get_db)):
    """Toggle between private workspace and public SEO snapshot."""
    res = await db.execute(select(Project).where(Project.id == project_id))
    project = res.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")

    project.is_public = not project.is_public
    await db.commit()
    return {"id": project.id, "is_public": project.is_public}

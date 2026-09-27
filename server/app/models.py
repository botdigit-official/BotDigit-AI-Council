"""SQLAlchemy models for Projects, Facts, Debates, Messages, Decisions, and Tasks."""

import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    String,
    Text,
    Boolean,
    Integer,
    Numeric,
    DateTime,
    ForeignKey,
    JSON,
)
from sqlalchemy.orm import relationship
from app.database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class Project(Base):
    __tablename__ = "projects"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    slug = Column(String(100), unique=True, nullable=False, index=True)
    client_name = Column(String(255), default="Direct Client")
    description = Column(Text, nullable=True)
    github_repo_url = Column(Text, nullable=True)
    is_public = Column(Boolean, default=False)
    outlook_snapshot = Column(JSON, default=dict)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    # Relationships
    facts = relationship("ProjectFact", back_populates="project", cascade="all, delete-orphan")
    debates = relationship("Debate", back_populates="project", cascade="all, delete-orphan")
    decisions = relationship("ProjectDecision", back_populates="project", cascade="all, delete-orphan")
    tasks = relationship("ProjectTask", back_populates="project", cascade="all, delete-orphan")


class ProjectFact(Base):
    __tablename__ = "project_facts"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    fact_statement = Column(Text, nullable=False)
    source_ref = Column(String(255), nullable=True)
    status = Column(String(50), default="verified")  # verified, disputed, stale
    created_at = Column(DateTime(timezone=True), default=utc_now)

    project = relationship("Project", back_populates="facts")


class Debate(Base):
    __tablename__ = "debates"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    topic = Column(Text, nullable=False)
    status = Column(String(50), default="completed")  # in_progress, completed
    active_agents = Column(JSON, default=list)
    consensus_summary = Column(Text, nullable=True)
    outlook_scores = Column(JSON, default=dict)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    project = relationship("Project", back_populates="debates")
    messages = relationship("DebateMessage", back_populates="debate", cascade="all, delete-orphan")


class DebateMessage(Base):
    __tablename__ = "debate_messages"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    debate_id = Column(String(36), ForeignKey("debates.id", ondelete="CASCADE"), nullable=False)
    round_number = Column(Integer, nullable=False)
    agent_role = Column(String(50), nullable=False)
    agent_title = Column(String(100), nullable=False)
    classification = Column(String(50), nullable=False)  # FACT, INFERENCE, OPINION, SCENARIO
    content = Column(Text, nullable=False)
    evidence_ref = Column(String(255), nullable=True)
    confidence = Column(Numeric(3, 2), default=0.85)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    debate = relationship("Debate", back_populates="messages")


class ProjectDecision(Base):
    __tablename__ = "project_decisions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    topic = Column(Text, nullable=False)
    decision_summary = Column(Text, nullable=False)
    tradeoffs_accepted = Column(JSON, default=list)
    underlying_assumptions = Column(JSON, default=dict)
    status = Column(String(50), default="active")  # active, reopened, superseded
    created_at = Column(DateTime(timezone=True), default=utc_now)

    project = relationship("Project", back_populates="decisions")


class ProjectTask(Base):
    __tablename__ = "project_tasks"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    assigned_agent = Column(String(50), default="engineering")
    priority = Column(String(20), default="high")  # low, medium, high, critical
    status = Column(String(50), default="proposed")  # proposed, approved, done
    created_at = Column(DateTime(timezone=True), default=utc_now)

    project = relationship("Project", back_populates="tasks")

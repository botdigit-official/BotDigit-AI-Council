"""SQLAlchemy models for Projects, Facts, Debates, Messages, Decisions, Tasks, Questions, and Custom Agents."""

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
    workspace_id = Column(String(100), default="ws_botdigit_labs")
    workspace_name = Column(String(255), default="BotDigit Labs")
    project_type = Column(String(50), default="web_saas")  # web_saas, mobile_app, open_source, startup, research, internal, web3, other
    description = Column(Text, nullable=True)

    # Domains & Verification
    primary_domain = Column(String(255), nullable=True)
    domain_verified = Column(Boolean, default=False)
    domain_verification_method = Column(String(50), default="dns_txt")  # dns_txt, meta_tag, html_file
    domain_verification_token = Column(String(100), default=lambda: f"botdigit-verify-{uuid.uuid4().hex[:12]}")
    staging_url = Column(String(255), nullable=True)
    docs_url = Column(String(255), nullable=True)
    app_url = Column(String(255), nullable=True)

    # Real GitHub Connection
    github_repo_url = Column(Text, nullable=True)
    github_installation_id = Column(String(100), nullable=True)
    github_repo_id = Column(String(100), nullable=True)
    github_repo_full_name = Column(String(255), nullable=True)
    github_default_branch = Column(String(50), default="main")
    github_connected = Column(Boolean, default=False)
    github_last_sync_at = Column(DateTime(timezone=True), nullable=True)
    github_stats = Column(JSON, default=dict)  # {"commits": 184, "files": 327, "issues": 42, "prs": 18}

    # Public / Private Airgap
    is_public = Column(Boolean, default=False)

    # Health & Outlook
    health_scores = Column(JSON, default=lambda: {
        "engineering": 78,
        "security": 91,
        "product": 64,
        "growth": 42,
        "seo": 71
    })
    outlook_snapshot = Column(JSON, default=dict)

    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    # Relationships
    facts = relationship("ProjectFact", back_populates="project", cascade="all, delete-orphan")
    debates = relationship("Debate", back_populates="project", cascade="all, delete-orphan")
    decisions = relationship("ProjectDecision", back_populates="project", cascade="all, delete-orphan")
    tasks = relationship("ProjectTask", back_populates="project", cascade="all, delete-orphan")
    unresolved_questions = relationship("UnresolvedQuestion", back_populates="project", cascade="all, delete-orphan")
    custom_agents = relationship("CustomAgent", back_populates="project", cascade="all, delete-orphan")


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
    session_number = Column(Integer, default=1)
    topic = Column(Text, nullable=False)
    status = Column(String(50), default="completed")  # draft, live, completed, failed
    active_agents = Column(JSON, default=list)
    consensus_summary = Column(Text, nullable=True)
    outlook_scores = Column(JSON, default=dict)
    disagreements = Column(JSON, default=list)

    # Public / Private Sanitized Publication
    is_published = Column(Boolean, default=False)
    published_at = Column(DateTime(timezone=True), nullable=True)
    sanitized_sections = Column(JSON, default=lambda: {
        "question": True,
        "summary": True,
        "perspectives": True,
        "disagreements": True,
        "decision": True,
        "action_plan": True,
        "source_code": False,
        "private_evidence": False,
        "internal_docs": False
    })

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

    # Clickable Evidence & Verified Confidence
    evidence_ref = Column(String(255), nullable=True)
    evidence_source = Column(String(50), default="github")  # github, domain, database, analytics, internal_doc
    evidence_strength = Column(String(20), default="HIGH")  # HIGH, MODERATE, LOW
    evidence_snippet = Column(Text, nullable=True)

    # Real Model / Provider Attribution
    provider = Column(String(50), default="Anthropic")
    model = Column(String(100), default="Claude 3.5 Sonnet")
    tokens_in = Column(Integer, default=1240)
    tokens_out = Column(Integer, default=320)
    cost = Column(String(20), default="$0.004")

    confidence = Column(Numeric(3, 2), default=0.92)
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
    review_condition = Column(String(255), default="After 25 onboarding sessions or under heavy load")
    status = Column(String(50), default="active")  # active, waiting_for_evidence, reopened, superseded
    evidence_sources_count = Column(Integer, default=4)
    participating_agents = Column(JSON, default=list)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    project = relationship("Project", back_populates="decisions")


class ProjectTask(Base):
    __tablename__ = "project_tasks"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    assigned_agent = Column(String(50), default="engineering")
    priority = Column(String(20), default="high")  # low, medium, high, critical
    status = Column(String(50), default="proposed")  # proposed, approved, pushed_to_github, done
    github_issue_url = Column(String(255), nullable=True)
    github_issue_number = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    project = relationship("Project", back_populates="tasks")


class UnresolvedQuestion(Base):
    __tablename__ = "unresolved_questions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    debate_id = Column(String(36), nullable=True)
    question = Column(Text, nullable=False)
    severity = Column(String(20), default="high")  # critical, high, medium, low
    status = Column(String(50), default="open")  # open, investigating, resolved
    context_summary = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    project = relationship("Project", back_populates="unresolved_questions")


class CustomAgent(Base):
    __tablename__ = "custom_agents"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(100), nullable=False)
    role = Column(String(100), nullable=False)
    instructions = Column(Text, nullable=False)
    tools = Column(JSON, default=list)  # ["web", "project_memory", "documents", "github"]
    model = Column(String(50), default="Claude 3.5 Sonnet")
    visibility = Column(String(50), default="private")
    avatar = Column(String(20), default="🤖")
    color = Column(String(50), default="indigo")
    created_at = Column(DateTime(timezone=True), default=utc_now)

    project = relationship("Project", back_populates="custom_agents")


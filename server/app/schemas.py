"""Pydantic schemas and LangGraph state types for BotDigit AI Council.

Strictly defines the 4-tier statement classification:
- FACT: Verifiable reality cited from code, database, or analytics
- INFERENCE: Logical deduction derived from facts
- OPINION: Strategic, architectural, or design judgment
- SCENARIO: Probabilistic simulation of edge cases
"""

from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field


StatementClassification = Literal["FACT", "INFERENCE", "OPINION", "SCENARIO"]
AgentRole = Literal[
    "moderator",
    "product",
    "engineering",
    "architect",
    "security",
    "qa",
    "ux",
    "growth",
    "seo",
    "finance",
    "competitor",
    "skeptic",
]


class StatementPayload(BaseModel):
    statement: str
    classification: StatementClassification
    evidence_ref: Optional[str] = Field(
        None, description="Specific line link or document pointer (e.g. app/auth.py#L42)"
    )
    confidence: float = Field(0.85, ge=0.0, le=1.0)


class AgentMessageSchema(BaseModel):
    agent: AgentRole
    role_title: str
    avatar: str
    color: str
    round_number: int
    classification: StatementClassification
    content: str
    evidence_ref: Optional[str] = None
    claims: List[str] = Field(default_factory=list)
    confidence: float = 0.85
    responds_to: Optional[str] = None


class AssumptionSchema(BaseModel):
    id: Optional[str] = None
    statement: str
    metric_target: Optional[Dict[str, Any]] = None
    current_metric_value: Optional[Dict[str, Any]] = None
    status: Literal["active", "validated", "breached", "expired"] = "active"


class DecisionSchema(BaseModel):
    id: Optional[str] = None
    topic: str
    decision_summary: str
    tradeoffs_accepted: List[str] = Field(default_factory=list)
    underlying_assumptions: List[AssumptionSchema] = Field(default_factory=list)
    evidence_chunk_ids: List[str] = Field(default_factory=list)
    status: Literal["active", "reopened", "superseded"] = "active"


class ProjectRiskSchema(BaseModel):
    id: Optional[str] = None
    risk_statement: str
    severity: Literal["low", "medium", "high", "critical"] = "medium"
    mitigation_strategy: Optional[str] = None
    status: Literal["open", "mitigated", "accepted"] = "open"


class ProjectOutlookSchema(BaseModel):
    technical_readiness: int = Field(..., ge=0, le=100)
    market_evidence: int = Field(..., ge=0, le=100)
    distribution_readiness: int = Field(..., ge=0, le=100)
    risk_index: Literal["low", "medium", "high", "critical"]
    launch_verdict: str
    consensus_summary: str
    what_agents_agree_on: List[str] = Field(default_factory=list)
    critical_disagreements: List[str] = Field(default_factory=list)
    conditions_required_for_success: List[str] = Field(default_factory=list)
    failure_scenarios: List[str] = Field(default_factory=list)


class CouncilDebateState(BaseModel):
    """LangGraph State Container for cyclical council execution."""
    project_id: str
    project_name: str
    github_repo_url: Optional[str] = None
    user_topic: str
    active_agents: List[AgentRole] = Field(default_factory=list)
    current_round: int = 1
    # Retrospective memory from Project Intelligence Graph
    active_assumptions: List[AssumptionSchema] = Field(default_factory=list)
    past_related_decisions: List[DecisionSchema] = Field(default_factory=list)
    known_risks: List[ProjectRiskSchema] = Field(default_factory=list)
    # Debate accumulation
    messages: List[AgentMessageSchema] = Field(default_factory=list)
    outlook: Optional[ProjectOutlookSchema] = None
    action_tasks: List[Dict[str, Any]] = Field(default_factory=list)

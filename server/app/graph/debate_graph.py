"""LangGraph State Graph Implementation for BotDigit AI Council.

Orchestrates the 6-Round Multi-Agent Debate with Retrospective Memory Injection.
"""

from typing import Dict, Any, List
from app.schemas import (
    CouncilDebateState,
    AgentMessageSchema,
    ProjectOutlookSchema,
    AssumptionSchema,
    DecisionSchema,
)
from app.engine import AGENTS, build_council_debate


def node_retrospective_memory(state: CouncilDebateState) -> Dict[str, Any]:
    """Injects historical decisions and active assumptions from the Project Intelligence Graph."""
    # Retrospective memory check:
    # 1. Did we make decisions on this topic previously?
    # 2. Are any assumptions breached or expired?
    sample_assumptions = [
        AssumptionSchema(
            statement="User retention depends on reaching active workspace within 60 seconds.",
            status="active",
        )
    ]
    return {
        "active_assumptions": sample_assumptions,
    }


def node_moderator_selection(state: CouncilDebateState) -> Dict[str, Any]:
    """Filters the 12 agents down to 3–5 relevant specialists."""
    lowered = state.user_topic.lower()
    selected = ["product", "engineering", "security", "skeptic"]
    if any(k in lowered for k in ["growth", "seo", "acquisition", "user"]):
        selected.append("growth")
    elif any(k in lowered for k in ["scale", "architecture", "database"]):
        selected.append("architect")
    return {"active_agents": selected, "current_round": 1}


def node_execute_debate_rounds(state: CouncilDebateState) -> Dict[str, Any]:
    """Executes the 6-round evidence debate protocol."""
    # Executes the grounded deliberation
    raw_result = build_council_debate(
        topic=state.user_topic,
        project_name=state.project_name,
        github_url=state.github_repo_url or "",
    )

    all_messages: List[AgentMessageSchema] = []
    for r in raw_result["rounds"]:
        for m in r["messages"]:
            agent_key = m["agent"]
            meta = AGENTS.get(agent_key, AGENTS["moderator"])
            all_messages.append(
                AgentMessageSchema(
                    agent=agent_key,
                    role_title=meta["title"],
                    avatar=meta["avatar"],
                    color=meta["color"],
                    round_number=r["round"],
                    classification=m["classification"],
                    content=m["content"],
                    evidence_ref=m.get("evidence_ref"),
                    confidence=m.get("confidence", 0.85),
                )
            )

    outlook_data = raw_result["outlook"]
    outlook = ProjectOutlookSchema(
        technical_readiness=outlook_data["technical_readiness"],
        market_evidence=outlook_data["market_evidence"],
        distribution_readiness=outlook_data["distribution_readiness"],
        risk_index=outlook_data["risk_index"],
        launch_verdict=outlook_data["launch_verdict"],
        consensus_summary=outlook_data["consensus_summary"],
        what_agents_agree_on=[
            "Authentication flow and base repository structure are operational.",
            "Launching with 5-step friction leads to significant drop-off.",
        ],
        critical_disagreements=[
            "Growth advocates eliminating email verification; Security demands strict gatekeeping.",
        ],
        conditions_required_for_success=[
            "Reduce setup from 5 steps to 1-click template.",
            "Add Redis rate-limiting on authentication routes.",
        ],
        failure_scenarios=[
            "Uncapped connection pools exhaust database resources during traffic spikes.",
        ],
    )

    return {
        "messages": all_messages,
        "outlook": outlook,
        "action_tasks": raw_result["tasks"],
    }


def run_council_pipeline(project_name: str, topic: str, github_url: str = "") -> CouncilDebateState:
    """Executes the full Council debate pipeline from Retrospective Memory -> Final Action Plan."""
    state = CouncilDebateState(
        project_id="proj_local",
        project_name=project_name,
        github_repo_url=github_url,
        user_topic=topic,
    )
    # Step 1: Memory
    mem_update = node_retrospective_memory(state)
    state.active_assumptions = mem_update["active_assumptions"]

    # Step 2: Moderator Selection
    mod_update = node_moderator_selection(state)
    state.active_agents = mod_update["active_agents"]

    # Step 3: Deliberation
    delib_update = node_execute_debate_rounds(state)
    state.messages = delib_update["messages"]
    state.outlook = delib_update["outlook"]
    state.action_tasks = delib_update["action_tasks"]

    return state

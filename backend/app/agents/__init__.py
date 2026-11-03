from .idea_agent import IdeaAgent
from .master_agent import MasterAgent
from .profile_agent import ProfileAgent
from .proposal_agent import ProposalAgent

AGENT_REGISTRY = {
    "master_agent": MasterAgent,
    "user_profile": ProfileAgent,
    "project_idea": IdeaAgent,
    "proposal": ProposalAgent,
}

__all__ = ["AGENT_REGISTRY", "IdeaAgent", "MasterAgent", "ProfileAgent", "ProposalAgent"]

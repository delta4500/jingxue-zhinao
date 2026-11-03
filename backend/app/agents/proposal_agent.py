from ..prompts import PROPOSAL_AGENT_SYSTEM_PROMPT
from ..schemas.common import NextAction
from ..schemas.proposal import ProposalDocument
from .base_agent import BaseAgent


class ProposalAgent(BaseAgent):
    agent_type = "proposal"
    system_prompt = PROPOSAL_AGENT_SYSTEM_PROMPT
    result_schema = ProposalDocument

    def next_action(self) -> NextAction:
        return NextAction(
            type="review_proposal",
            label="检查并修改计划书",
            targetAgent="proposal",
            requiredData=["documentId"],
        )

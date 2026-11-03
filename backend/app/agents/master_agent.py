from ..prompts import MASTER_AGENT_SYSTEM_PROMPT
from ..schemas.common import NextAction
from .base_agent import BaseAgent


class MasterAgent(BaseAgent):
    agent_type = "master_agent"
    system_prompt = MASTER_AGENT_SYSTEM_PROMPT
    result_schema = None

    def next_action(self) -> NextAction:
        return NextAction(
            type="continue_workflow",
            label="继续当前流程",
            targetAgent="master_agent",
            requiredData=["workflowState"],
        )

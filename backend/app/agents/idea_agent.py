from ..prompts import IDEA_AGENT_SYSTEM_PROMPT
from ..schemas.common import NextAction
from ..schemas.project_idea import ProjectIdeasResult
from .base_agent import BaseAgent


class IdeaAgent(BaseAgent):
    agent_type = "project_idea"
    system_prompt = IDEA_AGENT_SYSTEM_PROMPT
    result_schema = ProjectIdeasResult

    def next_action(self) -> NextAction:
        return NextAction(
            type="select_project_idea",
            label="选择项目方案",
            targetAgent="master_agent",
            requiredData=["selectedIdeaId"],
        )

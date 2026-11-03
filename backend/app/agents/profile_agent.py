from ..prompts import PROFILE_AGENT_SYSTEM_PROMPT
from ..schemas.common import NextAction
from ..schemas.profile import UserProfile
from .base_agent import BaseAgent


class ProfileAgent(BaseAgent):
    agent_type = "user_profile"
    system_prompt = PROFILE_AGENT_SYSTEM_PROMPT
    result_schema = UserProfile

    def next_action(self) -> NextAction:
        return NextAction(
            type="generate_project_ideas",
            label="生成项目创意",
            targetAgent="project_idea",
            requiredData=["profile"],
        )

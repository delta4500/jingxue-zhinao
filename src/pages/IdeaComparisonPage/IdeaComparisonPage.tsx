import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/common/PageHeader";
import { IdeaCard } from "../../components/project/IdeaCard";
import { WorkflowTimeline } from "../../components/workflow/WorkflowTimeline";
import { useWorkflowStore } from "../../stores/workflowStore";

export function IdeaComparisonPage() {
  const navigate = useNavigate();
  const { user, ideas, workflow, hydrateDemo, runProfileAndIdeas, selectIdea } = useWorkflowStore();

  useEffect(() => {
    hydrateDemo();
    if (!ideas.length) runProfileAndIdeas();
  }, [hydrateDemo, ideas.length, runProfileAndIdeas]);

  const handleSelect = (ideaId: string) => {
    selectIdea(ideaId);
    navigate("/app/projects");
  };

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Project Ideas"
        title="项目创意方案比较"
        description={`基于 ${user?.major ?? "用户"}、团队资源、比赛要求和预算，生成可比较、可确认的项目方案。`}
      />

      <WorkflowTimeline workflow={workflow} />

      <section className="grid gap-5 lg:grid-cols-3">
        {ideas.map((idea) => (
          <IdeaCard
            key={idea.ideaId}
            idea={idea}
            selected={workflow.selectedIdeaId === idea.ideaId}
            onSelect={handleSelect}
          />
        ))}
      </section>
    </div>
  );
}

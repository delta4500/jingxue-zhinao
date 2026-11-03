import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { PageHeader } from "../../components/common/PageHeader";
import { StatusBadge } from "../../components/common/StatusBadge";
import { demoUserInput } from "../../data/demo/workflow";
import { useWorkflowStore } from "../../stores/workflowStore";
import type { UserInput } from "../../types/workflow";
import { cn } from "../../utils/cn";

const steps = ["个人与团队", "比赛信息", "项目偏好", "确认提交"];

function splitTags(value: string) {
  return value
    .split(/[,，、\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function CreateProjectPage() {
  const navigate = useNavigate();
  const { submitUserInfo, runProfileAndIdeas } = useWorkflowStore();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    ...demoUserInput,
    skillsText: demoUserInput.skills.join("、"),
    hardwareText: demoUserInput.hardwareResources.join("、"),
    softwareText: demoUserInput.softwareResources.join("、"),
    interestsText: demoUserInput.interests.join("、"),
    goalsText: demoUserInput.goals.join("、"),
    requirementsText: demoUserInput.selectedCompetition.requirements.join("、"),
    materialsText: demoUserInput.selectedCompetition.materials.join("、"),
    scenariosText: demoUserInput.projectPreference.scenarios.join("、"),
  });

  const update = (key: string, value: string | number) => setForm((current) => ({ ...current, [key]: value }));

  const submit = () => {
    const user: UserInput = {
      userId: form.userId,
      name: form.name,
      major: form.major,
      grade: form.grade,
      school: form.school,
      skills: splitTags(form.skillsText),
      competitionExperience: form.competitionExperience,
      teamSize: Number(form.teamSize),
      weeklyAvailableHours: Number(form.weeklyAvailableHours),
      budget: Number(form.budget),
      hardwareResources: splitTags(form.hardwareText),
      softwareResources: splitTags(form.softwareText),
      interests: splitTags(form.interestsText),
      goals: splitTags(form.goalsText),
      selectedCompetition: {
        name: form.selectedCompetition.name,
        track: form.selectedCompetition.track,
        requirements: splitTags(form.requirementsText),
        materials: splitTags(form.materialsText),
      },
      projectPreference: {
        scenarios: splitTags(form.scenariosText),
        difficulty: form.projectPreference.difficulty,
        additionalRequirements: form.projectPreference.additionalRequirements,
      },
    };
    submitUserInfo(user);
    runProfileAndIdeas();
    navigate("/app/ideas");
  };

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Create Project"
        title="创建竞赛项目"
        description="只填写一次个人、团队和比赛条件，后续 Agent 将自动继承这些结构化上下文。"
      />

      <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-xl border border-line bg-white p-4">
          <div className="space-y-2">
            {steps.map((label, index) => (
              <button
                key={label}
                type="button"
                onClick={() => setStep(index)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-left text-sm transition-colors",
                  step === index
                    ? "border-brand-200 bg-brand-50 text-brand-700"
                    : "border-transparent text-ink-500 hover:bg-surface-50 hover:text-ink-900",
                )}
              >
                <span className="grid size-6 place-items-center rounded-md border border-line bg-white text-xs">
                  {index < step ? <Check className="size-3" /> : index + 1}
                </span>
                {label}
              </button>
            ))}
          </div>
        </aside>

        <section className="rounded-xl border border-line bg-white p-5 sm:p-6">
          <div className="mb-6 flex items-center justify-between gap-3 border-b border-line pb-4">
            <div>
              <h2 className="font-display text-2xl font-semibold text-ink-950">{steps[step]}</h2>
              <p className="mt-1 text-sm text-ink-500">所有字段会进入统一 User 对象。</p>
            </div>
            <StatusBadge tone="brand">演示数据可编辑</StatusBadge>
          </div>

          {step === 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="姓名" value={form.name} onChange={(value) => update("name", value)} />
              <Field label="学校" value={form.school} onChange={(value) => update("school", value)} />
              <Field label="专业" value={form.major} onChange={(value) => update("major", value)} />
              <Field label="年级" value={form.grade} onChange={(value) => update("grade", value)} />
              <Field label="团队人数" type="number" value={form.teamSize} onChange={(value) => update("teamSize", Number(value))} />
              <Field label="每周可投入小时" type="number" value={form.weeklyAvailableHours} onChange={(value) => update("weeklyAvailableHours", Number(value))} />
              <Field label="项目预算" type="number" value={form.budget} onChange={(value) => update("budget", Number(value))} />
              <Field label="已掌握技能" value={form.skillsText} onChange={(value) => update("skillsText", value)} />
              <Field label="硬件资源" value={form.hardwareText} onChange={(value) => update("hardwareText", value)} />
              <Field label="软件资源" value={form.softwareText} onChange={(value) => update("softwareText", value)} />
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="目标比赛" value={form.selectedCompetition.name} onChange={(value) => setForm((current) => ({ ...current, selectedCompetition: { ...current.selectedCompetition, name: value } }))} />
              <Field label="目标赛道" value={form.selectedCompetition.track} onChange={(value) => setForm((current) => ({ ...current, selectedCompetition: { ...current.selectedCompetition, track: value } }))} />
              <Field label="比赛要求" value={form.requirementsText} onChange={(value) => update("requirementsText", value)} textarea />
              <Field label="提交材料" value={form.materialsText} onChange={(value) => update("materialsText", value)} textarea />
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="兴趣方向" value={form.interestsText} onChange={(value) => update("interestsText", value)} />
              <Field label="项目目标" value={form.goalsText} onChange={(value) => update("goalsText", value)} />
              <Field label="应用场景偏好" value={form.scenariosText} onChange={(value) => update("scenariosText", value)} />
              <label className="block">
                <span className="text-sm font-medium text-ink-800">希望项目难度</span>
                <select
                  value={form.projectPreference.difficulty}
                  onChange={(event) => setForm((current) => ({ ...current, projectPreference: { ...current.projectPreference, difficulty: event.target.value as UserInput["projectPreference"]["difficulty"] } }))}
                  className="mt-2 h-10 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink-900"
                >
                  <option value="low">低难度</option>
                  <option value="medium">中等难度</option>
                  <option value="high">高难度</option>
                </select>
              </label>
              <Field label="补充要求" value={form.projectPreference.additionalRequirements} onChange={(value) => setForm((current) => ({ ...current, projectPreference: { ...current.projectPreference, additionalRequirements: value } }))} textarea className="md:col-span-2" />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="rounded-xl border border-line bg-surface-50 p-5">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-lg border border-brand-100 bg-brand-50 text-brand-700">
                    <Sparkles className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-ink-950">即将运行第一条核心闭环</h3>
                    <p className="mt-1 text-sm text-ink-500">用户画像 Agent → 项目创意 Agent → 主控 Agent 等待方案选择。</p>
                  </div>
                </div>
              </div>
              <Summary label="用户" value={`${form.major} · ${form.grade} · ${form.teamSize} 人团队 · 预算 ${form.budget} 元`} />
              <Summary label="比赛" value={`${form.selectedCompetition.name} / ${form.selectedCompetition.track}`} />
              <Summary label="资源" value={`${form.skillsText}；${form.hardwareText}；${form.softwareText}`} />
            </div>
          )}

          <div className="mt-7 flex justify-between border-t border-line pt-5">
            <button
              type="button"
              disabled={step === 0}
              onClick={() => setStep((current) => Math.max(0, current - 1))}
              className="h-10 rounded-lg border border-line bg-white px-4 text-sm font-medium text-ink-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              上一步
            </button>
            {step < steps.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep((current) => current + 1)}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-600 px-4 text-sm font-medium text-white hover:bg-brand-700"
              >
                下一步
                <ArrowRight className="size-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-600 px-4 text-sm font-medium text-white hover:bg-brand-700"
              >
                开始分析并生成方案
                <ArrowRight className="size-4" />
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  textarea = false,
  className,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  textarea?: boolean;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="text-sm font-medium text-ink-800">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={4}
          className="mt-2 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm leading-6 text-ink-900"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="mt-2 h-10 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink-900"
        />
      )}
    </label>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-white p-4">
      <p className="text-xs font-medium text-ink-400">{label}</p>
      <p className="mt-1 text-sm leading-6 text-ink-800">{value}</p>
    </div>
  );
}

import { RotateCcw, Server } from "lucide-react";
import { PageHeader } from "../../components/common/PageHeader";
import { StatusBadge } from "../../components/common/StatusBadge";
import { useWorkflowStore } from "../../stores/workflowStore";

export function SettingsPage() {
  const { resetWorkflow } = useWorkflowStore();

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Settings"
        title="个人设置与运行模式"
        description="第一版默认使用演示数据和本地工作流，后续可切换到后端 API 与真实模型。"
      />
      <section className="grid gap-5 lg:grid-cols-2">
        <article className="rounded-xl border border-line bg-white p-6">
          <Server className="size-5 text-brand-600" />
          <h2 className="mt-4 font-display text-xl font-semibold text-ink-950">后端服务</h2>
          <p className="mt-2 text-sm leading-6 text-ink-500">
            本项目已包含 Node 后端骨架，端口默认 4174，提供 profile、ideas、projects、proposals、workflow 和 agent-tasks 接口。
          </p>
          <div className="mt-4">
            <StatusBadge tone="warning">本地骨架模式</StatusBadge>
          </div>
        </article>
        <article className="rounded-xl border border-line bg-white p-6">
          <RotateCcw className="size-5 text-brand-600" />
          <h2 className="mt-4 font-display text-xl font-semibold text-ink-950">重置演示流程</h2>
          <p className="mt-2 text-sm leading-6 text-ink-500">清空前端 localStorage 中的画像、方案、项目和计划书状态。</p>
          <button
            type="button"
            onClick={resetWorkflow}
            className="mt-5 h-10 rounded-lg border border-line bg-white px-4 text-sm font-medium text-ink-700 hover:bg-surface-50"
          >
            重置工作流
          </button>
        </article>
      </section>
    </div>
  );
}

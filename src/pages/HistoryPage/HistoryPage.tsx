import { useEffect, useMemo, useState } from "react";
import { Clock3, RefreshCw } from "lucide-react";
import { PageHeader } from "../../components/common/PageHeader";
import { StatusBadge } from "../../components/common/StatusBadge";
import { listTasks, retryTask } from "../../services/taskApi";
import type { BackendAgentTask, TaskFilters } from "../../types/task";

const agentOptions = [
  ["", "全部 Agent"],
  ["master_agent", "主控 Agent"],
  ["user_profile", "用户画像 Agent"],
  ["project_idea", "项目创意 Agent"],
  ["proposal", "计划书 Agent"],
];

const statusOptions = [
  ["", "全部状态"],
  ["completed", "completed"],
  ["failed", "failed"],
  ["needs_input", "needs_input"],
  ["pending", "pending"],
];

export function HistoryPage() {
  const [tasks, setTasks] = useState<BackendAgentTask[]>([]);
  const [selected, setSelected] = useState<BackendAgentTask | null>(null);
  const [filters, setFilters] = useState<TaskFilters>({ page: 1, pageSize: 30 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const traceChain = useMemo(
    () => (selected ? tasks.filter((task) => task.traceId === selected.traceId) : []),
    [selected, tasks],
  );

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await listTasks(filters);
      setTasks(data.items);
      setSelected((current) => current ?? data.items[0] ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "无法加载历史任务");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [filters.agentType, filters.status, filters.traceId, filters.projectId]);

  async function handleRetry(task: BackendAgentTask) {
    await retryTask(task.taskId);
    await load();
  }

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Agent Tasks"
        title="历史任务与成果"
        description="任务数据来自 FastAPI 后端 /api/v1/tasks，支持按 Agent、状态、traceId 和项目筛选。"
        actions={
          <button
            type="button"
            onClick={load}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-line bg-white px-4 text-sm font-medium text-ink-700 hover:bg-surface-50"
          >
            <RefreshCw className="size-4" />
            刷新
          </button>
        }
      />

      <section className="rounded-xl border border-line bg-white p-4">
        <div className="grid gap-3 md:grid-cols-4">
          <Select value={filters.agentType ?? ""} options={agentOptions} onChange={(value) => setFilters((current) => ({ ...current, agentType: value || undefined }))} />
          <Select value={filters.status ?? ""} options={statusOptions} onChange={(value) => setFilters((current) => ({ ...current, status: value || undefined }))} />
          <input
            value={filters.traceId ?? ""}
            onChange={(event) => setFilters((current) => ({ ...current, traceId: event.target.value || undefined }))}
            placeholder="traceId"
            className="h-10 rounded-lg border border-line bg-white px-3 text-sm text-ink-800"
          />
          <input
            value={filters.projectId ?? ""}
            onChange={(event) => setFilters((current) => ({ ...current, projectId: event.target.value || undefined }))}
            placeholder="projectId"
            className="h-10 rounded-lg border border-line bg-white px-3 text-sm text-ink-800"
          />
        </div>
      </section>

      {error && (
        <div className="rounded-xl border border-danger-200 bg-danger-50 p-4 text-sm text-danger-700">
          {error}。请确认后端已运行：<span className="font-mono">cd backend && python run.py</span>
        </div>
      )}

      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <article className="rounded-xl border border-line bg-white">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <div>
              <h2 className="font-display text-xl font-semibold text-ink-950">任务记录</h2>
              <p className="mt-1 text-sm text-ink-500">{loading ? "正在读取后端任务..." : `共 ${tasks.length} 条`}</p>
            </div>
            <StatusBadge tone="brand">API 数据</StatusBadge>
          </div>
          <div className="divide-y divide-line">
            {tasks.map((task) => (
              <button
                key={task.taskId}
                type="button"
                onClick={() => setSelected(task)}
                className="grid w-full gap-4 px-5 py-4 text-left transition-colors hover:bg-surface-50 md:grid-cols-[1fr_100px_120px_90px] md:items-center"
              >
                <div className="flex gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-line bg-surface-50 text-brand-700">
                    <Clock3 className="size-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-ink-950">{task.agentName || task.agentType}</h3>
                    <p className="mt-1 text-xs text-ink-500">
                      {task.taskId} · {task.traceId} · {task.createdAt ? new Date(task.createdAt).toLocaleString() : "-"}
                    </p>
                    <p className="mt-1 text-xs text-ink-400">
                      {task.provider || "mock"} / {task.model || "-"} / {task.mode}
                    </p>
                  </div>
                </div>
                <StatusBadge tone={task.mode === "live" ? "teal" : "neutral"}>{task.mode}</StatusBadge>
                <StatusBadge tone={task.status === "failed" ? "danger" : "success"}>{task.status}</StatusBadge>
                <p className="text-sm text-ink-500">{task.latencyMs} ms</p>
              </button>
            ))}
            {!tasks.length && !loading && (
              <div className="p-10 text-center text-sm text-ink-500">暂无后端任务记录。请先通过后端 Agent API 生成一次任务。</div>
            )}
          </div>
        </article>

        <aside className="space-y-4">
          <div className="rounded-xl border border-line bg-white p-5">
            <h2 className="font-display text-lg font-semibold text-ink-950">任务详情</h2>
            {selected ? (
              <div className="mt-4 space-y-3 text-sm">
                <Detail label="taskId" value={selected.taskId} />
                <Detail label="traceId" value={selected.traceId} />
                <Detail label="agentType" value={selected.agentType} />
                <Detail label="provider" value={selected.provider || "-"} />
                <Detail label="model" value={selected.model || "-"} />
                <Detail label="input" value={selected.inputSummary || "-"} />
                <Detail label="output" value={selected.outputSummary || "-"} />
                {selected.status === "failed" && (
                  <button
                    type="button"
                    onClick={() => void handleRetry(selected)}
                    className="h-9 rounded-lg bg-brand-600 px-3 text-sm font-medium text-white"
                  >
                    重试失败任务
                  </button>
                )}
              </div>
            ) : (
              <p className="mt-3 text-sm text-ink-500">选择左侧任务查看详情。</p>
            )}
          </div>
          <div className="rounded-xl border border-line bg-white p-5">
            <h2 className="font-display text-lg font-semibold text-ink-950">同 traceId 调用链</h2>
            <div className="mt-4 space-y-2">
              {traceChain.map((task) => (
                <div key={task.taskId} className="rounded-lg border border-line bg-surface-50 p-3">
                  <p className="text-sm font-medium text-ink-900">{task.agentName || task.agentType}</p>
                  <p className="mt-1 text-xs text-ink-500">{task.status} · {task.latencyMs} ms</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

function Select({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[][];
  onChange: (value: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-10 rounded-lg border border-line bg-white px-3 text-sm text-ink-800"
    >
      {options.map(([optionValue, label]) => (
        <option key={label} value={optionValue}>{label}</option>
      ))}
    </select>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-ink-400">{label}</p>
      <p className="mt-1 break-words text-ink-700">{value}</p>
    </div>
  );
}

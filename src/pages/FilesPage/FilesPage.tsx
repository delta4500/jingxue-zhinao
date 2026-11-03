import type { ReactNode } from "react";
import { Database, FileText, ShieldCheck } from "lucide-react";
import { PageHeader } from "../../components/common/PageHeader";
import { StatusBadge } from "../../components/common/StatusBadge";

const tables = [
  "users",
  "user_profiles",
  "project_ideas",
  "projects",
  "project_versions",
  "agent_tasks",
  "workflow_states",
  "documents",
  "document_chapters",
  "sessions",
];

export function FilesPage() {
  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Data & Sources"
        title="文件与数据骨架"
        description="V1 先建立资料入口和数据库表结构认知，真实上传与解析放到后续接入。"
      />
      <section className="grid gap-5 lg:grid-cols-3">
        <Card icon={<FileText className="size-5" />} title="比赛资料" text="保存比赛通知、规则、评分标准和提交材料，后续用于规则解析 Agent。" />
        <Card icon={<Database className="size-5" />} title="最小数据库表" text="后端已按核心闭环设计本地 JSON 数据仓库，接口形态可平滑迁移到 SQLite。" />
        <Card icon={<ShieldCheck className="size-5" />} title="可信标签" text="区分用户提供、系统计算、AI 推断、待核验和演示数据。" />
      </section>
      <section className="rounded-xl border border-line bg-white p-6">
        <h2 className="font-display text-2xl font-semibold text-ink-950">建议数据表</h2>
        <div className="mt-5 flex flex-wrap gap-2">
          {tables.map((table) => (
            <StatusBadge key={table} tone="neutral">{table}</StatusBadge>
          ))}
        </div>
      </section>
    </div>
  );
}

function Card({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <article className="rounded-xl border border-line bg-white p-5">
      <div className="grid size-10 place-items-center rounded-lg border border-brand-100 bg-brand-50 text-brand-700">
        {icon}
      </div>
      <h2 className="mt-4 font-display text-xl font-semibold text-ink-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-ink-500">{text}</p>
    </article>
  );
}

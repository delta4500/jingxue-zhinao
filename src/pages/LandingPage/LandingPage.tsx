import { ArrowRight, CheckCircle2, Database, FileText, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { BrandMark } from "../../components/common/BrandMark";

const capabilities = [
  "用户画像分析",
  "项目创意生成",
  "项目档案沉淀",
  "计划书章节生成",
  "Agent 任务追踪",
  "历史成果保存",
];

export function LandingPage() {
  return (
    <main className="min-h-screen bg-canvas text-ink-950">
      <header className="mx-auto flex h-16 max-w-[1180px] items-center justify-between px-5">
        <BrandMark />
        <nav className="hidden items-center gap-6 text-sm text-ink-500 md:flex">
          <a href="#workflow" className="hover:text-ink-950">工作流</a>
          <a href="#capability" className="hover:text-ink-950">能力矩阵</a>
          <a href="#trust" className="hover:text-ink-950">可信机制</a>
        </nav>
        <Link
          to="/app"
          className="inline-flex h-9 items-center justify-center rounded-lg bg-brand-600 px-4 text-sm font-medium text-white transition-colors hover:bg-brand-700"
        >
          进入工作台
        </Link>
      </header>

      <section className="mx-auto grid max-w-[1180px] gap-12 px-5 pb-20 pt-14 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <div>
          <span className="inline-flex rounded-md border border-brand-100 bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
            Evidence-first AI Competition Workspace
          </span>
          <h1 className="mt-6 font-display text-[40px] font-semibold leading-[1.35] text-ink-950 sm:text-5xl">
            在可信的竞赛语境里，让项目自然生长
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-ink-500">
            竞学智脑把用户条件、比赛要求、项目创意、正式档案和计划书章节串成同一条工作流，让大学生从模糊想法推进到可展示、可修改、可追溯的竞赛成果。
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/app/create"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
            >
              创建竞赛项目
              <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/app"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-line bg-white px-5 text-sm font-medium text-ink-800 transition-colors hover:bg-surface-50"
            >
              查看演示工作台
            </Link>
          </div>
          <div className="mt-7 grid gap-3 text-sm text-ink-600 sm:grid-cols-3">
            {["结构化 JSON", "项目档案继承", "版本可追踪"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-brand-600" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="rounded-[18px] border border-line bg-white/82 p-4 shadow-soft backdrop-blur">
            <div className="rounded-xl border border-line bg-paper p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold tracking-[0.12em] text-brand-700 uppercase">
                    Master Agent
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-semibold text-ink-950">
                    用户画像 → 创意 → 计划书
                  </h2>
                </div>
                <div className="grid size-10 place-items-center rounded-lg border border-brand-100 bg-brand-50 text-brand-700">
                  <Sparkles className="size-5" />
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                {[
                  ["01", "校验个人与团队条件", "专业、技能、预算、资源"],
                  ["02", "生成结构化项目方案", "3 个方案、评分和风险"],
                  ["03", "建立正式项目档案", "选中方案成为唯一事实源"],
                  ["04", "生成计划书章节", "按章节保存，支持修改"],
                ].map(([index, title, desc]) => (
                  <div key={index} className="flex gap-4 rounded-lg border border-line bg-white p-3">
                    <span className="grid size-8 shrink-0 place-items-center rounded-md bg-surface-50 text-xs font-semibold text-brand-700">
                      {index}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-ink-900">{title}</p>
                      <p className="mt-1 text-xs text-ink-500">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute -right-3 top-10 hidden w-52 rounded-xl border border-line bg-white/88 p-4 shadow-soft backdrop-blur md:block">
            <Database className="size-4 text-brand-600" />
            <p className="mt-2 text-xs font-medium text-ink-900">上下文档案</p>
            <p className="mt-1 text-xs leading-5 text-ink-500">用户、画像、方案、文档通过 ID 关联。</p>
          </div>
          <div className="absolute -bottom-6 left-8 hidden w-56 rounded-xl border border-line bg-white/88 p-4 shadow-soft backdrop-blur md:block">
            <ShieldCheck className="size-4 text-brand-600" />
            <p className="mt-2 text-xs font-medium text-ink-900">质量审核</p>
            <p className="mt-1 text-xs leading-5 text-ink-500">检查项目名、技术路线、预算和周期一致性。</p>
          </div>
        </div>
      </section>

      <section id="capability" className="border-y border-line bg-white/55">
        <div className="mx-auto max-w-[1180px] px-5 py-14">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.12em] text-brand-700 uppercase">Capability Matrix</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-ink-950">V1 只做真实闭环，不伪装全功能</h2>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((item) => (
              <article key={item} className="rounded-xl border border-line bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-soft">
                <FileText className="size-5 text-brand-600" />
                <h3 className="mt-4 font-display text-lg font-semibold text-ink-950">{item}</h3>
                <p className="mt-2 text-sm leading-6 text-ink-500">作为第一版工作流骨架的一部分，输出可保存、可读取、可继续修改。</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

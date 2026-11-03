import { ArrowLeft, Construction } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { PageHeader } from "../../components/common/PageHeader";
import { StatusBadge } from "../../components/common/StatusBadge";

const pageContent: Record<string, { title: string; description: string }> = {
  "/app/create": {
    title: "新建竞赛项目",
    description: "下一轮将实现个人与团队、比赛信息、项目偏好和确认提交四步表单。",
  },
  "/app/projects": {
    title: "我的项目",
    description: "下一轮将实现项目列表、项目状态和项目详情入口。",
  },
  "/app/history": {
    title: "历史任务",
    description: "下一轮将实现任务状态、生成时间、模型记录和成果回溯。",
  },
  "/app/files": {
    title: "文件与资料",
    description: "第一版暂不接入真实上传，仅保留后续资料管理页面入口。",
  },
  "/app/settings": {
    title: "个人设置",
    description: "后续将提供个人资料、显示偏好和数据隐私设置。",
  },
};

export function PlaceholderPage() {
  const location = useLocation();
  const content = pageContent[location.pathname] ?? {
    title: "页面建设中",
    description: "该页面将在后续迭代中完成。",
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="V1 BUILDING BLOCK"
        title={content.title}
        description={content.description}
      />
      <section className="grid min-h-[420px] place-items-center rounded-xl border border-dashed border-ink-300 bg-white px-6 py-16 text-center">
        <div className="max-w-md">
          <div className="mx-auto grid size-12 place-items-center rounded-xl border border-brand-100 bg-brand-50 text-brand-700">
            <Construction className="size-5" strokeWidth={1.8} aria-hidden="true" />
          </div>
          <div className="mt-5 flex justify-center">
            <StatusBadge tone="brand">当前为第一轮基础框架</StatusBadge>
          </div>
          <h2 className="mt-4 font-display text-xl font-semibold text-ink-950">页面结构已预留</h2>
          <p className="mt-2 text-sm leading-6 text-ink-500">
            本轮只完成工作台首页和公共布局，不提前接入 Qwen API、后端、数据库或真实业务功能。
          </p>
          <Link
            to="/app"
            className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-line bg-white px-4 text-sm font-medium text-ink-700 transition-colors hover:border-ink-300 hover:bg-surface-50"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            返回工作台
          </Link>
        </div>
      </section>
    </div>
  );
}

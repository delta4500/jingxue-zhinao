import { Bell, ChevronDown, Menu, Search } from "lucide-react";
import { useLocation } from "react-router-dom";
import { StatusBadge } from "../common/StatusBadge";
import { useUiStore } from "../../stores/uiStore";

const titleByPath: Record<string, string> = {
  "/app": "工作台",
  "/app/create": "新建竞赛项目",
  "/app/ideas": "项目方案比较",
  "/app/projects": "我的项目",
  "/app/proposal": "计划书编辑",
  "/app/history": "历史任务",
  "/app/files": "文件与资料",
  "/app/settings": "个人设置",
};

export function AppHeader() {
  const location = useLocation();
  const { openSidebar } = useUiStore();
  const pageTitle = titleByPath[location.pathname] ?? "竞学智脑";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b border-line bg-paper/90 px-4 backdrop-blur-sm sm:px-6 lg:ml-60 lg:px-8">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          type="button"
          onClick={openSidebar}
          className="grid size-9 place-items-center rounded-lg text-ink-600 transition-colors hover:bg-surface-100 hover:text-ink-950 lg:hidden"
          aria-label="打开导航菜单"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink-900">{pageTitle}</p>
          <div className="mt-0.5 hidden items-center gap-1.5 text-xs text-ink-400 sm:flex">
            <span>竞学智脑</span>
            <span>/</span>
            <span className="text-ink-500">{pageTitle}</span>
          </div>
        </div>
      </div>

      <div className="hidden items-center gap-2 md:flex">
        <button className="flex h-9 items-center gap-2 rounded-lg border border-line bg-white px-3 text-sm text-ink-700 transition-colors hover:border-ink-300 hover:bg-surface-50">
          <span className="max-w-44 truncate">当前项目：竞学智脑</span>
          <ChevronDown className="size-4 text-ink-400" aria-hidden="true" />
        </button>
        <StatusBadge tone="success" dot>
          本地工作流
        </StatusBadge>
      </div>

      <div className="ml-3 flex items-center gap-1 sm:ml-5">
        <button
          type="button"
          className="hidden size-9 place-items-center rounded-lg text-ink-500 transition-colors hover:bg-surface-100 hover:text-ink-900 sm:grid"
          aria-label="全局搜索"
        >
          <Search className="size-[18px]" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="relative grid size-9 place-items-center rounded-lg text-ink-500 transition-colors hover:bg-surface-100 hover:text-ink-900"
          aria-label="查看通知"
        >
          <Bell className="size-[18px]" aria-hidden="true" />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-danger-600" />
        </button>
        <button className="ml-1 flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-surface-100">
          <span className="grid size-8 place-items-center rounded-lg bg-brand-50 text-xs font-semibold text-brand-700">
            李
          </span>
          <ChevronDown className="hidden size-4 text-ink-400 sm:block" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}

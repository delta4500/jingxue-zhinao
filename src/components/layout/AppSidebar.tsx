import {
  Archive,
  BookOpenText,
  ChevronRight,
  CircleHelp,
  FileText,
  FolderKanban,
  Home,
  PlusSquare,
  Presentation,
  Scale,
  Settings,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { BrandMark } from "../common/BrandMark";
import { useUiStore } from "../../stores/uiStore";
import { cn } from "../../utils/cn";

const primaryNavigation = [
  { label: "工作台", to: "/app", icon: Home, end: true },
  { label: "新建竞赛项目", to: "/app/create", icon: PlusSquare },
  { label: "方案比较", to: "/app/ideas", icon: Sparkles },
  { label: "项目档案", to: "/app/projects", icon: FolderKanban },
  { label: "计划书编辑", to: "/app/proposal", icon: BookOpenText },
  { label: "历史任务", to: "/app/history", icon: Archive },
  { label: "文件与资料", to: "/app/files", icon: FileText },
  { label: "个人设置", to: "/app/settings", icon: Settings },
];

const upcomingNavigation = [
  { label: "PPT 生成", icon: Presentation },
  { label: "答辩辅助", icon: ShieldCheck },
  { label: "项目评分", icon: Scale },
];

export function AppSidebar() {
  const { sidebarOpen, closeSidebar } = useUiStore();

  return (
    <>
      <button
        type="button"
        aria-label="关闭侧边导航"
        onClick={closeSidebar}
        className={cn(
          "fixed inset-0 z-40 bg-ink-950/20 backdrop-blur-[1px] transition-opacity lg:hidden",
          sidebarOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-line bg-paper transition-transform duration-200 ease-emphasized lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-line px-5">
          <BrandMark />
          <button
            type="button"
            onClick={closeSidebar}
            className="grid size-9 place-items-center rounded-lg text-ink-500 transition-colors hover:bg-surface-100 hover:text-ink-900 lg:hidden"
            aria-label="关闭菜单"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-5">
          <div className="px-2 pb-2 text-[11px] font-semibold tracking-[0.12em] text-ink-400 uppercase">
            核心工作区
          </div>
          <nav className="space-y-1" aria-label="主导航">
            {primaryNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    cn(
                      "group flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-brand-50 text-brand-700"
                        : "text-ink-600 hover:bg-surface-100 hover:text-ink-950",
                    )
                  }
                >
                  <Icon className="size-[18px]" strokeWidth={1.8} aria-hidden="true" />
                  <span className="flex-1">{item.label}</span>
                  <ChevronRight className="size-4 opacity-0 transition-opacity group-hover:opacity-60" />
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-7 px-2 pb-2 text-[11px] font-semibold tracking-[0.12em] text-ink-400 uppercase">
            即将开放
          </div>
          <div className="space-y-1">
            {upcomingNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  type="button"
                  key={item.label}
                  title="该功能将在 V2 开放"
                  aria-disabled="true"
                  className="flex h-10 w-full cursor-not-allowed items-center gap-3 rounded-lg px-3 text-left text-sm font-medium text-ink-400"
                >
                  <Icon className="size-[18px]" strokeWidth={1.7} aria-hidden="true" />
                  <span className="flex-1">{item.label}</span>
                  <span className="rounded-md border border-line bg-surface-100 px-1.5 py-0.5 text-[10px] font-semibold text-ink-500">
                    V2
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-t border-line p-3">
          <div className="mb-2 space-y-1">
            <button className="flex h-9 w-full items-center gap-3 rounded-lg px-3 text-sm text-ink-500 transition-colors hover:bg-surface-100 hover:text-ink-900">
              <CircleHelp className="size-[17px]" aria-hidden="true" />
              帮助中心
            </button>
            <button className="flex h-9 w-full items-center gap-3 rounded-lg px-3 text-sm text-ink-500 transition-colors hover:bg-surface-100 hover:text-ink-900">
              <ShieldCheck className="size-[17px]" aria-hidden="true" />
              数据与隐私
            </button>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-line bg-surface-50 p-3">
            <div className="grid size-9 place-items-center rounded-lg bg-brand-50 text-sm font-semibold text-brand-700">
              李
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink-900">李同学</p>
              <p className="truncate text-xs text-ink-500">通信工程 · 大一</p>
            </div>
            <Sparkles className="size-4 text-teal-600" aria-hidden="true" />
          </div>
        </div>
      </aside>
    </>
  );
}

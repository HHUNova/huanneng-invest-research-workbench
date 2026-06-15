import type { ElementType, ReactNode } from "react";
import {
  BarChart3,
  BriefcaseBusiness,
  Calculator,
  ClipboardCheck,
  Database,
  FileText,
  Globe2,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import type { PageKey } from "../../types";
import { cn } from "../../lib/utils";
import { isSupabaseConfigured } from "../../lib/supabase";
import { Button } from "../ui/Button";

const navItems: Array<{
  key: PageKey;
  label: string;
  icon: ElementType;
}> = [
  { key: "market", label: "市场看板", icon: Globe2 },
  { key: "calculator", label: "测算引擎", icon: Calculator },
  { key: "risk", label: "风险评估", icon: ShieldCheck },
  { key: "toolkit", label: "尽调工具箱", icon: ClipboardCheck },
  { key: "projects", label: "项目库", icon: BriefcaseBusiness },
  { key: "user", label: "用户中心", icon: UserRound },
];

export function AppShell({
  page,
  onPageChange,
  children,
}: {
  page: PageKey;
  onPageChange: (page: PageKey) => void;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-slate-50/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
        <div className="container flex min-h-14 items-center justify-between gap-3 py-2 sm:h-16 sm:gap-6 sm:py-0">
          <button
            type="button"
            onClick={() => onPageChange("market")}
            className="flex min-w-0 flex-1 items-center gap-3 text-left lg:min-w-48 lg:flex-none"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-primary-700 text-slate-50 sm:h-10 sm:w-10">
              <BarChart3 aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-base font-semibold text-slate-900 dark:text-slate-50 sm:text-lg">
                寰能投研
              </span>
              <span className="hidden truncate text-xs text-slate-400 sm:block">
                海外可再生能源投融资工作台
              </span>
            </span>
          </button>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = page === item.key || (page === "country" && item.key === "market");

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => onPageChange(item.key)}
                  className={cn(
                    "flex h-10 items-center gap-2 rounded-sm px-3 text-sm font-medium text-slate-600 transition-colors duration-150 ease-financial hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-950 dark:hover:text-slate-50",
                    active && "bg-primary-50 text-primary-700 dark:bg-slate-950 dark:text-primary-300",
                  )}
                >
                  <Icon aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <span className="hidden items-center gap-2 text-xs text-slate-400 md:flex">
              <Database aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
              {isSupabaseConfigured ? "Supabase 已配置" : "游客模式"}
            </span>
            <Button
              aria-label="保存记录"
              variant="secondary"
              size="sm"
              className="shrink-0 px-3 sm:px-4"
              onClick={() => onPageChange("user")}
            >
              <FileText aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
              <span className="hidden sm:inline">保存记录</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-5 pb-32 sm:py-8 lg:pb-8">
        <div className="animate-fade-up">{children}</div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-slate-50/95 pb-[env(safe-area-inset-bottom)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 lg:hidden">
        <div className="grid grid-cols-3 gap-1 px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = page === item.key || (page === "country" && item.key === "market");

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onPageChange(item.key)}
                className={cn(
                  "flex h-12 min-w-0 flex-col items-center justify-center gap-0.5 rounded-sm px-2 text-[11px] font-medium text-slate-600 transition-colors duration-150 ease-financial dark:text-slate-400",
                  active && "bg-primary-50 text-primary-700 dark:bg-slate-950 dark:text-primary-300",
                )}
              >
                <Icon aria-hidden="true" className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                <span className="max-w-full truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

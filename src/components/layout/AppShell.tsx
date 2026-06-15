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
  icon: React.ElementType;
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
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
        <div className="container flex h-16 items-center justify-between gap-6">
          <button
            type="button"
            onClick={() => onPageChange("market")}
            className="flex min-w-48 items-center gap-3 text-left"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-primary-700 text-slate-50">
              <BarChart3 aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />
            </span>
            <span>
              <span className="block text-lg font-semibold text-slate-900 dark:text-slate-50">寰能投研</span>
              <span className="block text-xs text-slate-400">海外可再生能源投融资工作台</span>
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

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 text-xs text-slate-400 md:flex">
              <Database aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
              {isSupabaseConfigured ? "Supabase 已配置" : "游客模式"}
            </span>
            <Button variant="secondary" size="sm" onClick={() => onPageChange("user")}>
              <FileText aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
              保存记录
            </Button>
          </div>
        </div>
      </header>

      <div className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 lg:hidden">
        <div className="container flex gap-2 overflow-x-auto py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = page === item.key || (page === "country" && item.key === "market");

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onPageChange(item.key)}
                className={cn(
                  "flex h-10 shrink-0 items-center gap-2 rounded-sm px-4 text-sm text-slate-600",
                  active && "bg-primary-50 text-primary-700",
                )}
              >
                <Icon aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <main className="container py-8">
        <div className="animate-fade-up">{children}</div>
      </main>
    </div>
  );
}

import { Clock, FolderOpen } from "lucide-react";
import { AuthPanel } from "../components/auth/AuthPanel";
import { PageHeader } from "../components/common/PageHeader";
import { Badge } from "../components/ui/Badge";
import { Card, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { countryByCode } from "../data/countries";
import { formatMoney, formatPercent } from "../lib/utils";
import { scenarioLabels, trackLabels } from "../lib/labels";
import type { SavedProject } from "../types";

export function UserCenterPage({ savedProjects }: { savedProjects: SavedProject[] }) {
  return (
    <div>
      <PageHeader
        eyebrow="用户中心"
        title="项目保存与历史测算"
        description="MVP 支持游客本地保存，Supabase 配置后可扩展为账号级云端项目记录和收藏国家。"
      />

      <section className="mb-6">
        <AuthPanel />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <Card className="rounded-lg p-4 sm:p-6 lg:p-8">
          <CardHeader>
            <div>
              <CardTitle>保存概览</CardTitle>
              <CardDescription>本地最近 12 条测算记录。</CardDescription>
            </div>
            <FolderOpen aria-hidden="true" className="h-5 w-5 text-primary-700" strokeWidth={1.5} />
          </CardHeader>
          <div className="grid gap-4">
            <div className="rounded-md border border-slate-200 bg-slate-100 p-4 dark:border-slate-800 dark:bg-slate-950">
              <p className="text-sm text-slate-600 dark:text-slate-400">已保存项目</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-50">{savedProjects.length}</p>
            </div>
            <div className="rounded-md border border-slate-200 bg-slate-100 p-4 dark:border-slate-800 dark:bg-slate-950">
              <p className="text-sm text-slate-600 dark:text-slate-400">收藏国家</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-50">预留</p>
            </div>
          </div>
        </Card>

        <div className="grid gap-4">
          {savedProjects.length === 0 ? (
            <Card className="rounded-lg p-4 sm:p-6 lg:p-8">
              <CardHeader>
                <div>
                  <CardTitle>暂无保存记录</CardTitle>
                  <CardDescription>在测算引擎中点击保存后，项目会显示在这里。</CardDescription>
                </div>
              </CardHeader>
            </Card>
          ) : (
            savedProjects.map((project) => {
              const country = countryByCode[project.input.countryCode];
              return (
                <Card key={project.id} className="rounded-lg p-4 sm:p-6 lg:p-8">
                  <CardHeader>
                    <div>
                      <CardTitle>{project.name}</CardTitle>
                      <CardDescription>
                        {country.name} · {trackLabels[project.input.track]} · {scenarioLabels[project.result.scenario]}
                      </CardDescription>
                    </div>
                    <Badge>
                      <Clock aria-hidden="true" className="mr-2 h-3 w-3" strokeWidth={1.5} />
                      {new Date(project.createdAt).toLocaleDateString("zh-CN")}
                    </Badge>
                  </CardHeader>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-md border border-slate-200 bg-slate-100 p-4 dark:border-slate-800 dark:bg-slate-950">
                      <p className="text-xs text-slate-400">全投资 IRR</p>
                      <p className="mt-2 text-lg font-medium text-amber-600">{formatPercent(project.result.projectIRR, 2)}</p>
                    </div>
                    <div className="rounded-md border border-slate-200 bg-slate-100 p-4 dark:border-slate-800 dark:bg-slate-950">
                      <p className="text-xs text-slate-400">资本金 IRR</p>
                      <p className="mt-2 text-lg font-medium text-amber-600">{formatPercent(project.result.equityIRR, 2)}</p>
                    </div>
                    <div className="rounded-md border border-slate-200 bg-slate-100 p-4 dark:border-slate-800 dark:bg-slate-950">
                      <p className="text-xs text-slate-400">NPV</p>
                      <p className="mt-2 text-lg font-medium text-slate-900 dark:text-slate-50">
                        {formatMoney(project.result.npvMillionUSD)}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}

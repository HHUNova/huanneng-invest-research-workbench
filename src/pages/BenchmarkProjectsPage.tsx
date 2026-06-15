import { Building2 } from "lucide-react";
import { getBenchmarkProjects } from "../services/dataService";
import { countryByCode } from "../data/countries";
import { PageHeader } from "../components/common/PageHeader";
import { Badge } from "../components/ui/Badge";
import { Card, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { formatMoney, formatNumber, formatPercent } from "../lib/utils";
import { trackLabels } from "../lib/labels";

export function BenchmarkProjectsPage() {
  const projects = getBenchmarkProjects();

  return (
    <div>
      <PageHeader
        eyebrow="预留模块"
        title="中资标杆项目库"
        description="收录中资海外新能源标杆项目的装机、投资、融资结构和收益区间，用于投前对标。"
      />

      <section className="grid gap-6 lg:grid-cols-2">
        {projects.map((project) => {
          const country = countryByCode[project.countryCode];
          return (
            <Card key={project.name} className="rounded-lg p-4 sm:p-6 lg:p-8">
              <CardHeader>
                <div>
                  <CardTitle>{project.name}</CardTitle>
                  <CardDescription>
                    {country.name} · {trackLabels[project.track]}
                  </CardDescription>
                </div>
                <Building2 aria-hidden="true" className="h-5 w-5 text-primary-700" strokeWidth={1.5} />
              </CardHeader>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-md border border-slate-200 bg-slate-100 p-4 dark:border-slate-800 dark:bg-slate-950">
                  <p className="text-xs text-slate-400">装机</p>
                  <p className="mt-2 text-lg font-medium text-slate-900 dark:text-slate-50">
                    {formatNumber(project.capacityMW, 0)} MW
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-100 p-4 dark:border-slate-800 dark:bg-slate-950">
                  <p className="text-xs text-slate-400">投资额</p>
                  <p className="mt-2 text-lg font-medium text-slate-900 dark:text-slate-50">
                    {formatMoney(project.investmentMillionUSD)}
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-100 p-4 dark:border-slate-800 dark:bg-slate-950">
                  <p className="text-xs text-slate-400">IRR</p>
                  <p className="mt-2 text-lg font-medium text-amber-600">
                    {formatPercent(project.irrRange[0], 1)}-{formatPercent(project.irrRange[1], 1)}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-3 rounded-md border border-slate-200 bg-slate-100 p-4 dark:border-slate-800 dark:bg-slate-950 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">{project.financing}</p>
                <Badge>对标</Badge>
              </div>
            </Card>
          );
        })}
      </section>
    </div>
  );
}

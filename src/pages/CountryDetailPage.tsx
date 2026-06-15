import { ArrowLeft, Calculator, ShieldCheck } from "lucide-react";
import { calculateRiskAssessment } from "../calculations/risk";
import { countryByCode } from "../data/countries";
import { PageHeader } from "../components/common/PageHeader";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { formatNumber, formatPercent } from "../lib/utils";
import { regionLabels, riskLabels, trackLabels } from "../lib/labels";
import type { Track } from "../types";

export function CountryDetailPage({
  countryCode,
  onBack,
  onOpenCalculator,
  onOpenRisk,
}: {
  countryCode: string;
  onBack: () => void;
  onOpenCalculator: (track?: Track) => void;
  onOpenRisk: () => void;
}) {
  const country = countryByCode[countryCode];
  const assessment = calculateRiskAssessment(country);

  return (
    <div>
      <PageHeader
        eyebrow="国家详情"
        title={country.name}
        description={country.risk.summary}
        actions={
          <>
            <Button variant="secondary" onClick={onBack}>
              <ArrowLeft aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
              返回看板
            </Button>
            <Button variant="secondary" onClick={onOpenRisk}>
              <ShieldCheck aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
              风险评估
            </Button>
            <Button onClick={() => onOpenCalculator()}>
              <Calculator aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
              进入测算
            </Button>
          </>
        }
      />

      <section className="mb-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <p className="text-sm text-slate-600 dark:text-slate-400">投资吸引力</p>
          <p className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-50">{country.attractionScore}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-600 dark:text-slate-400">累计装机</p>
          <p className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-50">{formatNumber(country.installedGW, 1)} GW</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-600 dark:text-slate-400">平均 IRR</p>
          <p className="mt-3 text-2xl font-semibold text-amber-600">
            {formatPercent(country.irrRange[0], 1)}-{formatPercent(country.irrRange[1], 1)}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-slate-600 dark:text-slate-400">风险等级</p>
          <p className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-50">{riskLabels[assessment.level]}</p>
        </Card>
      </section>

      <section className="mb-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card className="rounded-lg p-4 sm:p-6 lg:p-8">
          <CardHeader>
            <div>
              <CardTitle>市场画像</CardTitle>
              <CardDescription>区域、赛道和中资参与度。</CardDescription>
            </div>
            <Badge>{regionLabels[country.region]}</Badge>
          </CardHeader>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-md border border-slate-200 bg-slate-100 p-4 dark:border-slate-800 dark:bg-slate-950">
              <p className="text-sm text-slate-600 dark:text-slate-400">2026 新增装机</p>
              <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-50">
                {formatNumber(country.newCapacityGW2026, 1)} GW
              </p>
            </div>
            <div className="rounded-md border border-slate-200 bg-slate-100 p-4 dark:border-slate-800 dark:bg-slate-950">
              <p className="text-sm text-slate-600 dark:text-slate-400">投资规模</p>
              <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-50">
                {formatNumber(country.investmentBillionUSD2026, 1)} 十亿美元
              </p>
            </div>
            <div className="rounded-md border border-slate-200 bg-slate-100 p-4 dark:border-slate-800 dark:bg-slate-950">
              <p className="text-sm text-slate-600 dark:text-slate-400">基准电价</p>
              <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-50">
                {formatNumber(country.benchmarkTariffUSDPerMWh, 0)} USD/MWh
              </p>
            </div>
            <div className="rounded-md border border-slate-200 bg-slate-100 p-4 dark:border-slate-800 dark:bg-slate-950">
              <p className="text-sm text-slate-600 dark:text-slate-400">中资项目</p>
              <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-50">{country.chineseProjects} 个</p>
            </div>
          </div>
        </Card>

        <Card className="rounded-lg p-4 sm:p-6 lg:p-8">
          <CardHeader>
            <div>
              <CardTitle>可测算赛道</CardTitle>
              <CardDescription>选择赛道后进入测算引擎并自动填充国家基准参数。</CardDescription>
            </div>
          </CardHeader>
          <div className="grid gap-4 md:grid-cols-2">
            {country.tracks.map((track) => (
              <button
                type="button"
                key={track}
                onClick={() => onOpenCalculator(track)}
                className="rounded-md border border-slate-200 bg-slate-100 p-4 text-left transition-all duration-150 ease-financial hover:-translate-y-0.5 hover:shadow-hover dark:border-slate-800 dark:bg-slate-950"
              >
                <p className="text-base font-medium text-slate-900 dark:text-slate-50">{trackLabels[track]}</p>
                <p className="mt-2 text-xs text-slate-400">
                  基准电价 {formatNumber(country.defaults[track].tariffUSDPerMWh, 0)} USD/MWh
                </p>
              </button>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}

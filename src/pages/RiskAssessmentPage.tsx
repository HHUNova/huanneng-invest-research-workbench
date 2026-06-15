import { useMemo, useState } from "react";
import { Download, Gauge, ShieldAlert, ShieldCheck } from "lucide-react";
import { applyRiskPremium, calculateRiskAssessment } from "../calculations/risk";
import { countries, countryByCode } from "../data/countries";
import { PageHeader } from "../components/common/PageHeader";
import { AccordionItem } from "../components/ui/Accordion";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Field, UnderlineSelect } from "../components/ui/Field";
import { formatNumber, formatPercent } from "../lib/utils";
import { regionLabels, riskLabels } from "../lib/labels";
import type { CalculationInput } from "../types";

export function RiskAssessmentPage({
  countryCode,
  calculatorInput,
  onCountryChange,
  onApplyToCalculator,
  onGoCalculator,
}: {
  countryCode: string;
  calculatorInput: CalculationInput;
  onCountryChange: (countryCode: string) => void;
  onApplyToCalculator: (input: CalculationInput) => void;
  onGoCalculator: () => void;
}) {
  const [open, setOpen] = useState<Record<string, boolean>>({ sovereign: true });
  const country = countryByCode[countryCode];
  const assessment = useMemo(() => calculateRiskAssessment(country), [country]);

  function handleApplyPremium() {
    onApplyToCalculator(applyRiskPremium({ ...calculatorInput, countryCode }, assessment.premium));
    onGoCalculator();
  }

  return (
    <div>
      <PageHeader
        eyebrow="风险评估"
        title="多维度综合风险评估系统"
        description="从中资出海视角量化主权、工程、财税、法律和 ESG 风险，并将风险溢价直接代入收益测算。"
        actions={
          <>
            <Button variant="secondary" onClick={() => window.print()}>
              <Download aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
              导出简报
            </Button>
            <Button onClick={handleApplyPremium}>
              <Gauge aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
              代入测算
            </Button>
          </>
        }
      />

      <section className="mb-6 rounded-md border border-slate-200 bg-slate-50 p-4 shadow-card dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto_auto] lg:items-end">
          <Field label="国家">
            <UnderlineSelect value={countryCode} onChange={(event) => onCountryChange(event.target.value)}>
              {countries.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.name}
                </option>
              ))}
            </UnderlineSelect>
          </Field>
          <Badge>{regionLabels[country.region]}</Badge>
          <Badge>{riskLabels[assessment.level]}</Badge>
        </div>
      </section>

      <section className="mb-6 grid gap-6 lg:grid-cols-[1fr_2fr]">
        <Card className="rounded-lg p-4 sm:p-6 lg:p-8">
          <CardHeader>
            <div>
              <CardTitle>综合风险等级</CardTitle>
              <CardDescription>加权评分越高代表风险越低。</CardDescription>
            </div>
            <ShieldCheck aria-hidden="true" className="h-5 w-5 text-primary-700" strokeWidth={1.5} />
          </CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
            <div>
              <p className="text-2xl font-semibold text-slate-900 dark:text-slate-50">{assessment.level}</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">加权得分 {formatNumber(assessment.weightedScore, 2)} / 10</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-semibold text-amber-600">{formatPercent(assessment.premium, 2)}</p>
              <p className="mt-1 text-xs text-slate-400">建议风险溢价</p>
            </div>
          </div>
          <p className="mt-6 rounded-md border border-slate-200 bg-slate-100 p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
            {assessment.recommendation}
          </p>
        </Card>

        <div className="grid gap-6 md:grid-cols-5">
          {country.risk.dimensions.map((dimension) => (
            <Card key={dimension.key} className="p-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">{dimension.name}</p>
              <p className="mt-3 text-xl font-semibold text-slate-900 dark:text-slate-50">{formatNumber(dimension.score, 1)}</p>
              <div className="mt-4 h-2 rounded-sm bg-slate-200 dark:bg-slate-950">
                <div
                  className="h-2 rounded-sm bg-primary-700"
                  style={{ width: `${Math.min(dimension.score * 10, 100)}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-slate-400">权重 {formatPercent(dimension.weight, 0)}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-6 grid gap-4">
        {country.risk.dimensions.map((dimension) => (
          <AccordionItem
            key={dimension.key}
            title={dimension.name}
            description={`评分 ${formatNumber(dimension.score, 1)}，权重 ${formatPercent(dimension.weight, 0)}`}
            open={Boolean(open[dimension.key])}
            onToggle={() => setOpen((current) => ({ ...current, [dimension.key]: !current[dimension.key] }))}
          >
            <div className="grid gap-4 md:grid-cols-3">
              {dimension.items.map((item) => (
                <div key={item.label} className="rounded-md border border-slate-200 bg-slate-100 p-4 dark:border-slate-800 dark:bg-slate-950">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-50">{item.label}</p>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{item.value}</p>
                  <p className="mt-3 text-xs text-slate-400">子项评分 {formatNumber(item.score, 1)}</p>
                </div>
              ))}
            </div>
          </AccordionItem>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>BIT 核心条款</CardTitle>
              <CardDescription>中国与东道国投资保护适用性。</CardDescription>
            </div>
          </CardHeader>
          <p className="text-sm text-slate-600 dark:text-slate-400">{country.risk.bit}</p>
        </Card>
        <Card>
          <CardHeader>
            <div>
              <CardTitle>避免双重征税</CardTitle>
              <CardDescription>股息、利息与项目公司税务路径。</CardDescription>
            </div>
          </CardHeader>
          <p className="text-sm text-slate-600 dark:text-slate-400">{country.risk.dta}</p>
        </Card>
        <Card>
          <CardHeader>
            <div>
              <CardTitle>中国信保提示</CardTitle>
              <CardDescription>承保关注点与国别风险提示。</CardDescription>
            </div>
            <ShieldAlert aria-hidden="true" className="h-5 w-5 text-amber-600" strokeWidth={1.5} />
          </CardHeader>
          <p className="text-sm text-slate-600 dark:text-slate-400">{country.risk.sinosure}</p>
        </Card>
      </section>
    </div>
  );
}

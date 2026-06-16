import { useEffect, useMemo, useState } from "react";
import { Download, Save, SlidersHorizontal, WalletCards } from "lucide-react";
import { calculateProject } from "../calculations/finance";
import { countries, countryByCode } from "../data/countries";
import { EChart, type EChartOption } from "../components/charts/EChart";
import { MetricCard } from "../components/common/MetricCard";
import { PageHeader } from "../components/common/PageHeader";
import { AccordionItem } from "../components/ui/Accordion";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Field, UnderlineInput, UnderlineSelect } from "../components/ui/Field";
import { SegmentedControl } from "../components/ui/SegmentedControl";
import { formatMoney, formatNumber, formatPercent } from "../lib/utils";
import { scenarioLabels, trackLabels } from "../lib/labels";
import type { CalculationInput, CalculationResult, Scenario, Track } from "../types";

const tracks: Track[] = ["solar", "onshoreWind", "offshoreWind", "storage", "hydro"];
const scenarios: Scenario[] = ["base", "optimistic", "pessimistic"];
const compactChartQuery = "(max-width: 640px)";

function useCompactCharts() {
  const [compact, setCompact] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia(compactChartQuery).matches,
  );

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const media = window.matchMedia(compactChartQuery);
    const update = () => setCompact(media.matches);

    update();
    media.addEventListener("change", update);

    return () => {
      media.removeEventListener("change", update);
    };
  }, []);

  return compact;
}

function NumberField({
  label,
  value,
  suffix,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  suffix?: string;
  step?: number;
  onChange: (value: number) => void;
}) {
  return (
    <Field label={label} hint={suffix}>
      <UnderlineInput
        type="number"
        step={step}
        value={Number.isFinite(value) ? value : 0}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </Field>
  );
}

function RatioField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <Field label={label} hint="%">
      <UnderlineInput
        type="number"
        step={0.1}
        value={Number.isFinite(value) ? Number((value * 100).toFixed(2)) : 0}
        onChange={(event) => onChange(Number(event.target.value) / 100)}
      />
    </Field>
  );
}

function buildCashFlowOption(result: CalculationResult): EChartOption {
  return {
    tooltip: { trigger: "axis" },
    legend: { top: 0 },
    xAxis: { type: "category", data: result.annualCashFlows.map((item) => `Y${item.year}`) },
    yAxis: { type: "value", name: "百万美元" },
    series: [
      {
        name: "项目现金流",
        type: "line",
        smooth: true,
        showSymbol: false,
        data: result.annualCashFlows.map((item) => Number(item.projectCashFlow.toFixed(2))),
        lineStyle: { color: "#0F766E", width: 2 },
      },
      {
        name: "股东现金流",
        type: "line",
        smooth: true,
        showSymbol: false,
        data: result.annualCashFlows.map((item) => Number(item.equityCashFlow.toFixed(2))),
        lineStyle: { color: "#D97706", width: 2 },
      },
    ],
  };
}

function buildSensitivityOption(result: CalculationResult, compact = false): EChartOption {
  const maxAbs = Math.max(
    ...result.sensitivity.flatMap((item) => [
      Math.abs(item.downsideNpv - result.npvMillionUSD),
      Math.abs(item.upsideNpv - result.npvMillionUSD),
    ]),
    1,
  );

  return {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      valueFormatter: (value) => `${formatNumber(Number(value), 1)} 百万美元`,
    },
    legend: compact
      ? {
          top: 0,
          left: "center",
          itemWidth: 12,
          itemHeight: 8,
          itemGap: 14,
          textStyle: { color: "#475569", fontSize: 12 },
        }
      : { top: 0, right: 8 },
    grid: compact
      ? { top: 48, right: 8, bottom: 24, left: 8, containLabel: true }
      : { top: 48, right: 32, bottom: 40, left: 104, containLabel: true },
    xAxis: {
      type: "value",
      min: -Math.ceil(maxAbs * 1.15),
      max: Math.ceil(maxAbs * 1.15),
      splitNumber: compact ? 4 : undefined,
      axisLabel: { formatter: (value: number) => formatNumber(value, 0), fontSize: compact ? 10 : 12, hideOverlap: true },
      name: compact ? undefined : "NPV变动（百万美元）",
      nameLocation: "middle",
      nameGap: 28,
    },
    yAxis: {
      type: "category",
      data: result.sensitivity.map((item) => item.variable),
      axisLabel: { color: "#475569", fontSize: compact ? 12 : 12, margin: compact ? 8 : 8 },
    },
    series: [
      {
        name: "下行情景",
        type: "bar",
        stack: "npv",
        barWidth: compact ? 12 : 18,
        data: result.sensitivity.map((item) => Number((item.downsideNpv - result.npvMillionUSD).toFixed(2))),
        itemStyle: { color: "#475569", borderRadius: [4, 0, 0, 4] },
      },
      {
        name: "上行情景",
        type: "bar",
        stack: "npv",
        barWidth: compact ? 12 : 18,
        data: result.sensitivity.map((item) => Number((item.upsideNpv - result.npvMillionUSD).toFixed(2))),
        itemStyle: { color: "#0F766E", borderRadius: [0, 4, 4, 0] },
      },
    ],
  };
}

function buildMatrixOption(result: CalculationResult, compact = false): EChartOption {
  const variables = ["电价", "总投资", "利用小时数", "利率"];
  const deltas = [-10, -5, 5, 10];

  return {
    tooltip: {
      position: "top",
      formatter: (params: any) => {
        const cell = result.matrix[params.dataIndex];
        return `${cell.variable}<br/>扰动：${formatPercent(cell.delta, 0)}<br/>IRR：${formatPercent(cell.projectIRR, 1)}<br/>NPV：${formatMoney(cell.npvMillionUSD)}`;
      },
    },
    grid: compact
      ? { top: 8, right: 4, bottom: 44, left: 4, containLabel: true }
      : { top: 48, right: 32, bottom: 40, left: 104, containLabel: true },
    xAxis: {
      type: "category",
      data: deltas.map((delta) => `${delta}%`),
      name: "变量扰动",
      nameLocation: "middle",
      nameGap: compact ? 24 : 28,
      axisLabel: { color: "#475569", fontSize: compact ? 11 : 12, interval: 0, margin: compact ? 8 : 8 },
    },
    yAxis: {
      type: "category",
      data: variables,
      axisLabel: { color: "#475569", fontSize: compact ? 12 : 12, margin: compact ? 8 : 8 },
    },
    visualMap: {
      min: Math.min(...result.matrix.map((item) => item.projectIRR)),
      max: Math.max(...result.matrix.map((item) => item.projectIRR)),
      show: false,
      inRange: { color: ["#F1F5F9", "#99F6E4", "#0F766E"] },
    },
    series: [
      {
        type: "heatmap",
        data: result.matrix.map((cell) => [deltas.indexOf(Math.round(cell.delta * 100)), variables.indexOf(cell.variable), cell.projectIRR]),
        label: {
          show: true,
          formatter: (params: any) => formatPercent(Number(params.value[2]), 1),
          color: "#0F172A",
          fontSize: compact ? 10 : 12,
        },
        emphasis: {
          itemStyle: {
            borderColor: "#0F766E",
            borderWidth: 1,
          },
        },
        itemStyle: { borderColor: "#E2E8F0", borderWidth: 1 },
      },
    ],
  };
}

export function CalculatorPage({
  input,
  scenario,
  onScenarioChange,
  onInputChange,
  onCountryTrackChange,
  onSaveProject,
}: {
  input: CalculationInput;
  scenario: Scenario;
  onScenarioChange: (scenario: Scenario) => void;
  onInputChange: (input: CalculationInput) => void;
  onCountryTrackChange: (countryCode: string, track: Track) => void;
  onSaveProject: (result: CalculationResult) => void;
}) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    core: true,
    engineering: false,
    fiscal: false,
    finance: false,
  });
  const result = useMemo(() => calculateProject(input, scenario), [input, scenario]);
  const selectedCountry = countryByCode[input.countryCode];
  const compactCharts = useCompactCharts();

  function patchInput(patch: Partial<CalculationInput>) {
    onInputChange({ ...input, ...patch });
  }

  function toggleGroup(key: string) {
    setOpenGroups((current) => ({ ...current, [key]: !current[key] }));
  }

  return (
    <div>
      <PageHeader
        eyebrow="收益测算"
        title="全参数项目投融资测算引擎"
        description="选择国家与赛道后自动填充基准参数，可实时调整工程、财税与融资假设，输出投前核心收益指标。"
        actions={
          <>
            <Button variant="secondary" onClick={() => window.print()}>
              <Download aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
              导出 PDF
            </Button>
            <Button onClick={() => onSaveProject(result)}>
              <Save aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
              保存测算
            </Button>
          </>
        }
      />

      <section className="mb-6 rounded-md border border-slate-200 bg-slate-50 p-4 shadow-card dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
          <Field label="国家">
            <UnderlineSelect value={input.countryCode} onChange={(event) => onCountryTrackChange(event.target.value, input.track)}>
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </UnderlineSelect>
          </Field>
          <Field label="赛道">
            <UnderlineSelect value={input.track} onChange={(event) => onCountryTrackChange(input.countryCode, event.target.value as Track)}>
              {tracks.map((track) => (
                <option key={track} value={track}>
                  {trackLabels[track]}
                </option>
              ))}
            </UnderlineSelect>
          </Field>
          <div>
            <span className="mb-2 block text-sm text-slate-600 dark:text-slate-400">场景</span>
            <SegmentedControl
              value={scenario}
              options={scenarios.map((item) => ({ label: scenarioLabels[item], value: item }))}
              onChange={onScenarioChange}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-5">
          <AccordionItem
            title="基础信息"
            description="默认展示的核心投融资假设"
            open={openGroups.core}
            onToggle={() => toggleGroup("core")}
          >
            <div className="grid gap-6 md:grid-cols-2">
              <NumberField label="装机容量" suffix="MW" value={input.capacityMW} onChange={(value) => patchInput({ capacityMW: value })} />
              <NumberField
                label="总投资"
                suffix="百万美元"
                value={input.totalInvestmentMillionUSD}
                onChange={(value) => patchInput({ totalInvestmentMillionUSD: value })}
              />
              <NumberField
                label="建设周期"
                suffix="年"
                value={input.constructionYears}
                onChange={(value) => patchInput({ constructionYears: value })}
              />
              <NumberField
                label="运营期"
                suffix="年"
                value={input.operatingYears}
                onChange={(value) => patchInput({ operatingYears: value })}
              />
            </div>
          </AccordionItem>

          <AccordionItem
            title="工程参数"
            description="技术路线、发电量折减和运维成本"
            open={openGroups.engineering}
            onToggle={() => toggleGroup("engineering")}
          >
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="技术路线">
                <UnderlineInput value={input.technologyRoute} onChange={(event) => patchInput({ technologyRoute: event.target.value })} />
              </Field>
              <NumberField
                label="年利用小时数"
                suffix="小时"
                value={input.utilizationHours}
                onChange={(value) => patchInput({ utilizationHours: value })}
              />
              <RatioField label="年衰减率" value={input.degradationRate} onChange={(value) => patchInput({ degradationRate: value })} />
              <RatioField label="弃电率" value={input.curtailmentRate} onChange={(value) => patchInput({ curtailmentRate: value })} />
              <RatioField label="厂用电率" value={input.auxiliaryPowerRate} onChange={(value) => patchInput({ auxiliaryPowerRate: value })} />
              <NumberField
                label="运维成本"
                suffix="USD/kW/年"
                value={input.omCostPerKWYear}
                onChange={(value) => patchInput({ omCostPerKWYear: value })}
              />
            </div>
          </AccordionItem>

          <AccordionItem
            title="财税参数"
            description="电价、补贴、税率与折旧方式"
            open={openGroups.fiscal}
            onToggle={() => toggleGroup("fiscal")}
          >
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="电价模式">
                <UnderlineInput value={input.tariffMode} onChange={(event) => patchInput({ tariffMode: event.target.value })} />
              </Field>
              <NumberField
                label="基准电价"
                suffix="USD/MWh"
                value={input.tariffUSDPerMWh}
                onChange={(value) => patchInput({ tariffUSDPerMWh: value })}
              />
              <NumberField
                label="补贴"
                suffix="USD/MWh"
                value={input.subsidyUSDPerMWh}
                onChange={(value) => patchInput({ subsidyUSDPerMWh: value })}
              />
              <RatioField label="企业所得税率" value={input.corporateTaxRate} onChange={(value) => patchInput({ corporateTaxRate: value })} />
              <RatioField label="增值税率" value={input.vatRate} onChange={(value) => patchInput({ vatRate: value })} />
              <Field label="折旧方式">
                <UnderlineInput
                  value={input.depreciationMethod}
                  onChange={(event) => patchInput({ depreciationMethod: event.target.value })}
                />
              </Field>
              <NumberField
                label="折旧年限"
                suffix="年"
                value={input.depreciationYears}
                onChange={(value) => patchInput({ depreciationYears: value })}
              />
            </div>
          </AccordionItem>

          <AccordionItem
            title="融资参数"
            description="资本结构、贷款成本和折现率"
            open={openGroups.finance}
            onToggle={() => toggleGroup("finance")}
          >
            <div className="grid gap-6 md:grid-cols-2">
              <RatioField label="资本金比例" value={input.equityRatio} onChange={(value) => patchInput({ equityRatio: value })} />
              <RatioField label="贷款利率" value={input.loanInterestRate} onChange={(value) => patchInput({ loanInterestRate: value })} />
              <NumberField label="贷款期限" suffix="年" value={input.loanTenorYears} onChange={(value) => patchInput({ loanTenorYears: value })} />
              <NumberField
                label="宽限期"
                suffix="年"
                value={input.gracePeriodYears}
                onChange={(value) => patchInput({ gracePeriodYears: value })}
              />
              <RatioField label="综合折现率" value={input.discountRate} onChange={(value) => patchInput({ discountRate: value })} />
            </div>
          </AccordionItem>
        </div>

        <div className="space-y-6 lg:col-span-7">
          <Card className="rounded-lg p-4 sm:p-6 lg:p-8">
            <CardHeader>
              <div>
                <CardTitle>结果实时预览</CardTitle>
                <CardDescription>
                  {selectedCountry.name} · {trackLabels[input.track]} · {scenarioLabels[scenario]}场景
                </CardDescription>
              </div>
              <Badge>折现率 {formatPercent(input.discountRate, 1)}</Badge>
            </CardHeader>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-md border border-slate-200 bg-slate-100 p-4 dark:border-slate-800 dark:bg-slate-950">
                <p className="text-sm text-slate-600 dark:text-slate-400">全投资 IRR</p>
                <p className="mt-2 text-xl font-semibold text-amber-600">{formatPercent(result.projectIRR, 2)}</p>
              </div>
              <div className="rounded-md border border-slate-200 bg-slate-100 p-4 dark:border-slate-800 dark:bg-slate-950">
                <p className="text-sm text-slate-600 dark:text-slate-400">资本金 IRR</p>
                <p className="mt-2 text-xl font-semibold text-amber-600">{formatPercent(result.equityIRR, 2)}</p>
              </div>
              <div className="rounded-md border border-slate-200 bg-slate-100 p-4 dark:border-slate-800 dark:bg-slate-950">
                <p className="text-sm text-slate-600 dark:text-slate-400">静态回收期</p>
                <p className="mt-2 text-xl font-semibold text-amber-600">{formatNumber(result.staticPaybackYears, 1)} 年</p>
              </div>
              <div className="rounded-md border border-slate-200 bg-slate-100 p-4 dark:border-slate-800 dark:bg-slate-950">
                <p className="text-sm text-slate-600 dark:text-slate-400">动态 NPV</p>
                <p className="mt-2 text-xl font-semibold text-amber-600">{formatMoney(result.npvMillionUSD)}</p>
              </div>
              <div className="rounded-md border border-slate-200 bg-slate-100 p-4 dark:border-slate-800 dark:bg-slate-950 xl:col-span-2">
                <p className="text-sm text-slate-600 dark:text-slate-400">LCOE 平准化度电成本</p>
                <p className="mt-2 text-xl font-semibold text-amber-600">
                  {formatNumber(result.lcoeUSDPerMWh, 1)} USD/MWh
                </p>
              </div>
            </div>
          </Card>

          <Card className="rounded-lg p-4 sm:p-6 lg:p-8">
            <CardHeader>
              <div>
                <CardTitle>全生命周期现金流</CardTitle>
                <CardDescription>项目现金流与股东现金流年度对比。</CardDescription>
              </div>
              <WalletCards aria-hidden="true" className="h-5 w-5 text-primary-700" strokeWidth={1.5} />
            </CardHeader>
            <EChart option={buildCashFlowOption(result)} height={320} />
          </Card>

          <div className="grid gap-6">
            <Card className="rounded-lg p-4 sm:p-6 lg:p-8">
              <CardHeader>
                <div>
                  <CardTitle>敏感性矩阵</CardTitle>
                  <CardDescription>四个关键变量按正负扰动输出 IRR。</CardDescription>
                </div>
                <SlidersHorizontal aria-hidden="true" className="h-5 w-5 text-primary-700" strokeWidth={1.5} />
              </CardHeader>
              <EChart option={buildMatrixOption(result, compactCharts)} height={compactCharts ? 288 : 336} />
            </Card>
            <Card className="rounded-lg p-4 sm:p-6 lg:p-8">
              <CardHeader>
                <div>
                  <CardTitle>龙卷风图</CardTitle>
                  <CardDescription>按 NPV 变动幅度排序。</CardDescription>
                </div>
              </CardHeader>
              <EChart option={buildSensitivityOption(result, compactCharts)} height={compactCharts ? 288 : 320} />
            </Card>
          </div>

          <section className="grid gap-6 md:grid-cols-3">
            {scenarios.map((item) => {
              const scenarioResult = calculateProject(input, item);
              return (
                <Card key={item}>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{scenarioLabels[item]}场景</p>
                  <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-50">
                    {formatPercent(scenarioResult.projectIRR, 2)}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">NPV {formatMoney(scenarioResult.npvMillionUSD)}</p>
                </Card>
              );
            })}
          </section>
        </div>
      </section>
    </div>
  );
}

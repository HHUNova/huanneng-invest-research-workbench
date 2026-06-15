import { useMemo } from "react";
import { Activity, Building2, CircleDollarSign, Gauge, TrendingUp } from "lucide-react";
import { EChart, type EChartOption } from "../components/charts/EChart";
import { DataSourceTag } from "../components/common/DataSourceTag";
import { MetricCard } from "../components/common/MetricCard";
import { PageHeader } from "../components/common/PageHeader";
import { Badge } from "../components/ui/Badge";
import { Card, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Field, UnderlineSelect } from "../components/ui/Field";
import { getCountries, getDataSourceNotes, getMarketCharts, getMarketSummary, type MarketFilters } from "../services/dataService";
import { formatNumber, formatPercent } from "../lib/utils";
import { regionLabels, riskLabels, trackLabels } from "../lib/labels";
import type { Region, RiskLevel, Track } from "../types";

const allTracks: Array<Track | "all"> = ["all", "solar", "onshoreWind", "offshoreWind", "storage", "hydro"];
const allRegions: Array<Region | "all"> = [
  "all",
  "southeastAsia",
  "southAsia",
  "centralAsia",
  "eastAsia",
  "middleEast",
  "latinAmerica",
  "europe",
  "africa",
];
const allRisks: Array<RiskLevel | "all"> = ["all", "A", "B", "C", "D", "E"];

const sourceTags = {
  marketScale: {
    text: "IRENA / IEA / WDI",
    confidence: "officialReference" as const,
    note: "覆盖新增装机、累计装机和投资规模等市场规模字段。",
  },
  tariffIrr: {
    text: "监管公告 / PPA / IEA",
    confidence: "modelEstimate" as const,
    note: "IRR 区间由公开电价、PPA、招标结果和技术经济参数估算。",
  },
  chineseProjects: {
    text: "项目库样本 / 公开公告",
    confidence: "modelEstimate" as const,
    note: "中资参与项目数为样本库统计口径，正式投委会前需按项目清单复核。",
  },
  attractiveness: {
    text: "WGI / IMF / IRENA / 信保",
    confidence: "modelEstimate" as const,
    note: "投资吸引力为多指标模型评分，不替代专项尽调结论。",
  },
  regionGrowth: {
    text: "IRENA / IEA / 样本库",
    confidence: "modelEstimate" as const,
    note: "区域增速按 2026 年样本区新增装机口径测算。",
  },
};

export function MarketDashboard({
  filters,
  onFiltersChange,
  onCountrySelect,
}: {
  filters: MarketFilters;
  onFiltersChange: (filters: MarketFilters) => void;
  onCountrySelect: (code: string) => void;
}) {
  const countries = useMemo(() => getCountries(filters), [filters]);
  const summary = useMemo(() => getMarketSummary(filters), [filters]);
  const charts = getMarketCharts();
  const dataSourceNotes = getDataSourceNotes();

  const mapOption: EChartOption = {
    tooltip: {
      trigger: "item",
      formatter: (params: any) => {
        const country = countries.find((item) => item.englishName === params.name);
        if (!country) return `${params.name}<br/>暂无纳入筛选样本`;
        return [
          `${country.name}`,
          `累计装机：${formatNumber(country.installedGW, 1)} GW`,
          `基准电价：${formatNumber(country.benchmarkTariffUSDPerMWh, 0)} USD/MWh`,
          `风险等级：${riskLabels[country.riskLevel]}`,
        ].join("<br/>");
      },
    },
    visualMap: {
      min: 55,
      max: 90,
      left: 16,
      bottom: 24,
      itemWidth: 12,
      itemHeight: 80,
      text: ["高", "低"],
      calculable: false,
      inRange: {
        color: ["#CCFBF1", "#99F6E4", "#5EEAD4", "#2DD4BF", "#0F766E"],
      },
      textStyle: { color: "#475569", fontSize: 12 },
    },
    series: [
      {
        type: "map",
        map: "huannengWorld",
        roam: true,
        zoom: 1.12,
        layoutCenter: ["55%", "49%"],
        layoutSize: "148%",
        emphasis: {
          label: { show: false },
          itemStyle: { areaColor: "#D97706", borderColor: "#0F172A", borderWidth: 1 },
        },
        itemStyle: {
          areaColor: "#E2E8F0",
          borderColor: "#E2E8F0",
          borderWidth: 0.5,
        },
        data: countries.map((country) => ({
          name: country.englishName,
          value: country.attractionScore,
        })),
      },
    ],
  };

  const investmentOption: EChartOption = {
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", data: charts.globalInvestmentTrend.map((item) => item.year) },
    yAxis: { type: "value", name: "十亿美元" },
    series: [
      {
        name: "投资规模",
        type: "bar",
        barWidth: 28,
        data: charts.globalInvestmentTrend.map((item) => item.investment),
        itemStyle: { color: "#0F766E", borderRadius: [4, 4, 0, 0] },
      },
      {
        name: "新增装机",
        type: "line",
        smooth: true,
        showSymbol: false,
        data: charts.globalInvestmentTrend.map((item) => item.capacity),
        lineStyle: { color: "#D97706", width: 2 },
      },
    ],
  };

  const growthOption: EChartOption = {
    tooltip: { trigger: "axis" },
    grid: { top: 24, right: 24, bottom: 24, left: 96, containLabel: true },
    xAxis: { type: "value", axisLabel: { formatter: (value: number) => `${value}%` } },
    yAxis: {
      type: "category",
      data: charts.regionGrowthRanking.map((item) => regionLabels[item.region]),
    },
    series: [
      {
        name: "装机增速",
        type: "bar",
        barWidth: 16,
        data: charts.regionGrowthRanking.map((item) => Number((item.growth * 100).toFixed(1))),
        itemStyle: { color: "#0F766E", borderRadius: [0, 4, 4, 0] },
      },
    ],
  };

  return (
    <div>
      <PageHeader
        eyebrow="市场筛选"
        title="全球投融资市场看板"
        description="按赛道、区域和风险等级筛选海外新能源投资机会，快速识别适合中资参与的国家样本。"
      />

      <section className="mb-6 rounded-md border border-slate-200 bg-slate-50 p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-6 md:grid-cols-3">
          <Field label="赛道">
            <UnderlineSelect
              value={filters.track}
              onChange={(event) => onFiltersChange({ ...filters, track: event.target.value as MarketFilters["track"] })}
            >
              {allTracks.map((track) => (
                <option key={track} value={track}>
                  {track === "all" ? "全部赛道" : trackLabels[track]}
                </option>
              ))}
            </UnderlineSelect>
          </Field>
          <Field label="区域">
            <UnderlineSelect
              value={filters.region}
              onChange={(event) => onFiltersChange({ ...filters, region: event.target.value as MarketFilters["region"] })}
            >
              {allRegions.map((region) => (
                <option key={region} value={region}>
                  {region === "all" ? "全部区域" : regionLabels[region]}
                </option>
              ))}
            </UnderlineSelect>
          </Field>
          <Field label="风险等级">
            <UnderlineSelect
              value={filters.riskLevel}
              onChange={(event) =>
                onFiltersChange({ ...filters, riskLevel: event.target.value as MarketFilters["riskLevel"] })
              }
            >
              {allRisks.map((risk) => (
                <option key={risk} value={risk}>
                  {risk === "all" ? "全部等级" : riskLabels[risk]}
                </option>
              ))}
            </UnderlineSelect>
          </Field>
        </div>
      </section>

      <section className="mb-6 grid items-start gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="rounded-lg p-8">
          <CardHeader>
            <div>
              <CardTitle>投资吸引力世界地图</CardTitle>
              <CardDescription>主色五级色阶表示国家新能源投资吸引力，点击国家进入详情。</CardDescription>
            </div>
            <Badge>{summary.countryCount} 个样本</Badge>
          </CardHeader>
          <EChart
            option={mapOption}
            height={360}
            onClick={(params: any) => {
              const country = countries.find((item) => item.englishName === params.name);
              if (country) onCountrySelect(country.code);
            }}
          />
          <div className="mt-3 flex justify-end">
            <DataSourceTag
              source={sourceTags.attractiveness.text}
              confidence={sourceTags.attractiveness.confidence}
              note={sourceTags.attractiveness.note}
            />
          </div>
        </Card>

        <Card className="rounded-lg p-8">
          <CardHeader>
            <div>
              <CardTitle>筛选样本</CardTitle>
              <CardDescription>按投资吸引力排序的国家清单。</CardDescription>
            </div>
          </CardHeader>
          <div className="max-h-96 space-y-4 overflow-y-auto pr-2">
            {countries
              .slice()
              .sort((a, b) => b.attractionScore - a.attractionScore)
              .map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => onCountrySelect(country.code)}
                  className="flex w-full items-center justify-between rounded-sm border border-slate-200 bg-slate-100 px-4 py-3 text-left transition-all duration-150 ease-financial hover:-translate-y-0.5 hover:shadow-hover dark:border-slate-800 dark:bg-slate-950"
                >
                  <span>
                    <span className="block text-base font-medium text-slate-900 dark:text-slate-50">{country.name}</span>
                    <span className="mt-1 block text-xs text-slate-400">
                      {regionLabels[country.region]} · {country.chineseProjects} 个中资项目
                    </span>
                  </span>
                  <span className="text-lg font-semibold text-primary-700">{country.attractionScore}</span>
                </button>
              ))}
          </div>
          <div className="mt-3 flex justify-end">
            <DataSourceTag
              source={sourceTags.attractiveness.text}
              confidence={sourceTags.attractiveness.confidence}
              note={sourceTags.attractiveness.note}
            />
          </div>
        </Card>
      </section>

      <section className="mb-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="当年新增装机"
          value={formatNumber(summary.newCapacity, 1)}
          suffix="GW"
          icon={<Activity className="h-5 w-5" strokeWidth={1.5} />}
          trend={[41, 46, 52, 59, summary.newCapacity]}
          source={sourceTags.marketScale}
        />
        <MetricCard
          label="总投资规模"
          value={formatNumber(summary.investment, 1)}
          suffix="十亿美元"
          icon={<CircleDollarSign className="h-5 w-5" strokeWidth={1.5} />}
          trend={[31, 36, 43, 48, summary.investment]}
          source={sourceTags.marketScale}
        />
        <MetricCard
          label="平均 IRR 区间"
          value={`${formatPercent(summary.averageIrrLow, 1)}-${formatPercent(summary.averageIrrHigh, 1)}`}
          icon={<Gauge className="h-5 w-5" strokeWidth={1.5} />}
          trend={[7.1, 7.8, 8.4, 8.9, summary.averageIrrHigh * 100]}
          source={sourceTags.tariffIrr}
        />
        <MetricCard
          label="中资参与项目数"
          value={formatNumber(summary.chineseProjects, 0)}
          suffix="个"
          icon={<Building2 className="h-5 w-5" strokeWidth={1.5} />}
          trend={[58, 72, 86, 104, summary.chineseProjects]}
          source={sourceTags.chineseProjects}
        />
      </section>

      <section className="mb-6 grid gap-6 lg:grid-cols-2">
        <Card className="rounded-lg p-8">
          <CardHeader>
            <div>
              <CardTitle>近5年投资规模走势</CardTitle>
              <CardDescription>柱状图为投资规模，折线为新增装机。</CardDescription>
            </div>
            <TrendingUp aria-hidden="true" className="h-5 w-5 text-primary-700" strokeWidth={1.5} />
          </CardHeader>
          <EChart option={investmentOption} height={320} />
          <div className="mt-3 flex justify-end">
            <DataSourceTag
              source={sourceTags.marketScale.text}
              confidence={sourceTags.marketScale.confidence}
              note={sourceTags.marketScale.note}
            />
          </div>
        </Card>
        <Card className="rounded-lg p-8">
          <CardHeader>
            <div>
              <CardTitle>区域装机增速排名</CardTitle>
              <CardDescription>按 2026 年样本区域新增装机增速排序。</CardDescription>
            </div>
          </CardHeader>
          <EChart option={growthOption} height={320} />
          <div className="mt-3 flex justify-end">
            <DataSourceTag
              source={sourceTags.regionGrowth.text}
              confidence={sourceTags.regionGrowth.confidence}
              note={sourceTags.regionGrowth.note}
            />
          </div>
        </Card>
      </section>

      <section className="rounded-md border border-slate-200 bg-slate-50 p-6 text-xs text-slate-400 dark:border-slate-800 dark:bg-slate-900">
        {dataSourceNotes.map((note) => (
          <p key={note}>{note}</p>
        ))}
      </section>
    </div>
  );
}

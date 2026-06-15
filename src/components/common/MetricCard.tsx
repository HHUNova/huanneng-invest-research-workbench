import type { ReactNode } from "react";
import { Card } from "../ui/Card";
import { EChart, type EChartOption } from "../charts/EChart";
import { DataSourceTag } from "./DataSourceTag";
import type { DataConfidence } from "../../lib/dataQuality";

export function MetricCard({
  label,
  value,
  suffix,
  icon,
  trend,
  source,
}: {
  label: string;
  value: string;
  suffix?: string;
  icon: ReactNode;
  trend: number[];
  source?: {
    text: string;
    confidence?: DataConfidence;
    note?: string;
  };
}) {
  const option: EChartOption = {
    grid: { top: 4, right: 0, bottom: 4, left: 0 },
    xAxis: { type: "category", show: false, data: trend.map((_, index) => String(index + 1)) },
    yAxis: { type: "value", show: false, min: Math.min(...trend) * 0.96, max: Math.max(...trend) * 1.04 },
    series: [
      {
        type: "line",
        data: trend,
        showSymbol: false,
        smooth: true,
        lineStyle: { color: "#0F766E", width: 2 },
        areaStyle: { color: "#F0FDFA" },
      },
    ],
  };

  return (
    <Card className="min-h-36 sm:min-h-40">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-slate-600 dark:text-slate-400">{label}</p>
          <p className="mt-3 text-xl font-semibold text-slate-900 dark:text-slate-50 sm:text-2xl">
            {value}
            {suffix ? <span className="ml-1 text-sm font-normal text-slate-400">{suffix}</span> : null}
          </p>
        </div>
        <div className="shrink-0 rounded-sm border border-slate-200 bg-slate-100 p-2 text-primary-700 dark:border-slate-800 dark:bg-slate-950">
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <EChart option={option} height={48} />
      </div>
      {source ? (
        <div className="mt-2 flex justify-start sm:justify-end">
          <DataSourceTag source={source.text} confidence={source.confidence} note={source.note} />
        </div>
      ) : null}
    </Card>
  );
}

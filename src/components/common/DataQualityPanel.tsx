import { DataQualityBadge } from "./DataQualityBadge";
import type { FieldProvenance } from "../../lib/dataQuality";
import { confidenceDescriptions, getSourceRefs } from "../../lib/dataQuality";

interface DataQualityPanelProps {
  title?: string;
  description?: string;
  groups: FieldProvenance[];
  className?: string;
}

export function DataQualityPanel({
  title = "数据可信度",
  description = "按字段展示来源、年份、更新时间和置信等级。",
  groups,
  className = "",
}: DataQualityPanelProps) {
  const sourceRefs = Array.from(
    new Map(
      groups.flatMap((group) => getSourceRefs(group.sourceIds)).map((source) => [source.id, source] as const),
    ).values(),
  );

  return (
    <section className={`rounded-lg border border-slate-200 bg-white p-6 shadow-card ${className}`}>
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="text-xl font-medium leading-[1.4] text-slate-900">{title}</h3>
          <p className="mt-1 text-sm leading-[1.5] text-slate-600">{description}</p>
        </div>
        <div className="text-xs leading-[1.4] text-slate-400">字段级溯源</div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {groups.map((group) => (
          <div key={group.id} className="rounded border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-medium leading-[1.5] text-slate-900">{group.label}</div>
                <div className="mt-1 text-xs leading-[1.4] text-slate-400">
                  {group.year} · 更新 {group.lastUpdated}
                </div>
              </div>
              <DataQualityBadge confidence={group.confidence} />
            </div>
            <p className="mt-3 text-sm leading-[1.5] text-slate-600">{group.note}</p>
            <p className="mt-2 text-xs leading-[1.4] text-slate-400">
              {confidenceDescriptions[group.confidence]}
            </p>
          </div>
        ))}
      </div>

      {sourceRefs.length > 0 ? (
        <div className="mt-4 border-t border-slate-200 pt-4">
          <div className="text-sm font-medium leading-[1.5] text-slate-900">权威来源目录</div>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {sourceRefs.map((source) => (
              <a
                key={source.id}
                className="rounded border border-slate-200 bg-white p-3 text-sm leading-[1.5] text-slate-600 transition duration-150 ease-standard hover:-translate-y-0.5 hover:shadow-hover"
                href={source.url}
                target="_blank"
                rel="noreferrer"
              >
                <span className="block font-medium text-slate-900">{source.organization}</span>
                <span className="block">{source.name}</span>
                <span className="mt-1 block text-xs leading-[1.4] text-slate-400">
                  更新频率：{source.updateCadence}
                </span>
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

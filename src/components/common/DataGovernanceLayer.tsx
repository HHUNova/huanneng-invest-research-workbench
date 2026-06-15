import { useMemo, useState, type ReactNode } from "react";
import { ShieldCheck, X } from "lucide-react";
import { countries } from "../../data/countries";
import { DataQualityBadge } from "./DataQualityBadge";
import {
  DATA_QUALITY_LAST_UPDATED,
  confidenceDescriptions,
  getDataQualitySummary,
  sourceCatalog,
  type DataConfidence,
} from "../../lib/dataQuality";

interface DataGovernanceLayerProps {
  children: ReactNode;
}

const statuses: DataConfidence[] = [
  "officialReference",
  "modelEstimate",
  "needsDiligence",
  "userInput",
];

export function DataGovernanceLayer({ children }: DataGovernanceLayerProps) {
  const [open, setOpen] = useState(false);
  const summary = useMemo(() => getDataQualitySummary(countries), []);
  const sources = Object.values(sourceCatalog);

  return (
    <>
      {children}
      <aside className="fixed bottom-28 right-3 z-50 max-w-[calc(100vw-24px)] lg:bottom-4 lg:right-4 lg:max-w-[calc(100vw-32px)]">
        {open ? (
          <div className="w-96 max-w-full rounded-lg border border-slate-200 bg-white p-4 shadow-hover">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" strokeWidth={1.5} />
                <div>
                  <div className="text-sm font-medium leading-[1.5] text-slate-900">底层数据可信度</div>
                  <div className="text-xs leading-[1.4] text-slate-400">
                    更新 {DATA_QUALITY_LAST_UPDATED} · {summary.countryCount} 个国家样本
                  </div>
                </div>
              </div>
              <button
                aria-label="关闭数据可信度面板"
                className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 text-slate-600 transition duration-150 ease-standard hover:bg-slate-50"
                onClick={() => setOpen(false)}
                type="button"
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>

            <div className="mt-4 grid gap-2">
              {statuses.map((status) => (
                <div key={status} className="rounded border border-slate-200 bg-slate-50 p-3">
                  <DataQualityBadge confidence={status} />
                  <p className="mt-2 text-xs leading-[1.4] text-slate-600">{confidenceDescriptions[status]}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t border-slate-200 pt-3">
              <div className="text-xs font-medium leading-[1.4] text-slate-900">权威来源目录</div>
              <div className="mt-2 grid max-h-40 gap-2 overflow-y-auto pr-1">
                {sources.map((source) => (
                  <a
                    key={source.id}
                    className="rounded border border-slate-200 bg-white p-2 text-xs leading-[1.4] text-slate-600 transition duration-150 ease-standard hover:-translate-y-0.5 hover:shadow-hover"
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="font-medium text-slate-900">{source.organization}</span>
                    <span className="block">{source.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <button
            className="flex items-center gap-2 rounded border border-slate-200 bg-white px-3 py-2 text-sm leading-[1.5] text-slate-600 shadow-card transition duration-150 ease-standard hover:-translate-y-0.5 hover:shadow-hover"
            onClick={() => setOpen(true)}
            type="button"
          >
            <ShieldCheck className="h-4 w-4 text-primary" strokeWidth={1.5} />
            <span>数据可信度</span>
            <DataQualityBadge confidence="modelEstimate" />
          </button>
        )}
      </aside>
    </>
  );
}

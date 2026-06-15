import { Database } from "lucide-react";
import type { DataConfidence } from "../../lib/dataQuality";
import { confidenceLabels } from "../../lib/dataQuality";
import { cn } from "../../lib/utils";

interface DataSourceTagProps {
  source: string;
  confidence?: DataConfidence;
  note?: string;
  className?: string;
}

export function DataSourceTag({ source, confidence, note, className }: DataSourceTagProps) {
  const title = [
    `数据来源：${source}`,
    confidence ? `可信度：${confidenceLabels[confidence]}` : null,
    note,
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1 rounded border border-slate-200 bg-white px-2 py-1 text-[11px] leading-none text-slate-500",
        "dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400",
        className,
      )}
      title={title}
    >
      <Database aria-hidden="true" className="h-3 w-3 shrink-0 text-primary-700" strokeWidth={1.5} />
      <span className="truncate">来源：{source}</span>
      {confidence ? <span className="hidden shrink-0 text-slate-400 sm:inline">· {confidenceLabels[confidence]}</span> : null}
    </span>
  );
}

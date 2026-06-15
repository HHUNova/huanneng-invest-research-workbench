import type { DataConfidence } from "../../lib/dataQuality";
import { confidenceLabels, confidenceToneClasses } from "../../lib/dataQuality";

interface DataQualityBadgeProps {
  confidence: DataConfidence;
  className?: string;
}

export function DataQualityBadge({ confidence, className = "" }: DataQualityBadgeProps) {
  return (
    <span
      className={[
        "inline-flex h-6 items-center rounded px-2 text-xs font-medium leading-none",
        "border",
        confidenceToneClasses[confidence],
        className,
      ].join(" ")}
    >
      {confidenceLabels[confidence]}
    </span>
  );
}

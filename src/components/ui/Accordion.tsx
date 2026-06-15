import { ChevronDown } from "lucide-react";
import { type ReactNode } from "react";
import { cn } from "../../lib/utils";

export function AccordionItem({
  title,
  description,
  open,
  onToggle,
  children,
}: {
  title: string;
  description?: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-4 px-4 py-4 text-left sm:px-6"
      >
        <span className="min-w-0">
          <span className="block text-base font-medium text-slate-900 dark:text-slate-50">{title}</span>
          {description ? <span className="mt-1 block text-sm text-slate-600 dark:text-slate-400">{description}</span> : null}
        </span>
        <ChevronDown
          aria-hidden="true"
          strokeWidth={1.5}
          className={cn(
            "mt-1 h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ease-financial",
            open && "rotate-180",
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-all duration-200 ease-financial",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="border-t border-slate-200 p-4 dark:border-slate-800 sm:p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

import { cn } from "../../lib/utils";

export interface SegmentedOption<T extends string> {
  label: string;
  value: T;
}

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  className,
}: {
  value: T;
  options: SegmentedOption<T>[];
  onChange: (value: T) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full rounded-sm border border-slate-200 bg-slate-100 p-1 dark:border-slate-800 dark:bg-slate-900 sm:inline-flex sm:w-auto",
        className,
      )}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "h-8 min-w-0 flex-1 truncate rounded-sm px-3 text-sm font-medium text-slate-600 transition-all duration-150 ease-financial dark:text-slate-400 sm:flex-none",
            value === option.value && "bg-slate-50 text-primary-700 shadow-card dark:bg-slate-950 dark:text-primary-300",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

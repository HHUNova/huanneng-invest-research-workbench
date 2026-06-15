import { type InputHTMLAttributes, type SelectHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface FieldProps {
  label: string;
  hint?: string;
  className?: string;
}

export function Field({
  label,
  hint,
  className,
  children,
}: FieldProps & {
  children: React.ReactNode;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-2 block text-sm text-slate-600 dark:text-slate-400">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-slate-400">{hint}</span> : null}
    </label>
  );
}

export function UnderlineInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-10 w-full border-0 border-b border-slate-200 bg-transparent px-0 text-base text-slate-900 outline-none transition-colors duration-150 ease-financial placeholder:text-slate-400 focus:border-primary-700 dark:border-slate-800 dark:text-slate-50",
        className,
      )}
      {...props}
    />
  );
}

export function UnderlineSelect({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-10 w-full border-0 border-b border-slate-200 bg-transparent px-0 text-base text-slate-900 outline-none transition-colors duration-150 ease-financial focus:border-primary-700 dark:border-slate-800 dark:text-slate-50",
        className,
      )}
      {...props}
    />
  );
}

import { type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={cn(
        "rounded-md border border-slate-200 bg-slate-50 p-4 shadow-card transition-all duration-150 ease-financial hover:-translate-y-0.5 hover:shadow-hover dark:border-slate-800 dark:bg-slate-900 sm:p-6",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4", className)}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-base font-medium text-slate-900 dark:text-slate-50 sm:text-lg", className)} {...props} />;
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("mt-1 text-sm text-slate-600 dark:text-slate-400", className)} {...props} />;
}

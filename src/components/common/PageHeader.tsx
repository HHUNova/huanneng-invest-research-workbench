import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:mb-8 sm:gap-6 lg:flex-row lg:items-end">
      <div className="max-w-3xl">
        {eyebrow ? <p className="mb-2 text-sm font-medium text-primary-700">{eyebrow}</p> : null}
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50 sm:text-2xl">{title}</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 sm:mt-3 sm:text-base">{description}</p>
      </div>
      {actions ? (
        <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
          {actions}
        </div>
      ) : null}
    </div>
  );
}

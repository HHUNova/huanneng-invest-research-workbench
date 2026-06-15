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
    <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
      <div className="max-w-3xl">
        {eyebrow ? <p className="mb-2 text-sm font-medium text-primary-700">{eyebrow}</p> : null}
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">{title}</h1>
        <p className="mt-3 text-base text-slate-600 dark:text-slate-400">{description}</p>
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-3">{actions}</div> : null}
    </div>
  );
}

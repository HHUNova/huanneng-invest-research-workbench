import { Download, FileSpreadsheet } from "lucide-react";
import { dueDiligenceCategories, trackSpecificChecks } from "../data/dueDiligence";
import { PageHeader } from "../components/common/PageHeader";
import { Button } from "../components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Field, UnderlineSelect } from "../components/ui/Field";
import { trackLabels } from "../lib/labels";
import type { Track } from "../types";

const tracks: Track[] = ["solar", "onshoreWind", "offshoreWind", "storage", "hydro"];

export function DueDiligencePage({
  track,
  onTrackChange,
}: {
  track: Track;
  onTrackChange: (track: Track) => void;
}) {
  function exportCsv() {
    const rows = [
      ["类别", "清单事项"],
      ...dueDiligenceCategories.flatMap((category) => category.items.map((item) => [category.name, item])),
      ...trackSpecificChecks[track].map((item) => [trackLabels[track], item]),
    ];
    const csv = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `寰能投研_${trackLabels[track]}尽调清单.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <PageHeader
        eyebrow="预留模块"
        title="合规尽调工具箱"
        description="按工程、财务、法律和 ESG 四类生成项目尽调清单，并预留按国家定制的扩展口。"
        actions={
          <Button onClick={exportCsv}>
            <Download aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
            导出 Excel
          </Button>
        }
      />

      <section className="mb-6 rounded-md border border-slate-200 bg-slate-50 p-4 shadow-card dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <Field label="赛道">
          <UnderlineSelect value={track} onChange={(event) => onTrackChange(event.target.value as Track)}>
            {tracks.map((item) => (
              <option key={item} value={item}>
                {trackLabels[item]}
              </option>
            ))}
          </UnderlineSelect>
        </Field>
      </section>

      <section className="grid gap-6 lg:grid-cols-4">
        {dueDiligenceCategories.map((category) => (
          <Card key={category.name} className="rounded-lg p-4 sm:p-6 lg:p-8">
            <CardHeader>
              <div>
                <CardTitle>{category.name}</CardTitle>
                <CardDescription>核心尽调事项</CardDescription>
              </div>
              <FileSpreadsheet aria-hidden="true" className="h-5 w-5 text-primary-700" strokeWidth={1.5} />
            </CardHeader>
            <div className="space-y-3">
              {category.items.map((item) => (
                <div key={item} className="rounded-sm border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                  {item}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </section>

      <section className="mt-6 rounded-md border border-slate-200 bg-slate-50 p-4 shadow-card dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-50">{trackLabels[track]}专项检查</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {trackSpecificChecks[track].map((item) => (
            <div key={item} className="rounded-sm border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
              {item}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

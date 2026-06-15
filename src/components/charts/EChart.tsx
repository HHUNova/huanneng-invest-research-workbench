import { useEffect, useRef } from "react";
import * as echarts from "echarts/core";
import {
  BarChart,
  CustomChart,
  GaugeChart,
  HeatmapChart,
  LineChart,
  MapChart,
} from "echarts/charts";
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import type { ComposeOption } from "echarts/core";
import type {
  BarSeriesOption,
  CustomSeriesOption,
  GaugeSeriesOption,
  HeatmapSeriesOption,
  LineSeriesOption,
  MapSeriesOption,
} from "echarts/charts";
import type {
  GridComponentOption,
  LegendComponentOption,
  TitleComponentOption,
  TooltipComponentOption,
  VisualMapComponentOption,
} from "echarts/components";
import { financialThemeName, registerFinancialTheme } from "../../lib/echartsTheme";
import { cn } from "../../lib/utils";
import worldGeoJson from "echarts-countries-js/world-x.json";

echarts.use([
  BarChart,
  CustomChart,
  GaugeChart,
  HeatmapChart,
  LineChart,
  MapChart,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
  CanvasRenderer,
]);

registerFinancialTheme();
echarts.registerMap("huannengWorld", worldGeoJson as any);

export type EChartOption = ComposeOption<
  | BarSeriesOption
  | CustomSeriesOption
  | GaugeSeriesOption
  | HeatmapSeriesOption
  | LineSeriesOption
  | MapSeriesOption
  | GridComponentOption
  | LegendComponentOption
  | TitleComponentOption
  | TooltipComponentOption
  | VisualMapComponentOption
>;

export function EChart({
  option,
  height = 320,
  className,
  onClick,
}: {
  option: EChartOption;
  height?: number | string;
  className?: string;
  onClick?: (params: unknown) => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!ref.current) return undefined;
    const node = ref.current;
    instanceRef.current = echarts.init(node, financialThemeName);

    const resize = () => instanceRef.current?.resize();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(resize);

    observer?.observe(node);
    window.addEventListener("resize", resize);
    requestAnimationFrame(resize);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", resize);
      instanceRef.current?.dispose();
      instanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    instanceRef.current?.setOption(option, true);
  }, [option]);

  useEffect(() => {
    const instance = instanceRef.current;
    if (!instance || !onClick) return undefined;

    instance.on("click", onClick);
    return () => {
      instance.off("click", onClick);
    };
  }, [onClick]);

  return <div ref={ref} className={cn("min-w-0 w-full", className)} style={{ height }} />;
}

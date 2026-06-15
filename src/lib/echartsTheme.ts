import * as echarts from "echarts/core";

export const financialThemeName = "huanneng-financial";

export function registerFinancialTheme() {
  echarts.registerTheme(financialThemeName, {
    color: ["#0F766E", "#D97706", "#2563EB", "#059669", "#475569"],
    backgroundColor: "transparent",
    textStyle: {
      color: "#0F172A",
      fontFamily:
        "Inter, HarmonyOS Sans, Source Han Sans SC, Noto Sans CJK SC, Microsoft YaHei, sans-serif",
      fontSize: 12,
      fontWeight: 400,
    },
    grid: {
      top: 32,
      right: 24,
      bottom: 32,
      left: 48,
      containLabel: true,
    },
    categoryAxis: {
      axisLine: { lineStyle: { color: "#E2E8F0" } },
      axisTick: { show: false },
      axisLabel: { color: "#475569" },
      splitLine: { show: false },
    },
    valueAxis: {
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: "#475569" },
      splitLine: { lineStyle: { color: "#E2E8F0", type: "dashed" } },
    },
    tooltip: {
      backgroundColor: "#F8FAFC",
      borderColor: "#E2E8F0",
      borderWidth: 1,
      textStyle: { color: "#0F172A", fontSize: 12 },
      extraCssText:
        "box-shadow:0 4px 6px -1px rgba(0,0,0,0.07),0 2px 4px -2px rgba(0,0,0,0.05);border-radius:8px;",
    },
    legend: {
      textStyle: { color: "#475569" },
      itemWidth: 12,
      itemHeight: 8,
    },
  });
}

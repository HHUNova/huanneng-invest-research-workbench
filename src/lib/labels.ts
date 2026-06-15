import type { Region, RiskLevel, Scenario, Track } from "../types";

export const trackLabels: Record<Track, string> = {
  solar: "光伏",
  onshoreWind: "陆上风电",
  offshoreWind: "海上风电",
  storage: "储能",
  hydro: "水电",
};

export const regionLabels: Record<Region, string> = {
  southeastAsia: "东南亚",
  southAsia: "南亚",
  centralAsia: "中亚",
  eastAsia: "东亚",
  middleEast: "中东",
  latinAmerica: "拉美",
  europe: "欧洲",
  africa: "非洲",
};

export const riskLabels: Record<RiskLevel, string> = {
  A: "A 低风险",
  B: "B 可控",
  C: "C 中性",
  D: "D 偏高",
  E: "E 高风险",
};

export const scenarioLabels: Record<Scenario, string> = {
  base: "基准",
  optimistic: "乐观",
  pessimistic: "悲观",
};

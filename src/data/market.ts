import type { Region } from "../types";

export const globalInvestmentTrend = [
  { year: "2022", investment: 348, capacity: 295 },
  { year: "2023", investment: 392, capacity: 361 },
  { year: "2024", investment: 438, capacity: 426 },
  { year: "2025", investment: 472, capacity: 489 },
  { year: "2026", investment: 526, capacity: 552 },
];

export const regionGrowthRanking: Array<{ region: Region; growth: number; capacityGW: number }> = [
  { region: "middleEast", growth: 0.31, capacityGW: 18.4 },
  { region: "southAsia", growth: 0.28, capacityGW: 19.6 },
  { region: "africa", growth: 0.24, capacityGW: 13.1 },
  { region: "centralAsia", growth: 0.22, capacityGW: 7.8 },
  { region: "latinAmerica", growth: 0.21, capacityGW: 15.2 },
  { region: "southeastAsia", growth: 0.19, capacityGW: 12.6 },
  { region: "eastAsia", growth: 0.14, capacityGW: 10.2 },
  { region: "europe", growth: 0.12, capacityGW: 21.8 },
];

export const dataSourceNotes = [
  "MVP 静态样例数据参考 IRENA、IEA、世界银行公开指标口径整理。",
  "国家基准电价、融资成本和风险评分用于产品演示，正式投委会前需替换为尽调数据。",
  "数据接口已通过 services/dataService.ts 预留，可切换 Supabase 或第三方 API。",
];

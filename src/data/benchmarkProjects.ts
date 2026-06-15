import type { Track } from "../types";

export interface BenchmarkProject {
  name: string;
  countryCode: string;
  track: Track;
  capacityMW: number;
  investmentMillionUSD: number;
  financing: string;
  irrRange: [number, number];
}

export const benchmarkProjects: BenchmarkProject[] = [
  {
    name: "中东大型光伏 IPP 标杆",
    countryCode: "SA",
    track: "solar",
    capacityMW: 700,
    investmentMillionUSD: 420,
    financing: "70% 银团贷款 + 30% 股本金",
    irrRange: [0.075, 0.101],
  },
  {
    name: "拉美风光储组合资产",
    countryCode: "BR",
    track: "onshoreWind",
    capacityMW: 420,
    investmentMillionUSD: 520,
    financing: "当地开发银行长期贷款 + 出口信贷",
    irrRange: [0.092, 0.124],
  },
  {
    name: "东南亚工商业储能项目",
    countryCode: "VN",
    track: "storage",
    capacityMW: 120,
    investmentMillionUSD: 78,
    financing: "企业自有资金 + 设备租赁",
    irrRange: [0.105, 0.146],
  },
  {
    name: "欧洲运营期光伏收购",
    countryCode: "ES",
    track: "solar",
    capacityMW: 180,
    investmentMillionUSD: 135,
    financing: "项目融资再融资 + 少数股权并购",
    irrRange: [0.065, 0.088],
  },
  {
    name: "南亚流域水电开发项目",
    countryCode: "NP",
    track: "hydro",
    capacityMW: 260,
    investmentMillionUSD: 410,
    financing: "主权支持 PPA + 多边开发机构长期贷款",
    irrRange: [0.078, 0.11],
  },
];

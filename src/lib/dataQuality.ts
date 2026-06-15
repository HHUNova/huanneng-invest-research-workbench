import type { CountryProfile } from "../types";

export type DataConfidence =
  | "verified"
  | "officialReference"
  | "modelEstimate"
  | "userInput"
  | "needsDiligence";

export type DataSourceCategory =
  | "market"
  | "risk"
  | "finance"
  | "tax"
  | "legal"
  | "esg";

export interface DataSourceRef {
  id: string;
  name: string;
  organization: string;
  category: DataSourceCategory;
  url: string;
  updateCadence: string;
}

export interface FieldProvenance {
  id: string;
  label: string;
  fields: string[];
  confidence: DataConfidence;
  year: number;
  lastUpdated: string;
  sourceIds: string[];
  note: string;
}

export interface CountryDataQuality {
  countryCode: string;
  countryName: string;
  overall: DataConfidence;
  groups: FieldProvenance[];
}

export const DATA_QUALITY_LAST_UPDATED = "2026-06-15";

export const confidenceLabels: Record<DataConfidence, string> = {
  verified: "已核验",
  officialReference: "官方口径参考",
  modelEstimate: "模型估算",
  userInput: "用户输入",
  needsDiligence: "待尽调",
};

export const confidenceDescriptions: Record<DataConfidence, string> = {
  verified: "已完成来源交叉校验，可作为内部基准口径使用。",
  officialReference: "来自官方或国际机构公开口径，已静态化入库。",
  modelEstimate: "由公开口径、行业假设和模型参数推算，需在投决前复核。",
  userInput: "来自当前用户手动录入或覆盖，系统不默认背书。",
  needsDiligence: "需要结合项目文件、税务意见、法律意见或承保反馈确认。",
};

export const confidenceToneClasses: Record<DataConfidence, string> = {
  verified: "border-success/30 bg-success/10 text-success",
  officialReference: "border-primary/30 bg-primary/10 text-primary",
  modelEstimate: "border-warning/30 bg-warning/10 text-warning",
  userInput: "border-info/30 bg-info/10 text-info",
  needsDiligence: "border-error/30 bg-error/10 text-error",
};

export const sourceCatalog: Record<string, DataSourceRef> = {
  IRENA_CAPACITY: {
    id: "IRENA_CAPACITY",
    name: "Renewable capacity statistics",
    organization: "IRENA",
    category: "market",
    url: "https://www.irena.org/Publications/2025/Mar/Renewable-capacity-statistics-2025",
    updateCadence: "年度",
  },
  IEA_RENEWABLES: {
    id: "IEA_RENEWABLES",
    name: "Renewables market report",
    organization: "IEA",
    category: "market",
    url: "https://www.iea.org/reports/renewables-2024",
    updateCadence: "年度/半年度",
  },
  WORLD_BANK_WDI: {
    id: "WORLD_BANK_WDI",
    name: "World Development Indicators API",
    organization: "World Bank",
    category: "market",
    url: "https://datahelpdesk.worldbank.org/knowledgebase/articles/889392-about-the-indicators-api-documentation",
    updateCadence: "滚动更新",
  },
  WORLD_BANK_WGI: {
    id: "WORLD_BANK_WGI",
    name: "Worldwide Governance Indicators",
    organization: "World Bank",
    category: "risk",
    url: "https://www.worldbank.org/en/publication/worldwide-governance-indicators",
    updateCadence: "年度",
  },
  IMF_WEO: {
    id: "IMF_WEO",
    name: "World Economic Outlook",
    organization: "IMF",
    category: "risk",
    url: "https://www.imf.org/en/Publications/WEO",
    updateCadence: "半年度",
  },
  SINOSURE_COUNTRY_RISK: {
    id: "SINOSURE_COUNTRY_RISK",
    name: "国别风险与承保提示",
    organization: "中国信保",
    category: "risk",
    url: "https://www.sinosure.com.cn/",
    updateCadence: "不定期",
  },
  NATIONAL_REGULATOR: {
    id: "NATIONAL_REGULATOR",
    name: "电力监管机构、拍卖与PPA公告",
    organization: "东道国主管部门",
    category: "finance",
    url: "https://www.iea.org/policies",
    updateCadence: "按政策发布",
  },
  TAX_TREATY: {
    id: "TAX_TREATY",
    name: "避免双重征税协定与本地税法",
    organization: "国家税务总局/东道国税务机关",
    category: "tax",
    url: "https://www.chinatax.gov.cn/",
    updateCadence: "按法规发布",
  },
  BIT_TREATY: {
    id: "BIT_TREATY",
    name: "双边投资协定与投资保护条款",
    organization: "商务部/东道国主管部门",
    category: "legal",
    url: "http://tfs.mofcom.gov.cn/",
    updateCadence: "按条约状态更新",
  },
  IFC_ESG: {
    id: "IFC_ESG",
    name: "Performance Standards on Environmental and Social Sustainability",
    organization: "IFC",
    category: "esg",
    url: "https://www.ifc.org/",
    updateCadence: "按标准修订",
  },
};

export function getSourceRefs(sourceIds: string[]) {
  return sourceIds.map((id) => sourceCatalog[id]).filter(Boolean);
}

export function getCountryDataQuality(country: CountryProfile): CountryDataQuality {
  const groups: FieldProvenance[] = [
    {
      id: "market-scale",
      label: "装机与投资规模",
      fields: ["renewableCapacityMw", "annualNewCapacityMw", "investmentScaleUsdMn"],
      confidence: "officialReference",
      year: 2025,
      lastUpdated: DATA_QUALITY_LAST_UPDATED,
      sourceIds: ["IRENA_CAPACITY", "IEA_RENEWABLES", "WORLD_BANK_WDI"],
      note: "按公开年度统计和市场报告口径静态整理，后续可替换为API自动更新。",
    },
    {
      id: "tariff-irr",
      label: "基准电价与IRR区间",
      fields: ["benchmarkTariffUsdMwh", "irrRange", "lcoeUsdMwh"],
      confidence: "modelEstimate",
      year: 2026,
      lastUpdated: DATA_QUALITY_LAST_UPDATED,
      sourceIds: ["NATIONAL_REGULATOR", "IEA_RENEWABLES"],
      note: "由公开招标、PPA、市场报告与技术参数推算，投决前需替换为项目合同口径。",
    },
    {
      id: "risk-score",
      label: "五维风险评分",
      fields: ["risk.sovereign", "risk.construction", "risk.economic", "risk.legal", "risk.esg"],
      confidence: "officialReference",
      year: 2025,
      lastUpdated: DATA_QUALITY_LAST_UPDATED,
      sourceIds: ["WORLD_BANK_WGI", "IMF_WEO", "SINOSURE_COUNTRY_RISK", "IFC_ESG"],
      note: "评分模型参考治理、宏观、承保和ESG公开口径，不替代信保承保意见。",
    },
    {
      id: "tax-legal",
      label: "税务、BIT与法律合规",
      fields: ["treaties", "tax", "foreignOwnership", "land", "environmentalPermit"],
      confidence: "needsDiligence",
      year: 2026,
      lastUpdated: DATA_QUALITY_LAST_UPDATED,
      sourceIds: ["TAX_TREATY", "BIT_TREATY"],
      note: "仅作为尽调入口提示，需由税务和法律顾问按项目结构确认。",
    },
  ];

  return {
    countryCode: country.code,
    countryName: country.name,
    overall: "modelEstimate",
    groups,
  };
}

export function getUserInputProvenance(): FieldProvenance {
  return {
    id: "user-input",
    label: "用户覆盖参数",
    fields: ["calculator.inputs"],
    confidence: "userInput",
    year: 2026,
    lastUpdated: DATA_QUALITY_LAST_UPDATED,
    sourceIds: [],
    note: "测算引擎会实时使用用户输入覆盖内置默认值，导出报告应保留参数快照。",
  };
}

export function getDataQualitySummary(countries: CountryProfile[]) {
  const qualities = countries.map(getCountryDataQuality);
  const groupCount = qualities.reduce<Record<DataConfidence, number>>(
    (acc, quality) => {
      quality.groups.forEach((group) => {
        acc[group.confidence] += 1;
      });
      return acc;
    },
    {
      verified: 0,
      officialReference: 0,
      modelEstimate: 0,
      userInput: 0,
      needsDiligence: 0,
    },
  );

  return {
    countryCount: countries.length,
    lastUpdated: DATA_QUALITY_LAST_UPDATED,
    groupCount,
    sourceCount: Object.keys(sourceCatalog).length,
  };
}

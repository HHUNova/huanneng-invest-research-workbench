export type Track = "solar" | "onshoreWind" | "offshoreWind" | "storage" | "hydro";

export type Region =
  | "southeastAsia"
  | "southAsia"
  | "centralAsia"
  | "eastAsia"
  | "middleEast"
  | "latinAmerica"
  | "europe"
  | "africa";

export type RiskLevel = "A" | "B" | "C" | "D" | "E";

export type Scenario = "base" | "optimistic" | "pessimistic";

export type PageKey =
  | "market"
  | "calculator"
  | "risk"
  | "toolkit"
  | "projects"
  | "user"
  | "country";

export interface CountryDefaults {
  capacityMW: number;
  totalInvestmentMillionUSD: number;
  constructionYears: number;
  operatingYears: number;
  utilizationHours: number;
  degradationRate: number;
  curtailmentRate: number;
  auxiliaryPowerRate: number;
  omCostPerKWYear: number;
  tariffUSDPerMWh: number;
  subsidyUSDPerMWh: number;
  corporateTaxRate: number;
  vatRate: number;
  depreciationYears: number;
  equityRatio: number;
  loanInterestRate: number;
  loanTenorYears: number;
  gracePeriodYears: number;
  discountRate: number;
}

export interface RiskDimension {
  key: string;
  name: string;
  weight: number;
  score: number;
  items: Array<{
    label: string;
    value: string;
    score: number;
  }>;
}

export interface CountryProfile {
  code: string;
  name: string;
  englishName: string;
  region: Region;
  coordinates: [number, number];
  riskLevel: RiskLevel;
  attractionScore: number;
  installedGW: number;
  newCapacityGW2026: number;
  investmentBillionUSD2026: number;
  benchmarkTariffUSDPerMWh: number;
  chineseProjects: number;
  irrRange: [number, number];
  tracks: Track[];
  defaults: Record<Track, CountryDefaults>;
  risk: {
    dimensions: RiskDimension[];
    bit: string;
    dta: string;
    sinosure: string;
    summary: string;
  };
}

export interface CalculationInput extends CountryDefaults {
  countryCode: string;
  track: Track;
  technologyRoute: string;
  tariffMode: string;
  depreciationMethod: string;
}

export interface AnnualCashFlow {
  year: number;
  generationMWh: number;
  revenue: number;
  operatingCost: number;
  tax: number;
  debtService: number;
  projectCashFlow: number;
  equityCashFlow: number;
  cumulativeProjectCashFlow: number;
  discountedProjectCashFlow: number;
}

export interface CalculationResult {
  projectIRR: number;
  equityIRR: number;
  staticPaybackYears: number;
  npvMillionUSD: number;
  lcoeUSDPerMWh: number;
  annualCashFlows: AnnualCashFlow[];
  sensitivity: SensitivityResult[];
  matrix: SensitivityMatrixCell[];
  scenario: Scenario;
}

export interface SensitivityResult {
  variable: string;
  downsideNpv: number;
  upsideNpv: number;
  spread: number;
}

export interface SensitivityMatrixCell {
  variable: string;
  delta: number;
  projectIRR: number;
  npvMillionUSD: number;
}

export interface SavedProject {
  id: string;
  name: string;
  createdAt: string;
  input: CalculationInput;
  result: CalculationResult;
}

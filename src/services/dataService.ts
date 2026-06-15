import { benchmarkProjects } from "../data/benchmarkProjects";
import { countries, countryByCode } from "../data/countries";
import { dataSourceNotes, globalInvestmentTrend, regionGrowthRanking } from "../data/market";
import type { Region, RiskLevel, Track } from "../types";

export interface MarketFilters {
  track: Track | "all";
  region: Region | "all";
  riskLevel: RiskLevel | "all";
}

export function getCountries(filters?: Partial<MarketFilters>) {
  return countries.filter((country) => {
    const trackMatched = !filters?.track || filters.track === "all" || country.tracks.includes(filters.track);
    const regionMatched = !filters?.region || filters.region === "all" || country.region === filters.region;
    const riskMatched = !filters?.riskLevel || filters.riskLevel === "all" || country.riskLevel === filters.riskLevel;
    return trackMatched && regionMatched && riskMatched;
  });
}

export function getCountry(code: string) {
  return countryByCode[code] ?? countries[0];
}

export function getMarketSummary(filters: MarketFilters) {
  const selectedCountries = getCountries(filters);

  return {
    newCapacity: selectedCountries.reduce((total, country) => total + country.newCapacityGW2026, 0),
    investment: selectedCountries.reduce((total, country) => total + country.investmentBillionUSD2026, 0),
    averageIrrLow:
      selectedCountries.reduce((total, country) => total + country.irrRange[0], 0) /
      Math.max(selectedCountries.length, 1),
    averageIrrHigh:
      selectedCountries.reduce((total, country) => total + country.irrRange[1], 0) /
      Math.max(selectedCountries.length, 1),
    chineseProjects: selectedCountries.reduce((total, country) => total + country.chineseProjects, 0),
    countryCount: selectedCountries.length,
  };
}

export function getMarketCharts() {
  return {
    globalInvestmentTrend,
    regionGrowthRanking,
  };
}

export function getBenchmarkProjects() {
  return benchmarkProjects;
}

export function getDataSourceNotes() {
  return dataSourceNotes;
}

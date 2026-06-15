import { countries } from "../data/countries";
import type { CountryProfile } from "../types";
import {
  getCountryDataQuality,
  getDataQualitySummary,
  getSourceRefs,
  getUserInputProvenance,
  sourceCatalog,
  type CountryDataQuality,
} from "./dataQuality";

export interface TrustedCountryRecord {
  data: CountryProfile;
  quality: CountryDataQuality;
}

export interface TrustedDatasetSnapshot {
  countries: TrustedCountryRecord[];
  summary: ReturnType<typeof getDataQualitySummary>;
  sourceCatalog: typeof sourceCatalog;
}

export function listTrustedCountries(): TrustedCountryRecord[] {
  return countries.map((country) => ({
    data: country,
    quality: getCountryDataQuality(country),
  }));
}

export function getTrustedCountry(countryCode: string): TrustedCountryRecord | undefined {
  const country = countries.find((item) => item.code === countryCode);
  if (!country) {
    return undefined;
  }

  return {
    data: country,
    quality: getCountryDataQuality(country),
  };
}

export function getTrustedDatasetSnapshot(): TrustedDatasetSnapshot {
  return {
    countries: listTrustedCountries(),
    summary: getDataQualitySummary(countries),
    sourceCatalog,
  };
}

export function getCalculatorDefaultSources(countryCode: string) {
  const country = getTrustedCountry(countryCode);
  if (!country) {
    return {
      provenance: [getUserInputProvenance()],
      sources: [],
    };
  }

  const provenance = [
    ...country.quality.groups.filter((group) => group.id === "tariff-irr"),
    getUserInputProvenance(),
  ];

  return {
    provenance,
    sources: getSourceRefs(provenance.flatMap((group) => group.sourceIds)),
  };
}

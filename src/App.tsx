import { useEffect, useMemo, useState } from "react";
import { createInputFromDefaults } from "./calculations/finance";
import { countries, countryByCode } from "./data/countries";
import { AppShell } from "./components/layout/AppShell";
import { BenchmarkProjectsPage } from "./pages/BenchmarkProjectsPage";
import { CalculatorPage } from "./pages/CalculatorPage";
import { CountryDetailPage } from "./pages/CountryDetailPage";
import { DueDiligencePage } from "./pages/DueDiligencePage";
import { MarketDashboard } from "./pages/MarketDashboard";
import { RiskAssessmentPage } from "./pages/RiskAssessmentPage";
import { UserCenterPage } from "./pages/UserCenterPage";
import { getCountry, type MarketFilters } from "./services/dataService";
import { listSavedProjects, saveProject } from "./services/projectStorage";
import { uid } from "./lib/utils";
import type { CalculationInput, CalculationResult, PageKey, SavedProject, Scenario, Track } from "./types";

const initialCountry = countries[2];
const initialTrack: Track = "solar";

function initialInput(): CalculationInput {
  return createInputFromDefaults(initialCountry.code, initialTrack, initialCountry.defaults[initialTrack]);
}

export default function App() {
  const [page, setPage] = useState<PageKey>("market");
  const [marketFilters, setMarketFilters] = useState<MarketFilters>({
    track: "all",
    region: "all",
    riskLevel: "all",
  });
  const [selectedCountryCode, setSelectedCountryCode] = useState(initialCountry.code);
  const [calculatorInput, setCalculatorInput] = useState<CalculationInput>(() => initialInput());
  const [scenario, setScenario] = useState<Scenario>("base");
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);

  useEffect(() => {
    setSavedProjects(listSavedProjects());
  }, []);

  const selectedCountry = useMemo(() => getCountry(selectedCountryCode), [selectedCountryCode]);

  function selectCountry(countryCode: string) {
    setSelectedCountryCode(countryCode);
    setPage("country");
  }

  function setCountryAndTrack(countryCode: string, requestedTrack: Track) {
    const country = countryByCode[countryCode];
    const nextTrack = country.tracks.includes(requestedTrack) ? requestedTrack : country.tracks[0];
    setSelectedCountryCode(countryCode);
    setCalculatorInput(createInputFromDefaults(countryCode, nextTrack, country.defaults[nextTrack]));
  }

  function openCalculator(track?: Track) {
    const nextTrack = track ?? (selectedCountry.tracks.includes(calculatorInput.track) ? calculatorInput.track : selectedCountry.tracks[0]);
    setCountryAndTrack(selectedCountry.code, nextTrack);
    setPage("calculator");
  }

  function saveCurrentProject(result: CalculationResult) {
    const country = countryByCode[calculatorInput.countryCode];
    const project: SavedProject = {
      id: uid("project"),
      name: `${country.name}${calculatorInput.capacityMW}MW${calculatorInput.track === "storage" ? "储能" : calculatorInput.track === "hydro" ? "水电" : "新能源"}测算`,
      createdAt: new Date().toISOString(),
      input: calculatorInput,
      result,
    };
    setSavedProjects(saveProject(project));
    setPage("user");
  }

  function renderPage() {
    if (page === "market") {
      return (
        <MarketDashboard
          filters={marketFilters}
          onFiltersChange={setMarketFilters}
          onCountrySelect={selectCountry}
        />
      );
    }

    if (page === "country") {
      return (
        <CountryDetailPage
          countryCode={selectedCountryCode}
          onBack={() => setPage("market")}
          onOpenRisk={() => setPage("risk")}
          onOpenCalculator={openCalculator}
        />
      );
    }

    if (page === "calculator") {
      return (
        <CalculatorPage
          input={calculatorInput}
          scenario={scenario}
          onScenarioChange={setScenario}
          onInputChange={setCalculatorInput}
          onCountryTrackChange={setCountryAndTrack}
          onSaveProject={saveCurrentProject}
        />
      );
    }

    if (page === "risk") {
      return (
        <RiskAssessmentPage
          countryCode={selectedCountryCode}
          calculatorInput={calculatorInput}
          onCountryChange={setSelectedCountryCode}
          onApplyToCalculator={setCalculatorInput}
          onGoCalculator={() => setPage("calculator")}
        />
      );
    }

    if (page === "toolkit") {
      return <DueDiligencePage track={calculatorInput.track} onTrackChange={(track) => setCountryAndTrack(calculatorInput.countryCode, track)} />;
    }

    if (page === "projects") {
      return <BenchmarkProjectsPage />;
    }

    return <UserCenterPage savedProjects={savedProjects} />;
  }

  return (
    <AppShell page={page} onPageChange={setPage}>
      {renderPage()}
    </AppShell>
  );
}

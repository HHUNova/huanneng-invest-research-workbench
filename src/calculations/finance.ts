import type {
  AnnualCashFlow,
  CalculationInput,
  CalculationResult,
  Scenario,
  SensitivityMatrixCell,
  SensitivityResult,
} from "../types";

const scenarioAdjustments: Record<
  Scenario,
  {
    tariff: number;
    investment: number;
    utilization: number;
    interest: number;
  }
> = {
  base: { tariff: 1, investment: 1, utilization: 1, interest: 1 },
  optimistic: { tariff: 1.06, investment: 0.94, utilization: 1.05, interest: 0.92 },
  pessimistic: { tariff: 0.94, investment: 1.08, utilization: 0.94, interest: 1.12 },
};

function npv(cashFlows: number[], discountRate: number) {
  return cashFlows.reduce((total, cashFlow, index) => {
    return total + cashFlow / (1 + discountRate) ** index;
  }, 0);
}

function irr(cashFlows: number[]) {
  let low = -0.95;
  let high = 1.2;
  let mid = 0;

  for (let i = 0; i < 120; i += 1) {
    mid = (low + high) / 2;
    const value = npv(cashFlows, mid);
    if (value > 0) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return Number.isFinite(mid) ? mid : 0;
}

function annuityPayment(principal: number, annualRate: number, years: number) {
  if (principal <= 0 || years <= 0) return 0;
  if (annualRate === 0) return principal / years;
  const factor = (annualRate * (1 + annualRate) ** years) / ((1 + annualRate) ** years - 1);
  return principal * factor;
}

function discountedPayback(cashFlows: number[], discountRate: number) {
  let cumulative = cashFlows[0];

  for (let year = 1; year < cashFlows.length; year += 1) {
    const discounted = cashFlows[year] / (1 + discountRate) ** year;
    const previous = cumulative;
    cumulative += discounted;

    if (cumulative >= 0) {
      const fraction = Math.abs(previous) / Math.max(discounted, 0.0001);
      return year - 1 + fraction;
    }
  }

  return cashFlows.length - 1;
}

function applyScenario(input: CalculationInput, scenario: Scenario): CalculationInput {
  const adjustment = scenarioAdjustments[scenario];

  return {
    ...input,
    tariffUSDPerMWh: input.tariffUSDPerMWh * adjustment.tariff,
    totalInvestmentMillionUSD: input.totalInvestmentMillionUSD * adjustment.investment,
    utilizationHours: input.utilizationHours * adjustment.utilization,
    loanInterestRate: input.loanInterestRate * adjustment.interest,
  };
}

function calculateBase(input: CalculationInput, scenario: Scenario): CalculationResult {
  const adjusted = applyScenario(input, scenario);
  const totalInvestment = adjusted.totalInvestmentMillionUSD;
  const debtPrincipal = totalInvestment * (1 - adjusted.equityRatio);
  const equityInvestment = totalInvestment * adjusted.equityRatio;
  const debtYears = Math.max(adjusted.loanTenorYears - adjusted.gracePeriodYears, 1);
  const annualDebtPayment = annuityPayment(debtPrincipal, adjusted.loanInterestRate, debtYears);
  const projectCashFlows = [-totalInvestment];
  const equityCashFlows = [-equityInvestment];
  const annualCashFlows: AnnualCashFlow[] = [];
  let outstandingDebt = debtPrincipal;
  let cumulativeProjectCashFlow = -totalInvestment;
  let discountedCumulative = -totalInvestment;
  let totalGenerationMWh = 0;
  let totalDiscountedCost = totalInvestment;
  let totalDiscountedGeneration = 0;

  for (let year = 1; year <= adjusted.operatingYears; year += 1) {
    // 年发电量按装机、利用小时、衰减、弃电和厂用电统一折减。
    const generationMWh =
      adjusted.capacityMW *
      adjusted.utilizationHours *
      (1 - adjusted.degradationRate) ** (year - 1) *
      (1 - adjusted.curtailmentRate) *
      (1 - adjusted.auxiliaryPowerRate);
    const revenue =
      (generationMWh * (adjusted.tariffUSDPerMWh + adjusted.subsidyUSDPerMWh)) / 1_000_000;
    const operatingCost = (adjusted.capacityMW * 1_000 * adjusted.omCostPerKWYear) / 1_000_000;
    const depreciation =
      year <= adjusted.depreciationYears ? totalInvestment / adjusted.depreciationYears : 0;
    const interest =
      year <= adjusted.loanTenorYears ? Math.max(outstandingDebt, 0) * adjusted.loanInterestRate : 0;
    const taxableIncome = revenue - operatingCost - depreciation - interest;
    const tax = Math.max(taxableIncome, 0) * adjusted.corporateTaxRate;
    let principalPayment = 0;
    let debtService = 0;

    if (year <= adjusted.loanTenorYears) {
      if (year <= adjusted.gracePeriodYears) {
        debtService = interest;
      } else {
        principalPayment = Math.min(Math.max(annualDebtPayment - interest, 0), outstandingDebt);
        debtService = interest + principalPayment;
        outstandingDebt -= principalPayment;
      }
    }

    const projectCashFlow = revenue - operatingCost - tax;
    const equityCashFlow = projectCashFlow - debtService;
    cumulativeProjectCashFlow += projectCashFlow;
    discountedCumulative += projectCashFlow / (1 + adjusted.discountRate) ** year;
    projectCashFlows.push(projectCashFlow);
    equityCashFlows.push(equityCashFlow);
    totalGenerationMWh += generationMWh;
    totalDiscountedCost += operatingCost / (1 + adjusted.discountRate) ** year;
    totalDiscountedGeneration += generationMWh / (1 + adjusted.discountRate) ** year;

    annualCashFlows.push({
      year,
      generationMWh,
      revenue,
      operatingCost,
      tax,
      debtService,
      projectCashFlow,
      equityCashFlow,
      cumulativeProjectCashFlow,
      discountedProjectCashFlow: discountedCumulative,
    });
  }

  const lcoeUSDPerMWh = (totalDiscountedCost * 1_000_000) / Math.max(totalDiscountedGeneration, 1);

  return {
    projectIRR: irr(projectCashFlows),
    equityIRR: irr(equityCashFlows),
    staticPaybackYears: discountedPayback(projectCashFlows, 0),
    npvMillionUSD: npv(projectCashFlows, adjusted.discountRate),
    lcoeUSDPerMWh,
    annualCashFlows,
    sensitivity: [],
    matrix: [],
    scenario,
  };
}

function withSensitivity(input: CalculationInput, scenario: Scenario): CalculationResult {
  const base = calculateBase(input, scenario);
  const variables: Array<{
    key: keyof CalculationInput;
    label: string;
    deltas: number[];
  }> = [
    { key: "tariffUSDPerMWh", label: "电价", deltas: [-0.1, -0.05, 0.05, 0.1] },
    { key: "totalInvestmentMillionUSD", label: "总投资", deltas: [-0.1, -0.05, 0.05, 0.1] },
    { key: "utilizationHours", label: "利用小时数", deltas: [-0.1, -0.05, 0.05, 0.1] },
    { key: "loanInterestRate", label: "利率", deltas: [-0.1, -0.05, 0.05, 0.1] },
  ];

  const matrix: SensitivityMatrixCell[] = [];
  const sensitivity: SensitivityResult[] = variables.map((variable) => {
    const downsideInput = {
      ...input,
      [variable.key]: Number(input[variable.key]) * 0.9,
    };
    const upsideInput = {
      ...input,
      [variable.key]: Number(input[variable.key]) * 1.1,
    };
    const downside = calculateBase(downsideInput, scenario);
    const upside = calculateBase(upsideInput, scenario);

    variable.deltas.forEach((delta) => {
      const nextInput = {
        ...input,
        [variable.key]: Number(input[variable.key]) * (1 + delta),
      };
      const result = calculateBase(nextInput, scenario);
      matrix.push({
        variable: variable.label,
        delta,
        projectIRR: result.projectIRR,
        npvMillionUSD: result.npvMillionUSD,
      });
    });

    return {
      variable: variable.label,
      downsideNpv: downside.npvMillionUSD,
      upsideNpv: upside.npvMillionUSD,
      spread: Math.abs(upside.npvMillionUSD - downside.npvMillionUSD),
    };
  });

  return {
    ...base,
    sensitivity: sensitivity.sort((a, b) => b.spread - a.spread),
    matrix,
  };
}

export function calculateProject(input: CalculationInput, scenario: Scenario = "base") {
  return withSensitivity(input, scenario);
}

export function createInputFromDefaults(
  countryCode: string,
  track: CalculationInput["track"],
  defaults: Omit<CalculationInput, "countryCode" | "track" | "technologyRoute" | "tariffMode" | "depreciationMethod">,
): CalculationInput {
  const technologyRoute =
    track === "storage" ? "磷酸铁锂储能系统" : track === "hydro" ? "常规水电站" : "集中式电站";
  const tariffMode = track === "hydro" ? "长期特许经营/PPA" : "长期 PPA";

  return {
    ...defaults,
    countryCode,
    track,
    technologyRoute,
    tariffMode,
    depreciationMethod: "直线法",
  };
}

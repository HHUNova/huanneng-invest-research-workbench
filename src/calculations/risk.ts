import type { CountryProfile, RiskLevel } from "../types";
import { clamp } from "../lib/utils";

export interface RiskAssessment {
  weightedScore: number;
  level: RiskLevel;
  premium: number;
  recommendation: string;
}

export function calculateRiskAssessment(country: CountryProfile): RiskAssessment {
  const weightedScore = country.risk.dimensions.reduce((total, dimension) => {
    return total + dimension.score * dimension.weight;
  }, 0);

  const level: RiskLevel =
    weightedScore >= 8.2 ? "A" : weightedScore >= 7.3 ? "B" : weightedScore >= 6.4 ? "C" : weightedScore >= 5.4 ? "D" : "E";
  const premium = clamp((8.5 - weightedScore) * 0.0075, 0, 0.035);
  const recommendation =
    level === "A"
      ? "可进入优先筛选池，重点压实电价和工程成本假设。"
      : level === "B"
        ? "适合继续推进，建议设置外汇、并网和许可条件先决条款。"
        : level === "C"
          ? "需提高折现率并增加缓释措施，适合阶段性投入。"
          : "暂不建议直接进入重资产投资，优先采用开发权或少数股权策略。";

  return {
    weightedScore,
    level,
    premium,
    recommendation,
  };
}

export function applyRiskPremium<T extends { discountRate: number }>(input: T, premium: number): T {
  return {
    ...input,
    discountRate: input.discountRate + premium,
  };
}

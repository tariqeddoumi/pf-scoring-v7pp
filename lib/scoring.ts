import { EvaluationInput, DomainInput } from "@/lib/types";

export const domainWeights = {
  SPONSOR: 0.14,
  PROJECT: 0.12,
  CONSTRUCTION: 0.15,
  OPERATIONS: 0.10,
  MARKET: 0.14,
  LEGAL: 0.10,
  FINANCIAL: 0.20,
  ESG: 0.05
} as const;

export const classificationAdjustment: Record<EvaluationInput["classificationBam"], number> = {
  HEALTHY: 1.00,
  WATCH: 0.95,
  SENSITIVE: 0.88,
  SUBSTANDARD: 0.72,
  DOUBTFUL: 0.55,
  LOSS: 0.35
};

function clampScore(value: number) {
  return Math.max(0, Math.min(100, value));
}

function normalizeDSCR(value: number) {
  if (value >= 1.5) return 95;
  if (value >= 1.35) return 85;
  if (value >= 1.2) return 70;
  if (value >= 1.05) return 50;
  return 20;
}

function normalizeReserveMonths(value: number) {
  if (value >= 12) return 95;
  if (value >= 6) return 80;
  if (value >= 3) return 60;
  return 30;
}

function normalizeGearing(value: number) {
  if (value <= 55) return 90;
  if (value <= 65) return 75;
  if (value <= 75) return 55;
  return 30;
}

function inverseScore(value: number) {
  return clampScore(100 - value);
}

export function buildDomains(input: EvaluationInput): DomainInput[] {
  const sponsor = clampScore((input.sponsorTrackRecord + input.sponsorFinancialStrength + inverseScore(input.countryRisk)) / 3);
  const project = clampScore((input.technicalMaturity + input.permitStatus) / 2);
  const construction = clampScore((inverseScore(input.constructionComplexity) + input.contractorStrength) / 2);
  const operations = clampScore((input.omStrength + input.esgClimateResilience) / 2);
  const market = clampScore((input.offtakerStrength + input.contractCoverage + inverseScore(input.priceVolatility)) / 3);
  const legal = clampScore((input.legalRobustness + input.permitStatus) / 2);
  const financial = clampScore(
    (
      normalizeDSCR(input.dscrBase) * 0.35 +
      normalizeDSCR(input.dscrStress) * 0.25 +
      normalizeGearing(input.gearing) * 0.20 +
      normalizeReserveMonths(input.reserveMonths) * 0.20
    )
  );
  const esg = clampScore(input.esgClimateResilience);

  const map: Array<[DomainInput["code"], string, number]> = [
    ["SPONSOR", "Sponsor & Environnement", sponsor],
    ["PROJECT", "Maturité du projet", project],
    ["CONSTRUCTION", "Construction", construction],
    ["OPERATIONS", "Opérations", operations],
    ["MARKET", "Marché & Revenus", market],
    ["LEGAL", "Cadre juridique", legal],
    ["FINANCIAL", "Structure financière", financial],
    ["ESG", "ESG & Résilience", esg]
  ];

  return map.map(([code, name, rawScore]) => {
    const weight = domainWeights[code];
    return {
      code,
      name,
      weight,
      rawScore: Number(rawScore.toFixed(2)),
      weightedScore: Number((rawScore * weight).toFixed(2)),
      redFlag:
        (code === "FINANCIAL" && rawScore < 45) ||
        (code === "CONSTRUCTION" && rawScore < 40) ||
        (code === "MARKET" && rawScore < 40)
    };
  });
}

export function resolveGrade(score: number) {
  if (score >= 85) return { grade: "A1", label: "Excellent", outlook: "Très favorable" };
  if (score >= 75) return { grade: "A2", label: "Très bon", outlook: "Favorable" };
  if (score >= 65) return { grade: "B1", label: "Correct", outlook: "Acceptable" };
  if (score >= 55) return { grade: "B2", label: "Moyen", outlook: "Sous vigilance" };
  if (score >= 45) return { grade: "C1", label: "Faible", outlook: "Risque élevé" };
  return { grade: "C2", label: "Très faible", outlook: "No-Go / réexamen" };
}

export function computeScore(input: EvaluationInput) {
  const domains = buildDomains(input);
  const preAdjustment = domains.reduce((sum, d) => sum + d.weightedScore, 0);
  const adjustment = classificationAdjustment[input.classificationBam];
  const finalScore = Number((preAdjustment * adjustment).toFixed(2));
  const grade = resolveGrade(finalScore);

  const hardStops: string[] = [];
  if (input.dscrStress < 1.0) hardStops.push("DSCR stress < 1,00");
  if (input.permitStatus < 40) hardStops.push("Permis et autorisations insuffisamment sécurisés");
  if (input.offtakerStrength < 35) hardStops.push("Offtaker / contrepartie commerciale trop faible");
  if (input.classificationBam === "LOSS" || input.classificationBam === "DOUBTFUL") {
    hardStops.push("Classification BAM incompatible avec un financement standard");
  }

  return {
    domains,
    preAdjustment: Number(preAdjustment.toFixed(2)),
    finalScore,
    grade,
    hardStops,
    approved: hardStops.length === 0 && finalScore >= 55
  };
}

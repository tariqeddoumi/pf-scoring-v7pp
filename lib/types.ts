export type DomainCode =
  | "SPONSOR"
  | "PROJECT"
  | "CONSTRUCTION"
  | "OPERATIONS"
  | "MARKET"
  | "LEGAL"
  | "FINANCIAL"
  | "ESG";

export type DomainInput = {
  code: DomainCode;
  name: string;
  weight: number;
  rawScore: number;
  weightedScore: number;
  comment?: string;
  redFlag?: boolean;
};

export type EvaluationInput = {
  countryRisk: number;
  sponsorTrackRecord: number;
  sponsorFinancialStrength: number;
  technicalMaturity: number;
  permitStatus: number;
  constructionComplexity: number;
  contractorStrength: number;
  omStrength: number;
  offtakerStrength: number;
  contractCoverage: number;
  priceVolatility: number;
  dscrBase: number;
  dscrStress: number;
  gearing: number;
  reserveMonths: number;
  legalRobustness: number;
  esgClimateResilience: number;
  classificationBam: "HEALTHY" | "WATCH" | "SENSITIVE" | "SUBSTANDARD" | "DOUBTFUL" | "LOSS";
};

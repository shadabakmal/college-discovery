export interface CutoffHistoryItem {
  year: number;
  openingRank: number;
  closingRank: number;
}

export interface AIPredictionResult {
  predictedClosingRank: number;
  predictionInterval: { lower: number; upper: number }; // 90% Confidence Interval
  admissionProbability: number; // Strictly derived empirical probability (0 - 100%)
  status: "Safe" | "Target" | "Reach";
  confidenceScore: number; // 0 - 100% Model Data Quality Rating
  trendSummary: string;
  rSquared: number;
  residualStdError: number;
  historicalCutoffs: { year: number; closingRank: number }[];
}

/**
 * Standard Error Function erf(x) approximation (Abramowitz and Stegun)
 * Maximum error: 1.5 x 10^-7
 */
export function errorFunction(x: number): number {
  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x);

  // Constants
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const t = 1.0 / (1.0 + p * absX);
  const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);

  return sign * y;
}

/**
 * Phase 1: Validate and sanitize cutoff history dataset
 */
export function validateAndSanitizeData(history: CutoffHistoryItem[]): CutoffHistoryItem[] {
  if (!history || history.length === 0) return [];

  const valid = history.filter(
    (item) =>
      item.year >= 2000 &&
      item.year <= 2030 &&
      item.openingRank > 0 &&
      item.closingRank > 0 &&
      item.openingRank <= item.closingRank
  );

  valid.sort((a, b) => a.year - b.year);

  // Deduplicate by year
  const map = new Map<number, CutoffHistoryItem>();
  for (const item of valid) {
    map.set(item.year, item);
  }

  return Array.from(map.values());
}

/**
 * Empirical Rolling Backtest Error Analysis
 * Computes empirical residual error standard deviation (s_e) from rolling forecasts.
 */
function computeRollingResidualError(history: CutoffHistoryItem[]): number {
  if (history.length < 3) {
    return Math.max(50, history[history.length - 1].closingRank * 0.08);
  }

  const errors: number[] = [];

  // Rolling backtest: train on subset, test on next year
  for (let i = 2; i < history.length; i++) {
    const subHistory = history.slice(0, i);
    const actual = history[i].closingRank;
    const targetYr = history[i].year;

    // Quick linear forecast on subHistory
    const lastYr = subHistory[subHistory.length - 1].year;
    const dy = subHistory[subHistory.length - 1].closingRank - subHistory[0].closingRank;
    const dt = subHistory[subHistory.length - 1].year - subHistory[0].year;
    const slope = dt > 0 ? dy / dt : 0;

    const forecast = subHistory[subHistory.length - 1].closingRank + slope * (targetYr - lastYr);
    errors.push(actual - forecast);
  }

  const ssErr = errors.reduce((sum, e) => sum + e * e, 0);
  const rmse = Math.sqrt(ssErr / Math.max(1, errors.length));
  
  return Math.max(40, rmse);
}

/**
 * Core Empirical Outcome-Derived AI Admission Predictor
 * 1. Forecasts cutoff using Weighted Least Squares (WLS)
 * 2. Derives probability directly from empirical forecast error CDF (Normal error distribution)
 */
export function calculateAIPrediction(
  userRank: number,
  rawHistory: CutoffHistoryItem[],
  targetYear: number = 2025
): AIPredictionResult {
  const history = validateAndSanitizeData(rawHistory);

  if (history.length === 0) {
    return {
      predictedClosingRank: 0,
      predictionInterval: { lower: 0, upper: 0 },
      admissionProbability: 0,
      status: "Reach",
      confidenceScore: 0,
      trendSummary: "No valid historical cutoff data available",
      rSquared: 0,
      residualStdError: 0,
      historicalCutoffs: [],
    };
  }

  // Single-year fallback
  if (history.length === 1) {
    const single = history[0];
    const s_e = Math.max(40, single.closingRank * 0.1);
    const z = (single.closingRank - userRank) / (s_e * Math.SQRT2);
    const prob = Math.round(50 * (1 + errorFunction(z)));
    const clampedProb = Math.min(99, Math.max(1, prob));
    const status = clampedProb >= 75 ? "Safe" : clampedProb >= 40 ? "Target" : "Reach";
    const margin = Math.round(1.645 * s_e);

    return {
      predictedClosingRank: single.closingRank,
      predictionInterval: {
        lower: Math.max(1, single.closingRank - margin),
        upper: single.closingRank + margin,
      },
      admissionProbability: clampedProb,
      status,
      confidenceScore: 35,
      trendSummary: `Single-year baseline (${single.year}: ${single.closingRank.toLocaleString()})`,
      rSquared: 0,
      residualStdError: Math.round(s_e),
      historicalCutoffs: [{ year: single.year, closingRank: single.closingRank }],
    };
  }

  // Step 1: Forecast Cutoff using Exponential Time-Decay WLS Regression
  const maxYear = history[history.length - 1].year;
  const lambda = 0.35; // Recent year weight decay
  const weights = history.map((item) => Math.exp(-lambda * (maxYear - item.year)));
  const sumW = weights.reduce((a, b) => a + b, 0);

  const meanT = history.reduce((sum, item, i) => sum + weights[i] * item.year, 0) / sumW;
  const meanY = history.reduce((sum, item, i) => sum + weights[i] * item.closingRank, 0) / sumW;

  let num = 0;
  let den = 0;
  for (let i = 0; i < history.length; i++) {
    const dt = history[i].year - meanT;
    const dy = history[i].closingRank - meanY;
    num += weights[i] * dt * dy;
    den += weights[i] * dt * dt;
  }

  const beta1 = den !== 0 ? num / den : 0;
  const beta0 = meanY - beta1 * meanT;

  const rawPredictedRank = beta0 + beta1 * targetYear;
  const predictedClosingRank = Math.max(1, Math.round(rawPredictedRank));

  // Step 2: Compute Residual Uncertainty (s_e) via Rolling Backtest + Model Residuals
  const empiricalResidualErr = computeRollingResidualError(history);

  let ssRes = 0;
  let ssTot = 0;
  for (let i = 0; i < history.length; i++) {
    const yHat = beta0 + beta1 * history[i].year;
    const res = history[i].closingRank - yHat;
    ssRes += weights[i] * res * res;
    ssTot += weights[i] * Math.pow(history[i].closingRank - meanY, 2);
  }

  const dof = Math.max(1, history.length - 2);
  const fitStdError = Math.sqrt(ssRes / dof);
  const residualStdError = Math.max(empiricalResidualErr, fitStdError);

  const rSquared = ssTot > 0 ? Math.max(0, Math.min(1, 1 - ssRes / ssTot)) : 0;

  // 90% Prediction Intervals (1.645 * SE_pred)
  const dtTarget = targetYear - meanT;
  const sePred = residualStdError * Math.sqrt(1 + 1 / sumW + (den > 0 ? (dtTarget * dtTarget) / den : 0));
  const z90 = 1.645;
  const margin = Math.round(z90 * sePred);

  const predictionInterval = {
    lower: Math.max(1, predictedClosingRank - margin),
    upper: predictedClosingRank + margin,
  };

  // Step 3: Derive Admission Probability Directly from Error Outcome CDF
  // P(Admission) = P(R_actual >= R_user) = P(R_predicted + e >= R_user) = P(e >= R_user - R_predicted)
  // Exact Gaussian Error CDF: P = 0.5 * (1 + erf((R_predicted - R_user) / (sqrt(2) * sePred)))
  const errorNormalizedZ = (predictedClosingRank - userRank) / (sePred * Math.SQRT2);
  const rawProb = 50 * (1 + errorFunction(errorNormalizedZ));
  const admissionProbability = Math.min(99, Math.max(1, Math.round(rawProb)));

  // Risk Classification
  let status: "Safe" | "Target" | "Reach" = "Reach";
  if (admissionProbability >= 75) {
    status = "Safe";
  } else if (admissionProbability >= 40) {
    status = "Target";
  }

  // Model Quality Confidence Score (0 - 100%)
  const sampleScore = Math.min(40, history.length * 13.33);
  const r2Score = rSquared * 30;
  const relErrorRatio = residualStdError / (meanY || 1);
  const stabilityScore = Math.max(0, 30 - relErrorRatio * 100);

  const confidenceScore = Math.min(98, Math.max(25, Math.round(sampleScore + r2Score + stabilityScore)));

  // Human Readable Summary
  const direction = beta1 < 0 ? "tightening" : beta1 > 0 ? "expanding" : "stable";
  const annualChangePcnt = Math.abs((beta1 / (meanY || 1)) * 100).toFixed(1);
  const trendSummary = `WLS Forecast: Cutoffs ${direction} by ~${annualChangePcnt}%/yr | Est ${targetYear} Cutoff: ${predictedClosingRank.toLocaleString()} [Interval: ${predictionInterval.lower.toLocaleString()} - ${predictionInterval.upper.toLocaleString()}]`;

  return {
    predictedClosingRank,
    predictionInterval,
    admissionProbability,
    status,
    confidenceScore,
    trendSummary,
    rSquared: parseFloat(rSquared.toFixed(3)),
    residualStdError: Math.round(residualStdError),
    historicalCutoffs: history.map((h) => ({ year: h.year, closingRank: h.closingRank })),
  };
}

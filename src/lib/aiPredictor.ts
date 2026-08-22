export interface CutoffHistoryItem {
  year: number;
  openingRank: number;
  closingRank: number;
}

export interface AIPredictionResult {
  predictedClosingRank: number;
  predictionInterval: { lower: number; upper: number; width: number }; // 90% Prediction Interval & Width
  admissionProbability: number; // 0 - 100% (Empirical ECDF / Gaussian Error Model)
  probabilityModelType: "Empirical ECDF" | "Gaussian Error Model" | "Single Year Baseline";
  status: "Safe" | "Target" | "Reach";
  confidenceScore: number; // 0 - 100% Model Data Quality Rating
  trendSummary: string;
  rSquared: number;
  residualStdError: number;
  historicalCutoffs: { year: number; closingRank: number }[];
}

/**
 * Standard Error Function erf(x) approximation (Abramowitz and Stegun)
 * Used for Gaussian Error Distribution fallback
 */
export function errorFunction(x: number): number {
  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x);

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
 * Standard Normal Cumulative Distribution Function (Gaussian CDF)
 */
export function normalCDF(z: number): number {
  return 0.5 * (1 + errorFunction(z / Math.SQRT2));
}

/**
 * Validate and sanitize cutoff history dataset
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
 * Empirical Cumulative Distribution Function (ECDF)
 * Calculates true empirical probability: P(e >= requiredError)
 * using linear quantile interpolation over historical out-of-sample errors.
 */
export function empiricalCDFProbability(requiredError: number, errors: number[]): number {
  if (!errors || errors.length === 0) return 0.5;

  const sortedErrors = [...errors].sort((a, b) => a - b);
  const count = sortedErrors.filter((e) => e >= requiredError).length;
  
  // Empirical proportion
  const p = count / sortedErrors.length;
  return Math.min(0.99, Math.max(0.01, p));
}

/**
 * Collect Rolling Out-of-Sample Forecast Residual Errors
 * Executes rolling-origin backtesting:
 *   - Train 2022 -> Test 2023
 *   - Train 2022+2023 -> Test 2024
 */
export function collectRollingResidualErrors(history: CutoffHistoryItem[]): {
  errors: number[];
  rmse: number;
  mae: number;
} {
  const errors: number[] = [];

  if (history.length < 3) {
    return {
      errors: [],
      rmse: Math.max(40, history[history.length - 1].closingRank * 0.08),
      mae: Math.max(30, history[history.length - 1].closingRank * 0.06),
    };
  }

  for (let i = 2; i < history.length; i++) {
    const trainSet = history.slice(0, i);
    const testItem = history[i];

    // Forecast using WLS on trainSet
    const maxYr = trainSet[trainSet.length - 1].year;
    const weights = trainSet.map((t) => Math.exp(-0.35 * (maxYr - t.year)));
    const sumW = weights.reduce((a, b) => a + b, 0);

    const meanT = trainSet.reduce((sum, item, k) => sum + weights[k] * item.year, 0) / sumW;
    const meanY = trainSet.reduce((sum, item, k) => sum + weights[k] * item.closingRank, 0) / sumW;

    let num = 0;
    let den = 0;
    for (let k = 0; k < trainSet.length; k++) {
      const dt = trainSet[k].year - meanT;
      const dy = trainSet[k].closingRank - meanY;
      num += weights[k] * dt * dy;
      den += weights[k] * dt * dt;
    }

    const slope = den !== 0 ? num / den : 0;
    const intercept = meanY - slope * meanT;
    const forecast = Math.max(1, Math.round(intercept + slope * testItem.year));

    // Residual error: e = R_actual - R_predicted
    const err = testItem.closingRank - forecast;
    errors.push(err);
  }

  const ssErr = errors.reduce((sum, e) => sum + e * e, 0);
  const rmse = Math.sqrt(ssErr / Math.max(1, errors.length));
  const mae = errors.reduce((sum, e) => sum + Math.abs(e), 0) / Math.max(1, errors.length);

  return { errors, rmse, mae };
}

/**
 * Complete Forecasting & Probability Engine
 * 1. Forecasts next-cycle closing rank using Weighted Least Squares (WLS) regression.
 * 2. Uses Empirical ECDF for probability estimation when out-of-sample errors exist,
 *    falling back to Gaussian Error-Distribution model for small N.
 * 3. Reports prediction interval width alongside coverage to prevent over-wide intervals.
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
      predictionInterval: { lower: 0, upper: 0, width: 0 },
      admissionProbability: 0,
      probabilityModelType: "Gaussian Error Model",
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
    const s_e = Math.max(40, single.closingRank * 0.08); // 8% error assumption
    const z = (single.closingRank - userRank) / s_e;
    const prob = Math.round(normalCDF(z) * 100);
    const clampedProb = Math.min(99, Math.max(1, prob));
    const status = clampedProb >= 75 ? "Safe" : clampedProb >= 40 ? "Target" : "Reach";
    const margin = Math.round(1.645 * s_e);
    const intervalWidth = margin * 2;

    return {
      predictedClosingRank: single.closingRank,
      predictionInterval: {
        lower: Math.max(1, single.closingRank - margin),
        upper: single.closingRank + margin,
        width: intervalWidth,
      },
      admissionProbability: clampedProb,
      probabilityModelType: "Single Year Baseline",
      status,
      confidenceScore: 35,
      trendSummary: `Single-year baseline (${single.year}: ${single.closingRank.toLocaleString()})`,
      rSquared: 0,
      residualStdError: Math.round(s_e),
      historicalCutoffs: [{ year: single.year, closingRank: single.closingRank }],
    };
  }

  // 1. Forecast Target Cutoff via Weighted Least Squares (WLS) Regression
  const maxYear = history[history.length - 1].year;
  const lambda = 0.35; // Exponential time-decay parameter
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

  // 2. Collect Rolling Out-of-Sample Residual Errors
  const rollingRes = collectRollingResidualErrors(history);

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
  const residualStdError = Math.max(rollingRes.rmse, fitStdError);
  const rSquared = ssTot > 0 ? Math.max(0, Math.min(1, 1 - ssRes / ssTot)) : 0;

  // 3. Generate Tight 90% Prediction Intervals
  const dtTarget = targetYear - meanT;
  const sePred = residualStdError * Math.sqrt(1 + 1 / sumW + (den > 0 ? (dtTarget * dtTarget) / den : 0));
  const z90 = 1.645;
  const margin = Math.round(z90 * sePred);
  const intervalWidth = margin * 2;

  const predictionInterval = {
    lower: Math.max(1, predictedClosingRank - margin),
    upper: predictedClosingRank + margin,
    width: intervalWidth,
  };

  // 4. Calculate Admission Probability
  // Required error for admission: e = R_user - R_predicted
  const requiredError = userRank - predictedClosingRank;
  let admissionProbability = 50;
  let probabilityModelType: "Empirical ECDF" | "Gaussian Error Model" = "Gaussian Error Model";

  if (rollingRes.errors.length >= 3) {
    // Primary Model: Empirical Non-Parametric ECDF
    probabilityModelType = "Empirical ECDF";
    const ecdfProb = empiricalCDFProbability(requiredError, rollingRes.errors);
    admissionProbability = Math.round(ecdfProb * 100);
  } else {
    // Fallback Model: Gaussian Error-Distribution Model
    probabilityModelType = "Gaussian Error Model";
    const zScore = (predictedClosingRank - userRank) / sePred;
    const gaussProb = normalCDF(zScore);
    admissionProbability = Math.min(99, Math.max(1, Math.round(gaussProb * 100)));
  }

  // Risk Tier Classification
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

  // Trend Description Summary
  const direction = beta1 < 0 ? "tightening" : beta1 > 0 ? "expanding" : "stable";
  const annualChangePcnt = Math.abs((beta1 / (meanY || 1)) * 100).toFixed(1);
  const trendSummary = `WLS Forecast (${probabilityModelType}): Cutoffs ${direction} by ~${annualChangePcnt}%/yr | Target ${targetYear} Est: ${predictedClosingRank.toLocaleString()} [Interval Width: ±${margin.toLocaleString()} ranks]`;

  return {
    predictedClosingRank,
    predictionInterval,
    admissionProbability,
    probabilityModelType,
    status,
    confidenceScore,
    trendSummary,
    rSquared: parseFloat(rSquared.toFixed(3)),
    residualStdError: Math.round(residualStdError),
    historicalCutoffs: history.map((h) => ({ year: h.year, closingRank: h.closingRank })),
  };
}

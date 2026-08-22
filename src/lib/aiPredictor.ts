export interface CutoffHistoryItem {
  year: number;
  openingRank: number;
  closingRank: number;
}

export interface AIPredictionResult {
  predictedClosingRank: number;
  predictionInterval: { lower: number; upper: number }; // 90% Confidence Interval
  admissionProbability: number; // Calibrated 0 - 100%
  status: "Safe" | "Target" | "Reach";
  confidenceScore: number; // 0 - 100% Model Data Quality Rating
  trendSummary: string;
  rSquared: number;
  residualStdError: number;
  historicalCutoffs: { year: number; closingRank: number }[];
}

/**
 * Phase 1: Validate and sanitize cutoff history dataset
 */
export function validateAndSanitizeData(history: CutoffHistoryItem[]): CutoffHistoryItem[] {
  if (!history || history.length === 0) return [];

  // Filter invalid entries
  const valid = history.filter(
    (item) =>
      item.year >= 2000 &&
      item.year <= 2030 &&
      item.openingRank > 0 &&
      item.closingRank > 0 &&
      item.openingRank <= item.closingRank
  );

  // Sort chronologically
  valid.sort((a, b) => a.year - b.year);

  // Deduplicate by year (taking latest recorded cutoff per year)
  const map = new Map<number, CutoffHistoryItem>();
  for (const item of valid) {
    map.set(item.year, item);
  }

  return Array.from(map.values());
}

/**
 * Phase 2, 3, 4, 6, 7: Core Advanced AI Predictor Model
 * Incorporates Weighted Least Squares (WLS) Regression, Residual Uncertainty, 
 * Prediction Intervals, Calibrated Probabilities, and Confidence Scoring.
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

  // Fallback for single data point
  if (history.length === 1) {
    const single = history[0];
    const diff = single.closingRank - userRank;
    let prob = 50;
    if (diff > 0) {
      prob = Math.min(95, 50 + Math.round((diff / single.closingRank) * 100));
    } else {
      prob = Math.max(5, 50 + Math.round((diff / single.closingRank) * 100));
    }
    const status = prob >= 75 ? "Safe" : prob >= 40 ? "Target" : "Reach";
    const margin = Math.round(single.closingRank * 0.15);

    return {
      predictedClosingRank: single.closingRank,
      predictionInterval: {
        lower: Math.max(1, single.closingRank - margin),
        upper: single.closingRank + margin,
      },
      admissionProbability: prob,
      status,
      confidenceScore: 35, // Low confidence due to N=1
      trendSummary: `Single-year data baseline (${single.year}: ${single.closingRank.toLocaleString()})`,
      rSquared: 0,
      residualStdError: margin,
      historicalCutoffs: [{ year: single.year, closingRank: single.closingRank }],
    };
  }

  // Phase 2: Weighted Least Squares (WLS) Regression
  // Weight function: Exponential time-decay w_t = e^(-lambda * (maxYear - t))
  const maxYear = history[history.length - 1].year;
  const lambda = 0.3; // Decay parameter
  const weights = history.map((item) => Math.exp(-lambda * (maxYear - item.year)));
  const sumW = weights.reduce((a, b) => a + b, 0);

  // Compute weighted means
  const meanT = history.reduce((sum, item, i) => sum + weights[i] * item.year, 0) / sumW;
  const meanY = history.reduce((sum, item, i) => sum + weights[i] * item.closingRank, 0) / sumW;

  // Compute slope (beta1) and intercept (beta0)
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

  // Forecast predicted closing rank for target year
  const rawPredictedRank = beta0 + beta1 * targetYear;
  const predictedClosingRank = Math.max(1, Math.round(rawPredictedRank));

  // Phase 3: Residual-Based Uncertainty (Residual Standard Error)
  let ssRes = 0;
  let ssTot = 0;
  const residuals: number[] = [];

  for (let i = 0; i < history.length; i++) {
    const yHat = beta0 + beta1 * history[i].year;
    const res = history[i].closingRank - yHat;
    residuals.push(res);
    ssRes += weights[i] * res * res;
    ssTot += weights[i] * Math.pow(history[i].closingRank - meanY, 2);
  }

  const dof = Math.max(1, history.length - 2);
  const residualStdError = Math.sqrt(ssRes / dof);

  // R-squared calculation
  const rSquared = ssTot > 0 ? Math.max(0, Math.min(1, 1 - ssRes / ssTot)) : 0;

  // Phase 4: Generate 90% Prediction Intervals
  // SE_pred = s_e * sqrt(1 + 1/sumW + (t_target - meanT)^2 / den)
  const dtTarget = targetYear - meanT;
  const sePred = residualStdError * Math.sqrt(1 + 1 / sumW + (den > 0 ? (dtTarget * dtTarget) / den : 0));
  const z90 = 1.645; // 90% confidence Z-critical value
  const margin = Math.round(z90 * Math.max(sePred, predictedClosingRank * 0.05));

  const predictionInterval = {
    lower: Math.max(1, predictedClosingRank - margin),
    upper: predictedClosingRank + margin,
  };

  // Phase 6: Calibrated Probability Scoring
  // Scale Z-score relative to Prediction Interval width for accurate empirical calibration
  const effectiveStd = Math.max(50, margin / z90);
  const zScore = (predictedClosingRank - userRank) / effectiveStd;
  
  // Calibrated Sigmoid Curve
  const rawProb = 100 / (1 + Math.exp(-1.35 * zScore));
  const admissionProbability = Math.min(99, Math.max(1, Math.round(rawProb)));

  // Risk Classification
  let status: "Safe" | "Target" | "Reach" = "Reach";
  if (admissionProbability >= 75) {
    status = "Safe";
  } else if (admissionProbability >= 40) {
    status = "Target";
  }

  // Phase 7: Model Confidence Scoring (0 - 100%)
  // Based on sample completeness, R^2 goodness of fit, and relative error ratio
  const sampleScore = Math.min(40, history.length * 13.33); // max 40 for N>=3
  const r2Score = rSquared * 30; // max 30
  const relErrorRatio = residualStdError / (meanY || 1);
  const stabilityScore = Math.max(0, 30 - relErrorRatio * 100); // max 30

  const confidenceScore = Math.min(98, Math.max(25, Math.round(sampleScore + r2Score + stabilityScore)));

  // Trend Description Summary
  const direction = beta1 < 0 ? "tightening" : beta1 > 0 ? "expanding" : "stable";
  const annualChangePcnt = Math.abs((beta1 / (meanY || 1)) * 100).toFixed(1);
  const trendSummary = `WLS Model (${history.length} yrs data): Cutoffs ${direction} by ~${annualChangePcnt}%/yr | Target ${targetYear} Est: ${predictedClosingRank.toLocaleString()} [Range: ${predictionInterval.lower.toLocaleString()} - ${predictionInterval.upper.toLocaleString()}]`;

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

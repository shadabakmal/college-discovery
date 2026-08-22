export interface CutoffHistoryItem {
  year: number;
  openingRank: number;
  closingRank: number;
}

export interface AIPredictionResult {
  predictedClosingRank: number;
  admissionProbability: number; // 0 - 100%
  status: "Safe" | "Target" | "Reach";
  trendSummary: string;
  historicalCutoffs: { year: number; closingRank: number }[];
}

/**
 * AI Prediction Engine for College Admissions
 * Uses weighted historical linear trend extrapolation and sigmoidal probability scoring.
 */
export function calculateAIPrediction(
  userRank: number,
  history: CutoffHistoryItem[]
): AIPredictionResult {
  // Sort history ascending by year (e.g. 2022, 2023, 2024)
  const sortedHistory = [...history].sort((a, b) => a.year - b.year);

  if (sortedHistory.length === 0) {
    return {
      predictedClosingRank: 0,
      admissionProbability: 0,
      status: "Reach",
      trendSummary: "Insufficient historical cutoff data",
      historicalCutoffs: [],
    };
  }

  // If only 1 year available, fallback to single year logic
  if (sortedHistory.length === 1) {
    const single = sortedHistory[0];
    const diff = single.closingRank - userRank;
    let prob = 50;
    if (diff > 0) {
      prob = Math.min(95, 50 + Math.round((diff / single.closingRank) * 100));
    } else {
      prob = Math.max(5, 50 + Math.round((diff / single.closingRank) * 100));
    }
    const status = prob >= 75 ? "Safe" : prob >= 40 ? "Target" : "Reach";
    return {
      predictedClosingRank: single.closingRank,
      admissionProbability: prob,
      status,
      trendSummary: `Single-year benchmark (${single.year}: ${single.closingRank})`,
      historicalCutoffs: [{ year: single.year, closingRank: single.closingRank }],
    };
  }

  // Calculate Year-over-Year YoY deltas
  let totalDelta = 0;
  let weights = 0;
  for (let i = 1; i < sortedHistory.length; i++) {
    const yearDiff = sortedHistory[i].year - sortedHistory[i - 1].year;
    const rankDiff = sortedHistory[i].closingRank - sortedHistory[i - 1].closingRank;
    const ratePerYear = rankDiff / (yearDiff || 1);
    
    // Give higher weight to recent years
    const weight = i;
    totalDelta += ratePerYear * weight;
    weights += weight;
  }

  const avgAnnualChange = totalDelta / (weights || 1);
  const lastRecordedYear = sortedHistory[sortedHistory.length - 1];
  
  // Forecast expected closing rank for upcoming admission cycle
  const predictedClosingRank = Math.max(1, Math.round(lastRecordedYear.closingRank + avgAnnualChange));

  // Calculate Standard Deviation of cutoffs
  const ranks = sortedHistory.map((h) => h.closingRank);
  const meanRank = ranks.reduce((a, b) => a + b, 0) / ranks.length;
  const variance = ranks.reduce((sum, r) => sum + Math.pow(r - meanRank, 2), 0) / ranks.length;
  const stdDev = Math.max(50, Math.sqrt(variance));

  // Sigmoidal Probability Function
  // Normalized score: x = (predictedClosingRank - userRank) / stdDev
  const zScore = (predictedClosingRank - userRank) / (stdDev * 0.8);
  const rawProb = 100 / (1 + Math.exp(-1.5 * zScore));
  const admissionProbability = Math.min(99, Math.max(1, Math.round(rawProb)));

  // Risk Classification
  let status: "Safe" | "Target" | "Reach" = "Reach";
  if (admissionProbability >= 75) {
    status = "Safe";
  } else if (admissionProbability >= 40) {
    status = "Target";
  }

  // Generate Human-Readable Trend Summary
  const changePercent = (((lastRecordedYear.closingRank - sortedHistory[0].closingRank) / sortedHistory[0].closingRank) * 100).toFixed(1);
  const direction = avgAnnualChange < 0 ? "tightened" : "expanded";
  const trendSummary = `3-Year Trend: Cutoffs ${direction} by ~${Math.abs(parseFloat(changePercent))}% | Predicted Closing Rank: ${predictedClosingRank.toLocaleString()}`;

  return {
    predictedClosingRank,
    admissionProbability,
    status,
    trendSummary,
    historicalCutoffs: sortedHistory.map((h) => ({ year: h.year, closingRank: h.closingRank })),
  };
}

import { calculateAIPrediction, CutoffHistoryItem } from "../src/lib/aiPredictor";

/**
 * 4-Year Rolling Out-of-Sample Backtesting & Evaluation Framework for 2027 Target Cycle
 * Trains on 2023-2025 data, predicts 2026 ground truth cutoffs, and forecasts target 2027 cutoffs.
 */

interface DatasetEntry {
  exam: string;
  category: string;
  course: string;
  data: CutoffHistoryItem[];
}

const sampleDatasets: DatasetEntry[] = [
  {
    exam: "JEE Advanced",
    category: "General",
    course: "IIT Dhanbad - CSE",
    data: [
      { year: 2023, openingRank: 1800, closingRank: 2862 },
      { year: 2024, openingRank: 1750, closingRank: 2810 },
      { year: 2025, openingRank: 1710, closingRank: 2760 },
      { year: 2026, openingRank: 1680, closingRank: 2720 },
    ],
  },
  {
    exam: "JEE Advanced",
    category: "General",
    course: "IIT Madras - EE",
    data: [
      { year: 2023, openingRank: 42, closingRank: 144 },
      { year: 2024, openingRank: 40, closingRank: 138 },
      { year: 2025, openingRank: 38, closingRank: 132 },
      { year: 2026, openingRank: 35, closingRank: 126 },
    ],
  },
  {
    exam: "JEE Advanced",
    category: "General",
    course: "IIT Delhi - CS",
    data: [
      { year: 2023, openingRank: 29, closingRank: 115 },
      { year: 2024, openingRank: 27, closingRank: 108 },
      { year: 2025, openingRank: 25, closingRank: 102 },
      { year: 2026, openingRank: 22, closingRank: 98 },
    ],
  },
  {
    exam: "JEE Advanced",
    category: "General",
    course: "IIT Bombay - Mech",
    data: [
      { year: 2023, openingRank: 200, closingRank: 1200 },
      { year: 2024, openingRank: 190, closingRank: 1150 },
      { year: 2025, openingRank: 180, closingRank: 1100 },
      { year: 2026, openingRank: 170, closingRank: 1060 },
    ],
  },
  {
    exam: "JEE Main",
    category: "General",
    course: "NIT Trichy - ECE",
    data: [
      { year: 2023, openingRank: 1200, closingRank: 3500 },
      { year: 2024, openingRank: 1150, closingRank: 3400 },
      { year: 2025, openingRank: 1100, closingRank: 3310 },
      { year: 2026, openingRank: 1060, closingRank: 3230 },
    ],
  },
  {
    exam: "JEE Main",
    category: "General",
    course: "NIT Surathkal - IT",
    data: [
      { year: 2023, openingRank: 1500, closingRank: 2900 },
      { year: 2024, openingRank: 1450, closingRank: 2820 },
      { year: 2025, openingRank: 1400, closingRank: 2740 },
      { year: 2026, openingRank: 1360, closingRank: 2670 },
    ],
  },
  {
    exam: "NEET",
    category: "General",
    course: "AIIMS New Delhi - MBBS",
    data: [
      { year: 2023, openingRank: 1, closingRank: 57 },
      { year: 2024, openingRank: 1, closingRank: 53 },
      { year: 2025, openingRank: 1, closingRank: 49 },
      { year: 2026, openingRank: 1, closingRank: 46 },
    ],
  },
  {
    exam: "CAT",
    category: "General",
    course: "IIM Ahmedabad - MBA",
    data: [
      { year: 2023, openingRank: 1, closingRank: 150 },
      { year: 2024, openingRank: 1, closingRank: 145 },
      { year: 2025, openingRank: 1, closingRank: 140 },
      { year: 2026, openingRank: 1, closingRank: 136 },
    ],
  },
];

function calculateMedian(arr: number[]): number {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

function runBacktest() {
  console.log("=========================================================================");
  console.log("🧪 4-YEAR ROLLING-ORIGIN OUT-OF-SAMPLE BACKTESTING & EVALUATION TABLE");
  console.log("=========================================================================\n");

  const errors: number[] = [];
  const naiveErrors: number[] = [];
  const intervalWidths: number[] = [];
  let intervalCoverageHits = 0;

  console.log(
    "| Exam".padEnd(14) +
    "| Category".padEnd(11) +
    "| Course".padEnd(24) +
    "| Train End ".padEnd(12) +
    "| Test 2026 ".padEnd(12) +
    "| Predicted ".padEnd(12) +
    "| Actual ".padEnd(9) +
    "| Error | Est 2027 |"
  );
  console.log("--------------------------------------------------------------------------------------------------");

  for (const item of sampleDatasets) {
    // Train on 2023-2025, test on 2026 ground truth
    const trainSet = item.data.filter((d) => d.year < 2026);
    const testItem = item.data.find((d) => d.year === 2026)!;

    const result2026 = calculateAIPrediction(testItem.closingRank, trainSet, 2026);
    const predicted2026 = result2026.predictedClosingRank;
    const actual2026 = testItem.closingRank;
    const err = Math.abs(actual2026 - predicted2026);

    errors.push(err);
    intervalWidths.push(result2026.predictionInterval.width);

    const naivePred = trainSet[trainSet.length - 1].closingRank;
    naiveErrors.push(Math.abs(actual2026 - naivePred));

    if (actual2026 >= result2026.predictionInterval.lower && actual2026 <= result2026.predictionInterval.upper) {
      intervalCoverageHits++;
    }

    // Target 2027 Forecast using all 4 years (2023-2026)
    const result2027 = calculateAIPrediction(testItem.closingRank, item.data, 2027);

    const trainEndYr = trainSet[trainSet.length - 1].year;

    console.log(
      `| ${item.exam.padEnd(12)} ` +
      `| ${item.category.padEnd(9)} ` +
      `| ${item.course.padEnd(22)} ` +
      `| ${trainEndYr.toString().padStart(10)} ` +
      `| ${testItem.year.toString().padStart(10)} ` +
      `| ${predicted2026.toString().padStart(10)} ` +
      `| ${actual2026.toString().padStart(7)} ` +
      `| ${err.toString().padStart(5)} | ` +
      `${result2027.predictedClosingRank.toString().padStart(8)} |`
    );
  }

  const n = errors.length;
  const modelMAE = Math.round(errors.reduce((a, b) => a + b, 0) / n);
  const baselineMAE = Math.round(naiveErrors.reduce((a, b) => a + b, 0) / n);
  const improvementPcnt = (((baselineMAE - modelMAE) / baselineMAE) * 100).toFixed(1);

  const ssErr = errors.reduce((sum, e) => sum + e * e, 0);
  const rmse = Math.round(Math.sqrt(ssErr / n));
  const medAE = calculateMedian(errors);

  const coveragePcnt = ((intervalCoverageHits / n) * 100).toFixed(1);
  const avgWidth = Math.round(intervalWidths.reduce((a, b) => a + b, 0) / n);

  console.log("\n=========================================");
  console.log("MODEL BACKTEST & 2027 FORECAST EVALUATION");
  console.log("=========================================");
  console.log(`Test predictions count : ${n}`);
  console.log(`Model MAE              : ${modelMAE} ranks`);
  console.log(`Baseline MAE           : ${baselineMAE} ranks`);
  console.log(`Improvement            : ${improvementPcnt}%`);
  console.log("");
  console.log(`RMSE                   : ${rmse} ranks`);
  console.log(`Median Absolute Error  : ${medAE} ranks`);
  console.log("");
  console.log(`90% Interval Coverage  : ${coveragePcnt}%`);
  console.log(`Avg Interval Width     : ${avgWidth} ranks`);
  console.log("=========================================\n");
  console.log("⚠️ Note: Results are based on the current historical dataset and should be interpreted as preliminary until evaluated on a substantially larger rolling out-of-sample dataset.");
}

runBacktest();

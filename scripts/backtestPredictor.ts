import { calculateAIPrediction, CutoffHistoryItem } from "../src/lib/aiPredictor";

/**
 * Professional Rolling-Origin Backtesting & Out-of-Sample Evaluation Framework
 * Evaluates predictions using MAE, RMSE, MedAE, 90% Interval Coverage, and Average Interval Width.
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
      { year: 2022, openingRank: 1950, closingRank: 2950 },
      { year: 2023, openingRank: 1800, closingRank: 2862 },
      { year: 2024, openingRank: 1750, closingRank: 2810 },
    ],
  },
  {
    exam: "JEE Advanced",
    category: "General",
    course: "IIT Madras - EE",
    data: [
      { year: 2022, openingRank: 50, closingRank: 160 },
      { year: 2023, openingRank: 42, closingRank: 144 },
      { year: 2024, openingRank: 40, closingRank: 138 },
    ],
  },
  {
    exam: "JEE Advanced",
    category: "General",
    course: "IIT Delhi - CS",
    data: [
      { year: 2022, openingRank: 32, closingRank: 125 },
      { year: 2023, openingRank: 29, closingRank: 115 },
      { year: 2024, openingRank: 27, closingRank: 108 },
    ],
  },
  {
    exam: "JEE Advanced",
    category: "General",
    course: "IIT Bombay - Mech",
    data: [
      { year: 2022, openingRank: 220, closingRank: 1280 },
      { year: 2023, openingRank: 200, closingRank: 1200 },
      { year: 2024, openingRank: 190, closingRank: 1150 },
    ],
  },
  {
    exam: "JEE Main",
    category: "General",
    course: "NIT Trichy - ECE",
    data: [
      { year: 2022, openingRank: 1300, closingRank: 3700 },
      { year: 2023, openingRank: 1200, closingRank: 3500 },
      { year: 2024, openingRank: 1150, closingRank: 3400 },
    ],
  },
  {
    exam: "JEE Main",
    category: "General",
    course: "NIT Surathkal - IT",
    data: [
      { year: 2022, openingRank: 1600, closingRank: 3050 },
      { year: 2023, openingRank: 1500, closingRank: 2900 },
      { year: 2024, openingRank: 1450, closingRank: 2820 },
    ],
  },
  {
    exam: "NEET",
    category: "General",
    course: "AIIMS New Delhi - MBBS",
    data: [
      { year: 2022, openingRank: 1, closingRank: 61 },
      { year: 2023, openingRank: 1, closingRank: 57 },
      { year: 2024, openingRank: 1, closingRank: 53 },
    ],
  },
  {
    exam: "CAT",
    category: "General",
    course: "IIM Ahmedabad - MBA",
    data: [
      { year: 2022, openingRank: 1, closingRank: 160 },
      { year: 2023, openingRank: 1, closingRank: 150 },
      { year: 2024, openingRank: 1, closingRank: 145 },
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
  console.log("🧪 ROLLING-ORIGIN OUT-OF-SAMPLE BACKTESTING & EVALUATION TABLE");
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
    "| Test Year ".padEnd(12) +
    "| Predicted ".padEnd(12) +
    "| Actual ".padEnd(9) +
    "| Error |"
  );
  console.log("--------------------------------------------------------------------------------------------------");

  for (const item of sampleDatasets) {
    // Rolling split: Train on 2022-2023, Test on 2024
    const trainSet = item.data.filter((d) => d.year < 2024);
    const testItem = item.data.find((d) => d.year === 2024)!;

    const result = calculateAIPrediction(testItem.closingRank, trainSet, 2024);
    const predicted = result.predictedClosingRank;
    const actual = testItem.closingRank;
    const err = Math.abs(actual - predicted);

    errors.push(err);
    intervalWidths.push(result.predictionInterval.width);

    // Baseline Naive Predictor (Latest Year 2023 Value)
    const naivePred = trainSet[trainSet.length - 1].closingRank;
    naiveErrors.push(Math.abs(actual - naivePred));

    if (actual >= result.predictionInterval.lower && actual <= result.predictionInterval.upper) {
      intervalCoverageHits++;
    }

    const trainEndYr = trainSet[trainSet.length - 1].year;

    console.log(
      `| ${item.exam.padEnd(12)} ` +
      `| ${item.category.padEnd(9)} ` +
      `| ${item.course.padEnd(22)} ` +
      `| ${trainEndYr.toString().padStart(10)} ` +
      `| ${testItem.year.toString().padStart(10)} ` +
      `| ${predicted.toString().padStart(10)} ` +
      `| ${actual.toString().padStart(7)} ` +
      `| ${err.toString().padStart(5)} |`
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
  console.log("MODEL BACKTEST & OUT-OF-SAMPLE EVALUATION");
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

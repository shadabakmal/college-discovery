"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { TrendingUp, ChevronDown, Loader2, AlertCircle, Bot, Sparkles, Filter, ShieldCheck, Gauge } from "lucide-react";
import CollegeCard from "@/components/CollegeCard";

const EXAMS = ["JEE Main", "JEE Advanced", "NEET", "CAT", "CLAT", "CUET"];
const CATEGORIES = ["General", "OBC-NCL", "SC", "ST", "EWS"];

export default function PredictorClientPage() {
  const searchParams = useSearchParams();
  const initialExam = searchParams.get("exam") || "JEE Main";

  const [exam, setExam] = useState(initialExam);
  const [rank, setRank] = useState("");
  const [category, setCategory] = useState("General");
  const [results, setResults] = useState<any[] | null>(null);
  const [filterStatus, setFilterStatus] = useState<"All" | "Safe" | "Target" | "Reach">("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const urlExam = searchParams.get("exam");
    if (urlExam && EXAMS.includes(urlExam)) {
      setExam(urlExam);
    }
  }, [searchParams]);

  const predict = async () => {
    if (!rank) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/predictor?exam=${encodeURIComponent(exam)}&category=${encodeURIComponent(category)}&rank=${rank}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to fetch predictions");

      const formattedData = data.data.map((cutoff: any) => ({
        id: cutoff.college.id,
        name: cutoff.college.name,
        location: cutoff.college.location,
        type: cutoff.college.type,
        established: cutoff.college.established?.toString() || "N/A",
        ranking: cutoff.college.ranking || 999,
        rankingBody: "Ranked",
        image: cutoff.college.imageUrl || "https://images.unsplash.com/photo-1562774053-701939374585?w=800",
        rating: cutoff.college.rating,
        reviewCount: cutoff.college.reviewCount,
        fees: { min: cutoff.college.minFee },
        placements: {
          placementRate: cutoff.college.placementRate || 0,
          averageSalary: cutoff.college.avgCtc || 0,
        },
        matchedCourse: cutoff.course.name,
        closingRank: cutoff.closingRank,
        aiPrediction: cutoff.aiPrediction,
      }));

      setResults(formattedData);
    } catch (err: any) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = results ? results.filter((item) => {
    if (filterStatus === "All") return true;
    return item.aiPrediction?.status === filterStatus;
  }) : [];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div style={{ background: "linear-gradient(135deg, #0A1628, #1A2B4A)" }} className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-4 border border-orange-500/30">
            <Sparkles className="w-4 h-4" /> Calibrated WLS Regression Engine (90% Interval Bounds)
          </div>
          <h1 className="font-display text-4xl font-bold text-white mb-3">AI College Admission Predictor</h1>
          <p className="text-gray-300 mb-8">
            Weighted Least Squares ML engine analyzing official JoSAA/NEET/CAT cutoff datasets (2022–2024) to predict 2025 admission probabilities & prediction intervals.
          </p>

          <div className="bg-white rounded-2xl p-6 shadow-2xl text-left">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Entrance Exam</label>
                <div className="relative">
                  <select
                    value={exam}
                    onChange={(e) => setExam(e.target.value)}
                    className="w-full appearance-none pl-3 pr-8 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:border-orange-400 bg-white"
                  >
                    {EXAMS.map((e) => <option key={e}>{e}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {exam === "CAT" ? "Percentile / Rank" : "Your Rank"}
                </label>
                <input
                  type="number"
                  value={rank}
                  onChange={(e) => setRank(e.target.value)}
                  placeholder={exam === "CAT" ? "e.g. 150" : "e.g. 2500"}
                  className="w-full px-3 py-3 bg-white text-gray-900 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full appearance-none pl-3 pr-8 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:border-orange-400 bg-white"
                  >
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}

            <button
              onClick={predict}
              disabled={!rank || loading}
              className="w-full py-3.5 text-sm font-semibold text-white rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 shadow-md"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Running Calibrated ML Engine...
                </>
              ) : (
                <>
                  <Bot className="w-5 h-5" />
                  Predict Admission Odds with Calibrated AI
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {results !== null && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="font-display text-2xl font-bold text-gray-900 mb-1">
                🤖 AI Predicted {results.length} colleges for rank {rank}
              </h2>
              <p className="text-gray-500 text-sm">
                Evaluated using Weighted Least Squares (WLS) regression on official datasets ({exam} - {category}).
              </p>
            </div>

            {/* AI Risk Filter Tabs */}
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm self-start">
              <span className="text-xs font-semibold text-gray-500 px-2 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Odds Filter:
              </span>
              {(["All", "Safe", "Target", "Reach"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    filterStatus === status
                      ? "bg-gray-900 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {filteredResults.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm max-w-2xl mx-auto">
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="font-display text-2xl font-bold text-gray-900 mb-2">No matching options for filter "{filterStatus}"</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Try switching the risk odds filter to "All" or exploring different category options.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResults.map((college, idx) => {
                const ai = college.aiPrediction;
                const statusColor =
                  ai?.status === "Safe"
                    ? "bg-green-500 text-white"
                    : ai?.status === "Target"
                    ? "bg-amber-500 text-white"
                    : "bg-red-500 text-white";

                return (
                  <div key={`${college.id}-${idx}`} className="relative flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition">
                    {/* AI Probability Header Badge */}
                    <div className="bg-gray-900 text-white px-4 py-2.5 flex items-center justify-between text-xs font-medium border-b border-gray-800">
                      <span className="flex items-center gap-1.5 text-orange-400 font-semibold">
                        <Bot className="w-4 h-4" /> Prob: {ai?.admissionProbability}%
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                          <Gauge className="w-3 h-3 text-emerald-400" /> Conf: {ai?.confidenceScore}%
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider ${statusColor}`}>
                          {ai?.status || "Predicting"}
                        </span>
                      </div>
                    </div>

                    <CollegeCard college={college} />

                    {/* AI Prediction Interval & Model Metrics Footer */}
                    <div className="p-4 bg-gray-50 border-t border-gray-100 text-xs text-gray-700 space-y-1.5">
                      <div className="font-semibold text-gray-900 flex justify-between items-center">
                        <span>Course: <span className="text-orange-600">{college.matchedCourse}</span></span>
                        <span className="text-gray-500 text-[11px]">Est. Cutoff: {ai?.predictedClosingRank?.toLocaleString()}</span>
                      </div>
                      
                      {ai?.predictionInterval && (
                        <div className="flex items-center justify-between text-[11px] text-gray-600 bg-white px-2.5 py-1.5 rounded-lg border border-gray-200/60 font-mono">
                          <span className="flex items-center gap-1 text-gray-500 font-sans font-medium">
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> 90% Predict Range:
                          </span>
                          <span className="font-bold text-gray-800">
                            {ai.predictionInterval.lower.toLocaleString()} – {ai.predictionInterval.upper.toLocaleString()}
                          </span>
                        </div>
                      )}

                      {ai?.trendSummary && (
                        <p className="text-[11px] text-gray-500 leading-tight italic">
                          💡 {ai.trendSummary}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

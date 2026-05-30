"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { TrendingUp, ChevronDown, Loader2, AlertCircle } from "lucide-react";
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
      }));

      setResults(formattedData);
    } catch (err: any) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div style={{ background: "linear-gradient(135deg, #0A1628, #1A2B4A)" }} className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-5xl mb-4">🎯</div>
          <h1 className="font-display text-4xl font-bold text-white mb-3">College Rank Predictor</h1>
          <p className="text-gray-300 mb-8">
            Enter your exam rank to discover colleges you're likely to get admission in based on historical cutoffs.
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
                  Analyzing Historical Data...
                </>
              ) : (
                <>
                  <TrendingUp className="w-5 h-5" />
                  Predict My Colleges
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {results !== null && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-8">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-1">
              {results.length} colleges predicted for rank {rank}
            </h2>
            <p className="text-gray-500 text-sm">
              Based on historical {exam} closing ranks for {category} category.
            </p>
          </div>

          {results.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm max-w-2xl mx-auto">
              <div className="text-5xl mb-4">📉</div>
              <h3 className="font-display text-2xl font-bold text-gray-900 mb-2">No guaranteed matches found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Based on historical data in our database, this rank might be tough for the top-tier institutions. Try adjusting your category or exploring state-level exams.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((college, idx) => (
                <div key={`${college.id}-${idx}`} className="relative group">
                  <CollegeCard college={college} />
                  <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-center z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="bg-gray-900/90 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-xl backdrop-blur-sm text-center max-w-[85%]">
                      Qualifies for:<br /> <span className="text-orange-400">{college.matchedCourse}</span> <br />(Closed at {college.closingRank})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

"use client";
import { useState, useMemo, useEffect } from "react";
import { Search, SlidersHorizontal, X, ChevronDown, Loader2 } from "lucide-react";
import CollegeCard from "@/components/CollegeCard";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const STREAMS = ["All Streams", "Engineering", "Management", "Medical", "Law", "Arts", "Science", "Architecture"];
const STATES = ["All States", "Maharashtra", "Delhi", "Tamil Nadu", "Karnataka", "Gujarat", "Rajasthan", "Telangana", "West Bengal", "Jharkhand"];
const TYPES = ["All Types", "Government", "Private", "Deemed", "Autonomous"];
const SORT_OPTIONS = [
  { value: "ranking", label: "Ranking" },
  { value: "rating", label: "Rating" },
  { value: "fees_low", label: "Fees: Low to High" },
  { value: "fees_high", label: "Fees: High to Low" },
  { value: "placement", label: "Placement %" },
];
const ACRONYMS: Record<string, string> = {
  iit: "indian institute of technology",
  nit: "national institute of technology",
  iim: "indian institute of management",
  iiit: "indian institute of information technology",
  aiims: "all india institute of medical sciences",
  nlu: "national law university",
};

export default function CollegesClientPage() {
  const searchParams = useSearchParams();

  const [colleges, setColleges] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const initialQuery = searchParams.get("query") || searchParams.get("course") || "";
  const initialStream = searchParams.get("stream") || "All Streams";
  const initialExam = searchParams.get("exam") || "All Exams";
  const [query, setQuery] = useState(initialQuery);
  const [stream, setStream] = useState(initialStream);
  const [exam, setExam] = useState(initialExam);
  const [state, setState] = useState("All States");
  const [type, setType] = useState("All Types");
  const [sort, setSort] = useState("ranking");
  const [compareList, setCompareList] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const urlQuery = searchParams.get("query");
    if (urlQuery !== null && urlQuery !== query) setQuery(urlQuery);
    const urlStream = searchParams.get("stream");
    if (urlStream !== null && urlStream !== stream) setStream(urlStream);
    const urlExam = searchParams.get("exam");
    if (urlExam !== null && urlExam !== exam) setExam(urlExam);
  }, [searchParams]);

  useEffect(() => {
    setPage(1);
  }, [query, stream, exam]);

  useEffect(() => {
    const fetchColleges = async () => {
      if (page === 1) setIsLoading(true);
      else setIsLoadingMore(true);

      try {
        const url = `/api/colleges?page=${page}&limit=9&search=${encodeURIComponent(query)}&stream=${encodeURIComponent(stream)}&exam=${encodeURIComponent(exam)}`;
        const response = await fetch(url);
        const result = await response.json();

        const formattedData = result.data.map((college: any) => {
          const reviewsArr = college.reviews || [];
          const totalReviews = reviewsArr.length > 0 ? reviewsArr.length : college._count?.reviews || 0;
          const liveRating = reviewsArr.length > 0
            ? reviewsArr.reduce((acc: number, rev: any) => acc + rev.rating, 0) / reviewsArr.length
            : college.rating || 0;

          return {
            id: college.id,
            name: college.name,
            location: college.location,
            type: college.type,
            established: college.established?.toString(),
            naacGrade: college.naacGrade || "N/A",
            ranking: college.ranking || 999,
            rankingBody: college.rankingBody || "Ranked",
            image: college.imageUrl || "https://images.unsplash.com/photo-1562774053-701939374585?w=800",
            rating: parseFloat(Number(liveRating).toFixed(1)),
            reviewCount: totalReviews,
            courses: college.courses || [],
            fees: {
              min: college.courses?.length > 0 ? college.courses[0].firstYearFee : 0,
            },
            placements: {
              placementRate: college.placementRate || 0,
              averageSalary: college.avgCtc || 0,
            },
          };
        });

        if (page === 1) setColleges(formattedData);
        else setColleges((prev) => [...prev, ...formattedData]);

        setHasMore(result.meta?.hasMore || false);
      } catch (error) {
        console.error("Failed to fetch colleges:", error);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchColleges();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [page, query, stream, exam]);

  const filtered = useMemo(() => {
    let list = colleges.filter((c) => {
      const q = query.toLowerCase();
      const searchTerms = q.split(/\s+/).filter(Boolean);
      const matchQ = searchTerms.length === 0 || searchTerms.every((term) => {
        const expandedTerm = ACRONYMS[term];
        return (
          c.name.toLowerCase().includes(term) ||
          (expandedTerm && c.name.toLowerCase().includes(expandedTerm)) ||
          c.location.toLowerCase().includes(term) ||
          c.courses?.some((course: any) =>
            course.name.toLowerCase().includes(term) ||
            course.stream.toLowerCase().includes(term)
          )
        );
      });

      const matchState = state === "All States" || c.location.includes(state);
      const matchType = type === "All Types" || c.type === type;
      return matchQ && matchState && matchType;
    });

    list = [...list].sort((a, b) => {
      if (sort === "ranking") return a.ranking - b.ranking;
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "fees_low") return a.fees.min - b.fees.min;
      if (sort === "fees_high") return b.fees.min - a.fees.min;
      if (sort === "placement") return b.placements.placementRate - a.placements.placementRate;
      return 0;
    });

    return list;
  }, [state, type, sort, colleges, query]);

  const toggleCompare = (id: string) => {
    setCompareList((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-1">Find Colleges in India</h1>
          <p className="text-gray-500 mb-6">Explore 30+ colleges across streams, states, and budgets</p>

          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                type="text"
                placeholder="Search by college name, course, or city..."
                className="w-full pl-11 pr-10 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition bg-white"
              />
              {query && (
                <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              )}

              {showSuggestions && query && (
                <div
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 shadow-xl rounded-xl z-50 overflow-hidden"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {isLoading ? (
                    <div className="p-4 text-sm text-gray-500 text-center flex justify-center items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-orange-500" /> Searching...
                    </div>
                  ) : filtered.length > 0 ? (
                    filtered.slice(0, 5).map((college) => (
                      <Link
                        href={`/colleges/${college.id}`}
                        key={college.id}
                        className="block px-4 py-3 hover:bg-orange-50 border-b border-gray-50 last:border-0"
                      >
                        <div className="font-semibold text-gray-900 text-sm">{college.name}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          📍 {college.location}
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="p-4 text-sm text-gray-500 text-center">No colleges found for "{query}"</div>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:border-orange-400 transition"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </div>

          {filtersOpen && (
            <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-100">
              <div className="relative">
                <select
                  value={stream}
                  onChange={(e) => setStream(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 outline-none focus:border-orange-400 bg-white"
                >
                  {STREAMS.map((s) => <option key={s}>{s}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 outline-none focus:border-orange-400 bg-white"
                >
                  {STATES.map((s) => <option key={s}>{s}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 outline-none focus:border-orange-400 bg-white"
                >
                  {TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 outline-none focus:border-orange-400 bg-white"
                >
                  {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
              </div>
              {(state !== "All States" || type !== "All Types" || stream !== "All Streams" || exam !== "All Exams") && (
                <button
                  onClick={() => { setState("All States"); setType("All Types"); setStream("All Streams"); setExam("All Exams"); }}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-red-500 border border-red-200 hover:bg-red-50 transition"
                >
                  <X className="w-3 h-3" /> Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            {isLoading ? "Searching database..." : (
              <>
                Showing <span className="font-semibold text-gray-900">{filtered.length}</span> colleges
                {query && <span> for "<span className="text-orange-600">{query}</span>"</span>}
                {exam !== "All Exams" && <span> matching exam "<span className="text-orange-600">{exam}</span>"</span>}
              </>
            )}
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            Sort by:
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none pl-3 pr-7 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-700 outline-none bg-white"
              >
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-orange-500" />
            <p className="font-medium">Loading colleges...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="font-display text-xl font-semibold text-gray-900 mb-2">No colleges found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((college) => (
                <CollegeCard
                  key={college.id}
                  college={college}
                  onCompare={toggleCompare}
                  compareSelected={compareList.includes(college.id)}
                />
              ))}
            </div>

            {hasMore && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={isLoadingMore}
                  className="px-8 py-3 bg-white border border-gray-200 hover:border-orange-500 hover:text-orange-500 text-gray-700 font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Loading...
                    </>
                  ) : (
                    "Load More Colleges"
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {compareList.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-700">Compare ({compareList.length}/3):</span>
              {compareList.map((id) => {
                const c = colleges.find((col) => col.id === id);
                return c ? (
                  <span key={id} className="flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm">
                    {c.name.split(" ").slice(0, 3).join(" ")}
                    <button onClick={() => toggleCompare(id)}><X className="w-3 h-3" /></button>
                  </span>
                ) : null;
              })}
            </div>
            <Link
              href={`/compare?ids=${compareList.join(",")}`}
              className="px-5 py-2 text-sm font-semibold text-white bg-orange-500 rounded-xl hover:bg-orange-600 transition"
            >
              Compare Now
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

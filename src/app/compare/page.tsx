"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { X, Plus, Star, MapPin, Loader2, Search } from "lucide-react";
import Link from "next/link";

// Formatting Helpers
function formatSalary(n: number) {
  if (!n) return "N/A";
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)} L`;
  return `₹${n.toLocaleString()}`;
}

function formatFee(n: number) {
  if (!n) return "N/A";
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  return `₹${(n / 1000).toFixed(0)}K`;
}

// Table Configuration
const COMPARE_ROWS = [
  { label: "Location", key: (c: any) => c.location },
  { label: "Type", key: (c: any) => c.type },
  { label: "Ranking", key: (c: any) => `#${c.ranking} (${c.rankingBody})` },
  { label: "NAAC Grade", key: (c: any) => c.naacGrade },
  { label: "Established", key: (c: any) => c.established },
  { label: "Rating", key: (c: any) => `${c.rating}/5 (${c.reviewCount.toLocaleString()} reviews)` },
  { label: "Min Fees (per year)", key: (c: any) => formatFee(c.fees.min) },
  { label: "Max Fees (per year)", key: (c: any) => formatFee(c.fees.max) },
  { label: "Avg. Package", key: (c: any) => formatSalary(c.placements.averageSalary) },
  { label: "Highest Package", key: (c: any) => formatSalary(c.placements.highestSalary) },
  { label: "Placement Rate", key: (c: any) => `${c.placements.placementRate}%` },
  { label: "Accreditation", key: (c: any) => c.accreditation },
  { label: "Admission Process", key: (c: any) => c.admissionProcess },
];

function CompareContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [colleges, setColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Picker State
  const [showPicker, setShowPicker] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [pickerResults, setPickerResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // 1. Sync state with URL on load
  useEffect(() => {
    const idsFromUrl = searchParams.get("ids");
    if (idsFromUrl) {
      setSelectedIds(idsFromUrl.split(",").filter(Boolean));
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  // 2. Fetch selected colleges from the backend API
  useEffect(() => {
    if (selectedIds.length === 0) {
      setColleges([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`/api/compare?ids=${selectedIds.join(",")}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data) setColleges(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [selectedIds]);

  // 3. Search database for the "Add College" picker
  useEffect(() => {
    if (!searchQuery.trim()) {
      setPickerResults([]);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      fetch(`/api/colleges?search=${encodeURIComponent(searchQuery)}&limit=10`)
        .then((res) => res.json())
        .then((data) => {
          if (data.data) {
            // Filter out colleges that are already selected
            const filtered = data.data.filter((c: any) => !selectedIds.includes(c.id));
            setPickerResults(filtered);
          }
          setIsSearching(false);
        });
    }, 400); // Debounce search

    return () => clearTimeout(timer);
  }, [searchQuery, selectedIds]);

  // Handlers
  const updateUrl = (newIds: string[]) => {
    router.push(`/compare?ids=${newIds.join(",")}`);
  };

  const addCollege = (id: string, slot: number) => {
    const newSelected = [...selectedIds];
    newSelected[slot] = id; 
    setSelectedIds(newSelected);
    updateUrl(newSelected);
    setShowPicker(null);
    setSearchQuery("");
  };

  const removeCollege = (slot: number) => {
    const newSelected = selectedIds.filter((_, i) => i !== slot);
    setSelectedIds(newSelected);
    updateUrl(newSelected);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-1">Compare Colleges</h1>
          <p className="text-gray-500">Compare up to 3 colleges side-by-side on key parameters</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-orange-500 mb-4" />
            <p className="text-gray-500 font-medium">Loading comparison data...</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr>
                    <th className="w-48 p-4 bg-gray-50 text-left text-sm font-semibold text-gray-600 border-b border-gray-100">
                      Parameter
                    </th>
                    {[0, 1, 2].map((slot) => {
                      const college = colleges[slot];
                      return (
                        <th key={slot} className="p-4 bg-white border-l border-b border-gray-100 min-w-[260px] align-top">
                          {college ? (
                            <div className="relative text-left">
                              <button
                                onClick={() => removeCollege(slot)}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-50 text-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition z-10"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                              {/* 👇 FIX 1: Added onError fallback so broken images load a default photo! */}
                              <img 
                                src={college.image} 
                                alt={college.name} 
                                className="w-full h-32 object-cover rounded-xl mb-3 shadow-sm bg-gray-100" 
                                onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1562774053-701939374585?w=800"; }}
                              />
                              <Link href={`/colleges/${college.id}`} className="text-base font-bold text-gray-900 hover:text-orange-600 transition leading-tight block mb-1">
                                {college.name}
                              </Link>
                              <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                                <MapPin className="w-3 h-3" /> {college.city}
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-semibold">{college.rating}</span>
                                <span className="text-xs text-gray-400">({college.reviewCount})</span>
                              </div>
                            </div>
                          ) : (
                            <div className="relative h-full flex flex-col items-center justify-center pt-4">
                              {selectedIds.length < 3 ? (
                                <button
                                  onClick={() => setShowPicker(slot)}
                                  className="w-full h-36 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center text-gray-400 hover:border-orange-300 hover:text-orange-500 hover:bg-orange-50 transition"
                                >
                                  <Plus className="w-8 h-8 mb-2" />
                                  <span className="text-sm font-medium">Add College</span>
                                </button>
                              ) : null}

                              {showPicker === slot && (
                                <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-2xl z-50 p-3">
                                  <div className="relative mb-2">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    {/* 👇 FIX 2: Added text-gray-900 and placeholder-gray-400 */}
                                    <input
                                      value={searchQuery}
                                      onChange={(e) => setSearchQuery(e.target.value)}
                                      placeholder="Search by name..."
                                      className="w-full pl-9 pr-3 py-2 text-sm text-gray-900 placeholder-gray-400 border border-gray-200 rounded-lg outline-none focus:border-orange-400 bg-gray-50 focus:bg-white transition-colors"
                                      autoFocus
                                    />
                                  </div>
                                  
                                  <div className="max-h-56 overflow-y-auto space-y-1">
                                    {isSearching ? (
                                      <div className="py-4 text-center text-xs text-gray-400">Searching database...</div>
                                    ) : pickerResults.length > 0 ? (
                                      pickerResults.map((c) => (
                                        <button
                                          key={c.id}
                                          onClick={() => addCollege(c.id, slot)}
                                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 rounded-lg transition"
                                        >
                                          <div className="font-medium text-gray-900 truncate">{c.name}</div>
                                          <div className="text-xs text-gray-500 truncate">{c.location}</div>
                                        </button>
                                      ))
                                    ) : searchQuery ? (
                                      <div className="py-4 text-center text-xs text-gray-400">No colleges found</div>
                                    ) : (
                                      <div className="py-4 text-center text-xs text-gray-400">Type to search...</div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_ROWS.map((row, i) => (
                    <tr key={row.label} className={i % 2 === 0 ? "bg-gray-50/30" : "bg-white"}>
                      <td className="p-4 text-sm font-semibold text-gray-700 border-b border-gray-50">
                        {row.label}
                      </td>
                      {[0, 1, 2].map((slot) => {
                        const college = colleges[slot];
                        return (
                          <td key={slot} className="p-4 text-sm text-gray-600 border-l border-b border-gray-50">
                            {college ? row.key(college) : <span className="text-gray-300">—</span>}
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                  {/* Top Recruiters Row */}
                  <tr className="bg-gray-50/30">
                    <td className="p-4 text-sm font-semibold text-gray-700">Top Recruiters</td>
                    {[0, 1, 2].map((slot) => {
                      const college = colleges[slot];
                      return (
                        <td key={slot} className="p-4 border-l border-gray-50">
                          {college ? (
                            <div className="flex flex-wrap gap-1.5">
                              {college.placements.topRecruiters.slice(0, 4).map((r: string) => (
                                <span key={r} className="px-2.5 py-1 bg-white border border-gray-200 text-gray-700 rounded-md text-xs font-medium shadow-sm">
                                  {r}
                                </span>
                              ))}
                            </div>
                          ) : <span className="text-gray-300 text-sm">—</span>}
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Share Hint */}
        {selectedIds.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
            💡 This comparison is shareable! Just copy the URL in your browser.
          </div>
        )}
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>}>
      <CompareContent />
    </Suspense>
  );
}
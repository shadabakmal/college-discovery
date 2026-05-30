"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Star, TrendingUp, Heart } from "lucide-react";

export default function CollegeCard({
  college,
  onCompare,
  compareSelected,
  forceSaved = false, // Add this prop to force "saved" state on Dashboard
}: {
  college: any;
  onCompare?: (id: string) => void;
  compareSelected?: boolean;
  forceSaved?: boolean;
}) {
  // Initialize with forceSaved or default false
  const [isSaved, setIsSaved] = useState(forceSaved);
  const [loading, setLoading] = useState(false);

  // Sync isSaved if forceSaved prop updates
  useEffect(() => {
    setIsSaved(forceSaved);
  }, [forceSaved]);

  // Fetch status only if NOT forced to be saved
  useEffect(() => {
    if (forceSaved) return;

    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;
    const user = JSON.parse(storedUser);
    if (!user?.id) return;

    fetch(`/api/user/saved-colleges?userId=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          const savedIds = data.data.map((item: any) => item.collegeId);
          setIsSaved(savedIds.includes(college.id));
        }
      })
      .catch((err) => console.error("Error fetching saved status:", err));
  }, [college.id, forceSaved]);

  const toggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      alert("Please log in to save colleges.");
      setLoading(false);
      return;
    }

    const user = JSON.parse(storedUser);
    const userId = user?.id || user?._id || user?.userId || user?.user_id;
    const collegeId = college?.id || college?._id;

    if (!userId || !collegeId) {
      setLoading(false);
      return;
    }

    const previousState = isSaved;
    setIsSaved(!previousState);

    try {
      const method = previousState ? "DELETE" : "POST";
      const res = await fetch("/api/user/saved-colleges", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, collegeId }),
      });

      if (!res.ok) throw new Error("Failed to update status");
      
      // Notify other parts of the app
      window.dispatchEvent(new Event("savedCollegesChanged"));
    } catch (error) {
      console.error("Failed to toggle save:", error);
      setIsSaved(previousState);
    } finally {
      setLoading(false);
    }
  };

  const feeDisplay = college.fees?.min ? `₹${(college.fees.min / 100000).toFixed(1)}L/yr` : "N/A";
  const ctcDisplay = college.placements?.averageSalary ? `₹${(college.placements.averageSalary / 100000).toFixed(1)}L` : "N/A";
  const placementDisplay = college.placements?.placementRate ? `${college.placements.placementRate}%` : "N/A";
  const realReviewCount = college.reviewCount || 0;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full group">
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img src={college.image || college.imageUrl} alt={college.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        
        <button
          onClick={toggleSave}
          disabled={loading}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
        >
          <Heart className={`w-5 h-5 transition-colors ${isSaved ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500"} ${loading ? "opacity-50" : ""}`} />
        </button>

        <div className="absolute top-3 left-3 flex gap-2">
          {college.ranking && (
            <span className="px-2.5 py-1 text-xs font-bold text-white bg-orange-500 rounded-md shadow-sm">
              #{college.ranking} {college.rankingBody}
            </span>
          )}
        </div>

        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/95 px-2 py-1 rounded-md shadow-sm">
          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-500" />
          <span className="text-xs font-extrabold text-gray-900">{college.rating}</span>
          <span className="text-xs font-semibold text-gray-500">({realReviewCount})</span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-lg text-gray-900 leading-tight mb-1 group-hover:text-orange-600 transition-colors line-clamp-1">{college.name}</h3>
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
          {college.location}
        </div>

        <div className="grid grid-cols-3 gap-2 py-4 border-t border-gray-100 mt-auto">
          <div className="text-center border-r border-gray-100">
            <div className="text-sm font-bold text-gray-900">{feeDisplay}</div>
            <div className="text-[10px] text-gray-400 uppercase mt-0.5">Fees</div>
          </div>
          <div className="text-center border-r border-gray-100">
            <div className="text-sm font-bold text-gray-900">{placementDisplay}</div>
            <div className="text-[10px] text-gray-400 uppercase mt-0.5">Placement</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-green-600 flex items-center justify-center gap-0.5"><TrendingUp className="w-3 h-3" /> {ctcDisplay}</div>
            <div className="text-[10px] text-gray-400 uppercase mt-0.5">Avg CTC</div>
          </div>
        </div>
      </div>
    </div>
  );
}
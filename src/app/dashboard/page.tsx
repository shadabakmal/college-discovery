"use client";
import { useEffect, useState } from "react";
import CollegeCard from "@/components/CollegeCard";
import { Loader2, BookmarkX } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [savedColleges, setSavedColleges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id) {
      setLoading(false);
      return;
    }

    fetch(`/api/user/saved-colleges?userId=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setSavedColleges(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2 text-white">My Saved Colleges</h1>
      <p className="text-gray-400 mb-8">{savedColleges.length} college{savedColleges.length !== 1 ? "s" : ""} saved</p>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin w-10 h-10 text-orange-500" />
        </div>
      ) : savedColleges.length === 0 ? (
        <div className="flex flex-col items-center py-20 gap-4">
          <BookmarkX className="w-16 h-16 text-gray-600" />
          <p className="text-gray-400 text-lg">No colleges saved yet.</p>
          <Link href="/colleges" className="px-6 py-2.5 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition">
            Explore Colleges
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {savedColleges.map((college: any) => (
            <CollegeCard key={college.id} college={college} />
          ))}
        </div>
      )}
    </div>
  );
}
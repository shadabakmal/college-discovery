"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, ChevronDown, LogOut, Heart } from "lucide-react"; // ✅ removed MessageCircleQuestion

function UserMenu() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [savedCount, setSavedCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  // ✅ Pass userId in the URL
  const fetchSavedCount = async (userId: string) => {
    try {
      const res = await fetch(`/api/user/saved-colleges?userId=${userId}`);
      const data = await res.json();
      setSavedCount(data.data?.length || 0);
    } catch {
      setSavedCount(0);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      if (userData.id) fetchSavedCount(userData.id); // ✅ pass userId
    }
    setIsLoading(false);

    const handleSavedChange = () => {
      const u = localStorage.getItem("user");
      if (u) {
        const userData = JSON.parse(u);
        if (userData.id) fetchSavedCount(userData.id); // ✅ pass userId
      }
    };
    window.addEventListener("savedCollegesChanged", handleSavedChange);
    return () => window.removeEventListener("savedCollegesChanged", handleSavedChange);
  }, []);

  // ✅ Re-fetch when dropdown opens
  useEffect(() => {
    if (open && user?.id) fetchSavedCount(user.id); // ✅ pass userId
  }, [open]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  if (isLoading) return <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse ml-2" />;
  if (!user) return (
    <Link href="/login" className="ml-2 px-6 py-2 text-sm font-semibold text-white bg-[#ff7a3b] rounded-full hover:bg-orange-500 transition-all">
      Login
    </Link>
  );

  const firstName = user.name ? user.name.split(" ")[0] : "User";
  const initial = firstName.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-full hover:bg-[#fff5f0] transition-all"
      >
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold bg-[#ff7a3b]">
          {initial}
        </div>
        <ChevronDown className={`w-4 h-4 text-[#ff7a3b] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-3 w-56 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 py-3 z-50">
          <div className="px-4 py-2 bg-gray-50 mx-3 rounded-lg mb-2 text-sm font-medium text-gray-800">
            Hi {firstName} 👋
          </div>
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <Heart className="w-4 h-4 text-gray-500" /> Saved Colleges
            </div>
            <span className="bg-gray-100 px-2 py-0.5 rounded-full text-[10px] font-bold">
              {savedCount}
            </span>
          </Link>
          {/* ✅ My QNA removed */}
          <div className="border-t border-gray-100 my-1" />
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-orange-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      )}
    </div>
  );
}

// --- MAIN NAVBAR ---
export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="font-display text-2xl font-black text-[#2e266d]">
            COLLEGE<span className="font-light text-gray-500">RADAR</span>
          </Link>

          <form
            onSubmit={(e) => { e.preventDefault(); router.push(`/colleges?query=${searchQuery}`); }}
            className="hidden md:flex flex-1 max-w-xl mx-8"
          >
            <input
              type="text"
              placeholder="Search Colleges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3 bg-gray-100 rounded-full text-sm outline-none focus:ring-2 focus:ring-orange-500"
            />
          </form>

          <div className="flex items-center">
            <div className="hidden md:block"><UserMenu /></div>
            <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>
      {mobileOpen && (
        <div className="md:hidden bg-white border-b p-4"><UserMenu /></div>
      )}
    </header>
  );
}
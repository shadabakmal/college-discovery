"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, ChevronDown, LogOut, Heart, Search } from "lucide-react";

function UserMenu() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null);
  const [open, setOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const fetchSavedCount = async (userId: string) => {
    try {
      const res = await fetch(`/api/user/saved-colleges?userId=${userId}`);
      const data = await res.json();
      if (data.data) setSavedCount(data.data.length);
    } catch {}
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const u = JSON.parse(storedUser);
      setUser(u);
      if (u?.id) fetchSavedCount(u.id);
    }
    const handleSavedChange = () => {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      if (u?.id) fetchSavedCount(u.id);
    };
    window.addEventListener("savedCollegesChanged", handleSavedChange);
    return () => window.removeEventListener("savedCollegesChanged", handleSavedChange);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setOpen(false);
    router.push("/");
  };

  if (!user) {
    return (
      <Link
        href="/login"
        className="px-4 py-2 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors shrink-0"
      >
        Login
      </Link>
    );
  }

  const initial = user.name?.[0]?.toUpperCase() ?? "U";
  const firstName = user.name?.split(" ")[0] ?? "User";

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-xl border-2 border-gray-200 hover:border-orange-400 transition-colors"
      >
        <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-bold">
          {initial}
        </div>
        <span className="text-sm font-medium text-gray-700 hidden sm:block">{firstName}</span>
        <ChevronDown className={`w-4 h-4 text-orange-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors"
          >
            <Heart className="w-4 h-4" />
            Saved Colleges
            {savedCount > 0 && (
              <span className="ml-auto bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-white border-b-2 border-gray-200 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="font-bold text-xl">
              <span className="text-gray-900">COLLEGE</span>
              <span className="text-orange-500">RADAR</span>
            </span>
          </Link>

          {/* Search Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              router.push(`/colleges?query=${searchQuery}`);
            }}
            className="flex-1 max-w-xl"
          >
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search colleges, courses, cities..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-gray-300 bg-gray-50 text-sm text-gray-900 placeholder-gray-500 outline-none focus:border-orange-400 focus:bg-white transition-all"
              />
            </div>
          </form>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { label: "Colleges", href: "/colleges" },
              { label: "Compare", href: "/compare" },
              { label: "Predictor", href: "/predictor" },
              { label: "Discussions", href: "/discussions" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <UserMenu />

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-500 border border-gray-200"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 pb-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              router.push(`/colleges?query=${searchQuery}`);
              setMobileOpen(false);
            }}
            className="pt-3 pb-2"
          >
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search colleges..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-gray-300 bg-gray-50 text-sm outline-none focus:border-orange-400"
              />
            </div>
          </form>
          {[
            { label: "Colleges", href: "/colleges" },
            { label: "Compare", href: "/compare" },
            { label: "Predictor", href: "/predictor" },
            { label: "Discussions", href: "/discussions" },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="block py-3 text-sm font-medium border-b border-gray-100 text-gray-700 hover:text-orange-500"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
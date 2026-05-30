"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, ChevronDown, LogOut, Heart, Search } from "lucide-react";

// ... keep your existing UserMenu component the same ...

export default function Navbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    // ✅ Remove sticky, add proper background and border
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

          {/* ✅ Visible Search Bar */}
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

          {/* Mobile toggle */}
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
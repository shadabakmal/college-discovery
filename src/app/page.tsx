import Link from "next/link";
import { Search, Star, TrendingUp, Users, BookOpen, Award, ArrowRight, ChevronRight, Zap } from "lucide-react";
import { prisma } from "@/lib/prisma";
import CollegeCard from "@/components/CollegeCard"; 

const POPULAR_SEARCHES = [
  { name: "IIT Delhi", href: "/colleges?query=Technology+Delhi" }, 
  { name: "NIT Trichy", href: "/colleges?query=Tiruchirappalli" }, 
  { name: "MBA Colleges", href: "/colleges?stream=Management" },   
  { name: "Medical Colleges", href: "/colleges?stream=Medical" },  
];
const EXAMS = ["JEE Main", "JEE Advanced", "NEET", "CAT", "CLAT", "CUET"];
const STATS = [
  { value: "30+", label: "Colleges Listed", icon: "📚" },
  { value: "100+", label: "Students Helped", icon: "🎓" },
  { value: "20+", label: "Reviews", icon: "⭐" },
  { value: "98%", label: "Satisfaction", icon: "🏆" },
];
const TOP_STREAMS = [
  { name: "Engineering", icon: "⚙️", count: "10+ colleges", href: "/colleges?stream=Engineering" },
  { name: "Management", icon: "📊", count: "5+ colleges", href: "/colleges?stream=Management" },
  { name: "Medical", icon: "🏥", count: "5+ colleges", href: "/colleges?stream=Medical" },
  { name: "Law", icon: "⚖️", count: "5+ colleges", href: "/colleges?stream=Law" },
  { name: "Science", icon: "🔬", count: "3+ colleges", href: "/colleges?stream=Science" },
  { name: "Arts", icon: "🎨", count: "2+ colleges", href: "/colleges?stream=Arts" },
];

export default async function Home() {
  // 1. Fetch from the database and INCLUDE courses AND reviews!
  const dbColleges = await prisma.college.findMany({
    take: 6,
    orderBy: { ranking: "asc" },
    include: { 
      courses: true,
      reviews: true, // 👇 CRITICAL FIX: You must include reviews to calculate them later!
    },
  });

  // 2. Format the database result with LIVE rating and count calculations
  const topColleges = dbColleges.map((college) => {
    // Safely get reviews (defaults to empty array if none exist)
    const reviews = college.reviews || [];
    const totalReviews = reviews.length;
    
    // Calculate real-time average
    const avgRating = totalReviews > 0 
      ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / totalReviews)
      : college.rating || 0;

    return {
      id: college.id,
      name: college.name,
      location: college.location,
      type: college.type,
      established: college.established.toString(),
      naacGrade: college.naacGrade || "N/A",
      ranking: college.ranking || 999,
      rankingBody: college.rankingBody || "Ranked",
      image: college.imageUrl || "https://images.unsplash.com/photo-1562774053-701939374585?w=800",
      
      // Use the calculated live values
      rating: parseFloat(avgRating.toFixed(1)),
      reviewCount: totalReviews, 
      
      fees: {
        min: college.courses?.length > 0 ? college.courses[0].firstYearFee : 0,
      },
      placements: {
        placementRate: college.placementRate || 0,
        averageSalary: college.avgCtc || 0,
      },
    };
  });

  return (
    <div>
      {/* Hero */}
      <section
        className="relative overflow-hidden py-20 md:py-28"
        style={{ background: "linear-gradient(135deg, #0A1628 0%, #1A2B4A 60%, #1e3a5f 100%)" }}
      >
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10" style={{ background: "#FF6B35", transform: "translate(30%, -30%)" }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-5" style={{ background: "#FF6B35", transform: "translate(-30%, 30%)" }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/80 text-sm mb-6">
              <Zap className="w-4 h-4 text-orange-400" />
              India's #1 College Discovery Platform
            </div>

            <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Find Your
              <span className="text-orange-400"> Dream College</span>
              <br />with Confidence
            </h1>
            <p className="text-lg text-gray-300 mb-10">
              Compare 30+ colleges, check cutoffs, read verified reviews, and get personalized recommendations.
            </p>

            <div className="relative max-w-2xl mx-auto mb-6">
              <form action="/colleges" className="flex bg-white rounded-2xl overflow-hidden shadow-2xl">
                <div className="flex items-center pl-5 text-gray-400">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="query" 
                  placeholder="Search colleges, courses, or cities..."
                  className="flex-1 py-4 px-4 text-gray-700 placeholder-gray-400 outline-none text-sm"
                  required
                />
                <button
                  type="submit"
                  className="px-6 m-1.5 text-sm font-semibold text-white rounded-xl flex items-center gap-2 whitespace-nowrap bg-orange-500 hover:bg-orange-600 transition-colors cursor-pointer"
                >
                  Search <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-gray-400 text-sm">Popular:</span>
              {POPULAR_SEARCHES.map((searchItem) => (
                <Link
                  key={searchItem.name}
                  href={searchItem.href}
                  className="px-3 py-1 rounded-full text-sm text-white/70 border border-white/20 hover:bg-white/10 transition-colors"
                >
                  {searchItem.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mt-12">
            {STATS.map(({ value, label, icon }) => (
              <div key={label} className="text-center p-4 rounded-2xl bg-white/10 backdrop-blur">
                <div className="text-2xl mb-2">{icon}</div>
                <div className="font-display text-2xl font-bold text-white">{value}</div>
                <div className="text-xs text-gray-400 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exam quick links */}
      <section className="py-8 border-b border-gray-100 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            <span className="text-sm font-semibold text-gray-500 whitespace-nowrap">Explore by Exam:</span>
            {EXAMS.map((exam) => (
              <Link
                key={exam}
                href={`/colleges?exam=${encodeURIComponent(exam)}`}
                className="px-4 py-2 text-sm font-medium rounded-full border-2 border-gray-200 text-gray-500 whitespace-nowrap hover:border-orange-400 hover:text-orange-600 transition-colors"
              >
                {exam}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by stream */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl font-bold mb-1 text-white">Browse by Stream</h2>
            <p className="text-gray-400">Find colleges for your chosen field of study</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {TOP_STREAMS.map(({ name, icon, count, href }) => (
            <Link
              key={name}
              href={href}
              className="group p-4 rounded-2xl border border-gray-800 text-center hover:border-orange-500 transition-all duration-200"
            >
              <div className="text-3xl mb-2">{icon}</div>
              <div className="font-semibold text-sm mb-1 text-gray-200 group-hover:text-orange-500 transition-colors">{name}</div>
              <div className="text-xs text-gray-400">{count}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Top colleges */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl font-bold mb-1 text-white">Top Ranked Colleges</h2>
            <p className="text-gray-400">Based on NIRF Rankings 2024</p>
          </div>
          <Link href="/colleges" className="flex items-center gap-1 text-sm font-medium text-orange-500 hover:text-orange-400 hover:gap-2 transition-all">
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        
        {topColleges.length === 0 ? (
          <div className="text-center text-gray-400 py-10 border border-gray-800 rounded-2xl">
             <p>No colleges found in the database. Did you run the seed script?</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topColleges.map((college) => (
              <CollegeCard key={college.id} college={college as any} />
            ))}
          </div>
        )}
      </section>

      {/* Features strip */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold text-center mb-12 text-gray-900">Everything you need to decide</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { emoji: "📈", title: "Rank Predictor", desc: "Enter your JEE/NEET rank and get a curated list of colleges you're eligible for.", href: "/predictor", cta: "Predict Now" },
              { emoji: "⚖️", title: "College Comparison", desc: "Compare colleges side-by-side on fees, placements, courses, and ratings.", href: "/compare", cta: "Compare Colleges" },
              { emoji: "💬", title: "Q&A Discussions", desc: "Ask questions, share experiences, and get answers from students and alumni.", href: "/discussions", cta: "Join Discussion" },
            ].map(({ emoji, title, desc, href, cta }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-4">{emoji}</div>
                <h3 className="font-display text-lg font-semibold mb-2 text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500 mb-4 leading-relaxed">{desc}</p>
                <Link href={href} className="inline-flex items-center gap-1 text-sm font-medium text-orange-500">
                  {cta} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center rounded-3xl p-12" style={{ background: "linear-gradient(135deg, #0A1628, #1A2B4A)" }}>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to find your perfect college?
          </h2>
          <p className="text-gray-300 mb-8">Join 100+ students who trust CollegeRadar for their admission journey.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/colleges" className="px-6 py-3 text-sm font-semibold rounded-xl text-white bg-orange-500 hover:bg-orange-600 transition-colors">
              Explore All Colleges
            </Link>
            <Link href="/predictor" className="px-6 py-3 text-sm font-semibold rounded-xl text-white border border-white/30 hover:bg-white/10 transition-colors">
              Use Rank Predictor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
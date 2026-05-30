import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { MapPin, Star, Award, BookOpen, Info, Briefcase, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import ReviewSection from "@/components/ReviewSection";

export default async function CollegeDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;

  // 1. Fetch college with all courses and actual reviews
  const college = await prisma.college.findUnique({
    where: { id: resolvedParams.id },
    include: {
      courses: true,
      reviews: true,
    },
  });

  if (!college) notFound();

  // 2. Dynamically calculate rating and review count
  const totalReviews = college.reviews.length;
  const dynamicRating = totalReviews > 0 
    ? (college.reviews.reduce((acc, rev) => acc + rev.rating, 0) / totalReviews).toFixed(1)
    : "0.0";

  const avgCtcDisplay = college.avgCtc ? `₹${(college.avgCtc / 100000).toFixed(1)}L` : "N/A";
  const placementDisplay = college.placementRate ? `${college.placementRate}%` : "N/A";
  const rankingDisplay = college.ranking ? `#${college.ranking} ${college.rankingBody || ""}` : "Unranked";
  
  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Header Banner */}
      <div 
        className="relative h-[350px] flex items-end pb-10"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.4)), url('${college.imageUrl || "https://images.unsplash.com/photo-1562774053-701939374585?w=1600"}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1.5 text-xs font-bold rounded-md text-white bg-orange-500 shadow-sm">{rankingDisplay}</span>
                <span className="px-3 py-1.5 text-xs font-bold rounded-md text-white bg-white/20 backdrop-blur-md">{college.type}</span>
                <span className="px-3 py-1.5 text-xs font-bold rounded-md text-green-800 bg-green-400/90 backdrop-blur-md flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> NAAC {college.naacGrade || "N/A"}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">{college.name}</h1>
              
              {/* Dynamic Rating & Review Count */}
              <div className="flex items-center gap-5 text-gray-300 text-sm font-medium">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-orange-400" /> {college.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  {dynamicRating} ({totalReviews} Reviews)
                </span>
              </div>
            </div>
            
            {/* Dynamic Apply Button */}
            <div className="flex gap-3 shrink-0">
              {college.websiteUrl ? (
                <a 
                  href={college.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors shadow-lg text-center flex items-center justify-center"
                >
                  Apply Now
                </a>
              ) : (
                <button disabled className="px-8 py-3.5 bg-gray-400 text-white font-bold rounded-xl shadow-lg cursor-not-allowed">
                  Link Unavailable
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-4">
              <div><p className="text-gray-500 text-sm font-medium mb-1">Established</p><p className="text-xl font-bold text-gray-900">{college.established}</p></div>
              <div><p className="text-gray-500 text-sm font-medium mb-1">NAAC Grade</p><p className="text-xl font-bold text-orange-600">{college.naacGrade || "N/A"}</p></div>
              <div><p className="text-gray-500 text-sm font-medium mb-1">Placement Rate</p><p className="text-xl font-bold text-green-600">{placementDisplay}</p></div>
              <div><p className="text-gray-500 text-sm font-medium mb-1">Average CTC</p><p className="text-xl font-bold text-gray-900">{avgCtcDisplay}</p></div>
            </div>

            {/* Overview */}
            <div id="overview" className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2 pb-4 border-b border-gray-100">
                <Info className="w-6 h-6 text-orange-500" /> About {college.name.split(" ")[0]}
              </h2>
              <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed">
                {college.overview ? <p>{college.overview}</p> : <p className="italic text-gray-400">Detailed overview coming soon.</p>}
              </div>
            </div>

            {/* Placements */}
            <div id="placements" className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2 pb-4 border-b border-gray-100">
                <Briefcase className="w-6 h-6 text-orange-500" /> Placement Highlights
              </h2>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-green-50 rounded-xl p-5 border border-green-100">
                  <div className="text-green-600 text-sm font-bold mb-1">Highest/Average CTC</div>
                  <div className="text-3xl font-black text-green-700">{avgCtcDisplay}</div>
                </div>
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                  <div className="text-blue-600 text-sm font-bold mb-1">Placement Record</div>
                  <div className="text-3xl font-black text-blue-700">{placementDisplay}</div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <ReviewSection collegeId={college.id} initialReviews={college.reviews} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
             <div className="bg-[#0A1628] rounded-2xl p-8 text-white text-center shadow-xl sticky top-8">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-5">
                  <Award className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Want to know your chances?</h3>
                <p className="text-gray-400 text-sm mb-8 leading-relaxed">Use our AI predictor to see if you can get into {college.name}.</p>
                <Link href="/predictor" className="block w-full py-4 bg-orange-500 hover:bg-orange-600 font-bold rounded-xl transition-all shadow-lg hover:shadow-orange-500/25">
                  Predict My Admission
                </Link>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
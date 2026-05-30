import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const idsParam = searchParams.get("ids");

  if (!idsParam) {
    return NextResponse.json({ data: [] });
  }

  // Split the comma-separated IDs
  const ids = idsParam.split(",").filter(Boolean);

  try {
    const dbColleges = await prisma.college.findMany({
      where: {
        id: { in: ids },
      },
      include: {
        courses: true,
        reviews: true,
      },
    });

    // Format the data to exactly match what the Compare UI expects
    const formattedColleges = dbColleges.map((college) => {
      // 1. Calculate live rating
      const reviews = college.reviews || [];
      const totalReviews = reviews.length;
      const liveRating = totalReviews > 0 
        ? reviews.reduce((acc, rev) => acc + rev.rating, 0) / totalReviews
        : college.rating || 0;

      // 2. Calculate min and max fees from courses
      const courseFees = college.courses.map(c => c.firstYearFee);
      const minFee = courseFees.length > 0 ? Math.min(...courseFees) : 0;
      const maxFee = courseFees.length > 0 ? Math.max(...courseFees) : 0;

      return {
        id: college.id,
        name: college.name,
        location: college.location,
        city: college.location.split(",")[0], // Extract just the city
        type: college.type,
        ranking: college.ranking || 999,
        rankingBody: college.rankingBody || "NIRF",
        naacGrade: college.naacGrade || "N/A",
        established: college.established?.toString() || "N/A",
        image: college.imageUrl || "https://images.unsplash.com/photo-1562774053-701939374585?w=800",
        rating: parseFloat(Number(liveRating).toFixed(1)),
        reviewCount: totalReviews,
        fees: { min: minFee, max: maxFee },
        placements: {
          placementRate: college.placementRate || 0,
          averageSalary: college.avgCtc || 0,
          highestSalary: (college.avgCtc || 0) * 2.5, // Estimated highest package
          topRecruiters: college.topRecruiters || [],
        },
        accreditation: college.naacGrade ? `NAAC ${college.naacGrade}` : "UGC Approved",
        admissionProcess: "Entrance Based",
      };
    });

    // Ensure the results match the exact order of the IDs requested
    const orderedResults = ids.map(id => formattedColleges.find(c => c.id === id)).filter(Boolean);

    return NextResponse.json({ data: orderedResults });
  } catch (error) {
    console.error("Compare API Error:", error);
    return NextResponse.json({ error: "Failed to fetch colleges" }, { status: 500 });
  }
}
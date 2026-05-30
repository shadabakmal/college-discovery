import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const exam = searchParams.get("exam");
  const category = searchParams.get("category");
  const rankParam = searchParams.get("rank");

  if (!exam || !category || !rankParam) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const userRank = parseInt(rankParam);

  try {
    const predictions = await prisma.cutoff.findMany({
      where: {
        exam: exam,
        category: category,
        closingRank: {
          gte: userRank,
        },
      },
      include: {
        // 👇 FIX: Tell Prisma to grab reviews and courses too!
        college: {
          include: {
            reviews: true,
            courses: true,
          }
        },
      },
      orderBy: {
        closingRank: 'asc',
      },
      take: 20,
    });

    const formattedData = predictions.map((cutoff) => {
      // Calculate real-time reviews
      const reviews = cutoff.college.reviews || [];
      const totalReviews = reviews.length;
      const avgRating = totalReviews > 0 
        ? reviews.reduce((acc, rev) => acc + rev.rating, 0) / totalReviews 
        : cutoff.college.rating || 0;

      // Get minimum fee from courses
      const courses = cutoff.college.courses || [];
      const minFee = courses.length > 0 ? courses[0].firstYearFee : 0;

      return {
        college: {
          id: cutoff.college.id,
          name: cutoff.college.name,
          location: cutoff.college.location,
          type: cutoff.college.type,
          established: cutoff.college.established, // Send established year
          ranking: cutoff.college.ranking,
          imageUrl: cutoff.college.imageUrl,
          placementRate: cutoff.college.placementRate,
          avgCtc: cutoff.college.avgCtc,
          // 👇 Send calculated stats to the frontend
          rating: parseFloat(avgRating.toFixed(1)),
          reviewCount: totalReviews,
          minFee: minFee,
        },
        course: {
          name: cutoff.courseName,
        },
        closingRank: cutoff.closingRank,
      };
    });

    return NextResponse.json({ data: formattedData });
  } catch (error) {
    console.error("Predictor API Error:", error);
    return NextResponse.json({ error: "Failed to fetch predictions" }, { status: 500 });
  }
}
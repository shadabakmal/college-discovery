import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateAIPrediction, CutoffHistoryItem } from "@/lib/aiPredictor";

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
    // Fetch all cutoff records matching exam and category across all historical years
    const allCutoffs = await prisma.cutoff.findMany({
      where: {
        exam: exam,
        category: category,
      },
      include: {
        college: {
          include: {
            reviews: true,
            courses: true,
          },
        },
      },
      orderBy: {
        year: "asc",
      },
    });

    // Group cutoffs by collegeId + courseName
    const grouped = new Map<string, { college: any; courseName: string; history: CutoffHistoryItem[] }>();

    for (const record of allCutoffs) {
      const key = `${record.collegeId}_${record.courseName}`;
      if (!grouped.has(key)) {
        grouped.set(key, {
          college: record.college,
          courseName: record.courseName,
          history: [],
        });
      }
      grouped.get(key)!.history.push({
        year: record.year,
        openingRank: record.openingRank,
        closingRank: record.closingRank,
      });
    }

    // Run AI Model Prediction for each college course option
    const predictions = [];

    for (const [_, item] of grouped) {
      const aiResult = calculateAIPrediction(userRank, item.history);

      // Only include options where admission probability is reasonable (>= 5%)
      if (aiResult.admissionProbability >= 5) {
        const reviews = item.college.reviews || [];
        const totalReviews = reviews.length;
        const avgRating =
          totalReviews > 0
            ? reviews.reduce((acc: number, rev: any) => acc + rev.rating, 0) / totalReviews
            : item.college.rating || 0;

        const courses = item.college.courses || [];
        const minFee = courses.length > 0 ? courses[0].firstYearFee : 0;

        predictions.push({
          college: {
            id: item.college.id,
            name: item.college.name,
            location: item.college.location,
            type: item.college.type,
            established: item.college.established,
            ranking: item.college.ranking,
            imageUrl: item.college.imageUrl,
            placementRate: item.college.placementRate,
            avgCtc: item.college.avgCtc,
            rating: parseFloat(avgRating.toFixed(1)),
            reviewCount: totalReviews,
            minFee: minFee,
          },
          course: {
            name: item.courseName,
          },
          closingRank: item.history[item.history.length - 1]?.closingRank || 0,
          aiPrediction: aiResult,
        });
      }
    }

    // Sort predictions by admission probability descending
    predictions.sort((a, b) => b.aiPrediction.admissionProbability - a.aiPrediction.admissionProbability);

    return NextResponse.json({ data: predictions.slice(0, 30) });
  } catch (error) {
    console.error("AI Predictor API Error:", error);
    return NextResponse.json({ error: "Failed to calculate AI predictions" }, { status: 500 });
  }
}
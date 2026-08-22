import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateAIPrediction, CutoffHistoryItem } from "@/lib/aiPredictor";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const exam = searchParams.get("exam");
  const category = searchParams.get("category");
  const rankParam = searchParams.get("rank");

  if (!exam || !category || !rankParam) {
    return NextResponse.json({ error: "Missing required fields: exam, category, rank" }, { status: 400 });
  }

  const userRank = parseInt(rankParam);

  try {
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

    const predictions = [];

    for (const [_, item] of grouped) {
      // Forecast 2027 Admission Cycle using 4-Year Historical Data (2023-2026)
      const aiResult = calculateAIPrediction(userRank, item.history, 2027);

      if (aiResult.admissionProbability >= 3) {
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

    predictions.sort((a, b) => b.aiPrediction.admissionProbability - a.aiPrediction.admissionProbability);

    return NextResponse.json({ data: predictions.slice(0, 30) });
  } catch (error) {
    console.error("AI Predictor API Error:", error);
    return NextResponse.json({ error: "Failed to calculate AI predictions" }, { status: 500 });
  }
}
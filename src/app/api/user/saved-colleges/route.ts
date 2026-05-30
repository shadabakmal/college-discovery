import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) return NextResponse.json({ data: [] });

    const saved = await prisma.savedCollege.findMany({
      where: { userId },
      include: {
        college: {
          include: {
            courses: true, // ✅ needed for fees
          },
        },
      },
    });

    // ✅ Map to college objects with correct field names for CollegeCard
    const colleges = saved.map((item) => {
      const college = item.college;
      const firstYearFee = college.courses?.[0]?.firstYearFee || null;

      return {
        id: college.id,
        name: college.name,
        location: college.location,
        image: college.imageUrl,
        imageUrl: college.imageUrl,
        ranking: college.ranking,
        rankingBody: college.rankingBody,
        rating: college.rating,
        reviewCount: college.reviewCount,
        fees: firstYearFee ? { min: firstYearFee } : null,
        placements: {
          placementRate: college.placementRate,
          averageSalary: college.avgCtc,
        },
      };
    });

    return NextResponse.json({ data: colleges });
  } catch (err: any) {
    console.error("GET ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, collegeId } = body;

    if (!userId || !collegeId) {
      return NextResponse.json({ error: "Missing userId or collegeId" }, { status: 400 });
    }

    const saved = await prisma.savedCollege.create({
      data: { userId, collegeId },
    });

    return NextResponse.json(saved);
  } catch (err: any) {
    if (err.code === "P2002") {
      return NextResponse.json({ message: "Already saved" }, { status: 200 });
    }
    if (err.code === "P2025") {
      return NextResponse.json({ error: "User or College not found" }, { status: 404 });
    }
    console.error("POST ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { userId, collegeId } = body;

    if (!userId || !collegeId) {
      return NextResponse.json({ error: "Missing userId or collegeId" }, { status: 400 });
    }

    await prisma.savedCollege.deleteMany({
      where: { userId, collegeId },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("DELETE ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
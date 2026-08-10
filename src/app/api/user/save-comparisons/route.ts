import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST: Save a new college comparison
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, name, collegeIds } = body;

    // 1. Input Validation
    if (!userId || !name || !collegeIds || !Array.isArray(collegeIds)) {
      return NextResponse.json(
        { error: "Missing required fields: userId, name, or collegeIds" },
        { status: 400 }
      );
    }

    // 2. Create record in Database
    const saved = await prisma.savedComparison.create({
      data: {
        userId,
        name,
        collegeIds,
      },
    });

    // 3. Return successful response
    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (error) {
    console.error("Error saving comparison:", error);
    return NextResponse.json(
      { error: "Failed to save comparison" },
      { status: 500 }
    );
  }
}

// GET: Retrieve all saved comparisons for a user
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    // 1. Validate userId parameter presence
    if (!userId) {
      return NextResponse.json(
        { error: "Query parameter 'userId' is required" },
        { status: 400 }
      );
    }

    // 2. Fetch comparisons from Database
    const comparisons = await prisma.savedComparison.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }, // Show newest first
    });

    // 3. Return response
    return NextResponse.json({ success: true, data: comparisons }, { status: 200 });
  } catch (error) {
    console.error("Error fetching comparisons:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved comparisons" },
      { status: 500 }
    );
  }
}
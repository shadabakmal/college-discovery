import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { userId, name, collegeIds } = await req.json();
  const saved = await prisma.savedComparison.create({
    data: { userId, name, collegeIds }
  });
  return NextResponse.json(saved);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const comparisons = await prisma.savedComparison.findMany({ where: { userId: userId! } });
  return NextResponse.json({ data: comparisons });
}
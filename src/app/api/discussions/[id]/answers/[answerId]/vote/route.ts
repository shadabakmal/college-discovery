import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; answerId: string }> }
) {
  try {
    const { answerId } = await params;
    const answer = await prisma.answer.update({
      where: { id: answerId },
      data: { votes: { increment: 1 } },
    });
    return NextResponse.json({ data: answer });
  } catch (error) {
    return NextResponse.json({ error: "Failed to vote" }, { status: 500 });
  }
}
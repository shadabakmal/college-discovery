import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const discussion = await prisma.discussion.update({
      where: { id },
      data: { votes: { increment: 1 } },
    });
    return NextResponse.json({ data: discussion });
  } catch (error) {
    return NextResponse.json({ error: "Failed to vote" }, { status: 500 });
  }
}
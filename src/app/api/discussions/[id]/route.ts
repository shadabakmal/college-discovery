import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Automatically increment the view count by 1 whenever this thread is opened
    const discussion = await prisma.discussion.update({
      where: { id: params.id },
      data: { views: { increment: 1 } },
      include: {
        answers: {
          orderBy: { createdAt: "asc" },
        },
      },
    });
    
    return NextResponse.json({ data: discussion });
  } catch (error) {
    console.error("Fetch Thread Error:", error);
    return NextResponse.json({ error: "Discussion thread not found" }, { status: 404 });
  }
}
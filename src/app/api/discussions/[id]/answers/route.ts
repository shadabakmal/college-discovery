import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }  // ✅ add Promise<>
) {
  try {
    const { id } = await params;  // ✅ await it
    const body = await request.json();

    if (!body.body || body.body.trim() === "") {
      return NextResponse.json({ error: "Answer text cannot be blank" }, { status: 400 });
    }

    const answer = await prisma.answer.create({
      data: {
        body: body.body,
        author: body.author || "Anonymous User",
        discussionId: id,  // ✅ use id instead of params.id
      },
    });

    return NextResponse.json({ data: answer });
  } catch (error) {
    console.error("Post Answer Error:", error);
    return NextResponse.json({ error: "Failed to submit answer" }, { status: 500 });
  }
}
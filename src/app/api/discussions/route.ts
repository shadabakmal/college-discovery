import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// FETCH ALL DISCUSSIONS
export async function GET() {
  try {
    const discussions = await prisma.discussion.findMany({
      include: { answers: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ data: discussions });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch discussions" }, { status: 500 });
  }
}

// CREATE A NEW QUESTION
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const discussion = await prisma.discussion.create({
      data: {
        title: body.title,
        body: body.body,
        tags: body.tags || ["General"],
        author: body.author || "Anonymous Student",
      },
      include: { answers: true }
    });
    return NextResponse.json({ data: discussion });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create discussion" }, { status: 500 });
  }
}
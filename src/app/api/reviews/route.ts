import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { collegeId, author, rating, comment } = body;

    if (!collegeId || !author || !rating || !comment) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const newReview = await prisma.review.create({
      data: {
        author,
        rating: parseFloat(rating),
        comment,
        collegeId,
      },
    });

    const allReviews = await prisma.review.findMany({
      where: { collegeId },
    });
    
    const totalRating = allReviews.reduce((sum, rev) => sum + rev.rating, 0);
    const newAverage = parseFloat((totalRating / allReviews.length).toFixed(1));

    await prisma.college.update({
      where: { id: collegeId },
      data: {
        rating: newAverage,
        reviewCount: allReviews.length,
      },
    });

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error("Review Post Error:", error);
    return NextResponse.json({ error: "Failed to post review" }, { status: 500 });
  }
}

// --- NEW DELETE METHOD ---
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get("id");

    if (!reviewId) {
      return NextResponse.json({ error: "Review ID is required" }, { status: 400 });
    }

    // 1. Fetch the review to get the collegeId before deleting it
    const reviewToDelete = await prisma.review.findUnique({
      where: { id: reviewId }
    });

    if (!reviewToDelete) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // 2. Delete the review
    await prisma.review.delete({
      where: { id: reviewId }
    });

    // 3. Recalculate average rating and total count
    const allReviews = await prisma.review.findMany({
      where: { collegeId: reviewToDelete.collegeId },
    });

    const totalRating = allReviews.reduce((sum, rev) => sum + rev.rating, 0);
    // Safety check: if no reviews left, rating is 0
    const newAverage = allReviews.length > 0 ? parseFloat((totalRating / allReviews.length).toFixed(1)) : 0;

    await prisma.college.update({
      where: { id: reviewToDelete.collegeId },
      data: {
        rating: newAverage,
        reviewCount: allReviews.length,
      },
    });

    return NextResponse.json({ message: "Review deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Review Delete Error:", error);
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}
"use client";
import { useState, useEffect } from "react";
import { Star, MessageSquare, Send, Loader2, Info, Trash2 } from "lucide-react"; 
import Link from "next/link";
import { useRouter } from "next/navigation"; // 👈 IMPORT ADDED

type Review = {
  id: string;
  author: string;
  rating: number;
  comment: string;
  createdAt: string | Date;
};

export default function ReviewSection({ collegeId, initialReviews }: { collegeId: string, initialReviews: Review[] }) {
  const router = useRouter(); // 👈 ROUTER INITIALIZED

  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  
  const [author, setAuthor] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [hoveredStar, setHoveredStar] = useState(0);

  // Check for logged-in user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setAuthor(parsedUser.name);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !comment.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeId, author, rating, comment }),
      });

      if (res.ok) {
        const newReview = await res.json();
        setReviews([newReview, ...reviews]);
        setComment("");
        setRating(5);
        if (!user) setAuthor(""); 
        
        // 👈 REFRESH ADDED: Updates the header stats instantly
        router.refresh(); 
      }
    } catch (error) {
      console.error("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- DELETE FUNCTION ---
  const handleDelete = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    setIsDeleting(reviewId);
    try {
      const res = await fetch(`/api/reviews?id=${reviewId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Remove the review instantly from the screen
        setReviews(reviews.filter((r) => r.id !== reviewId));
        
        // 👈 REFRESH ADDED: Updates the header stats instantly
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to delete review");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div id="reviews" className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2 pb-4 border-b border-gray-100">
        <MessageSquare className="w-6 h-6 text-orange-500" />
        Student Reviews
      </h2>

      {/* --- REVIEW FORM --- */}
      <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-4">Write a Review</h3>
        
        {!user && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-100 text-blue-700 text-sm rounded-lg flex items-start gap-2">
            <Info className="w-4 h-4 mt-0.5 shrink-0" />
            <p>You are reviewing as a guest. <Link href="/login" className="font-bold underline hover:text-blue-900">Log in</Link> to save this review to your profile.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Your Name</label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                disabled={!!user}
                placeholder="e.g. Current Student, Alumni"
                className="w-full px-4 py-2.5 bg-white rounded-lg border border-gray-200 text-sm text-gray-900 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 disabled:bg-gray-200 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Rating</label>
              <div className="flex items-center gap-1 h-[42px]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= (hoveredStar || rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Your Experience</label>
            <textarea
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about the academics, campus life, placements..."
              rows={4}
              className="w-full px-4 py-3 bg-white rounded-lg border border-gray-200 text-sm text-gray-900 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 resize-none"
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-orange-500 text-white font-semibold text-sm rounded-xl hover:bg-orange-600 transition-colors flex items-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {isSubmitting ? "Posting..." : "Post Review"}
            </button>
          </div>
        </form>
      </div>

      {/* --- REVIEWS LIST --- */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No reviews yet. Be the first to share your experience!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                    {review.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{review.author}</p>
                    <p suppressHydrationWarning className="text-xs text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                    })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Rating Badge */}
                  <div className="flex items-center gap-1 bg-yellow-50 px-2.5 py-1 rounded-md border border-yellow-100">
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-yellow-700 text-sm">{review.rating}</span>
                  </div>
                  
                  {/* ONLY show delete button if logged in user is the author */}
                  {user && user.name === review.author && (
                    <button
                      onClick={() => handleDelete(review.id)}
                      disabled={isDeleting === review.id}
                      title="Delete your review"
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isDeleting === review.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
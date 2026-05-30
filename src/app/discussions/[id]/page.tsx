"use client";
import { useState, useEffect, ReactNode, use } from "react";
import { ArrowLeft, Loader2, Send, MessageSquare, Calendar, Tag } from "lucide-react";
import Link from "next/link";

interface Answer {
  id: string;
  body: string;
  author: string;
  votes: number;
  createdAt: string;
}

interface Discussion {
  id: string;
  title: string;
  body: string;
  author: string;
  tags: string[];
  votes: number;
  views: number;
  createdAt: string;
  answers: Answer[];
}

export default function DiscussionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Safe unwrap of dynamic route parameters in Next.js App Router
  const resolvedParams = use(params);
  const threadId = resolvedParams.id;

  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [loading, setLoading] = useState(true);
  const [answerText, setAnswerText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch full discussion payload on mount
  useEffect(() => {
    fetch(`/api/discussions/${threadId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setDiscussion(data.data);
        } else {
          setError(data.error || "Could not retrieve discussion thread.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Network error occurred loading thread.");
        setLoading(false);
      });
  }, [threadId]);

  // Handle live submission of responses
  const handlePostAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerText.trim() || !discussion) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/discussions/${threadId}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: answerText.trim() }),
      });

      const data = await res.json();
      if (data.data) {
        // Optimistically update frontend UI array layout directly
        setDiscussion({
          ...discussion,
          answers: [...discussion.answers, data.data],
        });
        setAnswerText("");
      } else {
        alert(data.error || "Failed to post response.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-gray-500">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500 mb-4" />
        <p className="font-medium">Loading conversation thread...</p>
      </div>
    );
  }

  if (error || !discussion) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
        <div className="text-4xl mb-3">⚠️</div>
        <h3 className="text-xl font-bold text-gray-900 mb-1">Thread Unavailable</h3>
        <p className="text-gray-500 mb-4">{error || "The thread does not exist."}</p>
        <Link href="/discussions" className="text-orange-500 font-semibold hover:underline">
          Return to Q&A Board
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 text-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Back Link Button */}
        <Link href="/discussions" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 transition mb-6 font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Q&A Discussions
        </Link>

        {/* PRIMARY QUESTION CARD CONTAINER */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {discussion.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                <Tag className="w-3 h-3" /> {tag}
              </span>
            ))}
            <div className="flex items-center gap-2 ml-auto text-xs text-gray-400">
              <span className="flex items-center gap-1">👀 {discussion.views} views</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(discussion.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-snug">
            {discussion.title}
          </h1>
          <p className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap mb-6">
            {discussion.body}
          </p>

          <div className="border-t border-gray-50 pt-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-sm font-bold">
                {discussion.author.charAt(0).toUpperCase()}
              </div>
              <span>Asked by <span className="text-gray-900 font-semibold">{discussion.author}</span></span>
            </div>
            <div className="text-xs bg-gray-50 text-gray-500 px-3 py-1.5 rounded-lg border border-gray-100 font-semibold">
              Primary Thread ID: {discussion.id}
            </div>
          </div>
        </div>

        {/* ANSWERS / RESPONSES SUBSECTION */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-green-600" />
            Responses ({discussion.answers.length})
          </h2>

          {discussion.answers.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-500 shadow-sm">
              <p className="font-medium mb-1">No responses yet</p>
              <p className="text-sm text-gray-400">Be the first to provide guidance or share your insight below.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {discussion.answers.map((ans) => (
                <div key={ans.id} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm animate-in fade-in-50 duration-200">
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed whitespace-pre-wrap mb-4">
                    {ans.body}
                  </p>
                  <div className="flex items-center justify-between border-t border-gray-50 pt-3 text-xs text-gray-500">
                    <div className="flex items-center gap-2 font-medium">
                      <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-[10px]">
                        {ans.author.charAt(0).toUpperCase()}
                      </span>
                      <span className="text-gray-800 font-semibold">{ans.author}</span>
                    </div>
                    <span>Replied on {new Date(ans.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* TYPE ANSWER SUBMISSION COMPONENT */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-md">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Provide Your Answer</h3>
          <form onSubmit={handlePostAnswer}>
            <textarea
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="Type your detailed advice or feedback here..."
              rows={5}
              className="w-full px-4 py-3 bg-gray-50 text-gray-900 placeholder-gray-400 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:bg-white transition-all resize-none mb-4"
              required
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting || !answerText.trim()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all shadow-md cursor-pointer"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Submit Response
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
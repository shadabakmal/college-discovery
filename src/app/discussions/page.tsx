"use client";
import { useState, useEffect, use } from "react";
import { ArrowLeft, Loader2, Send, MessageSquare, Calendar, Tag, ThumbsUp } from "lucide-react";
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

export default function DiscussionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const threadId = resolvedParams.id;

  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [loading, setLoading] = useState(true);
  const [answerText, setAnswerText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [votingAnswerId, setVotingAnswerId] = useState<string | null>(null);
  const [votingQuestion, setVotingQuestion] = useState(false);

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

  // ✅ Vote on question
  const handleVoteQuestion = async () => {
    if (!discussion || votingQuestion) return;
    setVotingQuestion(true);
    try {
      const res = await fetch(`/api/discussions/${threadId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.data) {
        setDiscussion({ ...discussion, votes: data.data.votes });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setVotingQuestion(false);
    }
  };

  // ✅ Vote on answer
  const handleVoteAnswer = async (answerId: string) => {
    if (votingAnswerId) return;
    setVotingAnswerId(answerId);
    try {
      const res = await fetch(`/api/discussions/${threadId}/answers/${answerId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.data && discussion) {
        setDiscussion({
          ...discussion,
          answers: discussion.answers.map((a) =>
            a.id === answerId ? { ...a, votes: data.data.votes } : a
          ),
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setVotingAnswerId(null);
    }
  };

  const handlePostAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerText.trim() || !discussion) return;
    setSubmitting(true);

    // ✅ Get logged-in user name
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    try {
      const res = await fetch(`/api/discussions/${threadId}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body: answerText.trim(),
          author: user?.name || "Anonymous User", // ✅ real name
        }),
      });

      const data = await res.json();
      if (data.data) {
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

        <Link
          href="/discussions"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 transition mb-6 font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Q&A Discussions
        </Link>

        {/* Question Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {discussion.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold"
              >
                <Tag className="w-3 h-3" /> {tag}
              </span>
            ))}
            <div className="flex items-center gap-2 ml-auto text-xs text-gray-400">
              <span>👀 {discussion.views} views</span>
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

          <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-sm font-bold">
                {discussion.author.charAt(0).toUpperCase()}
              </div>
              <span>
                Asked by{" "}
                <span className="text-gray-900 font-semibold">
                  {discussion.author}
                </span>
              </span>
            </div>

            {/* ✅ Vote Question Button */}
            <button
              onClick={handleVoteQuestion}
              disabled={votingQuestion}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600 transition-colors disabled:opacity-50 text-sm font-medium text-gray-600"
            >
              <ThumbsUp className="w-4 h-4" />
              {discussion.votes} votes
            </button>
          </div>
        </div>

        {/* Answers Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-green-600" />
            Responses ({discussion.answers.length})
          </h2>

          {discussion.answers.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-500 shadow-sm">
              <p className="font-medium mb-1">No responses yet</p>
              <p className="text-sm text-gray-400">
                Be the first to provide guidance below.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {discussion.answers.map((ans) => (
                <div
                  key={ans.id}
                  className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm"
                >
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed whitespace-pre-wrap mb-4">
                    {ans.body}
                  </p>
                  <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                      <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-[10px]">
                        {ans.author.charAt(0).toUpperCase()}
                      </span>
                      <span className="text-gray-800 font-semibold">
                        {ans.author}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span>
                        Replied on{" "}
                        {new Date(ans.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* ✅ Vote Answer Button */}
                    <button
                      onClick={() => handleVoteAnswer(ans.id)}
                      disabled={votingAnswerId === ans.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600 transition-colors disabled:opacity-50 text-xs font-medium text-gray-500"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      {ans.votes} helpful
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Answer Form */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-md">
          <h3 className="text-lg font-bold text-gray-900 mb-3">
            Provide Your Answer
          </h3>
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
                className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all shadow-md"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Submit Response
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
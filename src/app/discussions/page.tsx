"use client";
import { useState, useEffect } from "react";
import { Eye, Plus, Search, Tag, Loader2, ThumbsUp } from "lucide-react";
import Link from "next/link";

export default function DiscussionsPage() {
  const [query, setQuery] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [discussions, setDiscussions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [votingId, setVotingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/discussions")
      .then((res) => res.json())
      .then((data) => {
        if (data.data) setDiscussions(data.data);
        setIsLoading(false);
      });
  }, []);

  const handlePostQuestion = async () => {
    if (!newTitle.trim() || !newBody.trim()) return;
    setIsSubmitting(true);

    // Get logged-in user
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    const res = await fetch("/api/discussions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTitle,
        body: newBody,
        tags: ["General"],
        author: user?.name || "Anonymous Student", // ✅ real user name
      }),
    });

    const data = await res.json();
    if (data.data) {
      setDiscussions([data.data, ...discussions]);
      setNewTitle("");
      setNewBody("");
      setShowNew(false);
    }
    setIsSubmitting(false);
  };

  const handleVote = async (discussionId: string) => {
    if (votingId) return;
    setVotingId(discussionId);

    try {
      const res = await fetch(`/api/discussions/${discussionId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.data) {
        // ✅ Update vote count instantly in UI
        setDiscussions((prev) =>
          prev.map((d) =>
            d.id === discussionId ? { ...d, votes: data.data.votes } : d
          )
        );
      }
    } catch (error) {
      console.error("Vote error:", error);
    } finally {
      setVotingId(null);
    }
  };

  const filtered = discussions.filter(
    (d) =>
      !query ||
      d.title.toLowerCase().includes(query.toLowerCase()) ||
      d.tags.some((t: string) =>
        t.toLowerCase().includes(query.toLowerCase())
      )
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="font-display text-3xl font-bold text-gray-900 mb-1">
                Q&A Discussions
              </h1>
              <p className="text-gray-500">
                Ask questions, share experiences, get answers from students & alumni
              </p>
            </div>
            <button
              onClick={() => setShowNew(!showNew)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-orange-500 rounded-xl hover:bg-orange-600 transition"
            >
              <Plus className="w-4 h-4" /> Ask Question
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search discussions..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm outline-none focus:border-orange-400"
            />
          </div>

          {showNew && (
            <div className="mt-4 p-5 bg-orange-50 rounded-2xl border border-orange-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Ask a new question</h3>
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Your question title..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm outline-none focus:border-orange-400 mb-3 bg-white"
              />
              <textarea
                value={newBody}
                onChange={(e) => setNewBody(e.target.value)}
                placeholder="Describe your question in detail..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm outline-none focus:border-orange-400 mb-3 bg-white resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={handlePostQuestion}
                  disabled={isSubmitting || !newTitle || !newBody}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-orange-500 rounded-xl hover:bg-orange-600 disabled:opacity-50 transition"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Post Question
                </button>
                <button
                  onClick={() => setShowNew(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-20 text-gray-400 flex flex-col items-center">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-orange-500" />
              <p>Loading discussions...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <div className="text-4xl mb-3">💬</div>
              <h3 className="font-display text-xl font-semibold text-gray-900 mb-2">
                No discussions found
              </h3>
              <p className="text-gray-500 mb-4">Be the first to ask about this topic!</p>
              <button
                onClick={() => setShowNew(true)}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-xl"
              >
                Ask a Question
              </button>
            </div>
          ) : (
            filtered.map((discussion) => (
              <div
                key={discussion.id}
                className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {/* ✅ Vote Button */}
                  <div className="flex flex-col items-center gap-1 min-w-[50px]">
                    <button
                      onClick={() => handleVote(discussion.id)}
                      disabled={votingId === discussion.id}
                      className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-orange-50 hover:text-orange-500 transition-colors disabled:opacity-50 group"
                    >
                      <ThumbsUp className="w-4 h-4 text-gray-400 group-hover:text-orange-500" />
                      <div className="text-lg font-bold text-gray-700">
                        {discussion.votes}
                      </div>
                    </button>
                    <div className="text-xs text-gray-400">votes</div>
                  </div>

                  {/* Answers count */}
                  <div
                    className={`flex flex-col items-center gap-1 min-w-[50px] px-2 py-1 rounded-lg ${
                      discussion.answers?.length > 0
                        ? "bg-green-50 border border-green-200"
                        : "bg-gray-50"
                    }`}
                  >
                    <div
                      className={`text-lg font-bold ${
                        discussion.answers?.length > 0
                          ? "text-green-700"
                          : "text-gray-500"
                      }`}
                    >
                      {discussion.answers?.length || 0}
                    </div>
                    <div className="text-xs text-gray-400">answers</div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <Link href={`/discussions/${discussion.id}`}>
                      <h3 className="font-semibold text-gray-900 mb-2 hover:text-orange-600 transition-colors leading-snug">
                        {discussion.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                      {discussion.body}
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex flex-wrap gap-1.5">
                        {discussion.tags.map((tag: string) => (
                          <span
                            key={tag}
                            className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs"
                          >
                            <Tag className="w-2.5 h-2.5" /> {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 ml-auto text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" /> {discussion.views}
                        </span>
                        <span>👤 {discussion.author}</span>
                        <span>
                          {new Date(discussion.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
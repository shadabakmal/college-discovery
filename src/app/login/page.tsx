"use client";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Eye, EyeOff, Mail, Lock, User, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showPw, setShowPw] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setIsLoading(true);
    setError("");

    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
      const payload = mode === "login" ? { email, password } : { name, email, password };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload), 
      });

      const data = await response.json();

      if (response.ok) {
        if (mode === "signup") {
          alert("Account created successfully! Please log in.");
          setMode("login"); 
          setPassword(""); 
        } else {
          // ✅ Validate id exists
          if (!data.user?.id) {
            setError("Login failed: user ID missing. Please try again.");
            return;
          }
          // ✅ Explicitly save id, name, email
          localStorage.setItem("user", JSON.stringify({
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
          }));
          window.location.href = "/"; 
        }
      } else {
        setError(data.message || "An error occurred. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to the server. Please check your database connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Validate id exists
        if (!data.user?.id) {
          setError("Login failed: user ID missing. Please try again.");
          return;
        }
        // ✅ Explicitly save id, name, email
        localStorage.setItem("user", JSON.stringify({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
        }));
        window.location.href = "/";
      } else {
        setError(data.message || "Google login failed");
      }
    } catch (err) {
      setError("Failed to connect to server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
    <div className="min-h-[calc(100vh-80px)] flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-center p-16 w-1/2" style={{ background: "linear-gradient(135deg, #0A1628, #1A2B4A)" }}>
        <div className="flex items-center gap-2 mb-10">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-orange-500">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <span className="font-display text-2xl font-bold text-white">
            College<span className="text-orange-400">Radar</span>
          </span>
        </div>
        <h2 className="font-display text-4xl font-bold text-white mb-4 leading-tight">
          Your college journey<br />starts here.
        </h2>
        <p className="text-gray-400 text-lg mb-8">
          Join 2 million+ students using CollegeRadar to find, compare, and apply to top colleges in India.
        </p>
        <div className="space-y-3">
          {["Save colleges to your wishlist", "Get personalized recommendations", "Track application deadlines", "Connect with students & alumni"].map((f) => (
            <div key={f} className="flex items-center gap-3 text-gray-300">
              <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-orange-400 text-xs">✓</span>
              </div>
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
              {(["login", "signup"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError(""); }}
                  className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                    mode === m ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {m === "login" ? "Log In" : "Sign Up"}
                </button>
              ))}
            </div>

            <h1 className="font-display text-2xl font-bold text-gray-900 mb-1">
              {mode === "login" ? "Welcome back!" : "Create your account"}
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              {mode === "login" ? "Log in to access your saved colleges" : "Start your college discovery journey"}
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              {mode === "signup" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  {mode === "login" && (
                    <Link href="#" className="text-xs text-orange-500 hover:underline">Forgot password?</Link>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPw ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 bg-white rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 flex items-center justify-center text-sm font-semibold text-white rounded-xl bg-orange-500 hover:bg-orange-600 transition disabled:opacity-70 mt-2"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (mode === "login" ? "Log In" : "Create Account")}
              </button>
            </form>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
              <div className="relative text-center"><span className="bg-white px-3 text-xs text-gray-400">or continue with</span></div>
            </div>

            <div className="flex justify-center w-full">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google Login Failed")}
                useOneTap={false}
                shape="rectangular"
                size="large"
                theme="outline"
                text="continue_with"
                width="350" 
              />
            </div>

            <p className="text-center text-xs text-gray-500 mt-5">
              {mode === "login" ? (
                <>Don't have an account? <button onClick={() => setMode("signup")} className="text-orange-500 font-medium hover:underline">Sign up free</button></>
              ) : (
                <>Already have an account? <button onClick={() => setMode("login")} className="text-orange-500 font-medium hover:underline">Log in</button></>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
    </GoogleOAuthProvider>
  );
}
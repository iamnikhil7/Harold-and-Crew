"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type AuthMode = "landing" | "login" | "signup";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("landing");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    async function checkSession() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("users")
          .select("onboarding_completed")
          .eq("id", user.id)
          .single();
        if (data?.onboarding_completed) {
          router.push("/dashboard");
        } else {
          router.push("/onboarding");
        }
        return;
      }
      setCheckingSession(false);
    }
    checkSession();
  }, [router]);

  const handleGetStarted = async () => {
    setLoading(true);
    setError("");
    const { data, error: authError } = await supabase.auth.signInAnonymously();
    if (authError) { setError(authError.message); setLoading(false); return; }
    if (data.user) {
      await supabase.from("users").upsert({
        id: data.user.id, anonymous_id: data.user.id,
        sensitivity_mode: false, onboarding_completed: false, account_linked: false,
      });
    }
    router.push("/onboarding");
  };

  const handleSignUp = async () => {
    if (!email || !password) { setError("Please fill in all fields."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true); setError("");
    const { data, error: authError } = await supabase.auth.signUp({ email, password });
    if (authError) { setError(authError.message); setLoading(false); return; }
    if (data.user) {
      await supabase.from("users").upsert({
        id: data.user.id, email, sensitivity_mode: false,
        onboarding_completed: false, account_linked: true,
      });
    }
    router.push("/onboarding");
  };

  const handleLogin = async () => {
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true); setError("");
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) { setError(authError.message); setLoading(false); return; }
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from("users").select("onboarding_completed").eq("id", user.id).single();
      if (data?.onboarding_completed) { router.push("/dashboard"); } else { router.push("/onboarding"); }
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="w-12 h-12 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-accent/8 rounded-full blur-3xl animate-breathe" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/15 mb-5">
            <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">PAUSE</h1>
          <p className="text-muted text-lg">Your behavioral intelligence layer</p>
        </div>

        {/* LANDING — clean, one CTA */}
        {mode === "landing" && (
          <div>
            <button
              onClick={handleGetStarted}
              disabled={loading}
              className="w-full py-4 rounded-full bg-accent text-white font-semibold text-lg hover:bg-accent-soft transition-all disabled:opacity-50"
            >
              {loading ? "Starting..." : "Get Started"}
            </button>
            <p className="text-center text-sm text-muted/50 mt-3">
              No account needed
            </p>
            <p className="text-center text-sm text-muted mt-8">
              Already have an account?{" "}
              <button onClick={() => setMode("login")} className="text-accent hover:text-accent-soft transition-colors">
                Log in
              </button>
            </p>
          </div>
        )}

        {/* LOGIN */}
        {mode === "login" && (
          <div>
            <div className="p-6 rounded-2xl bg-surface border border-white/5">
              <h2 className="text-xl font-semibold mb-5">Welcome back</h2>
              <div className="space-y-4">
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full bg-surface-light border border-white/10 rounded-xl px-4 py-3 text-foreground placeholder:text-muted/40 focus:outline-none focus:border-accent/50 transition-colors"
                />
                <input
                  type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  className="w-full bg-surface-light border border-white/10 rounded-xl px-4 py-3 text-foreground placeholder:text-muted/40 focus:outline-none focus:border-accent/50 transition-colors"
                />
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <button onClick={handleLogin} disabled={loading} className="w-full py-3 rounded-full bg-accent text-white font-semibold hover:bg-accent-soft transition-all disabled:opacity-50">
                  {loading ? "Logging in..." : "Log In"}
                </button>
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-5 text-sm">
              <button onClick={() => { setMode("landing"); setError(""); }} className="text-muted hover:text-foreground transition-colors">Back</button>
              <span className="text-white/10">|</span>
              <button onClick={() => { setMode("signup"); setError(""); }} className="text-accent hover:text-accent-soft transition-colors">Create account</button>
            </div>
          </div>
        )}

        {/* SIGNUP */}
        {mode === "signup" && (
          <div>
            <div className="p-6 rounded-2xl bg-surface border border-white/5">
              <h2 className="text-xl font-semibold mb-5">Create your account</h2>
              <div className="space-y-4">
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full bg-surface-light border border-white/10 rounded-xl px-4 py-3 text-foreground placeholder:text-muted/40 focus:outline-none focus:border-accent/50 transition-colors"
                />
                <input
                  type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password (min 6 characters)"
                  onKeyDown={(e) => e.key === "Enter" && handleSignUp()}
                  className="w-full bg-surface-light border border-white/10 rounded-xl px-4 py-3 text-foreground placeholder:text-muted/40 focus:outline-none focus:border-accent/50 transition-colors"
                />
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <button onClick={handleSignUp} disabled={loading} className="w-full py-3 rounded-full bg-accent text-white font-semibold hover:bg-accent-soft transition-all disabled:opacity-50">
                  {loading ? "Creating..." : "Create Account"}
                </button>
              </div>
              <button onClick={handleGetStarted} disabled={loading} className="w-full mt-4 py-2 text-sm text-muted hover:text-foreground transition-colors">
                or start without an account
              </button>
            </div>
            <div className="flex justify-center gap-4 mt-5 text-sm">
              <button onClick={() => { setMode("landing"); setError(""); }} className="text-muted hover:text-foreground transition-colors">Back</button>
              <span className="text-white/10">|</span>
              <button onClick={() => { setMode("login"); setError(""); }} className="text-accent hover:text-accent-soft transition-colors">Log in instead</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

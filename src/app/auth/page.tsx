"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type AuthMode = "landing" | "login" | "signup";

const thoughts = [
  "The space between stimulus and response is where your freedom lives.",
  "You don't lack willpower. You lack awareness of the exact moment you need it.",
  "90% of your daily actions are habitual. The other 10% shape who you become.",
  "It takes 66 days to form a new habit — but one moment of awareness to break an old one.",
  "Your brain rewires itself every day. The question is who's directing the rewiring.",
];

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("landing");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [thoughtIndex, setThoughtIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    async function checkSession() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("users").select("onboarding_completed").eq("id", user.id).single();
        if (data?.onboarding_completed) { router.push("/dashboard"); }
        else { router.push("/onboarding"); }
        return;
      }
      setCheckingSession(false);
    }
    checkSession();
  }, [router]);

  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setThoughtIndex((prev) => (prev + 1) % thoughts.length);
        setFading(false);
      }, 500);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleGetStarted = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error: authError } = await supabase.auth.signInAnonymously();
      if (authError) {
        setError("Could not start session. Try creating an account instead.");
        setLoading(false);
        return;
      }
      if (data.user) {
        await supabase.from("users").upsert({
          id: data.user.id, anonymous_id: data.user.id,
          sensitivity_mode: false, onboarding_completed: false, account_linked: false,
        });
        router.push("/onboarding");
      }
    } catch {
      setError("Connection issue. Please try again.");
      setLoading(false);
    }
  }, [router]);

  const handleSignUp = async () => {
    if (!email || !password) { setError("Please fill in both fields."); return; }
    if (password.length < 6) { setError("Password needs at least 6 characters."); return; }
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
    if (!email || !password) { setError("Please fill in both fields."); return; }
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
      <div className="w-full max-w-xs flex flex-col items-center">
        {/* Logo */}
        <p className="text-sm tracking-widest uppercase text-muted mb-10">Pause</p>

        {/* Rotating thought */}
        <div className="h-14 flex items-center justify-center mb-10">
          <p className={`text-center font-serif text-sm text-muted/70 leading-relaxed max-w-[260px] transition-opacity duration-500 ${fading ? "opacity-0" : "opacity-100"}`}>
            {thoughts[thoughtIndex]}
          </p>
        </div>

        {/* LANDING */}
        {mode === "landing" && (
          <div className="w-full text-center">
            {error && <p className="text-red-400/80 text-sm mb-4">{error}</p>}
            <button
              onClick={handleGetStarted}
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-accent text-background font-medium hover:bg-accent-soft active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3.5 h-3.5 border border-background/30 border-t-background rounded-full animate-spin" />
                  One moment
                </span>
              ) : "Get started"}
            </button>
            <p className="text-xs text-muted/30 mt-3">No account needed</p>
            <p className="text-sm text-muted mt-10">
              Have an account?{" "}
              <button onClick={() => setMode("login")} className="text-accent hover:text-accent-soft transition-colors">
                Sign in
              </button>
            </p>
          </div>
        )}

        {/* LOGIN */}
        {mode === "login" && (
          <div className="w-full">
            <div className="space-y-3 mb-4">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full bg-surface border border-white/8 rounded-lg px-4 py-3 text-foreground text-sm placeholder:text-muted/30 focus:outline-none focus:border-accent/30 transition-colors" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" onKeyDown={(e) => e.key === "Enter" && handleLogin()} className="w-full bg-surface border border-white/8 rounded-lg px-4 py-3 text-foreground text-sm placeholder:text-muted/30 focus:outline-none focus:border-accent/30 transition-colors" />
            </div>
            {error && <p className="text-red-400/80 text-sm mb-3">{error}</p>}
            <button onClick={handleLogin} disabled={loading} className="w-full py-3 rounded-full bg-accent text-background font-medium hover:bg-accent-soft transition-all disabled:opacity-50 mb-4">
              {loading ? "Signing in..." : "Sign in"}
            </button>
            <div className="flex justify-center gap-3 text-sm">
              <button onClick={() => { setMode("landing"); setError(""); }} className="text-muted hover:text-foreground transition-colors">Back</button>
              <span className="text-white/5">|</span>
              <button onClick={() => { setMode("signup"); setError(""); }} className="text-accent hover:text-accent-soft transition-colors">Create account</button>
            </div>
          </div>
        )}

        {/* SIGNUP */}
        {mode === "signup" && (
          <div className="w-full">
            <div className="space-y-3 mb-4">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full bg-surface border border-white/8 rounded-lg px-4 py-3 text-foreground text-sm placeholder:text-muted/30 focus:outline-none focus:border-accent/30 transition-colors" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" onKeyDown={(e) => e.key === "Enter" && handleSignUp()} className="w-full bg-surface border border-white/8 rounded-lg px-4 py-3 text-foreground text-sm placeholder:text-muted/30 focus:outline-none focus:border-accent/30 transition-colors" />
            </div>
            {error && <p className="text-red-400/80 text-sm mb-3">{error}</p>}
            <button onClick={handleSignUp} disabled={loading} className="w-full py-3 rounded-full bg-accent text-background font-medium hover:bg-accent-soft transition-all disabled:opacity-50 mb-2">
              {loading ? "Creating..." : "Create account"}
            </button>
            <button onClick={handleGetStarted} disabled={loading} className="w-full py-2 text-xs text-muted/40 hover:text-muted transition-colors mb-4">
              or skip — start without an account
            </button>
            <div className="flex justify-center gap-3 text-sm">
              <button onClick={() => { setMode("landing"); setError(""); }} className="text-muted hover:text-foreground transition-colors">Back</button>
              <span className="text-white/5">|</span>
              <button onClick={() => { setMode("login"); setError(""); }} className="text-accent hover:text-accent-soft transition-colors">Sign in instead</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

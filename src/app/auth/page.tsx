"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Mode = "start" | "login" | "signup";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("start");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function check() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data } = await supabase.from("users").select("onboarding_completed").eq("id", session.user.id).single();
        router.push(data?.onboarding_completed ? "/dashboard" : "/onboarding");
        return;
      }
      setChecking(false);
    }
    check();
  }, [router]);

  const handleAnonymous = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const { data, error: err } = await supabase.auth.signInAnonymously();
      if (err) {
        console.error("Anon auth error:", err);
        setError("Could not start session. Try creating an account instead.");
        setLoading(false);
        return;
      }
      if (data?.user) {
        const { error: upsertErr } = await supabase.from("users").upsert({
          id: data.user.id, anonymous_id: data.user.id,
          sensitivity_mode: false, onboarding_completed: false, account_linked: false,
        });
        if (upsertErr) console.error("User upsert error:", upsertErr);
        router.push("/onboarding");
      }
    } catch (e) {
      console.error("Auth catch:", e);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }, [router]);

  const handleSignUp = async () => {
    if (!email || !password) { setError("Please enter your email and password."); return; }
    if (password.length < 6) { setError("Password needs at least 6 characters."); return; }
    setLoading(true); setError("");
    const { data, error: err } = await supabase.auth.signUp({ email, password });
    if (err) { setError(err.message); setLoading(false); return; }
    if (data?.user) {
      await supabase.from("users").upsert({
        id: data.user.id, email, sensitivity_mode: false,
        onboarding_completed: false, account_linked: true,
      });
      router.push("/onboarding");
    }
  };

  const handleLogin = async () => {
    if (!email || !password) { setError("Please enter your email and password."); return; }
    setLoading(true); setError("");
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) { setError(err.message); setLoading(false); return; }
    if (data?.user) {
      const { data: userData } = await supabase.from("users").select("onboarding_completed").eq("id", data.user.id).single();
      router.push(userData?.onboarding_completed ? "/dashboard" : "/onboarding");
    }
  };

  if (checking) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
    </div>
  );

  const PasswordInput = () => (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={mode === "signup" ? "Min 6 characters" : "Your password"}
        onKeyDown={(e) => e.key === "Enter" && (mode === "login" ? handleLogin() : handleSignUp())}
        className="w-full bg-surface border border-white/10 rounded-lg px-3.5 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-accent/30 transition-colors"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
      >
        {showPassword ? (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-accent/15 flex items-center justify-center">
              <svg className="w-3 h-3 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
              </svg>
            </div>
            <span className="font-semibold text-sm">PAUSE</span>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">

          {mode === "start" && (
            <div className="animate-in">
              <h1 className="text-2xl font-bold mb-2">Welcome to PAUSE</h1>
              <p className="text-sm text-muted mb-8">Discover your behavioral patterns and build the awareness to change them.</p>

              {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">{error}</div>}

              <button onClick={handleAnonymous} disabled={loading} className="w-full py-3 rounded-lg bg-accent text-background text-sm font-medium hover:bg-accent-soft active:scale-[0.99] transition-all disabled:opacity-50 mb-3">
                {loading ? "Starting..." : "Start now — no account needed"}
              </button>

              <button onClick={() => { setMode("signup"); setError(""); }} className="w-full py-3 rounded-lg border border-white/10 text-sm font-medium text-foreground hover:bg-surface transition-colors mb-6">
                Create an account
              </button>

              <p className="text-center text-sm text-muted">
                Already a member?{" "}
                <button onClick={() => { setMode("login"); setError(""); }} className="text-accent hover:text-accent-soft font-medium transition-colors">Sign in</button>
              </p>
            </div>
          )}

          {mode === "login" && (
            <div className="animate-in">
              <h1 className="text-2xl font-bold mb-2">Sign in</h1>
              <p className="text-sm text-muted mb-6">Welcome back.</p>

              <div className="space-y-3 mb-4">
                <div>
                  <label className="text-xs text-muted mb-1.5 block">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full bg-surface border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-accent/30 transition-colors" />
                </div>
                <div>
                  <label className="text-xs text-muted mb-1.5 block">Password</label>
                  <PasswordInput />
                </div>
              </div>

              {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">{error}</div>}

              <button onClick={handleLogin} disabled={loading} className="w-full py-3 rounded-lg bg-accent text-background text-sm font-medium hover:bg-accent-soft transition-all disabled:opacity-50 mb-5">
                {loading ? "Signing in..." : "Sign in"}
              </button>

              <p className="text-center text-sm text-muted">
                <button onClick={() => { setMode("start"); setError(""); setEmail(""); setPassword(""); }} className="hover:text-foreground transition-colors">Back</button>
                {" \u00B7 "}
                <button onClick={() => { setMode("signup"); setError(""); }} className="text-accent hover:text-accent-soft transition-colors">Create account</button>
              </p>
            </div>
          )}

          {mode === "signup" && (
            <div className="animate-in">
              <h1 className="text-2xl font-bold mb-2">Create account</h1>
              <p className="text-sm text-muted mb-6">Save your progress across devices.</p>

              <div className="space-y-3 mb-4">
                <div>
                  <label className="text-xs text-muted mb-1.5 block">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full bg-surface border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-accent/30 transition-colors" />
                </div>
                <div>
                  <label className="text-xs text-muted mb-1.5 block">Password</label>
                  <PasswordInput />
                </div>
              </div>

              {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">{error}</div>}

              <button onClick={handleSignUp} disabled={loading} className="w-full py-3 rounded-lg bg-accent text-background text-sm font-medium hover:bg-accent-soft transition-all disabled:opacity-50 mb-5">
                {loading ? "Creating account..." : "Create account"}
              </button>

              <p className="text-center text-sm text-muted">
                <button onClick={() => { setMode("start"); setError(""); setEmail(""); setPassword(""); }} className="hover:text-foreground transition-colors">Back</button>
                {" \u00B7 "}
                <button onClick={() => { setMode("login"); setError(""); }} className="text-accent hover:text-accent-soft transition-colors">Sign in instead</button>
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

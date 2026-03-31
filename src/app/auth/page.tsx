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

  // Check if user is already logged in
  useEffect(() => {
    async function checkSession() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Check if onboarding is complete
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

  // Anonymous sign-in — zero-barrier entry
  const handleGetStarted = async () => {
    setLoading(true);
    setError("");
    const { data, error: authError } = await supabase.auth.signInAnonymously();
    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }
    if (data.user) {
      await supabase.from("users").upsert({
        id: data.user.id,
        anonymous_id: data.user.id,
        sensitivity_mode: false,
        onboarding_completed: false,
        account_linked: false,
      });
    }
    router.push("/onboarding");
  };

  // Email/password sign up
  const handleSignUp = async () => {
    if (!email || !password) { setError("Please fill in all fields."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    setError("");

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await supabase.from("users").upsert({
        id: data.user.id,
        email: email,
        sensitivity_mode: false,
        onboarding_completed: false,
        account_linked: true,
      });
    }
    router.push("/onboarding");
  };

  // Email/password login
  const handleLogin = async () => {
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    setError("");

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Check onboarding status
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
    }
  };

  // OAuth sign-in
  const handleOAuth = async (provider: "google" | "github") => {
    setLoading(true);
    setError("");
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (authError) {
      setError(authError.message);
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="w-12 h-12 border-2 border-accent/30 border-t-accent rounded-full animate-spin mb-4" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-breathe" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/8 rounded-full blur-3xl animate-breathe" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/20 mb-4">
            <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">PAUSE</h1>
          <p className="text-muted mt-1">Your behavioral intelligence layer</p>
        </div>

        {/* Landing — default view */}
        {mode === "landing" && (
          <div className="space-y-4">
            <button
              onClick={handleGetStarted}
              disabled={loading}
              className="w-full py-4 rounded-full bg-accent text-white font-semibold text-lg animate-pulse-glow hover:bg-accent-soft transition-all disabled:opacity-50"
            >
              {loading ? "Starting..." : "Get Started"}
            </button>
            <p className="text-center text-sm text-muted/60">
              No email required. Start the questionnaire instantly.
            </p>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background px-4 text-muted">or</span>
              </div>
            </div>

            <button
              onClick={() => setMode("login")}
              className="w-full py-3 rounded-full border border-white/10 text-foreground font-medium hover:bg-surface-light transition-colors"
            >
              Log In
            </button>
            <button
              onClick={() => setMode("signup")}
              className="w-full py-3 rounded-full border border-white/10 text-muted font-medium hover:bg-surface-light hover:text-foreground transition-colors"
            >
              Create Account
            </button>
          </div>
        )}

        {/* Login form */}
        {mode === "login" && (
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-surface border border-white/5">
              <h2 className="text-xl font-semibold mb-6">Welcome back</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted mb-1 block">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-surface-light border border-white/10 rounded-xl px-4 py-3 text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted mb-1 block">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password"
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    className="w-full bg-surface-light border border-white/10 rounded-xl px-4 py-3 text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-colors"
                  />
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <button
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full py-3 rounded-full bg-accent text-white font-semibold hover:bg-accent-soft transition-all disabled:opacity-50"
                >
                  {loading ? "Logging in..." : "Log In"}
                </button>
              </div>

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-surface px-4 text-muted">or</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => handleOAuth("google")}
                  className="w-full py-3 rounded-xl border border-white/10 text-sm font-medium hover:bg-surface-light transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Continue with Google
                </button>
                <button
                  onClick={() => handleOAuth("github")}
                  className="w-full py-3 rounded-xl border border-white/10 text-sm font-medium hover:bg-surface-light transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                  Continue with GitHub
                </button>
              </div>
            </div>

            <div className="text-center">
              <button onClick={() => { setMode("landing"); setError(""); }} className="text-sm text-muted hover:text-foreground transition-colors">
                Back
              </button>
              <span className="text-muted mx-2">|</span>
              <button onClick={() => { setMode("signup"); setError(""); }} className="text-sm text-accent hover:text-accent-soft transition-colors">
                Create account
              </button>
            </div>
          </div>
        )}

        {/* Signup form */}
        {mode === "signup" && (
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-surface border border-white/5">
              <h2 className="text-xl font-semibold mb-6">Create your account</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted mb-1 block">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-surface-light border border-white/10 rounded-xl px-4 py-3 text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted mb-1 block">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    onKeyDown={(e) => e.key === "Enter" && handleSignUp()}
                    className="w-full bg-surface-light border border-white/10 rounded-xl px-4 py-3 text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-colors"
                  />
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <button
                  onClick={handleSignUp}
                  disabled={loading}
                  className="w-full py-3 rounded-full bg-accent text-white font-semibold hover:bg-accent-soft transition-all disabled:opacity-50"
                >
                  {loading ? "Creating account..." : "Create Account"}
                </button>
              </div>

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-surface px-4 text-muted">or</span>
                </div>
              </div>

              <button
                onClick={handleGetStarted}
                disabled={loading}
                className="w-full py-3 rounded-xl border border-white/10 text-sm font-medium hover:bg-surface-light transition-colors"
              >
                Skip — start without an account
              </button>
            </div>

            <div className="text-center">
              <button onClick={() => { setMode("landing"); setError(""); }} className="text-sm text-muted hover:text-foreground transition-colors">
                Back
              </button>
              <span className="text-muted mx-2">|</span>
              <button onClick={() => { setMode("login"); setError(""); }} className="text-sm text-accent hover:text-accent-soft transition-colors">
                Already have an account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

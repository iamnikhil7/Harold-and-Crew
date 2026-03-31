"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { questions } from "@/lib/questions";
import { calculateArchetypeScores, generateGoalSuggestions } from "@/lib/scoring";
import { supabase } from "@/lib/supabase";
import QuestionCard from "@/components/QuestionCard";

type Step = "sensitivity" | "questionnaire" | "goals" | "why" | "link_account";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("sensitivity");
  const [sensitivityMode, setSensitivityMode] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<number, string | string[] | number>>({});
  const [userId, setUserId] = useState<string | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [suggestedGoals, setSuggestedGoals] = useState<string[]>([]);
  const [activeGoals, setActiveGoals] = useState<boolean[]>([]);
  const [personalWhy, setPersonalWhy] = useState("");
  const [loading, setLoading] = useState(true);
  const [linkEmail, setLinkEmail] = useState("");
  const [linkPassword, setLinkPassword] = useState("");
  const [linkError, setLinkError] = useState("");
  const [linkLoading, setLinkLoading] = useState(false);

  // Check existing session — user should already be authenticated from /auth
  useEffect(() => {
    async function checkSession() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
        return;
      }
      setUserId(user.id);
      setIsAnonymous(user.is_anonymous ?? false);

      // Check if user already completed onboarding
      const { data } = await supabase
        .from("users")
        .select("onboarding_completed, sensitivity_mode")
        .eq("id", user.id)
        .single();

      if (data?.onboarding_completed) {
        router.push("/dashboard");
        return;
      }

      // Check for existing progress
      const { data: existingResponses } = await supabase
        .from("onboarding_responses")
        .select("question_id, response_type, response_text, response_choice")
        .eq("user_id", user.id);

      if (existingResponses && existingResponses.length > 0) {
        // Restore progress
        const restored: Record<number, string | string[] | number> = {};
        for (const r of existingResponses) {
          if (r.response_type === "open_text") {
            restored[r.question_id] = r.response_text || "";
          } else if (r.response_choice) {
            try { restored[r.question_id] = JSON.parse(r.response_choice); } catch { /* skip */ }
          }
        }
        setResponses(restored);
        if (data?.sensitivity_mode) setSensitivityMode(data.sensitivity_mode);
        // Jump to where they left off
        const answeredIds = existingResponses.map((r) => r.question_id);
        const lastAnswered = Math.max(...answeredIds);
        const nextIndex = questions.findIndex((q) => q.id === lastAnswered);
        if (nextIndex >= 0 && nextIndex < questions.length - 1) {
          setCurrentQuestion(nextIndex + 1);
          setStep("questionnaire");
        } else if (nextIndex === questions.length - 1) {
          setStep("questionnaire");
          setCurrentQuestion(nextIndex);
        }
      }
      setLoading(false);
    }
    checkSession();
  }, [router]);

  const handleSensitivityChoice = async (sensitive: boolean) => {
    setSensitivityMode(sensitive);
    if (userId) {
      await supabase.from("users").update({ sensitivity_mode: sensitive }).eq("id", userId);
      await supabase.from("user_settings").upsert({ user_id: userId, sensitivity_mode: sensitive });
    }
    setStep("questionnaire");
  };

  const handleResponse = (value: string | string[] | number) => {
    setResponses((prev) => ({ ...prev, [questions[currentQuestion].id]: value }));
  };

  const handleNext = async () => {
    const q = questions[currentQuestion];
    const val = responses[q.id];
    if (userId && val !== undefined) {
      await supabase.from("onboarding_responses").upsert(
        {
          user_id: userId,
          question_id: q.id,
          question_part: q.part,
          response_type: q.type,
          response_text: q.type === "open_text" ? (val as string) : null,
          response_choice: q.type !== "open_text" ? JSON.stringify(val) : null,
        },
        { onConflict: "user_id,question_id" }
      );
    }
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((p) => p + 1);
      return;
    }

    // All questions answered — calculate archetype
    setLoading(true);
    const formatted = Object.entries(responses).map(([qid, value]) => {
      const q = questions.find((q) => q.id === Number(qid))!;
      return {
        questionId: Number(qid),
        responseType: q.type,
        responseText: q.type === "open_text" ? (value as string) : undefined,
        responseChoice: q.type !== "open_text" ? value : undefined,
      };
    });

    const result = calculateArchetypeScores(formatted);
    if (userId) {
      await supabase.from("user_archetypes").upsert({
        user_id: userId,
        archetype_id: result.primaryArchetypeId,
        primary_score: result.primaryScore,
        secondary_archetype_id: result.secondaryArchetypeId,
        secondary_score: result.secondaryScore,
      });
    }

    const goals = generateGoalSuggestions(result.primaryArchetypeId, formatted);
    setSuggestedGoals(goals);
    setActiveGoals(goals.map(() => true));
    setLoading(false);
    setStep("goals");
  };

  const handleGoalsComplete = async () => {
    if (userId) {
      const recs = suggestedGoals
        .filter((_, i) => activeGoals[i])
        .map((text) => ({ user_id: userId, goal_text: text, is_system_generated: true, is_active: true }));
      if (recs.length > 0) await supabase.from("user_goals").insert(recs);
    }
    setStep("why");
  };

  const handleWhyComplete = async () => {
    if (userId && personalWhy.trim().length >= 15) {
      await supabase
        .from("users")
        .update({ personal_why: personalWhy.trim(), onboarding_completed: true })
        .eq("id", userId);
    }
    // If anonymous, prompt to link account; otherwise go to archetype
    if (isAnonymous) {
      setStep("link_account");
    } else {
      router.push("/archetype");
    }
  };

  const handleLinkAccount = async () => {
    if (!linkEmail || !linkPassword) { setLinkError("Please fill in all fields."); return; }
    if (linkPassword.length < 6) { setLinkError("Password must be at least 6 characters."); return; }
    setLinkLoading(true);
    setLinkError("");

    const { error } = await supabase.auth.updateUser({
      email: linkEmail,
      password: linkPassword,
    });

    if (error) {
      setLinkError(error.message);
      setLinkLoading(false);
      return;
    }

    // Update user record
    await supabase
      .from("users")
      .update({ email: linkEmail, account_linked: true })
      .eq("id", userId!);

    router.push("/archetype");
  };

  const handleSkipLinking = () => {
    router.push("/archetype");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="w-12 h-12 border-2 border-accent/30 border-t-accent rounded-full animate-spin mb-4" />
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  // ===== SENSITIVITY CHECK =====
  if (step === "sensitivity") return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background">
      <div className="max-w-lg w-full">
        <div className="p-8 rounded-2xl bg-surface border border-white/5">
          <h2 className="text-xl font-semibold mb-6 leading-relaxed">Before we get started — a quick check.</h2>
          <p className="text-muted leading-relaxed mb-8">
            Some of what we explore together touches on food, body image, and health habits. If any of these areas feel sensitive or overwhelming for you right now, that&apos;s completely okay. This app is designed to support you, not add pressure.
          </p>
          <p className="text-foreground font-medium mb-6">Do any of these areas feel difficult for you right now?</p>
          <div className="space-y-3">
            <button onClick={() => handleSensitivityChoice(false)} className="w-full text-left px-5 py-4 rounded-xl border border-white/10 bg-surface-light hover:border-accent/30 transition-colors">
              {"\u25CB"} No, I&apos;m good to continue
            </button>
            <button onClick={() => handleSensitivityChoice(true)} className="w-full text-left px-5 py-4 rounded-xl border border-white/10 bg-surface-light hover:border-accent/30 transition-colors">
              {"\u25CB"} Yes, some of these feel sensitive
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ===== QUESTIONNAIRE =====
  if (step === "questionnaire") return (
    <div className="min-h-screen flex items-center justify-center py-16 bg-background">
      <QuestionCard
        question={questions[currentQuestion]}
        sensitivityMode={sensitivityMode}
        value={responses[questions[currentQuestion].id] ?? null}
        onChange={handleResponse}
        onNext={handleNext}
        onBack={() => setCurrentQuestion((p) => p - 1)}
        isFirst={currentQuestion === 0}
        isLast={currentQuestion === questions.length - 1}
        currentIndex={currentQuestion}
        totalQuestions={questions.length}
      />
    </div>
  );

  // ===== GOALS =====
  if (step === "goals") return (
    <div className="min-h-screen flex items-center justify-center py-16 px-6 bg-background">
      <div className="max-w-2xl w-full">
        <h2 className="text-3xl font-bold mb-3">Your Goals</h2>
        <p className="text-muted mb-8">Based on your responses, here are personalized goals. Toggle off any that don&apos;t resonate.</p>
        <div className="space-y-3 mb-10">
          {suggestedGoals.map((goal, i) => (
            <div key={i} className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${activeGoals[i] ? "bg-accent/5 border-accent/20" : "bg-surface border-white/5 opacity-50"}`}>
              <button onClick={() => setActiveGoals((p) => { const n = [...p]; n[i] = !n[i]; return n; })} className={`mt-0.5 w-6 h-6 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-colors ${activeGoals[i] ? "bg-accent border-accent text-white" : "border-white/20 text-transparent"}`}>
                {activeGoals[i] ? "\u2713" : ""}
              </button>
              <p className={activeGoals[i] ? "text-foreground" : "text-muted"}>{goal}</p>
            </div>
          ))}
        </div>
        <button onClick={handleGoalsComplete} disabled={!activeGoals.some(Boolean)} className={`w-full py-4 rounded-full font-semibold text-lg transition-all ${activeGoals.some(Boolean) ? "bg-accent text-white hover:bg-accent-soft" : "bg-surface-light text-muted/40 cursor-not-allowed"}`}>
          Continue
        </button>
      </div>
    </div>
  );

  // ===== YOUR WHY =====
  if (step === "why") return (
    <div className="min-h-screen flex items-center justify-center py-16 px-6 bg-background">
      <div className="max-w-2xl w-full">
        <h2 className="text-3xl font-bold mb-3">Now write your why.</h2>
        <p className="text-muted leading-relaxed mb-2">In your own words. When you&apos;re about to override a pause, this is what you&apos;ll see.</p>
        <p className="text-accent text-sm font-medium mb-8">Make it something that only you would write.</p>
        <textarea
          value={personalWhy}
          onChange={(e) => setPersonalWhy(e.target.value)}
          placeholder="I want to feel like myself again..."
          rows={5}
          className="w-full bg-surface border border-white/10 rounded-xl px-5 py-4 text-lg text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 resize-none transition-colors mb-3"
        />
        <p className="text-xs text-muted mb-8">
          {personalWhy.trim().length < 15 ? `${15 - personalWhy.trim().length} more characters needed` : "\u2713 Ready"}
        </p>
        <button onClick={handleWhyComplete} disabled={personalWhy.trim().length < 15} className={`w-full py-4 rounded-full font-semibold text-lg transition-all ${personalWhy.trim().length >= 15 ? "bg-accent text-white hover:bg-accent-soft" : "bg-surface-light text-muted/40 cursor-not-allowed"}`}>
          Reveal My Archetype
        </button>
      </div>
    </div>
  );

  // ===== LINK ACCOUNT (for anonymous users) =====
  if (step === "link_account") return (
    <div className="min-h-screen flex items-center justify-center py-16 px-6 bg-background">
      <div className="max-w-md w-full">
        <div className="p-8 rounded-2xl bg-surface border border-white/5">
          <h2 className="text-2xl font-bold mb-3">Save your progress</h2>
          <p className="text-muted leading-relaxed mb-6">
            Create an account to save your archetype, goals, and progress. Without an account, you may lose your data if you clear your browser.
          </p>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted mb-1 block">Email</label>
              <input
                type="email"
                value={linkEmail}
                onChange={(e) => setLinkEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-surface-light border border-white/10 rounded-xl px-4 py-3 text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-colors"
              />
            </div>
            <div>
              <label className="text-sm text-muted mb-1 block">Password</label>
              <input
                type="password"
                value={linkPassword}
                onChange={(e) => setLinkPassword(e.target.value)}
                placeholder="At least 6 characters"
                onKeyDown={(e) => e.key === "Enter" && handleLinkAccount()}
                className="w-full bg-surface-light border border-white/10 rounded-xl px-4 py-3 text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-colors"
              />
            </div>

            {linkError && <p className="text-red-400 text-sm">{linkError}</p>}

            <button
              onClick={handleLinkAccount}
              disabled={linkLoading}
              className="w-full py-3 rounded-full bg-accent text-white font-semibold hover:bg-accent-soft transition-all disabled:opacity-50"
            >
              {linkLoading ? "Saving..." : "Create Account & Continue"}
            </button>
          </div>

          <button
            onClick={handleSkipLinking}
            className="w-full mt-4 py-3 text-sm text-muted hover:text-foreground transition-colors"
          >
            Skip for now — I&apos;ll do this later
          </button>
        </div>
      </div>
    </div>
  );

  return null;
}

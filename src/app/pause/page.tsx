"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import { pauseQuestions, type PauseQuestion } from "@/lib/pause/questions";
import { scoreArchetype, type PauseArchetype } from "@/lib/pause/archetypes";

type Phase = "intro" | "safety" | "onboarding" | "reveal" | "priorities" | "dashboard" | "cooldown" | "your_why" | "witness" | "result";

export default function PausePage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [sensitivity, setSensitivity] = useState(false);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [personalWhy, setPersonalWhy] = useState("");
  const [archetype, setArchetype] = useState<PauseArchetype | null>(null);
  const [priorities, setPriorities] = useState<Set<string>>(new Set());
  const [points, setPoints] = useState(0);
  const [resisted, setResisted] = useState(0);
  const [totalPauses, setTotalPauses] = useState(0);
  const [countdown, setCountdown] = useState(30);
  const [breatheIn, setBreatheIn] = useState(true);
  const [outcome, setOutcome] = useState<"resisted" | "overrode" | "modified" | null>(null);
  const [overrideCount, setOverrideCount] = useState(0);

  // Countdown timer
  useEffect(() => {
    if (phase !== "cooldown") return;
    if (countdown <= 0) { setPhase("your_why"); return; }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, countdown]);

  // Breathe cycle
  useEffect(() => {
    if (phase !== "cooldown") return;
    const t = setInterval(() => setBreatheIn((b) => !b), 4000);
    return () => clearInterval(t);
  }, [phase]);

  const q = pauseQuestions[qIndex];

  const handleCardSelect = (val: string) => {
    if (q.type === "single") {
      setAnswers((p) => ({ ...p, [q.id]: val }));
      setTimeout(() => {
        if (qIndex < pauseQuestions.length - 1) setQIndex((i) => i + 1);
        else finishOnboarding();
      }, 300);
    }
  };

  const handleMultiToggle = (val: string) => {
    setAnswers((p) => {
      const current = (p[q.id] as string[]) || [];
      const next = current.includes(val) ? current.filter((v) => v !== val) : [...current, val];
      return { ...p, [q.id]: next };
    });
  };

  const finishOnboarding = () => {
    const a = scoreArchetype(
      answers[1] as string || "",
      answers[2] as string || "",
      (answers[3] as string[]) || []
    );
    setArchetype(a);
    setPhase("reveal");
  };

  const handleResist = () => {
    setOutcome("resisted");
    setResisted((r) => r + 1);
    setTotalPauses((t) => t + 1);
    setPoints((p) => p + 15);
    setOverrideCount(0);
    setPhase("result");
  };

  const handleModify = () => {
    setOutcome("modified");
    setResisted((r) => r + 1);
    setTotalPauses((t) => t + 1);
    setPoints((p) => p + 10);
    setPhase("result");
  };

  const handleOverride = () => {
    if (overrideCount >= 2) { setPhase("witness"); return; }
    setOutcome("overrode");
    setTotalPauses((t) => t + 1);
    setOverrideCount((c) => c + 1);
    setPhase("result");
  };

  // ===== INTRO =====
  if (phase === "intro") return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="min-h-screen flex items-center justify-center px-6 pt-16">
        <div className="max-w-md text-center animate-in">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-4" style={{ color: "#E85D3A" }}>PAUSE</h1>
          <p className="text-lg text-foreground mb-3">You don&apos;t need more willpower.</p>
          <p className="text-muted mb-10">You need awareness at the right moment.</p>
          <button onClick={() => setPhase("safety")} className="px-8 py-3 rounded-lg text-sm font-medium" style={{ background: "#E85D3A", color: "#0A0A0F" }}>
            Begin
          </button>
        </div>
      </div>
    </div>
  );

  // ===== SAFETY GATE =====
  if (phase === "safety") return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="min-h-screen flex items-center justify-center px-6 pt-16">
        <div className="max-w-md animate-in">
          <p className="text-lg leading-relaxed mb-6">Some of what we explore touches on food, body image, and health habits. If any of these feel sensitive, that&apos;s okay.</p>
          <div className="space-y-3">
            <button onClick={() => { setSensitivity(true); setPhase("onboarding"); }} className="w-full text-left px-4 py-3 rounded-lg border border-border text-sm hover:border-white/15 transition-colors">Yes, please be gentle</button>
            <button onClick={() => setPhase("onboarding")} className="w-full text-left px-4 py-3 rounded-lg border border-border text-sm hover:border-white/15 transition-colors">I&apos;m okay — continue normally</button>
          </div>
        </div>
      </div>
    </div>
  );

  // ===== ONBOARDING (4 QUESTIONS) =====
  if (phase === "onboarding") return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-24 pb-12">
        {/* Progress */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted/40">{qIndex + 1} of {pauseQuestions.length}</span>
          <span className="text-xs text-muted/40">{q.section}</span>
        </div>
        <div className="flex gap-0.5 mb-10">
          {pauseQuestions.map((_, i) => (
            <div key={i} className={`h-0.5 flex-1 rounded-full ${i < qIndex ? "bg-pause-orange" : i === qIndex ? "bg-pause-orange/50" : "bg-white/5"}`} />
          ))}
        </div>

        <h2 className="font-serif text-2xl font-bold leading-snug mb-2">{q.text}</h2>
        <p className="text-sm text-muted/50 italic mb-8">{q.subtitle}</p>

        {/* SINGLE SELECT CARDS */}
        {q.type === "single" && q.options && (
          <div className={`grid gap-3 ${q.options.length <= 5 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2 sm:grid-cols-3"}`}>
            {q.options.map((opt) => {
              const selected = answers[q.id] === opt.value;
              return (
                <button key={opt.value} onClick={() => handleCardSelect(opt.value)} className={`text-left p-4 rounded-xl border transition-all hover:scale-[1.02] active:scale-[0.98] ${selected ? "border-pause-orange/40 bg-pause-orange/10" : "border-border bg-surface-light hover:border-white/15"}`}>
                  <span className="text-2xl block mb-2">{opt.emoji}</span>
                  <p className="text-sm font-semibold">{opt.label}</p>
                  <p className="text-xs text-muted mt-1">{opt.subtitle}</p>
                </button>
              );
            })}
          </div>
        )}

        {/* MULTI SELECT CARDS */}
        {q.type === "multi" && q.options && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {q.options.map((opt) => {
                const selected = ((answers[q.id] as string[]) || []).includes(opt.value);
                return (
                  <button key={opt.value} onClick={() => handleMultiToggle(opt.value)} className={`text-left p-4 rounded-xl border transition-all hover:scale-[1.02] active:scale-[0.98] ${selected ? "border-pause-orange/40 bg-pause-orange/10" : "border-border bg-surface-light hover:border-white/15"}`}>
                    <span className="text-2xl block mb-2">{opt.emoji}</span>
                    <p className="text-sm font-semibold">{opt.label}</p>
                    <p className="text-xs text-muted mt-1">{opt.subtitle}</p>
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => { if (qIndex < pauseQuestions.length - 1) setQIndex((i) => i + 1); else finishOnboarding(); }}
              disabled={!answers[q.id] || (answers[q.id] as string[]).length === 0}
              className={`w-full py-3 rounded-lg text-sm font-medium transition-all ${answers[q.id] && (answers[q.id] as string[]).length > 0 ? "text-background" : "bg-surface-light text-muted/20 cursor-not-allowed"}`}
              style={answers[q.id] && (answers[q.id] as string[]).length > 0 ? { background: "#E85D3A" } : {}}
            >
              Continue
            </button>
          </>
        )}

        {/* TEXT INPUT */}
        {q.type === "text" && (
          <>
            <textarea
              value={personalWhy}
              onChange={(e) => setPersonalWhy(e.target.value)}
              placeholder="Because I want to\u2026"
              rows={4}
              className="w-full bg-surface border border-border rounded-xl px-5 py-4 text-lg font-serif italic text-foreground placeholder:text-muted/20 focus:outline-none focus:border-pause-orange/30 resize-none mb-4"
            />
            <button
              onClick={() => { setAnswers((p) => ({ ...p, [q.id]: personalWhy })); finishOnboarding(); }}
              disabled={personalWhy.trim().length < 5}
              className={`w-full py-3 rounded-lg text-sm font-medium transition-all ${personalWhy.trim().length >= 5 ? "text-background" : "bg-surface-light text-muted/20 cursor-not-allowed"}`}
              style={personalWhy.trim().length >= 5 ? { background: "#E85D3A" } : {}}
            >
              Seal it
            </button>
          </>
        )}
      </div>
    </div>
  );

  // ===== ARCHETYPE REVEAL =====
  if (phase === "reveal" && archetype) return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-md mx-auto px-6 pt-24 pb-12 text-center animate-in">
        {/* Wellness ring */}
        <div className="relative w-32 h-32 mx-auto mb-6">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
            <circle cx="60" cy="60" r="54" fill="none" stroke={archetype.color} strokeWidth="6" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 54}
              strokeDashoffset={2 * Math.PI * 54 * (1 - archetype.baseline / 100)}
              style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold">{archetype.baseline}%</span>
            <span className="text-[10px] text-muted">baseline</span>
          </div>
        </div>

        <h1 className="font-serif text-3xl font-bold mb-3" style={{ color: archetype.color }}>{archetype.name}</h1>
        <p className="text-muted leading-relaxed mb-6">{archetype.description}</p>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {archetype.traits.map((t) => (
            <span key={t} className="px-3 py-1 rounded-full text-xs border border-border text-muted">{t}</span>
          ))}
        </div>

        {personalWhy && (
          <div className="p-4 rounded-xl bg-surface border border-border mb-8 text-left">
            <p className="text-xs text-muted uppercase tracking-wider mb-2">Your why</p>
            <p className="font-serif italic">&ldquo;{personalWhy}&rdquo;</p>
          </div>
        )}

        <button onClick={() => setPhase("priorities")} className="w-full py-3 rounded-lg text-sm font-medium" style={{ background: archetype.color, color: "#0A0A0F" }}>
          Set your priorities
        </button>
      </div>
    </div>
  );

  // ===== PRIORITIES =====
  if (phase === "priorities") return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-md mx-auto px-6 pt-24 pb-12 animate-in">
        <h2 className="font-serif text-2xl font-bold mb-6">Set your priorities</h2>
        <div className="space-y-3 mb-8">
          {[
            { id: "physical", label: "Physical Health", icon: "\u25CE" },
            { id: "nutrition", label: "Nutritional Health", icon: "\u25C9" },
            { id: "digital", label: "Digital Wellness", icon: "\u25C8" },
          ].map((p) => {
            const active = priorities.has(p.id);
            return (
              <button key={p.id} onClick={() => setPriorities((prev) => { const n = new Set(prev); n.has(p.id) ? n.delete(p.id) : n.add(p.id); return n; })} className={`w-full text-left px-5 py-4 rounded-xl border transition-all ${active ? "border-pause-orange/40 bg-pause-orange/10" : "border-border hover:border-white/15"}`}>
                <span className="text-lg mr-3">{p.icon}</span>{p.label}
              </button>
            );
          })}
        </div>
        <button onClick={() => setPhase("dashboard")} disabled={priorities.size === 0} className={`w-full py-3 rounded-lg text-sm font-medium transition-all ${priorities.size > 0 ? "text-background" : "bg-surface-light text-muted/20 cursor-not-allowed"}`} style={priorities.size > 0 ? { background: "#E85D3A" } : {}}>
          Start observing
        </button>
      </div>
    </div>
  );

  // ===== DASHBOARD =====
  if (phase === "dashboard") return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-lg mx-auto px-6 pt-24 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-xl font-bold">{archetype?.name}</h2>
          <span className="text-xs text-muted">{points}/200 pts</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="p-3 rounded-xl bg-surface border border-border text-center">
            <p className="text-lg font-bold" style={{ color: "#E85D3A" }}>{points}</p>
            <p className="text-[10px] text-muted">Points</p>
          </div>
          <div className="p-3 rounded-xl bg-surface border border-border text-center">
            <p className="text-lg font-bold text-green-400">{resisted}</p>
            <p className="text-[10px] text-muted">Resisted</p>
          </div>
          <div className="p-3 rounded-xl bg-surface border border-border text-center">
            <p className="text-lg font-bold">{totalPauses}</p>
            <p className="text-[10px] text-muted">Pauses</p>
          </div>
        </div>

        {/* Your Why */}
        {personalWhy && (
          <div className="p-4 rounded-xl bg-surface border border-border mb-6">
            <p className="text-xs text-muted uppercase tracking-wider mb-2">Your why</p>
            <p className="font-serif italic">&ldquo;{personalWhy}&rdquo;</p>
          </div>
        )}

        {/* Graduation */}
        <div className="p-4 rounded-xl bg-surface border border-border mb-6">
          <div className="flex justify-between text-xs text-muted mb-2">
            <span>Graduation</span>
            <span>{points}/200</span>
          </div>
          <div className="w-full h-1.5 bg-surface-light rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, (points / 200) * 100)}%`, background: "#E85D3A" }} />
          </div>
        </div>

        {/* Simulate Pause */}
        <button
          onClick={() => { setCountdown(30); setBreatheIn(true); setOutcome(null); setPhase("cooldown"); }}
          className="w-full py-3 rounded-lg border text-sm font-medium transition-all"
          style={{ borderColor: "rgba(232,93,58,0.3)", color: "#E85D3A", background: "rgba(232,93,58,0.05)" }}
        >
          Simulate a Pause
        </button>
      </div>
    </div>
  );

  // ===== COOLDOWN (30 seconds, mandatory) =====
  if (phase === "cooldown") {
    const progress = ((30 - countdown) / 30) * 100;
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden">
        <Navbar />
        {/* Breathing circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border transition-all duration-[4000ms]" style={{ borderColor: archetype?.color || "#E85D3A", opacity: 0.15, transform: `translate(-50%, -50%) scale(${breatheIn ? 1.15 : 1})` }} />

        <div className="relative z-10 text-center">
          <p className="text-sm text-muted mb-8">{breatheIn ? "breathe in" : "breathe out"}</p>

          <div className="relative w-28 h-28 mx-auto mb-8">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
              <circle cx="60" cy="60" r="54" fill="none" stroke={archetype?.color || "#E85D3A"} strokeWidth="3" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 54} strokeDashoffset={2 * Math.PI * 54 * (1 - progress / 100)}
                style={{ transition: "stroke-dashoffset 1s linear" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold tabular-nums text-muted">{countdown}</span>
            </div>
          </div>

          <p className="text-xs text-muted/40">Creating space between impulse and action</p>
        </div>
      </div>
    );
  }

  // ===== YOUR WHY =====
  if (phase === "your_why") return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <Navbar />
      <div className="max-w-md text-center animate-in">
        <p className="text-xs uppercase tracking-wider text-muted mb-4">You said this mattered</p>
        <p className="font-serif text-2xl italic leading-relaxed mb-6">&ldquo;{personalWhy}&rdquo;</p>
        <p className="text-sm mb-8" style={{ color: archetype?.color }}>Pattern detected: Late-night delivery order. This is the 6th time this month.</p>
        <div className="space-y-3 w-full">
          <button onClick={handleResist} className="w-full py-3 rounded-lg text-sm font-medium" style={{ background: "rgba(107,232,160,0.1)", color: "#6BE8A0" }}>I&apos;ll resist</button>
          <button onClick={handleModify} className="w-full py-3 rounded-lg border text-sm font-medium" style={{ borderColor: "rgba(232,168,58,0.2)", color: "rgba(232,168,58,0.8)" }}>Modify choice</button>
          <button onClick={handleOverride} className="w-full py-3 rounded-lg border border-white/5 text-sm text-muted hover:text-foreground transition-colors">Override</button>
        </div>
      </div>
    </div>
  );

  // ===== WITNESS =====
  if (phase === "witness") return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <Navbar />
      <div className="max-w-sm text-center animate-in">
        <div className="w-3 h-3 rounded-full border border-white/20 mx-auto mb-8 flex items-center justify-center">
          <div className="w-1 h-1 rounded-full bg-white/30" />
        </div>
        <p className="font-serif text-lg italic text-muted mb-10">Noted. No judgment. Just witnessing.</p>
        <div className="space-y-3 w-full">
          <button onClick={handleResist} className="w-full py-3 rounded-lg text-sm font-medium" style={{ background: "rgba(107,232,160,0.1)", color: "#6BE8A0" }}>Actually, I&apos;ll resist</button>
          <button onClick={() => { setOutcome("overrode"); setTotalPauses((t) => t + 1); setOverrideCount((c) => c + 1); setPhase("result"); }} className="w-full py-3 rounded-lg text-sm text-muted/40 hover:text-muted transition-colors">Continue anyway</button>
        </div>
      </div>
    </div>
  );

  // ===== RESULT =====
  if (phase === "result") return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <Navbar />
      <div className="max-w-sm text-center animate-in">
        {outcome === "resisted" && (
          <>
            <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: "rgba(107,232,160,0.15)" }}>
              <svg className="w-7 h-7" style={{ color: "#6BE8A0" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
            </div>
            <h2 className="text-xl font-bold mb-2">You resisted.</h2>
            <p className="text-sm text-muted mb-2">+15 points</p>
          </>
        )}
        {outcome === "modified" && (
          <>
            <h2 className="text-xl font-bold mb-2">Modified. That counts.</h2>
            <p className="text-sm text-muted mb-2">+10 points</p>
          </>
        )}
        {outcome === "overrode" && (
          <>
            <h2 className="text-xl font-bold mb-2">Noted.</h2>
            <p className="text-sm text-muted mb-2">No judgment. Every response helps PAUSE learn.</p>
          </>
        )}
        <button onClick={() => setPhase("dashboard")} className="mt-6 px-6 py-3 rounded-lg text-sm font-medium" style={{ background: "#E85D3A", color: "#0A0A0F" }}>
          Back to dashboard
        </button>
      </div>
    </div>
  );

  return null;
}

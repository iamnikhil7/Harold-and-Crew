"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { scenarios, type OrbState, type Scenario } from "@/lib/harold/scenarios";
import { type DetectedPattern } from "@/lib/health/patterns";

type HaroldPhase = "notification" | "narration" | "summary" | "actions" | "depth" | "context" | "ack";

export default function HaroldPage() {
  const [phase, setPhase] = useState<HaroldPhase>("notification");
  const [activeScenario, setActiveScenario] = useState<string>("rhr");
  const [orbState, setOrbState] = useState<OrbState>("neutral");
  const [caption, setCaption] = useState("");
  const [showSkip, setShowSkip] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showDepthContinue, setShowDepthContinue] = useState(false);
  const [chartFocus, setChartFocus] = useState<"stress" | "sleep" | "shift">("stress");
  const [contextWeek, setContextWeek] = useState("");
  const [contextWork, setContextWork] = useState("");
  const [showContextResult, setShowContextResult] = useState(false);
  const [detectedPatterns, setDetectedPatterns] = useState<DetectedPattern[]>([]);
  const [notificationMsg, setNotificationMsg] = useState("");
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  const scenario: Scenario = scenarios[activeScenario];

  // Load detected patterns from health data
  useEffect(() => {
    const stored = localStorage.getItem("attune_patterns");
    if (stored) {
      try {
        const p = JSON.parse(stored) as DetectedPattern[];
        setDetectedPatterns(p);
        // Pick notification message based on real patterns
        if (p.length > 0) {
          const top = p[0];
          setNotificationMsg(top.caption);
          // Map pattern type to scenario
          if (top.type === "rising_rhr" || top.type === "stress_accumulation") setActiveScenario("rhr");
          else if (top.type === "declining_sleep" || top.type === "late_nights") setActiveScenario("sleep");
          else if (top.type === "low_movement") setActiveScenario("activity");
        } else {
          setNotificationMsg("All looks steady. Just checking in.");
        }
      } catch { setNotificationMsg("Something feels slightly off today."); }
    } else {
      const msgs = ["Something feels slightly off today.", "You've been pushing a bit lately."];
      setNotificationMsg(msgs[Math.floor(Math.random() * msgs.length)]);
    }
  }, []);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
  }, []);

  const startNarration = useCallback(() => {
    clearAllTimers();
    setCaption(""); setShowActions(false); setShowSkip(false); setOrbState("neutral");

    const sc = scenarios[activeScenario];
    const lastAt = sc.scenes[sc.scenes.length - 1].at;
    let totalDuration = lastAt + 1400;

    if (typeof window !== "undefined" && window.speechSynthesis) {
      const wordCount = sc.voiceScript.split(" ").length;
      totalDuration = Math.max(11000, Math.min(18000, (wordCount / 2.9) * 1000));
      const utterance = new SpeechSynthesisUtterance(sc.voiceScript);
      utterance.rate = 0.98; utterance.pitch = 0.96; utterance.volume = 0.95; utterance.lang = "en-US";
      try { window.speechSynthesis.speak(utterance); } catch {}
    }

    timersRef.current.push(setTimeout(() => setShowSkip(true), 500));

    sc.scenes.forEach((scene) => {
      const t = (scene.at / lastAt) * (totalDuration * 0.88);
      timersRef.current.push(setTimeout(() => { setOrbState(scene.state); setCaption(scene.caption); }, t));
    });

    timersRef.current.push(setTimeout(() => { setShowActions(true); setShowSkip(false); setOrbState("recovery"); }, totalDuration * 0.95));
  }, [activeScenario, clearAllTimers]);

  useEffect(() => {
    if (phase === "narration") startNarration();
    return () => clearAllTimers();
  }, [phase, activeScenario, startNarration, clearAllTimers]);

  useEffect(() => {
    if (phase !== "depth") return;
    const cycle: Array<"stress" | "sleep" | "shift"> = ["stress", "sleep", "shift"];
    let i = 0;
    const interval = setInterval(() => { i = (i + 1) % cycle.length; setChartFocus(cycle[i]); }, 1800);
    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    if (phase !== "depth") return;
    setShowDepthContinue(false);
    const t = setTimeout(() => setShowDepthContinue(true), 1600);
    return () => clearTimeout(t);
  }, [phase]);

  const switchScenario = (id: string) => {
    clearAllTimers(); setActiveScenario(id); setCaption(""); setShowActions(false); setShowSkip(false); setOrbState("neutral");
    if (phase === "narration" || phase === "summary" || phase === "actions") setPhase("narration");
  };

  // Get dynamic insight from detected patterns
  const getDynamicInsight = () => {
    if (detectedPatterns.length === 0) return null;
    return detectedPatterns[0]; // Most severe pattern
  };

  const dynamicPattern = getDynamicInsight();

  // ===== NOTIFICATION =====
  if (phase === "notification") {
    return (
      <div className="min-h-screen relative"><Navbar />
        <div className="fixed inset-0 z-40 flex items-start justify-center pt-24" style={{ background: "rgba(5,5,8,0.65)", backdropFilter: "blur(4px)" }} onClick={() => setPhase("narration")}>
          <div className="max-w-sm w-full mx-6 p-5 rounded-2xl cursor-pointer hover:scale-[1.01] transition-all" style={{ background: "rgba(37,41,52,0.95)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
            <p className="text-[11px] uppercase tracking-[0.15em] text-muted/40 mb-2">Attune</p>
            <p className="text-foreground/90 leading-relaxed">{notificationMsg}</p>
            {detectedPatterns.length > 0 && (
              <p className="text-[11px] text-muted/30 mt-2">{detectedPatterns.length} pattern{detectedPatterns.length > 1 ? "s" : ""} detected this week</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Orb component
  const Orb = () => {
    const anim = orbState === "stress" ? "animate-[pulse-stress_1.25s_ease-in-out_infinite]" : orbState === "recovery" ? "animate-[pulse-recovery_3.1s_ease-in-out_infinite]" : "animate-[pulse-neutral_2.5s_ease-in-out_infinite]";
    const shadow = orbState === "stress" ? "0 0 58px rgba(255,108,132,0.34)" : orbState === "recovery" ? "0 0 44px rgba(255,145,166,0.2)" : "0 0 48px rgba(255,122,146,0.22)";
    return (
      <div aria-hidden="true" className={`w-[8.4rem] h-[8.4rem] rounded-full ${anim}`} style={{
        background: "radial-gradient(circle at 35% 28%, rgba(255,241,242,0.92), rgba(233,118,132,0.8) 46%, rgba(136,36,56,0.5) 73%, rgba(29,10,16,0.34) 100%)",
        boxShadow: shadow, transition: "box-shadow 420ms ease, filter 420ms ease, opacity 420ms ease",
      }} />
    );
  };

  // ===== NARRATION =====
  if (phase === "narration" || phase === "summary" || phase === "actions") {
    return (
      <div className="min-h-screen bg-background"><Navbar />
        <div className="max-w-md mx-auto px-6 pt-24 pb-12 flex flex-col items-center">
          <p className="text-[11px] uppercase tracking-[0.15em] text-muted/40 mb-6">Harold &bull; Heart Insight</p>
          <div className="flex gap-2 mb-6">
            {Object.values(scenarios).map((s) => (
              <button key={s.id} onClick={() => switchScenario(s.id)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${activeScenario === s.id ? "bg-white text-background" : "border border-border text-muted/50 hover:text-foreground"}`}>
                {s.label}
              </button>
            ))}
          </div>

          {/* Dynamic pattern badge */}
          {dynamicPattern && phase === "narration" && (
            <div className="mb-4 px-3 py-1 rounded-full bg-harold/10 border border-harold/20">
              <p className="text-[10px] text-harold">{dynamicPattern.severity} &middot; {dynamicPattern.title}</p>
            </div>
          )}

          {showSkip && phase === "narration" && (
            <button onClick={() => { clearAllTimers(); setShowSkip(false); setPhase("summary"); }} className="self-end px-3 py-1 rounded-full border border-border text-muted/40 text-[11px] hover:text-foreground transition-colors mb-4">
              See summary
            </button>
          )}

          <div className="mb-8"><Orb /></div>

          {phase === "summary" ? (
            <div className="text-center mb-8 animate-in">
              <h3 className="text-lg font-medium mb-4">Summary</h3>
              <div className="space-y-3">
                {scenario.summary.map((line, i) => (<p key={i} className="text-sm text-muted/60 leading-relaxed">{line}</p>))}
              </div>
              {dynamicPattern && (
                <div className="mt-4 p-3 rounded-xl bg-surface border border-border text-left">
                  <p className="text-[10px] text-muted/30 mb-1">From your data</p>
                  <p className="text-xs text-muted/60">{dynamicPattern.insight}</p>
                </div>
              )}
            </div>
          ) : caption ? (
            <p className="text-center text-foreground/90 text-lg leading-relaxed mb-8 animate-in max-w-xs">{caption}</p>
          ) : (<div className="h-8 mb-8" />)}

          {(showActions || phase === "summary") && (
            <div className="w-full space-y-3 animate-in">
              <button onClick={() => setPhase("ack")} className="w-full py-3 rounded-full bg-white text-background text-sm font-medium hover:opacity-90 transition-all">Got it</button>
              <button onClick={() => setPhase("depth")} className="w-full py-3 rounded-full border border-white/10 text-foreground text-sm font-medium hover:bg-white/[0.03] transition-all">Want to understand this?</button>
            </div>
          )}

          <Link href="/" className="mt-8 text-[11px] text-muted/20 hover:text-muted/40 transition-colors">&larr; Back to Attune</Link>
        </div>
      </div>
    );
  }

  // ===== DEPTH =====
  if (phase === "depth") {
    const guideTexts = ["See this pattern?", "When stress rises and sleep drops\u2026", "your baseline shifts."];
    const guideIndex = chartFocus === "stress" ? 0 : chartFocus === "sleep" ? 1 : 2;

    return (
      <div className="min-h-screen bg-background"><Navbar />
        <div className="max-w-lg mx-auto px-6 pt-24 pb-12 animate-in">
          <h2 className="text-2xl mb-6">A clearer look</h2>
          <div className="rounded-2xl border border-border bg-surface-light p-4 mb-8">
            <svg viewBox="0 0 320 170" className="w-full h-auto">
              <polyline points="20,120 70,110 120,90 170,80 220,62 270,54 300,48" fill="none" stroke="#ff8897" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: chartFocus === "stress" || chartFocus === "shift" ? 0.95 : 0.35, filter: chartFocus === "stress" ? "drop-shadow(0 0 6px rgba(255,136,151,0.5))" : "none", transition: "opacity 220ms, filter 220ms" }} />
              <polyline points="20,48 70,58 120,70 170,86 220,102 270,114 300,124" fill="none" stroke="#d3dcff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: chartFocus === "sleep" || chartFocus === "shift" ? 0.95 : 0.35, filter: chartFocus === "sleep" ? "drop-shadow(0 0 6px rgba(211,220,255,0.5))" : "none", transition: "opacity 220ms, filter 220ms" }} />
            </svg>
            <div className="flex justify-between mt-3 text-xs">
              <span style={{ color: "#FF8897" }}>Stress</span>
              <span className="text-muted/40">{guideTexts[guideIndex]}</span>
              <span style={{ color: "#9DB0FF" }}>Sleep</span>
            </div>
          </div>

          <div className="space-y-6 mb-8">
            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] text-muted/30 mb-2">What Harold noticed</p>
              <p className="text-sm leading-relaxed">{dynamicPattern ? dynamicPattern.insight : scenario.noticed}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] text-muted/30 mb-2">Why it may matter</p>
              <p className="text-sm leading-relaxed">{dynamicPattern ? dynamicPattern.matter : scenario.matter}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] text-muted/30 mb-2">3 simple next steps</p>
              <ol className="space-y-2">
                {(dynamicPattern ? dynamicPattern.steps : scenario.steps).map((step, i) => (
                  <li key={i} className="text-sm leading-relaxed flex gap-2"><span className="text-accent/60 font-medium">{i + 1}.</span>{step}</li>
                ))}
              </ol>
            </div>

            {/* Real data points if available */}
            {dynamicPattern && dynamicPattern.dataPoints.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-muted/30 mb-2">Your numbers</p>
                <div className="flex flex-wrap gap-3">
                  {dynamicPattern.dataPoints.map((dp, i) => (
                    <div key={i} className="px-3 py-2 rounded-xl bg-surface border border-border">
                      <p className="text-[10px] text-muted/30">{dp.label}</p>
                      <p className="text-sm font-medium">{dp.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {showDepthContinue && (
            <button onClick={() => setPhase("context")} className="w-full py-3 rounded-full bg-white text-background text-sm font-medium hover:opacity-90 transition-all animate-in">Continue</button>
          )}
        </div>
      </div>
    );
  }

  // ===== CONTEXT =====
  if (phase === "context") {
    return (
      <div className="min-h-screen bg-background"><Navbar />
        <div className="max-w-md mx-auto px-6 pt-24 pb-12">
          {!showContextResult ? (
            <div className="animate-in">
              <h2 className="text-2xl mb-2">Make this more relevant</h2>
              <p className="text-sm text-muted/50 mb-8">Takes a few seconds.</p>
              <div className="mb-6">
                <p className="text-sm font-medium mb-3">What kind of week?</p>
                <div className="flex gap-2">
                  {["Busy", "Normal", "Exhausting"].map((o) => (<button key={o} onClick={() => setContextWeek(o)} className={`px-4 py-2 rounded-full text-sm transition-all ${contextWeek === o ? "bg-white text-background" : "border border-border text-muted/50 hover:text-foreground"}`}>{o}</button>))}
                </div>
              </div>
              <div className="mb-8">
                <p className="text-sm font-medium mb-3">What kind of work?</p>
                <div className="flex flex-wrap gap-2">
                  {["Desk", "Office", "Active", "On your feet", "Student", "Other"].map((o) => (<button key={o} onClick={() => setContextWork(o)} className={`px-4 py-2 rounded-full text-sm transition-all ${contextWork === o ? "bg-white text-background" : "border border-border text-muted/50 hover:text-foreground"}`}>{o}</button>))}
                </div>
              </div>
              <button onClick={() => setShowContextResult(true)} disabled={!contextWeek || !contextWork} className={`w-full py-3 rounded-full text-sm font-medium transition-all ${contextWeek && contextWork ? "bg-white text-background hover:opacity-90" : "bg-white/[0.03] text-muted/15 cursor-not-allowed"}`}>Continue</button>
            </div>
          ) : (
            <div className="animate-in">
              <p className="text-lg leading-relaxed mb-8">
                Got it&hellip; during <span className="text-harold">{contextWeek.toLowerCase()}</span> weeks, your body carries more baseline stress. I&apos;ll keep that in mind around <span className="text-harold">{contextWork.toLowerCase()}</span> work and tune future insights accordingly.
              </p>
              <Link href="/health" className="w-full block text-center py-3 rounded-full border border-border text-sm font-medium hover:bg-white/[0.03] transition-all">
                View your health data
              </Link>
              <Link href="/" className="block mt-4 text-center text-[11px] text-muted/20 hover:text-muted/40 transition-colors">&larr; Back to Attune</Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ===== ACK =====
  if (phase === "ack") {
    return (
      <div className="min-h-screen bg-background"><Navbar />
        <div className="max-w-md mx-auto px-6 pt-24 pb-12 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="p-6 rounded-2xl border border-border text-center animate-in mb-8">
            <p className="text-lg leading-relaxed">{scenario.ack}</p>
          </div>
          <div className="flex gap-4">
            <Link href="/health" className="px-5 py-2.5 rounded-full border border-border text-sm text-muted/50 hover:text-foreground transition-all">View health data</Link>
            <Link href="/" className="px-5 py-2.5 rounded-full text-sm text-muted/20 hover:text-muted/40 transition-colors">Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

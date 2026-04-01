"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "@/components/layout/Navbar";
import { scenarios, type OrbState, type Scenario } from "@/lib/harold/scenarios";

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
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  const scenario: Scenario = scenarios[activeScenario];

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const startNarration = useCallback(() => {
    clearAllTimers();
    setCaption("");
    setShowActions(false);
    setShowSkip(false);
    setOrbState("neutral");

    const sc = scenarios[activeScenario];
    const lastAt = sc.scenes[sc.scenes.length - 1].at;

    // Try speech synthesis
    let totalDuration = lastAt + 1400;
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const wordCount = sc.voiceScript.split(" ").length;
      const estimated = (wordCount / 2.9) * 1000;
      totalDuration = Math.max(11000, Math.min(18000, estimated));

      const utterance = new SpeechSynthesisUtterance(sc.voiceScript);
      utterance.rate = 0.98;
      utterance.pitch = 0.96;
      utterance.volume = 0.95;
      utterance.lang = "en-US";
      synthRef.current = utterance;

      try { window.speechSynthesis.speak(utterance); } catch {}
    }

    // Show skip button after 500ms
    timersRef.current.push(setTimeout(() => setShowSkip(true), 500));

    // Schedule scenes
    sc.scenes.forEach((scene) => {
      const sceneTime = (scene.at / lastAt) * (totalDuration * 0.88);
      timersRef.current.push(setTimeout(() => {
        setOrbState(scene.state);
        setCaption(scene.caption);
      }, sceneTime));
    });

    // Show actions at 95% of duration
    timersRef.current.push(setTimeout(() => {
      setShowActions(true);
      setShowSkip(false);
      setOrbState("recovery");
    }, totalDuration * 0.95));
  }, [activeScenario, clearAllTimers]);

  // Start narration when scenario changes
  useEffect(() => {
    if (phase === "narration") {
      startNarration();
    }
    return () => clearAllTimers();
  }, [phase, activeScenario, startNarration, clearAllTimers]);

  // Chart focus cycling
  useEffect(() => {
    if (phase !== "depth") return;
    const cycle: Array<"stress" | "sleep" | "shift"> = ["stress", "sleep", "shift"];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % cycle.length;
      setChartFocus(cycle[i]);
    }, 1800);
    return () => clearInterval(interval);
  }, [phase]);

  // Depth continue button delay
  useEffect(() => {
    if (phase !== "depth") return;
    setShowDepthContinue(false);
    const t = setTimeout(() => setShowDepthContinue(true), 1600);
    return () => clearTimeout(t);
  }, [phase]);

  const switchScenario = (id: string) => {
    clearAllTimers();
    setActiveScenario(id);
    setCaption("");
    setShowActions(false);
    setShowSkip(false);
    setOrbState("neutral");
    if (phase === "narration" || phase === "summary" || phase === "actions") {
      // Restart narration for new scenario
      setPhase("narration");
    }
  };

  const handleSkipToSummary = () => {
    clearAllTimers();
    setShowSkip(false);
    setPhase("summary");
  };

  const handleGotIt = () => setPhase("ack");
  const handleUnderstand = () => setPhase("depth");

  // ===== NOTIFICATION =====
  if (phase === "notification") {
    const messages = ["Something feels slightly off today.", "You've been pushing a bit lately."];
    const msg = messages[Math.floor(Math.random() * messages.length)];

    return (
      <div className="min-h-screen relative">
        <Navbar />
        <div className="fixed inset-0 z-40 flex items-start justify-center pt-24" style={{ background: "rgba(5,5,8,0.65)", backdropFilter: "blur(4px)" }} onClick={() => { setPhase("narration"); }}>
          <div
            className="max-w-sm w-full mx-6 p-5 rounded-2xl cursor-pointer hover:scale-[1.01] transition-all"
            style={{ background: "rgba(37,41,52,0.95)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}
          >
            <p className="text-xs uppercase tracking-wider text-muted mb-2" style={{ fontSize: "0.72rem" }}>Attune</p>
            <p className="text-foreground" style={{ fontSize: "0.98rem" }}>{msg}</p>
          </div>
        </div>
      </div>
    );
  }

  // ===== ORB COMPONENT =====
  const Orb = () => {
    const animClass = orbState === "stress" ? "animate-[pulse-stress_1.25s_ease-in-out_infinite]" : orbState === "recovery" ? "animate-[pulse-recovery_3.1s_ease-in-out_infinite]" : "animate-[pulse-neutral_2.5s_ease-in-out_infinite]";
    const shadow = orbState === "stress" ? "0 0 58px rgba(255,108,132,0.34)" : orbState === "recovery" ? "0 0 44px rgba(255,145,166,0.2)" : "0 0 48px rgba(255,122,146,0.22)";

    return (
      <div
        aria-hidden="true"
        className={`w-[8.4rem] h-[8.4rem] rounded-full ${animClass}`}
        style={{
          background: "radial-gradient(circle at 35% 28%, rgba(255,241,242,0.92), rgba(233,118,132,0.8) 46%, rgba(136,36,56,0.5) 73%, rgba(29,10,16,0.34) 100%)",
          boxShadow: shadow,
          transition: "box-shadow 420ms ease, filter 420ms ease, opacity 420ms ease",
        }}
      />
    );
  };

  // ===== NARRATION / SUMMARY / ACTIONS =====
  if (phase === "narration" || phase === "summary" || phase === "actions") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-md mx-auto px-6 pt-24 pb-12 flex flex-col items-center">
          {/* Agent label */}
          <p className="text-xs uppercase tracking-wider text-muted mb-6" style={{ fontSize: "0.8rem" }}>Harold &bull; Heart Insight</p>

          {/* Scenario tabs */}
          <div className="flex gap-2 mb-8">
            {Object.values(scenarios).map((s) => (
              <button
                key={s.id}
                onClick={() => switchScenario(s.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${activeScenario === s.id ? "bg-white text-background" : "border border-white/15 text-muted hover:text-foreground"}`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Skip button */}
          {showSkip && phase === "narration" && (
            <button onClick={handleSkipToSummary} className="self-end px-3 py-1 rounded-full border border-white/10 text-muted text-xs hover:text-foreground transition-colors mb-4" style={{ fontSize: "0.72rem" }}>
              See summary
            </button>
          )}

          {/* Orb */}
          <div className="mb-8">
            <Orb />
          </div>

          {/* Caption or Summary */}
          {phase === "summary" ? (
            <div className="text-center mb-8 animate-in">
              <h3 className="font-serif text-lg font-bold mb-4">Summary</h3>
              <div className="space-y-3">
                {scenario.summary.map((line, i) => (
                  <p key={i} className="text-sm text-muted leading-relaxed">{line}</p>
                ))}
              </div>
            </div>
          ) : caption ? (
            <p className="text-center text-foreground text-lg leading-relaxed mb-8 animate-in max-w-xs">
              {caption}
            </p>
          ) : (
            <div className="h-8 mb-8" />
          )}

          {/* Action buttons */}
          {(showActions || phase === "summary") && (
            <div className="w-full space-y-3 animate-in">
              <button onClick={handleGotIt} className="w-full py-3 rounded-full bg-white text-background text-sm font-medium hover:opacity-90 transition-all">
                Got it
              </button>
              <button onClick={handleUnderstand} className="w-full py-3 rounded-full border border-white/15 text-foreground text-sm font-medium hover:bg-surface-light transition-all">
                Want to understand this?
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ===== DEPTH PANEL =====
  if (phase === "depth") {
    const guideTexts = ["See this pattern?", "When stress rises and sleep drops\u2026", "your baseline shifts."];
    const guideIndex = chartFocus === "stress" ? 0 : chartFocus === "sleep" ? 1 : 2;

    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-lg mx-auto px-6 pt-24 pb-12 animate-in">
          <h2 className="font-serif text-2xl font-bold mb-6">A clearer look</h2>

          {/* Chart */}
          <div className="rounded-xl border border-border bg-surface-light p-4 mb-8">
            <svg viewBox="0 0 320 170" className="w-full h-auto">
              <polyline
                points="20,120 70,110 120,90 170,80 220,62 270,54 300,48"
                fill="none" stroke="#ff8897" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ opacity: chartFocus === "stress" || chartFocus === "shift" ? 0.95 : 0.35, filter: chartFocus === "stress" ? "drop-shadow(0 0 6px rgba(255,136,151,0.5))" : "none", transition: "opacity 220ms, filter 220ms" }}
              />
              <polyline
                points="20,48 70,58 120,70 170,86 220,102 270,114 300,124"
                fill="none" stroke="#d3dcff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ opacity: chartFocus === "sleep" || chartFocus === "shift" ? 0.95 : 0.35, filter: chartFocus === "sleep" ? "drop-shadow(0 0 6px rgba(211,220,255,0.5))" : "none", transition: "opacity 220ms, filter 220ms" }}
              />
            </svg>
            <div className="flex justify-between mt-3 text-xs">
              <span className="text-harold">Stress</span>
              <span className={`transition-colors ${guideIndex === 0 ? "text-white" : guideIndex === 1 ? "text-white" : "text-white"}`} style={{ opacity: 0.6 }}>{guideTexts[guideIndex]}</span>
              <span className="text-crew">Sleep</span>
            </div>
          </div>

          {/* Insight sections */}
          <div className="space-y-6 mb-8">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted mb-2">What Harold noticed</p>
              <p className="text-sm leading-relaxed">{scenario.noticed}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted mb-2">Why it may matter</p>
              <p className="text-sm leading-relaxed">{scenario.matter}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted mb-2">3 simple next steps</p>
              <ol className="space-y-2">
                {scenario.steps.map((step, i) => (
                  <li key={i} className="text-sm leading-relaxed flex gap-2">
                    <span className="text-accent font-medium">{i + 1}.</span>{step}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {showDepthContinue && (
            <button onClick={() => setPhase("context")} className="w-full py-3 rounded-full bg-white text-background text-sm font-medium hover:opacity-90 transition-all animate-in">
              Continue
            </button>
          )}
        </div>
      </div>
    );
  }

  // ===== CONTEXT PERSONALIZATION =====
  if (phase === "context") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-md mx-auto px-6 pt-24 pb-12">
          {!showContextResult ? (
            <div className="animate-in">
              <h2 className="font-serif text-2xl font-bold mb-2">Make this more relevant to you</h2>
              <p className="text-sm text-muted mb-8">Takes a few seconds.</p>

              <div className="mb-6">
                <p className="text-sm font-medium mb-3">What kind of week are you having?</p>
                <div className="flex gap-2">
                  {["Busy", "Normal", "Exhausting"].map((opt) => (
                    <button key={opt} onClick={() => setContextWeek(opt)} className={`px-4 py-2 rounded-full text-sm transition-all ${contextWeek === opt ? "bg-white text-background" : "border border-white/15 text-muted hover:text-foreground"}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <p className="text-sm font-medium mb-3">What kind of work do you do?</p>
                <div className="flex flex-wrap gap-2">
                  {["Desk", "Office", "Active", "On your feet", "Student", "Other"].map((opt) => (
                    <button key={opt} onClick={() => setContextWork(opt)} className={`px-4 py-2 rounded-full text-sm transition-all ${contextWork === opt ? "bg-white text-background" : "border border-white/15 text-muted hover:text-foreground"}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setShowContextResult(true)}
                disabled={!contextWeek || !contextWork}
                className={`w-full py-3 rounded-full text-sm font-medium transition-all ${contextWeek && contextWork ? "bg-white text-background hover:opacity-90" : "bg-surface-light text-muted/30 cursor-not-allowed"}`}
              >
                Continue
              </button>
            </div>
          ) : (
            <div className="animate-in">
              <p className="text-lg leading-relaxed">
                Got it&hellip; during <span className="text-harold">{contextWeek.toLowerCase()}</span> weeks like this, your body usually carries more baseline stress. I&apos;ll keep that in mind around <span className="text-harold">{contextWork.toLowerCase()}</span> and tune future insights accordingly.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ===== ACKNOWLEDGE =====
  if (phase === "ack") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-md mx-auto px-6 pt-24 pb-12 flex items-center justify-center min-h-[60vh]">
          <div className="p-6 rounded-xl border border-border text-center animate-in">
            <p className="font-serif text-lg leading-relaxed italic">{scenario.ack}</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

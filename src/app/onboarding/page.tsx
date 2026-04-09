"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { questions } from "@/lib/questions";
import { archetypes } from "@/lib/archetypes";
import { calculateArchetypeScores } from "@/lib/scoring";
import QuestionCard from "@/components/QuestionCard";

type Responses = Record<number, string | string[] | number | null>;

function buildResponseArray(responses: Responses) {
  return questions.map((q) => ({
    questionId: q.id,
    responseType: q.type,
    responseChoice: responses[q.id] as string | string[] | number,
  }));
}

/* ─── Intro screen ──────────────────────────────────────────────── */
function IntroScreen({
  sensitivityMode,
  onToggleSensitivity,
  onStart,
}: {
  sensitivityMode: boolean;
  onToggleSensitivity: () => void;
  onStart: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="text-center max-w-sm mx-auto px-4"
    >
      <div className="mb-8">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src="/harold-mascot.png"
            alt="Harold"
            width={100}
            height={100}
            className="mx-auto rounded-[28%] shadow-xl shadow-black/30 ring-1 ring-white/[0.06]"
          />
        </motion.div>
      </div>

      <h1 className="font-serif text-3xl mb-3">A few honest questions</h1>
      <p className="text-sm text-muted leading-relaxed mb-8 max-w-xs mx-auto">
        This takes about 4 minutes. No wrong answers — just you, being honest
        with yourself.
      </p>

      <div className="mb-8 p-4 rounded-2xl bg-surface border border-border text-left">
        <p className="text-xs text-muted/60 mb-3">
          Would you prefer gentler phrasing for sensitive topics?
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => !sensitivityMode && onToggleSensitivity()}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
              !sensitivityMode
                ? "bg-accent text-background"
                : "bg-surface-light text-muted hover:text-foreground"
            }`}
          >
            Standard
          </button>
          <button
            onClick={() => sensitivityMode || onToggleSensitivity()}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
              sensitivityMode
                ? "bg-accent text-background"
                : "bg-surface-light text-muted hover:text-foreground"
            }`}
          >
            Sensitive mode
          </button>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        onClick={onStart}
        className="w-full py-3.5 rounded-xl font-semibold text-sm bg-gradient-primary text-white shadow-lg shadow-accent/20"
      >
        Let&apos;s begin
      </motion.button>

      <p className="text-xs text-muted/30 mt-4">
        Your answers stay private and on your device.
      </p>
    </motion.div>
  );
}

/* ─── Result screen ─────────────────────────────────────────────── */
function ResultScreen({
  archetype,
  onContinue,
  onRetake,
}: {
  archetype: (typeof archetypes)[0];
  onContinue: () => void;
  onRetake: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="max-w-sm w-full mx-auto px-4 text-center"
    >
      <p className="text-xs text-muted/40 uppercase tracking-[0.15em] mb-5">
        Your Archetype
      </p>

      <div className="mb-6">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src="/harold-mascot.png"
            alt="Harold"
            width={120}
            height={120}
            className="mx-auto rounded-[28%] shadow-xl shadow-black/30 ring-1 ring-white/[0.06]"
          />
        </motion.div>
      </div>

      <h1
        className="font-serif text-3xl mb-1"
        style={{ color: "var(--accent)" }}
      >
        {archetype.icon} {archetype.name}
      </h1>
      <p className="text-xs text-muted/40 mb-6">
        Wellness baseline: {archetype.wellnessBaseline}%
      </p>

      <div className="p-5 rounded-2xl bg-surface border border-border mb-6 text-left space-y-3">
        <p className="text-sm leading-relaxed text-muted">
          {archetype.description}
        </p>
        <div className="pt-1 border-t border-border space-y-1.5">
          {archetype.keyTraits.slice(0, 3).map((trait) => (
            <div key={trait} className="flex items-start gap-2 text-xs text-muted/60">
              <span className="text-accent/60 mt-px flex-shrink-0">•</span>
              <span>{trait}</span>
            </div>
          ))}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        onClick={onContinue}
        className="w-full py-3.5 rounded-xl font-semibold text-sm bg-gradient-primary text-white shadow-lg shadow-accent/20 mb-4"
      >
        Meet Harold →
      </motion.button>

      <button
        onClick={onRetake}
        className="text-xs text-muted/30 hover:text-muted/60 transition-colors"
      >
        Retake quiz
      </button>
    </motion.div>
  );
}

/* ─── Main page ─────────────────────────────────────────────────── */
export default function OnboardingPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<"intro" | "questions" | "result">("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Responses>(() =>
    Object.fromEntries(questions.map((q) => [q.id, null]))
  );
  const [sensitivityMode, setSensitivityMode] = useState(false);
  const [resultArchetype, setResultArchetype] = useState<(typeof archetypes)[0] | null>(null);

  const currentQuestion = questions[currentIndex];

  const handleChange = useCallback(
    (value: string | string[] | number) => {
      setResponses((prev) => ({ ...prev, [currentQuestion.id]: value }));
    },
    [currentQuestion.id]
  );

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      return;
    }
    // Last question — calculate archetype
    const responseArr = buildResponseArray(responses);
    const result = calculateArchetypeScores(responseArr);
    const archetype =
      archetypes.find((a) => a.id === result.primaryArchetypeId) ?? archetypes[0];

    try {
      localStorage.setItem(
        "harold_profile",
        JSON.stringify({
          archetype: archetype.name,
          archetypeId: archetype.id,
          completedAt: new Date().toISOString(),
          scores: result.allScores,
        })
      );
    } catch {
      // localStorage unavailable — continue anyway
    }

    setResultArchetype(archetype);
    setPhase("result");
  }, [currentIndex, responses]);

  const handleBack = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  }, [currentIndex]);

  const handleRetake = useCallback(() => {
    setResponses(Object.fromEntries(questions.map((q) => [q.id, null])));
    setCurrentIndex(0);
    setResultArchetype(null);
    setPhase("questions");
  }, []);

  return (
    <div className="min-h-full bg-background flex flex-col">
      {/* Minimal header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Image
            src="/harold-mascot.png"
            alt="Harold"
            width={26}
            height={26}
            className="rounded-lg"
          />
          <span className="text-xs text-muted/40 font-medium">Harold &amp; Crew</span>
        </div>
        {phase === "questions" && (
          <button
            onClick={() => setSensitivityMode((m) => !m)}
            className="text-[10px] text-muted/30 hover:text-muted/50 transition-colors px-2 py-1"
          >
            {sensitivityMode ? "Sensitive: ON" : "Sensitive: OFF"}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center py-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          {phase === "intro" && (
            <motion.div key="intro" className="w-full">
              <IntroScreen
                sensitivityMode={sensitivityMode}
                onToggleSensitivity={() => setSensitivityMode((m) => !m)}
                onStart={() => setPhase("questions")}
              />
            </motion.div>
          )}

          {phase === "questions" && (
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="w-full"
            >
              <QuestionCard
                question={currentQuestion}
                sensitivityMode={sensitivityMode}
                value={responses[currentQuestion.id] ?? null}
                onChange={handleChange}
                onNext={handleNext}
                onBack={handleBack}
                isFirst={currentIndex === 0}
                isLast={currentIndex === questions.length - 1}
                currentIndex={currentIndex}
                totalQuestions={questions.length}
              />
            </motion.div>
          )}

          {phase === "result" && resultArchetype && (
            <motion.div key="result" className="w-full">
              <ResultScreen
                archetype={resultArchetype}
                onContinue={() => router.push("/hub")}
                onRetake={handleRetake}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

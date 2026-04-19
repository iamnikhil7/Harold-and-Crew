"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
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

/* ─── Header used across phases ─────────────────────────────── */
function OnboardingHeader({
  sensitivityMode,
  onToggleSensitivity,
  showSensitivityToggle,
}: {
  sensitivityMode: boolean;
  onToggleSensitivity: () => void;
  showSensitivityToggle: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-5 pt-14 pb-3 flex-shrink-0">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/harold-mascot.png"
          alt="Harold"
          width={28}
          height={28}
          className="rounded-full"
        />
        <span
          className="font-serif italic text-sm"
          style={{
            fontFamily: '"DM Serif Display", Georgia, serif',
            fontStyle: "italic",
            color: "var(--accent)",
          }}
        >
          Harold &amp; Crew
        </span>
      </Link>
      {showSensitivityToggle && (
        <button
          onClick={onToggleSensitivity}
          className="text-[10px] transition-colors px-2 py-1"
          style={{ color: "var(--muted-soft)" }}
        >
          {sensitivityMode ? "Sensitive: ON" : "Sensitive: OFF"}
        </button>
      )}
    </div>
  );
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
      className="text-center max-w-md mx-auto px-6"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="mb-6"
      >
        <Image
          src="/harold-mascot.png"
          alt="Harold"
          width={120}
          height={120}
          className="mx-auto rounded-[28%]"
          style={{ filter: "drop-shadow(0 18px 32px rgba(100,80,60,0.18))" }}
        />
      </motion.div>

      <h1
        className="font-serif italic mb-3"
        style={{
          fontFamily: '"DM Serif Display", Georgia, serif',
          fontStyle: "italic",
          color: "#2C2418",
          fontSize: "clamp(1.7rem, 5.5vw, 2.2rem)",
        }}
      >
        A few honest questions
      </h1>
      <p
        className="text-sm leading-relaxed mb-8 max-w-xs mx-auto"
        style={{ color: "var(--muted)" }}
      >
        This takes about 4 minutes. No wrong answers — just you, being honest
        with yourself.
      </p>

      <div
        className="mb-8 p-4 rounded-2xl text-left"
        style={{
          background: "rgba(255,255,255,0.7)",
          border: "1px solid rgba(180,165,140,0.25)",
        }}
      >
        <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>
          Would you prefer gentler phrasing for sensitive topics?
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => sensitivityMode && onToggleSensitivity()}
            className="flex-1 py-2 rounded-lg text-xs font-medium transition-all"
            style={{
              background: !sensitivityMode ? "#3D3529" : "rgba(255,255,255,0.8)",
              color: !sensitivityMode ? "#F5F0E8" : "var(--muted)",
            }}
          >
            Standard
          </button>
          <button
            onClick={() => !sensitivityMode && onToggleSensitivity()}
            className="flex-1 py-2 rounded-lg text-xs font-medium transition-all"
            style={{
              background: sensitivityMode ? "#3D3529" : "rgba(255,255,255,0.8)",
              color: sensitivityMode ? "#F5F0E8" : "var(--muted)",
            }}
          >
            Sensitive mode
          </button>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onStart}
        className="flex items-center justify-center gap-2 w-full py-4 rounded-full font-semibold text-sm"
        style={{
          background: "#3D3529",
          color: "#F5F0E8",
          boxShadow: "0 14px 34px rgba(61,53,41,0.25)",
        }}
      >
        Let&apos;s begin
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </motion.button>

      <p className="text-xs mt-4" style={{ color: "var(--muted-soft)" }}>
        Your answers stay private and on your device.
      </p>
    </motion.div>
  );
}

/* ─── Main page ─────────────────────────────────────────────────── */
export default function OnboardingPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<"intro" | "questions">("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Responses>(() =>
    Object.fromEntries(questions.map((q) => [q.id, null])),
  );
  const [sensitivityMode, setSensitivityMode] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleChange = useCallback(
    (value: string | string[] | number) => {
      setResponses((prev) => ({ ...prev, [currentQuestion.id]: value }));
    },
    [currentQuestion.id],
  );

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      return;
    }
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
        }),
      );
    } catch {}

    router.push("/connect-apps");
  }, [currentIndex, responses, router]);

  const handleBack = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  }, [currentIndex]);

  return (
    <div
      className="min-h-full flex flex-col"
      style={{ background: "var(--gradient-page)" }}
    >
      <OnboardingHeader
        sensitivityMode={sensitivityMode}
        onToggleSensitivity={() => setSensitivityMode((m) => !m)}
        showSensitivityToggle={phase === "questions"}
      />

      <div className="flex-1 flex items-start justify-center pt-2 pb-8 overflow-y-auto">
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
        </AnimatePresence>
      </div>

      {/* Harold peek at bottom while answering */}
      {phase === "questions" && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="pointer-events-none fixed bottom-3 right-4 z-20 opacity-80"
        >
          <Image
            src="/harold-mascot.png"
            alt="Harold"
            width={46}
            height={46}
            className="rounded-full"
          />
        </motion.div>
      )}
    </div>
  );
}

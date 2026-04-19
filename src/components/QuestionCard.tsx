"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { Question } from "@/lib/questions";

interface Props {
  question: Question;
  sensitivityMode: boolean;
  value: string | string[] | number | null;
  onChange: (value: string | string[] | number) => void;
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
  currentIndex: number;
  totalQuestions: number;
}

export default function QuestionCard({
  question,
  sensitivityMode,
  value,
  onChange,
  onNext,
  onBack,
  isFirst,
  isLast,
  currentIndex,
  totalQuestions,
}: Props) {
  const [animating, setAnimating] = useState(false);
  const [somethingElse, setSomethingElse] = useState("");
  const questionText = sensitivityMode ? question.sensitiveText : question.text;
  const isGrid = question.cardLayout === "grid";
  const isList = question.cardLayout === "list";

  useEffect(() => {
    setAnimating(true);
    setSomethingElse("");
    const t = setTimeout(() => setAnimating(false), 30);
    return () => clearTimeout(t);
  }, [question.id]);

  const isValid = () => {
    if (question.type === "multi_select")
      return Array.isArray(value) && value.length > 0;
    if (question.type === "slider") return true;
    if (somethingElse.trim().length > 0) return true;
    return value !== null && value !== undefined;
  };

  const commitSomethingElse = () => {
    if (somethingElse.trim()) onChange(`custom:${somethingElse.trim()}`);
  };

  const handleSelect = (val: string) => {
    if (question.type === "multi_select") {
      const current = Array.isArray(value) ? value : [];
      const already = current.includes(val);
      onChange(already ? current.filter((v) => v !== val) : [...current, val]);
      return;
    }
    onChange(val);
  };

  const handleNext = () => {
    if (somethingElse.trim()) commitSomethingElse();
    onNext();
  };

  const isMultiSelect = question.type === "multi_select";

  return (
    <div
      className={`w-full max-w-md mx-auto px-5 pb-6 transition-all duration-300 ${
        animating ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0"
      }`}
    >
      {/* Progress counter */}
      <div className="mb-3">
        <span className="text-xs font-medium" style={{ color: "var(--muted-soft)" }}>
          {currentIndex + 1}/{totalQuestions}
        </span>
      </div>

      {/* Question */}
      <h2
        className="font-serif italic leading-[1.15] mb-5"
        style={{
          fontFamily: '"DM Serif Display", Georgia, serif',
          fontStyle: "italic",
          color: "#2C2418",
          fontSize: "clamp(1.5rem, 6vw, 1.9rem)",
        }}
      >
        {questionText}
      </h2>

      {question.hint && (
        <p
          className="text-sm italic mb-5"
          style={{ color: "var(--muted-soft)" }}
        >
          {question.hint}
        </p>
      )}

      {/* IMAGE GRID (single choice with images) */}
      {question.type === "single_choice" && question.options && isGrid && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          {question.options.map((option) => {
            const selected = value === option.value;
            return (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`choice-card ${selected ? "is-selected" : ""}`}
                type="button"
              >
                {option.image ? (
                  <Image
                    src={option.image}
                    alt={option.label}
                    fill
                    sizes="(max-width: 480px) 50vw, 200px"
                    className="choice-card-img"
                  />
                ) : (
                  <div
                    className="choice-card-img"
                    style={{
                      background:
                        "linear-gradient(135deg, #C4AD8F 0%, #8B6F47 100%)",
                    }}
                  />
                )}
                <div className="choice-card-overlay" />
                <span className="choice-card-label">{option.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* MULTI-SELECT / TEXT LIST (no images) */}
      {(isMultiSelect || (question.type === "single_choice" && isList)) &&
        question.options && (
          <div className="grid grid-cols-2 gap-2.5 mb-4">
            {question.options.map((option) => {
              const selected = isMultiSelect
                ? Array.isArray(value) && value.includes(option.value)
                : value === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`choice-list-card ${selected ? "is-selected" : ""}`}
                  type="button"
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        )}

      {/* SLIDER */}
      {question.type === "slider" && (
        <div className="pt-4 pb-2 mb-4">
          <div className="relative mb-6">
            <input
              type="range"
              min={question.sliderMin}
              max={question.sliderMax}
              value={typeof value === "number" ? value : 50}
              onChange={(e) => onChange(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(90deg, var(--accent) 0%, var(--accent) ${
                  typeof value === "number" ? value : 50
                }%, rgba(139,111,71,0.15) ${
                  typeof value === "number" ? value : 50
                }%, rgba(139,111,71,0.15) 100%)`,
                accentColor: "var(--accent)",
              }}
            />
            <div
              className="absolute -top-8 transform -translate-x-1/2 font-serif text-2xl tabular-nums"
              style={{
                left: `${typeof value === "number" ? value : 50}%`,
                color: "var(--accent-deep)",
              }}
            >
              {typeof value === "number" ? value : 50}
            </div>
          </div>
          <div
            className="flex justify-between text-xs"
            style={{ color: "var(--muted-soft)" }}
          >
            <span>{question.sliderMinLabel}</span>
            <span>{question.sliderMaxLabel}</span>
          </div>
        </div>
      )}

      {/* "Something else" free-text input — only for choice questions */}
      {question.type !== "slider" && (
        <input
          type="text"
          value={somethingElse}
          onChange={(e) => setSomethingElse(e.target.value)}
          placeholder="Something else?"
          className="w-full px-4 py-3.5 mb-4 rounded-xl text-sm transition-colors"
          style={{
            background: "rgba(255,255,255,0.85)",
            border: "1px solid rgba(180,165,140,0.3)",
            color: "var(--foreground)",
          }}
        />
      )}

      {/* Navigation */}
      <div className="flex items-center gap-3">
        {!isFirst && (
          <button
            onClick={onBack}
            className="px-4 py-3 rounded-full text-sm transition-colors"
            style={{ color: "var(--muted-soft)" }}
          >
            Back
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={!isValid()}
          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-full text-sm font-semibold transition-all"
          style={{
            background: isValid() ? "#3D3529" : "rgba(61,53,41,0.3)",
            color: "#F5F0E8",
            boxShadow: isValid()
              ? "0 10px 28px rgba(61,53,41,0.22)"
              : "none",
            cursor: isValid() ? "pointer" : "not-allowed",
          }}
        >
          {isLast ? "Reveal Identity" : "Next"}
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
        </button>
      </div>
    </div>
  );
}

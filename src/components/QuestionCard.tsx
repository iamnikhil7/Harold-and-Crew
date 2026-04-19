"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import PillButton from "@/components/PillButton";
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
  isFirst: _isFirst,
  isLast,
  currentIndex,
  totalQuestions,
}: Props) {
  void _isFirst;
  const [somethingElse, setSomethingElse] = useState("");
  const questionText = sensitivityMode ? question.sensitiveText : question.text;
  const isGrid = question.cardLayout === "grid";
  const isList = question.cardLayout === "list";
  const isMultiSelect = question.type === "multi_select";

  useEffect(() => {
    setSomethingElse("");
  }, [question.id]);

  const isValid = () => {
    if (question.type === "multi_select")
      return Array.isArray(value) && value.length > 0;
    if (question.type === "slider") return true;
    if (somethingElse.trim().length > 0) return true;
    return value !== null && value !== undefined;
  };

  const handleSelect = (val: string) => {
    if (isMultiSelect) {
      const current = Array.isArray(value) ? value : [];
      onChange(
        current.includes(val)
          ? current.filter((v) => v !== val)
          : [...current, val],
      );
      return;
    }
    onChange(val);
  };

  const handleNext = () => {
    if (somethingElse.trim()) onChange(`custom:${somethingElse.trim()}`);
    onNext();
  };

  return (
    <div className="w-full max-w-md mx-auto px-5 pb-6">
      {/* Counter */}
      <p
        className="text-xs font-medium mb-2"
        style={{ color: "var(--muted-soft)" }}
      >
        {currentIndex + 1}/{totalQuestions}
      </p>

      {/* Question */}
      <h2
        className="leading-[1.15] mb-5"
        style={{
          fontFamily: '"DM Serif Display", Georgia, serif',
          fontStyle: "italic",
          color: "#2C2418",
          fontSize: "clamp(1.55rem, 6vw, 1.95rem)",
        }}
      >
        {questionText}
      </h2>

      {question.hint && (
        <p
          className="text-sm italic mb-4 -mt-2"
          style={{
            color: "var(--muted-soft)",
            fontFamily: '"DM Serif Display", Georgia, serif',
            fontStyle: "italic",
          }}
        >
          {question.hint}
        </p>
      )}

      {/* Image grid */}
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

      {/* Text list (multi-select or single-choice list) */}
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

      {/* Slider */}
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
              className="absolute -top-8 transform -translate-x-1/2 text-2xl tabular-nums"
              style={{
                left: `${typeof value === "number" ? value : 50}%`,
                color: "var(--accent-deep)",
                fontFamily: '"DM Serif Display", Georgia, serif',
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

      {/* Something else? */}
      {question.type !== "slider" && (
        <input
          type="text"
          value={somethingElse}
          onChange={(e) => setSomethingElse(e.target.value)}
          placeholder="Something else?"
          className="w-full px-4 py-3.5 mb-4 rounded-2xl text-sm"
          style={{
            background: "rgba(255,255,255,0.9)",
            border: "1px solid rgba(180,165,140,0.3)",
            color: "var(--foreground)",
          }}
        />
      )}

      <PillButton onClick={handleNext} disabled={!isValid()}>
        {isLast ? "Reveal Identity" : "Next"}
      </PillButton>
    </div>
  );
}

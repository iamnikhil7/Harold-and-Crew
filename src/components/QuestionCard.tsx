"use client";
import { useState, useEffect } from "react";
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

export default function QuestionCard({ question, sensitivityMode, value, onChange, onNext, onBack, isFirst, isLast, currentIndex, totalQuestions }: Props) {
  const [textValue, setTextValue] = useState("");
  const questionText = sensitivityMode ? question.sensitiveText : question.text;

  // Reset text value when question changes
  useEffect(() => {
    if (question.type === "open_text") {
      setTextValue(typeof value === "string" ? value : "");
    }
  }, [question.id, question.type, value]);

  const isValid = () => {
    if (question.type === "open_text") return textValue.trim().length >= 10;
    if (question.type === "multi_select") return Array.isArray(value) && value.length > 0;
    if (question.type === "slider") return true; // slider always has a value
    return value !== null && value !== undefined;
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-muted mb-2">
          <span>Question {currentIndex + 1} of {totalQuestions}</span>
          <span>{question.part === 1 ? "Who were you?" : "Who are you now?"}</span>
        </div>
        <div className="w-full h-1 bg-surface-light rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question text */}
      <h2 className="text-xl sm:text-2xl font-semibold leading-snug mb-6">{questionText}</h2>

      {/* Input */}
      <div className="mb-8">
        {question.type === "open_text" && (
          <div>
            <textarea
              key={question.id}
              value={textValue}
              onChange={(e) => { setTextValue(e.target.value); onChange(e.target.value); }}
              placeholder={question.placeholder}
              rows={4}
              className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-accent/30 resize-none transition-colors"
            />
            {textValue.trim().length < 10 && (
              <p className="text-xs text-muted mt-1.5">{10 - textValue.trim().length} more characters needed</p>
            )}
          </div>
        )}

        {question.type === "single_choice" && question.options && (
          <div className="space-y-2">
            {question.options.map((option) => (
              <button
                key={option.value}
                onClick={() => onChange(option.value)}
                className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all ${
                  value === option.value
                    ? "bg-accent/10 border-accent/30 text-foreground"
                    : "bg-surface border-white/5 text-muted hover:border-white/10 hover:text-foreground"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

        {question.type === "multi_select" && question.options && (
          <div className="space-y-2">
            {question.options.map((option) => {
              const selected = Array.isArray(value) && value.includes(option.value);
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    const current = Array.isArray(value) ? value : [];
                    onChange(selected ? current.filter((v) => v !== option.value) : [...current, option.value]);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all flex items-center gap-3 ${
                    selected
                      ? "bg-accent/10 border-accent/30 text-foreground"
                      : "bg-surface border-white/5 text-muted hover:border-white/10 hover:text-foreground"
                  }`}
                >
                  <span className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center text-[10px] ${
                    selected ? "bg-accent border-accent text-background" : "border-white/20"
                  }`}>
                    {selected ? "\u2713" : ""}
                  </span>
                  {option.label}
                </button>
              );
            })}
            <p className="text-xs text-muted mt-1">Select all that apply</p>
          </div>
        )}

        {question.type === "slider" && (
          <div className="space-y-3 pt-2">
            <input
              type="range"
              min={question.sliderMin}
              max={question.sliderMax}
              value={typeof value === "number" ? value : 50}
              onChange={(e) => onChange(Number(e.target.value))}
              className="w-full h-1.5 bg-surface-light rounded-full appearance-none cursor-pointer accent-accent"
            />
            <div className="flex justify-between text-xs text-muted">
              <span>{question.sliderMinLabel}</span>
              <span className="text-accent font-semibold text-base">{typeof value === "number" ? value : 50}</span>
              <span>{question.sliderMaxLabel}</span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        {!isFirst && (
          <button
            onClick={onBack}
            className="px-5 py-2.5 rounded-lg border border-white/10 text-sm text-muted hover:text-foreground hover:border-white/20 transition-colors"
          >
            Back
          </button>
        )}
        <button
          onClick={onNext}
          disabled={!isValid()}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
            isValid()
              ? "bg-accent text-background hover:bg-accent-soft"
              : "bg-surface-light text-muted/30 cursor-not-allowed"
          }`}
        >
          {isLast ? "See my results" : "Continue"}
        </button>
      </div>
    </div>
  );
}

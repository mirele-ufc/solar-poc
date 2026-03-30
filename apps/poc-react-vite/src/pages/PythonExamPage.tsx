import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchPythonExamQuestions,
  fetchOptionLabels,
  type Question,
} from "@/services/mocks/pythonExamMock";
import { useEnrollmentGuard } from "@/hooks/useEnrollmentGuard";

const TOTAL_SECONDS = 20 * 60; // 20 minutos

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60)
    .toString()
    .padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function PythonExamPage() {
  const navigate = useNavigate();
  useEnrollmentGuard("python");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [optionLabels, setOptionLabels] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const [submitted, setSubmitted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch exam data on mount
  useEffect(() => {
    const loadExamData = async () => {
      try {
        const [questionsData, labelsData] = await Promise.all([
          fetchPythonExamQuestions(),
          fetchOptionLabels(),
        ]);
        setQuestions(questionsData);
        setOptionLabels(labelsData);
      } catch (error) {
        console.error("Failed to load exam data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadExamData();
  }, []);

  // Countdown timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnswer = (questionId: string, optionIdx: number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleSubmit = (autoSubmit = false) => {
    if (submitted) return;
    setSubmitted(true);
    clearInterval(timerRef.current!);

    const finalAnswers = autoSubmit ? answers : answers;

    navigate("/courses/python/exam/results", {
      state: { answers: finalAnswers },
    });
  };

  const answeredCount = Object.keys(answers).length;
  const isUrgent = timeLeft <= 60;

  return (
    <div className="bg-white min-h-screen pb-[120px]">
      <div className="max-w-[900px] mx-auto px-[20px] md:px-[40px] pt-[24px] flex flex-col gap-[28px] w-full">
        {/* Header */}
        <div className="flex items-center justify-between gap-[12px] flex-wrap">
          <div>
            <p className="font-['Figtree:Regular',sans-serif] text-[#606060] text-[14px]">
              Python Iniciante — Módulo 01
            </p>
            <h1 className="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[24px] leading-[34px]">
              Prova 01
            </h1>
          </div>

          {/* Timer */}
          <div
            className={`flex items-center gap-[8px] px-[16px] h-[44px] rounded-[26px] border-2 shrink-0 ${
              isUrgent
                ? "border-[#de2e66] bg-[#fde8ef]"
                : "border-[#021b59] bg-[#f5f8ff]"
            }`}
            role="timer"
            aria-live="polite"
            aria-label={`Tempo restante: ${formatTime(timeLeft)}`}
          >
            <svg
              className="size-[18px] shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"
                fill={isUrgent ? "#de2e66" : "#021b59"}
              />
            </svg>
            <span
              className={`font-['Figtree:Bold',sans-serif] font-bold text-[18px] tabular-nums ${
                isUrgent ? "text-[#de2e66]" : "text-[#021b59]"
              }`}
            >
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {isLoading ? (
          <p className="text-center text-[#606060] py-[40px]">
            Carregando prova...
          </p>
        ) : (
          <>
            {/* Progress indicator */}
            <div className="flex items-center gap-[10px]">
              <div className="flex-1 h-[5px] bg-[#e0e0e0] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#042e99] rounded-full transition-all duration-300"
                  style={{
                    width: `${(answeredCount / questions.length) * 100}%`,
                  }}
                  aria-hidden="true"
                />
              </div>
              <span className="font-['Figtree:Regular',sans-serif] text-[#606060] text-[12px] shrink-0">
                {answeredCount}/{questions.length} respondidas
              </span>
            </div>

            {/* Questions */}
            <div className="flex flex-col gap-[32px]">
              {questions.map((q, qIdx) => {
                const selectedIdx = answers[q.id];
                return (
                  <fieldset key={q.id} className="flex flex-col gap-[14px]">
                    <legend className="font-['Figtree:Bold',sans-serif] font-bold text-black text-[18px] leading-[28px] mb-[4px]">
                      <span className="text-[#021b59]">
                        Questão {qIdx + 1} —{" "}
                      </span>
                      {q.text}
                    </legend>

                    <div
                      className="flex flex-col gap-[8px]"
                      role="radiogroup"
                      aria-labelledby={`q-${q.id}-label`}
                    >
                      {q.options.map((opt, idx) => {
                        const isSelected = selectedIdx === idx;
                        return (
                          <label
                            key={idx}
                            className={[
                              "flex items-center gap-[12px] px-[16px] py-[14px] rounded-[12px] border-2 cursor-pointer transition-colors",
                              isSelected
                                ? "border-[#042e99] bg-[#e8eeff]"
                                : "border-[#e0e0e0] bg-white hover:border-[#759BFB] hover:bg-[#f5f8ff]",
                            ].join(" ")}
                          >
                            <input
                              type="radio"
                              name={`question-${q.id}`}
                              value={idx}
                              checked={isSelected}
                              onChange={() => handleAnswer(q.id, idx)}
                              className="sr-only"
                              aria-label={`${optionLabels[idx]}) ${opt}`}
                            />
                            <div
                              className={[
                                "shrink-0 size-[22px] rounded-full border-2 flex items-center justify-center transition-colors",
                                isSelected
                                  ? "border-[#042e99] bg-[#042e99]"
                                  : "border-[#8e8e8e] bg-white",
                              ].join(" ")}
                              aria-hidden="true"
                            >
                              {isSelected && (
                                <div className="size-[8px] rounded-full bg-white" />
                              )}
                            </div>
                            <span
                              className={`font-['Figtree:Medium',sans-serif] font-medium text-[15px] shrink-0 ${isSelected ? "text-[#042e99]" : "text-[#021b59]"}`}
                            >
                              {optionLabels[idx]})
                            </span>
                            <span
                              className={`font-['Figtree:Regular',sans-serif] text-[15px] leading-[24px] flex-1 ${isSelected ? "text-[#021b59]" : "text-[#333]"}`}
                            >
                              {opt}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Sticky bottom: submit */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-[20px] py-[14px] shadow-[0px_-4px_12px_rgba(51,51,51,0.15)] flex justify-center z-10">
        <div className="w-full max-w-[900px] flex flex-col gap-[6px]">
          {answeredCount < questions.length && (
            <p className="font-['Figtree:Regular',sans-serif] text-[#606060] text-[13px] text-center">
              Responda todas as questões antes de finalizar ({answeredCount}/
              {questions.length})
            </p>
          )}
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={answeredCount < questions.length || submitted}
            className="bg-[#021b59] h-[50px] w-full rounded-[26px] cursor-pointer hover:bg-[#042e99] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#ffeac4] focus-visible:outline-offset-[2px] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="font-['Figtree:Medium',sans-serif] font-medium text-white text-[20px]">
              Finalizar prova
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

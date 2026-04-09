import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import type { CourseInfoData } from "./CreateCoursePage";
import type { ICourseManageModule } from "@ava-poc/types";
import { Modal } from "@/components/ui/modal";
import {
  confirmQuizForModuleWithBackend,
  createQuizForModuleWithBackend,
  generateQuizForModuleWithBackend,
  regenerateQuizForModuleWithBackend,
  type BackendGeneratedQuizResponse,
  type BackendQuizCreatePayload,
} from "@/services/quizService";
import { questionCreateFormSchema } from "@/validations/examSchema";
import { uploadFileSchema } from "@/validations/fileSchema";
import { useCreationStore } from "@/store/useCreationStore";

// ── SVG paths ─────────────────────────────────────────────────────────────────
const CLOSE_SM =
  "M10.657 12.071L5 6.414L6.414 5L12.071 10.657L17.728 5L19.142 6.414L13.485 12.071L19.142 17.728L17.728 19.142L12.071 13.485L6.414 19.142L5 17.728L10.657 12.071Z";
const CHECK = "M5 9L3 11L9 17L19 7L17 5L9 13L5 9Z";
const BLUE_CHECK = "M6 10L4 12L10 18L20 8L18 6L10 14L6 10Z";
const DOC =
  "M19.6667 5.66667H7.66667V27H23.6667V9.66667H19.6667V5.66667ZM7.66667 3H21L26.3333 8.33333V27C26.3333 27.7072 26.0524 28.3855 25.5523 28.8856C25.0522 29.3857 24.3739 29.6667 23.6667 29.6667H7.66667C6.95942 29.6667 6.28115 29.3857 5.78105 28.8856C5.28095 28.3855 5 27.7072 5 27V5.66667C5 4.95942 5.28095 4.28115 5.78105 3.78105C6.28115 3.28095 6.95942 3 7.66667 3ZM10.3333 15H21V17.6667H10.3333V15ZM10.3333 20.3333H21V23H10.3333V20.3333Z";
const ARROW =
  "M1.5275 2L6.5 6.96167L11.4725 2L13 3.5275L6.5 10.0275L0 3.5275L1.5275 2Z";
const EDIT_ICON =
  "M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z";

// ── Types ─────────────────────────────────────────────────────────────────────
type Option = { id: string; text: string };
type Question = {
  id: string;
  text: string;
  options: Option[];
  correctOptionId: string;
  points: number;
};

type ModuleWithBackendState = ICourseManageModule & {
  backendModuleId?: string;
};

type AiExamReviewState = {
  modId: string;
  backendModuleId: string;
  moduleName: string;
  questions: Question[];
  isLoading: boolean;
  isConfirming: boolean;
  errorMessage: string | null;
};

let _id = 1;
const uid = () => String(_id++);

function mapBackendGeneratedQuizToQuestions(
  quizData: BackendGeneratedQuizResponse,
): Question[] {
  const orderedQuestions = [...quizData.questions].sort(
    (firstQuestion, secondQuestion) =>
      firstQuestion.orderNum - secondQuestion.orderNum,
  );

  return orderedQuestions.map((question, questionIndex) => {
    const mappedOptions = question.alternatives.map(
      (alternative, optionIndex) => ({
        id:
          alternative.id !== null
            ? String(alternative.id)
            : `q-${questionIndex}-alt-${optionIndex}-${uid()}`,
        text: alternative.text,
      }),
    );

    const correctOptionIndex = question.alternatives.findIndex(
      (alternative) => alternative.correct,
    );

    return {
      id:
        question.id !== null
          ? String(question.id)
          : `question-${questionIndex}-${uid()}`,
      text: question.statement,
      options: mappedOptions,
      correctOptionId:
        correctOptionIndex >= 0
          ? (mappedOptions[correctOptionIndex]?.id ?? "")
          : "",
      points: question.points ?? 1,
    };
  });
}

function mapQuestionsToBackendQuizPayload(
  questions: Question[],
): BackendQuizCreatePayload {
  return {
    questions: questions.map((question) => ({
      statement: question.text.trim(),
      points: question.points,
      alternatives: question.options
        .filter((option) => option.text.trim())
        .map((option) => ({
          text: option.text.trim(),
          correct: option.id === question.correctOptionId,
        })),
    })),
  };
}

// ── Correct-answer dropdown ───────────────────────────────────────────────────
function CorrectAnswerDropdown({
  options,
  value,
  onChange,
}: {
  options: Option[];
  value: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const filled = options.filter((o) => o.text.trim());
  const selected = filled.find((o) => o.id === value);

  return (
    <div className="relative w-full">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Selecionar resposta correta"
        onClick={() => setOpen((v) => !v)}
        className="w-full h-[50px] border border-[#8e8e8e] rounded-[8px] flex items-center justify-between px-[16px] bg-white focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59] transition-colors hover:border-[#021b59]"
      >
        <span
          className={`font-['Figtree:Regular',sans-serif] text-[16px] ${selected ? "text-[#333]" : "text-[#8e8e8e]"}`}
        >
          {selected ? selected.text : "Selecione a resposta correta"}
        </span>
        <svg
          className="size-[13px] shrink-0 transition-transform"
          fill="none"
          viewBox="0 0 13 10.03"
          aria-hidden="true"
          style={{ transform: open ? "rotate(180deg)" : "none" }}
        >
          <path d={ARROW} fill="#021B59" />
        </svg>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <ul
            role="listbox"
            aria-label="Opções de resposta correta"
            className="absolute left-0 right-0 top-[52px] z-20 bg-white border border-[#8e8e8e] rounded-[8px] shadow-lg overflow-hidden"
          >
            {filled.length === 0 ? (
              <li className="px-[16px] py-[12px] text-[#8e8e8e] text-[15px] font-['Figtree:Regular',sans-serif]">
                Adicione alternativas primeiro
              </li>
            ) : (
              filled.map((opt, idx) => (
                <li key={opt.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={value === opt.id}
                    onClick={() => {
                      onChange(opt.id);
                      setOpen(false);
                    }}
                    className={`w-full text-left px-[16px] py-[12px] font-['Figtree:Regular',sans-serif] text-[16px] text-[#333] flex items-center gap-[10px] transition-colors ${value === opt.id ? "bg-[#ffeac4]" : "hover:bg-[#f5f5f5]"} focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59]`}
                  >
                    <span className="shrink-0 font-['Figtree:Medium',sans-serif] text-[#021b59]">
                      {String.fromCharCode(65 + idx)})
                    </span>
                    {opt.text}
                    {value === opt.id && (
                      <svg
                        className="size-[16px] ml-auto shrink-0"
                        fill="none"
                        viewBox="0 0 22 22"
                        aria-hidden="true"
                      >
                        <path
                          clipRule="evenodd"
                          d={CHECK}
                          fill="#021B59"
                          fillRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                </li>
              ))
            )}
          </ul>
        </>
      )}
    </div>
  );
}

// ── Perguntas tab ─────────────────────────────────────────────────────────────
function PerguntasTab({
  questionText,
  setQuestionText,
  options,
  setOptions,
  correctOptionId,
  setCorrectOptionId,
  points,
  setPoints,
  questions,
  removeQuestion,
  onAddQuestion,
  error,
}: {
  questionText: string;
  setQuestionText: (v: string) => void;
  options: Option[];
  setOptions: React.Dispatch<React.SetStateAction<Option[]>>;
  correctOptionId: string;
  setCorrectOptionId: (v: string) => void;
  points: number;
  setPoints: (v: number) => void;
  questions: Question[];
  removeQuestion: (id: string) => void;
  onAddQuestion: () => void;
  error: string;
}) {
  const addOption = () =>
    setOptions((prev) => [...prev, { id: uid(), text: "" }]);
  const removeOption = (id: string) => {
    setOptions((prev) => prev.filter((o) => o.id !== id));
    if (correctOptionId === id) setCorrectOptionId("");
  };
  const updateOption = (id: string, text: string) => {
    setOptions((prev) => prev.map((o) => (o.id === id ? { ...o, text } : o)));
    if (correctOptionId === id && !text.trim()) setCorrectOptionId("");
  };

  return (
    <div className="flex flex-col gap-[20px]">
      {/* Added questions */}
      {questions.length === 0 && (
        <div className="flex flex-col items-center gap-[12px] py-[40px] text-center bg-[#f5f8ff] rounded-[12px]">
          <p className="font-['Figtree:Medium',sans-serif] font-medium text-[#021b59] text-[16px]">
            Crie sua primeira prova
          </p>
          <p className="font-['Figtree:Regular',sans-serif] font-normal text-[#595959] text-[14px]">
            Adicione perguntas abaixo para compor a avaliação.
          </p>
        </div>
      )}
      {questions.map((q, idx) => (
        <div
          key={q.id}
          className="bg-[#c5d6ff] h-[56px] flex items-center justify-between px-[16px] rounded-[4px]"
        >
          <span className="font-['Figtree:Medium',sans-serif] font-medium text-black text-[18px] flex-1 min-w-0 truncate">
            Questão {String(idx + 1).padStart(2, "0")} — {q.text}
          </span>
          <button
            type="button"
            aria-label={`Remover questão ${idx + 1}`}
            onClick={() => removeQuestion(q.id)}
            className="size-[24px] shrink-0 ml-[8px] focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59] rounded"
          >
            <svg
              className="size-full"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                clipRule="evenodd"
                d={CLOSE_SM}
                fill="#801436"
                fillRule="evenodd"
              />
            </svg>
          </button>
        </div>
      ))}

      <div className="flex flex-col gap-[4px] w-full">
        <label
          htmlFor="q-text"
          className="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[20px] leading-[30px]"
        >
          Texto da pergunta
        </label>
        <input
          id="q-text"
          type="text"
          placeholder="Escreva sua pergunta"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          className="w-full border border-[#8e8e8e] h-[50px] rounded-[4px] px-[20px] font-['Figtree:Regular',sans-serif] text-[16px] text-[#333] placeholder-[#8e8e8e] bg-white focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59]"
        />
      </div>

      {/* Answer options */}
      <div className="flex flex-col gap-[8px]">
        <p className="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[18px]">
          Alternativas
        </p>
        {options.map((opt, idx) => (
          <div key={opt.id} className="flex items-center gap-[8px]">
            <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#021b59] text-[15px] shrink-0 w-[18px]">
              {String.fromCharCode(65 + idx)})
            </span>
            <input
              type="text"
              placeholder={`Alternativa ${String.fromCharCode(65 + idx)}`}
              value={opt.text}
              onChange={(e) => updateOption(opt.id, e.target.value)}
              aria-label={`Alternativa ${String.fromCharCode(65 + idx)}`}
              className="flex-1 min-w-0 border border-[#8e8e8e] h-[44px] rounded-[8px] px-[12px] font-['Figtree:Regular',sans-serif] text-[15px] text-[#333] placeholder-[#8e8e8e] bg-white focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59]"
            />
            {options.length > 2 && (
              <button
                type="button"
                aria-label="Remover alternativa"
                onClick={() => removeOption(opt.id)}
                className="shrink-0 size-[22px] focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59] rounded"
              >
                <svg
                  className="size-full"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    clipRule="evenodd"
                    d={CLOSE_SM}
                    fill="#801436"
                    fillRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addOption}
          className="text-left font-['Figtree:Regular',sans-serif] text-[#021b59] text-[15px] hover:underline focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59] rounded-sm self-start"
        >
          + Adicionar alternativa
        </button>
      </div>

      {/* Correct answer dropdown */}
      <div className="flex flex-col gap-[6px]">
        <p className="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[18px]">
          Resposta correta
        </p>
        <CorrectAnswerDropdown
          options={options}
          value={correctOptionId}
          onChange={setCorrectOptionId}
        />
      </div>

      {/* Points */}
      <div className="flex items-center justify-between gap-[12px]">
        <div className="flex items-center gap-[6px]">
          <svg
            className="size-[22px] shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              clipRule="evenodd"
              d={BLUE_CHECK}
              fill="#1E40C5"
              fillRule="evenodd"
            />
          </svg>
          <span
            className="font-['Anek_Devanagari:SemiBold',sans-serif] font-semibold text-[#1e40c5] text-[16px]"
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            Configure a questão: {points} ponto{points !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex items-center gap-[8px]">
          <button
            type="button"
            aria-label="Diminuir pontos"
            onClick={() => setPoints(Math.max(1, points - 1))}
            className="size-[28px] rounded-full border border-[#021b59] flex items-center justify-center hover:bg-[#021b59]/10 transition-colors focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59]"
          >
            <span className="text-[#021b59] text-[16px] leading-none">−</span>
          </button>
          <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[16px] w-[20px] text-center">
            {points}
          </span>
          <button
            type="button"
            aria-label="Aumentar pontos"
            onClick={() => setPoints(Math.min(10, points + 1))}
            className="size-[28px] rounded-full border border-[#021b59] flex items-center justify-center hover:bg-[#021b59]/10 transition-colors focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59]"
          >
            <span className="text-[#021b59] text-[16px] leading-none">+</span>
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <p
          role="alert"
          className="text-[#c0392b] text-[13px] font-['Figtree:Regular',sans-serif]"
        >
          {error}
        </p>
      )}

      {/* Add question button */}
      <button
        type="button"
        onClick={onAddQuestion}
        className="w-full border-2 border-[#021b59] rounded-[26px] h-[50px] flex items-center justify-center gap-[8px] cursor-pointer hover:bg-[#021b59]/5 transition-colors focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59]"
      >
        <svg
          className="size-[28px] shrink-0"
          fill="none"
          viewBox="0 0 32 32.6667"
          aria-hidden="true"
        >
          <path d={DOC} fill="#021B59" />
        </svg>
        <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[20px]">
          Adicionar pergunta
        </span>
      </button>
    </div>
  );
}

function AiGeneratedExamReviewModal({
  isOpen,
  moduleName,
  questions,
  isLoading,
  isConfirming,
  errorMessage,
  onClose,
  onRegenerate,
  onApprove,
}: {
  isOpen: boolean;
  moduleName: string;
  questions: Question[];
  isLoading: boolean;
  isConfirming: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onRegenerate: () => void;
  onApprove: () => void;
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      aria-labelledby="ai-exam-review-title"
      aria-describedby="ai-exam-review-description"
      className="w-full max-w-[900px] rounded-[20px] p-0 shadow-xl overflow-hidden"
      overlayClassName="px-[20px] bg-black/40"
    >
      <Modal.Body className="p-[24px] md:p-[28px]">
        <div className="flex items-start justify-between gap-[16px]">
          <div className="min-w-0">
            <h2
              id="ai-exam-review-title"
              className="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[24px] leading-[34px]"
            >
              Revisão da Prova Gerada por IA
            </h2>
            <p
              id="ai-exam-review-description"
              className="font-['Figtree:Regular',sans-serif] text-[#606060] text-[16px] leading-[24px] mt-[6px]"
            >
              Confira as questões e a indicação de resposta correta antes de
              aprovar.
            </p>
            <p className="font-['Figtree:Medium',sans-serif] text-[#021b59] text-[14px] mt-[8px]">
              {moduleName}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar revisão da prova gerada por IA"
            className="shrink-0 size-[28px] rounded-full flex items-center justify-center hover:bg-[#f5f5f5] transition-colors focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59]"
          >
            <svg
              className="size-[20px]"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                clipRule="evenodd"
                d={CLOSE_SM}
                fill="#801436"
                fillRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div className="my-[20px] h-px bg-[#e0e0e0]" />

        <div className="max-h-[560px] overflow-y-auto pr-[4px]">
          {isLoading ? (
            <div className="flex min-h-[320px] items-center justify-center">
              <p className="font-['Figtree:Medium',sans-serif] font-medium text-[#021b59] text-[18px] text-center">
                Gerando prova com IA...
              </p>
            </div>
          ) : errorMessage ? (
            <div className="flex min-h-[220px] items-center justify-center">
              <p className="font-['Figtree:Regular',sans-serif] text-[#c0392b] text-[16px] text-center max-w-[520px]">
                {errorMessage}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-[24px]">
              {questions.map((question, questionIndex) => (
                <fieldset
                  key={question.id}
                  className="flex flex-col gap-[12px] border-0 p-0 m-0"
                >
                  <legend className="font-['Figtree:Bold',sans-serif] font-bold text-black text-[18px] leading-[30px] mb-[4px]">
                    <span className="text-[#021b59]">
                      Questão {questionIndex + 1} —
                    </span>{" "}
                    {question.text}
                  </legend>

                  <div className="flex flex-col gap-[10px]">
                    {question.options.map((option, optionIndex) => {
                      const isCorrect = question.correctOptionId === option.id;

                      return (
                        <div
                          key={option.id}
                          className={[
                            "flex items-center gap-[12px] px-[16px] py-[14px] rounded-[12px] border-2 transition-colors",
                            isCorrect
                              ? "border-[#173fae] bg-[#eef3ff]"
                              : "border-[#d8d8d8] bg-white",
                          ].join(" ")}
                        >
                          <div
                            className={[
                              "shrink-0 size-[22px] rounded-full border-2 flex items-center justify-center transition-colors",
                              isCorrect
                                ? "border-[#173fae] bg-[#173fae]"
                                : "border-[#a0a0a0] bg-white",
                            ].join(" ")}
                            aria-hidden="true"
                          >
                            {isCorrect && (
                              <div className="size-[8px] rounded-full bg-white" />
                            )}
                          </div>

                          <span
                            className={[
                              "font-['Figtree:Medium',sans-serif] font-medium text-[15px] shrink-0",
                              isCorrect ? "text-[#173fae]" : "text-[#606060]",
                            ].join(" ")}
                          >
                            {String.fromCharCode(65 + optionIndex)})
                          </span>

                          <span
                            className={[
                              "font-['Figtree:Regular',sans-serif] text-[16px] leading-[24px] flex-1",
                              isCorrect ? "text-[#173fae]" : "text-[#333]",
                            ].join(" ")}
                          >
                            {option.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </fieldset>
              ))}
            </div>
          )}
        </div>

        {!isLoading && !errorMessage && questions.length > 0 && (
          <div className="mt-[20px] rounded-[10px] border border-[#53c57d] bg-[#effaf3] px-[16px] py-[12px]">
            <p className="font-['Figtree:Medium',sans-serif] font-medium text-[#16924d] text-[16px] leading-[24px]">
              ✓ Prova gerada com sucesso! Revise o conteúdo abaixo.
            </p>
          </div>
        )}

        <div className="mt-[16px] flex flex-col gap-[12px] sm:flex-row">
          <button
            type="button"
            onClick={onRegenerate}
            disabled={isLoading}
            className="h-[50px] flex-1 rounded-[26px] border-2 border-[#173fae] bg-white hover:bg-[#f5f8ff] transition-colors focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#173fae] text-[18px]">
              {isLoading ? "Gerando..." : "Regerar questões"}
            </span>
          </button>

          <button
            type="button"
            onClick={onApprove}
            disabled={
              isLoading ||
              isConfirming ||
              Boolean(errorMessage) ||
              questions.length === 0
            }
            className="h-[50px] flex-1 rounded-[26px] bg-[#021b59] hover:bg-[#042e99] transition-colors focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="font-['Figtree:Medium',sans-serif] font-medium text-white text-[18px]">
              {isConfirming ? "Aprovando..." : "Aprovar Prova"}
            </span>
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export function CreateExamPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get store access
  const {
    courseData: storedCourseData,
    modules: storedModules,
    setExam: saveExamToStore,
  } = useCreationStore();

  // Try to get data from store first, then location state
  const courseData = (storedCourseData ||
    location.state?.courseData ||
    {}) as CourseInfoData;
  const modules = (storedModules ||
    location.state?.modules ||
    []) as ModuleWithBackendState[];

  // View state: modules list OR exam editor
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingModId, setEditingModId] = useState<string | null>(null);

  // Question form
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState<Option[]>([
    { id: uid(), text: "" },
    { id: uid(), text: "" },
  ]);
  const [correctOptionId, setCorrectOptionId] = useState("");
  const [points, setPoints] = useState(1);
  const [formError, setFormError] = useState("");

  // Questions list for current editing session
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isSavingQuiz, setIsSavingQuiz] = useState(false);

  // Saved provas per module
  const [moduleProvas, setModuleProvas] = useState<Record<string, Question[]>>(
    {},
  );

  // State for modules (to allow removing lessons)
  const [modulesList, setModulesList] =
    useState<ModuleWithBackendState[]>(modules);

  // Inline lesson editing state
  const [editingLesson, setEditingLesson] = useState<{
    modId: string;
    lessonId: string;
    name: string;
    replaceFile?: boolean;
    fileName?: string;
  } | null>(null);

  const [aiExamReview, setAiExamReview] = useState<AiExamReviewState | null>(
    null,
  );

  useEffect(() => {
    setModulesList(modules);
  }, [modules]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const removeLesson = (modId: string, lessonId: string) => {
    setModulesList((prev) =>
      prev.map((m) =>
        m.id === modId
          ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) }
          : m,
      ),
    );
  };

  const removeModule = (modId: string) => {
    setModulesList((prev) => prev.filter((m) => m.id !== modId));
  };

  const editLesson = (modId: string, lessonId: string) => {
    const mod = modulesList.find((m) => m.id === modId);
    const lesson = mod?.lessons.find((l) => l.id === lessonId);
    if (lesson) setEditingLesson({ modId, lessonId, name: lesson.name });
  };

  const saveEditLesson = () => {
    if (!editingLesson) return;
    const trimmed = editingLesson.name.trim();
    if (!trimmed) return;
    setModulesList((prev) =>
      prev.map((m) =>
        m.id === editingLesson.modId
          ? {
              ...m,
              lessons: m.lessons.map((l) =>
                l.id === editingLesson.lessonId ? { ...l, name: trimmed } : l,
              ),
            }
          : m,
      ),
    );
    setEditingLesson(null);
  };

  const openAiExamReview = async (mod: ModuleWithBackendState) => {
    if (!mod.backendModuleId) {
      toast.error(
        "O módulo ainda não foi sincronizado com o backend. Tente novamente em instantes.",
      );
      return;
    }

    setAiExamReview({
      modId: mod.id,
      backendModuleId: mod.backendModuleId,
      moduleName: mod.name,
      questions: [],
      isLoading: true,
      isConfirming: false,
      errorMessage: null,
    });

    try {
      const generatedQuiz = await generateQuizForModuleWithBackend(
        mod.backendModuleId,
      );

      setAiExamReview({
        modId: mod.id,
        backendModuleId: mod.backendModuleId,
        moduleName: mod.name,
        questions: mapBackendGeneratedQuizToQuestions(generatedQuiz),
        isLoading: false,
        isConfirming: false,
        errorMessage: null,
      });
    } catch (apiError) {
      const err = apiError as { message?: string };
      const message =
        err.message || "Não foi possível gerar a prova com IA no momento.";

      setAiExamReview({
        modId: mod.id,
        backendModuleId: mod.backendModuleId,
        moduleName: mod.name,
        questions: [],
        isLoading: false,
        isConfirming: false,
        errorMessage: message,
      });
    }
  };

  const regenerateAiExamReview = async () => {
    if (!aiExamReview) {
      return;
    }

    setAiExamReview((prev) =>
      prev
        ? {
            ...prev,
            isLoading: true,
            errorMessage: null,
          }
        : null,
    );

    try {
      const generatedQuiz = await regenerateQuizForModuleWithBackend(
        aiExamReview.backendModuleId,
      );

      setAiExamReview((prev) =>
        prev
          ? {
              ...prev,
              questions: mapBackendGeneratedQuizToQuestions(generatedQuiz),
              isLoading: false,
              errorMessage: null,
            }
          : null,
      );
    } catch (apiError) {
      const err = apiError as { message?: string };
      const message =
        err.message || "Não foi possível regerar a prova com IA no momento.";

      setAiExamReview((prev) =>
        prev
          ? {
              ...prev,
              isLoading: false,
              errorMessage: message,
            }
          : null,
      );
    }
  };

  const approveAiExamReview = async () => {
    if (!aiExamReview || aiExamReview.questions.length === 0) {
      toast.error("Nenhuma questão gerada foi encontrada para aprovação.");
      return;
    }

    setAiExamReview((prev) =>
      prev
        ? {
            ...prev,
            isConfirming: true,
          }
        : null,
    );

    try {
      const confirmedQuiz = await confirmQuizForModuleWithBackend(
        aiExamReview.backendModuleId,
      );

      setModuleProvas((prev) => ({
        ...prev,
        [aiExamReview.modId]: mapBackendGeneratedQuizToQuestions({
          questions: confirmedQuiz.questions,
        }),
      }));
      setAiExamReview(null);
      toast.success("Prova gerada por IA confirmada e adicionada ao módulo.");
    } catch (apiError) {
      const err = apiError as { message?: string };
      toast.error(
        err.message || "Não foi possível confirmar a prova gerada por IA.",
      );

      setAiExamReview((prev) =>
        prev
          ? {
              ...prev,
              isConfirming: false,
            }
          : null,
      );
    }
  };

  const openEditor = (modId: string) => {
    const currentModule = modulesList.find((module) => module.id === modId);

    if (!currentModule?.backendModuleId) {
      toast.error(
        "O módulo ainda não foi sincronizado com o backend. Cadastre o módulo antes de adicionar a prova.",
      );
      return;
    }

    setEditingModId(modId);
    const existing = moduleProvas[modId] ?? [];
    setQuestions([...existing]);
    setQuestionText("");
    setOptions([
      { id: uid(), text: "" },
      { id: uid(), text: "" },
    ]);
    setCorrectOptionId("");
    setPoints(1);
    setFormError("");
    setEditorOpen(true);
  };

  const addQuestion = () => {
    const parsed = questionCreateFormSchema.safeParse({
      questionText,
      options,
      correctOptionId,
      points,
    });

    if (!parsed.success) {
      setFormError(
        parsed.error.issues[0]?.message ?? "Dados inválidos para a questão.",
      );
      return;
    }

    const filled = options.filter((o) => o.text.trim());
    setQuestions((prev) => [
      ...prev,
      {
        id: uid(),
        text: questionText.trim(),
        options: filled,
        correctOptionId,
        points,
      },
    ]);
    setQuestionText("");
    setOptions([
      { id: uid(), text: "" },
      { id: uid(), text: "" },
    ]);
    setCorrectOptionId("");
    setPoints(1);
    setFormError("");
  };

  const removeQuestion = (qId: string) =>
    setQuestions((prev) => prev.filter((q) => q.id !== qId));

  const finalizarEditor = async () => {
    if (!editingModId) {
      setEditorOpen(false);
      return;
    }

    const currentModule = modulesList.find(
      (module) => module.id === editingModId,
    );

    if (!currentModule?.backendModuleId) {
      toast.error("Não foi possível identificar o módulo da prova.");
      return;
    }

    if (questions.length === 0) {
      toast.error("Adicione ao menos uma pergunta antes de finalizar a prova.");
      return;
    }

    const alreadyHasQuiz = (moduleProvas[editingModId] ?? []).length > 0;

    if (alreadyHasQuiz) {
      setModuleProvas((prev) => ({ ...prev, [editingModId]: questions }));

      // Save exam to store
      saveExamToStore({
        questions: questions.map((q) => ({
          id: q.id,
          text: q.text,
          type: "multiple" as const,
          correctAnswer: q.correctOptionId,
          alternatives: q.options.map((o) => ({
            id: o.id,
            text: o.text,
          })),
          points: q.points,
        })),
      });

      setEditorOpen(false);
      setEditingModId(null);
      toast.success("Prova atualizada na tela com sucesso.");
      return;
    }

    setIsSavingQuiz(true);

    try {
      const createdQuiz = await createQuizForModuleWithBackend(
        currentModule.backendModuleId,
        mapQuestionsToBackendQuizPayload(questions),
      );

      const mappedQuestions = mapBackendGeneratedQuizToQuestions({
        questions: createdQuiz.questions,
      });

      setModuleProvas((prev) => ({
        ...prev,
        [editingModId]: mappedQuestions,
      }));

      // Save exam to store
      saveExamToStore({
        questions: mappedQuestions.map((q) => ({
          id: q.id,
          text: q.text,
          type: "multiple" as const,
          correctAnswer: q.correctOptionId,
          alternatives: q.options.map((o) => ({
            id: o.id,
            text: o.text,
          })),
          points: q.points,
        })),
      });

      setEditorOpen(false);
      setEditingModId(null);
      toast.success("Prova criada com sucesso para o módulo.");
    } catch (apiError) {
      const err = apiError as { message?: string };
      toast.error(err.message || "Não foi possível criar a prova do módulo.");
    } finally {
      setIsSavingQuiz(false);
    }
  };

  const removeProva = (modId: string) => {
    setModuleProvas((prev) => ({
      ...prev,
      [modId]: [],
    }));
  };

  // ── Editor view ─────────────────────────────────────────────────────────────
  if (editorOpen) {
    const mod = modulesList.find((m) => m.id === editingModId);
    return (
      <div className="bg-white flex flex-col min-h-[calc(100vh-70px)] pb-[90px]">
        <div className="max-w-[900px] mx-auto w-full px-[20px] md:px-[40px] pt-[20px] flex flex-col">
          {/* Module label */}
          <p className="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[18px] mb-[16px]">
            {mod?.name ?? "Módulo"} — Adicionar prova
          </p>

          <div className="py-[24px]">
            <PerguntasTab
              questionText={questionText}
              setQuestionText={setQuestionText}
              options={options}
              setOptions={setOptions}
              correctOptionId={correctOptionId}
              setCorrectOptionId={setCorrectOptionId}
              points={points}
              setPoints={setPoints}
              questions={questions}
              removeQuestion={removeQuestion}
              onAddQuestion={addQuestion}
              error={formError}
            />
          </div>
        </div>

        {/* Sticky Finalizar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white px-[20px] py-[16px] shadow-[0px_-4px_12px_rgba(51,51,51,0.2)] flex justify-center z-10">
          <div className="w-full max-w-[900px]">
            <button
              type="button"
              onClick={() => void finalizarEditor()}
              disabled={isSavingQuiz}
              className="bg-[#ffeac4] h-[50px] w-full rounded-[26px] cursor-pointer hover:bg-[#ffd9a0] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[20px]">
                {isSavingQuiz ? "Salvando prova..." : "Finalizar"}
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Modules list view ────────────────────────────────────────────────────────
  return (
    <div className="bg-white flex flex-col pb-[100px]">
      <div className="max-w-[900px] mx-auto flex flex-col gap-[20px] px-[20px] md:px-[40px] pt-[30px] w-full">
        <h1 className="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[22px] leading-[32px]">
          {courseData.title || "Novo Curso"} — Provas
        </h1>

        {modulesList.length === 0 ? (
          <div className="w-full rounded-[12px] bg-[#f5f8ff] px-[20px] py-[24px] text-center">
            <p className="font-['Figtree:Medium',sans-serif] font-medium text-[#021b59] text-[16px]">
              Nenhum módulo disponível para criar prova.
            </p>
            <p className="mt-[6px] font-['Figtree:Regular',sans-serif] text-[#595959] text-[14px]">
              Volte para a etapa anterior e adicione módulos reais ao curso.
            </p>
          </div>
        ) : (
          modulesList.map((mod) => {
            const prova = moduleProvas[mod.id] ?? [];
            return (
              <div
                key={mod.id}
                className="border border-black w-full rounded-[4px] overflow-hidden"
              >
                <div className="flex flex-col gap-[16px] p-[16px] pb-0">
                  {/* Module header with delete button */}
                  <div className="flex items-center justify-between gap-[8px]">
                    <p className="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[20px] leading-[30px] flex-1 min-w-0 truncate">
                      {mod.name}
                    </p>
                    <button
                      type="button"
                      aria-label={`Remover módulo ${mod.name}`}
                      onClick={() => removeModule(mod.id)}
                      className="shrink-0 size-[26px] focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59] rounded hover:opacity-70 transition-opacity"
                    >
                      <svg
                        className="size-full"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          clipRule="evenodd"
                          d={CLOSE_SM}
                          fill="#801436"
                          fillRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Lessons */}
                  {mod.lessons.map((l) => (
                    <div
                      key={l.id}
                      className="bg-[#c5d6ff] h-[60px] flex items-center justify-between px-[20px] rounded-[0px]"
                    >
                      <p className="font-['Figtree:Medium',sans-serif] font-medium text-black text-[20px] leading-[30px] flex-1 min-w-0 truncate">
                        {l.name}
                      </p>
                      <div className="flex items-center gap-[8px] shrink-0 ml-[8px]">
                        {/* Edit lesson */}
                        <button
                          type="button"
                          aria-label={`Editar ${l.name}`}
                          onClick={() => editLesson(mod.id, l.id)}
                          className="size-[24px] focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59] rounded hover:opacity-70 transition-opacity"
                        >
                          <svg
                            className="size-full"
                            fill="none"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path d={EDIT_ICON} fill="#021b59" />
                          </svg>
                        </button>
                        {/* Remove lesson */}
                        <button
                          type="button"
                          aria-label={`Remover ${l.name}`}
                          onClick={() => removeLesson(mod.id, l.id)}
                          className="size-[24px] focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59] rounded hover:opacity-70 transition-opacity"
                        >
                          <svg
                            className="size-full"
                            fill="none"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              clipRule="evenodd"
                              d={CLOSE_SM}
                              fill="#801436"
                              fillRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Prova do módulo */}
                  {prova.length > 0 && (
                    <div className="bg-[#c5d6ff] h-[60px] flex items-center justify-between px-[20px] mb-[20px]">
                      <p className="font-['Figtree:Medium',sans-serif] font-medium text-black text-[20px] leading-[30px] flex-1 min-w-0 truncate">
                        Prova 01
                      </p>
                      <button
                        type="button"
                        aria-label={`Remover prova do módulo ${mod.name}`}
                        onClick={() => removeProva(mod.id)}
                        className="shrink-0 size-[24px] ml-[8px] focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59] rounded"
                      >
                        <svg
                          className="size-full"
                          fill="none"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            clipRule="evenodd"
                            d={CLOSE_SM}
                            fill="#801436"
                            fillRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                {/* Ações de prova — dentro do card, lado a lado */}
                {prova.length === 0 && (
                  <div className="p-[16px]">
                    <div className="flex flex-col gap-[12px] sm:flex-row">
                      <button
                        type="button"
                        onClick={() => openEditor(mod.id)}
                        className="bg-[#ffeac4] h-[60px] w-full rounded-[26px] cursor-pointer hover:bg-[#ffd9a0] transition-colors focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59]"
                      >
                        <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[20px]">
                          Adicionar prova
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => openAiExamReview(mod)}
                        className="bg-[#ffeac4] h-[60px] w-full rounded-[26px] cursor-pointer hover:bg-[#ffd9a0] transition-colors focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59]"
                      >
                        <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[20px]">
                          Adicionar prova com IA
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Sticky Finalizar curso */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-[20px] py-[16px] shadow-[0px_-4px_12px_rgba(51,51,51,0.15)] flex justify-center z-10">
        <div className="w-full max-w-[900px]">
          <button
            type="button"
            onClick={() => navigate("/courses")}
            className="bg-[#ffeac4] h-[50px] w-full rounded-[26px] cursor-pointer hover:bg-[#ffd9a0] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59]"
          >
            <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[20px]">
              Finalizar curso
            </span>
          </button>
        </div>
      </div>

      <AiGeneratedExamReviewModal
        isOpen={Boolean(aiExamReview)}
        moduleName={aiExamReview?.moduleName ?? ""}
        questions={aiExamReview?.questions ?? []}
        isLoading={aiExamReview?.isLoading ?? false}
        isConfirming={aiExamReview?.isConfirming ?? false}
        errorMessage={aiExamReview?.errorMessage ?? null}
        onClose={() => setAiExamReview(null)}
        onRegenerate={regenerateAiExamReview}
        onApprove={approveAiExamReview}
      />

      {/* ── Edit lesson modal ── */}
      <Modal
        isOpen={Boolean(editingLesson)}
        onClose={() => setEditingLesson(null)}
        aria-labelledby="edit-lesson-title"
        className="w-full max-w-[400px] rounded-[12px] p-[24px] shadow-xl"
        overlayClassName="px-[20px]"
      >
        {editingLesson && (
          <Modal.Body className="flex flex-col gap-[20px]">
            <h2
              id="edit-lesson-title"
              className="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[20px] leading-[30px]"
            >
              Editar aula
            </h2>
            <div className="flex flex-col gap-[6px]">
              <label
                htmlFor="edit-lesson-name"
                className="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[16px]"
              >
                Nome da aula
              </label>
              <input
                id="edit-lesson-name"
                type="text"
                value={editingLesson.name}
                onChange={(e) =>
                  setEditingLesson((prev) =>
                    prev ? { ...prev, name: e.target.value } : null,
                  )
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveEditLesson();
                  if (e.key === "Escape") setEditingLesson(null);
                }}
                autoFocus
                className="w-full border border-[#8e8e8e] h-[50px] rounded-[12px] px-[16px] font-['Figtree:Regular',sans-serif] text-[16px] text-[#333] bg-white focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59]"
              />
            </div>

            {/* File upload section */}
            <div className="flex flex-col gap-[10px]">
              <p className="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[16px]">
                Arquivo da aula
              </p>
              <p className="font-['Figtree:Regular',sans-serif] text-[#606060] text-[14px] leading-[22px]">
                Deseja substituir o arquivo atual por um novo?
              </p>
              <EditLessonFileUpload
                value={editingLesson.replaceFile ?? false}
                fileName={editingLesson.fileName}
                onChange={(replaceFile, fileName) =>
                  setEditingLesson((prev) =>
                    prev ? { ...prev, replaceFile, fileName } : null,
                  )
                }
              />
            </div>

            <div className="flex gap-[12px]">
              <button
                type="button"
                onClick={() => setEditingLesson(null)}
                className="flex-1 h-[46px] border-2 border-[#021b59] rounded-[26px] font-['Figtree:Medium',sans-serif] font-medium text-[#021b59] text-[16px] hover:bg-[#021b59]/5 transition-colors focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={saveEditLesson}
                disabled={!editingLesson.name.trim()}
                className="flex-1 h-[46px] bg-[#021b59] rounded-[26px] font-['Figtree:Medium',sans-serif] font-medium text-[#ffeac4] text-[16px] hover:bg-[#042e99] transition-colors focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Salvar
              </button>
            </div>
          </Modal.Body>
        )}
      </Modal>
    </div>
  );
}

// ── File upload component for editing lessons ────────────────────────────────
function EditLessonFileUpload({
  value,
  fileName,
  onChange,
}: {
  value: boolean;
  fileName?: string;
  onChange: (replaceFile: boolean, fileName?: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      onChange(false);
      setFileError("");
      return;
    }

    const parsed = uploadFileSchema.safeParse(file);
    if (!parsed.success) {
      setFileError(parsed.error.issues[0]?.message ?? "Arquivo inválido");
      onChange(false);
      return;
    }

    setFileError("");
    onChange(true, file.name);
  };

  return (
    <div className="flex flex-col gap-[10px]">
      <label
        htmlFor="edit-lesson-file"
        className="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[16px]"
      >
        Selecione um arquivo
      </label>
      <input
        id="edit-lesson-file"
        type="file"
        accept="application/pdf,image/jpeg,image/png"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="bg-[#ffeac4] h-[40px] w-full rounded-[26px] cursor-pointer hover:bg-[#ffd9a0] transition-colors focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59]"
      >
        <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[16px]">
          {value ? "Substituir arquivo" : "Adicionar arquivo"}
        </span>
      </button>
      {fileName && (
        <p className="font-['Figtree:Regular',sans-serif] text-[#333] text-[14px] leading-[22px]">
          Arquivo selecionado: {fileName}
        </p>
      )}
      {fileError && (
        <p
          role="alert"
          className="font-['Figtree:Regular',sans-serif] text-[#c0392b] text-[14px] leading-[22px]"
        >
          {fileError}
        </p>
      )}
    </div>
  );
}

import { useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import type { CourseInfoData } from "./CreateCoursePage";
import { createQuestionSchema } from "@/validations/examSchema";
import { imageFileSchema, uploadFileSchema } from "@/validations/fileSchema";

// ── SVG paths ─────────────────────────────────────────────────────────────────
const CLOSE_SM =
  "M10.657 12.071L5 6.414L6.414 5L12.071 10.657L17.728 5L19.142 6.414L13.485 12.071L19.142 17.728L17.728 19.142L12.071 13.485L6.414 19.142L5 17.728L10.657 12.071Z";
const CLOSE_LG =
  "M12.4332 14.0828L5.83333 7.483L7.483 5.83333L14.0828 12.4332L20.6827 5.83333L22.3323 7.483L15.7325 14.0828L22.3323 20.6827L20.6827 22.3323L14.0828 15.7325L7.483 22.3323L5.83333 20.6827L12.4332 14.0828Z";
const CHECK = "M5 9L3 11L9 17L19 7L17 5L9 13L5 9Z";
const BLUE_CHECK = "M6 10L4 12L10 18L20 8L18 6L10 14L6 10Z";
const DOC =
  "M19.6667 5.66667H7.66667V27H23.6667V9.66667H19.6667V5.66667ZM7.66667 3H21L26.3333 8.33333V27C26.3333 27.7072 26.0524 28.3855 25.5523 28.8856C25.0522 29.3857 24.3739 29.6667 23.6667 29.6667H7.66667C6.95942 29.6667 6.28115 29.3857 5.78105 28.8856C5.28095 28.3855 5 27.7072 5 27V5.66667C5 4.95942 5.28095 4.28115 5.78105 3.78105C6.28115 3.28095 6.95942 3 7.66667 3ZM10.3333 15H21V17.6667H10.3333V15ZM10.3333 20.3333H21V23H10.3333V20.3333Z";
const IMG_ICON =
  "M19 15H29L33 19V33C33 33.5304 32.7893 34.0391 32.4142 34.4142C32.0391 34.7893 31.5304 35 31 35H19C18.4696 35 17.9609 34.7893 17.5858 34.4142C17.2107 34.0391 17 33.5304 17 33V17C17 16.4696 17.2107 15.9609 17.5858 15.5858C17.9609 15.2107 18.4696 15 19 15ZM28.172 17H19V33H31V19.828H28.172V17ZM28 27C27.7348 27 27.4804 26.8946 27.2929 26.7071C27.1054 26.5196 27 26.2652 27 26C27 25.7348 27.1054 25.4804 27.2929 25.2929C27.4804 25.1054 27.7348 25 28 25C28.2652 25 28.5196 25.1054 28.7071 25.2929C28.8946 25.4804 29 25.7348 29 26C29 26.2652 28.8946 26.5196 28.7071 26.7071C28.5196 26.8946 28.2652 27 28 27ZM21 29L24.07 26L27 29L28 28L29 29V31H21V29Z";
const ARROW =
  "M1.5275 2L6.5 6.96167L11.4725 2L13 3.5275L6.5 10.0275L0 3.5275L1.5275 2Z";
const EDIT_ICON =
  "M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z";

// ── Types ─────────────────────────────────────────────────────────────────────
type Tab = "Perguntas" | "Respostas" | "Configurações";
type Lesson = { id: string; name: string };
type ModuleData = { id: string; name: string; lessons: Lesson[] };
type Option = { id: string; text: string };
type Question = {
  id: string;
  text: string;
  options: Option[];
  correctOptionId: string;
  points: number;
};
type ConfigSettings = {
  wrongAnswers: boolean;
  rightAnswers: boolean;
  values: boolean;
};

let _id = 1;
const uid = () => String(_id++);

// ── Checkbox component (matches Figma design) ─────────────────────────────────
function FigmaCheckbox({
  checked,
  onChange,
  label,
  borderColor = "#ffeac4",
}: {
  checked: boolean;
  onChange: () => void;
  label?: string;
  borderColor?: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className="flex items-center gap-[10px] text-left focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59] rounded-sm"
    >
      <div
        className="size-[22px] rounded-[2px] flex items-center justify-center shrink-0 transition-colors"
        style={{
          border: `2px solid ${checked ? "#ffeac4" : borderColor}`,
          background: checked ? "#ffeac4" : "white",
        }}
      >
        {checked && (
          <svg
            className="size-[14px]"
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
      </div>
    </button>
  );
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

// ── Tab bar ───────────────────────────────────────────────────────────────────
const TABS: Tab[] = ["Perguntas", "Respostas", "Configurações"];

function TabBar({
  active,
  onChange,
}: {
  active: Tab;
  onChange: (t: Tab) => void;
}) {
  return (
    <div className="flex w-full border-b border-[#e0e0e0] shrink-0">
      {TABS.map((tab) => {
        const isActive = tab === active;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={`flex-1 flex flex-col items-center justify-between pt-[8px] focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59] transition-colors ${isActive ? "" : "justify-center py-[10px]"}`}
          >
            <span
              className="font-['Anek_Devanagari:SemiBold',sans-serif] font-semibold text-[18px] text-black leading-[normal] pb-[8px]"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              {tab}
            </span>
            {isActive && (
              <div className="w-full h-[3px] bg-[#efbbdc] shrink-0" />
            )}
          </button>
        );
      })}
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUploadError, setImageUploadError] = useState("");

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

      {/* Question text + image button */}
      <div className="flex gap-[16px] items-end w-full">
        <div className="flex-1 min-w-0 flex flex-col gap-[4px]">
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
        {/* Image upload circle */}
        <button
          type="button"
          aria-label="Adicionar imagem à questão"
          onClick={() => fileInputRef.current?.click()}
          className="shrink-0 size-[50px] rounded-full bg-[#ffeac4] flex items-center justify-center hover:bg-[#ffd9a0] transition-colors focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59]"
        >
          <svg
            className="size-[32px]"
            fill="none"
            viewBox="0 0 50 50"
            aria-hidden="true"
          >
            <path
              clipRule="evenodd"
              d={IMG_ICON}
              fill="black"
              fillRule="evenodd"
            />
          </svg>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png"
          className="hidden"
          aria-hidden="true"
          tabIndex={-1}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) {
              setImageUploadError("");
              return;
            }

            const parsed = imageFileSchema.safeParse(file);
            if (!parsed.success) {
              setImageUploadError(
                parsed.error.issues[0]?.message ?? "Arquivo inválido",
              );
              return;
            }

            setImageUploadError("");
          }}
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
      {imageUploadError && (
        <p
          role="alert"
          className="text-[#c0392b] text-[13px] font-['Figtree:Regular',sans-serif]"
        >
          {imageUploadError}
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

// ── Respostas tab (analytics view) ────────────────────────────────────────────
function RespostasTab({ questions }: { questions: Question[] }) {
  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-[40px] gap-[12px]">
        <p className="font-['Figtree:Regular',sans-serif] text-[#595959] text-[16px] text-center">
          Nenhuma pergunta adicionada ainda. As estatísticas de respostas dos
          alunos aparecerão aqui após a publicação.
        </p>
      </div>
    );
  }

  // Generate mock stats for each question based on number of options
  const getMockStats = (q: Question) => {
    const n = q.options.length;
    if (n === 0) return [];
    // Create randomish percentages that sum to 100
    const BASE_PCTS: Record<number, number[]> = {
      2: [60, 40],
      3: [45, 35, 20],
      4: [20, 15, 40, 25],
      5: [20, 15, 30, 20, 15],
    };
    return (BASE_PCTS[n] ?? [Math.round(100 / n)])
      .slice(0, n)
      .map((pct, i) => ({
        label: String.fromCharCode(65 + i),
        text: q.options[i]?.text ?? `Opção ${String.fromCharCode(65 + i)}`,
        pct,
      }));
  };

  return (
    <div className="flex flex-col gap-[28px]">
      {questions.map((q, idx) => {
        const stats = getMockStats(q);
        const total = 100; // mock total respondents
        return (
          <div key={q.id} className="flex flex-col gap-[10px]">
            <p className="font-['Figtree:Medium',sans-serif] font-medium text-black text-[20px] leading-[30px]">
              Questão {String(idx + 1).padStart(2, "0")}
            </p>
            {stats.map((s) => (
              <p
                key={s.label}
                className="font-['Figtree:Regular',sans-serif] text-[18px] leading-[28px]"
              >
                <span className="text-[#c0396b] font-['Figtree:Medium',sans-serif] font-medium">
                  {s.pct}%
                </span>{" "}
                responderam {s.label}
              </p>
            ))}
            <p className="font-['Figtree:Regular',sans-serif] text-[#333] text-[16px] leading-[24px] mt-[4px]">
              Total:{" "}
              <span className="text-[#c0396b] font-['Figtree:Medium',sans-serif] font-medium">
                {total} pessoas
              </span>{" "}
              responderam a questão
            </p>
          </div>
        );
      })}
    </div>
  );
}

// ── Configurações tab ─────────────────────────────────────────────────────────
function ConfiguracoesTab({
  config,
  setConfig,
}: {
  config: ConfigSettings;
  setConfig: React.Dispatch<React.SetStateAction<ConfigSettings>>;
}) {
  const items: { key: keyof ConfigSettings; title: string; desc: string }[] = [
    {
      key: "wrongAnswers",
      title: "Respostas erradas",
      desc: "Os participantes podem ver as perguntas que foram respondidas incorretamente.",
    },
    {
      key: "rightAnswers",
      title: "Respostas corretas",
      desc: "Os participantes podem ver as respostas corretas após a liberação das notas.",
    },
    {
      key: "values",
      title: "Valores",
      desc: "Os participantes podem ver a pontuação total e os pontos recebidos para cada pergunta.",
    },
  ];

  return (
    <div className="flex flex-col gap-[24px]">
      {items.map((item) => (
        <div key={item.key} className="flex gap-[12px] items-start">
          <div className="shrink-0 mt-[10px]">
            <FigmaCheckbox
              checked={config[item.key]}
              onChange={() =>
                setConfig((prev) => ({ ...prev, [item.key]: !prev[item.key] }))
              }
              label={item.title}
              borderColor="#021b59"
            />
          </div>
          <div className="flex flex-col gap-[8px] pt-[8px] flex-1 min-w-0">
            <p
              className="font-['Anek_Devanagari:SemiBold',sans-serif] font-semibold text-black leading-[normal] text-[18px]"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              {item.title}
            </p>
            <p
              className="font-['Anek_Devanagari:Regular',sans-serif] font-normal text-black leading-[normal] text-[16px]"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              {item.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export function CreateExamPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const courseData = (location.state?.courseData ?? {}) as CourseInfoData;
  const modules = (location.state?.modules ?? [
    {
      id: "m1",
      name: "Módulo 01",
      lessons: [
        { id: "l1", name: "Aula 01" },
        { id: "l2", name: "Aula 02" },
      ],
    },
    {
      id: "m2",
      name: "Módulo 02",
      lessons: [
        { id: "l3", name: "Aula 01" },
        { id: "l4", name: "Aula 02" },
      ],
    },
  ]) as ModuleData[];

  // View state: modules list OR exam editor
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingModId, setEditingModId] = useState<string | null>(null);

  // Tab state (inside editor)
  const [activeTab, setActiveTab] = useState<Tab>("Perguntas");

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

  // Saved provas per module
  const [moduleProvas, setModuleProvas] = useState<Record<string, Question[]>>(
    {},
  );

  // State for modules (to allow removing lessons)
  const [modulesList, setModulesList] = useState<ModuleData[]>(modules);

  // Inline lesson editing state
  const [editingLesson, setEditingLesson] = useState<{
    modId: string;
    lessonId: string;
    name: string;
    replaceFile?: boolean;
    fileName?: string;
  } | null>(null);

  // Config per module
  const [config, setConfig] = useState<ConfigSettings>({
    wrongAnswers: false,
    rightAnswers: false,
    values: false,
  });

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

  const openEditor = (modId: string) => {
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
    setActiveTab("Perguntas");
    setEditorOpen(true);
  };

  const addQuestion = () => {
    const parsed = createQuestionSchema.safeParse({
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

  const finalizarEditor = () => {
    if (editingModId) {
      setModuleProvas((prev) => ({ ...prev, [editingModId]: questions }));
    }
    setEditorOpen(false);
    setEditingModId(null);
  };

  const removeProvaItem = (modId: string, qId: string) => {
    setModuleProvas((prev) => ({
      ...prev,
      [modId]: (prev[modId] ?? []).filter((q) => q.id !== qId),
    }));
  };

  // ── Editor view ─────────────────────────────────────────────────────────────
  if (editorOpen) {
    const mod = modules.find((m) => m.id === editingModId);
    return (
      <div className="bg-white flex flex-col min-h-[calc(100vh-70px)] pb-[90px]">
        <div className="max-w-[900px] mx-auto w-full px-[20px] md:px-[40px] pt-[20px] flex flex-col">
          {/* Module label */}
          <p className="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[18px] mb-[16px]">
            {mod?.name ?? "Módulo"} — Adicionar prova
          </p>

          {/* Tab bar */}
          <TabBar active={activeTab} onChange={setActiveTab} />

          {/* Tab content */}
          <div className="py-[24px]">
            {activeTab === "Perguntas" && (
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
            )}
            {activeTab === "Respostas" && (
              <RespostasTab questions={questions} />
            )}
            {activeTab === "Configurações" && (
              <ConfiguracoesTab config={config} setConfig={setConfig} />
            )}
          </div>
        </div>

        {/* Sticky Finalizar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white px-[20px] py-[16px] shadow-[0px_-4px_12px_rgba(51,51,51,0.2)] flex justify-center z-10">
          <div className="w-full max-w-[900px]">
            <button
              type="button"
              onClick={finalizarEditor}
              className="bg-[#ffeac4] h-[50px] w-full rounded-[26px] cursor-pointer hover:bg-[#ffd9a0] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59]"
            >
              <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[20px]">
                Finalizar
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

        {modulesList.map((mod) => {
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

                {/* Prova questions */}
                {prova.map((q, idx) => (
                  <div
                    key={q.id}
                    className="bg-[#c5d6ff] h-[60px] flex items-center justify-between px-[20px]"
                  >
                    <p className="font-['Figtree:Medium',sans-serif] font-medium text-black text-[20px] leading-[30px] flex-1 min-w-0 truncate">
                      Prova {String(idx + 1).padStart(2, "0")} — {q.text}
                    </p>
                    <button
                      type="button"
                      aria-label={`Remover questão ${idx + 1}`}
                      onClick={() => removeProvaItem(mod.id, q.id)}
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
                ))}
              </div>

              {/* Adicionar prova button — inside card, bottom, rounded */}
              <div className="p-[16px]">
                <button
                  type="button"
                  onClick={() => openEditor(mod.id)}
                  className="bg-[#ffeac4] h-[60px] w-full rounded-[26px] cursor-pointer hover:bg-[#ffd9a0] transition-colors focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59]"
                >
                  <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[20px]">
                    {prova.length > 0 ? "Editar prova" : "Adicionar prova"}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
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

      {/* ── Edit lesson modal ── */}
      {editingLesson && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setEditingLesson(null)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-lesson-title"
            className="fixed inset-0 z-50 flex items-center justify-center px-[20px]"
          >
            <div className="bg-white w-full max-w-[400px] rounded-[12px] shadow-xl p-[24px] flex flex-col gap-[20px]">
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
            </div>
          </div>
        </>
      )}
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

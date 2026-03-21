import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { PROVA_QUESTIONS, OPTION_LABELS } from "../data/provaData";
import { PageHeader } from "@/components/shared/PageHeader";
import { useEnrollmentGuard } from "../hooks/useEnrollmentGuard";

const clockPath =
  "M12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22ZM20 12C20 9.87827 19.1571 7.84344 17.6569 6.34315C16.1566 4.84285 14.1217 4 12 4C9.87827 4 7.84344 4.84285 6.34315 6.34315C4.84285 7.84344 4 9.87827 4 12C4 14.1217 4.84285 16.1566 6.34315 17.6569C7.84344 19.1571 9.87827 20 12 20C14.1217 20 16.1566 19.1571 17.6569 17.6569C19.1571 16.1566 20 14.1217 20 12ZM16 11C16.2652 11 16.5196 11.1054 16.7071 11.2929C16.8946 11.4804 17 11.7348 17 12C17 12.2652 16.8946 12.5196 16.7071 12.7071C16.5196 12.8946 16.2652 13 16 13H13C11.9 13 11 12.1 11 11V7C11 6.73478 11.1054 6.48043 11.2929 6.29289C11.4804 6.10536 11.7348 6 12 6C12.2652 6 12.5196 6.10536 12.7071 6.29289C12.8946 6.48043 13 6.73478 13 7V11H16Z";

function formatTime(s: number) {
  const h = Math.floor(s / 3600).toString().padStart(2, "0");
  const m = Math.floor((s % 3600) / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${h}:${m}:${sec}`;
}

export function ProvaPage() {
  const navigate = useNavigate();
  useEnrollmentGuard("power-bi");

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(3600);
  const [timeAnnouncement, setTimeAnnouncement] = useState("");
  const announcedRef = useRef<Set<number>>(new Set());
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        const next = Math.max(0, t - 1);
        const milestones = [300, 60, 30];
        for (const ms of milestones) {
          if (next === ms && !announcedRef.current.has(ms)) {
            announcedRef.current.add(ms);
            const label =
              ms === 300 ? "5 minutos restantes" :
              ms === 60  ? "1 minuto restante" :
                           "30 segundos restantes";
            setTimeAnnouncement(label);
          }
        }
        if (next === 0) {
          clearInterval(timer);
          navigate("/cursos/power-bi/prova/resultado", { state: { answers } });
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (showConfirmModal && confirmButtonRef.current) {
      confirmButtonRef.current.focus();
    }
  }, [showConfirmModal]);

  useEffect(() => {
    if (!showConfirmModal) return;
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setShowConfirmModal(false);
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [showConfirmModal]);

  const answeredCount = Object.keys(answers).length;
  const totalCount = PROVA_QUESTIONS.length;
  const allAnswered = answeredCount === totalCount;

  function pick(questionId: string, optionIndex: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  }

  function handleSubmit() {
    if (!allAnswered) return;
    setShowConfirmModal(true);
  }

  function confirmSubmit() {
    navigate("/cursos/power-bi/prova/resultado", { state: { answers } });
  }

  function cancelSubmit() {
    setShowConfirmModal(false);
  }

  return (
    <div className="bg-white min-h-screen pb-[60px]">
      <div role="status" aria-live="assertive" aria-atomic="true" className="sr-only">
        {timeAnnouncement}
      </div>

      <div className="max-w-[900px] mx-auto flex flex-col gap-[28px] px-[20px] md:px-[40px] pt-[30px]">
        <PageHeader
          title="Prova 01"
          backPath="/cursos/power-bi/modulos/1"
          crumbs={[
            { label: "Cursos", path: "/cursos" },
            { label: "Power BI - Fundamentos", path: "/cursos/power-bi" },
            { label: "Módulos", path: "/cursos/power-bi/modulos" },
            { label: "Módulo 01", path: "/cursos/power-bi/modulos/1" },
            { label: "Prova 01" },
          ]}
        />

        <p
          className="font-['Anek_Devanagari:ExtraBold',sans-serif] font-extrabold leading-tight text-black"
          style={{ fontSize: "clamp(22px, 5vw, 34px)", fontVariationSettings: "'wdth' 100" }}
        >
          Power BI - Fundamentos
        </p>

        <div className="flex items-center justify-between border-b border-[#e0e0e0] pb-[16px]">
          <h2 className="font-['Figtree:Bold',sans-serif] font-bold text-black text-[26px] leading-tight">
            Prova 01
          </h2>
          <div
            className="flex items-center gap-[8px] bg-[#f5f5f5] px-[14px] py-[6px] rounded-[8px]"
            aria-live="off"
            aria-label={`Tempo restante: ${formatTime(timeLeft)}`}
          >
            <svg className="size-[20px] shrink-0" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <path clipRule="evenodd" d={clockPath} fill="#595959" fillRule="evenodd" />
            </svg>
            <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#595959] text-[17px] tabular-nums">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {PROVA_QUESTIONS.map((q, qIdx) => {
          const chosen = answers[q.id];
          const fieldsetId = `question-${q.id}-legend`;
          return (
            <fieldset key={q.id} className="flex flex-col gap-[14px] border-0 p-0 m-0">
              <legend className="float-left w-full">
                <div className="flex items-start justify-between gap-[12px]">
                  <div className="flex-1 min-w-0">
                    <p
                      id={fieldsetId}
                      className="font-['Figtree:Bold',sans-serif] font-bold text-black text-[20px] leading-tight mb-[6px]"
                    >
                      Questão {qIdx + 1}
                    </p>
                    <p className="font-['Figtree:Medium',sans-serif] font-medium text-black text-[17px] leading-[26px]">
                      {q.text}
                    </p>
                  </div>
                  <div className="shrink-0 bg-[#f5f5f5] px-[14px] py-[6px] rounded-[8px]">
                    <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#595959] text-[15px] whitespace-nowrap">
                      1,0 pt
                    </span>
                  </div>
                </div>
              </legend>

              <div className="flex flex-col gap-[8px] clear-both">
                {q.options.map((opt, idx) => {
                  const isSelected = chosen === idx;
                  const optId = `${q.id}-opt-${idx}`;
                  return (
                    <label
                      key={optId}
                      htmlFor={optId}
                      className={[
                        "flex items-center gap-[12px] w-full text-left py-[12px] px-[14px] rounded-[12px] border-2 transition-colors cursor-pointer",
                        "has-[:focus-visible]:outline has-[:focus-visible]:outline-[2px] has-[:focus-visible]:outline-[#021b59] has-[:focus-visible]:outline-offset-[2px]",
                        isSelected
                          ? "border-[#021b59] bg-[#ffeac4]"
                          : "border-[#d0d0d0] bg-white hover:bg-[#f5f5f5]",
                      ].join(" ")}
                    >
                      <input
                        id={optId}
                        type="radio"
                        name={q.id}
                        value={idx}
                        checked={isSelected}
                        onChange={() => pick(q.id, idx)}
                        className="sr-only"
                      />
                      <div
                        className={[
                          "shrink-0 size-[22px] border-2 rounded-[4px] flex items-center justify-center transition-colors",
                          isSelected ? "bg-[#ffeac4] border-[#021b59]" : "bg-white border-[#aaa]",
                        ].join(" ")}
                        aria-hidden="true"
                      >
                        {isSelected && (
                          <svg className="size-[13px]" fill="none" viewBox="0 0 22 22">
                            <path clipRule="evenodd" d="M5 9L3 11L9 17L19 7L17 5L9 13L5 9Z" fill="#021B59" fillRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className="font-['Figtree:Medium',sans-serif] font-medium text-[15px] text-[#021b59] shrink-0">
                        {OPTION_LABELS[idx]}
                      </span>
                      <span className="font-['Figtree:Regular',sans-serif] font-normal text-[16px] text-black leading-[24px] flex-1">
                        {opt}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          );
        })}

        <div className="pt-[8px]">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!allAnswered}
            className={[
              "h-[52px] w-full rounded-[26px] transition-colors",
              "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59]",
              allAnswered
                ? "bg-[#ffeac4] cursor-pointer hover:bg-[#ffd9a0]"
                : "bg-[#e0e0e0] cursor-not-allowed opacity-60",
            ].join(" ")}
          >
            <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[20px]">
              {allAnswered
                ? "Enviar"
                : `Responda todas as questões (${answeredCount}/${totalCount})`}
            </span>
          </button>
        </div>
      </div>

      {showConfirmModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40 px-[20px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
          aria-describedby="confirm-description"
          onClick={(e) => { if (e.target === e.currentTarget) cancelSubmit(); }}
        >
          <div className="bg-white rounded-[12px] w-full max-w-[460px] p-[28px] shadow-xl">
            <h2
              id="confirm-title"
              className="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[24px] leading-[36px] mb-[12px]"
            >
              Deseja finalizar a prova e enviar?
            </h2>
            <p
              id="confirm-description"
              className="font-['Figtree:Regular',sans-serif] font-normal text-[#333] text-[16px] leading-[24px] mb-[24px]"
            >
              Ao confirmar o envio, você não poderá alterar as respostas.
            </p>
            <div className="flex flex-col sm:flex-row gap-[12px] sm:gap-[16px]">
              <button
                type="button"
                onClick={cancelSubmit}
                className="h-[48px] flex-1 rounded-[26px] bg-white border-2 border-[#021b59] transition-colors hover:bg-[#f5f5f5] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59] focus-visible:outline-offset-[2px]"
              >
                <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#021b59] text-[18px]">
                  Cancelar
                </span>
              </button>
              <button
                ref={confirmButtonRef}
                type="button"
                onClick={confirmSubmit}
                className="h-[48px] flex-1 rounded-[26px] bg-[#021b59] transition-colors hover:bg-[#042e99] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59] focus-visible:outline-offset-[2px]"
              >
                <span className="font-['Figtree:Medium',sans-serif] font-medium text-white text-[18px]">
                  Enviar respostas
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

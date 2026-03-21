import { useNavigate, useLocation } from "react-router";
import { PROVA_QUESTIONS, OPTION_LABELS } from "../data/provaData";
import { useRef } from "react";
import { useEnrollmentGuard } from "../hooks/useEnrollmentGuard";

const checkSvg = (color: string) => (
  <svg className="size-[13px]" fill="none" viewBox="0 0 20 16">
    <path d="M1 7L7 13L19 1" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const xSvg = (color: string) => (
  <svg className="size-[11px]" fill="none" viewBox="0 0 14 14">
    <path d="M1 1L13 13M13 1L1 13" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

// ── Tela: TODAS corretas ───────────────────────────────────────────────────────
function CorrectScreen({ onReturn }: { onReturn: () => void }) {
  return (
    <div className="bg-white min-h-screen pb-[60px]">
      <div className="max-w-[900px] mx-auto flex flex-col items-center gap-[28px] px-[20px] md:px-[40px] pt-[40px]">

        {/* Estrelas */}
        <div className="flex items-end gap-[8px]" aria-hidden="true">
          {([18, 26, 18] as number[]).map((s, i) => (
            <svg key={i} width={s} height={s} viewBox="0 0 24 24" fill="#f5a623">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
        </div>

        {/* Círculo de pontuação */}
        <div
          className="flex flex-col items-center justify-center size-[160px] rounded-full bg-[#042e99] shadow-lg"
          aria-label="Resultado: 100%"
        >
          <span
            className="font-['Anek_Devanagari:ExtraBold',sans-serif] font-extrabold text-[#ffeac4]"
            style={{ fontSize: "42px", fontVariationSettings: "'wdth' 100", lineHeight: 1 }}
          >
            100%
          </span>
          <span className="font-['Figtree:Regular',sans-serif] text-[#ffeac4] text-[13px] mt-[6px]">
            {PROVA_QUESTIONS.length}/{PROVA_QUESTIONS.length} acertos
          </span>
        </div>

        {/* Mensagem */}
        <div className="flex flex-col items-center gap-[8px] text-center">
          <h1
            className="font-['Anek_Devanagari:ExtraBold',sans-serif] font-extrabold text-[#021b59] leading-tight"
            style={{ fontSize: "clamp(24px, 5vw, 34px)", fontVariationSettings: "'wdth' 100" }}
          >
            Parabéns! Prova concluída!
          </h1>
          <p className="font-['Figtree:Regular',sans-serif] text-[#595959] text-[16px] leading-[25px] max-w-[480px]">
            Você acertou todas as questões da Prova 01 — Power BI Fundamentos. Continue assim!
          </p>
        </div>

        {/* Gabarito — todas verdes */}
        <div className="flex flex-col gap-[16px] w-full">
          {PROVA_QUESTIONS.map((q, qIdx) => (
            <div key={q.id} className="border border-[#28a745] rounded-[12px] p-[16px] bg-[#f0faf3] flex flex-col gap-[10px]">
              <div className="flex items-start justify-between gap-[12px]">
                <div className="flex-1 min-w-0">
                  <p className="font-['Figtree:Bold',sans-serif] font-bold text-black text-[18px] leading-tight">
                    Questão {qIdx + 1}
                  </p>
                  <p className="font-['Figtree:Medium',sans-serif] font-medium text-black text-[16px] leading-[24px] mt-[4px]">
                    {q.text}
                  </p>
                </div>
                <span className="shrink-0 flex items-center gap-[5px] px-[10px] py-[4px] rounded-full bg-[#d4edda]">
                  {checkSvg("#155724")}
                  <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#155724] text-[13px] whitespace-nowrap">
                    Correto — 1,0 pt
                  </span>
                </span>
              </div>

              <div className="flex flex-col gap-[6px]">
                {q.options.map((opt, idx) => {
                  const isCorrect = idx === q.correctIndex;
                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-[10px] py-[10px] px-[12px] rounded-[10px] border-2 ${
                        isCorrect ? "bg-[#e8f8ee] border-[#28a745]" : "bg-white border-[#e0e0e0]"
                      }`}
                    >
                      <div
                        className={`shrink-0 size-[20px] border-2 rounded-[4px] flex items-center justify-center ${
                          isCorrect ? "bg-[#28a745] border-[#28a745]" : "bg-white border-[#ccc]"
                        }`}
                      >
                        {isCorrect && checkSvg("white")}
                      </div>
                      <span className="font-['Figtree:Medium',sans-serif] font-medium text-[15px] text-[#021b59] shrink-0">
                        {OPTION_LABELS[idx]})
                      </span>
                      <span className={`font-['Figtree:Regular',sans-serif] text-[15px] leading-[22px] flex-1 ${isCorrect ? "text-[#155724]" : "text-black"}`}>
                        {opt}
                      </span>
                      {isCorrect && (
                        <span className="shrink-0 text-[12px] font-['Figtree:Medium',sans-serif] text-[#155724] bg-[#d4edda] px-[8px] py-[2px] rounded-full whitespace-nowrap">
                          {/* ✓ decorativo — aria-hidden para leitores de tela */}
                          Correta <span aria-hidden="true">✓</span>
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onReturn}
          className="bg-[#042e99] h-[52px] w-full rounded-[26px] cursor-pointer hover:bg-[#021b59] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#ffeac4]"
        >
          <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#ffeac4] text-[20px]">
            Retornar ao curso
          </span>
        </button>
      </div>
    </div>
  );
}

// ── Tela: pelo menos 1 errada ─────────────────────────────────────────────────
function IncorrectScreen({
  answers,
  totalCorrect,
  onReturn,
}: {
  answers: Record<string, number>;
  totalCorrect: number;
  onReturn: () => void;
}) {
  const percentage = Math.round((totalCorrect / PROVA_QUESTIONS.length) * 100);

  return (
    <div className="bg-white min-h-screen pb-[60px]">
      <div className="max-w-[900px] mx-auto flex flex-col gap-[28px] px-[20px] md:px-[40px] pt-[30px]">

        <h1
          className="font-['Anek_Devanagari:ExtraBold',sans-serif] font-extrabold leading-tight text-black"
          style={{ fontSize: "clamp(22px, 5vw, 34px)", fontVariationSettings: "'wdth' 100" }}
        >
          Power BI - Fundamentos
        </h1>

        <h2 className="font-['Figtree:Bold',sans-serif] font-bold text-black text-[24px] leading-tight -mt-[16px]">
          Prova 01 — Resultado
        </h2>

        {/* Placar */}
        <div className="flex items-center justify-between px-[20px] py-[16px] rounded-[12px] bg-[#801436]">
          <p className="font-['Figtree:Bold',sans-serif] font-bold text-[#ffeac4] text-[18px]">Resultado</p>
          <p className="font-['Figtree:Bold',sans-serif] font-bold text-[#ffeac4] text-[18px]">
            {totalCorrect}/{PROVA_QUESTIONS.length} acertos ({percentage}%)
          </p>
        </div>

        {/* Por questão */}
        {PROVA_QUESTIONS.map((q, qIdx) => {
          const userIdx = answers[q.id]; // the index the student chose
          const isCorrect = userIdx === q.correctIndex;

          return (
            <div key={q.id} className="flex flex-col gap-[14px] border-b border-[#e0e0e0] pb-[28px]">
              {/* Cabeçalho */}
              <div className="flex items-start justify-between gap-[12px] flex-wrap">
                <div className="flex-1 min-w-0">
                  <p className="font-['Figtree:Bold',sans-serif] font-bold text-black text-[20px] leading-tight">
                    Questão {qIdx + 1}
                  </p>
                  <p className="font-['Figtree:Medium',sans-serif] font-medium text-black text-[16px] leading-[25px] mt-[4px]">
                    {q.text}
                  </p>
                </div>

                {isCorrect ? (
                  <span className="shrink-0 flex items-center gap-[5px] px-[10px] py-[5px] rounded-full bg-[#d4edda]">
                    {checkSvg("#155724")}
                    <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#155724] text-[13px] whitespace-nowrap">
                      Correto — 1,0 pt
                    </span>
                  </span>
                ) : (
                  <span className="shrink-0 flex items-center gap-[5px] px-[10px] py-[5px] rounded-full bg-[#f8d7da]">
                    {xSvg("#721c24")}
                    <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#721c24] text-[13px] whitespace-nowrap">
                      Incorreto — 0,0 pt
                    </span>
                  </span>
                )}
              </div>

              {/* Alternativas */}
              <div className="flex flex-col gap-[6px]">
                {q.options.map((opt, idx) => {
                  const isThisCorrect = idx === q.correctIndex;
                  const isUserWrong = idx === userIdx && !isThisCorrect;

                  let rowCls = "bg-white border-[#d0d0d0]";
                  let boxCls = "bg-white border-[#ccc]";
                  let textCls = "text-black";
                  let boxContent: React.ReactNode = null;
                  let tag: React.ReactNode = null;

                  if (isThisCorrect) {
                    rowCls = "bg-[#e8f8ee] border-[#28a745]";
                    boxCls = "bg-[#28a745] border-[#28a745]";
                    textCls = "text-[#155724]";
                    boxContent = checkSvg("white");
                    tag = (
                      <span className="shrink-0 text-[12px] font-['Figtree:Medium',sans-serif] text-[#155724] bg-[#d4edda] px-[8px] py-[2px] rounded-full whitespace-nowrap">
                        Correta <span aria-hidden="true">✓</span>
                      </span>
                    );
                  } else if (isUserWrong) {
                    rowCls = "bg-[#ffebee] border-[#e74c3c]";
                    boxCls = "bg-[#e74c3c] border-[#e74c3c]";
                    textCls = "text-[#c0392b]";
                    boxContent = xSvg("white");
                    tag = (
                      <span className="shrink-0 text-[12px] font-['Figtree:Medium',sans-serif] text-white bg-[#e74c3c] px-[8px] py-[2px] rounded-full whitespace-nowrap">
                        Sua resposta
                      </span>
                    );
                  }

                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-[12px] py-[11px] px-[14px] rounded-[12px] border-2 ${rowCls}`}
                    >
                      <div className={`shrink-0 size-[22px] border-2 rounded-[4px] flex items-center justify-center ${boxCls}`}>
                        {boxContent}
                      </div>
                      <span className="font-['Figtree:Medium',sans-serif] font-medium text-[15px] text-[#021b59] shrink-0">
                        {OPTION_LABELS[idx]})
                      </span>
                      <span className={`font-['Figtree:Regular',sans-serif] text-[15px] leading-[23px] flex-1 ${textCls}`}>
                        {opt}
                      </span>
                      {tag}
                    </div>
                  );
                })}
              </div>

              {/* Gabarito */}
              <div className="bg-[#f5f5f5] px-[16px] py-[10px] rounded-[8px]">
                <p className="font-['Figtree:Regular',sans-serif] text-black text-[15px] leading-[24px]">
                  <strong>Gabarito questão {qIdx + 1}:</strong>{" "}
                  {q.correctLabel}) {q.options[q.correctIndex]}
                </p>
              </div>
            </div>
          );
        })}

        <button
          type="button"
          onClick={onReturn}
          className="bg-[#ffeac4] h-[52px] w-full rounded-[26px] cursor-pointer hover:bg-[#ffd9a0] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59]"
        >
          <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[20px]">
            Retornar ao curso
          </span>
        </button>
      </div>
    </div>
  );
}

// ── Export principal ───────────────────────────────────────────────────────────
export function ProvaResultadoPage() {
  const navigate = useNavigate();
  useEnrollmentGuard("power-bi");
  const location = useLocation();

  // useRef garante que processamos as respostas apenas uma vez
  const processedRef = useRef<{
    normalizedAnswers: Record<string, number>;
    totalCorrect: number;
    allCorrect: boolean;
  } | null>(null);

  if (!processedRef.current) {
    // Recuperar respostas do state de navegação (preferível ao sessionStorage)
    let answers: Record<string, number> = location.state?.answers ?? {};

    // Fallback: sessionStorage caso o state não esteja disponível (ex: refresh)
    if (Object.keys(answers).length === 0) {
      const stored = sessionStorage.getItem("prova_answers");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // Validação básica: garantir que o valor é um objeto simples key→number
          if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
            answers = parsed as Record<string, number>;
          }
        } catch {
          // Falha silenciosa — não expor detalhes de erro ao usuário
        }
        // Limpar sessionStorage imediatamente após leitura
        sessionStorage.removeItem("prova_answers");
      }
    }

    // Garantir que os valores são números inteiros
    const normalized: Record<string, number> = {};
    Object.entries(answers).forEach(([key, value]) => {
      normalized[key] = typeof value === 'number' ? value : parseInt(String(value), 10);
    });

    const correct = PROVA_QUESTIONS.filter(
      (q) => normalized[q.id] === q.correctIndex
    ).length;

    const all = correct === PROVA_QUESTIONS.length;

    // Debug temporário - REMOVER após verificação
    console.log('=== DEBUG PROVA RESULTADO (PROCESSAMENTO ÚNICO) ===');
    console.log('Respostas recebidas:', answers);
    console.log('Respostas normalizadas:', normalized);
    console.log('Total de questões:', PROVA_QUESTIONS.length);
    console.log('Total de acertos:', correct);
    console.log('Todas corretas?', all);
    PROVA_QUESTIONS.forEach((q) => {
      const userAnswer = normalized[q.id];
      const correctIdx = q.correctIndex;
      const isCorrect = userAnswer === correctIdx;
      console.log(`Questão ${q.id}: usuário escolheu ${userAnswer}, correto é ${correctIdx}, acertou? ${isCorrect}`);
    });
    console.log('============================');

    processedRef.current = {
      normalizedAnswers: normalized,
      totalCorrect: correct,
      allCorrect: all,
    };
  }

  const { normalizedAnswers, totalCorrect, allCorrect } = processedRef.current;

  function handleReturn() {
    navigate("/cursos/power-bi/modulos");
  }

  if (allCorrect) {
    return <CorrectScreen onReturn={handleReturn} />;
  }

  return (
    <IncorrectScreen
      answers={normalizedAnswers}
      totalCorrect={totalCorrect}
      onReturn={handleReturn}
    />
  );
}
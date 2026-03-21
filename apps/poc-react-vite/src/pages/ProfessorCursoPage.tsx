import { useNavigate } from "react-router";
import { ImageWithFallback } from "@/components/shared/ImageWithFallback";

// ── Mock quiz response data ────────────────────────────────────────────────────
const mockStats = [
  {
    id: 1,
    question: "No Microsoft Power BI, qual é a principal função do Power Query?",
    total: 35,
    options: [
      { label: "A", text: "Criar dashboards interativos para apresentação final", pct: 15, correct: false },
      { label: "B", text: "Realizar tratamento, limpeza e transformação de dados", pct: 62, correct: true },
      { label: "C", text: "Publicar relatórios na nuvem", pct: 13, correct: false },
      { label: "D", text: "Criar gráficos avançados com animações", pct: 10, correct: false },
    ],
  },
  {
    id: 2,
    question: "Qual linguagem é utilizada no Power BI para criação de medidas e cálculos personalizados?",
    total: 35,
    options: [
      { label: "A", text: "SQL", pct: 8, correct: false },
      { label: "B", text: "Python", pct: 12, correct: false },
      { label: "C", text: "DAX", pct: 72, correct: true },
      { label: "D", text: "VBA", pct: 8, correct: false },
    ],
  },
];

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1759661966728-4a02e3c6ed91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080";

const editPath =
  "M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z";
const chartPath =
  "M9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17ZM19 19H5V5H19V19ZM19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z";

// ── Bar chart option row ───────────────────────────────────────────────────────
function OptionBar({
  label,
  text,
  pct,
  correct,
  total,
}: {
  label: string;
  text: string;
  pct: number;
  correct: boolean;
  total: number;
}) {
  const count = Math.round((pct / 100) * total);
  return (
    <div className={`flex flex-col gap-[4px] p-[12px] rounded-[12px] ${correct ? "bg-[#e6f9ee]" : "bg-[#f5f5f5]"}`}>
      <div className="flex items-center justify-between gap-[8px]">
        <div className="flex items-center gap-[8px] flex-1 min-w-0">
          <span
            className={`shrink-0 font-['Figtree:Medium',sans-serif] font-medium text-[15px] ${
              correct ? "text-[#155724]" : "text-[#021b59]"
            }`}
          >
            {label})
          </span>
          <span className="font-['Figtree:Regular',sans-serif] text-[14px] text-black flex-1 min-w-0 truncate">
            {text}
          </span>
          {correct && (
            <span className="shrink-0 text-[12px] font-['Figtree:Medium',sans-serif] font-medium text-[#155724] bg-[#d4edda] px-[8px] py-[2px] rounded-full">
              Correta
            </span>
          )}
        </div>
        <div className="shrink-0 flex items-center gap-[6px]">
          <span
            className={`font-['Figtree:Medium',sans-serif] font-medium text-[14px] ${
              correct ? "text-[#c0396b]" : "text-[#595959]"
            }`}
          >
            {pct}%
          </span>
          <span className="font-['Figtree:Regular',sans-serif] text-[12px] text-[#8e8e8e]">
            ({count})
          </span>
        </div>
      </div>
      {/* Progress bar */}
      <div className="w-full h-[6px] bg-white rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${correct ? "bg-[#28a745]" : "bg-[#8e8e8e]"}`}
          style={{ width: `${pct}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export function ProfessorCursoPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-white flex flex-col pb-[60px]">
      {/* Hero image */}
      <div className="w-full h-[200px] md:h-[280px] overflow-hidden">
        <ImageWithFallback
          alt="Power BI – dashboard interativo"
          className="w-full h-full object-cover"
          src={HERO_IMAGE}
        />
      </div>

      <div className="max-w-[900px] mx-auto flex flex-col gap-[28px] px-[20px] md:px-[40px] pt-[24px] w-full">

        {/* Course info */}
        <div className="flex flex-col gap-[4px]">
          <div className="flex items-start justify-between gap-[12px] flex-wrap">
            <h1 className="font-['Figtree:Bold',sans-serif] font-bold leading-[36px] text-black text-[24px]">
              Power BI - Fundamentos
            </h1>
            <span className="shrink-0 bg-[#e6f9ee] text-[#155724] text-[13px] font-['Figtree:Medium',sans-serif] font-medium px-[12px] py-[4px] rounded-full">
              Ativo
            </span>
          </div>
          <p className="font-['Figtree:Regular',sans-serif] text-[#595959] text-[15px]">
            Carga horária: 30h · 35 alunos inscritos
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-[12px]">
          {/* Editar curso */}
          <button
            type="button"
            onClick={() => navigate("/criar-curso/prova")}
            className="flex-1 flex items-center justify-center gap-[10px] h-[56px] bg-[#ffeac4] rounded-[26px] hover:bg-[#ffd9a0] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59] focus-visible:outline-offset-[2px]"
            aria-label="Editar módulos e aulas do curso"
          >
            <svg className="size-[20px] shrink-0" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <path d={editPath} fill="#333" />
            </svg>
            <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[18px]">
              Editar Curso
            </span>
          </button>

          {/* Back */}
          <button
            type="button"
            onClick={() => navigate("/mensagem")}
            className="flex-1 flex items-center justify-center h-[56px] border-2 border-[#021b59] rounded-[26px] hover:bg-[#021b59]/5 transition-colors focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59]"
          >
            <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#021b59] text-[18px]">Enviar comunicado</span>
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-[#e0e0e0]" />

        {/* Responses section */}
        <div className="flex flex-col gap-[20px]">
          <div className="flex items-center gap-[10px]">
            <svg className="size-[24px] shrink-0" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <path d={chartPath} fill="#021b59" />
            </svg>
            <h2 className="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[22px]">
              Respostas da Prova
            </h2>
          </div>

          <div className="bg-[#f5f5f5] rounded-[12px] px-[16px] py-[12px] flex flex-col sm:flex-row sm:items-center gap-[4px] sm:gap-[24px]">
            <p className="font-['Figtree:Regular',sans-serif] text-[#333] text-[15px]">
              <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#021b59] text-[17px]">35</span>{" "}
              alunos responderam a prova
            </p>
            <p className="font-['Figtree:Regular',sans-serif] text-[#333] text-[15px]">
              Média de acertos:{" "}
              <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#c0396b] text-[17px]">67%</span>
            </p>
          </div>

          {mockStats.map((q, idx) => (
            <div key={q.id} className="flex flex-col gap-[12px]">
              <div>
                <p className="font-['Figtree:Bold',sans-serif] font-bold text-black text-[18px]">
                  Questão {String(idx + 1).padStart(2, "0")}
                </p>
                <p className="font-['Figtree:Regular',sans-serif] text-[#595959] text-[15px] leading-[22px] mt-[2px]">
                  {q.question}
                </p>
              </div>
              <div className="flex flex-col gap-[6px]">
                {q.options.map((opt) => (
                  <OptionBar
                    key={opt.label}
                    label={opt.label}
                    text={opt.text}
                    pct={opt.pct}
                    correct={opt.correct}
                    total={q.total}
                  />
                ))}
              </div>
              <p className="font-['Figtree:Regular',sans-serif] text-[#8e8e8e] text-[13px]">
                Total:{" "}
                <span className="text-[#c0396b] font-['Figtree:Medium',sans-serif] font-medium">
                  {q.total} pessoas
                </span>{" "}
                responderam esta questão
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
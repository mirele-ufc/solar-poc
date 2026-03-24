import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { ImageWithFallback } from "@/components/shared/ImageWithFallback";
import { toast } from "sonner";

// ── SVG paths ─────────────────────────────────────────────────────────────────
const EDIT_PATH =
  "M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z";
const CLOSE_SM =
  "M10.657 12.071L5 6.414L6.414 5L12.071 10.657L17.728 5L19.142 6.414L13.485 12.071L19.142 17.728L17.728 19.142L12.071 13.485L6.414 19.142L5 17.728L10.657 12.071Z";
const CHART_PATH =
  "M9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17ZM19 19H5V5H19V19ZM19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z";
const PEOPLE_PATH =
  "M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z";
const ARROW_BACK =
  "M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z";
const DOWNLOAD_PATH =
  "M5 20H19V18H5V20ZM19 9H15V3H9V9H5L12 16L19 9Z";

// ── Types ─────────────────────────────────────────────────────────────────────
type Lesson = { id: string; name: string };
type Module = { id: string; name: string; lessons: Lesson[] };
type StudentStatus = "concluiu" | "em_andamento" | "parou" | "nao_acessou";
type Student = {
  id: string;
  name: string;
  email: string;
  progress: number;
  status: StudentStatus;
  lastAccess?: string;
  stoppedAt?: string;
};

// ── Mock participants ─────────────────────────────────────────────────────────
const MOCK_STUDENTS: Student[] = [
  { id: "p1",  name: "Ana Beatriz Lima",      email: "ana.lima@email.com",       progress: 100, status: "concluiu",     lastAccess: "12/03/2026" },
  { id: "p2",  name: "Carlos Eduardo Silva",  email: "carlos.silva@email.com",   progress: 55,  status: "em_andamento", lastAccess: "14/03/2026" },
  { id: "p3",  name: "Mariana Costa",         email: "mariana.costa@email.com",  progress: 100, status: "concluiu",     lastAccess: "10/03/2026" },
  { id: "p4",  name: "Lucas Pereira",         email: "lucas.pereira@email.com",  progress: 20,  status: "parou",        lastAccess: "28/02/2026", stoppedAt: "Módulo 01 — Aula 02" },
  { id: "p5",  name: "Fernanda Rocha",        email: "fernanda.rocha@email.com", progress: 70,  status: "em_andamento", lastAccess: "15/03/2026" },
  { id: "p6",  name: "Pedro Alves",           email: "pedro.alves@email.com",    progress: 0,   status: "nao_acessou",  lastAccess: "—" },
  { id: "p7",  name: "Juliana Mendes",        email: "juliana.mendes@email.com", progress: 100, status: "concluiu",     lastAccess: "09/03/2026" },
  { id: "p8",  name: "Rafael Torres",         email: "rafael.torres@email.com",  progress: 35,  status: "parou",        lastAccess: "05/03/2026", stoppedAt: "Módulo 02 — Aula 01" },
  { id: "p9",  name: "Camila Souza",          email: "camila.souza@email.com",   progress: 0,   status: "nao_acessou",  lastAccess: "—" },
  { id: "p10", name: "Bruno Lopes",           email: "bruno.lopes@email.com",    progress: 85,  status: "em_andamento", lastAccess: "16/03/2026" },
];

// ── Mock course data ───────────────────────────────────────────────────────────
const COURSE_DATA: Record<
  string,
  { title: string; hours: string; students: number; image: string; modules: Module[]; avgScore: number }
> = {
  "power-bi": {
    title: "Power BI - Fundamentos",
    hours: "30h",
    students: 35,
    avgScore: 72,
    image:
      "https://images.unsplash.com/photo-1759661966728-4a02e3c6ed91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    modules: [
      {
        id: "m1",
        name: "Módulo 01 — Introdução ao Power BI",
        lessons: [
          { id: "l1", name: "Aula 01 — O que é Power BI?" },
          { id: "l2", name: "Aula 02 — Interface do Power BI Desktop" },
        ],
      },
      {
        id: "m2",
        name: "Módulo 02 — Power Query",
        lessons: [
          { id: "l3", name: "Aula 01 — Importando dados" },
          { id: "l4", name: "Aula 02 — Transformações básicas" },
        ],
      },
      {
        id: "m3",
        name: "Módulo 03 — DAX",
        lessons: [
          { id: "l5", name: "Aula 01 — Medidas e colunas calculadas" },
          { id: "l6", name: "Aula 02 — Funções de inteligência de tempo" },
        ],
      },
    ],
  },
  python: {
    title: "Python Iniciante",
    hours: "24h",
    students: 28,
    avgScore: 68,
    image:
      "https://images.unsplash.com/photo-1624953587687-daf255b6b80a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    modules: [
      {
        id: "m1",
        name: "Módulo 01 — Fundamentos",
        lessons: [
          { id: "l1", name: "Aula 01 — Variáveis e tipos" },
          { id: "l2", name: "Aula 02 — Estruturas de controle" },
        ],
      },
      {
        id: "m2",
        name: "Módulo 02 — Funções",
        lessons: [
          { id: "l3", name: "Aula 01 — Definindo funções" },
          { id: "l4", name: "Aula 02 — Escopo e recursão" },
        ],
      },
    ],
  },
  matematica: {
    title: "Matemática básica",
    hours: "36h",
    students: 42,
    avgScore: 61,
    image:
      "https://images.unsplash.com/photo-1747654804155-ffd62d5dfb51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    modules: [
      {
        id: "m1",
        name: "Módulo 01 — Aritmética",
        lessons: [
          { id: "l1", name: "Aula 01 — Operações básicas" },
          { id: "l2", name: "Aula 02 — Frações e decimais" },
        ],
      },
      {
        id: "m2",
        name: "Módulo 02 — Álgebra",
        lessons: [
          { id: "l3", name: "Aula 01 — Equações do 1º grau" },
          { id: "l4", name: "Aula 02 — Equações do 2º grau" },
        ],
      },
    ],
  },
};

// ── Mock prova responses per module ──────────────────────────────────────────
const MOCK_PROVA_RESPONSES: Record<
  string,
  {
    total: number;
    avgPct: number;
    questions: {
      id: string;
      text: string;
      options: { label: string; text: string; pct: number; correct: boolean }[];
    }[];
  }
> = {
  m1: {
    total: 30,
    avgPct: 72,
    questions: [
      {
        id: "q1",
        text: "Qual é a principal função do Power Query?",
        options: [
          { label: "A", text: "Criar dashboards", pct: 15, correct: false },
          { label: "B", text: "Tratamento e transformação de dados", pct: 62, correct: true },
          { label: "C", text: "Publicar relatórios", pct: 13, correct: false },
          { label: "D", text: "Criar animações", pct: 10, correct: false },
        ],
      },
    ],
  },
  m2: {
    total: 28,
    avgPct: 65,
    questions: [
      {
        id: "q1",
        text: "Qual linguagem é utilizada para medidas no Power BI?",
        options: [
          { label: "A", text: "SQL", pct: 8, correct: false },
          { label: "B", text: "Python", pct: 12, correct: false },
          { label: "C", text: "DAX", pct: 72, correct: true },
          { label: "D", text: "VBA", pct: 8, correct: false },
        ],
      },
    ],
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const STATUS_META: Record<StudentStatus, { label: string; color: string; bg: string; dotColor: string }> = {
  concluiu:     { label: "Concluiu",      color: "#155724", bg: "#e6f9ee", dotColor: "#28a745" },
  em_andamento: { label: "Em andamento",  color: "#021b59", bg: "#c5d6ff", dotColor: "#0643de" },
  parou:        { label: "Parou",         color: "#801436", bg: "#fde8ef", dotColor: "#de2e66" },
  nao_acessou:  { label: "Não acessou",   color: "#606060", bg: "#f0f0f0", dotColor: "#8e8e8e" },
};

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({
  value,
  label,
  sub,
  color,
  bg,
}: {
  value: number | string;
  label: string;
  sub?: string;
  color: string;
  bg: string;
}) {
  return (
    <div className="flex flex-col gap-[6px] rounded-[12px] px-[16px] py-[14px]" style={{ background: bg }}>
      <p className="font-['Figtree:Bold',sans-serif] font-bold text-[28px] leading-[36px]" style={{ color }}>
        {value}
      </p>
      <p className="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[14px] leading-[20px]">{label}</p>
      {sub && <p className="font-['Figtree:Regular',sans-serif] text-[#8e8e8e] text-[12px]">{sub}</p>}
    </div>
  );
}

// ── Edit Lesson Modal ─────────────────────────────────────────────────────────
function EditLessonModal({
  lessonName,
  onSave,
  onClose,
}: {
  lessonName: string;
  onSave: (name: string, replaceFile: boolean, fileName?: string) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(lessonName);
  const [replaceFile, setReplaceFile] = useState(false);
  const [fileName, setFileName] = useState<string | undefined>();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name.trim(), replaceFile, fileName);
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-lesson-dlg-title"
        className="fixed inset-0 z-50 flex items-center justify-center px-[20px]"
      >
        <div className="bg-white w-full max-w-[400px] rounded-[12px] shadow-xl p-[24px] flex flex-col gap-[20px]">
          <h2
            id="edit-lesson-dlg-title"
            className="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[20px] leading-[30px]"
          >
            Editar aula
          </h2>

          <div className="flex flex-col gap-[6px]">
            <label
              htmlFor="dlg-lesson-name"
              className="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[16px]"
            >
              Nome da aula
            </label>
            <input
              id="dlg-lesson-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") onClose();
              }}
              autoFocus
              className="w-full border border-[#8e8e8e] h-[50px] rounded-[12px] px-[16px] font-['Figtree:Regular',sans-serif] text-[16px] text-[#333] bg-white focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59]"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <p className="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[16px]">
              Arquivo da aula
            </p>
            <p className="font-['Figtree:Regular',sans-serif] text-[#606060] text-[14px] leading-[22px]">
              Deseja substituir o arquivo atual por um novo?
            </p>
            <input
              ref={fileRef}
              type="file"
              accept="application/pdf,video/*,image/*"
              className="hidden"
              aria-hidden="true"
              tabIndex={-1}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  setReplaceFile(true);
                  setFileName(f.name);
                }
              }}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full h-[40px] bg-[#ffeac4] rounded-[26px] hover:bg-[#ffd9a0] transition-colors focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59] font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[15px]"
            >
              {replaceFile ? "Substituir arquivo" : "Selecionar novo arquivo"}
            </button>
            {fileName && (
              <p className="font-['Figtree:Regular',sans-serif] text-[#333] text-[13px]">
                Selecionado:{" "}
                <span className="font-['Figtree:Medium',sans-serif] font-medium">{fileName}</span>
              </p>
            )}
          </div>

          <div className="flex gap-[12px]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-[46px] border-2 border-[#021b59] rounded-[26px] font-['Figtree:Medium',sans-serif] font-medium text-[#021b59] text-[16px] hover:bg-[#021b59]/5 transition-colors focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59]"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!name.trim()}
              className="flex-1 h-[46px] bg-[#021b59] rounded-[26px] font-['Figtree:Medium',sans-serif] font-medium text-[#ffeac4] text-[16px] hover:bg-[#042e99] transition-colors focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Participants Panel ────────────────────────────────────────────────────────
function ParticipantsPanel({ onClose }: { onClose: () => void }) {
  const [filter, setFilter] = useState<StudentStatus | "todos">("todos");
  const filtered = filter === "todos" ? MOCK_STUDENTS : MOCK_STUDENTS.filter((s) => s.status === filter);

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="participants-title"
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:px-[20px]"
      >
        <div className="bg-white w-full sm:max-w-[520px] rounded-t-[16px] sm:rounded-[12px] shadow-xl flex flex-col max-h-[85vh]">
          <div className="flex items-center justify-between px-[20px] py-[16px] border-b border-[#e0e0e0] shrink-0">
            <h2
              id="participants-title"
              className="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[20px]"
            >
              Participantes ({MOCK_STUDENTS.length})
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="size-[44px] flex items-center justify-center rounded focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59] hover:opacity-70"
            >
              <svg className="size-[20px]" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <path clipRule="evenodd" d={CLOSE_SM} fill="#333" fillRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-[8px] px-[20px] pt-[12px] pb-[8px] overflow-x-auto no-scrollbar shrink-0">
            {(["todos", "concluiu", "em_andamento", "parou", "nao_acessou"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`shrink-0 h-[44px] px-[14px] rounded-[26px] text-[13px] font-['Figtree:Medium',sans-serif] font-medium transition-colors focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59] ${
                  filter === f
                    ? "bg-[#021b59] text-white"
                    : "bg-[#f0f0f0] text-[#333] hover:bg-[#e0e0e0]"
                }`}
              >
                {f === "todos"
                  ? "Todos"
                  : STATUS_META[f as StudentStatus].label}
              </button>
            ))}
          </div>

          <ul className="flex flex-col overflow-y-auto px-[20px] py-[8px] gap-[2px]">
            {filtered.map((p) => {
              const meta = STATUS_META[p.status];
              return (
                <li
                  key={p.id}
                  className="flex items-center gap-[12px] py-[10px] border-b border-[#f0f0f0] last:border-0"
                >
                  <div className="flex flex-col gap-[2px] flex-1 min-w-0">
                    <p className="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[15px] truncate">
                      {p.name}
                    </p>
                    <p className="font-['Figtree:Regular',sans-serif] text-[#8e8e8e] text-[12px] truncate">
                      {p.email}
                    </p>
                    {p.stoppedAt && (
                      <p className="font-['Figtree:Regular',sans-serif] text-[#801436] text-[12px]">
                        Parou em: {p.stoppedAt}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-[6px]">
                    <span
                      className="text-[11px] font-['Figtree:Medium',sans-serif] font-medium px-[8px] py-[2px] rounded-full"
                      style={{ color: meta.color, background: meta.bg }}
                    >
                      {meta.label}
                    </span>
                    <div className="flex items-center gap-[6px]">
                      <div className="w-[50px] h-[4px] bg-[#e0e0e0] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${p.progress}%`, background: meta.dotColor }}
                          aria-hidden="true"
                        />
                      </div>
                      <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#021b59] text-[12px]">
                        {p.progress}%
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}

// ── Prova Responses Panel ─────────────────────────────────────────────────────
function ProvaResponsesPanel({
  modId,
  modName,
  onClose,
}: {
  modId: string;
  modName: string;
  onClose: () => void;
}) {
  const data = MOCK_PROVA_RESPONSES[modId];

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="prova-resp-title"
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:px-[20px]"
      >
        <div className="bg-white w-full sm:max-w-[520px] rounded-t-[16px] sm:rounded-[12px] shadow-xl flex flex-col max-h-[85vh]">
          <div className="flex items-center justify-between px-[20px] py-[16px] border-b border-[#e0e0e0] shrink-0">
            <div className="flex flex-col gap-[2px]">
              <h2
                id="prova-resp-title"
                className="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[18px]"
              >
                Respostas da prova
              </h2>
              <p className="font-['Figtree:Regular',sans-serif] text-[#606060] text-[13px]">{modName}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="size-[32px] flex items-center justify-center rounded focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59] hover:opacity-70"
            >
              <svg className="size-[20px]" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <path clipRule="evenodd" d={CLOSE_SM} fill="#333" fillRule="evenodd" />
              </svg>
            </button>
          </div>

          <div className="overflow-y-auto px-[20px] py-[16px] flex flex-col gap-[20px]">
            {!data ? (
              <p className="font-['Figtree:Regular',sans-serif] text-[#8e8e8e] text-[15px] text-center py-[24px]">
                Nenhuma prova respondida ainda neste módulo.
              </p>
            ) : (
              <>
                <div className="bg-[#f5f5f5] rounded-[12px] px-[16px] py-[12px] flex flex-col sm:flex-row sm:items-center gap-[4px] sm:gap-[24px]">
                  <p className="font-['Figtree:Regular',sans-serif] text-[#333] text-[14px]">
                    <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#021b59] text-[16px]">
                      {data.total}
                    </span>{" "}
                    alunos responderam
                  </p>
                  <p className="font-['Figtree:Regular',sans-serif] text-[#333] text-[14px]">
                    Média de acertos:{" "}
                    <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#c0396b] text-[16px]">
                      {data.avgPct}%
                    </span>
                  </p>
                </div>

                {data.questions.map((q, idx) => (
                  <div key={q.id} className="flex flex-col gap-[10px]">
                    <div>
                      <p className="font-['Figtree:Bold',sans-serif] font-bold text-black text-[16px]">
                        Questão {String(idx + 1).padStart(2, "0")}
                      </p>
                      <p className="font-['Figtree:Regular',sans-serif] text-[#595959] text-[14px] leading-[22px] mt-[2px]">
                        {q.text}
                      </p>
                    </div>
                    <div className="flex flex-col gap-[6px]">
                      {q.options.map((opt) => (
                        <div
                          key={opt.label}
                          className={`flex flex-col gap-[4px] p-[10px] rounded-[10px] ${
                            opt.correct ? "bg-[#e6f9ee]" : "bg-[#f5f5f5]"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-[8px]">
                            <div className="flex items-center gap-[6px] flex-1 min-w-0">
                              <span
                                className={`shrink-0 font-['Figtree:Medium',sans-serif] font-medium text-[14px] ${
                                  opt.correct ? "text-[#155724]" : "text-[#021b59]"
                                }`}
                              >
                                {opt.label})
                              </span>
                              <span className="font-['Figtree:Regular',sans-serif] text-[13px] text-black flex-1 min-w-0 truncate">
                                {opt.text}
                              </span>
                              {opt.correct && (
                                <span className="shrink-0 text-[11px] font-['Figtree:Medium',sans-serif] font-medium text-[#155724] bg-[#d4edda] px-[6px] py-[1px] rounded-full">
                                  Correta
                                </span>
                              )}
                            </div>
                            <span
                              className={`shrink-0 font-['Figtree:Medium',sans-serif] font-medium text-[13px] ${
                                opt.correct ? "text-[#c0396b]" : "text-[#595959]"
                              }`}
                            >
                              {opt.pct}%
                            </span>
                          </div>
                          <div className="w-full h-[5px] bg-white rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${opt.correct ? "bg-[#28a745]" : "bg-[#8e8e8e]"}`}
                              style={{ width: `${opt.pct}%` }}
                              aria-hidden="true"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="font-['Figtree:Regular',sans-serif] text-[#8e8e8e] text-[12px]">
                      Total:{" "}
                      <span className="text-[#c0396b] font-['Figtree:Medium',sans-serif] font-medium">
                        {data.total} pessoas
                      </span>{" "}
                      responderam
                    </p>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Dashboard Section ─────────────────────────────────────────────────────────
function CourseDashboard({
  course,
  totalStudents,
}: {
  course: { title: string; hours: string; avgScore: number };
  totalStudents: number;
}) {
  const concluiu    = MOCK_STUDENTS.filter((s) => s.status === "concluiu").length;
  const emAndamento = MOCK_STUDENTS.filter((s) => s.status === "em_andamento").length;
  const parou       = MOCK_STUDENTS.filter((s) => s.status === "parou").length;
  const naoAcessou  = MOCK_STUDENTS.filter((s) => s.status === "nao_acessou").length;
  const acessaram   = totalStudents - naoAcessou;

  const pieData = [
    { name: "Concluíram",     value: concluiu,    color: "#28a745" },
    { name: "Em andamento",   value: emAndamento, color: "#0643de" },
    { name: "Pararam",        value: parou,       color: "#de2e66" },
    { name: "Não acessaram",  value: naoAcessou,  color: "#8e8e8e" },
  ];

  const stoppedStudents = MOCK_STUDENTS.filter((s) => s.status === "parou");

  return (
    <div className="flex flex-col gap-[20px]">
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-[12px]">
        <StatCard value={totalStudents} label="Total inscritos"         color="#021b59" bg="#c5d6ff" />
        <StatCard value={acessaram}     label="Acessaram"               sub={`${Math.round((acessaram / totalStudents) * 100)}% do total`} color="#0643de" bg="#e8eeff" />
        <StatCard value={naoAcessou}    label="Nunca acessaram"         sub={`${Math.round((naoAcessou / totalStudents) * 100)}% do total`} color="#606060" bg="#f0f0f0" />
        <StatCard value={concluiu}      label="Concluíram"              sub={`${Math.round((concluiu / totalStudents) * 100)}% do total`}   color="#155724" bg="#e6f9ee" />
        <StatCard value={emAndamento}   label="Em andamento"            sub={`${Math.round((emAndamento / totalStudents) * 100)}% do total`} color="#021b59" bg="#fffed0" />
        <StatCard value={parou}         label="Pararam"                 sub={`${Math.round((parou / totalStudents) * 100)}% do total`}      color="#801436" bg="#fde8ef" />
      </div>

      {/* Progress bar */}
      <div className="flex flex-col gap-[8px]">
        <p className="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[14px]">
          Distribuição de progresso
        </p>
        <div className="w-full h-[14px] rounded-full overflow-hidden flex" role="img" aria-label="Gráfico de distribuição de progresso dos alunos">
          {pieData.map((d) => (
            <div
              key={d.name}
              style={{ width: `${(d.value / totalStudents) * 100}%`, background: d.color }}
              title={`${d.name}: ${d.value}`}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-x-[16px] gap-y-[6px]">
          {pieData.map((d) => (
            <div key={d.name} className="flex items-center gap-[6px]">
              <div className="size-[10px] rounded-full shrink-0" style={{ background: d.color }} aria-hidden="true" />
              <span className="font-['Figtree:Regular',sans-serif] text-[#333] text-[13px]">
                {d.name} ({d.value})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Pie chart */}
      <div className="w-full h-[240px]" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [
                `${value} aluno${value !== 1 ? "s" : ""} (${Math.round((value / totalStudents) * 100)}%)`,
                name,
              ]}
              contentStyle={{ borderRadius: "8px", border: "1px solid #e0e0e0", fontSize: "13px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Average score */}
      <div className="bg-[#ffeac4] rounded-[12px] px-[16px] py-[14px] flex items-center justify-between gap-[12px]">
        <div>
          <p className="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[28px]">
            {course.avgScore}%
          </p>
          <p className="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[14px]">
            Média de acertos nas provas
          </p>
        </div>
        <svg className="size-[36px] shrink-0 opacity-40" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <path d={CHART_PATH} fill="#021b59" />
        </svg>
      </div>

      {/* Stopped students */}
      {stoppedStudents.length > 0 && (
        <div className="flex flex-col gap-[10px]">
          <p className="font-['Figtree:Bold',sans-serif] font-bold text-[#801436] text-[16px]">
            Alunos que pararam — onde estavam
          </p>
          <div className="flex flex-col gap-[6px]">
            {stoppedStudents.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between gap-[12px] bg-[#fde8ef] rounded-[10px] px-[14px] py-[10px]"
              >
                <div className="flex flex-col gap-[2px] min-w-0 flex-1">
                  <p className="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[14px] truncate">
                    {s.name}
                  </p>
                  {s.stoppedAt && (
                    <p className="font-['Figtree:Regular',sans-serif] text-[#801436] text-[12px]">
                      Parou em: {s.stoppedAt}
                    </p>
                  )}
                </div>
                <div className="shrink-0 flex flex-col items-end gap-[2px]">
                  <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#801436] text-[13px]">
                    {s.progress}%
                  </span>
                  <p className="font-['Figtree:Regular',sans-serif] text-[#8e8e8e] text-[11px]">
                    {s.lastAccess}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export function ManageCoursePage() {
  const navigate = useNavigate();
  const { id = "power-bi" } = useParams<{ id: string }>();
  const course = COURSE_DATA[id] ?? COURSE_DATA["power-bi"];

  const [modules, setModules] = useState<Module[]>(course.modules);
  const [editingLesson, setEditingLesson] = useState<{ modId: string; lessonId: string } | null>(null);
  const [showParticipants, setShowParticipants] = useState(false);
  const [provaModId, setProvaModId] = useState<string | null>(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "modulos">("dashboard");

  // ── Handlers ──────────────────────────────────────────────────────────────
  const removeLesson = (modId: string, lessonId: string) => {
    setModules((prev) =>
      prev.map((m) => (m.id === modId ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) } : m))
    );
  };

  const removeModule = (modId: string) => {
    setModules((prev) => prev.filter((m) => m.id !== modId));
  };

  const openEditLesson = (modId: string, lessonId: string) => {
    setEditingLesson({ modId, lessonId });
  };

  const saveLesson = (name: string) => {
    if (!editingLesson) return;
    setModules((prev) =>
      prev.map((m) =>
        m.id === editingLesson.modId
          ? {
              ...m,
              lessons: m.lessons.map((l) =>
                l.id === editingLesson.lessonId ? { ...l, name } : l
              ),
            }
          : m
      )
    );
    setEditingLesson(null);
  };

  const getEditingLesson = () => {
    if (!editingLesson) return null;
    const mod = modules.find((m) => m.id === editingLesson.modId);
    return mod?.lessons.find((l) => l.id === editingLesson.lessonId) ?? null;
  };

  const provaModName = provaModId ? modules.find((m) => m.id === provaModId)?.name ?? "" : "";

  const handleGeneratePDF = async () => {
    setGeneratingPDF(true);
    // Simulate PDF generation delay
    await new Promise((r) => setTimeout(r, 1800));
    setGeneratingPDF(false);
    toast.success("Relatório gerado com sucesso!", {
      description: `Relatório_${course.title.replace(/\s+/g, "_")}_${new Date().toLocaleDateString("pt-BR").replace(/\//g, "-")}.pdf`,
      duration: 5000,
    });
    // In a real app, this would call an API or use jsPDF to generate the actual PDF
    window.print();
  };

  return (
    <div className="bg-white flex flex-col pb-[80px] min-h-screen">
      {/* Hero */}
      <div className="w-full h-[180px] md:h-[220px] overflow-hidden relative">
        <ImageWithFallback
          alt={course.title}
          src={course.image}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" aria-hidden="true" />
        <button
          type="button"
          onClick={() => navigate("/courses")}
          aria-label="Voltar para cursos"
          className="absolute top-[16px] left-[16px] size-[36px] rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59]"
        >
          <svg className="size-[20px]" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <path d={ARROW_BACK} fill="#021b59" />
          </svg>
        </button>
        <div className="absolute bottom-[16px] left-[20px] right-[20px]">
          <h1 className="font-['Figtree:Bold',sans-serif] font-bold text-white text-[22px] leading-[32px]">
            {course.title}
          </h1>
          <p className="font-['Figtree:Regular',sans-serif] text-white/80 text-[14px]">
            Carga horária: {course.hours} · {course.students} alunos inscritos
          </p>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto w-full px-[20px] md:px-[40px] pt-[20px] flex flex-col gap-[20px]">

        {/* Quick actions row */}
        <div className="flex flex-col sm:flex-row gap-[10px]">
          <button
            type="button"
            onClick={() => setShowParticipants(true)}
            className="flex-1 flex items-center justify-center gap-[8px] h-[46px] bg-[#ffeac4] rounded-[26px] hover:bg-[#ffd9a0] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59]"
          >
            <svg className="size-[18px] shrink-0" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <path d={PEOPLE_PATH} fill="#333" />
            </svg>
            <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[16px]">
              Ver participantes
            </span>
          </button>

          <button
            type="button"
            onClick={handleGeneratePDF}
            disabled={generatingPDF}
            className="flex-1 flex items-center justify-center gap-[8px] h-[46px] bg-[#021b59] rounded-[26px] hover:bg-[#042e99] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59] disabled:opacity-60 disabled:cursor-not-allowed"
            aria-label="Gerar relatório em PDF"
          >
            {generatingPDF ? (
              <>
                <svg
                  className="size-[18px] shrink-0 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#ffeac4" strokeWidth="4" />
                  <path className="opacity-75" fill="#ffeac4" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#ffeac4] text-[16px]">
                  Gerando…
                </span>
              </>
            ) : (
              <>
                <svg className="size-[18px] shrink-0" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <path d={DOWNLOAD_PATH} fill="#ffeac4" />
                </svg>
                <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#ffeac4] text-[16px]">
                  Gerar relatório PDF
                </span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate("/message")}
            className="flex-1 flex items-center justify-center h-[46px] border-2 border-[#021b59] rounded-[26px] hover:bg-[#021b59]/5 transition-colors focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59]"
          >
            <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#021b59] text-[16px]">
              Enviar comunicado
            </span>
          </button>
        </div>

        {/* Tab nav */}
        <div
          role="tablist"
          aria-label="Seções do curso"
          className="flex gap-0 border-b border-[#e0e0e0]"
        >
          {(
            [
              { key: "dashboard", label: "Dashboard" },
              { key: "modulos",   label: "Módulos e aulas" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              role="tab"
              aria-selected={activeTab === tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`px-[20px] py-[10px] font-['Figtree:Medium',sans-serif] font-medium text-[15px] border-b-2 transition-colors focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59] ${
                activeTab === tab.key
                  ? "border-[#021b59] text-[#021b59]"
                  : "border-transparent text-[#8e8e8e] hover:text-[#333]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab panels */}
        {activeTab === "dashboard" && (
          <section aria-label="Dashboard do curso">
            <CourseDashboard course={course} totalStudents={course.students} />
          </section>
        )}

        {activeTab === "modulos" && (
          <section aria-label="Módulos e aulas" className="flex flex-col gap-[16px]">
            {modules.length === 0 && (
              <p className="font-['Figtree:Regular',sans-serif] text-[#8e8e8e] text-[15px] text-center py-[24px]">
                Nenhum módulo disponível.
              </p>
            )}

            {modules.map((mod) => (
              <div key={mod.id} className="border border-[#e0e0e0] rounded-[8px] overflow-hidden">
                {/* Module header */}
                <div className="flex items-center justify-between gap-[8px] bg-[#021b59] px-[16px] py-[12px]">
                  <p className="font-['Figtree:Bold',sans-serif] font-bold text-white text-[16px] flex-1 min-w-0 truncate">
                    {mod.name}
                  </p>
                  <div className="flex items-center gap-[10px] shrink-0">
                    <button
                      type="button"
                      aria-label={`Ver respostas da prova — ${mod.name}`}
                      onClick={() => setProvaModId(mod.id)}
                      className="flex items-center gap-[6px] bg-white/20 hover:bg-white/30 transition-colors rounded-[20px] px-[10px] py-[4px] focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-white"
                    >
                      <svg className="size-[15px] shrink-0" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <path d={CHART_PATH} fill="white" />
                      </svg>
                      <span className="font-['Figtree:Medium',sans-serif] font-medium text-white text-[13px] hidden sm:inline">
                        Ver respostas
                      </span>
                    </button>
                    <button
                      type="button"
                      aria-label={`Remover módulo ${mod.name}`}
                      onClick={() => removeModule(mod.id)}
                      className="size-[26px] flex items-center justify-center rounded hover:opacity-70 transition-opacity focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-white"
                    >
                      <svg className="size-full" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <path clipRule="evenodd" d={CLOSE_SM} fill="white" fillRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Lessons */}
                <div className="flex flex-col divide-y divide-[#e8e8e8]">
                  {mod.lessons.length === 0 && (
                    <p className="font-['Figtree:Regular',sans-serif] text-[#8e8e8e] text-[14px] px-[16px] py-[12px]">
                      Nenhuma aula neste módulo.
                    </p>
                  )}
                  {mod.lessons.map((l) => (
                    <div
                      key={l.id}
                      className="bg-[#c5d6ff] flex items-center justify-between px-[16px] py-[14px] gap-[8px]"
                    >
                      <p className="font-['Figtree:Medium',sans-serif] font-medium text-black text-[16px] flex-1 min-w-0 truncate">
                        {l.name}
                      </p>
                      <div className="flex items-center gap-[10px] shrink-0">
                        <button
                          type="button"
                          aria-label={`Editar ${l.name}`}
                          onClick={() => openEditLesson(mod.id, l.id)}
                          className="size-[22px] hover:opacity-70 transition-opacity focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59] rounded"
                        >
                          <svg className="size-full" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                            <path d={EDIT_PATH} fill="#021b59" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          aria-label={`Remover ${l.name}`}
                          onClick={() => removeLesson(mod.id, l.id)}
                          className="size-[22px] hover:opacity-70 transition-opacity focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59] rounded"
                        >
                          <svg className="size-full" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                            <path clipRule="evenodd" d={CLOSE_SM} fill="#801436" fillRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}
      </div>

      {/* Modals / Panels */}
      {editingLesson && getEditingLesson() && (
        <EditLessonModal
          lessonName={getEditingLesson()!.name}
          onSave={(name) => saveLesson(name)}
          onClose={() => setEditingLesson(null)}
        />
      )}

      {showParticipants && <ParticipantsPanel onClose={() => setShowParticipants(false)} />}

      {provaModId && (
        <ProvaResponsesPanel
          modId={provaModId}
          modName={provaModName}
          onClose={() => setProvaModId(null)}
        />
      )}
    </div>
  );
}
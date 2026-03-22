import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import imgRectangle30 from "@/assets/22ebf3a06cf8215c6bd0946f42302bc2204ed790.png";
import { PageHeader } from "@/components/shared/PageHeader";
import { useEnrollmentGuard } from "@/hooks/useEnrollmentGuard";
import { useApp } from "@/context/AppContext";

// ─── Arrow / Check SVG paths ─────────────────────────────────────────────────
const ARROW_PATH = "M6 7L12 13L18 7L20 9L12 17L4 9L6 7Z";
const CHECK_PATH = "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z";

// ─── Data ────────────────────────────────────────────────────────────────────
type ItemType = "aula" | "prova";

interface LessonItem {
  id: string;
  label: string;
  type: ItemType;
  modId: string;
}

interface ModuloData {
  id: string;
  title: string;
  items: LessonItem[];
}

const MODULOS: ModuloData[] = [
  {
    id: "1",
    title: "Módulo 01",
    items: [
      { id: "m1-aula-01", label: "Aula 01 - Introdução", type: "aula", modId: "1" },
      { id: "m1-aula-02", label: "Aula 02 - Conceitos Básicos", type: "aula", modId: "1" },
      { id: "m1-aula-03", label: "Aula 03 - Prática", type: "aula", modId: "1" },
      { id: "m1-prova-01", label: "Prova do Módulo", type: "prova", modId: "1" },
    ],
  },
  {
    id: "2",
    title: "Módulo 02",
    items: [
      { id: "m2-aula-01", label: "Aula 01 - Power Query", type: "aula", modId: "2" },
      { id: "m2-aula-02", label: "Aula 02 - Transformação de Dados", type: "aula", modId: "2" },
      { id: "m2-aula-03", label: "Aula 03 - Relacionamentos", type: "aula", modId: "2" },
      { id: "m2-prova-01", label: "Prova do Módulo", type: "prova", modId: "2" },
    ],
  },
  {
    id: "3",
    title: "Módulo 03",
    items: [
      { id: "m3-aula-01", label: "Aula 01 - DAX Básico", type: "aula", modId: "3" },
      { id: "m3-aula-02", label: "Aula 02 - Visualizações Avançadas", type: "aula", modId: "3" },
      { id: "m3-aula-03", label: "Aula 03 - Publicação e Compartilhamento", type: "aula", modId: "3" },
      { id: "m3-prova-01", label: "Prova do Módulo", type: "prova", modId: "3" },
    ],
  },
];

// Todos os IDs de lições para validar conclusão
const ALL_LESSON_IDS = MODULOS.flatMap((m) => m.items.map((i) => i.id));
const ALL_AULA_IDS = MODULOS.flatMap((m) => m.items.filter((i) => i.type === "aula").map((i) => i.id));
const ALL_PROVA_IDS = MODULOS.flatMap((m) => m.items.filter((i) => i.type === "prova").map((i) => i.id));

const VISITED_KEY = "solar_visited_lessons";

function loadVisited(): Set<string> {
  try {
    const raw = localStorage.getItem(VISITED_KEY);
    if (raw) return new Set(JSON.parse(raw) as string[]);
  } catch {
    // ignore parse errors
  }
  return new Set();
}

function saveVisited(visited: Set<string>) {
  try {
    localStorage.setItem(VISITED_KEY, JSON.stringify([...visited]));
  } catch {
    // ignore storage errors
  }
}

/** Gera um código de validação único de 16 caracteres */
function generateValidationCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 16; i++) {
    if (i > 0 && i % 4 === 0) code += "-";
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

/** Formata data pt-BR */
function formatDate(date: Date): string {
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function ArrowIcon({ up }: { up: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={`size-[24px] shrink-0 transition-transform duration-200 ${up ? "rotate-180" : "rotate-0"}`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path clipRule="evenodd" d={ARROW_PATH} fill="#021b59" fillRule="evenodd" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-[18px] shrink-0"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path d={CHECK_PATH} fill="#042e99" />
    </svg>
  );
}

interface ProgressBarProps {
  visited: number;
  total: number;
}

function ProgressBar({ visited, total }: ProgressBarProps) {
  const pct = total > 0 ? Math.round((visited / total) * 100) : 0;
  return (
    <div className="w-full mt-[4px]">
      <div className="flex justify-between items-center mb-[4px]">
        <span
          className="font-['Figtree:Regular',sans-serif] font-normal text-[#021b59] text-[12px] leading-[18px]"
          aria-label={`Progresso: ${pct}% concluído`}
        >
          Progresso
        </span>
        <span className="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[12px] leading-[18px]">
          {pct}%
        </span>
      </div>
      <div
        className="w-full h-[6px] bg-[#759BFB]/40 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progresso do módulo"
      >
        <div
          className="h-full bg-[#042e99] rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="font-['Figtree:Regular',sans-serif] font-normal text-[#021b59]/70 text-[11px] leading-[16px] mt-[2px]">
        {visited} de {total} aulas concluídas
      </p>
    </div>
  );
}

interface ModuleCardProps {
  modulo: ModuloData;
  isOpen: boolean;
  onToggle: () => void;
  visited: Set<string>;
  onVisitLesson: (lessonId: string, modId: string, type: ItemType) => void;
}

function ModuleCard({ modulo, isOpen, onToggle, visited, onVisitLesson }: ModuleCardProps) {
  const aulaItems = modulo.items.filter((i) => i.type === "aula");
  const visitedCount = aulaItems.filter((i) => visited.has(i.id)).length;

  return (
    <div className="bg-[#c5d6ff] rounded-[12px] w-full overflow-hidden">
      <div className="flex flex-col gap-[12px] px-[16px] pt-[16px] pb-[16px]">
        <div className="w-full aspect-[16/9] rounded-[10px] overflow-hidden">
          <img
            alt={`Imagem representativa do ${modulo.title}`}
            className="w-full h-full object-cover"
            src={imgRectangle30}
          />
        </div>

        <ProgressBar visited={visitedCount} total={aulaItems.length} />

        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={`modulo-${modulo.id}-content`}
          className="flex items-center justify-between w-full text-left focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59] focus-visible:rounded-[4px] focus-visible:outline-offset-[2px]"
        >
          <span className="font-['Figtree:Bold',sans-serif] font-bold text-[24px] leading-[36px] text-black">
            {modulo.title}:
          </span>
          <ArrowIcon up={isOpen} />
        </button>

        {isOpen && (
          <div
            id={`modulo-${modulo.id}-content`}
            className="flex flex-col"
          >
            {modulo.items.map((item, idx) => {
              const isVisited = visited.has(item.id);
              const isLast = idx === modulo.items.length - 1;

              return (
                <div key={item.id}>
                  <button
                    type="button"
                    onClick={() => onVisitLesson(item.id, item.modId, item.type)}
                    className="flex items-center justify-between w-full py-[10px] text-left focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59] focus-visible:rounded-[4px] focus-visible:outline-offset-[2px] group"
                  >
                    <span className="font-['Figtree:Medium',sans-serif] font-medium text-[20px] leading-[30px] text-black group-hover:text-[#042e99] transition-colors">
                      {item.label}
                    </span>
                    {isVisited && <CheckIcon />}
                  </button>
                  {!isLast && (
                    <div className="w-full h-px bg-[#759BFB]" aria-hidden="true" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Declaration Modals ───────────────────────────────────────────────────────

interface DeclaracaoMatriculaModalProps {
  onClose: () => void;
  studentName: string;
  validationCode: string;
  emissionDate: Date;
}

function DeclaracaoMatriculaModal({
  onClose,
  studentName,
  validationCode,
  emissionDate,
}: DeclaracaoMatriculaModalProps) {
  // ESC fecha
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Data de matrícula mockada (protótipo): 30 dias antes da emissão
  const enrollmentDate = new Date(emissionDate);
  enrollmentDate.setDate(enrollmentDate.getDate() - 30);

  function handlePrint() {
    window.print();
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="fixed inset-0 z-50 flex items-center justify-center px-[16px] py-[24px] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="matricula-modal-title"
      >
        <div className="bg-white w-full max-w-[580px] rounded-[12px] shadow-2xl flex flex-col overflow-hidden">

          {/* Cabeçalho do modal */}
          <div className="bg-[#021b59] px-[28px] py-[20px] flex items-center justify-between">
            <h2
              id="matricula-modal-title"
              className="font-['Figtree:Bold',sans-serif] font-bold text-white text-[18px] leading-[28px]"
            >
              Declaração de Matrícula
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar declaração de matrícula"
              className="text-white/80 hover:text-white transition-colors focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-white focus-visible:rounded-[4px] size-[44px] flex items-center justify-center shrink-0"
            >
              <svg className="size-[22px]" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Documento */}
          <div className="px-[28px] md:px-[40px] py-[32px] flex flex-col gap-[20px]">

            {/* Brasão / cabeçalho institucional */}
            <div className="text-center flex flex-col gap-[4px] border-b border-[#e0e0e0] pb-[20px]">
              <div className="inline-flex items-center justify-center gap-[10px] mx-auto mb-[8px]">
                <div className="size-[44px] rounded-full bg-[#021b59] flex items-center justify-center shrink-0">
                  <span className="font-['Figtree:Bold',sans-serif] font-bold text-white text-[16px]">S</span>
                </div>
                <div className="text-left">
                  <p className="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[15px] leading-[20px]">SOLAR</p>
                  <p className="font-['Figtree:Regular',sans-serif] text-[#606060] text-[12px] leading-[16px]">Sistema Online de Aprendizagem</p>
                </div>
              </div>
              <p className="font-['Figtree:Regular',sans-serif] text-[#606060] text-[12px]">
                Universidade Federal do Ceará — UFC
              </p>
            </div>

            {/* Título do documento */}
            <div className="text-center">
              <h3 className="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[20px] leading-[30px] uppercase tracking-wide">
                Declaração de Matrícula
              </h3>
            </div>

            {/* Corpo */}
            <div className="font-['Figtree:Regular',sans-serif] text-[#333] text-[15px] leading-[26px] text-justify">
              <p>
                Declaramos, para os devidos fins, que{" "}
                <span className="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59]">{studentName}</span>{" "}
                encontra-se regularmente matriculado(a) no curso{" "}
                <span className="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59]">Power BI - Fundamentos</span>,
                ofertado pela Universidade Federal do Ceará através da plataforma SOLAR.
              </p>
            </div>

            {/* Dados em grid */}
            <div className="bg-[#f5f8ff] rounded-[10px] p-[18px] grid grid-cols-1 sm:grid-cols-2 gap-[12px]">
              {[
                { label: "Aluno(a)", value: studentName },
                { label: "Curso", value: "Power BI - Fundamentos" },
                { label: "Carga Horária", value: "30 horas" },
                { label: "Data de Matrícula", value: formatDate(enrollmentDate) },
                { label: "Status da Matrícula", value: "Ativa" },
                { label: "Data de Emissão", value: formatDate(emissionDate) },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="font-['Figtree:Regular',sans-serif] text-[#8e8e8e] text-[11px] leading-[16px] uppercase tracking-wide">
                    {label}
                  </p>
                  <p className={`font-['Figtree:Medium',sans-serif] font-medium text-[14px] leading-[22px] ${label === "Status da Matrícula" ? "text-[#042e99]" : "text-[#021b59]"}`}>
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* Código de validação */}
            <div className="border border-dashed border-[#759BFB] rounded-[10px] px-[18px] py-[14px] flex flex-col gap-[4px]">
              <p className="font-['Figtree:Regular',sans-serif] text-[#8e8e8e] text-[11px] uppercase tracking-wide">
                Código de Validação
              </p>
              <p className="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[17px] tracking-[0.15em] font-mono">
                {validationCode}
              </p>
              <p className="font-['Figtree:Regular',sans-serif] text-[#8e8e8e] text-[11px] leading-[16px]">
                Este código garante a autenticidade do documento e pode ser utilizado para verificação futura.
              </p>
            </div>

            <p className="font-['Figtree:Regular',sans-serif] text-[#8e8e8e] text-[12px] leading-[18px] text-center">
              Documento emitido eletronicamente pelo sistema SOLAR — UFC em {formatDate(emissionDate)}.
            </p>
          </div>

          {/* Ações */}
          <div className="px-[28px] md:px-[40px] pb-[28px] flex flex-col sm:flex-row gap-[10px]">
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 h-[48px] bg-[#021b59] rounded-[26px] hover:bg-[#042e99] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59] focus-visible:outline-offset-[2px] flex items-center justify-center gap-[8px]"
            >
              <svg className="size-[18px]" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6v-8z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="font-['Figtree:Medium',sans-serif] font-medium text-white text-[16px]">
                Imprimir / Baixar PDF
              </span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-[48px] border-2 border-[#021b59] rounded-[26px] hover:bg-[#021b59]/5 transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59] focus-visible:outline-offset-[2px]"
            >
              <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#021b59] text-[16px]">
                Fechar
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

interface DeclaracaoConclusaoModalProps {
  onClose: () => void;
  studentName: string;
  validationCode: string;
  emissionDate: Date;
  conclusionDate: Date;
}

function DeclaracaoConclusaoModal({
  onClose,
  studentName,
  validationCode,
  emissionDate,
  conclusionDate,
}: DeclaracaoConclusaoModalProps) {
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  function handlePrint() {
    window.print();
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="fixed inset-0 z-50 flex items-center justify-center px-[16px] py-[24px] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="conclusao-modal-title"
      >
        <div className="bg-white w-full max-w-[580px] rounded-[12px] shadow-2xl flex flex-col overflow-hidden">

          {/* Cabeçalho */}
          <div className="bg-[#042e99] px-[28px] py-[20px] flex items-center justify-between">
            <h2
              id="conclusao-modal-title"
              className="font-['Figtree:Bold',sans-serif] font-bold text-white text-[18px] leading-[28px]"
            >
              Declaração de Conclusão
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar declaração de conclusão"
              className="text-white/80 hover:text-white transition-colors focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-white focus-visible:rounded-[4px] size-[44px] flex items-center justify-center shrink-0"
            >
              <svg className="size-[22px]" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Documento */}
          <div className="px-[28px] md:px-[40px] py-[32px] flex flex-col gap-[20px]">

            {/* Cabeçalho institucional */}
            <div className="text-center flex flex-col gap-[4px] border-b border-[#e0e0e0] pb-[20px]">
              <div className="inline-flex items-center justify-center gap-[10px] mx-auto mb-[8px]">
                <div className="size-[44px] rounded-full bg-[#042e99] flex items-center justify-center shrink-0">
                  <span className="font-['Figtree:Bold',sans-serif] font-bold text-white text-[16px]">S</span>
                </div>
                <div className="text-left">
                  <p className="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[15px] leading-[20px]">SOLAR</p>
                  <p className="font-['Figtree:Regular',sans-serif] text-[#606060] text-[12px] leading-[16px]">Sistema Online de Aprendizagem</p>
                </div>
              </div>
              <p className="font-['Figtree:Regular',sans-serif] text-[#606060] text-[12px]">
                Universidade Federal do Ceará — UFC
              </p>
            </div>

            {/* Ícone de conclusão */}
            <div className="flex justify-center">
              <div className="size-[56px] rounded-full bg-[#c5d6ff] flex items-center justify-center">
                <svg className="size-[30px]" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="#021b59" />
                </svg>
              </div>
            </div>

            {/* Título */}
            <div className="text-center">
              <h3 className="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[20px] leading-[30px] uppercase tracking-wide">
                Declaração de Conclusão de Curso
              </h3>
            </div>

            {/* Corpo */}
            <div className="font-['Figtree:Regular',sans-serif] text-[#333] text-[15px] leading-[26px] text-justify">
              <p>
                Declaramos, para os devidos fins, que{" "}
                <span className="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59]">{studentName}</span>{" "}
                concluiu com êxito o curso{" "}
                <span className="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59]">Power BI - Fundamentos</span>,
                ofertado pela Universidade Federal do Ceará através da plataforma SOLAR, tendo cumprido
                todos os requisitos necessários para a sua conclusão.
              </p>
            </div>

            {/* Dados em grid */}
            <div className="bg-[#f5f8ff] rounded-[10px] p-[18px] grid grid-cols-1 sm:grid-cols-2 gap-[12px]">
              {[
                { label: "Aluno(a)", value: studentName },
                { label: "Curso", value: "Power BI - Fundamentos" },
                { label: "Carga Horária", value: "30 horas" },
                { label: "Data de Conclusão", value: formatDate(conclusionDate) },
                { label: "Status", value: "Concluído" },
                { label: "Data de Emissão", value: formatDate(emissionDate) },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="font-['Figtree:Regular',sans-serif] text-[#8e8e8e] text-[11px] leading-[16px] uppercase tracking-wide">
                    {label}
                  </p>
                  <p className={`font-['Figtree:Medium',sans-serif] font-medium text-[14px] leading-[22px] ${label === "Status" ? "text-[#042e99]" : "text-[#021b59]"}`}>
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* Código de validação */}
            <div className="border border-dashed border-[#042e99] rounded-[10px] px-[18px] py-[14px] flex flex-col gap-[4px]">
              <p className="font-['Figtree:Regular',sans-serif] text-[#8e8e8e] text-[11px] uppercase tracking-wide">
                Código de Validação
              </p>
              <p className="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[17px] tracking-[0.15em] font-mono">
                {validationCode}
              </p>
              <p className="font-['Figtree:Regular',sans-serif] text-[#8e8e8e] text-[11px] leading-[16px]">
                Este código garante a autenticidade do documento e pode ser utilizado para verificação futura.
              </p>
            </div>

            <p className="font-['Figtree:Regular',sans-serif] text-[#8e8e8e] text-[12px] leading-[18px] text-center">
              Documento emitido eletronicamente pelo sistema SOLAR — UFC em {formatDate(emissionDate)}.
            </p>
          </div>

          {/* Ações */}
          <div className="px-[28px] md:px-[40px] pb-[28px] flex flex-col sm:flex-row gap-[10px]">
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 h-[48px] bg-[#042e99] rounded-[26px] hover:bg-[#0643de] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#042e99] focus-visible:outline-offset-[2px] flex items-center justify-center gap-[8px]"
            >
              <svg className="size-[18px]" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6v-8z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="font-['Figtree:Medium',sans-serif] font-medium text-white text-[16px]">
                Imprimir / Baixar PDF
              </span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-[48px] border-2 border-[#042e99] rounded-[26px] hover:bg-[#042e99]/5 transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#042e99] focus-visible:outline-offset-[2px]"
            >
              <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#042e99] text-[16px]">
                Fechar
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Alerta de requisitos não cumpridos ───────────────────────────────────────

interface RequisitosAlertProps {
  totalAulas: number;
  visitedAulas: number;
  totalProvas: number;
  visitedProvas: number;
  onClose: () => void;
}

function RequisitosAlert({ totalAulas, visitedAulas, totalProvas, visitedProvas, onClose }: RequisitosAlertProps) {
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="fixed inset-0 z-50 flex items-center justify-center px-[20px]"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="requisitos-title"
        aria-describedby="requisitos-desc"
      >
        <div className="bg-white w-full max-w-[420px] rounded-[12px] shadow-2xl p-[28px] flex flex-col gap-[20px]">

          {/* Ícone de aviso */}
          <div className="flex flex-col items-center gap-[12px] text-center">
            <div className="size-[52px] rounded-full bg-[#ffeac4] flex items-center justify-center shrink-0" aria-hidden="true">
              <svg className="size-[28px]" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2L1 21h22L12 2zm0 3.5L20.5 19h-17L12 5.5zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z" fill="#D45900" />
              </svg>
            </div>
            <h2
              id="requisitos-title"
              className="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[20px] leading-[30px]"
            >
              Requisitos não cumpridos
            </h2>
          </div>

          <p
            id="requisitos-desc"
            className="font-['Figtree:Regular',sans-serif] text-[#333] text-[15px] leading-[24px] text-center"
          >
            Você ainda não cumpriu todos os requisitos necessários para concluir este curso.
          </p>

          {/* Checklist de requisitos */}
          <div className="flex flex-col gap-[10px]">
            {[
              {
                label: "Aulas concluídas",
                done: visitedAulas >= totalAulas,
                detail: `${visitedAulas} de ${totalAulas} aulas`,
              },
              {
                label: "Provas realizadas",
                done: visitedProvas >= totalProvas,
                detail: `${visitedProvas} de ${totalProvas} provas`,
              },
            ].map(({ label, done, detail }) => (
              <div
                key={label}
                className={`flex items-center gap-[12px] px-[14px] py-[10px] rounded-[10px] ${done ? "bg-[#c5d6ff]/40" : "bg-[#ffeac4]/60"}`}
              >
                <div
                  className={`size-[22px] rounded-full flex items-center justify-center shrink-0 ${done ? "bg-[#042e99]" : "bg-[#D45900]"}`}
                  aria-hidden="true"
                >
                  {done ? (
                    <svg className="size-[12px]" fill="none" viewBox="0 0 24 24">
                      <path d="M5 12l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg className="size-[12px]" fill="none" viewBox="0 0 14 14">
                      <path d="M2 2l10 10M12 2L2 12" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-['Figtree:Medium',sans-serif] font-medium text-[#021b59] text-[14px] leading-[20px]">
                    {label}
                  </p>
                  <p className="font-['Figtree:Regular',sans-serif] text-[#606060] text-[12px] leading-[16px]">
                    {detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={onClose}
            autoFocus
            className="w-full h-[48px] bg-[#021b59] rounded-[26px] hover:bg-[#042e99] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59] focus-visible:outline-offset-[2px]"
          >
            <span className="font-['Figtree:Medium',sans-serif] font-medium text-white text-[16px]">
              Entendi
            </span>
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function ModulosPage() {
  const navigate = useNavigate();
  const { user } = useApp();
  useEnrollmentGuard("power-bi");

  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(["1"]));
  const [visited, setVisited] = useState<Set<string>>(() => loadVisited());

  // Declaration modal states
  const [showMatriculaModal, setShowMatriculaModal] = useState(false);
  const [showConclusaoModal, setShowConclusaoModal] = useState(false);
  const [showRequisitosAlert, setShowRequisitosAlert] = useState(false);

  // Stable codes generated once per session (stable per page load)
  const [matriculaCode] = useState(() => generateValidationCode());
  const [conclusaoCode] = useState(() => generateValidationCode());
  const [emissionDate] = useState(() => new Date());

  // Persist visited on change
  useEffect(() => {
    saveVisited(visited);
  }, [visited]);

  // Compute completion
  const visitedAulas = ALL_AULA_IDS.filter((id) => visited.has(id)).length;
  const visitedProvas = ALL_PROVA_IDS.filter((id) => visited.has(id)).length;
  const isConcluded =
    visitedAulas >= ALL_AULA_IDS.length && visitedProvas >= ALL_PROVA_IDS.length;

  const totalProgress = ALL_LESSON_IDS.filter((id) => visited.has(id)).length;
  const overallPct = Math.round((totalProgress / ALL_LESSON_IDS.length) * 100);

  const handleToggle = (modId: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(modId)) next.delete(modId);
      else next.add(modId);
      return next;
    });
  };

  const handleVisitLesson = (lessonId: string, modId: string, type: ItemType) => {
    setVisited((prev) => {
      const next = new Set(prev);
      next.add(lessonId);
      return next;
    });

    if (type === "prova") {
      navigate("/cursos/power-bi/prova/instrucoes");
    } else {
      const mod = MODULOS.find((m) => m.id === modId);
      const aulaItems = mod?.items.filter((i) => i.type === "aula") ?? [];
      const aulaIndex = aulaItems.findIndex((i) => i.id === lessonId);
      navigate(`/cursos/power-bi/modulos/${modId}`, {
        state: { aulaIndex: aulaIndex >= 0 ? aulaIndex : 0 },
      });
    }
  };

  const handleConclusaoClick = useCallback(() => {
    if (!isConcluded) {
      setShowRequisitosAlert(true);
    } else {
      setShowConclusaoModal(true);
    }
  }, [isConcluded]);

  return (
    <main
      id="main-content"
      className="bg-white flex flex-col min-h-screen pb-[110px]"
    >
      <div className="max-w-[900px] mx-auto flex flex-col gap-[20px] px-[16px] md:px-[40px] pt-[20px] w-full">

        {/* Breadcrumb + back */}
        <PageHeader
          title="Módulos"
          backPath="/cursos/power-bi"
          crumbs={[
            { label: "Cursos", path: "/cursos" },
            { label: "Power BI - Fundamentos", path: "/cursos/power-bi" },
            { label: "Módulos" },
          ]}
        />

        {/* Course title */}
        <h2 className="font-['Figtree:Bold',sans-serif] font-bold text-[24px] leading-[36px] text-black">
          Power BI - Fundamentos
        </h2>

        {/* ── Botão Declaração de Matrícula (topo) ── */}
        <div className="flex flex-col gap-[8px]">
          <button
            type="button"
            onClick={() => setShowMatriculaModal(true)}
            className="w-full sm:w-auto sm:self-start flex items-center gap-[10px] px-[20px] h-[46px] border-2 border-[#021b59] rounded-[26px] hover:bg-[#021b59]/5 transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59] focus-visible:outline-offset-[2px]"
            aria-label="Emitir declaração de matrícula"
          >
            <svg className="size-[18px] shrink-0" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#021b59" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="#021b59" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#021b59] text-[15px]">
              Declaração de Matrícula
            </span>
          </button>

          {/* Progresso geral do curso */}
          <div className="flex items-center gap-[8px]">
            <div className="flex-1 h-[5px] bg-[#e0e0e0] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#042e99] rounded-full transition-all duration-500"
                style={{ width: `${overallPct}%` }}
                role="progressbar"
                aria-valuenow={overallPct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Progresso geral do curso: ${overallPct}%`}
              />
            </div>
            <span className="font-['Figtree:Regular',sans-serif] text-[#606060] text-[12px] shrink-0">
              {overallPct}% concluído
            </span>
          </div>
        </div>

        {/* Module accordion cards */}
        <div className="flex flex-col gap-[16px] w-full" role="list" aria-label="Lista de módulos">
          {MODULOS.map((mod) => (
            <div key={mod.id} role="listitem">
              <ModuleCard
                modulo={mod}
                isOpen={expandedIds.has(mod.id)}
                onToggle={() => handleToggle(mod.id)}
                visited={visited}
                onVisitLesson={handleVisitLesson}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Botão Declaração de Conclusão (sticky bottom) ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-[16px] md:px-[40px] py-[14px] shadow-[0px_-4px_12px_rgba(51,51,51,0.12)] z-10">
        <div className="max-w-[900px] mx-auto">
          <button
            type="button"
            onClick={handleConclusaoClick}
            className={[
              "w-full h-[50px] rounded-[26px] flex items-center justify-center gap-[10px] transition-colors",
              "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#042e99] focus-visible:outline-offset-[2px]",
              isConcluded
                ? "bg-[#042e99] hover:bg-[#0643de] cursor-pointer"
                : "bg-[#ffeac4] hover:bg-[#ffd9a0] cursor-pointer",
            ].join(" ")}
            aria-label={
              isConcluded
                ? "Emitir declaração de conclusão do curso"
                : "Verificar requisitos para declaração de conclusão"
            }
          >
            <svg
              className="size-[20px] shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {isConcluded ? (
                <path
                  d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  fill="white"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : (
                <path
                  d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
                  stroke="#333"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
              {!isConcluded && (
                <path
                  d="M14 2v6h6M16 13H8M16 17H8M10 9H8"
                  stroke="#333"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </svg>
            <span
              className={`font-['Figtree:Medium',sans-serif] font-medium text-[17px] ${isConcluded ? "text-white" : "text-[#333]"}`}
            >
              Declaração de Conclusão
            </span>
            {!isConcluded && (
              <span className="font-['Figtree:Regular',sans-serif] text-[13px] text-[#606060]">
                ({overallPct}% concluído)
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Modals ── */}
      {showMatriculaModal && (
        <DeclaracaoMatriculaModal
          onClose={() => setShowMatriculaModal(false)}
          studentName={user.name}
          validationCode={matriculaCode}
          emissionDate={emissionDate}
        />
      )}

      {showConclusaoModal && (
        <DeclaracaoConclusaoModal
          onClose={() => setShowConclusaoModal(false)}
          studentName={user.name}
          validationCode={conclusaoCode}
          emissionDate={emissionDate}
          conclusionDate={emissionDate}
        />
      )}

      {showRequisitosAlert && (
        <RequisitosAlert
          onClose={() => setShowRequisitosAlert(false)}
          totalAulas={ALL_AULA_IDS.length}
          visitedAulas={visitedAulas}
          totalProvas={ALL_PROVA_IDS.length}
          visitedProvas={visitedProvas}
        />
      )}
    </main>
  );
}
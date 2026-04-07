import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronDown, ChevronUp, Inbox } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useCourseStore } from "@/store/useCourseStore";
import type { IMessageCardProps } from "@/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateShort(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  if (diffDays === 1) return "Ontem";
  if (diffDays < 7) return `${diffDays} dias atrás`;
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

// ─── Professor tag ────────────────────────────────────────────────────────────

const PROFESSOR_NAME = "Prof. Eduardo Silva";

// ─── MessageCard ──────────────────────────────────────────────────────────────

function MessageCard({
  message,
  isExpanded,
  onToggle,
  isUnread,
}: IMessageCardProps) {
  const preview =
    message.body.length > 130 ? message.body.slice(0, 130) + "…" : message.body;

  return (
    <article
      className={`rounded-[12px] overflow-hidden transition-shadow duration-200 border ${
        isExpanded
          ? "bg-white shadow-md border-[#021b59]/10"
          : "bg-white shadow-sm hover:shadow-md border-[#e8e8e8]"
      }`}
      aria-label={`Mensagem${isUnread ? " não lida" : ""}: ${message.subject}`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        className="w-full text-left px-[20px] py-[16px] flex items-start gap-[14px] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59] focus-visible:rounded-[12px] focus-visible:outline-offset-[-2px]"
      >
        {/* Avatar do professor */}
        <div className="shrink-0 size-[42px] rounded-full bg-[#021b59] flex items-center justify-center mt-[2px]">
          <span
            aria-hidden="true"
            className="font-['Figtree:Bold',sans-serif] font-bold text-[#ffeac4] text-[14px] select-none"
          >
            ES
          </span>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          {/* Professor + data */}
          <div className="flex items-center justify-between gap-[8px] flex-wrap">
            <div className="flex items-center gap-[8px]">
              <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#021b59] text-[14px] leading-[20px]">
                {PROFESSOR_NAME}
              </span>
              {isUnread && (
                <span
                  className="inline-block size-[8px] rounded-full bg-[#0643de] shrink-0"
                  aria-label="Não lida"
                />
              )}
            </div>
            <time
              dateTime={message.sentAt}
              className="font-['Figtree:Regular',sans-serif] font-normal text-[#8e8e8e] text-[12px] leading-[18px] shrink-0"
            >
              {formatDateShort(message.sentAt)}
            </time>
          </div>

          {/* Assunto */}
          <p
            className={`text-[16px] leading-[24px] mt-[4px] truncate ${
              isUnread
                ? "font-['Figtree:Bold',sans-serif] font-bold text-[#021b59]"
                : "font-['Figtree:Medium',sans-serif] font-medium text-[#333]"
            }`}
          >
            {message.subject}
          </p>

          {/* Preview */}
          {!isExpanded && (
            <p className="font-['Figtree:Regular',sans-serif] font-normal text-[#606060] text-[14px] leading-[20px] mt-[2px] line-clamp-2">
              {preview}
            </p>
          )}

          {/* Tag de destinatário */}
          {!isExpanded && (
            <span className="mt-[6px] inline-block bg-[#ffeac4] text-[#021b59] font-['Figtree:Medium',sans-serif] font-medium text-[11px] leading-[16px] px-[10px] py-[2px] rounded-[20px] truncate max-w-[260px]">
              Para: {message.recipientLabel}
            </span>
          )}
        </div>

        {/* Chevron */}
        <div className="shrink-0 mt-[2px]" aria-hidden="true">
          {isExpanded ? (
            <ChevronUp className="size-[20px] text-[#021b59]" />
          ) : (
            <ChevronDown className="size-[20px] text-[#8e8e8e]" />
          )}
        </div>
      </button>

      {/* Corpo expandido */}
      {isExpanded && (
        <div className="px-[20px] pb-[20px]">
          <div className="border-t border-[#e8e8e8] pt-[16px] flex flex-col gap-[14px]">
            {/* Meta */}
            <div className="bg-[#f5f8ff] rounded-[10px] px-[16px] py-[12px] flex flex-col gap-[6px]">
              <div className="flex items-center gap-[6px]">
                <span className="font-['Figtree:Regular',sans-serif] text-[#8e8e8e] text-[12px] uppercase tracking-wide w-[64px] shrink-0">
                  De:
                </span>
                <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#021b59] text-[13px]">
                  {PROFESSOR_NAME}
                </span>
              </div>
              <div className="flex items-center gap-[6px]">
                <span className="font-['Figtree:Regular',sans-serif] text-[#8e8e8e] text-[12px] uppercase tracking-wide w-[64px] shrink-0">
                  Para:
                </span>
                <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#021b59] text-[13px]">
                  {message.recipientLabel}
                </span>
              </div>
              <div className="flex items-center gap-[6px]">
                <span className="font-['Figtree:Regular',sans-serif] text-[#8e8e8e] text-[12px] uppercase tracking-wide w-[64px] shrink-0">
                  Data:
                </span>
                <span className="font-['Figtree:Regular',sans-serif] text-[#606060] text-[13px]">
                  {formatDate(message.sentAt)}
                </span>
              </div>
            </div>

            {/* Corpo da mensagem */}
            <p className="font-['Figtree:Regular',sans-serif] font-normal text-[#333] text-[16px] leading-[26px] whitespace-pre-wrap">
              {message.body}
            </p>
          </div>
        </div>
      )}
    </article>
  );
}

// ─── MensagensEstudantePage ───────────────────────────────────────────────────

export function StudentMessagesPage() {
  const navigate = useNavigate();
  const { currentUser, sentMessages } = useAuthStore();
  const { enrolledCourses } = useCourseStore();

  if (!currentUser) {
    return null;
  }

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  // Filtra mensagens relevantes: destinadas a "all" ou a cursos matriculados
  const receivedMessages = sentMessages.filter(
    (msg) =>
      msg.recipientId === "all" || enrolledCourses.includes(msg.recipientId),
  );

  const handleToggle = (id: string) => {
    setExpandedId((prev) => {
      const next = prev === id ? null : id;
      if (next) setReadIds((r) => new Set([...r, next]));
      return next;
    });
  };

  const unreadCount = receivedMessages.filter((m) => !readIds.has(m.id)).length;

  const initials = (() => {
    const parts = currentUser.nome.trim().split(/\s+/);
    if (parts.length >= 2)
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  })();

  return (
    <div className="min-h-screen bg-white">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header
        className="relative px-[20px] md:px-[40px] py-[32px]"
        style={{
          backgroundImage:
            "linear-gradient(rgb(2, 27, 89) 0%, rgb(2, 29, 94) 8.3333%, rgb(2, 30, 99) 16.667%, rgb(2, 32, 104) 25%, rgb(3, 33, 110) 33.333%, rgb(3, 35, 115) 41.667%, rgb(3, 36, 120) 50%, rgb(3, 38, 126) 58.333%, rgb(3, 40, 131) 66.667%, rgb(3, 41, 136) 75%, rgb(4, 43, 142) 83.333%, rgb(4, 44, 147) 91.667%, rgb(4, 46, 153) 100%)",
        }}
      >
        <div className="max-w-[900px] mx-auto">
          {/* Voltar + breadcrumb */}
          <div className="mb-[16px]">
            <button
              type="button"
              onClick={() => navigate("/courses")}
              className="flex items-center gap-[8px] text-[#ffeac4] hover:text-white transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#ffeac4] rounded-[6px] min-h-[44px]"
              aria-label="Voltar para cursos"
            >
              <ChevronLeft className="size-[20px]" aria-hidden="true" />
              <span className="font-['Figtree:Medium',sans-serif] font-medium text-[16px]">
                Voltar
              </span>
            </button>
            <nav aria-label="Breadcrumb" className="mt-[14px]">
              <ol className="flex items-center gap-[4px] text-[13px]">
                <li>
                  <button
                    type="button"
                    onClick={() => navigate("/courses")}
                    className="font-['Figtree:Regular',sans-serif] text-[rgba(255,234,196,0.7)] hover:text-[#ffeac4] transition-colors focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#ffeac4] rounded-[4px] min-h-[44px] inline-flex items-center"
                  >
                    Cursos
                  </button>
                </li>
                <li aria-hidden="true" className="text-[rgba(255,234,196,0.4)]">
                  ›
                </li>
                <li>
                  <span className="font-['Figtree:Regular',sans-serif] text-[rgba(255,234,196,0.5)]">
                    Mensagens
                  </span>
                </li>
              </ol>
            </nav>
          </div>

          {/* Avatar + nome */}
          <div className="flex flex-col items-center gap-[2px]">
            <div className="relative mb-[12px]">
              <div className="size-[110px] rounded-full bg-[#042e99] border-4 border-[#ffeac4] flex items-center justify-center overflow-hidden">
                {currentUser.fotoUrl ? (
                  <img
                    src={currentUser.fotoUrl}
                    alt=""
                    className="size-full object-cover"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="font-['Figtree:Bold',sans-serif] font-bold text-[#ffeac4] text-[36px]"
                  >
                    {initials}
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <span
                  className="absolute top-0 right-0 size-[26px] rounded-full bg-[#de2e66] border-2 border-white flex items-center justify-center"
                  aria-label={`${unreadCount} mensagem${unreadCount > 1 ? "s" : ""} não lida${unreadCount > 1 ? "s" : ""}`}
                >
                  <span className="font-['Figtree:Bold',sans-serif] font-bold text-white text-[11px]">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                </span>
              )}
            </div>
            <p className="font-['Figtree:Bold',sans-serif] font-bold text-[#ffeac4] text-[22px]">
              {currentUser.nome}
            </p>
            <p className="font-['Figtree:Regular',sans-serif] text-[rgba(255,234,196,0.8)] text-[14px]">
              Estudante
            </p>
          </div>
        </div>
      </header>

      {/* ── Conteúdo principal ───────────────────────────────────────────────── */}
      <main
        id="main-content"
        className="max-w-[900px] mx-auto px-[20px] md:px-[40px] py-[32px]"
      >
        {/* Título + contador */}
        <div className="flex items-center justify-between gap-[12px] mb-[24px] pb-[16px] border-b-2 border-[#021b59] flex-wrap gap-y-[8px]">
          <div className="flex items-center gap-[10px]">
            <h1 className="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[20px] leading-[30px]">
              Caixa de entrada
            </h1>
            {unreadCount > 0 && (
              <span
                className="bg-[#0643de] text-white font-['Figtree:Bold',sans-serif] font-bold text-[12px] leading-[18px] px-[10px] py-[2px] rounded-[20px]"
                aria-label={`${unreadCount} não lida${unreadCount > 1 ? "s" : ""}`}
              >
                {unreadCount} não lida{unreadCount > 1 ? "s" : ""}
              </span>
            )}
          </div>
          <span className="font-['Figtree:Regular',sans-serif] text-[#8e8e8e] text-[13px]">
            {receivedMessages.length} mensagem
            {receivedMessages.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Aviso informativo */}
        <div className="bg-[#f5f8ff] border border-[#c5d6ff] rounded-[12px] px-[16px] py-[12px] flex items-start gap-[12px] mb-[24px]">
          <svg
            className="size-[18px] shrink-0 mt-[2px]"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
              fill="#021b59"
            />
          </svg>
          <p className="font-['Figtree:Regular',sans-serif] text-[#021b59] text-[14px] leading-[22px]">
            Estas são as mensagens enviadas pelo seu professor para os cursos em
            que você está matriculado.
          </p>
        </div>

        {/* Lista de mensagens */}
        {receivedMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-[60px] gap-[16px]">
            <div className="size-[64px] rounded-full bg-[#c5d6ff] flex items-center justify-center">
              <Inbox
                className="size-[30px] text-[#021b59]"
                aria-hidden="true"
              />
            </div>
            <p className="font-['Figtree:Regular',sans-serif] font-normal text-[#606060] text-[16px] leading-[24px] text-center">
              Nenhuma mensagem recebida ainda.
            </p>
            <p className="font-['Figtree:Regular',sans-serif] text-[#8e8e8e] text-[14px] leading-[22px] text-center max-w-[320px]">
              As mensagens dos seus professores aparecerão aqui quando você
              estiver inscrito em um curso.
            </p>
          </div>
        ) : (
          <div
            className="flex flex-col gap-[10px]"
            aria-label={`${receivedMessages.length} mensagem${receivedMessages.length !== 1 ? "s" : ""} recebida${receivedMessages.length !== 1 ? "s" : ""}`}
          >
            {receivedMessages.map((msg) => (
              <MessageCard
                key={msg.id}
                message={msg}
                isExpanded={expandedId === msg.id}
                onToggle={() => handleToggle(msg.id)}
                isUnread={!readIds.has(msg.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  PenSquare,
  Send,
  Inbox,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import type { IMessageCardProps } from "@/types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

// ─── MessageCard ──────────────────────────────────────────────────────────────

function MessageCard({ message, isExpanded, onToggle }: IMessageCardProps) {
  const preview =
    message.body.length > 120 ? message.body.slice(0, 120) + "…" : message.body;

  return (
    <article
      className={`bg-white rounded-[12px] overflow-hidden transition-shadow duration-200 ${
        isExpanded ? "shadow-md" : "shadow-sm hover:shadow-md"
      }`}
      aria-label={`Mensagem: ${message.subject}`}
    >
      {/* Card header — always visible */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        className="w-full text-left px-[20px] py-[16px] flex items-start gap-[14px] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59] focus-visible:rounded-[12px] focus-visible:outline-offset-[-2px]"
      >
        {/* Icon */}
        <div className="shrink-0 size-[40px] rounded-full bg-[#c5d6ff] flex items-center justify-center mt-[2px]">
          <Send
            className="size-[18px] text-[#021b59]"
            aria-hidden="true"
            style={{ transform: "scaleX(-1)" }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Recipient tag + date */}
          <div className="flex items-center justify-between gap-[8px] flex-wrap">
            <span className="inline-block bg-[#021b59] text-[#ffeac4] font-['Figtree:Medium',sans-serif] font-medium text-[11px] leading-[16px] px-[10px] py-[2px] rounded-[20px] truncate max-w-[240px]">
              {message.recipientLabel}
            </span>
            <time
              dateTime={message.sentAt}
              className="font-['Figtree:Regular',sans-serif] font-normal text-[#8e8e8e] text-[12px] leading-[18px] shrink-0"
            >
              {formatDateShort(message.sentAt)}
            </time>
          </div>

          {/* Subject */}
          <p className="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[16px] leading-[24px] mt-[4px] truncate">
            {message.subject}
          </p>

          {/* Preview (hidden when expanded) */}
          {!isExpanded && (
            <p className="font-['Figtree:Regular',sans-serif] font-normal text-[#606060] text-[14px] leading-[20px] mt-[2px] line-clamp-2">
              {preview}
            </p>
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

      {/* Expanded body */}
      {isExpanded && (
        <div className="px-[20px] pb-[20px]">
          <div className="border-t border-[#e8e8e8] pt-[16px]">
            {/* Full date */}
            <p className="font-['Figtree:Regular',sans-serif] font-normal text-[#8e8e8e] text-[12px] leading-[18px] mb-[12px]">
              Enviado em {formatDate(message.sentAt)}
            </p>
            {/* Body text */}
            <p className="font-['Figtree:Regular',sans-serif] font-normal text-[#333] text-[16px] leading-[24px] whitespace-pre-wrap">
              {message.body}
            </p>
          </div>
        </div>
      )}
    </article>
  );
}

// ─── MensagensPage ────────────────────────────────────────────────────────────

export function MessagesPage() {
  const navigate = useNavigate();
  const { currentUser, sentMessages } = useAuthStore();

  if (!currentUser) {
    return null;
  }

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const initials = currentUser.nome
    .split(" ")
    .map((namePart: string) => namePart[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-[#ffffff]">
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <header
        className="relative px-[20px] md:px-[40px] py-[32px]"
        style={{
          backgroundImage:
            "linear-gradient(rgb(2, 27, 89) 0%, rgb(2, 29, 94) 8.3333%, rgb(2, 30, 99) 16.667%, rgb(2, 32, 104) 25%, rgb(3, 33, 110) 33.333%, rgb(3, 35, 115) 41.667%, rgb(3, 36, 120) 50%, rgb(3, 38, 126) 58.333%, rgb(3, 40, 131) 66.667%, rgb(3, 41, 136) 75%, rgb(4, 43, 142) 83.333%, rgb(4, 44, 147) 91.667%, rgb(4, 46, 153) 100%)",
        }}
      >
        <div className="max-w-[900px] mx-auto">
          {/* Back + breadcrumb */}
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

          {/* Avatar + name */}
          <div className="flex flex-col items-center gap-[2px]">
            <div className="relative mb-[12px]">
              <div className="size-[110px] rounded-full bg-[#042e99] border-4 border-[#ffeac4] flex items-center justify-center overflow-hidden">
                {sentMessages.length > 0 ? (
                  <span
                    aria-hidden="true"
                    className="font-['Figtree:Bold',sans-serif] font-bold text-[#ffeac4] text-[36px]"
                  >
                    {initials}
                  </span>
                ) : (
                  <span
                    aria-hidden="true"
                    className="font-['Figtree:Bold',sans-serif] font-bold text-[#ffeac4] text-[36px]"
                  >
                    {initials}
                  </span>
                )}
              </div>
            </div>
            <p className="font-['Figtree:Bold',sans-serif] font-bold text-[#ffeac4] text-[22px]">
              Minhas Mensagens
            </p>
            <p className="font-['Figtree:Regular',sans-serif] text-[rgba(255,234,196,0.8)] text-[14px]">
              Professor
            </p>
          </div>
        </div>
      </header>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <main className="max-w-[900px] mx-auto px-[20px] md:px-[40px] py-[32px]">
        {/* Title row + new message button */}
        <div className="flex items-center justify-between gap-[16px] mb-[24px] pb-[16px] border-b-2 border-[#021b59] flex-wrap gap-y-[12px]">
          <h1 className="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[20px] leading-[30px]">
            Mensagens enviadas
          </h1>

          <button
            type="button"
            onClick={() => navigate("/message")}
            className="flex items-center gap-[8px] bg-[#021b59] text-[#ffeac4] h-[44px] px-[20px] rounded-[26px] font-['Figtree:Medium',sans-serif] font-medium text-[15px] hover:bg-[#042e99] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59] focus-visible:outline-offset-[2px] shrink-0"
            aria-label="Criar nova mensagem"
          >
            <PenSquare className="size-[16px]" aria-hidden="true" />
            Nova mensagem
          </button>
        </div>

        {/* Message list */}
        {sentMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-[60px] gap-[16px]">
            <div className="size-[64px] rounded-full bg-[#c5d6ff] flex items-center justify-center">
              <Inbox
                className="size-[30px] text-[#021b59]"
                aria-hidden="true"
              />
            </div>
            <p className="font-['Figtree:Regular',sans-serif] font-normal text-[#606060] text-[16px] leading-[24px] text-center">
              Nenhuma mensagem enviada ainda.
            </p>
            <button
              type="button"
              onClick={() => navigate("/message")}
              className="flex items-center gap-[8px] bg-[#021b59] text-[#ffeac4] h-[44px] px-[24px] rounded-[26px] font-['Figtree:Medium',sans-serif] font-medium text-[15px] hover:bg-[#042e99] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59] focus-visible:outline-offset-[2px]"
            >
              <PenSquare className="size-[16px]" aria-hidden="true" />
              Criar primeira mensagem
            </button>
          </div>
        ) : (
          <div
            className="flex flex-col gap-[12px]"
            aria-label={`${sentMessages.length} mensagem${sentMessages.length !== 1 ? "s" : ""} enviada${sentMessages.length !== 1 ? "s" : ""}`}
          >
            {sentMessages.map((msg) => (
              <MessageCard
                key={msg.id}
                message={msg}
                isExpanded={expandedId === msg.id}
                onToggle={() => handleToggle(msg.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

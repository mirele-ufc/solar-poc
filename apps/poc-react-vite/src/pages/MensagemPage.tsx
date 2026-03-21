import { useState, useId } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft } from "lucide-react";
import { useApp } from "@/app/context/AppContext";

// ⚠️ PROTÓTIPO: dados mockados no cliente.
// Em produção, a lista de cursos e estudantes deve vir de uma API autenticada.
const COURSES = [
  { id: "power-bi", name: "Power BI - Fundamentos" },
  { id: "python", name: "Python Iniciante" },
  { id: "matematica", name: "Matemática básica" },
  { id: "estrutura-dados", name: "Estrutura de Dados" },
];

export function MensagemPage() {
  const navigate = useNavigate();
  const { user, sendMessage } = useApp();
  
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  
  const recipientId = useId();
  const subjectId = useId();
  const messageId = useId();
  
  // ✅ Segurança: verificação de autorização no cliente é apenas UX.
  // Em produção, o servidor DEVE validar que o usuário é professor antes de aceitar a mensagem.
  const isTeacher = user.role === "professor";
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // ✅ Validação cliente é apenas UX — servidor DEVE revalidar todos os campos
    if (!recipient || !subject || !message) {
      return;
    }
    
    // ⚠️ PROTÓTIPO: simulação de envio.
    // Em produção, isso seria uma chamada POST autenticada ao servidor.
    const recipientLabel =
      recipient === "all"
        ? "Alunos de todos os cursos"
        : `Alunos de ${COURSES.find((c) => c.id === recipient)?.name ?? recipient}`;

    sendMessage({ recipientId: recipient, recipientLabel, subject, body: message });
    
    // Mostrar mensagem de sucesso
    setShowSuccess(true);
    
    // Resetar formulário
    setRecipient("");
    setSubject("");
    setMessage("");
    
    // Esconder mensagem de sucesso após 3 segundos
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };
  
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  return (
    <div className="min-h-screen bg-[#ffffff]">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header
        className="relative px-[40px] py-[32px]"
        style={{
          backgroundImage:
            "linear-gradient(rgb(2, 27, 89) 0%, rgb(2, 29, 94) 8.3333%, rgb(2, 30, 99) 16.667%, rgb(2, 32, 104) 25%, rgb(3, 33, 110) 33.333%, rgb(3, 35, 115) 41.667%, rgb(3, 36, 120) 50%, rgb(3, 38, 126) 58.333%, rgb(3, 40, 131) 66.667%, rgb(3, 41, 136) 75%, rgb(4, 43, 142) 83.333%, rgb(4, 44, 147) 91.667%, rgb(4, 46, 153) 100%)",
        }}
      >
        <div className="max-w-[900px] mx-auto">
          {/* Back button and breadcrumb */}
          <div className="mb-[16px]">
            <button
              type="button"
              onClick={() => navigate("/cursos")}
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
                    onClick={() => navigate("/cursos")}
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
                    Mensagem
                  </span>
                </li>
              </ol>
            </nav>
          </div>

          {/* User info */}
          <div className="flex flex-col items-center gap-[2px]">
            {/* Avatar */}
            <div className="relative mb-[12px]">
              <div className="size-[110px] rounded-full bg-[#042e99] border-4 border-[#ffeac4] flex items-center justify-center overflow-hidden">
                {user.photoUrl ? (
                  <img
                    src={user.photoUrl}
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
            </div>

            {/* Name and role */}
            <p className="font-['Figtree:Bold',sans-serif] font-bold text-[#ffeac4] text-[22px]">
              {user.name}
            </p>
            <p className="font-['Figtree:Regular',sans-serif] text-[rgba(255,234,196,0.8)] text-[14px]">
              {user.role === "professor" ? "Professor" : "Estudante"}
            </p>
          </div>
        </div>
      </header>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <main className="max-w-[900px] mx-auto px-[40px] py-[32px]">
        {/* Success message */}
        {showSuccess && (
          <div
            role="status"
            aria-live="polite"
            className="mb-[20px] bg-[#1C3A99] text-white px-[24px] py-[16px] rounded-[12px] shadow-md"
          >
            <p className="font-['Figtree:Medium',sans-serif] font-medium text-[16px]">
              ✓ Mensagem enviada com sucesso!
            </p>
          </div>
        )}

        {/* Page heading */}
        <div className="mb-[20px] pb-[2px] border-b-2 border-[#021b59]">
          <h1 className="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[20px]">
            Mensagem
          </h1>
        </div>

        {/* ✅ Acessibilidade: uso de <form> semântico com labels apropriados */}
        <form onSubmit={handleSubmit} className="space-y-[20px]">
          {/* Recipient field */}
          <div>
            <label
              htmlFor={recipientId}
              className="block font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[16px] mb-[4px]"
            >
              Destinatário
            </label>
            <select
              id={recipientId}
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              required
              aria-required="true"
              className="w-full h-[56px] px-[21px] border border-[#5f5f5f] rounded-[12px] bg-white font-['Figtree:Regular',sans-serif] text-[16px] text-[#333] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59] focus-visible:border-[#021b59]"
            >
              <option value="">Selecione um destinatário</option>
              <option value="all">Alunos de todos os cursos</option>
              {COURSES.map((course) => (
                <option key={course.id} value={course.id}>
                  Alunos de {course.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subject field */}
          <div>
            <label
              htmlFor={subjectId}
              className="block font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[16px] mb-[4px]"
            >
              Assunto
            </label>
            <input
              type="text"
              id={subjectId}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              aria-required="true"
              maxLength={200}
              className="w-full h-[56px] px-[21px] border border-[#5f5f5f] rounded-[12px] bg-white font-['Figtree:Regular',sans-serif] text-[16px] text-[#333] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59] focus-visible:border-[#021b59]"
              placeholder="Digite o assunto da mensagem"
            />
          </div>

          {/* Message field */}
          <div>
            <label
              htmlFor={messageId}
              className="block font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[16px] mb-[4px]"
            >
              Texto da mensagem
            </label>
            <textarea
              id={messageId}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              aria-required="true"
              maxLength={2000}
              rows={10}
              className="w-full px-[21px] py-[16px] border border-[#5f5f5f] rounded-[12px] bg-white font-['Figtree:Regular',sans-serif] text-[16px] text-[#333] resize-vertical min-h-[222px] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59] focus-visible:border-[#021b59]"
              placeholder="Digite sua mensagem"
            />
          </div>

          {/* Submit button */}
          <div>
            <button
              type="submit"
              className="bg-[#ffeac4] border-2 border-[#ffeac4] h-[50px] px-[32px] rounded-[26px] font-['Figtree:Medium',sans-serif] font-medium text-[#021b59] text-[18px] hover:bg-[#021b59] hover:text-[#ffeac4] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59] focus-visible:outline-offset-2"
            >Enviar mensagem</button>
          </div>
        </form>

        {/* ⚠️ Segurança: Aviso sobre autenticação */}
        {!isTeacher && (
          <div
            role="alert"
            className="mt-[20px] bg-[#c0392b] text-white px-[24px] py-[16px] rounded-[12px]"
          >
            <p className="font-['Figtree:Medium',sans-serif] font-medium text-[16px]">
              Acesso restrito a professores.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
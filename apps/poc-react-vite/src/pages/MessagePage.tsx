import { useState, useId } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/store/useAuthStore";
import {
  composeMessageSchema,
  type ComposeMessageFormValues,
} from "@/validations/messageSchema";

// ⚠️ PROTÓTIPO: dados mockados no cliente.
// Em produção, a lista de cursos e estudantes deve vir de uma API autenticada.
const COURSES = [
  { id: "power-bi", name: "Power BI - Fundamentos" },
  { id: "python", name: "Python Iniciante" },
  { id: "matematica", name: "Matemática básica" },
  { id: "estrutura-dados", name: "Estrutura de Dados" },
];

export function MessagePage() {
  const navigate = useNavigate();
  const { currentUser, sendMessage } = useAuthStore();

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ComposeMessageFormValues>({
    resolver: zodResolver(composeMessageSchema),
    defaultValues: {
      recipient: "",
      subject: "",
      message: "",
    },
  });

  const form = watch();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const recipientId = useId();
  const subjectId = useId();
  const messageId = useId();

  const onSubmitValid = (values: ComposeMessageFormValues) => {
    setGeneralError("");
    setShowErrors(false);

    // ⚠️ PROTÓTIPO: simulação de envio.
    // Em produção, isso seria uma chamada POST autenticada ao servidor.
    const recipientLabel =
      values.recipient === "all"
        ? "Alunos de todos os cursos"
        : `Alunos de ${COURSES.find((c) => c.id === values.recipient)?.name ?? values.recipient}`;

    sendMessage({
      recipientId: values.recipient,
      recipientLabel,
      subject: values.subject,
      body: values.message,
    });

    // Mostrar mensagem de sucesso
    setShowSuccess(true);

    // Resetar formulário
    setValue("recipient", "");
    setValue("subject", "");
    setValue("message", "");

    // Esconder mensagem de sucesso após 3 segundos
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  const onSubmitInvalid = () => {
    setGeneralError(
      "Por favor, preencha os campos obrigatórios para enviar a mensagem",
    );
    setShowErrors(true);
  };

  const initials = currentUser.name
    .split(" ")
    .map((n: string) => n[0])
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
                {currentUser.photoUrl ? (
                  <img
                    src={currentUser.photoUrl}
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
              {currentUser.name}
            </p>
            <p className="font-['Figtree:Regular',sans-serif] text-[rgba(255,234,196,0.8)] text-[14px]">
              Professor
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

        {showErrors && generalError && (
          <div
            role="alert"
            className="mb-[20px] bg-[#c0392b] border border-[#c0392b] text-white px-[24px] py-[16px] rounded-[12px]"
          >
            <p className="font-['Figtree:Medium',sans-serif] font-medium text-[16px]">
              {generalError}
            </p>
          </div>
        )}

        {/* ✅ Acessibilidade: uso de <form> semântico com labels apropriados */}
        <form
          onSubmit={handleSubmit(onSubmitValid, onSubmitInvalid)}
          className="space-y-[20px]"
        >
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
              value={form.recipient}
              onChange={(e) =>
                setValue("recipient", e.target.value, {
                  shouldDirty: true,
                  shouldValidate: showErrors,
                })
              }
              required
              aria-required="true"
              aria-invalid={
                showErrors && !!errors.recipient ? "true" : undefined
              }
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
            {showErrors && !!errors.recipient && (
              <p className="font-['Figtree:Regular',sans-serif] font-normal text-[14px] mt-[4px] text-[#c0392b]">
                {errors.recipient.message}
              </p>
            )}
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
              value={form.subject}
              onChange={(e) =>
                setValue("subject", e.target.value, {
                  shouldDirty: true,
                  shouldValidate: showErrors,
                })
              }
              required
              aria-required="true"
              maxLength={200}
              aria-invalid={showErrors && !!errors.subject ? "true" : undefined}
              className="w-full h-[56px] px-[21px] border border-[#5f5f5f] rounded-[12px] bg-white font-['Figtree:Regular',sans-serif] text-[16px] text-[#333] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59] focus-visible:border-[#021b59]"
              placeholder="Digite o assunto da mensagem"
            />
            {showErrors && !!errors.subject && (
              <p className="font-['Figtree:Regular',sans-serif] font-normal text-[14px] mt-[4px] text-[#c0392b]">
                {errors.subject.message}
              </p>
            )}
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
              value={form.message}
              onChange={(e) =>
                setValue("message", e.target.value, {
                  shouldDirty: true,
                  shouldValidate: showErrors,
                })
              }
              required
              aria-required="true"
              maxLength={2000}
              rows={10}
              aria-invalid={showErrors && !!errors.message ? "true" : undefined}
              className="w-full px-[21px] py-[16px] border border-[#5f5f5f] rounded-[12px] bg-white font-['Figtree:Regular',sans-serif] text-[16px] text-[#333] resize-vertical min-h-[222px] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59] focus-visible:border-[#021b59]"
              placeholder="Digite sua mensagem"
            />
            {showErrors && !!errors.message && (
              <p className="font-['Figtree:Regular',sans-serif] font-normal text-[14px] mt-[4px] text-[#c0392b]">
                {errors.message.message}
              </p>
            )}
          </div>

          {/* Submit button */}
          <div>
            <button
              type="submit"
              className="bg-[#ffeac4] border-2 border-[#ffeac4] h-[50px] px-[32px] rounded-[26px] font-['Figtree:Medium',sans-serif] font-medium text-[#021b59] text-[18px] hover:bg-[#021b59] hover:text-[#ffeac4] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59] focus-visible:outline-offset-2"
            >
              Enviar mensagem
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

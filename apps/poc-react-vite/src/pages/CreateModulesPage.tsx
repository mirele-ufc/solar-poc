import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CourseInfoData } from "./CreateCoursePage";
import { PageHeader } from "@/components/shared/PageHeader";
import { Modal } from "@/components/ui/modal";
import {
  createModulesSchema,
  type CreateModulesFormValues,
} from "@/validations/courseSchema";
import { imageFileSchema, lessonFileSchema } from "@/validations/fileSchema";
import { createModuleWithBackend } from "@/services/moduleService";
import { createLessonWithBackend } from "@/services/lessonService";

// ── SVG paths ──────────────────────────────────────────────────────────────────
const docPath =
  "M19.6667 5.66667H7.66667V27H23.6667V9.66667H19.6667V5.66667ZM7.66667 3H21L26.3333 8.33333V27C26.3333 27.7072 26.0524 28.3855 25.5523 28.8856C25.0522 29.3857 24.3739 29.6667 23.6667 29.6667H7.66667C6.95942 29.6667 6.28115 29.3857 5.78105 28.8856C5.28095 28.3855 5 27.7072 5 27V5.66667C5 4.95942 5.28095 4.28115 5.78105 3.78105C6.28115 3.28095 6.95942 3 7.66667 3ZM10.3333 15H21V17.6667H10.3333V15ZM10.3333 20.3333H21V23H10.3333V20.3333Z";
const closeLgPath =
  "M12.4332 14.0828L5.83333 7.483L7.483 5.83333L14.0828 12.4332L20.6827 5.83333L22.3323 7.483L15.7325 14.0828L22.3323 20.6827L20.6827 22.3323L14.0828 15.7325L7.483 22.3323L5.83333 20.6827L12.4332 14.0828Z";
const checkPath = "M5 9L3 11L9 17L19 7L17 5L9 13L5 9Z";
const imgIconPath =
  "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z";

type Lesson = {
  id: string;
  backendLessonId?: string;
  name: string;
  file: string | null;
  fileBlob?: File;
  contentEditor?: string | null;
};

type LessonDraft = Pick<Lesson, "name" | "file" | "fileBlob" | "contentEditor">;

type Module = {
  id: string;
  backendModuleId?: string;
  name: string;
  image: string | null;
  lessons: Lesson[];
};

let nextId = 1;
const uid = () => String(nextId++);

// ── Two-step add-lesson popup ──────────────────────────────────────────────────
function AddLessonPopup({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: (lesson: LessonDraft) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [lessonName, setLessonName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [aiText, setAiText] = useState("");

  const handleStep1 = () => {
    if (!lessonName.trim()) {
      setError("Informe o nome da aula.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) {
      setSelectedFile(null);
      return;
    }

    const parsed = lessonFileSchema.safeParse(f);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Arquivo inválido");
      setSelectedFile(null);
      return;
    }

    setError("");
    setSelectedFile(f);
  };

  const handleConfirm = () => {
    onConfirm({
      name: lessonName.trim(),
      file: selectedFile?.name ?? null,
      fileBlob: selectedFile ?? undefined,
      contentEditor: aiText.trim() || null,
    });
    onClose();
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      aria-label="Adicionar aula"
      className="w-full max-w-[420px] rounded-[16px] p-0 shadow-2xl"
      overlayClassName="px-[20px]"
    >
      <div className="p-[24px] flex flex-col gap-[20px]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[10px]">
            {step === 2 && (
              <button
                type="button"
                aria-label="Voltar"
                onClick={() => {
                  setStep(1);
                  setSelectedFile(null);
                }}
                className="size-[44px] flex items-center justify-center hover:bg-[#f5f5f5] rounded focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59]"
              >
                <span className="text-[#021b59] text-[18px] leading-none">
                  ‹
                </span>
              </button>
            )}
            <p className="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[20px]">
              {step === 1 ? "Adicionar Aula" : "Confirmar Aula"}
            </p>
          </div>
          <div className="size-[44px]" aria-hidden="true" />
        </div>

        {/* Step indicator */}
        <div
          className="flex items-center gap-[8px]"
          aria-label={`Passo ${step} de 2`}
        >
          <div className="flex-1 h-[4px] rounded-full bg-[#021b59]" />
          <div
            className={`flex-1 h-[4px] rounded-full transition-colors ${step === 2 ? "bg-[#021b59]" : "bg-[#e0e0e0]"}`}
          />
        </div>

        {/* ── Step 1: Lesson name ── */}
        {step === 1 && (
          <>
            <div className="flex flex-col gap-[6px]">
              <label
                htmlFor="lesson-name"
                className="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[18px]"
              >
                Nome da aula
              </label>
              <div className="border border-[#8e8e8e] rounded-[12px] h-[50px] relative">
                <input
                  id="lesson-name"
                  type="text"
                  placeholder="Ex: Aula 01"
                  value={lessonName}
                  onChange={(e) => setLessonName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleStep1();
                  }}
                  className="w-full h-full px-[16px] font-['Figtree:Regular',sans-serif] text-[16px] text-[#333] placeholder-[#8e8e8e] bg-transparent outline-none rounded-[12px]"
                  autoFocus
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 pointer-events-none focus-within:outline focus-within:outline-[2px] focus-within:outline-[#021b59] rounded-[12px]"
                />
              </div>
              {error && (
                <p role="alert" className="text-[#c0392b] text-[13px]">
                  {error}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={handleStep1}
              className="bg-[#ffeac4] h-[46px] w-full rounded-[26px] cursor-pointer hover:bg-[#ffd9a0] transition-colors focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59]"
            >
              <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[18px]">
                Próximo
              </span>
            </button>
          </>
        )}

        {/* ── Step 2: Confirm name + file upload ── */}
        {step === 2 && (
          <>
            {/* Show saved lesson name as read-only */}
            <div className="bg-[#c5d6ff] rounded-[12px] px-[16px] py-[12px] flex items-center gap-[10px]">
              <svg
                className="size-[22px] shrink-0"
                fill="none"
                viewBox="0 0 22 22"
                aria-hidden="true"
              >
                <path
                  clipRule="evenodd"
                  d={checkPath}
                  fill="#021b59"
                  fillRule="evenodd"
                />
              </svg>
              <div>
                <p className="font-['Figtree:Regular',sans-serif] text-[12px] text-[#595959]">
                  Nome salvo:
                </p>
                <p className="font-['Figtree:Medium',sans-serif] font-medium text-[#021b59] text-[17px]">
                  {lessonName}
                </p>
              </div>
            </div>

            {/* File upload */}
            <div className="flex flex-col gap-[6px]">
              <p className="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[18px]">
                Arquivo da aula{" "}
                <span className="text-[#8e8e8e] text-[14px] font-normal">
                  (opcional)
                </span>
              </p>
              <button
                type="button"
                aria-label="Selecionar arquivo para a aula"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-[72px] border border-dashed border-[#8e8e8e] rounded-[12px] flex items-center justify-center hover:bg-[#f5f5f5] transition-colors focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59]"
              >
                <p className="font-['Figtree:Regular',sans-serif] font-normal text-[#606060] text-[14px] text-center px-[10px]">
                  {selectedFile
                    ? `✓ ${selectedFile.name}`
                    : "Clique para selecionar um PDF ou documento de texto"}
                </p>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.md,.doc,.docx,.odt,text/plain,text/markdown,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.oasis.opendocument.text"
                className="hidden"
                aria-hidden="true"
                tabIndex={-1}
                onChange={handleFileChange}
              />
            </div>

            {/* AI Quiz generation */}
            <div className="flex flex-col gap-[6px]">
              <label
                htmlFor="ai-quiz-text"
                className="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[18px]"
              >
                Gerar quiz com IA{" "}
                <span className="text-[#8e8e8e] text-[14px] font-normal">
                  (opcional)
                </span>
              </label>
              <p className="font-['Figtree:Regular',sans-serif] text-[#606060] text-[13px] leading-[20px]">
                Cole um texto abaixo e a IA gerará automaticamente um quiz para
                a aula.
              </p>
              <div className="relative border border-[#8e8e8e] rounded-[12px] overflow-hidden focus-within:outline focus-within:outline-[2px] focus-within:outline-[#021b59]">
                <textarea
                  id="ai-quiz-text"
                  rows={5}
                  placeholder="Cole aqui o conteúdo que será usado para gerar as perguntas…"
                  value={aiText}
                  onChange={(e) => setAiText(e.target.value)}
                  className="w-full px-[14px] py-[12px] font-['Figtree:Regular',sans-serif] text-[14px] text-[#333] placeholder-[#8e8e8e] bg-transparent outline-none resize-none leading-[22px]"
                />
                {aiText && (
                  <div className="flex items-center justify-between px-[14px] py-[8px] bg-[#f5f8ff] border-t border-[#e0e0e0]">
                    <span className="font-['Figtree:Regular',sans-serif] text-[#606060] text-[12px]">
                      {aiText.trim().split(/\s+/).length} palavras detectadas
                    </span>
                    <button
                      type="button"
                      onClick={() => setAiText("")}
                      className="font-['Figtree:Regular',sans-serif] text-[#de2e66] text-[12px] hover:underline focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59] rounded"
                      aria-label="Limpar texto colado"
                    >
                      Limpar
                    </button>
                  </div>
                )}
              </div>
              {aiText.trim().split(/\s+/).length >= 20 && (
                <button
                  type="button"
                  onClick={() => {
                    /* TODO: integrar com API de IA para geração do quiz */
                    alert(
                      "Quiz gerado pela IA com base no texto fornecido. (Funcionalidade em desenvolvimento)",
                    );
                  }}
                  className="flex items-center justify-center gap-[8px] h-[40px] w-full rounded-[26px] bg-[#021b59] hover:bg-[#042e99] transition-colors focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59]"
                >
                  <svg
                    className="size-[16px] shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 2L9.09 8.26L2 9.27L7 14.14L5.82 21.02L12 17.77L18.18 21.02L17 14.14L22 9.27L14.91 8.26L12 2Z"
                      fill="#ffeac4"
                    />
                  </svg>
                  <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#ffeac4] text-[15px]">
                    Gerar quiz com IA
                  </span>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleConfirm}
              className="bg-[#ffeac4] h-[46px] w-full rounded-[26px] cursor-pointer hover:bg-[#ffd9a0] transition-colors focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59]"
            >
              <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[18px]">
                Finalizar
              </span>
            </button>
          </>
        )}
      </div>
    </Modal>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export function CreateModulesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const courseData = (location.state?.courseData ?? {}) as CourseInfoData;

  const [modules, setModules] = useState<Module[]>([]);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [showErrors, setShowErrors] = useState(false);
  const [isSavingModules, setIsSavingModules] = useState(false);
  const [moduleImageFiles, setModuleImageFiles] = useState<
    Record<string, File | undefined>
  >({});
  const {
    setValue,
    trigger,
    formState: { errors },
  } = useForm<CreateModulesFormValues>({
    resolver: zodResolver(createModulesSchema),
    defaultValues: {
      modules: [],
    },
  });

  // per-module image input refs
  const imgRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    const moduleValues = modules.map((moduleItem) => ({
      imageFile: moduleImageFiles[moduleItem.id],
    }));
    setValue("modules", moduleValues, {
      shouldDirty: true,
      shouldValidate: showErrors,
    });
  }, [modules, moduleImageFiles, setValue, showErrors]);

  const addModule = () => {
    const n = modules.length + 1;
    setModules((prev) => [
      ...prev,
      {
        id: uid(),
        name: `Módulo ${String(n).padStart(2, "0")}`,
        image: null,
        lessons: [],
      },
    ]);
  };

  const removeLesson = (modId: string, lessonId: string) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === modId
          ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) }
          : m,
      ),
    );
  };

  const removeModule = (modId: string) => {
    setModules((prev) => prev.filter((m) => m.id !== modId));
    setModuleImageFiles((prev) => {
      const next = { ...prev };
      delete next[modId];
      return next;
    });
  };

  const handleAddLesson = (modId: string, lessonDraft: LessonDraft) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === modId
          ? {
              ...m,
              lessons: [
                ...m.lessons,
                {
                  id: uid(),
                  name: lessonDraft.name,
                  file: lessonDraft.file,
                  fileBlob: lessonDraft.fileBlob,
                  contentEditor: lessonDraft.contentEditor,
                },
              ],
            }
          : m,
      ),
    );
  };

  const handleModuleImageChange = (
    modId: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const parsed = imageFileSchema.safeParse(file);
    if (!parsed.success) {
      setShowErrors(true);
      setError(parsed.error.issues[0]?.message ?? "Arquivo inválido");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setModules((prev) =>
        prev.map((m) =>
          m.id === modId ? { ...m, image: reader.result as string } : m,
        ),
      );
      setModuleImageFiles((prev) => ({ ...prev, [modId]: file }));
    };
    reader.readAsDataURL(file);
    setError("");
  };

  const handleNext = async () => {
    setShowErrors(true);
    const isValid = await trigger("modules");

    if (!isValid) {
      const moduleErrors = Array.isArray(errors.modules) ? errors.modules : [];
      const firstModuleError = moduleErrors.find(
        (moduleError) => moduleError?.imageFile?.message,
      )?.imageFile?.message;
      setError(
        firstModuleError ??
          "Por favor, preencha os campos destacados para finalizar o cadastro",
      );
      setShowErrors(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (!courseData.backendCourseId) {
      setError(
        "O curso ainda não foi criado no backend. Volte para a etapa anterior e tente novamente.",
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setError("");
    setIsSavingModules(true);

    try {
      const persistedModules: Module[] = [];

      for (const moduleItem of modules) {
        let persistedModule = { ...moduleItem };

        if (!persistedModule.backendModuleId) {
          const createdModule = await createModuleWithBackend(
            courseData.backendCourseId,
            {
              name: moduleItem.name.trim(),
            },
            moduleImageFiles[moduleItem.id],
          );

          persistedModule = {
            ...persistedModule,
            backendModuleId: String(createdModule.id),
            image: moduleItem.image ?? createdModule.imagePath,
          };
        }

        const backendModuleId = persistedModule.backendModuleId;

        if (!backendModuleId) {
          throw new Error(
            "Não foi possível identificar o módulo criado no backend.",
          );
        }

        const persistedLessons: Lesson[] = [];

        for (const lesson of persistedModule.lessons) {
          if (lesson.backendLessonId) {
            persistedLessons.push(lesson);
            continue;
          }

          const createdLesson = await createLessonWithBackend(
            backendModuleId,
            {
              name: lesson.name.trim(),
              contentEditor: lesson.contentEditor?.trim() || undefined,
            },
            lesson.fileBlob,
          );

          persistedLessons.push({
            ...lesson,
            backendLessonId: String(createdLesson.id),
            file: lesson.file ?? createdLesson.filePath,
            contentEditor:
              lesson.contentEditor ?? createdLesson.contentEditor ?? null,
          });
        }

        persistedModule = {
          ...persistedModule,
          lessons: persistedLessons,
        };

        persistedModules.push(persistedModule);
      }

      setModules(persistedModules);
      navigate("/create-course/exam", {
        state: { courseData, modules: persistedModules },
      });
    } catch (apiError) {
      const err = apiError as { message?: string; status?: number };
      if (err.status === 400 || err.status === 422) {
        setError("Dados inválidos para criação dos módulos. Revise os campos.");
      } else if (err.status === 404) {
        setError(
          "Curso não encontrado no backend. Recrie o curso e tente novamente.",
        );
      } else {
        setError(
          err.message || "Não foi possível criar os módulos no momento.",
        );
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSavingModules(false);
    }
  };

  return (
    <div className="bg-white flex flex-col pb-[100px]">
      {/* Error banner */}
      {error && (
        <div
          role="alert"
          className="w-full bg-[#c0392b]/10 border-l-4 border-[#c0392b] px-[20px] py-[14px]"
        >
          <p className="font-['Figtree:Medium',sans-serif] font-medium text-[#c0392b] text-[15px]">
            {error}
          </p>
        </div>
      )}

      <div className="max-w-[900px] mx-auto flex flex-col gap-[20px] px-[20px] md:px-[40px] pt-[24px] w-full">
        {/* Page header with back + breadcrumb */}
        <PageHeader
          title="Estrutura de Módulos"
          backPath="/create-course"
          crumbs={[
            { label: "Courses", path: "/courses" },
            { label: "Create Course", path: "/create-course" },
            { label: "Modules" },
          ]}
        />

        <h2 className="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[20px] leading-[30px]">
          {courseData.title || "Novo Curso"} — Estrutura
        </h2>

        {/* Module cards */}
        {modules.length === 0 ? (
          <div className="flex flex-col items-center gap-[12px] py-[40px] text-center bg-[#f5f8ff] rounded-[12px]">
            <p className="font-['Figtree:Medium',sans-serif] font-medium text-[#021b59] text-[16px]">
              Adicione módulos ao curso
            </p>
            <p className="font-['Figtree:Regular',sans-serif] font-normal text-[#595959] text-[14px]">
              Clique em &quot;Adicionar módulo&quot; para estruturar o conteúdo.
            </p>
          </div>
        ) : (
          modules.map((mod, modIndex) => {
            const moduleError = errors.modules?.[modIndex]?.imageFile?.message;
            const imgMissing = showErrors && !!moduleError;
            return (
              <div
                key={mod.id}
                className={`border w-full rounded-[8px] overflow-hidden ${imgMissing ? "border-[#c0392b]" : "border-black"}`}
              >
                <div className="flex flex-col gap-[14px] p-[16px] pb-0">
                  <div className="flex items-center justify-between gap-[8px]">
                    <p className="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[20px] leading-[30px]">
                      {mod.name}
                    </p>
                    {modules.length > 1 && (
                      <button
                        type="button"
                        aria-label={`Excluir ${mod.name}`}
                        onClick={() => removeModule(mod.id)}
                        className="shrink-0 flex items-center gap-[6px] px-[12px] h-[32px] rounded-[26px] border border-[#801436] text-[#801436] hover:bg-[#801436]/10 transition-colors focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#801436]"
                      >
                        <svg
                          className="size-[14px]"
                          fill="none"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
                            stroke="#801436"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="font-['Figtree:Medium',sans-serif] font-medium text-[13px] leading-none">
                          Excluir módulo
                        </span>
                      </button>
                    )}
                  </div>

                  {/* Module image upload */}
                  <button
                    type="button"
                    aria-label={`Adicionar imagem para ${mod.name} (opcional)`}
                    onClick={() => imgRefs.current[mod.id]?.click()}
                    className={`w-full h-[140px] rounded-[8px] overflow-hidden flex flex-col items-center justify-center transition-colors focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59] ${mod.image ? "" : imgMissing ? "bg-[#c0392b]/10 border-2 border-dashed border-[#c0392b]" : "bg-[#f0f0f0] border-2 border-dashed border-[#8e8e8e] hover:bg-[#e8e8e8]"}`}
                  >
                    {mod.image ? (
                      <img
                        src={mod.image}
                        alt={`Imagem de ${mod.name}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        <svg
                          className="size-[32px] mb-[6px]"
                          fill="none"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            d={imgIconPath}
                            stroke={imgMissing ? "#c0392b" : "#595959"}
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <p
                          className={`font-['Figtree:Regular',sans-serif] text-[14px] ${imgMissing ? "text-[#c0392b]" : "text-[#595959]"}`}
                        >
                          {imgMissing
                            ? moduleError
                            : "Clique para adicionar imagem do módulo (opcional)"}
                        </p>
                      </>
                    )}
                  </button>
                  <input
                    ref={(el) => {
                      imgRefs.current[mod.id] = el;
                    }}
                    type="file"
                    accept="image/jpeg,image/png"
                    className="hidden"
                    aria-hidden="true"
                    tabIndex={-1}
                    onChange={(e) => handleModuleImageChange(mod.id, e)}
                  />

                  {/* Lessons */}
                  {mod.lessons.length === 0 && (
                    <div className="bg-[#efbbdc] h-[52px] flex items-center px-[20px] rounded-[4px]">
                      <p className="font-['Figtree:Medium',sans-serif] font-medium text-black text-[17px]">
                        Nenhuma aula adicionada
                      </p>
                    </div>
                  )}
                  {mod.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="bg-[#c5d6ff] h-[52px] flex items-center justify-between px-[16px] rounded-[4px]"
                    >
                      <p className="font-['Figtree:Medium',sans-serif] font-medium text-black text-[17px] flex-1 min-w-0 truncate">
                        {lesson.name}
                        {lesson.file && (
                          <span className="ml-[8px] font-['Figtree:Regular',sans-serif] font-normal text-[13px] text-[#021b59]/70">
                            · {lesson.file}
                          </span>
                        )}
                      </p>
                      <div className="flex items-center gap-[6px] shrink-0 ml-[10px]">
                        {/* Edit file button */}
                        <label
                          aria-label={`Editar arquivo de ${lesson.name}`}
                          title={`Editar arquivo de ${lesson.name}`}
                          className="shrink-0 size-[26px] flex items-center justify-center cursor-pointer rounded hover:bg-[#021b59]/10 transition-colors focus-within:outline focus-within:outline-[2px] focus-within:outline-[#021b59]"
                        >
                          <input
                            type="file"
                            accept=".pdf,.txt,.md,.doc,.docx,.odt,text/plain,text/markdown,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.oasis.opendocument.text"
                            className="sr-only"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (!f) return;
                              const parsed = lessonFileSchema.safeParse(f);
                              if (!parsed.success) {
                                setError(
                                  parsed.error.issues[0]?.message ??
                                    "Arquivo inválido",
                                );
                                setShowErrors(true);
                                return;
                              }
                              setModules((prev) =>
                                prev.map((m) =>
                                  m.id === mod.id
                                    ? {
                                        ...m,
                                        lessons: m.lessons.map((l) =>
                                          l.id === lesson.id
                                            ? {
                                                ...l,
                                                file: f.name,
                                                fileBlob: f,
                                              }
                                            : l,
                                        ),
                                      }
                                    : m,
                                ),
                              );
                            }}
                          />
                          <svg
                            className="size-[16px]"
                            fill="none"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              d="M15.232 5.232l3.536 3.536M9 11l6.586-6.586a2 2 0 012.828 0l.172.172a2 2 0 010 2.828L12 14H9v-3z"
                              stroke="#021b59"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M5 19h14"
                              stroke="#021b59"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                            />
                          </svg>
                        </label>
                        {/* Remove button */}
                        <button
                          type="button"
                          aria-label={`Remover ${lesson.name}`}
                          onClick={() => removeLesson(mod.id, lesson.id)}
                          className="shrink-0 size-[26px] focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59] rounded"
                        >
                          <svg
                            className="size-full"
                            fill="none"
                            viewBox="0 0 28 28"
                            aria-hidden="true"
                          >
                            <path
                              clipRule="evenodd"
                              d={closeLgPath}
                              fill="#801436"
                              fillRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add lesson button — inside the module card */}
                <div className="p-[16px]">
                  <button
                    type="button"
                    onClick={() => setActiveModuleId(mod.id)}
                    className="h-[48px] w-full border-2 border-[#021b59] rounded-[26px] flex items-center justify-center gap-[8px] cursor-pointer hover:bg-[#021b59]/5 transition-colors focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59]"
                  >
                    <svg
                      className="size-[24px] shrink-0"
                      fill="none"
                      viewBox="0 0 32 32.6667"
                      aria-hidden="true"
                    >
                      <path d={docPath} fill="#021B59" />
                    </svg>
                    <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[18px]">
                      Adicionar aula
                    </span>
                  </button>
                </div>
              </div>
            );
          })
        )}

        {/* Add module */}
        <button
          type="button"
          onClick={addModule}
          className="h-[50px] w-full border-2 border-[#021b59] rounded-[26px] flex items-center justify-center gap-[8px] cursor-pointer hover:bg-[#021b59]/5 transition-colors focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59]"
        >
          <svg
            className="size-[28px] shrink-0"
            fill="none"
            viewBox="0 0 32 32.6667"
            aria-hidden="true"
          >
            <path d={docPath} fill="#021B59" />
          </svg>
          <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[20px]">
            Adicionar módulo
          </span>
        </button>
      </div>

      {/* Two-step popup */}
      {activeModuleId && (
        <AddLessonPopup
          onClose={() => setActiveModuleId(null)}
          onConfirm={(lessonDraft) =>
            handleAddLesson(activeModuleId, lessonDraft)
          }
        />
      )}

      {/* Sticky Próximo */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-[20px] py-[16px] shadow-[0px_-4px_12px_rgba(51,51,51,0.15)] flex justify-center z-10">
        <div className="w-full max-w-[900px]">
          <button
            type="button"
            onClick={handleNext}
            disabled={isSavingModules}
            aria-busy={isSavingModules}
            className="bg-[#ffeac4] h-[50px] w-full rounded-[26px] cursor-pointer hover:bg-[#ffd9a0] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[20px]">
              {isSavingModules ? "Processando..." : "Próximo"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

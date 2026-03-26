import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "@/components/shared/PageHeader";
import {
  createCourseSchema,
  type CreateCourseFormValues,
} from "@/validations/courseSchema";
import { imageFileSchema } from "@/validations/fileSchema";

const fileImagePath =
  "M19.5 6.5H52L65 19.5V65C65 66.7239 64.3152 68.3772 63.0962 69.5962C61.8772 70.8152 60.2239 71.5 58.5 71.5H19.5C17.7761 71.5 16.1228 70.8152 14.9038 69.5962C13.6848 68.3772 13 66.7239 13 65V13C13 11.2761 13.6848 9.62279 14.9038 8.40381C16.1228 7.18482 17.7761 6.5 19.5 6.5ZM49.309 13H19.5V65H58.5V22.191H49.309V13ZM48.75 45.5C47.888 45.5 47.0614 45.1576 46.4519 44.5481C45.8424 43.9386 45.5 43.112 45.5 42.25C45.5 41.388 45.8424 40.5614 46.4519 39.9519C47.0614 39.3424 47.888 39 48.75 39C49.612 39 50.4386 39.3424 51.0481 39.9519C51.6576 40.5614 52 41.388 52 42.25C52 43.112 51.6576 43.9386 51.0481 44.5481C50.4386 45.1576 49.612 45.5 48.75 45.5ZM26 52L35.9775 42.25L45.5 52L48.75 48.75L52 52V58.5H26V52Z";

const checkPath = "M5 9L3 11L9 17L19 7L17 5L9 13L5 9Z";
const requiredFieldOptions = ["Endereço", "Gênero", "Idade"];

export type CourseInfoData = {
  image: string | null;
  title: string;
  description: string;
  category: string;
  hours: string;
  requiredFields: string[];
};

function FieldInput({
  label,
  placeholder,
  id,
  value,
  onChange,
  hasError,
}: {
  label: string;
  placeholder: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  hasError?: boolean;
}) {
  return (
    <div className="flex flex-col gap-[4px] w-full">
      <label
        htmlFor={id}
        className="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[20px] leading-[30px]"
      >
        {label}
      </label>
      <div
        className={`bg-white h-[56px] w-full border rounded-[8px] relative ${hasError ? "border-[#c0392b]" : "border-[#8e8e8e]"}`}
      >
        <input
          id={id}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full px-[20px] font-['Figtree:Regular',sans-serif] font-normal text-[16px] text-[#333] placeholder-[#8e8e8e] bg-transparent outline-none rounded-[8px]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none focus-within:outline focus-within:outline-[3px] focus-within:outline-[#021b59] focus-within:outline-offset-[-1px] rounded-[8px]"
        />
      </div>
    </div>
  );
}

export function CreateCoursePage() {
  const navigate = useNavigate();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const {
    watch,
    setValue,
    resetField,
    trigger,
    formState: { errors },
  } = useForm<CreateCourseFormValues>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      hours: "",
      requiredFields: [],
    },
  });

  const form = watch();
  const [error, setError] = useState("");
  const [showFieldErrors, setShowFieldErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const setField = (
    key: "title" | "description" | "category" | "hours",
    value: string,
  ) => {
    setValue(key, value, {
      shouldDirty: true,
      shouldValidate: showFieldErrors,
    });
  };

  const toggleRequired = (field: string) => {
    const current = form.requiredFields ?? [];
    const next = current.includes(field)
      ? current.filter((f) => f !== field)
      : [...current, field];
    setValue("requiredFields", next, {
      shouldDirty: true,
      shouldValidate: showFieldErrors,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const parsed = imageFileSchema.safeParse(file);
    if (!parsed.success) {
      resetField("coverFile");
      setImagePreview(null);
      setShowFieldErrors(true);
      setError(parsed.error.issues[0]?.message ?? "Arquivo inválido");
      return;
    }

    setValue("coverFile", file, { shouldDirty: true, shouldValidate: true });
    const reader = new FileReader();
    reader.onload = () =>
      setImagePreview(typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(file);
    setError("");
  };

  const handleNext = async () => {
    setShowFieldErrors(true);
    const isValid = await trigger();

    if (!isValid) {
      setError(
        "Por favor, preencha os campos destacados para finalizar o cadastro",
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsLoading(true);
    setError("");
    const courseData: CourseInfoData = {
      image: imagePreview,
      title: form.title,
      description: form.description,
      category: form.category,
      hours: form.hours,
      requiredFields: form.requiredFields,
    };
    navigate("/create-course/modules", { state: { courseData } });
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

      {/* Image placeholder */}
      <button
        type="button"
        aria-label="Clique para adicionar imagem do curso (obrigatório)"
        onClick={() => imageInputRef.current?.click()}
        className={`w-full h-[218px] md:h-[280px] flex flex-col items-center justify-center hover:bg-[#3a3a3a] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59] overflow-hidden ${showFieldErrors && !!errors.coverFile ? "bg-[#c0392b]/20 outline outline-2 outline-[#c0392b]" : "bg-[#484848]"}`}
      >
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="Capa do curso"
            className="w-full h-full object-cover"
          />
        ) : (
          <>
            <svg
              className="size-[78px]"
              fill="none"
              viewBox="0 0 78 78"
              aria-hidden="true"
            >
              <path
                clipRule="evenodd"
                d={fileImagePath}
                fill="white"
                fillRule="evenodd"
              />
            </svg>
            {showFieldErrors && !!errors.coverFile && (
              <p className="text-white text-[14px] mt-[8px] font-['Figtree:Medium',sans-serif] font-medium">
                {errors.coverFile.message}
              </p>
            )}
          </>
        )}
      </button>
      <input
        ref={imageInputRef}
        type="file"
        accept="image/jpeg,image/png"
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
        onChange={handleImageChange}
      />

      <div className="max-w-[900px] mx-auto flex flex-col gap-[20px] px-[20px] md:px-[40px] pt-[24px] w-full">
        {/* Page header with back + breadcrumb */}
        <PageHeader
          title="Criar Curso"
          backPath="/courses"
          crumbs={[
            { label: "Cursos", path: "/courses" },
            { label: "Criar Curso" },
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
          <FieldInput
            label="Título do curso"
            placeholder="Digite o título"
            id="titulo"
            value={form.title}
            onChange={(v) => setField("title", v)}
            hasError={showFieldErrors && !!errors.title}
          />
          <FieldInput
            label="Categoria"
            placeholder="Ex: Computação, Design"
            id="categoria"
            value={form.category}
            onChange={(v) => setField("category", v)}
            hasError={showFieldErrors && !!errors.category}
          />
        </div>
        <FieldInput
          label="Descrição"
          placeholder="Descreva o curso"
          id="descricao"
          value={form.description}
          onChange={(v) => setField("description", v)}
          hasError={showFieldErrors && !!errors.description}
        />
        <FieldInput
          label="Carga horária"
          placeholder="Ex: 30h"
          id="horas"
          value={form.hours}
          onChange={(v) => setField("hours", v)}
          hasError={showFieldErrors && !!errors.hours}
        />

        {/* Required registration fields */}
        <div className="flex flex-col gap-[10px]">
          <p className="font-['Figtree:Medium',sans-serif] font-medium text-black text-[18px] leading-[28px]">
            Selecione quais dados os cadastrados deverão informar para cursar:
          </p>
          <div className="flex flex-col gap-[4px]">
            {requiredFieldOptions.map((field) => {
              const checked = form.requiredFields.includes(field);
              return (
                <button
                  key={field}
                  type="button"
                  role="checkbox"
                  aria-checked={checked}
                  onClick={() => toggleRequired(field)}
                  className="flex items-center gap-[12px] py-[8px] text-left w-fit focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59] rounded-sm"
                >
                  <div
                    className={`size-[22px] border-2 border-[#021b59] rounded-[4px] flex items-center justify-center flex-shrink-0 transition-colors ${checked ? "bg-[#ffeac4]" : "bg-white"}`}
                  >
                    {checked && (
                      <svg
                        className="size-[14px]"
                        fill="none"
                        viewBox="0 0 22 22"
                        aria-hidden="true"
                      >
                        <path
                          clipRule="evenodd"
                          d={checkPath}
                          fill="#021B59"
                          fillRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="font-['Figtree:Regular',sans-serif] font-normal text-black text-[16px]">
                    {field}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sticky Próximo */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-[20px] py-[16px] shadow-[0px_-4px_12px_rgba(51,51,51,0.15)] flex justify-center z-10">
        <div className="w-full max-w-[900px]">
          <button
            type="button"
            onClick={handleNext}
            disabled={isLoading}
            aria-busy={isLoading}
            className="bg-[#ffeac4] h-[50px] w-full rounded-[26px] cursor-pointer hover:bg-[#ffd9a0] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[20px]">
              {isLoading ? "Processando..." : "Próximo"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

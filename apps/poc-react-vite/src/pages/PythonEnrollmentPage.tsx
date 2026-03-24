import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCourseStore } from "@/store/useCourseStore";
import { PageHeader } from "@/components/shared/PageHeader";
import {
  enrollmentSchema,
  type EnrollmentFormValues,
} from "@/validations/enrollmentSchema";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1624953587687-daf255b6b80a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxweXRob24lMjBwcm9ncmFtbWluZyUyMGNvZGUlMjBjb21wdXRlcnxlbnwxfHx8fDE3NzMzMzU2MTd8MA&ixlib=rb-4.1.0&q=80&w=1080";

const dropdownArrow =
  "M1.5275 2L6.5 6.96167L11.4725 2L13 3.5275L6.5 10.0275L0 3.5275L1.5275 2Z";
const generos = ["Prefiro não informar", "Masculino", "Feminino", "Outro"];

function TextField({
  label,
  placeholder,
  id,
  value,
  onChange,
  hasError,
  errorMessage,
}: {
  label: string;
  placeholder: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  hasError?: boolean;
  errorMessage?: string;
}) {
  return (
    <div className="flex flex-col w-full gap-[2px]">
      <label
        htmlFor={id}
        className="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] text-[#333] text-[20px]"
      >
        {label}
      </label>
      <div
        className={`bg-white h-[60px] w-full rounded-[12px] relative ${hasError ? "border-2 border-[#c0392b]" : "border border-[#5f5f5f]"}`}
      >
        <div className="flex items-center px-[20px] py-[12px] h-full">
          <input
            id={id}
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-invalid={hasError ? "true" : undefined}
            aria-describedby={
              hasError && errorMessage ? `${id}-error` : undefined
            }
            className="flex-1 font-['Figtree:Regular',sans-serif] font-normal text-[16px] text-[#333] placeholder-[#595959] bg-transparent outline-none focus-visible:outline-none"
          />
        </div>
        <div
          aria-hidden="true"
          className={`absolute inset-0 pointer-events-none rounded-[12px] ${hasError ? "" : "focus-within:outline focus-within:outline-[3px] focus-within:outline-[#021b59] focus-within:outline-offset-[-1px]"}`}
        />
      </div>
      {hasError && errorMessage && (
        <p
          id={`${id}-error`}
          className="font-['Figtree:Regular',sans-serif] font-normal text-[14px] mt-[4px] text-[#c0392b]"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
}

export function PythonEnrollmentPage() {
  const navigate = useNavigate();
  const { enrollInCourse } = useCourseStore();
  const {
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<EnrollmentFormValues>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      city: "",
      gender: "",
    },
  });

  const form = watch();
  const [generoOpen, setGeneroOpen] = useState(false);

  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [showErrors, setShowErrors] = useState(false);

  const topRef = useRef<HTMLDivElement>(null);

  const handleFinalizar = async () => {
    setShowErrors(true);
    const isValid = await trigger();

    if (!isValid) {
      setStatus("error");
      topRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    enrollInCourse("python");
    setStatus("success");
    topRef.current?.scrollIntoView({ behavior: "smooth" });

    setTimeout(() => {
      navigate("/courses/python/modules");
    }, 1800);
  };

  return (
    <div className="bg-white flex flex-col pb-[100px]">
      {/* Alert banner */}
      <div ref={topRef}>
        {status === "success" && (
          <div
            role="alert"
            aria-live="polite"
            className="w-full bg-[#e6f9ee] border-l-4 border-[#155724] px-[20px] py-[14px] flex items-center gap-[12px]"
          >
            <svg
              className="size-[20px] shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                stroke="#155724"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="font-['Figtree:Medium',sans-serif] font-medium text-[#155724] text-[15px]">
              Inscrição realizada com sucesso! Redirecionando para os módulos…
            </p>
          </div>
        )}
        {status === "error" && (
          <div
            className="bg-[#c0392b] border border-[#c0392b] rounded-[12px] p-[16px] w-full mb-[12px]"
            role="alert"
          >
            <p className="font-['Figtree:Medium',sans-serif] font-medium text-white text-[15px]">
              Por favor, preencha os campos destacados para finalizar a
              inscrição
            </p>
          </div>
        )}
      </div>

      {/* Hero */}
      <div className="w-full h-[218px] md:h-[300px] overflow-hidden">
        <img
          src={HERO_IMAGE}
          alt="Python – código e programação"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Form */}
      <div className="max-w-[900px] mx-auto flex flex-col gap-[16px] px-[20px] md:px-[40px] pt-[24px] w-full">
        <PageHeader
          title="Inscrição"
          backPath="/courses/python"
          crumbs={[
            { label: "Cursos", path: "/courses" },
            { label: "Python Iniciante", path: "/courses/python" },
            { label: "Inscrição" },
          ]}
        />

        <h2 className="font-['Figtree:Bold',sans-serif] font-bold leading-[36px] text-black text-[22px]">
          Python Iniciante
        </h2>
        <p className="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] text-black text-[20px]">
          Confirme seus dados
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
          <TextField
            label="Nome"
            placeholder="Insira seu nome"
            id="nome"
            value={form.firstName}
            onChange={(value) =>
              setValue("firstName", value, {
                shouldDirty: true,
                shouldValidate: showErrors,
              })
            }
            hasError={showErrors && !!errors.firstName}
            errorMessage={errors.firstName?.message}
          />
          <TextField
            label="Sobrenome"
            placeholder="Insira seu sobrenome"
            id="sobrenome"
            value={form.lastName}
            onChange={(value) =>
              setValue("lastName", value, {
                shouldDirty: true,
                shouldValidate: showErrors,
              })
            }
            hasError={showErrors && !!errors.lastName}
            errorMessage={errors.lastName?.message}
          />
        </div>
        <TextField
          label="Cidade"
          placeholder="Insira o nome da cidade onde você mora"
          id="cidade"
          value={form.city}
          onChange={(value) =>
            setValue("city", value, {
              shouldDirty: true,
              shouldValidate: showErrors,
            })
          }
          hasError={showErrors && !!errors.city}
          errorMessage={errors.city?.message}
        />

        {/* Gênero */}
        <div className="flex flex-col w-full gap-[2px]">
          <label
            htmlFor="genero"
            className="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] text-[#333] text-[20px]"
          >
            Gênero
          </label>
          <div className="relative">
            <button
              type="button"
              id="genero"
              aria-haspopup="listbox"
              aria-expanded={generoOpen}
              onClick={() => setGeneroOpen(!generoOpen)}
              className={`bg-white h-[60px] w-full rounded-[12px] flex items-center gap-[10px] px-[20px] py-[12px] relative ${showErrors && !!errors.gender ? "border-2 border-[#c0392b]" : "border border-[#5f5f5f]"}`}
            >
              <span
                className={`flex-1 text-left font-['Figtree:Regular',sans-serif] font-normal text-[16px] ${form.gender ? "text-[#333]" : "text-[#595959]"}`}
              >
                {form.gender || "Selecione uma opção"}
              </span>
              <svg
                className="size-[13px] shrink-0 transition-transform"
                fill="none"
                viewBox="0 0 13 10.03"
                aria-hidden="true"
                style={{ transform: generoOpen ? "rotate(180deg)" : "none" }}
              >
                <path d={dropdownArrow} fill="#021B59" />
              </svg>
            </button>
            {generoOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setGeneroOpen(false)}
                  aria-hidden="true"
                />
                <ul
                  role="listbox"
                  aria-label="Gênero"
                  className="absolute left-0 right-0 top-[60px] bg-white border border-[#5f5f5f] z-30 shadow-lg"
                >
                  {generos.map((g) => (
                    <li key={g}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={form.gender === g}
                        onClick={() => {
                          setValue("gender", g, {
                            shouldDirty: true,
                            shouldValidate: showErrors,
                          });
                          setGeneroOpen(false);
                        }}
                        className="w-full text-left px-[20px] py-[14px] font-['Figtree:Regular',sans-serif] font-normal text-[16px] text-[#333] hover:bg-[#ffeac4]/40 focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59]"
                      >
                        {g}
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          {showErrors && !!errors.gender && (
            <p className="font-['Figtree:Regular',sans-serif] font-normal text-[14px] mt-[4px] text-[#c0392b]">
              {errors.gender.message}
            </p>
          )}
        </div>

        <p className="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] text-[#595959] text-[16px]">
          Seus dados serão utilizados para emissão da sua declaração.
        </p>
      </div>

      {/* Sticky button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-[20px] py-[16px] shadow-[0px_-4px_12px_rgba(51,51,51,0.15)] flex justify-center z-10">
        <div className="w-full max-w-[900px]">
          <button
            type="button"
            onClick={handleFinalizar}
            disabled={status === "success"}
            className="bg-[#ffeac4] h-[50px] w-full rounded-[26px] cursor-pointer hover:bg-[#ffd9a0] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59] focus-visible:outline-offset-[2px] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[20px]">
              Finalizar inscrição
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

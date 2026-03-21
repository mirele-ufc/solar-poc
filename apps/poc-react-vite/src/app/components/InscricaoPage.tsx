import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../context/AppContext";
import { PageHeader } from "@/components/shared/PageHeader";

const fileImagePath =
  "M19.5 6.5H52L65 19.5V65C65 66.7239 64.3152 68.3772 63.0962 69.5962C61.8772 70.8152 60.2239 71.5 58.5 71.5H19.5C17.7761 71.5 16.1228 70.8152 14.9038 69.5962C13.6848 68.3772 13 66.7239 13 65V13C13 11.2761 13.6848 9.62279 14.9038 8.40381C16.1228 7.18482 17.7761 6.5 19.5 6.5ZM49.309 13H19.5V65H58.5V22.191H49.309V13ZM48.75 45.5C47.888 45.5 47.0614 45.1576 46.4519 44.5481C45.8424 43.9386 45.5 43.112 45.5 42.25C45.5 41.388 45.8424 40.5614 46.4519 39.9519C47.0614 39.3424 47.888 39 48.75 39C49.612 39 50.4386 39.3424 51.0481 39.9519C51.6576 40.5614 52 41.388 52 42.25C52 43.112 51.6576 43.9386 51.0481 44.5481C50.4386 45.1576 49.612 45.5 48.75 45.5ZM26 52L35.9775 42.25L45.5 52L48.75 48.75L52 52V58.5H26V52Z";
const dropdownArrow = "M1.5275 2L6.5 6.96167L11.4725 2L13 3.5275L6.5 10.0275L0 3.5275L1.5275 2Z";

const generos = ["Prefiro não informar", "Masculino", "Feminino", "Outro"];

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1759661966728-4a02e3c6ed91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwdmlzdWFsaXphdGlvbiUyMGJ1c2luZXNzJTIwaW50ZWxsaWdlbmNlJTIwZGFzaGJvYXJkfGVufDF8fHx8MTc3MzMzNTYxNHww&ixlib=rb-4.1.0&q=80&w=1080";

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
        className={`bg-white h-[60px] w-full rounded-[12px] relative ${
          hasError ? "border-2 border-[#c0392b]" : "border border-[#5f5f5f]"
        }`}
      >
        <div className="flex items-center px-[20px] py-[12px] h-full">
          <input
            id={id}
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 font-['Figtree:Regular',sans-serif] font-normal text-[16px] text-[#333] placeholder-[#595959] bg-transparent outline-none focus-visible:outline-none"
          />
        </div>
        <div
          aria-hidden="true"
          className={`absolute inset-0 pointer-events-none rounded-[12px] ${
            hasError ? "" : "focus-within:outline focus-within:outline-[3px] focus-within:outline-[#021b59] focus-within:outline-offset-[-1px]"
          }`}
        />
      </div>
      {hasError && errorMessage && (
        <p className="font-['Figtree:Regular',sans-serif] font-normal text-[14px] mt-[4px] text-[#c0392b]">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

export function InscricaoPage() {
  const navigate = useNavigate();
  const { enroll } = useApp();

  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [cidade, setCidade] = useState("");
  const [genero, setGenero] = useState("");
  const [generoOpen, setGeneroOpen] = useState(false);

  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [showErrors, setShowErrors] = useState(false);

  const topRef = useRef<HTMLDivElement>(null);

  const handleFinalizar = () => {
    const missing = !nome.trim() || !sobrenome.trim() || !cidade.trim() || !genero;

    if (missing) {
      setStatus("error");
      setShowErrors(true);
      topRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    enroll("power-bi");
    setStatus("success");
    topRef.current?.scrollIntoView({ behavior: "smooth" });

    // Navigate after brief delay so user can see success message
    setTimeout(() => {
      navigate("/cursos/power-bi/modulos");
    }, 1800);
  };

  return (
    <div className="bg-white flex flex-col pb-[100px]">

      {/* Alert banner (top) */}
      <div ref={topRef}>
        {status === "success" && (
          <div
            role="alert"
            aria-live="polite"
            className="w-full bg-[#e6f9ee] border-l-4 border-[#155724] px-[20px] py-[14px] flex items-center gap-[12px]"
          >
            <svg className="size-[20px] shrink-0" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#155724" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
              Por favor, preencha os campos destacados para finalizar a inscrição
            </p>
          </div>
        )}
      </div>

      {/* Hero image */}
      <div className="w-full h-[218px] md:h-[300px] overflow-hidden">
        <img
          src={HERO_IMAGE}
          alt="Power BI – dashboard interativo"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Form */}
      <div className="max-w-[900px] mx-auto flex flex-col gap-[16px] px-[20px] md:px-[40px] pt-[24px] w-full">

        {/* Page header with back + breadcrumb */}
        <PageHeader
          title="Inscrição"
          backPath="/cursos/power-bi"
          crumbs={[
            { label: "Cursos", path: "/cursos" },
            { label: "Power BI - Fundamentos", path: "/cursos/power-bi" },
            { label: "Inscrição" },
          ]}
        />

        <h2 className="font-['Figtree:Bold',sans-serif] font-bold leading-[36px] text-black text-[22px]">
          Power BI - Fundamentos
        </h2>
        <p className="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] text-black text-[20px]">
          Confirme seus dados
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
          <TextField
            label="Nome"
            placeholder="Insira seu nome"
            id="nome"
            value={nome}
            onChange={setNome}
            hasError={showErrors && !nome.trim()}
            errorMessage="Nome não informado"
          />
          <TextField
            label="Sobrenome"
            placeholder="Insira seu sobrenome"
            id="sobrenome"
            value={sobrenome}
            onChange={setSobrenome}
            hasError={showErrors && !sobrenome.trim()}
            errorMessage="Sobrenome não informado"
          />
        </div>
        <TextField
          label="Cidade"
          placeholder="Insira o nome da cidade onde você mora"
          id="cidade"
          value={cidade}
          onChange={setCidade}
          hasError={showErrors && !cidade.trim()}
          errorMessage="Cidade não informada"
        />

        {/* Gênero dropdown */}
        <div className="flex flex-col w-full gap-[2px]">
          <label htmlFor="genero" className="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] text-[#333] text-[20px]">
            Gênero
          </label>
          <div className="relative">
            <button
              type="button"
              id="genero"
              aria-haspopup="listbox"
              aria-expanded={generoOpen}
              onClick={() => setGeneroOpen(!generoOpen)}
              className={`bg-white h-[60px] w-full rounded-[12px] flex items-center gap-[10px] px-[20px] py-[12px] relative ${
                showErrors && !genero ? "border-2 border-[#c0392b]" : "border border-[#5f5f5f]"
              }`}
            >
              <span className={`flex-1 text-left font-['Figtree:Regular',sans-serif] font-normal text-[16px] ${
                genero ? "text-[#333]" : "text-[#595959]"
              }`}>
                {genero || "Selecione uma opção"}
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
              <div
                aria-hidden="true"
                className={`absolute inset-0 pointer-events-none rounded-[12px] ${
                  showErrors && !genero ? "" : "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59] focus-visible:outline-offset-[-1px]"
                }`}
              />
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
                        aria-selected={genero === g}
                        onClick={() => { setGenero(g); setGeneroOpen(false); }}
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
          {showErrors && !genero && (
            <p className="font-['Figtree:Regular',sans-serif] font-normal text-[14px] mt-[4px] text-[#C0392B] bg-[#FFFFFF]">
              Gênero não informado
            </p>
          )}
        </div>

        <p className="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] text-[#595959] text-[16px]">
          Seus dados serão utilizados para emissão da sua declaração.
        </p>
      </div>

      {/* Sticky bottom button */}
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
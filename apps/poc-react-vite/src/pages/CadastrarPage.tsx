import { useState } from "react";
import { useNavigate } from "react-router";
import imgUfcLogo1 from "@/assets/9098abf5bf97a1aac4c76f171ec108cee92cfddb.png";
import imgAtivo224X1 from "@/assets/a17a08a750e97ba9bb12c3ad582c426a8debf0fa.png";

const eyePath =
  "M2 12C2.945 7.436 7.063 4 12 4C16.937 4 21.055 7.436 22 12C21.055 16.564 16.937 20 12 20C7.063 20 2.945 16.564 2 12ZM12 17C13.3261 17 14.5979 16.4732 15.5355 15.5355C16.4732 14.5979 17 13.3261 17 12C17 10.6739 16.4732 9.40215 15.5355 8.46447C14.5979 7.52678 13.3261 7 12 7C10.6739 7 9.40215 7.52678 8.46447 8.46447C7.52678 9.40215 7 10.6739 7 12C7 13.3261 7.52678 14.5979 8.46447 15.5355C9.40215 16.4732 10.6739 17 12 17ZM12 15C12.7956 15 13.5587 14.6839 14.1213 14.1213C14.6839 13.5587 15 12.7956 15 12C15 11.2044 14.6839 10.4413 14.1213 9.87868C13.5587 9.31607 12.7956 9 12 9C11.2044 9 10.4413 9.31607 9.87868 9.87868C9.31607 10.4413 9 11.2044 9 12C9 12.7956 9.31607 13.5587 9.87868 14.1213C10.4413 14.6839 11.2044 15 12 15Z";

function InputField({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  hasError,
  errorMessage,
}: {
  label: string;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
  errorMessage?: string;
}) {
  const [showPw, setShowPw] = useState(false);
  const isPw = type === "password";
  const id = label.toLowerCase().replace(/\s+/g, "-");
  const errorId = `${id}-error`;
  return (
    <div className="flex flex-col items-start w-full gap-[2px]">
      <label
        htmlFor={id}
        className="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] text-[#ffeac4] text-[20px]"
      >
        {label}
      </label>
      <div
        className={`bg-white h-[60px] w-full rounded-[12px] relative ${
          hasError ? "border-2 border-[#c0392b]" : "border border-[#5f5f5f]"
        }`}
      >
        <div className="flex items-center gap-[10px] px-[20px] py-[12px] h-full">
          <input
            id={id}
            type={isPw && showPw ? "text" : type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-invalid={hasError ? "true" : undefined}
            aria-describedby={hasError && errorMessage ? errorId : undefined}
            className="flex-1 font-['Figtree:Regular',sans-serif] font-normal text-[16px] text-[#1a1a1a] placeholder-[#595959] bg-transparent outline-none min-w-0 focus-visible:outline-none"
          />
          {isPw && (
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              aria-label={showPw ? "Ocultar senha" : "Mostrar senha"}
              className="shrink-0 size-[24px] focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59]"
            >
              <svg className="block size-full" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <path clipRule="evenodd" d={eyePath} fill="#021B59" fillRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
        <div
          aria-hidden="true"
          className={`absolute inset-0 pointer-events-none rounded-[12px] ${
            hasError ? "" : "focus-within:outline focus-within:outline-[3px] focus-within:outline-[#ffeac4] focus-within:outline-offset-[-1px]"
          }`}
        />
      </div>
      {hasError && errorMessage && (
        <p id={errorId} role="alert" className="font-['Figtree:Regular',sans-serif] font-normal text-[14px] mt-[4px] text-[#ff6f6f]">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  hasError,
  errorMessage,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  hasError?: boolean;
  errorMessage?: string;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  const errorId = `${id}-error`;
  return (
    <div className="flex flex-col items-start w-full gap-[2px]">
      <label
        htmlFor={id}
        className="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] text-[#ffeac4] text-[20px]"
      >
        {label}
      </label>
      <div
        className={`bg-white h-[60px] w-full rounded-[12px] relative ${
          hasError ? "border-2 border-[#c0392b]" : "border border-[#5f5f5f]"
        }`}
      >
        <div className="flex items-center gap-[10px] px-[20px] py-[12px] h-full">
          <select
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-invalid={hasError ? "true" : undefined}
            aria-describedby={hasError && errorMessage ? errorId : undefined}
            className="flex-1 font-['Figtree:Regular',sans-serif] font-normal text-[16px] bg-transparent outline-none min-w-0 focus-visible:outline-none appearance-none cursor-pointer"
            style={{ color: value === "" ? "#595959" : "#1a1a1a" }}
          >
            <option value="">Selecione uma opção</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} style={{ color: "#1a1a1a" }}>
                {opt.label}
              </option>
            ))}
          </select>
          <svg className="shrink-0 size-[16px] pointer-events-none" fill="none" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M4 6L8 10L12 6" stroke="#021B59" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div
          aria-hidden="true"
          className={`absolute inset-0 pointer-events-none rounded-[12px] ${
            hasError ? "" : "focus-within:outline focus-within:outline-[3px] focus-within:outline-[#ffeac4] focus-within:outline-offset-[-1px]"
          }`}
        />
      </div>
      {hasError && errorMessage && (
        <p id={errorId} role="alert" className="font-['Figtree:Regular',sans-serif] font-normal text-[14px] mt-[4px] text-[#ff6f6f]">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

export function CadastrarPage() {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [genero, setGenero] = useState("");
  const [showErrors, setShowErrors] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação
    const errors: { [key: string]: boolean } = {
      cpf: !cpf.trim(),
      email: !email.trim(),
      senha: !senha.trim(),
      confirmaSenha: !confirmaSenha.trim(),
      genero: !genero,
    };

    if (Object.values(errors).some((hasError) => hasError)) {
      setGeneralError("Por favor, preencha os campos destacados para finalizar o cadastro");
      setShowErrors(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Se passou na validação, navega para cursos
    navigate("/cursos");
  };

  const genderOptions = [
    { value: "feminino", label: "Feminino" },
    { value: "masculino", label: "Masculino" },
    { value: "outro", label: "Outro" },
    { value: "prefiro-nao-informar", label: "Prefiro não informar" },
  ];

  return (
    <main className="bg-gradient-to-b from-[#021b59] to-[#042e99] flex flex-col items-center p-[20px] min-h-screen">
      <div className="w-full max-w-[480px] mx-auto flex flex-col gap-[20px] items-center">

        {/* Logos */}
        <div className="inline-grid leading-[0] place-items-start relative shrink-0 mt-[10px]">
          <div className="col-1 h-[76px] ml-[72px] mt-0 relative row-1 w-[135px]">
            <img alt="UFC – Universidade Federal do Ceará" className="absolute inset-0 max-w-none object-cover size-full" src={imgUfcLogo1} />
          </div>
          <div className="col-1 h-[35px] ml-0 mt-[17px] relative row-1 w-[63px]">
            <img alt="Instituto Universidade Virtual" className="absolute inset-0 max-w-none object-cover size-full" src={imgAtivo224X1} />
          </div>
        </div>

        {/* Title */}
        <div
          className="flex flex-col font-['Anek_Devanagari:ExtraBold',sans-serif] font-extrabold h-[90px] justify-center leading-[0] relative shrink-0 text-[#ffeac4] text-center w-full"
          style={{ fontVariationSettings: "'wdth' 100" }}
        >
          <h1 className="leading-[normal] text-[#ffeac4]" style={{ fontSize: "clamp(64px, 20vw, 96px)" }}>
            SOLAR
          </h1>
        </div>

        {/* Error Message */}
        {showErrors && generalError && (
          <div
            className="bg-[#c0392b] border border-[#c0392b] rounded-[12px] p-[16px] w-full mb-[12px]"
            role="alert"
          >
            <p className="font-['Figtree:Medium',sans-serif] font-medium text-white text-[15px]">
              {generalError}
            </p>
          </div>
        )}

        {/* Form */}
        <form
          className="flex flex-col gap-[12px] items-start w-full"
          onSubmit={handleSubmit}
          noValidate
        >
          <InputField
            label="CPF"
            placeholder="Formato: 000.000.000-00"
            value={cpf}
            onChange={setCpf}
            hasError={showErrors && !cpf.trim()}
            errorMessage="CPF não informado"
          />
          <InputField
            label="Email"
            placeholder="Insira seu email"
            type="email"
            value={email}
            onChange={setEmail}
            hasError={showErrors && !email.trim()}
            errorMessage="Email não informado"
          />
          <InputField
            label="Senha"
            placeholder="Insira sua senha"
            type="password"
            value={senha}
            onChange={setSenha}
            hasError={showErrors && !senha.trim()}
            errorMessage="Senha não informada"
          />
          <InputField
            label="Confirme sua senha"
            placeholder="Repita sua senha"
            type="password"
            value={confirmaSenha}
            onChange={setConfirmaSenha}
            hasError={showErrors && !confirmaSenha.trim()}
            errorMessage="Confirmação de senha não informada"
          />
          <SelectField
            label="Gênero"
            value={genero}
            onChange={setGenero}
            options={genderOptions}
            hasError={showErrors && !genero}
            errorMessage="Gênero não informado"
          />

          {/* Terms — checkbox nativo para semântica e acessibilidade corretas */}
          <div className="flex items-start gap-[8px] w-full">
            <div className="relative mt-[2px] shrink-0">
              <input
                id="terms"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="sr-only peer"
              />
              {/* Indicador visual customizado vinculado ao input nativo */}
              <label
                htmlFor="terms"
                className={`flex items-center justify-center size-[22px] border-2 rounded-[2px] cursor-pointer transition-colors peer-focus-visible:outline peer-focus-visible:outline-[2px] peer-focus-visible:outline-[#ffeac4] peer-focus-visible:outline-offset-[2px] ${agreed ? "bg-[#ffeac4] border-[#ffeac4]" : "bg-transparent border-[#ffeac4]"}`}
                aria-hidden="true"
              >
                {agreed && (
                  <svg className="size-[14px]" fill="none" viewBox="0 0 22 22">
                    <path clipRule="evenodd" d="M5 9L3 11L9 17L19 7L17 5L9 13L5 9Z" fill="#021B59" fillRule="evenodd" />
                  </svg>
                )}
              </label>
            </div>
            <label htmlFor="terms" className="font-['Figtree:Regular',sans-serif] font-normal text-[#ffeac4] text-[16px] leading-[24px] cursor-pointer">
              Concordo com os termos de privacidade e segurança.
            </label>
          </div>

          <div className="flex flex-col gap-[20px] w-full mt-[8px]">
            <button
              type="submit"
              className="bg-[#ffeac4] h-[50px] w-full rounded-[26px] cursor-pointer hover:bg-[#ffd9a0] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-white focus-visible:outline-offset-[2px]"
            >
              <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[20px]">Cadastrar</span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="h-[50px] w-full border-2 border-[#ffeac4] rounded-[26px] cursor-pointer hover:bg-white/10 transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#ffeac4] focus-visible:outline-offset-[2px]"
            >
              <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#ffeac4] text-[20px]">Já sou usuário</span>
            </button>
          </div>
        </form>

        {/* Footer */}
        <nav className="flex flex-col items-center mt-auto pt-[20px] pb-[10px]" aria-label="Links do rodapé">
          {["Portais", "Desenvolvimento", "Política de privacidade", "Ajuda", "Idioma"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {}}
              className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] text-[#ffeac4] text-[16px] text-center w-[230px] hover:underline focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#ffeac4] rounded-sm"
            >
              {item}
            </button>
          ))}
        </nav>
      </div>
    </main>
  );
}
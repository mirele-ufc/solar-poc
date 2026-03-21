import { useState } from "react";
import { useNavigate } from "react-router";
import imgUfcLogo1 from "../../assets/9098abf5bf97a1aac4c76f171ec108cee92cfddb.png";
import imgAtivo224X1 from "../../assets/a17a08a750e97ba9bb12c3ad582c426a8debf0fa.png";

export function EsqueceuSenhaPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [showErrors, setShowErrors] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação
    if (!email.trim()) {
      setGeneralError("Por favor, preencha o campo destacado para continuar");
      setShowErrors(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Se passou na validação, volta para login
    navigate("/");
  };

  return (
    <main className="bg-gradient-to-b from-[#021b59] to-[#042e99] flex flex-col items-center p-[20px] min-h-screen">
      <div className="w-full max-w-[480px] mx-auto flex flex-col gap-[20px] items-center flex-1">

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

        {/* Content */}
        <div className="flex flex-col gap-[20px] items-start w-full">
          <div className="flex flex-col gap-[4px] w-full">
            <h2 className="font-['Figtree:Bold',sans-serif] font-bold leading-[36px] text-[#ffeac4] text-[24px] w-full">
              Esqueceu a sua senha?
            </h2>
            <p className="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] text-[#ffeac4] w-full text-[16px]">
              Informe o email usado no cadastro para receber instruções de recuperação da senha.
            </p>
          </div>

          {/* Error Message */}
          {showErrors && generalError && (
            <div
              className="bg-[#c0392b] border border-[#c0392b] rounded-[12px] p-[16px] w-full"
              role="alert"
            >
              <p className="font-['Figtree:Medium',sans-serif] font-medium text-white text-[15px]">
                {generalError}
              </p>
            </div>
          )}

          <form
            className="flex flex-col gap-[20px] w-full"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="flex flex-col items-start w-full gap-[2px]">
              <label
                htmlFor="email-recuperacao"
                className="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] text-[#ffeac4] text-[20px]"
              >
                Email
              </label>
              <div className={`bg-white h-[60px] w-full rounded-[12px] relative ${
                showErrors && !email.trim() ? "border-2 border-[#c0392b]" : "border border-[#5f5f5f]"
              }`}>
                <div className="flex items-center px-[20px] py-[12px] h-full">
                  <input
                    id="email-recuperacao"
                    type="email"
                    placeholder="Insira seu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 font-['Figtree:Regular',sans-serif] font-normal text-[16px] text-[#1a1a1a] placeholder-[#595959] bg-transparent outline-none focus-visible:outline-none"
                  />
                </div>
                <div
                  aria-hidden="true"
                  className={`absolute inset-0 pointer-events-none rounded-[12px] ${
                    showErrors && !email.trim() ? "" : "focus-within:outline focus-within:outline-[3px] focus-within:outline-[#ffeac4] focus-within:outline-offset-[-1px]"
                  }`}
                />
              </div>
              {showErrors && !email.trim() && (
                <p className="font-['Figtree:Regular',sans-serif] font-normal text-[14px] mt-[4px] text-[#ff6f6f]">
                  Email não informado
                </p>
              )}
            </div>

            <button
              type="submit"
              className="bg-[#ffeac4] h-[50px] w-full rounded-[26px] cursor-pointer hover:bg-[#ffd9a0] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-white focus-visible:outline-offset-[2px]"
            >
              <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[20px]">Enviar</span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="h-[50px] w-full border-2 border-[#ffeac4] rounded-[26px] cursor-pointer hover:bg-white/10 transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#ffeac4] focus-visible:outline-offset-[2px]"
            >
              <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#ffeac4] text-[20px]">Voltar ao login</span>
            </button>
          </form>
        </div>

        {/* Footer */}
        <nav className="flex flex-col items-center mt-auto pt-[20px] pb-[10px]" aria-label="Links do rodapé">
          {["Portais", "Desenvolvimento", "Política de privacidade", "Ajuda", "Idioma"].map((item) => (
            <a
              key={item}
              href="#"
              onClick={(e) => e.preventDefault()}
              className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] text-[#ffeac4] text-[16px] text-center w-[230px] hover:underline focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#ffeac4] rounded-sm"
            >
              {item}
            </a>
          ))}
        </nav>
      </div>
    </main>
  );
}
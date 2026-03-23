import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/store/useAuthStore";
import svgPaths from "@/assets/svg-ppphmxjoa5";
import imgUfcLogo1 from "@/assets/9098abf5bf97a1aac4c76f171ec108cee92cfddb.png";
import imgAtivo224X1 from "@/assets/a17a08a750e97ba9bb12c3ad582c426a8debf0fa.png";
import { loginSchema, type LoginFormValues } from "@/validations/authSchema";

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const form = watch();

  const onSubmitValid = (values: LoginFormValues) => {
    const ok = login(values.username.trim(), values.password);
    if (ok) {
      setGeneralError("");
      setShowErrors(false);
      navigate("/courses");
    } else {
      setGeneralError("Usuário ou senha incorretos");
      setShowErrors(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const onSubmitInvalid = () => {
    setGeneralError("Por favor, preencha os campos destacados para acessar");
    setShowErrors(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="bg-gradient-to-b from-[#021b59] to-[#042e99] flex flex-col items-center p-[20px] min-h-screen">
      <div className="w-full max-w-[480px] mx-auto flex flex-col gap-[20px] items-center flex-1">
        {/* Logos */}
        <div
          className="inline-grid leading-[0] place-items-start relative shrink-0 mt-[10px]"
          aria-label="Logos da UFC"
        >
          <div className="col-1 h-[76px] ml-[72px] mt-0 relative row-1 w-[135px]">
            <img
              alt="UFC – Universidade Federal do Ceará"
              className="absolute inset-0 max-w-none object-cover size-full"
              src={imgUfcLogo1}
            />
          </div>
          <div className="col-1 h-[35px] ml-0 mt-[17px] relative row-1 w-[63px]">
            <img
              alt="Instituto Universidade Virtual"
              className="absolute inset-0 max-w-none object-cover size-full"
              src={imgAtivo224X1}
            />
          </div>
        </div>

        {/* Title */}
        <div
          className="flex flex-col font-['Anek_Devanagari:ExtraBold',sans-serif] font-extrabold h-[90px] justify-center leading-[0] text-[#ffeac4] text-center w-full"
          style={{ fontVariationSettings: "'wdth' 100" }}
        >
          <h1
            className="leading-[normal] text-[#ffeac4] font-[Anek_Devanagari]"
            style={{ fontSize: "clamp(64px, 20vw, 96px)" }}
          >
            SOLAR
          </h1>
        </div>

        {/* Form */}
        <form
          className="flex flex-col gap-[12px] items-start w-full"
          noValidate
          onSubmit={handleSubmit(onSubmitValid, onSubmitInvalid)}
          aria-label="Formulário de login"
        >
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

          {/* Login */}
          <div className="flex flex-col items-start w-full gap-[2px]">
            <label
              htmlFor="username"
              className="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] text-[#ffeac4] text-[20px] w-full"
            >
              Login
            </label>
            <div
              className={`bg-white h-[60px] w-full rounded-[12px] relative overflow-hidden ${
                showErrors && !!errors.username
                  ? "border-2 border-[#c0392b]"
                  : "border border-[#5f5f5f]"
              }`}
            >
              <div className="flex items-center px-[20px] py-[12px] h-full">
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  placeholder="Insira seu nome de usuário ou email"
                  value={form.username}
                  onChange={(e) =>
                    setValue("username", e.target.value, {
                      shouldDirty: true,
                      shouldValidate: showErrors,
                    })
                  }
                  aria-invalid={
                    showErrors && !!errors.username ? "true" : undefined
                  }
                  aria-describedby={
                    showErrors && !!errors.username
                      ? "username-error"
                      : undefined
                  }
                  className="flex-1 font-['Figtree:Regular',sans-serif] font-normal text-[16px] text-[#1a1a1a] placeholder-[#595959] bg-transparent outline-none focus-visible:outline-none w-full"
                />
              </div>
              <div
                aria-hidden="true"
                className={`absolute inset-0 pointer-events-none rounded-[12px] ${
                  showErrors && !!errors.username
                    ? ""
                    : "focus-within:outline focus-within:outline-[3px] focus-within:outline-[#ffeac4] focus-within:outline-offset-[-1px]"
                }`}
              />
            </div>
            {showErrors && !!errors.username && (
              <p
                id="username-error"
                role="alert"
                className="font-['Figtree:Regular',sans-serif] font-normal text-[14px] mt-[4px] text-[#ff6f6f]"
              >
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col items-start w-full gap-[2px]">
            <label
              htmlFor="password"
              className="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] text-[#ffeac4] text-[20px] w-full"
            >
              Senha
            </label>
            <div
              className={`bg-white h-[60px] w-full rounded-[12px] relative overflow-hidden ${
                showErrors && !!errors.password
                  ? "border-2 border-[#c0392b]"
                  : "border border-[#5f5f5f]"
              }`}
            >
              <div className="flex gap-[10px] items-center px-[20px] py-[12px] h-full">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Insira sua senha"
                  value={form.password}
                  onChange={(e) =>
                    setValue("password", e.target.value, {
                      shouldDirty: true,
                      shouldValidate: showErrors,
                    })
                  }
                  aria-invalid={
                    showErrors && !!errors.password ? "true" : undefined
                  }
                  aria-describedby={
                    showErrors && !!errors.password
                      ? "password-error"
                      : undefined
                  }
                  className="flex-1 font-['Figtree:Regular',sans-serif] font-normal text-[16px] text-[#1a1a1a] placeholder-[#595959] bg-transparent outline-none focus-visible:outline-none min-w-0"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-pressed={showPassword}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  className="shrink-0 size-[24px] rounded-sm focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59]"
                >
                  <svg
                    className="block size-full"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      clipRule="evenodd"
                      d={svgPaths.p15535700}
                      fill="#021B59"
                      fillRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <div
                aria-hidden="true"
                className={`absolute inset-0 pointer-events-none rounded-[12px] ${
                  showErrors && !!errors.password
                    ? ""
                    : "focus-within:outline focus-within:outline-[3px] focus-within:outline-[#ffeac4] focus-within:outline-offset-[-1px]"
                }`}
              />
            </div>
            {showErrors && !!errors.password && (
              <p
                id="password-error"
                role="alert"
                className="font-['Figtree:Regular',sans-serif] font-normal text-[14px] mt-[4px] text-[#ff6f6f]"
              >
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Forgot */}
          <div className="flex justify-end w-full">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] text-[#ffeac4] text-[16px] hover:underline underline-offset-2 focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#ffeac4] rounded-sm"
            >
              Esqueceu a sua senha?
            </button>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-[16px] w-full mt-[8px]">
            <button
              type="submit"
              className="bg-[#ffeac4] cursor-pointer w-full h-[50px] rounded-[26px] hover:bg-[#ffd9a0] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-white focus-visible:outline-offset-[3px]"
            >
              <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[20px]">
                Acessar
              </span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="bg-transparent border-2 border-[#ffeac4] cursor-pointer w-full h-[50px] rounded-[26px] hover:bg-white/10 transition-colors focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#ffeac4] focus-visible:outline-offset-[2px]"
            >
              <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#ffeac4] text-[20px]">
                Cadastrar
              </span>
            </button>
          </div>
        </form>

        {/* Footer */}
        <nav
          className="flex flex-col items-center mt-auto pt-[20px] pb-[10px]"
          aria-label="Links do rodapé"
        >
          {[
            "Portais",
            "Desenvolvimento",
            "Política de privacidade",
            "Ajuda",
            "Idioma",
          ].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {}}
              className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] text-[#ffeac4] text-[16px] text-center hover:underline focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#ffeac4] rounded-sm"
            >
              {item}
            </button>
          ))}
        </nav>
      </div>
    </main>
  );
}

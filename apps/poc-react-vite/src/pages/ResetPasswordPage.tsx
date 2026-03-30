import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authService } from "@/services/authService";

const resetPasswordSchema = z
  .object({
    novaSenha: z
      .string()
      .trim()
      .min(6, "A senha deve ter ao menos 6 caracteres"),
    confirmacaoSenha: z
      .string()
      .trim()
      .min(6, "Confirmação deve ter ao menos 6 caracteres"),
  })
  .refine((data) => data.novaSenha === data.confirmacaoSenha, {
    message: "As senhas não coincidem",
    path: ["confirmacaoSenha"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showErrors, setShowErrors] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [success, setSuccess] = useState(false);
  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      novaSenha: "",
      confirmacaoSenha: "",
    },
  });

  // Extrai token da query string
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token") || "";

  const form = watch();

  const onSubmitValid = async (values: ResetPasswordFormValues) => {
    setShowErrors(false);
    setGeneralError("");
    if (!token) {
      setGeneralError("Token de redefinição ausente ou inválido.");
      setShowErrors(true);
      return;
    }
    try {
      await authService.resetPassword(token, values.novaSenha);
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      setGeneralError(
        err?.response?.data?.message ||
          "Erro ao redefinir senha. Tente novamente ou solicite novo link.",
      );
      setShowErrors(true);
    }
  };

  const onSubmitInvalid = () => {
    setGeneralError(
      "Por favor, preencha os campos corretamente para continuar",
    );
    setShowErrors(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="bg-gradient-to-b from-[#021b59] to-[#042e99] flex flex-col items-center p-[20px] min-h-screen">
      <div className="w-full max-w-[480px] mx-auto flex flex-col gap-[20px] items-center flex-1">
        <h2 className="font-bold text-[#ffeac4] text-[24px] w-full text-center mt-8 mb-4">
          Redefinir senha
        </h2>
        {success ? (
          <div className="bg-green-600 border border-green-600 rounded-[12px] p-[16px] w-full text-white text-center">
            Senha redefinida com sucesso! Redirecionando para login...
          </div>
        ) : (
          <form
            className="flex flex-col gap-[20px] w-full"
            onSubmit={handleSubmit(onSubmitValid, onSubmitInvalid)}
            noValidate
          >
            {/* Error Message */}
            {showErrors && generalError && (
              <div
                className="bg-[#c0392b] border border-[#c0392b] rounded-[12px] p-[16px] w-full"
                role="alert"
              >
                <p className="font-medium text-white text-[15px]">
                  {generalError}
                </p>
              </div>
            )}
            <div className="flex flex-col items-start w-full gap-[2px]">
              <label
                htmlFor="novaSenha"
                className="font-medium text-[#ffeac4] text-[20px]"
              >
                Nova senha
              </label>
              <input
                id="novaSenha"
                type="password"
                placeholder="Digite a nova senha"
                value={form.novaSenha}
                onChange={(e) =>
                  setValue("novaSenha", e.target.value, {
                    shouldDirty: true,
                    shouldValidate: showErrors,
                  })
                }
                className="bg-white h-[60px] w-full rounded-[12px] px-[20px] font-normal text-[16px] text-[#1a1a1a] placeholder-[#595959] outline-none"
              />
              {showErrors && !!errors.novaSenha && (
                <p className="font-normal text-[14px] mt-[4px] text-[#ff6f6f]">
                  {errors.novaSenha.message}
                </p>
              )}
            </div>
            <div className="flex flex-col items-start w-full gap-[2px]">
              <label
                htmlFor="confirmacaoSenha"
                className="font-medium text-[#ffeac4] text-[20px]"
              >
                Confirmar nova senha
              </label>
              <input
                id="confirmacaoSenha"
                type="password"
                placeholder="Confirme a nova senha"
                value={form.confirmacaoSenha}
                onChange={(e) =>
                  setValue("confirmacaoSenha", e.target.value, {
                    shouldDirty: true,
                    shouldValidate: showErrors,
                  })
                }
                className="bg-white h-[60px] w-full rounded-[12px] px-[20px] font-normal text-[16px] text-[#1a1a1a] placeholder-[#595959] outline-none"
              />
              {showErrors && !!errors.confirmacaoSenha && (
                <p className="font-normal text-[14px] mt-[4px] text-[#ff6f6f]">
                  {errors.confirmacaoSenha.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="bg-[#ffeac4] h-[50px] w-full rounded-[26px] cursor-pointer hover:bg-[#ffd9a0] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-white focus-visible:outline-offset-[2px]"
            >
              <span className="font-medium text-[#333] text-[20px]">
                Redefinir senha
              </span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="h-[50px] w-full border-2 border-[#ffeac4] rounded-[26px] cursor-pointer hover:bg-white/10 transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#ffeac4] focus-visible:outline-offset-[2px]"
            >
              <span className="font-medium text-[#ffeac4] text-[20px]">
                Voltar ao login
              </span>
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

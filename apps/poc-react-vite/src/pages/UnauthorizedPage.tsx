import { useEffect } from "react";
import { useNavigate } from "react-router";

const REDIRECT_DELAY_MS = 5000;

export function UnauthorizedPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      navigate("/courses", { replace: true });
    }, REDIRECT_DELAY_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [navigate]);

  return (
    <main className="bg-gradient-to-b from-[#021b59] to-[#042e99] min-h-screen flex items-center justify-center p-[20px]">
      <section className="w-full max-w-[640px] rounded-[16px] bg-white shadow-[0_16px_40px_rgba(2,27,89,0.2)] p-[28px] md:p-[40px] flex flex-col gap-[20px] text-center">
        <h1 className="font-['Figtree:Bold',sans-serif] text-[#021b59] text-[28px] leading-[36px]">
          Acesso negado
        </h1>

        <p className="font-['Figtree:Medium',sans-serif] text-[#333333] text-[18px] leading-[30px]">
          Você não tem permissão para acessar este recurso
        </p>

        <p className="font-['Figtree:Regular',sans-serif] text-[#595959] text-[15px] leading-[24px]">
          Você será redirecionado automaticamente para seus cursos em 5 segundos.
        </p>

        <button
          type="button"
          onClick={() => navigate("/courses")}
          className="mx-auto h-[48px] px-[28px] rounded-[24px] bg-[#021b59] text-[#ffeac4] font-['Figtree:Medium',sans-serif] text-[18px] hover:bg-[#042e99] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59] focus-visible:outline-offset-[2px]"
        >
          Ir para dashboard
        </button>
      </section>
    </main>
  );
}

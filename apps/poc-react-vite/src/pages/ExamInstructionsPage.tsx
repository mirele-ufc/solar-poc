import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/shared/PageHeader";
import { useEnrollmentGuard } from "@/hooks/useEnrollmentGuard";

export function ExamInstructionsPage() {
  const navigate = useNavigate();
  useEnrollmentGuard("power-bi");

  return (
    <div className="flex flex-col min-h-[calc(100vh-70px)] pb-[120px] bg-[#ffffff]">
      <div className="max-w-[900px] mx-auto flex flex-col gap-[28px] px-[20px] md:px-[40px] pt-[30px] w-full">
        {/* Page header with back + breadcrumb */}
        <PageHeader
          title="Instruções"
          backPath="/courses/power-bi/modules/1"
          crumbs={[
            { label: "Cursos", path: "/courses" },
            { label: "Power BI - Fundamentos", path: "/courses/power-bi" },
            { label: "Módulos", path: "/courses/power-bi/modules" },
            { label: "Módulo 01", path: "/courses/power-bi/modules/1" },
            { label: "Prova 01" },
          ]}
        />

        {/* Title — h2 porque PageHeader já renderiza h1 "Instruções" nesta página */}
        <h2 className="font-['Anek_Devanagari:ExtraBold',sans-serif] font-extrabold text-[#021b59] text-[32px] md:text-[40px] leading-tight">
          Prova 01
        </h2>

        {/* Instructions box */}
        <div className="bg-white rounded-[12px] p-[24px] md:p-[32px] shadow-sm">
          {/* h3 porque h1=PageHeader "Instruções", h2="Prova 01" acima */}
          <h3 className="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[20px] mb-[16px]">
            Instruções
          </h3>

          <div className="font-['Figtree:Regular',sans-serif] font-normal text-[#333] text-[16px] leading-[24px]">
            <ul className="list-disc mb-0 space-y-[8px]">
              <li className="ms-[24px]">A prova tem 10 questões;</li>
              <li className="ms-[24px]">O tempo total é de 60 minutos;</li>
              <li className="ms-[24px]">
                O cronômetro começa ao acessar a prova;
              </li>
              <li className="ms-[24px]">
                As respostas são salvas automaticamente;
              </li>
              <li className="ms-[24px]">
                Ao acabar o tempo, a prova é encerrada automaticamente e suas
                respostas ficam registradas.
              </li>
              <li className="ms-[24px]">Você terá apenas 1 tentativa.</li>
            </ul>

            <p className="mt-[24px] font-['Figtree:Medium',sans-serif] font-medium text-[#021b59]">
              Boa prova!
            </p>
          </div>
        </div>
      </div>

      {/* Sticky bottom button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-[20px] py-[16px] shadow-[0px_-4px_12px_rgba(51,51,51,0.15)] flex justify-center z-10">
        <div className="w-full max-w-[900px]">
          <button
            type="button"
            onClick={() => navigate("/courses/power-bi/exam")}
            className="bg-[#ffeac4] h-[50px] w-full rounded-[26px] cursor-pointer hover:bg-[#ffd9a0] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59] focus-visible:outline-offset-[2px]"
          >
            <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[20px]">
              Realizar prova
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

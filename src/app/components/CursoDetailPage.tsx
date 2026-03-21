import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../context/AppContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { PageHeader } from "./PageHeader";
import { toast } from "sonner";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1759661966728-4a02e3c6ed91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwdmlzdWFsaXphdGlvbiUyMGJ1c2luZXNzJTIwaW50ZWxsaWdlbmNlJTIwZGFzaGJvYXJkfGVufDF8fHx8MTc3MzMzNTYxNHww&ixlib=rb-4.1.0&q=80&w=1080";

const WARN_PATH =
  "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z";

const bullets = [
  "Conceitos básicos de Business Intelligence e análise de dados",
  "Conexão e importação de diferentes fontes de dados",
  "Transformação e limpeza de dados com o Power Query",
  "Criação de medidas e cálculos com a linguagem DAX",
  "Construção de dashboards interativos e relatórios visuais",
  "Publicação e compartilhamento de relatórios no Power BI Service",
];

const publicoAlvo = [
  "Profissionais de diversas áreas que trabalham com análise de dados",
  "Estudantes e recém-formados interessados em Business Intelligence",
  "Gestores que desejam tomar decisões baseadas em dados",
  "Analistas que buscam aprimorar suas habilidades em visualização de dados",
];

const preRequisitos = [
  "Conhecimentos básicos de informática e navegação na web",
  "Familiaridade com planilhas eletrônicas (Excel ou similar)",
  "Não é necessário conhecimento prévio em programação",
];

export function CursoDetailPage() {
  const navigate = useNavigate();
  const { isEnrolled, unenroll } = useApp();
  const enrolled = isEnrolled("power-bi");
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleInscrever = () => {
    if (enrolled) navigate("/cursos/power-bi/modulos");
    else navigate("/cursos/power-bi/inscricao");
  };

  const handleConfirmCancel = () => {
    unenroll("power-bi");
    setShowCancelModal(false);
    toast.success("Matrícula cancelada com sucesso.", {
      description: "Seu acesso ao conteúdo de Power BI - Fundamentos foi removido.",
      duration: 5000,
    });
    navigate("/cursos");
  };

  return (
    <div className="bg-white flex flex-col pb-[100px]">

      {/* Hero image - full width */}
      <div className="w-full h-[218px] md:h-[320px] overflow-hidden">
        <ImageWithFallback
          alt="Power BI – dashboard interativo"
          className="w-full h-full object-cover"
          src={HERO_IMAGE}
        />
      </div>

      {/* Content */}
      <div className="max-w-[900px] mx-auto flex flex-col gap-[24px] px-[20px] md:px-[40px] pt-[24px] w-full">
        <PageHeader
          title="Power BI - Fundamentos"
          backPath="/cursos"
          crumbs={[
            { label: "Cursos", path: "/cursos" },
            { label: "Power BI - Fundamentos" },
          ]}
        />
        <div className="flex flex-col gap-[6px] md:flex-row md:items-baseline md:justify-between">
          <h1 className="font-['Figtree:Bold',sans-serif] font-bold leading-[36px] text-black text-[24px]">
            Power BI - Fundamentos
          </h1>
          <p className="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] text-[#595959] text-[18px] shrink-0">
            Carga horária: 30h
          </p>
        </div>

        {/* Sobre */}
        <div className="flex flex-col gap-[10px]">
          <h2 className="font-['Figtree:Bold',sans-serif] font-bold leading-[30px] text-black text-[20px]">
            Sobre o curso
          </h2>
          <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[26px] text-black text-[16px]">
            O curso Power BI Fundamentos tem como objetivo introduzir os participantes aos conceitos
            essenciais de análise de dados e Business Intelligence utilizando o Microsoft Power BI.
            Ao longo do curso, os alunos aprendem a transformar dados brutos em informações estratégicas
            por meio da criação de relatórios interativos e dashboards dinâmicos.
          </p>
        </div>

        {/* O que irá aprender */}
        <div className="flex flex-col gap-[10px]">
          <h2 className="font-['Figtree:Bold',sans-serif] font-bold leading-[30px] text-black text-[20px]">
            O que você irá aprender?
          </h2>
          <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[26px] text-black text-[16px]">
            Serão abordados temas como:
          </p>
          <ul className="flex flex-col gap-[8px] pl-[4px] md:grid md:grid-cols-2 md:gap-x-[20px]">
            {bullets.map((item) => (
              <li key={item} className="flex gap-[8px] items-start">
                <span aria-hidden="true" className="text-[#021b59] mt-[2px]">•</span>
                <span className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] text-black text-[16px]">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Público-alvo */}
        <div className="flex flex-col gap-[10px]">
          <h2 className="font-['Figtree:Bold',sans-serif] font-bold leading-[30px] text-black text-[20px]">
            Público-alvo
          </h2>
          <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[26px] text-black text-[16px]">
            Este curso é destinado a profissionais de diversas áreas que trabalham com análise de dados, 
            estudantes e recém-formados interessados em Business Intelligence, gestores que desejam tomar 
            decisões baseadas em dados, e analistas que buscam aprimorar suas habilidades em visualização 
            de dados.
          </p>
        </div>

        {/* Pré-requisitos */}
        <div className="flex flex-col gap-[10px]">
          <h2 className="font-['Figtree:Bold',sans-serif] font-bold leading-[30px] text-black text-[20px]">
            Pré-requisitos
          </h2>
          <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[26px] text-black text-[16px]">
            Para realizar este curso, é necessário ter conhecimentos básicos de informática e navegação na 
            web, além de familiaridade com planilhas eletrônicas (Excel ou similar). Não é necessário 
            conhecimento prévio em programação.
          </p>
        </div>
      </div>

      {/* Sticky bottom button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-[20px] py-[16px] shadow-[0px_-4px_12px_rgba(51,51,51,0.15)] flex justify-center z-10">
        <div className="w-full max-w-[900px] flex flex-col gap-[10px]">
          <button
            type="button"
            onClick={handleInscrever}
            className="bg-[#ffeac4] h-[50px] w-full rounded-[26px] cursor-pointer hover:bg-[#ffd9a0] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59] focus-visible:outline-offset-[2px]"
          >
            <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[20px]">
              {enrolled ? "Acessar curso" : "Inscrever-se"}
            </span>
          </button>

          {enrolled && (
            <button
              type="button"
              onClick={() => setShowCancelModal(true)}
              className="h-[44px] w-full rounded-[26px] border-2 border-[#de2e66] cursor-pointer hover:bg-[#de2e66]/5 transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#de2e66] focus-visible:outline-offset-[2px]"
              aria-label="Cancelar matrícula neste curso"
            >
              <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#de2e66] text-[16px]">
                Cancelar matrícula
              </span>
            </button>
          )}
        </div>
      </div>

      {/* ── Cancel enrollment confirmation modal ── */}
      {showCancelModal && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCancelModal(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-modal-title"
            aria-describedby="cancel-modal-desc"
            className="fixed inset-0 z-50 flex items-center justify-center px-[20px]"
          >
            <div className="bg-white w-full max-w-[420px] rounded-[12px] shadow-2xl p-[28px] flex flex-col gap-[20px]">

              {/* Icon + title */}
              <div className="flex flex-col items-center gap-[12px] text-center">
                <div className="size-[52px] rounded-full bg-[#fde8ef] flex items-center justify-center shrink-0" aria-hidden="true">
                  <svg className="size-[28px]" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <path d={WARN_PATH} fill="#de2e66" />
                  </svg>
                </div>
                <h2
                  id="cancel-modal-title"
                  className="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[20px] leading-[30px]"
                >
                  Cancelar matrícula?
                </h2>
              </div>

              {/* Message */}
              <p
                id="cancel-modal-desc"
                className="font-['Figtree:Regular',sans-serif] text-[#333] text-[15px] leading-[24px] text-center"
              >
                Tem certeza que deseja cancelar sua matrícula neste curso?{" "}
                <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#801436]">
                  Após o cancelamento, você perderá o acesso ao conteúdo da disciplina
                </span>
                , incluindo aulas, materiais, atividades, provas e fóruns.
              </p>

              {/* Actions */}
              <div className="flex flex-col gap-[10px]">
                <button
                  type="button"
                  onClick={handleConfirmCancel}
                  className="w-full h-[50px] bg-[#de2e66] rounded-[26px] hover:bg-[#ba348a] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#de2e66] focus-visible:outline-offset-[2px] font-['Figtree:Medium',sans-serif] font-medium text-white text-[17px]"
                >
                  Confirmar cancelamento
                </button>
                <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  className="w-full h-[50px] border-2 border-[#021b59] rounded-[26px] hover:bg-[#021b59]/5 transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59] focus-visible:outline-offset-[2px] font-['Figtree:Medium',sans-serif] font-medium text-[#021b59] text-[17px]"
                  autoFocus
                >
                  Voltar — manter matrícula
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
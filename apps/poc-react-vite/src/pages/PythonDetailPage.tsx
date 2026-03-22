import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "@/context/AppContext";
import { ImageWithFallback } from "@/components/shared/ImageWithFallback";
import { PageHeader } from "@/components/shared/PageHeader";
import { toast } from "sonner";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1624953587687-daf255b6b80a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxweXRob24lMjBwcm9ncmFtbWluZyUyMGNvZGUlMjBjb21wdXRlcnxlbnwxfHx8fDE3NzMzMzU2MTd8MA&ixlib=rb-4.1.0&q=80&w=1080";

const WARN_PATH = "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z";

const bullets = [
  "Conceitos fundamentais de programação com Python",
  "Tipos de dados: inteiros, strings, listas e dicionários",
  "Estruturas de controle: if, else, elif, for e while",
  "Definição e uso de funções em Python",
  "Escopo de variáveis e recursão",
  "Boas práticas e legibilidade de código",
];

const publicoAlvo = [
  "Iniciantes sem experiência prévia em programação",
  "Estudantes de exatas que desejam aprender lógica de programação",
  "Profissionais que querem automatizar tarefas com Python",
  "Curiosos que desejam entender como o software funciona",
];

const preRequisitos = [
  "Nenhum conhecimento prévio em programação é necessário",
  "Conhecimentos básicos de informática e navegação na web",
  "Computador com acesso à internet",
];

export function PythonDetailPage() {
  const navigate = useNavigate();
  const { isEnrolled, unenroll } = useApp();
  const enrolled = isEnrolled("python");
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleInscrever = () => {
    if (enrolled) navigate("/courses/python/modules");
    else navigate("/courses/python/enrollment");
  };

  const handleConfirmCancel = () => {
    unenroll("python");
    setShowCancelModal(false);
    toast.success("Matrícula cancelada com sucesso.", {
      description: "Seu acesso ao conteúdo de Python Iniciante foi removido.",
      duration: 5000,
    });
    navigate("/cursos");
  };

  return (
    <div className="bg-white flex flex-col pb-[100px]">

      {/* Hero image */}
      <div className="w-full h-[218px] md:h-[320px] overflow-hidden">
        <ImageWithFallback
          alt="Python – código e programação"
          className="w-full h-full object-cover"
          src={HERO_IMAGE}
        />
      </div>

      {/* Content */}
      <div className="max-w-[900px] mx-auto flex flex-col gap-[24px] px-[20px] md:px-[40px] pt-[24px] w-full">
        <PageHeader
          title="Python Iniciante"
          backPath="/cursos"
          crumbs={[
            { label: "Cursos", path: "/cursos" },
            { label: "Python Iniciante" },
          ]}
        />

        <div className="flex flex-col gap-[6px] md:flex-row md:items-baseline md:justify-between">
          <h1 className="font-['Figtree:Bold',sans-serif] font-bold leading-[36px] text-black text-[24px]">
            Python Iniciante
          </h1>
          <p className="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] text-[#595959] text-[18px] shrink-0">
            Carga horária: 24h
          </p>
        </div>

        {/* Sobre */}
        <div className="flex flex-col gap-[10px]">
          <h2 className="font-['Figtree:Bold',sans-serif] font-bold leading-[30px] text-black text-[20px]">
            Sobre o curso
          </h2>
          <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[26px] text-black text-[16px]">
            O curso Python Iniciante tem como objetivo introduzir os participantes ao universo da programação
            utilizando a linguagem Python — uma das mais populares e versáteis do mundo. Ao longo do curso,
            os alunos aprenderão desde os conceitos básicos de lógica de programação até a construção de
            pequenos programas funcionais, desenvolvendo uma base sólida para avançar em áreas como
            ciência de dados, automação e desenvolvimento de software.
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
          <ul className="flex flex-col gap-[8px] pl-[4px]">
            {publicoAlvo.map((item) => (
              <li key={item} className="flex gap-[8px] items-start">
                <span aria-hidden="true" className="text-[#021b59] mt-[2px]">•</span>
                <span className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] text-black text-[16px]">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pré-requisitos */}
        <div className="flex flex-col gap-[10px]">
          <h2 className="font-['Figtree:Bold',sans-serif] font-bold leading-[30px] text-black text-[20px]">
            Pré-requisitos
          </h2>
          <ul className="flex flex-col gap-[8px] pl-[4px]">
            {preRequisitos.map((item) => (
              <li key={item} className="flex gap-[8px] items-start">
                <span aria-hidden="true" className="text-[#021b59] mt-[2px]">•</span>
                <span className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] text-black text-[16px]">
                  {item}
                </span>
              </li>
            ))}
          </ul>
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

      {/* Cancel enrollment modal */}
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

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCourseStore } from "@/store/useCourseStore";
import { ImageWithFallback } from "@/components/shared/ImageWithFallback";
import { PageHeader } from "@/components/shared/PageHeader";
import { Modal } from "@/components/ui/modal";
import { toast } from "sonner";
import { getCourseConfig, isValidCourseId } from "@/config/coursesConfig";

const WARN_PATH = "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z";

export function CourseDetailPage() {
  const { id: courseId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isEnrolledInCourse, unenrollFromCourse } = useCourseStore();

  // Validar e carregar configuração do curso
  if (!courseId || !isValidCourseId(courseId)) {
    return (
      <div className="bg-white flex flex-col pb-[100px] px-[20px] md:px-[40px] pt-[24px]">
        <p className="text-red-600 text-center">Curso não encontrado.</p>
        <button
          onClick={() => navigate("/courses")}
          className="mt-4 mx-auto px-4 py-2 bg-blue-600 text-white rounded"
        >
          Voltar aos cursos
        </button>
      </div>
    );
  }

  const courseConfig = getCourseConfig(courseId);
  if (!courseConfig) {
    return null;
  }

  const {
    title,
    description,
    longDescription,
    loading,
    bullets,
    heroImageUrl,
    enrollmentKey,
  } = courseConfig;

  const enrolled = isEnrolledInCourse(enrollmentKey);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleInscrever = () => {
    if (enrolled) navigate(`/courses/${courseId}/modules`);
    else navigate(`/courses/${courseId}/enrollment`);
  };

  const handleConfirmCancel = () => {
    unenrollFromCourse(enrollmentKey);
    setShowCancelModal(false);
    toast.success("Matrícula cancelada com sucesso.", {
      description: `Seu acesso ao conteúdo de ${courseConfig.name} foi removido.`,
      duration: 5000,
    });
    navigate("/courses");
  };

  return (
    <div className="bg-white flex flex-col pb-[100px]">
      {/* Hero image - full width */}
      <div className="w-full h-[218px] md:h-[320px] overflow-hidden">
        <ImageWithFallback
          alt={`${courseConfig.name} – curso`}
          className="w-full h-full object-cover"
          src={heroImageUrl}
        />
      </div>

      {/* Content */}
      <div className="max-w-[900px] mx-auto flex flex-col gap-[24px] px-[20px] md:px-[40px] pt-[24px] w-full">
        <PageHeader
          title={title}
          backPath="/courses"
          crumbs={[{ label: "Cursos", path: "/courses" }, { label: title }]}
        />
        <div className="flex flex-col gap-[6px] md:flex-row md:items-baseline md:justify-between">
          <h1 className="font-['Figtree:Bold',sans-serif] font-bold leading-[36px] text-black text-[24px]">
            {title}
          </h1>
          <p className="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] text-[#595959] text-[18px] shrink-0">
            {loading}
          </p>
        </div>

        {/* Sobre */}
        <div className="flex flex-col gap-[10px]">
          <h2 className="font-['Figtree:Bold',sans-serif] font-bold leading-[30px] text-black text-[20px]">
            Sobre o curso
          </h2>
          <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[26px] text-black text-[16px]">
            {description} {longDescription}
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
                <span aria-hidden="true" className="text-[#021b59] mt-[2px]">
                  •
                </span>
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
            Este curso é destinado a profissionais de diversas áreas que
            trabalham com análise de dados, estudantes e recém-formados
            interessados em Business Intelligence, gestores que desejam tomar
            decisões baseadas em dados, e analistas que buscam aprimorar suas
            habilidades em visualização de dados.
          </p>
        </div>

        {/* Pré-requisitos */}
        <div className="flex flex-col gap-[10px]">
          <h2 className="font-['Figtree:Bold',sans-serif] font-bold leading-[30px] text-black text-[20px]">
            Pré-requisitos
          </h2>
          <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[26px] text-black text-[16px]">
            Para realizar este curso, é necessário ter conhecimentos básicos de
            informática e navegação na web, além de familiaridade com planilhas
            eletrônicas (Excel ou similar). Não é necessário conhecimento prévio
            em programação.
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
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        className="w-full max-w-[420px] rounded-[12px] shadow-2xl p-[28px] gap-[20px]"
      >
        <Modal.Header>
          <div className="flex flex-col items-center gap-[12px] text-center">
            <div
              className="size-[52px] rounded-full bg-[#fde8ef] flex items-center justify-center shrink-0"
              aria-hidden="true"
            >
              <svg
                className="size-[28px]"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d={WARN_PATH} fill="#de2e66" />
              </svg>
            </div>
            <span className="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[20px] leading-[30px]">
              Cancelar matrícula?
            </span>
          </div>
        </Modal.Header>

        <Modal.Body className="font-['Figtree:Regular',sans-serif] text-[#333] text-[15px] leading-[24px] text-center">
          Tem certeza que deseja cancelar sua matrícula neste curso?{" "}
          <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#801436]">
            Após o cancelamento, você perderá o acesso ao conteúdo da disciplina
          </span>
          , incluindo aulas, materiais, atividades, provas e fóruns.
        </Modal.Body>

        <Modal.Footer className="flex flex-col gap-[10px] sm:flex-col sm:justify-start">
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
        </Modal.Footer>
      </Modal>
    </div>
  );
}

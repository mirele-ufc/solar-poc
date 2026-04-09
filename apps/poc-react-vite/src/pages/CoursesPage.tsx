import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CourseCard } from "@/components/shared/CourseCard";
import {
  fetchCourses,
  type BackendCourseResponse,
} from "@/services/courseService";
import { selectCanManageCourses, useAuthStore } from "@/store/useAuthStore";
import fallbackBannerImage from "@/assets/a17a08a750e97ba9bb12c3ad582c426a8debf0fa.png";

const FALLBACK_BANNER = fallbackBannerImage;

type ListedCourse = {
  id: string;
  title: string;
  description?: string;
  imageSrc: string;
  hasImagePath: boolean;
};

type CourseBadge = {
  label: string;
  bg: string;
  text: string;
};

function resolveCourseImage(imagePath: string | null): string {
  // Se imagePath é fornecido e válido, usar ele
  if (imagePath?.trim()) {
    if (/^https?:\/\//i.test(imagePath)) {
      return imagePath;
    }

    const apiBaseUrl = (
      import.meta.env.VITE_API_URL || "http://localhost:8080"
    ).replace(/\/$/, "");
    const normalizedPath = imagePath.startsWith("/")
      ? imagePath
      : `/${imagePath}`;

    return `${apiBaseUrl}${normalizedPath}`;
  }

  // Fallback para imagem padrão quando não há imagePath do backend
  return FALLBACK_BANNER;
}

function normalizeCourseTitle(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function mapCourseToDisplay(course: BackendCourseResponse): ListedCourse {
  return {
    id: String(course.id),
    title: course.title?.trim() || "Curso sem título",
    description:
      course.description?.trim() || "Curso disponível na plataforma.",
    imageSrc: resolveCourseImage(course.imagePath),
    hasImagePath: !!course.imagePath?.trim(),
  };
}

function FeedbackState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="w-full rounded-[12px] border border-[#dbe5ff] bg-[#f5f8ff] px-[20px] py-[24px] text-center">
      <p className="font-['Figtree:Medium',sans-serif] font-medium text-[#021b59] text-[18px]">
        {title}
      </p>
      <p className="mt-[6px] font-['Figtree:Regular',sans-serif] text-[#595959] text-[14px]">
        {description}
      </p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-[16px] bg-[#ffeac4] h-[42px] px-[20px] rounded-[24px] hover:bg-[#ffd9a0] transition-colors focus-visible:outline-[3px] focus-visible:outline-[#021b59] focus-visible:outline-offset-[2px]"
        >
          <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[15px]">
            {actionLabel}
          </span>
        </button>
      ) : null}
    </div>
  );
}

function CourseGrid({
  courses,
  onClickCourse,
  showDescription = false,
  badge,
}: {
  courses: ListedCourse[];
  onClickCourse: (course: ListedCourse) => void;
  showDescription?: boolean;
  badge?: CourseBadge;
}) {
  return (
    <div className="w-full">
      <div className="no-scrollbar flex gap-[16px] overflow-x-auto pb-[8px] md:hidden">
        {courses.map((course) => (
          <div key={course.id} className="shrink-0 w-[200px]">
            <CourseCard
              title={course.title}
              imageSrc={course.imageSrc}
              imageAlt={course.title}
              description={showDescription ? course.description : undefined}
              badge={badge}
              isImageFallback={!course.hasImagePath}
              onClick={() => onClickCourse(course)}
            />
          </div>
        ))}
      </div>

      <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-[20px]">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            title={course.title}
            imageSrc={course.imageSrc}
            imageAlt={course.title}
            description={showDescription ? course.description : undefined}
            badge={badge}
            isImageFallback={!course.hasImagePath}
            onClick={() => onClickCourse(course)}
          />
        ))}
      </div>
    </div>
  );
}

export function CoursesPage() {
  const navigate = useNavigate();
  const canManageCourses = useAuthStore(selectCanManageCourses);
  const [courses, setCourses] = useState<BackendCourseResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadCourses = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetchCourses();
      setCourses(response);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar os cursos no momento.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCourses();
  }, [loadCourses]);

  const listedCourses = useMemo(
    () =>
      courses
        .map(mapCourseToDisplay)
        .sort((first, second) => Number(first.id) - Number(second.id)),
    [courses],
  );

  const goToStudentCourse = (course: ListedCourse) => {
    const normalizedTitle = normalizeCourseTitle(course.title);

    if (normalizedTitle.includes("power bi")) {
      navigate("/courses/power-bi");
      return;
    }

    if (normalizedTitle.includes("python")) {
      navigate("/courses/python");
    }
  };

  const goToManagedCourse = (course: ListedCourse) => {
    navigate(`/courses/${course.id}/manage`);
  };

  if (canManageCourses) {
    return (
      <div className="bg-white flex flex-col gap-[30px] items-start pt-[30px] px-[20px] md:px-[40px] pb-[60px]">
        <div className="flex flex-col gap-[12px] w-full">
          <h1 className="font-['Figtree:Bold',sans-serif] font-bold leading-[36px] text-[#021b59] text-[24px] w-full">
            Acompanhe os cursos
          </h1>
          <button
            type="button"
            onClick={() => navigate("/create-course")}
            className="bg-[#ffeac4] cursor-pointer h-[48px] w-full rounded-[26px] hover:bg-[#ffd9a0] transition-colors focus-visible:outline-[3px] focus-visible:outline-[#021b59] focus-visible:outline-offset-[2px]"
          >
            <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[20px]">
              Criar curso
            </span>
          </button>
        </div>

        <section
          aria-labelledby="ativos-heading"
          className="flex flex-col gap-[20px] w-full"
        >
          <h2
            id="ativos-heading"
            className="font-['Figtree:Bold',sans-serif] font-bold leading-[36px] text-[#021b59] text-[24px]"
          >
            Cursos ativos
          </h2>

          {isLoading ? (
            <FeedbackState
              title="Carregando cursos..."
              description="Buscando a lista atualizada no backend."
            />
          ) : errorMessage ? (
            <FeedbackState
              title="Não foi possível carregar os cursos"
              description={errorMessage}
              actionLabel="Tentar novamente"
              onAction={() => void loadCourses()}
            />
          ) : listedCourses.length === 0 ? (
            <FeedbackState
              title="Nenhum curso cadastrado"
              description="Crie um novo curso para começar a exibição nesta página."
            />
          ) : (
            <CourseGrid
              courses={listedCourses}
              onClickCourse={goToManagedCourse}
              showDescription
            />
          )}
        </section>
      </div>
    );
  }

  return (
    <div className="bg-white flex flex-col gap-[30px] items-start pt-[30px] px-[20px] md:px-[40px] pb-[60px]">
      <h1 className="font-['Figtree:Bold',sans-serif] font-bold leading-[40px] text-[#021b59] text-[28px] w-full">
        Conheça nossos cursos!
      </h1>

      {isLoading ? (
        <FeedbackState
          title="Carregando cursos..."
          description="Buscando a lista de cursos disponíveis."
        />
      ) : errorMessage ? (
        <FeedbackState
          title="Não foi possível carregar os cursos"
          description={errorMessage}
          actionLabel="Tentar novamente"
          onAction={() => void loadCourses()}
        />
      ) : listedCourses.length === 0 ? (
        <FeedbackState
          title="Nenhum curso disponível"
          description="Assim que novos cursos forem cadastrados, eles serão exibidos aqui."
        />
      ) : (
        <section
          aria-labelledby="courses-available-heading"
          className="flex flex-col gap-[20px] w-full"
        >
          <h2
            id="courses-available-heading"
            className="font-['Figtree:Bold',sans-serif] font-bold leading-[36px] text-[#021b59] text-[24px]"
          >
            Cursos disponíveis
          </h2>
          <CourseGrid
            courses={listedCourses}
            onClickCourse={goToStudentCourse}
            showDescription
          />
        </section>
      )}
    </div>
  );
}

import { useNavigate } from "react-router";
import { selectCanManageCourses, useAuthStore } from "@/store/useAuthStore";
import { ImageWithFallback } from "@/components/shared/ImageWithFallback";

// ── Course thumbnail map ──────────────────────────────────────────────────────
const COURSE_IMAGES: Record<string, string> = {
  "power-bi":
    "https://images.unsplash.com/photo-1759661966728-4a02e3c6ed91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwdmlzdWFsaXphdGlvbiUyMGJ1c2luZXNzJTIwaW50ZWxsaWdlbmNlJTIwZGFzaGJvYXJkfGVufDF8fHx8MTc3MzMzNTYxNHww&ixlib=rb-4.1.0&q=80&w=1080",
  python:
    "https://images.unsplash.com/photo-1624953587687-daf255b6b80a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxweXRob24lMjBwcm9ncmFtbWluZyUyMGNvZGUlMjBjb21wdXRlcnxlbnwxfHx8fDE3NzMzMzU2MTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  matematica:
    "https://images.unsplash.com/photo-1747654804155-ffd62d5dfb51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXRoZW1hdGljcyUyMGdlb21ldHJ5JTIwYWJzdHJhY3R8ZW58MXx8fHwxNzczMzI3ODYwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "historia-design":
    "https://images.unsplash.com/photo-1762330910399-95caa55acf04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbmxpbmUlMjBsZWFybmluZyUyMGNvdXJzZSUyMGVkdWNhdGlvbiUyMGxhcHRvcHxlbnwxfHx8fDE3NzMzMzU2MTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "design-grafico":
    "https://images.unsplash.com/photo-1663000806489-08f132cf3032?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFwaGljJTIwZGVzaWduJTIwdHlwb2dyYXBoeSUyMGNyZWF0aXZlfGVufDF8fHx8MTc3MzMzNTYxOHww&ixlib=rb-4.1.0&q=80&w=1080",
  "design-interfaces":
    "https://images.unsplash.com/photo-1602576666092-bf6447a729fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxVSSUyMFVYJTIwaW50ZXJmYWNlJTIwZGVzaWduJTIwc2NyZWVufGVufDF8fHx8MTc3MzMzNTYxOHww&ixlib=rb-4.1.0&q=80&w=1080",
};

const FALLBACK =
  "https://images.unsplash.com/photo-1762330910399-95caa55acf04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400";

// ── Card ──────────────────────────────────────────────────────────────────────
type CourseCardProps = {
  id: string;
  title: string;
  hours?: string;
  onClick: () => void;
  isActive?: boolean;
};

function CourseCard({ id, title, hours, onClick, isActive }: CourseCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col gap-[10px] items-start cursor-pointer group text-left w-full focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59] focus-visible:outline-offset-[2px] rounded-[4px]"
    >
      <div className="w-full aspect-[16/10] overflow-hidden rounded-[8px] bg-[#e0e0e0] relative">
        <ImageWithFallback
          alt={title}
          src={COURSE_IMAGES[id] ?? FALLBACK}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        {isActive && (
          <span className="absolute top-[8px] right-[8px] bg-[#e6f9ee] text-[#155724] text-[11px] font-['Figtree:Medium',sans-serif] font-medium px-[8px] py-[2px] rounded-full">
            Ativo
          </span>
        )}
      </div>
      <div className="flex flex-col gap-[2px]">
        <p className="font-['Figtree:Medium',sans-serif] font-medium leading-[26px] text-[18px] text-black">
          {title}
        </p>
        {hours && (
          <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[20px] text-[14px] text-[#595959]">
            {hours}
          </p>
        )}
      </div>
    </button>
  );
}

// ── Course data ───────────────────────────────────────────────────────────────
const computacaoCourses = [
  {
    id: "power-bi",
    title: "Power Bi - Fundamentos",
    hours: "Carga horária: 30h",
  },
  { id: "python", title: "Python Iniciante", hours: "Carga horária: 24h" },
  { id: "matematica", title: "Matemática básica", hours: "Carga horária: 36h" },
];
const designCourses = [
  {
    id: "historia-design",
    title: "História do Design",
    hours: "Carga horária: 64h",
  },
  {
    id: "design-grafico",
    title: "Design Gráfico - Iniciante",
    hours: "Carga horária: 40h",
  },
  {
    id: "design-interfaces",
    title: "Design de Interfaces Gráficas",
    hours: "Carga horária: 48h",
  },
];
const activeCourses = [
  { id: "power-bi", title: "Power Bi - Fundamentos" },
  { id: "python", title: "Python Iniciante" },
  { id: "matematica", title: "Matemática básica" },
];
const archivedCourses = [
  { id: "historia-design", title: "História do Design" },
  { id: "design-grafico", title: "Design Gráfico - Iniciante" },
  { id: "design-interfaces", title: "Design de Interfaces Gráficas" },
];

// ── Grid / Row helper ─────────────────────────────────────────────────────────
function CourseGrid({
  courses,
  onClickCourse,
  showHours = false,
}: {
  courses: { id: string; title: string; hours?: string }[];
  onClickCourse: (id: string) => void;
  showHours?: boolean;
}) {
  return (
    <div className="w-full">
      {/* Mobile: horizontal scroll */}
      <div className="no-scrollbar flex gap-[16px] overflow-x-auto pb-[8px] md:hidden">
        {courses.map((c) => (
          <div key={c.id} className="shrink-0 w-[200px]">
            <CourseCard
              id={c.id}
              title={c.title}
              hours={showHours ? c.hours : undefined}
              onClick={() => onClickCourse(c.id)}
            />
          </div>
        ))}
      </div>
      {/* Desktop: grid */}
      <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-[20px]">
        {courses.map((c) => (
          <CourseCard
            key={c.id}
            id={c.id}
            title={c.title}
            hours={showHours ? c.hours : undefined}
            onClick={() => onClickCourse(c.id)}
          />
        ))}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export function CoursesPage() {
  const navigate = useNavigate();
  const canManageCourses = useAuthStore(selectCanManageCourses);

  const goToCourse = (id: string) => {
    if (id === "power-bi") navigate("/courses/power-bi");
    else if (id === "python") navigate("/courses/python");
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
            className="bg-[#ffeac4] cursor-pointer h-[48px] w-full rounded-[26px] hover:bg-[#ffd9a0] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59] focus-visible:outline-offset-[2px]"
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
          <div className="w-full">
            <div className="no-scrollbar flex gap-[16px] overflow-x-auto pb-[8px] md:hidden">
              {activeCourses.map((c) => (
                <div key={c.id} className="shrink-0 w-[200px]">
                  {/* Python → visão de aluno; demais → gerenciar */}
                  <CourseCard
                    id={c.id}
                    title={c.title}
                    onClick={() =>
                      c.id === "python"
                        ? navigate("/courses/python")
                        : navigate(`/courses/${c.id}/manage`)
                    }
                    isActive
                  />
                </div>
              ))}
            </div>
            <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-[20px]">
              {activeCourses.map((c) => (
                <CourseCard
                  key={c.id}
                  id={c.id}
                  title={c.title}
                  onClick={() =>
                    c.id === "python"
                      ? navigate("/courses/python")
                      : navigate(`/courses/${c.id}/manage`)
                  }
                  isActive
                />
              ))}
            </div>
          </div>
        </section>

        <section
          aria-labelledby="arquivados-heading"
          className="flex flex-col gap-[20px] w-full"
        >
          <h2
            id="arquivados-heading"
            className="font-['Figtree:Bold',sans-serif] font-bold leading-[36px] text-[#021b59] text-[24px]"
          >
            Cursos arquivados
          </h2>
          <CourseGrid courses={archivedCourses} onClickCourse={() => {}} />
        </section>
      </div>
    );
  }

  // Student view
  return (
    <div className="bg-white flex flex-col gap-[30px] items-start pt-[30px] px-[20px] md:px-[40px] pb-[60px]">
      <h1 className="font-['Figtree:Bold',sans-serif] font-bold leading-[40px] text-[#021b59] text-[28px] w-full">
        Conheça nossos cursos!
      </h1>

      <section
        aria-labelledby="comp-heading"
        className="flex flex-col gap-[20px] w-full"
      >
        <h2
          id="comp-heading"
          className="font-['Figtree:Bold',sans-serif] font-bold leading-[36px] text-[#021b59] text-[24px]"
        >
          Computação
        </h2>
        <CourseGrid
          courses={computacaoCourses}
          onClickCourse={goToCourse}
          showHours
        />
      </section>

      <section
        aria-labelledby="design-heading"
        className="flex flex-col gap-[20px] w-full"
      >
        <h2
          id="design-heading"
          className="font-['Figtree:Bold',sans-serif] font-bold leading-[36px] text-[#021b59] text-[24px]"
        >
          Design
        </h2>
        <CourseGrid
          courses={designCourses}
          onClickCourse={() => {}}
          showHours
        />
      </section>
    </div>
  );
}

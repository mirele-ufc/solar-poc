import { useNavigate } from "react-router";
import { useApp } from "../context/AppContext";
import { ImageWithFallback } from "@/components/shared/ImageWithFallback";
import { PageHeader } from "@/components/shared/PageHeader";

const ALL_COURSES: Record<string, { title: string; hours: string; category: string; image: string }> = {
  "power-bi": {
    title: "Power BI - Fundamentos",
    hours: "Carga horária: 30h",
    category: "Computação",
    image:
      "https://images.unsplash.com/photo-1759661966728-4a02e3c6ed91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwdmlzdWFsaXphdGlvbiUyMGJ1c2luZXNzJTIwaW50ZWxsaWdlbmNlJTIwZGFzaGJvYXJkfGVufDF8fHx8MTc3MzMzNTYxNHww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  python: {
    title: "Python Iniciante",
    hours: "Carga horária: 24h",
    category: "Computação",
    image:
      "https://images.unsplash.com/photo-1624953587687-daf255b6b80a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxweXRob24lMjBwcm9ncmFtbWluZyUyMGNvZGUlMjBjb21wdXRlcnxlbnwxfHx8fDE3NzMzMzU2MTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  matematica: {
    title: "Matemática Básica",
    hours: "Carga horária: 36h",
    category: "Computação",
    image:
      "https://images.unsplash.com/photo-1747654804155-ffd62d5dfb51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXRoZW1hdGljcyUyMGdlb21ldHJ5JTIwYWJzdHJhY3R8ZW58MXx8fHwxNzczMzI3ODYwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
};

// ⚠️ PROTÓTIPO: em produção, a lista de cursos que o professor leciona
// deve vir do servidor com verificação de autorização adequada.
const PROFESSOR_TAUGHT_COURSES = ["power-bi"];

const BOOK_ICON =
  "M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 14H8v-2h8v2zm0-4H8v-2h8v2zm0-4H8V6h8v2z";

const TEACHER_ICON =
  "M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z";

interface CourseCardProps {
  id: string;
  title: string;
  category: string;
  hours: string;
  image: string;
  badge: { label: string; bg: string; text: string };
  onClick: () => void;
}

function CourseCard({ id, title, category, hours, image, badge, onClick }: CourseCardProps) {
  return (
    <button
      key={id}
      type="button"
      onClick={onClick}
      className="flex flex-col gap-[10px] items-start cursor-pointer group text-left w-full focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59] focus-visible:outline-offset-[2px] rounded-[4px]"
    >
      <div className="w-full aspect-[16/10] overflow-hidden rounded-[8px] bg-[#e0e0e0] relative">
        <ImageWithFallback
          alt={title}
          src={image}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <span
          className="absolute top-[8px] right-[8px] text-[11px] font-['Figtree:Medium',sans-serif] font-medium px-[8px] py-[2px] rounded-full"
          style={{ backgroundColor: badge.bg, color: badge.text }}
        >
          {badge.label}
        </span>
      </div>
      <div className="flex flex-col gap-[2px]">
        <p className="font-['Figtree:Medium',sans-serif] font-medium leading-[26px] text-[18px] text-black">
          {title}
        </p>
        <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[20px] text-[14px] text-[#595959]">
          {category} · {hours}
        </p>
      </div>
    </button>
  );
}

function EmptyState({ message, sub }: { message: string; sub: string }) {
  return (
    <div className="flex flex-col items-center gap-[12px] py-[40px] text-center bg-[#f5f8ff] rounded-[12px]">
      <svg className="size-[48px] opacity-25" fill="none" viewBox="0 0 24 24" aria-hidden="true">
        <path d={BOOK_ICON} fill="#021b59" />
      </svg>
      <p className="font-['Figtree:Medium',sans-serif] font-medium text-[#021b59] text-[16px]">
        {message}
      </p>
      <p className="font-['Figtree:Regular',sans-serif] font-normal text-[#595959] text-[14px]">
        {sub}
      </p>
    </div>
  );
}

export function MeusCursosPage() {
  const navigate = useNavigate();
  const { enrolledCourses, courseStudentRoles, user } = useApp();

  const isProfessor = user.role === "professor";

  // Cursos como professor (apenas para perfil professor)
  const taughtCourses = isProfessor
    ? PROFESSOR_TAUGHT_COURSES.map((id) => ({ id, ...(ALL_COURSES[id] ?? null) })).filter((c) => c.title)
    : [];

  // Cursos como aluno:
  // - Para professor: interseção de enrolledCourses com courseStudentRoles
  // - Para estudante: todos os enrolledCourses
  const studentCourseIds = isProfessor
    ? enrolledCourses.filter((id) => courseStudentRoles.includes(id))
    : enrolledCourses;

  const studentCourses = studentCourseIds
    .map((id) => ({ id, ...(ALL_COURSES[id] ?? null) }))
    .filter((c) => c.title);

  // Destino do clique no card
  const getCourseTarget = (id: string) => {
    if (isProfessor && PROFESSOR_TAUGHT_COURSES.includes(id)) {
      return `/cursos/${id}/gerenciar`;
    }
    return `/cursos/${id}`;
  };

  // Vista para estudante (comportamento original)
  if (!isProfessor) {
    const enrolled = enrolledCourses
      .map((id) => ({ id, ...(ALL_COURSES[id] ?? null) }))
      .filter((c) => c.title);

    return (
      <div className="bg-white flex flex-col gap-[24px] pt-[24px] px-[20px] md:px-[40px] pb-[60px]">
        <PageHeader
          title="Meus Cursos"
          backPath="/cursos"
          crumbs={[
            { label: "Cursos", path: "/cursos" },
            { label: "Meus Cursos" },
          ]}
        />

        {enrolled.length === 0 ? (
          <div className="flex flex-col items-center gap-[20px] py-[60px] text-center">
            <svg className="size-[64px] opacity-30" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <path d={BOOK_ICON} fill="#021b59" />
            </svg>
            <div className="flex flex-col gap-[8px]">
              <p className="font-['Figtree:Medium',sans-serif] font-medium text-[#021b59] text-[18px]">
                Você ainda não está matriculado em nenhum curso
              </p>
              <p className="font-['Figtree:Regular',sans-serif] font-normal text-[#595959] text-[15px]">
                Explore os cursos disponíveis e realize sua inscrição.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/cursos")}
              className="bg-[#ffeac4] h-[46px] px-[32px] rounded-[26px] cursor-pointer hover:bg-[#ffd9a0] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59]"
            >
              <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[17px]">
                Ver cursos disponíveis
              </span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[20px]">
            {enrolled.map((course) => (
              <CourseCard
                key={course.id}
                {...course}
                badge={{ label: "Matriculado", bg: "#e6f9ee", text: "#155724" }}
                onClick={() => navigate(`/cursos/${course.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Vista para professor — duas seções
  return (
    <div className="bg-white flex flex-col gap-[32px] pt-[24px] px-[20px] md:px-[40px] pb-[60px]">
      <PageHeader
        title="Meus Cursos"
        backPath="/cursos"
        crumbs={[
          { label: "Cursos", path: "/cursos" },
          { label: "Meus Cursos" },
        ]}
      />

      {/* ── Seção: Cursos que leciono ── */}
      <section aria-labelledby="secao-professor">
        <div className="flex items-center gap-[10px] mb-[16px]">
          <div className="size-[32px] rounded-full bg-[#021b59] flex items-center justify-center shrink-0" aria-hidden="true">
            <svg className="size-[17px]" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <path d={TEACHER_ICON} fill="#ffeac4" />
            </svg>
          </div>
          <h2
            id="secao-professor"
            className="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[20px] leading-[30px]"
          >
            Cursos que leciono
          </h2>
        </div>

        {taughtCourses.length === 0 ? (
          <EmptyState
            message="Nenhum curso ativo como professor"
            sub="Você não possui cursos ativos como professor no momento."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[20px]">
            {taughtCourses.map((course) => (
              <CourseCard
                key={course.id}
                {...course}
                badge={{ label: "Professor", bg: "#c5d6ff", text: "#021b59" }}
                onClick={() => navigate(getCourseTarget(course.id))}
              />
            ))}
          </div>
        )}
      </section>

      {/* Divisor */}
      <div className="w-full h-px bg-[#e8e8e8]" aria-hidden="true" />

      {/* ── Seção: Cursos em que estou matriculado ── */}
      <section aria-labelledby="secao-aluno">
        <div className="flex items-center gap-[10px] mb-[16px]">
          <div className="size-[32px] rounded-full bg-[#042e99] flex items-center justify-center shrink-0" aria-hidden="true">
            <svg className="size-[17px]" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <path d={BOOK_ICON} fill="#ffeac4" />
            </svg>
          </div>
          <h2
            id="secao-aluno"
            className="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[20px] leading-[30px]"
          >
            Cursos em que estou matriculado
          </h2>
        </div>

        {studentCourses.length === 0 ? (
          <div className="flex flex-col items-center gap-[16px] py-[40px] text-center bg-[#f5f8ff] rounded-[12px]">
            <svg className="size-[48px] opacity-25" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <path d={BOOK_ICON} fill="#021b59" />
            </svg>
            <p className="font-['Figtree:Medium',sans-serif] font-medium text-[#021b59] text-[16px]">
              Você não está matriculado em nenhum curso como aluno
            </p>
            <p className="font-['Figtree:Regular',sans-serif] font-normal text-[#595959] text-[14px]">
              Explore os cursos disponíveis e realize sua inscrição.
            </p>
            <button
              type="button"
              onClick={() => navigate("/cursos")}
              className="bg-[#ffeac4] h-[46px] px-[28px] rounded-[26px] hover:bg-[#ffd9a0] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59]"
            >
              <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[16px]">
                Ver cursos disponíveis
              </span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[20px]">
            {studentCourses.map((course) => (
              <CourseCard
                key={course.id}
                {...course}
                badge={{ label: "Matriculado", bg: "#e6f9ee", text: "#155724" }}
                onClick={() => navigate(`/cursos/${course.id}`)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
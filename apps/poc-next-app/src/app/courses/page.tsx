import Link from "next/link";

const MOCK_COURSES = [
  { id: "1", title: "Fundamentos de Segurança Web", description: "Aprenda as bases da OWASP e como proteger suas aplicações." },
  { id: "2", title: "Arquitetura com Next.js 16", description: "Domine o App Router, RSC e Server Actions." },
  { id: "3", title: "Acessibilidade Digital (WCAG)", description: "Torne sua web inclusiva para todos os usuários." },
];

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <main className="mx-auto max-w-5xl space-y-8">
        <header className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Catálogo de Cursos</h1>
          <p className="text-lg text-muted-foreground">Escolha sua trilha de aprendizado e comece agora.</p>
        </header>

        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_COURSES.map((course) => (
            <article key={course.id} className="flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-card-foreground">{course.title}</h2>
                <p className="text-sm text-muted-foreground">{course.description}</p>
              </div>
              <Link
                href={`/courses/${course.id}`}
                className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-colors"
              >
                Ver Detalhes
              </Link>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

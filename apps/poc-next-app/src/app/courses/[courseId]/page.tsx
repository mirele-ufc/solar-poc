import Link from "next/link";
import { use } from "react";

interface CourseDetailsProps {
  params: Promise<{ courseId: string }>;
}

export default function CourseDetailsPage({ params }: CourseDetailsProps) {
  const { courseId } = use(params);

  return (
    <div className="min-h-screen bg-background p-8">
      <main className="mx-auto max-w-3xl space-y-8">
        <nav>
          <Link href="/courses" className="text-sm font-medium text-primary hover:underline">
            ← Voltar ao Catálogo
          </Link>
        </nav>

        <header className="space-y-4">
          <div className="inline-flex rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
            Curso ID: {courseId}
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Detalhes do Curso</h1>
          <p className="text-lg text-muted-foreground">
            Explore a ementa completa e os objetivos de aprendizagem deste treinamento.
          </p>
        </header>

        <section className="rounded-xl border border-border bg-card p-8 shadow-sm">
          <h2 className="mb-4 text-2xl font-semibold text-card-foreground">Ementa</h2>
          <ul className="space-y-4 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">1</span>
              <span>Introdução aos conceitos fundamentais e ambiente de desenvolvimento.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">2</span>
              <span>Mergulho profundo em padrões de arquitetura e segurança.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">3</span>
              <span>Projeto prático final e certificação de conclusão.</span>
            </li>
          </ul>

          <div className="mt-8 flex gap-4">
            <Link
              href={`/courses/${courseId}/enroll`}
              className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 py-2 text-base font-semibold text-primary-foreground hover:opacity-90 transition-colors"
            >
              Matricular-se Agora
            </Link>
            <Link
              href={`/courses/${courseId}/modules`}
              className="inline-flex h-12 items-center justify-center rounded-md border border-border bg-transparent px-8 py-2 text-base font-semibold text-foreground hover:bg-accent transition-colors"
            >
              Ver Módulos
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

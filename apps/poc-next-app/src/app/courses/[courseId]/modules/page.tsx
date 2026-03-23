import Link from "next/link";
import { use } from "react";

interface ModulesProps {
  params: Promise<{ courseId: string }>;
}

export default function ModulesPage({ params }: ModulesProps) {
  const { courseId } = use(params);

  return (
    <div className="min-h-screen bg-background p-8">
      <main className="mx-auto max-w-4xl space-y-8">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">Módulos do Curso</h1>
            <p className="text-lg text-muted-foreground">Acompanhe seu progresso e complete as aulas.</p>
          </div>
          <Link
            href={`/courses/${courseId}/quiz/instructions`}
            className="inline-flex h-10 items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:opacity-90 transition-colors"
          >
            Ir para Avaliação Final
          </Link>
        </header>

        <section className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-card p-6 transition-colors hover:bg-accent/10">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/5 font-bold text-primary">
                  {i}
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground">Título do Módulo {i}</h3>
                  <p className="text-sm text-muted-foreground">4 aulas • 45 min de duração</p>
                </div>
              </div>
              <button className="text-sm font-medium text-primary hover:underline">Acessar Aulas</button>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

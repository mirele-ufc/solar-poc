import Link from "next/link";
import { use } from "react";

interface QuizInstructionsProps {
  params: Promise<{ courseId: string }>;
}

export default function QuizInstructionsPage({ params }: QuizInstructionsProps) {
  const { courseId } = use(params);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <main className="w-full max-w-2xl space-y-8 rounded-xl border border-border bg-card p-10 shadow-lg text-center">
        <header className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-card-foreground">Instruções do Quiz</h1>
          <p className="text-lg text-muted-foreground">Prepare-se para validar seus conhecimentos.</p>
        </header>

        <section className="space-y-6 text-left">
          <div className="rounded-lg bg-muted p-6">
            <h2 className="mb-4 text-xl font-semibold text-foreground">Regras de Avaliação</h2>
            <ul className="list-inside list-disc space-y-3 text-muted-foreground">
              <li>O quiz possui 10 questões de múltipla escolha.</li>
              <li>Você terá 20 minutos para finalizar.</li>
              <li>Nota mínima para aprovação: 70%.</li>
              <li>Não recarregue a página durante a execução.</li>
            </ul>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href={`/courses/${courseId}/quiz`}
              className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-12 text-base font-bold text-primary-foreground hover:opacity-90 transition-colors"
            >
              Iniciar Quiz
            </Link>
            <Link
              href={`/courses/${courseId}/modules`}
              className="inline-flex h-12 items-center justify-center rounded-md border border-border bg-transparent px-8 text-base font-semibold text-foreground hover:bg-accent transition-colors"
            >
              Voltar aos Módulos
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

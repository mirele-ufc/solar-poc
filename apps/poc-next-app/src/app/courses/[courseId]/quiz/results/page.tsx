import Link from "next/link";
import { use } from "react";

interface QuizResultsProps {
  params: Promise<{ courseId: string }>;
}

export default function QuizResultsPage({ params }: QuizResultsProps) {
  const { courseId } = use(params);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <main className="w-full max-w-xl space-y-8 rounded-xl border border-border bg-card p-10 shadow-lg text-center">
        <header className="space-y-4">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/20 text-success-foreground">
            <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-card-foreground">Parabéns!</h1>
          <p className="text-lg text-muted-foreground">Você concluiu a avaliação com sucesso.</p>
        </header>

        <section className="space-y-6">
          <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted p-6">
            <div>
              <p className="text-sm text-muted-foreground">Sua Nota</p>
              <p className="text-3xl font-bold text-foreground">90%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="text-3xl font-bold text-success-foreground">Aprovado</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Link
              href="/courses"
              className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-base font-semibold text-primary-foreground hover:opacity-90 transition-colors"
            >
              Concluir e Sair
            </Link>
            <Link
              href={`/courses/${courseId}/quiz`}
              className="text-sm font-medium text-primary hover:underline"
            >
              Refazer avaliação
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

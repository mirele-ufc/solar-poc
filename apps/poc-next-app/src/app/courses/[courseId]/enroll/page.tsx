import Link from "next/link";
import { use } from "react";

interface EnrollProps {
  params: Promise<{ courseId: string }>;
}

export default function EnrollPage({ params }: EnrollProps) {
  const { courseId } = use(params);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <main className="w-full max-w-md space-y-8 rounded-xl border border-border bg-card p-8 shadow-lg">
        <header className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-card-foreground">Efetivar Matrícula</h1>
          <p className="mt-2 text-muted-foreground">Você está prestes a se inscrever no curso #{courseId}.</p>
        </header>

        <div className="space-y-6">
          <div className="rounded-lg bg-accent/50 p-4">
            <h2 className="text-sm font-semibold text-accent-foreground uppercase tracking-wider">Resumo do Pedido</h2>
            <div className="mt-2 flex justify-between text-foreground">
              <span>Curso Profissionalizante</span>
              <span className="font-bold text-success-foreground">Grátis (POC)</span>
            </div>
          </div>

          <form action="#" method="POST" className="space-y-4">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="terms" required className="h-4 w-4 rounded border-border text-primary focus:ring-primary" />
              <label htmlFor="terms" className="text-sm text-muted-foreground">
                Eu aceito os termos de serviço e política de privacidade.
              </label>
            </div>

            <Link
              href={`/courses/${courseId}/modules`}
              className="flex w-full h-12 items-center justify-center rounded-md bg-primary text-base font-semibold text-primary-foreground hover:opacity-90 transition-colors"
            >
              Confirmar Matrícula
            </Link>
          </form>
        </div>

        <footer className="text-center">
          <Link href={`/courses/${courseId}`} className="text-sm font-medium text-primary hover:underline">
            Cancelar e voltar aos detalhes
          </Link>
        </footer>
      </main>
    </div>
  );
}

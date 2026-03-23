"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId;

  const [currentQuestion, setCurrentQuestion] = useState(1);

  const handleNext = () => {
    if (currentQuestion < 3) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      router.push(`/courses/${courseId}/quiz/results`);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <main className="mx-auto max-w-3xl space-y-8">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Avaliação Final</h1>
          <div className="text-sm font-medium text-muted-foreground">
            Questão <span className="text-primary font-bold">{currentQuestion}</span> de 3
          </div>
        </header>

        <section className="space-y-8 rounded-xl border border-border bg-card p-10 shadow-sm">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-card-foreground leading-relaxed">
              De acordo com as diretrizes de segurança estabelecidas, qual é o princípio fundamental do Zero Trust Client?
            </h2>
          </div>

          <div className="space-y-3">
            {[
              "Confiar apenas em navegadores modernos.",
              "Tratar o cliente como um ambiente não confiável e validar tudo no servidor.",
              "Criptografar todos os dados no LocalStorage.",
              "Utilizar cookies HttpOnly para todas as requisições.",
            ].map((option, idx) => (
              <label
                key={idx}
                className="flex cursor-pointer items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-accent/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5"
              >
                <input type="radio" name="quiz" className="h-4 w-4 text-primary focus:ring-primary" />
                <span className="text-foreground">{option}</span>
              </label>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleNext}
              className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-10 text-base font-semibold text-primary-foreground hover:opacity-90 transition-colors"
            >
              {currentQuestion === 3 ? "Finalizar" : "Próxima Questão"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

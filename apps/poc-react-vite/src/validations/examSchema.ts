import { z } from "zod";

const questionOptionSchema = z.object({
  id: z.string(),
  text: z.string(),
});

export const createQuestionSchema = z
  .object({
    questionText: z.string().trim().min(1, "Escreva o texto da pergunta."),
    options: z.array(questionOptionSchema),
    correctOptionId: z
      .string()
      .trim()
      .min(1, "Selecione a resposta correta no dropdown."),
    points: z.number().min(1).max(10),
  })
  .superRefine((data, ctx) => {
    const filledOptions = data.options.filter(
      (option) => option.text.trim().length > 0,
    );

    if (filledOptions.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Adicione pelo menos 2 alternativas preenchidas.",
        path: ["options"],
      });
      return;
    }

    const hasMatchingCorrectOption = filledOptions.some(
      (option) => option.id === data.correctOptionId,
    );

    if (!hasMatchingCorrectOption) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecione a resposta correta no dropdown.",
        path: ["correctOptionId"],
      });
    }
  });

export type CreateQuestionFormValues = z.infer<typeof createQuestionSchema>;

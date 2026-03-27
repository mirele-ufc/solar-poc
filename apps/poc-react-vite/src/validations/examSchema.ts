import { z } from "zod";
import type { IQuestionAnswer, ISubmitQuizPayload } from "@ava-poc/types";

export const questionAnswerSchema = z.object({
  questionId: z.string().trim().min(1, "ID da pergunta é obrigatório"),
  selectedAnswerIndex: z.number().int().min(0),
}) satisfies z.ZodType<IQuestionAnswer>;

export const quizSubmitSchema = z.object({
  studentId: z.string().trim().min(1, "Aluno é obrigatório"),
  courseId: z.string().trim().min(1, "Curso é obrigatório"),
  answers: z.array(questionAnswerSchema).min(1, "Responda ao menos 1 questão"),
}) satisfies z.ZodType<ISubmitQuizPayload>;

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

export const questionSchema = createQuestionSchema;

export type CreateQuestionFormValues = z.infer<typeof createQuestionSchema>;
export type QuizSubmitFormValues = z.infer<typeof quizSubmitSchema>;

import { z } from "zod";

export const enrollmentFormSchema = z.object({
  firstName: z.string().trim().min(1, "Nome não informado"),
  lastName: z.string().trim().min(1, "Sobrenome não informado"),
  city: z.string().trim().min(1, "Cidade não informada"),
  gender: z.string().trim().min(1, "Gênero não informado"),
});

export const enrollRequestSchema = z.object({
  userId: z.string().trim().min(1, "Usuario e obrigatório"),
  courseId: z.string().trim().min(1, "Curso e obrigatório"),
});

export type EnrollRequest = z.infer<typeof enrollRequestSchema>;

export const toEnrollRequest = (payload: unknown): EnrollRequest =>
  enrollRequestSchema.parse(payload);

export type EnrollmentFormValues = z.infer<typeof enrollmentFormSchema>;

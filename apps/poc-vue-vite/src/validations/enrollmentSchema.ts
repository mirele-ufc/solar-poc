import { z } from "zod";

// Form Schema (presentation layer)
export const enrollmentFormSchema = z.object({
  firstName: z.string().trim().min(1, "Nome não informado"),
  lastName: z.string().trim().min(1, "Sobrenome não informado"),
  city: z.string().trim().min(1, "Cidade não informada"),
  gender: z.string().trim().min(1, "Gênero não informado"),
});

// API Request Schema (contract-first)
export const enrollmentRequestSchema = z.object({
  firstName: z.string().trim().min(1, "Nome não informado"),
  lastName: z.string().trim().min(1, "Sobrenome não informado"),
  city: z.string().trim().min(1, "Cidade não informada"),
  gender: z.string().trim().min(1, "Gênero não informado"),
});

export type EnrollmentFormValues = z.infer<typeof enrollmentFormSchema>;

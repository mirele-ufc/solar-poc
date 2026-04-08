import { z } from 'zod';

// Form Schema (presentation layer)
export const enrollmentFormSchema = z.object({
  firstName: z.string().min(1, 'O nome é obrigatório'),
  lastName: z.string().min(1, 'O sobrenome é obrigatório'),
  city: z.string().min(1, 'A cidade é obrigatória'),
  gender: z.string().min(1, 'Selecione um gênero'),
});

// API Request Schema (contract-first)
export const enrollmentRequestSchema = z.object({
  firstName: z.string().min(1, 'O nome é obrigatório'),
  lastName: z.string().min(1, 'O sobrenome é obrigatório'),
  city: z.string().min(1, 'A cidade é obrigatória'),
  gender: z.string().min(1, 'Selecione um gênero'),
});

export type EnrollmentFormValues = z.infer<typeof enrollmentFormSchema>;
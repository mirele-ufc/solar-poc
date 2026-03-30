import { z } from 'zod';

export const enrollmentSchema = z.object({
  firstName: z.string().min(1, 'O nome é obrigatório'),
  lastName: z.string().min(1, 'O sobrenome é obrigatório'),
  city: z.string().min(1, 'A cidade é obrigatória'),
  gender: z.string().min(1, 'Selecione um gênero'),
});

export type EnrollmentFormValues = z.infer<typeof enrollmentSchema>;
import { z } from 'zod';

/**
 * Schemas de validação para Aulas
 * Alinhado com RNF21 (Validação de Entrada)
 */

// Título da aula
const lessonTitleSchema = z
  .string({ required_error: 'Título da aula é obrigatório' })
  .min(3, 'Título deve ter pelo menos 3 caracteres')
  .max(200, 'Título não pode exceder 200 caracteres');

// Conteúdo da aula (HTML sanitizado pelo backend)
const lessonContentSchema = z
  .string({ required_error: 'Conteúdo da aula é obrigatório' })
  .min(10, 'Conteúdo deve ter pelo menos 10 caracteres')
  .max(50000, 'Conteúdo não pode exceder 50000 caracteres');

// Ordem da aula
const lessonOrderSchema = z
  .number({ errorMap: () => ({ message: 'Ordem deve ser um número' }) })
  .int('Ordem deve ser um inteiro')
  .positive('Ordem deve ser um número positivo');

// Criar aula
export const createLessonSchema = z.object({
  titulo: lessonTitleSchema,
  conteudo: lessonContentSchema,
  ordem: lessonOrderSchema,
  moduloId: z.string().uuid('ID do módulo deve ser um UUID válido'),
});

export type CreateLessonRequest = z.infer<typeof createLessonSchema>;

// Atualizar aula
export const updateLessonSchema = z.object({
  titulo: lessonTitleSchema.optional(),
  conteudo: lessonContentSchema.optional(),
  ordem: lessonOrderSchema.optional(),
});

export type UpdateLessonRequest = z.infer<typeof updateLessonSchema>;

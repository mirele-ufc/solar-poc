import { z } from 'zod';

/**
 * Schemas de validação para Cursos
 * Alinhado com RNF21 (Validação de Entrada)
 */

// Título: 3-200 caracteres
const titleSchema = z
  .string({ required_error: 'Título é obrigatório' })
  .min(3, 'Título deve ter pelo menos 3 caracteres')
  .max(200, 'Título não pode exceder 200 caracteres');

// Descrição: 10-2000 caracteres (opcional)
const descriptionSchema = z
  .string({ required_error: 'Descrição é obrigatória' })
  .min(10, 'Descrição deve ter pelo menos 10 caracteres')
  .max(2000, 'Descrição não pode exceder 2000 caracteres')
  .optional();

// Categoria: lista predefinida
const categorySchema = z.enum([
  'DESENVOLVIMENTO',
  'GESTAO',
  'DESIGN',
  'CIENCIA_DADOS',
  'OUTRO',
]);

// Carga horária: formato "30h", "2h", etc (string validado)
const workloadSchema = z
  .string({ required_error: 'Carga horária é obrigatória' })
  .regex(/^\d+h$/, 'Carga horária deve estar no formato "30h"');

// Criar curso
export const createCourseSchema = z.object({
  titulo: titleSchema,
  descricao: descriptionSchema,
  categoria: categorySchema,
  cargaHoraria: workloadSchema,
});

export type CreateCourseRequest = z.infer<typeof createCourseSchema>;

// Atualizar curso (todos os campos opcionais)
export const updateCourseSchema = z.object({
  titulo: titleSchema.optional(),
  descricao: descriptionSchema,
  categoria: categorySchema.optional(),
  cargaHoraria: workloadSchema.optional(),
});

export type UpdateCourseRequest = z.infer<typeof updateCourseSchema>;

// ID (UUID) — usado em parâmetros de rota
export const uuidSchema = z
  .string({ required_error: 'ID é obrigatório' })
  .uuid('ID deve ser um UUID válido');

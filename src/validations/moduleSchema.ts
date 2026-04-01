import { z } from 'zod';

/**
 * Schemas de validação para Módulos
 * Alinhado com RNF21 (Validação de Entrada)
 */

// Título do módulo
const moduleTitleSchema = z
  .string({ required_error: 'Título do módulo é obrigatório' })
  .min(3, 'Título deve ter pelo menos 3 caracteres')
  .max(200, 'Título não pode exceder 200 caracteres');

// Ordem do módulo (número positivo)
const moduleOrderSchema = z
  .number({ errorMap: () => ({ message: 'Ordem deve ser um número' }) })
  .int('Ordem deve ser um inteiro')
  .positive('Ordem deve ser um número positivo');

// Criar módulo
export const createModuleSchema = z.object({
  titulo: moduleTitleSchema,
  ordem: moduleOrderSchema,
  cursoId: z.string().uuid('ID do curso deve ser um UUID válido'),
});

export type CreateModuleRequest = z.infer<typeof createModuleSchema>;

// Atualizar módulo
export const updateModuleSchema = z.object({
  titulo: moduleTitleSchema.optional(),
  ordem: moduleOrderSchema.optional(),
});

export type UpdateModuleRequest = z.infer<typeof updateModuleSchema>;

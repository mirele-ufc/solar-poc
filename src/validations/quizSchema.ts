import { z } from 'zod';

/**
 * Schemas de validação para Provas
 * Alinhado com RNF21 (Validação de Entrada)
 */

// Título da prova
const quizTitleSchema = z
  .string({ required_error: 'Título da prova é obrigatório' })
  .min(3, 'Título deve ter pelo menos 3 caracteres')
  .max(200, 'Título não pode exceder 200 caracteres');

// Descrição da prova
const quizDescriptionSchema = z
  .string({ required_error: 'Descrição da prova é obrigatória' })
  .min(10, 'Descrição deve ter pelo menos 10 caracteres')
  .max(2000, 'Descrição não pode exceder 2000 caracteres')
  .optional();

// Número de questões
const questionCountSchema = z
  .number({ errorMap: () => ({ message: 'Número de questões deve ser um número' }) })
  .int('Número deve ser um inteiro')
  .positive('Deve ter pelo menos 1 questão')
  .max(100, 'Máximo 100 questões');

// Tipo de geração (manual ou IA)
const generationTypeSchema = z.enum(['MANUAL', 'IA']);

// Criar prova
export const createQuizSchema = z.object({
  titulo: quizTitleSchema,
  descricao: quizDescriptionSchema,
  moduloId: z.string().uuid('ID do módulo deve ser um UUID válido'),
});

export type CreateQuizRequest = z.infer<typeof createQuizSchema>;

// Solicitar geração de prova por IA
export const generateQuizSchema = z.object({
  titulo: quizTitleSchema,
  descricao: quizDescriptionSchema,
  moduloId: z.string().uuid('ID do módulo deve ser um UUID válido'),
  numeroDePergundas: questionCountSchema,
  tipoDeGeracao: generationTypeSchema.default('IA'),
});

export type GenerateQuizRequest = z.infer<typeof generateQuizSchema>;

// Atualizar prova
export const updateQuizSchema = z.object({
  titulo: quizTitleSchema.optional(),
  descricao: quizDescriptionSchema,
});

export type UpdateQuizRequest = z.infer<typeof updateQuizSchema>;

// Pergunta (questão)
const questionTextSchema = z
  .string({ required_error: 'Texto da pergunta é obrigatório' })
  .min(5, 'Pergunta deve ter pelo menos 5 caracteres')
  .max(2000, 'Pergunta não pode exceder 2000 caracteres');

// Alternativa
const alternativeTextSchema = z
  .string({ required_error: 'Texto da alternativa é obrigatório' })
  .min(1, 'Alternativa não pode estar vazia')
  .max(500, 'Alternativa não pode exceder 500 caracteres');

// Criar pergunta
export const createQuestionSchema = z.object({
  texto: questionTextSchema,
  provaId: z.string().uuid('ID da prova deve ser um UUID válido'),
});

export type CreateQuestionRequest = z.infer<typeof createQuestionSchema>;

// Criar alternativa
export const createAlternativeSchema = z.object({
  texto: alternativeTextSchema,
  ehCorreta: z.boolean({ errorMap: () => ({ message: 'Indicador de correto é obrigatório' }) }),
  perguntaId: z.string().uuid('ID da pergunta deve ser um UUID válido'),
});

export type CreateAlternativeRequest = z.infer<typeof createAlternativeSchema>;

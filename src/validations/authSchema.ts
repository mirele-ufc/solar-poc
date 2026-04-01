import { z } from 'zod';

/**
 * Schema de validação para autenticação
 * Alinhado com RNF21 (Validação de Entrada)
 */

// Email: formato válido, máximo 255 caracteres
const emailSchema = z
  .string({ required_error: 'Email é obrigatório' })
  .email('Email inválido')
  .max(255, 'Email não pode exceder 255 caracteres');

// Senha: mínimo 8 caracteres, máximo 255
// Tipicamente requer: maiúscula, minúscula, número, caractere especial
const passwordSchema = z
  .string({ required_error: 'Senha é obrigatória' })
  .min(8, 'Senha deve ter pelo menos 8 caracteres')
  .max(255, 'Senha não pode exceder 255 caracteres');

// CPF: 11 dígitos numéricos (formato sem formatação)
// Validação básica de comprimento; validação de checksum é responsabilidade do backend
const cpfSchema = z
  .string({ required_error: 'CPF é obrigatório' })
  .regex(/^\d{11}$/, 'CPF deve conter 11 dígitos');

// Nome: texto alfa-numérico com espaços e hífens, 3-255 caracteres
const nameSchema = z
  .string({ required_error: 'Nome é obrigatório' })
  .min(3, 'Nome deve ter pelo menos 3 caracteres')
  .max(255, 'Nome não pode exceder 255 caracteres')
  .regex(/^[a-zA-ZÀ-ÿ\s\-']+$/, 'Nome contém caracteres inválidos');

// Login: email ou CPF
export const loginSchema = z.object({
  email: emailSchema,
  senha: passwordSchema,
});

export type LoginRequest = z.infer<typeof loginSchema>;

// Cadastro (novo usuário)
export const registerSchema = z.object({
  nome: nameSchema,
  email: emailSchema,
  cpf: cpfSchema,
  senha: passwordSchema,
  confirmarSenha: z.string({ required_error: 'Confirmação de senha é obrigatória' }),
}).refine((data) => data.senha === data.confirmarSenha, {
  message: 'Senhas não conferem',
  path: ['confirmarSenha'],
});

export type RegisterRequest = z.infer<typeof registerSchema>;

// Recuperação de senha (step 1: email)
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordRequest = z.infer<typeof forgotPasswordSchema>;

// Redefinição de senha (step 2: nova senha)
export const resetPasswordSchema = z.object({
  token: z.string({ required_error: 'Token é obrigatório' }).min(1),
  senha: passwordSchema,
  confirmarSenha: z.string({ required_error: 'Confirmação de senha é obrigatória' }),
}).refine((data) => data.senha === data.confirmarSenha, {
  message: 'Senhas não conferem',
  path: ['confirmarSenha'],
});

export type ResetPasswordRequest = z.infer<typeof resetPasswordSchema>;

// Validação de perfil de usuário
export const profileSchema = z.enum(['PROFESSOR', 'ALUNO', 'ADMIN']);
export type UserProfile = z.infer<typeof profileSchema>;

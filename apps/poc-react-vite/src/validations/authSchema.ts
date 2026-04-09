import { z } from "zod";
import type { ILoginRequest } from "@ava-poc/types";
import type { IRegisterPayload } from "@/services/types/authService.types";

const cpfRegex = /^(\d{3}\.\d{3}\.\d{3}-\d{2}|\d{11})$/;
const emailOrUsernameRegex =
  /^(?:[^\s@]+@[^\s@]+\.[^\s@]+|[a-zA-Z0-9._-]{3,50})$/;

// Contract-first schemas for API payload validation.
export const loginRequestSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email ou usuário não informado")
    .regex(emailOrUsernameRegex, "Email ou usuário inválido"),
  senha: z
    .string()
    .trim()
    .min(1, "Senha não informada")
    .min(6, "A senha deve ter ao menos 6 caracteres"),
}) satisfies z.ZodType<ILoginRequest>;

export const registerRequestSchema = z.object({
  nome: z.string().trim().min(1, "Nome não informado"),
  cpf: z
    .string()
    .trim()
    .min(1, "CPF não informado")
    .regex(cpfRegex, "CPF inválido"),
  email: z
    .string()
    .trim()
    .min(1, "Email não informado")
    .email("Email inválido"),
  senha: z
    .string()
    .trim()
    .min(1, "Senha não informada")
    .min(6, "A senha deve ter ao menos 6 caracteres"),
}) satisfies z.ZodType<IRegisterPayload>;

export const forgotPasswordRequestSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email não informado")
    .email("Email inválido"),
});

export const registerFormSchema = z
  .object({
    nome: z
      .string()
      .trim()
      .min(1, "Nome não informado")
      .min(3, "Mínimo 3 caracteres"),
    cpf: z
      .string()
      .trim()
      .min(1, "CPF não informado")
      .regex(cpfRegex, "CPF inválido"),
    email: z
      .string()
      .trim()
      .min(1, "Email não informado")
      .email("Email inválido"),
    password: z
      .string()
      .trim()
      .min(1, "Senha não informada")
      .min(6, "A senha deve ter ao menos 6 caracteres"),
    confirmPassword: z
      .string()
      .trim()
      .min(1, "Confirmação de senha não informada"),
    perfil: z.enum(["professor", "student"], {
      message: "Perfil inválido. Escolha professor ou student",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas não coincidem",
  });

export type RegisterFormValues = z.infer<typeof registerFormSchema>;

export const loginSchema = z.object({
  emailOuUsuario: z
    .string()
    .trim()
    .min(1, "E-mail ou nome de usuário obrigatório")
    .refine(
      (value) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
        /^[a-zA-Z0-9._-]{3,50}$/.test(value),
      "E-mail ou nome de usuário inválido",
    ),
  senha: z.string().trim().min(6, "Mínimo 6 caracteres"),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email não informado")
    .email("Email inválido"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function toLoginRequest(values: LoginFormValues): ILoginRequest {
  return {
    email: values.emailOuUsuario.trim(),
    senha: values.senha,
  };
}

export function toRegisterRequest(
  values: RegisterFormValues,
  nome: string,
): IRegisterPayload {
  return {
    nome: nome.trim(),
    cpf: values.cpf,
    email: values.email,
    senha: values.password,
  };
}

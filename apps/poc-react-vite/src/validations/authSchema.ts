import { z } from "zod";

const cpfRegex = /^(\d{3}\.\d{3}\.\d{3}-\d{2}|\d{11})$/;

export const registerSchema = z
  .object({
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
    gender: z.string().trim().min(1, "Gênero não informado"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas não coincidem",
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  username: z.string().trim().min(1, "Login não informado"),
  password: z.string().trim().min(1, "Senha não informada"),
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

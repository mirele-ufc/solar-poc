import { z } from "zod";

export const registerSchema = z.object({
  nome: z
    .string({
      error: "O nome é obrigatório",
    })
    .min(3, "O nome deve ter no mínimo 3 caracteres"),

  cpf: z
    .string({
      error: "O CPF é obrigatório",
    })
    .regex(
      /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/,
      "O CPF deve estar no formato 000.000.000-00 ou conter 11 dígitos numéricos",
    ),

  email: z
    .string({
      error: "O e-mail é obrigatório",
    })
    .email("Formato de e-mail inválido"),

  senha: z
    .string({
      error: "A senha é obrigatória",
    })
    .min(8, "A senha deve ter no mínimo 8 caracteres"),

  perfil: z.enum(["PROFESSOR", "ALUNO", "ADMIN"], {
    error: "O perfil é obrigatório",
  }),
});

export type registerSchema = z.infer<typeof registerSchema>;

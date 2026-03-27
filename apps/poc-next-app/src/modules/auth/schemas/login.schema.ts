import { z } from "zod";

export const loginSchema = z.object({
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
});

export type loginSchema = z.infer<typeof loginSchema>;

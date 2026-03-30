import { z } from "zod";

export const composeMessageSchema = z.object({
  recipient: z.string().trim().min(1, "Selecione um destinatário"),
  subject: z
    .string()
    .trim()
    .min(1, "O assunto é obrigatório")
    .max(200, "O assunto deve ter no máximo 200 caracteres"),
  message: z
    .string()
    .trim()
    .min(1, "O texto da mensagem é obrigatório")
    .max(2000, "A mensagem deve ter no máximo 2000 caracteres"),
});

export type ComposeMessageFormValues = z.infer<typeof composeMessageSchema>;

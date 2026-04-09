import { z } from "zod";

export const messageComposeFormSchema = z.object({
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

export const sendMessageRequestSchema = z.object({
  senderId: z.string().trim().min(1, "Remetente e obrigatório"),
  receiverId: z.string().trim().min(1, "Destinatario e obrigatório"),
  courseId: z.string().trim().optional(),
  content: z
    .string()
    .trim()
    .min(1, "Mensagem nao pode estar vazia")
    .max(1000, "Mensagem deve ter no maximo 1000 caracteres"),
});

export type SendMessageRequest = z.infer<typeof sendMessageRequestSchema>;

export const toSendMessageRequest = (payload: unknown): SendMessageRequest =>
  sendMessageRequestSchema.parse(payload);

export type ComposeMessageFormValues = z.infer<typeof messageComposeFormSchema>;

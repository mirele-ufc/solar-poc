import { z } from "zod";

export const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;

export const SAFE_IMAGE_MIME_TYPES = ["image/jpeg", "image/png"] as const;
export const SAFE_DOCUMENT_MIME_TYPES = ["application/pdf"] as const;
export const SAFE_UPLOAD_MIME_TYPES = [
  ...SAFE_IMAGE_MIME_TYPES,
  ...SAFE_DOCUMENT_MIME_TYPES,
] as const;

export const imageFileSchema = z
  .instanceof(File, { message: "A imagem é obrigatória" })
  .refine(
    (file) =>
      SAFE_IMAGE_MIME_TYPES.includes(
        file.type as (typeof SAFE_IMAGE_MIME_TYPES)[number],
      ),
    { message: "Formato inválido. Envie JPG ou PNG" },
  )
  .refine((file) => file.size <= MAX_UPLOAD_SIZE_BYTES, {
    message: "O arquivo deve ter menos de 5MB",
  });

export const uploadFileSchema = z
  .instanceof(File, { message: "Arquivo inválido" })
  .refine(
    (file) =>
      SAFE_UPLOAD_MIME_TYPES.includes(
        file.type as (typeof SAFE_UPLOAD_MIME_TYPES)[number],
      ),
    { message: "Formato inválido. Envie JPG, PNG ou PDF" },
  )
  .refine((file) => file.size <= MAX_UPLOAD_SIZE_BYTES, {
    message: "O arquivo deve ter menos de 5MB",
  });

export const optionalUploadFileSchema = uploadFileSchema.nullable().optional();

import { z } from "zod";

const MAX_SIZE_5MB = 5 * 1024 * 1024;
const MAX_SIZE_50MB = 50 * 1024 * 1024;

const ALLOWED_EXTENSIONS = {
  IMAGE: ["jpg", "jpeg", "png"],
  DOCUMENT: ["pdf", "docx"],
  VIDEO: ["mp4"],
};

const MAGIC_BYTES = {
  PDF: "25504446",
  PNG: "89504E47",
  JPG: "FFD8FF",
  MP4_FTYP: "66747970",
  DOCX: "504B0304", 
};

const getFileHeader = (file: File, bytesToRead = 8): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = (e) => {
      if (e.target?.readyState === FileReader.DONE) {
        const arr = new Uint8Array(e.target.result as ArrayBuffer);
        const hex = Array.from(arr)
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("").toUpperCase();
        resolve(hex);
      }
    };
    reader.onerror = () => reject("Erro ao ler assinatura do arquivo");
    reader.readAsArrayBuffer(file.slice(0, bytesToRead));
  });
};

const getExtension = (filename: string): string => {
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop()?.toLowerCase() || "" : "";
};

const verifyFileIntegrity = async (
  file: File,
  expectedType: "IMAGE" | "DOCUMENT" | "VIDEO"
) => {
  const ext = getExtension(file.name);

  if (!ALLOWED_EXTENSIONS[expectedType].includes(ext)) {
    return false;
  }

  try {
    const hex = await getFileHeader(file, 8);

    if (expectedType === "DOCUMENT") {
      const isPdf = file.type === "application/pdf" && ext === "pdf" && hex.startsWith(MAGIC_BYTES.PDF);
      const isDocx = file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" && ext === "docx" && hex.startsWith(MAGIC_BYTES.DOCX);
      return isPdf || isDocx;
    }

    if (expectedType === "IMAGE") {
      const isJpg = (file.type === "image/jpeg" || file.type === "image/jpg") && (ext === "jpg" || ext === "jpeg") && hex.startsWith(MAGIC_BYTES.JPG);
      const isPng = file.type === "image/png" && ext === "png" && hex.startsWith(MAGIC_BYTES.PNG);
      return isJpg || isPng;
    }

    if (expectedType === "VIDEO") {
      return file.type === "video/mp4" && ext === "mp4" && hex.includes(MAGIC_BYTES.MP4_FTYP);
    }

    return false;
  } catch {
    return false;
  }
};

export const imageFileSchema = z
  .instanceof(File, { message: "A imagem é obrigatória" })
  .refine((file) => file.size <= MAX_SIZE_5MB, "A imagem deve ter no máximo 5MB")
  .refine(
    async (file) => await verifyFileIntegrity(file, "IMAGE"),
    "Formato inválido. Apenas arquivos .jpg, .jpeg e .png são aceitos."
  );

export const documentFileSchema = z
  .instanceof(File, { message: "O documento é obrigatório" })
  .refine((file) => file.size <= MAX_SIZE_5MB, "O documento deve ter no máximo 5MB")
  .refine(
    async (file) => await verifyFileIntegrity(file, "DOCUMENT"),
    "Formato inválido. Apenas arquivos .pdf e .docx são aceitos."
  );

export const videoFileSchema = z
  .instanceof(File, { message: "O vídeo é obrigatório" })
  .refine((file) => file.size <= MAX_SIZE_50MB, "O vídeo deve ter no máximo 50MB")
  .refine(
    async (file) => await verifyFileIntegrity(file, "VIDEO"),
    "Formato inválido. Apenas arquivos .mp4 autênticos são aceitos."
  );

export const uploadFileSchema = z
  .instanceof(File, { message: "Arquivo inválido" })
  .superRefine(async (file, ctx) => {
    
    if (file.type === "video/mp4" && file.size > MAX_SIZE_50MB) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Vídeos devem ter até 50MB" });
      return;
    }
    if (file.type !== "video/mp4" && file.size > MAX_SIZE_5MB) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Imagens e documentos devem ter até 5MB" });
      return;
    }

    const ext = getExtension(file.name);
    let isValid = false;

    if (ALLOWED_EXTENSIONS.DOCUMENT.includes(ext)) {
      isValid = await verifyFileIntegrity(file, "DOCUMENT");
    } else if (ALLOWED_EXTENSIONS.IMAGE.includes(ext)) {
      isValid = await verifyFileIntegrity(file, "IMAGE");
    } else if (ALLOWED_EXTENSIONS.VIDEO.includes(ext)) {
      isValid = await verifyFileIntegrity(file, "VIDEO");
    }

    if (!isValid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Arquivo rejeitado. Extensão ou tipo não permitidos na plataforma.",
      });
    }
  });

export const optionalUploadFileSchema = uploadFileSchema.nullable().optional();
import { 
  imageFileSchema, 
  documentFileSchema, 
  videoFileSchema, 
  uploadFileSchema 
} from '@/validations/fileSchema';

export type AllowedFileType = 'IMAGE' | 'DOCUMENT' | 'VIDEO' | 'ANY';

export interface ValidationResult {
  isValid: boolean;
  errorMessage: string | null;
  file: File | null;
}

/**
 * Middleware centralizado para validação de arquivos pré-upload.
 * Proteção contra WSTG-INPV-001 (Extensões mascaradas e Magic Bytes).
 */
export const validateFileBeforeUpload = async (
  file: File, 
  expectedType: AllowedFileType = 'ANY'
): Promise<ValidationResult> => {
  
  let validation;

  // Direciona para o schema correto com base no contexto do componente
  switch (expectedType) {
    case 'IMAGE':
      validation = await imageFileSchema.safeParseAsync(file);
      break;
    case 'DOCUMENT':
      validation = await documentFileSchema.safeParseAsync(file);
      break;
    case 'VIDEO':
      validation = await videoFileSchema.safeParseAsync(file);
      break;
    case 'ANY':
    default:
      validation = await uploadFileSchema.safeParseAsync(file);
      break;
  }

  if (!validation.success) {
    return {
      isValid: false,
      errorMessage: validation.error.issues[0].message,
      file: null,
    };
  }

  return {
    isValid: true,
    errorMessage: null,
    file: file,
  };
};
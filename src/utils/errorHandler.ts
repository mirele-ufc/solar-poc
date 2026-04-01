import { isAxiosError } from 'axios';
import { isApiErrorException } from '@/types/errors';

/**
 * Manipuladores de erro
 * Alinhado com RNF26 (Error Handling)
 */

// Extrair mensagem de erro de qualquer tipo de erro
export const getErrorMessage = (error: unknown): string => {
  if (isApiErrorException(error)) {
    return error.message;
  }

  if (isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Erro desconhecido. Tente novamente.';
};

// Verificar se é erro de autenticação (401)
export const isAuthenticationError = (error: unknown): boolean => {
  return isApiErrorException(error) && error.isAuthError();
};

// Verificar se é erro de validação (400)
export const isValidationError = (error: unknown): boolean => {
  return isApiErrorException(error) && error.statusCode === 400;
};

// Verificar se é erro de erro de rede
export const isNetworkError = (error: unknown): boolean => {
  return isApiErrorException(error) && error.isNetworkError();
};

// Verificar se é erro de servidor (5xx)
export const isServerError = (error: unknown): boolean => {
  if (isApiErrorException(error)) {
    return error.statusCode !== null && (error.statusCode ?? 0) >= 500;
  }
  return false;
};

// Obter mensagem de erro amigável para o usuário
export const getUserFriendlyErrorMessage = (error: unknown): string => {
  if (!isApiErrorException(error)) {
    return getErrorMessage(error);
  }

  // Para agora, apenas retornar a mensagem de erro
  // Em produção, você pode mapear errorCode para mensagens localizadas
  return error.message;
};

// Registrar erro em console (development)
export const logError = (
  context: string,
  error: unknown,
  additional?: Record<string, unknown>
): void => {
  if (process.env.NODE_ENV !== 'development') return;

  const message = getErrorMessage(error);
  console.error(`[${context}] ${message}`, {
    error,
    additional,
  });
};

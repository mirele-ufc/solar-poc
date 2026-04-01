/**
 * Tipos de erro personalizados
 */

// ═══════════════════════════════════════════════════════════════════════════════
// ◆ ERROR CODES
// ═══════════════════════════════════════════════════════════════════════════════

export enum ErrorCode {
  // Auth
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
  INVALID_TOKEN = 'INVALID_TOKEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  UNAUTHORIZED = 'UNAUTHORIZED',

  // Validation
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  REQUIRED_FIELD = 'REQUIRED_FIELD',

  // Network
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  NOT_FOUND = 'NOT_FOUND',
  SERVER_ERROR = 'SERVER_ERROR',

  // Generic
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

// ═══════════════════════════════════════════════════════════════════════════════
// ◆ CUSTOM ERROR CLASS
// ═══════════════════════════════════════════════════════════════════════════════

export class ApiErrorException extends Error {
  constructor(
    public code: ErrorCode,
    public message: string,
    public details?: Record<string, unknown>,
    public statusCode?: number,
  ) {
    super(message);
    this.name = 'ApiErrorException';
    Object.setPrototypeOf(this, ApiErrorException.prototype);
  }

  isClientError(): boolean {
    return this.statusCode ? this.statusCode >= 400 && this.statusCode < 500 : false;
  }

  isServerError(): boolean {
    return this.statusCode ? this.statusCode >= 500 : false;
  }

  isNetworkError(): boolean {
    return [ErrorCode.NETWORK_ERROR, ErrorCode.TIMEOUT].includes(this.code);
  }

  isAuthError(): boolean {
    return [
      ErrorCode.INVALID_CREDENTIALS,
      ErrorCode.UNAUTHORIZED,
      ErrorCode.TOKEN_EXPIRED,
      ErrorCode.INVALID_TOKEN,
    ].includes(this.code);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ◆ VALIDATION ERROR
// ═══════════════════════════════════════════════════════════════════════════════

export interface FieldError {
  field: string;
  message: string;
}

export class ValidationError extends ApiErrorException {
  constructor(
    public errors: FieldError[],
    message = 'Erro de validação',
  ) {
    super(ErrorCode.VALIDATION_ERROR, message, { errors });
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }

  getFieldError(fieldName: string): FieldError | undefined {
    return this.errors.find((err) => err.field === fieldName);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ◆ TYPE GUARDS
// ═══════════════════════════════════════════════════════════════════════════════

export function isApiErrorException(error: unknown): error is ApiErrorException {
  return error instanceof ApiErrorException;
}

export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

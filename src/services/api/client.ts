/**
 * Cliente HTTP reutilizável com Axios
 * Inclui interceptors para JWT, erro handling, etc
 * Separado da lógica React para poder ser usado em Next/Vue
 */

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';

import { ApiErrorException, ErrorCode, ValidationError, FieldError } from '../../types/errors';
import type { ApiResponse } from '../../types';

// ═══════════════════════════════════════════════════════════════════════════════
// ◆ TIPOS
// ═══════════════════════════════════════════════════════════════════════════════

export interface ApiClientConfig {
  baseURL?: string;
  timeout?: number;
  withCredentials?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ◆ CLIENTE HTTP
// ═══════════════════════════════════════════════════════════════════════════════

class ApiClient {
  private http: AxiosInstance;

  constructor(config?: ApiClientConfig) {
    const baseURL = config?.baseURL || process.env.VITE_API_URL || 'http://localhost:8080';
    const timeout = config?.timeout || (parseInt(process.env.VITE_API_TIMEOUT || '30000', 10));

    this.http = axios.create({
      baseURL,
      timeout,
      withCredentials: config?.withCredentials ?? true, // Importante para cookies httpOnly
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Setup interceptors
    this.setupInterceptors();
  }

  // ───────────────────────────────────────────────────────────────────────────────
  // REQUEST INTERCEPTOR
  // ───────────────────────────────────────────────────────────────────────────────

  private setupInterceptors(): void {
    // Request interceptor: adicionar JWT se existir
    this.http.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // JWT será injetado automaticamente se estiver em cookie httpOnly
        // Nenhuma ação necessária aqui

        // Debug mode (development)
        if (process.env.VITE_DEBUG_MODE === 'true') {
          console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
        }

        return config;
      },
      (error) => {
        return Promise.reject(this.handleError(error));
      },
    );

    // Response interceptor: tratar erros globalmente
    this.http.interceptors.response.use(
      (response: AxiosResponse) => {
        if (process.env.VITE_DEBUG_MODE === 'true') {
          console.log(`[API Response] ${response.status} ${response.config.url}`);
        }
        return response;
      },
      (error: AxiosError) => {
        return Promise.reject(this.handleError(error));
      },
    );
  }

  // ───────────────────────────────────────────────────────────────────────────────
  // ERROR HANDLER
  // ───────────────────────────────────────────────────────────────────────────────

  private handleError(error: AxiosError | Error): ApiErrorException {
    // Erro de rede (sem resposta do servidor)
    if (axios.isAxiosError(error) && !error.response) {
      // Timeout
      if (error.code === axios.AxiosError.ECONNABORTED) {
        return new ApiErrorException(
          ErrorCode.TIMEOUT,
          'Tempo limite de conexão excedido',
          undefined,
          408,
        );
      }

      // Erro de rede
      return new ApiErrorException(
        ErrorCode.NETWORK_ERROR,
        'Erro de conexão com o servidor',
        undefined,
        0,
      );
    }

    // Erro com resposta (HTTP error)
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const data = error.response.data as Record<string, unknown>;

      // 401 Unauthorized → precisa fazer login
      if (status === 401) {
        // Limpar token e redirecionar será feito no React layer
        return new ApiErrorException(
          ErrorCode.UNAUTHORIZED,
          data?.message || 'Não autorizado. Faça login novamente.',
          undefined,
          401,
        );
      }

      // 400 Bad Request → validação
      if (status === 400) {
        // Tentar extrair erros de validação
        const errors = this.extractValidationErrors(data);
        if (errors.length > 0) {
          return new ValidationError(errors, data?.message || 'Erro de validação');
        }

        return new ApiErrorException(
          ErrorCode.INVALID_INPUT,
          data?.message || 'Dados inválidos',
          data,
          400,
        );
      }

      // 404 Not Found
      if (status === 404) {
        return new ApiErrorException(
          ErrorCode.NOT_FOUND,
          data?.message || 'Recurso não encontrado',
          undefined,
          404,
        );
      }

      // 5xx Server Error
      if (status >= 500) {
        return new ApiErrorException(
          ErrorCode.SERVER_ERROR,
          data?.message || 'Erro no servidor. Tente novamente mais tarde.',
          undefined,
          status,
        );
      }

      // Erro genérico
      return new ApiErrorException(
        ErrorCode.UNKNOWN_ERROR,
        data?.message || 'Erro desconhecido',
        data,
        status,
      );
    }

    // Erro desconhecido
    return new ApiErrorException(
      ErrorCode.UNKNOWN_ERROR,
      error instanceof Error ? error.message : 'Erro desconhecido',
      undefined,
      undefined,
    );
  }

  /**
   * Extrair erros de validação do response
   */
  private extractValidationErrors(data: Record<string, unknown>): FieldError[] {
    const errors: FieldError[] = [];

    // Backend pode retornar erros em verschiedenen formatos:
    // { errors: { field1: "message", field2: "message" } }
    // ou { fieldErrors: [...] }
    // ou { details: { field: "error message" } }

    if (data.errors && typeof data.errors === 'object') {
      Object.entries(data.errors).forEach(([field, message]) => {
        errors.push({
          field,
          message: typeof message === 'string' ? message : String(message),
        });
      });
    }

    if (Array.isArray(data.fieldErrors)) {
      return data.fieldErrors as FieldError[];
    }

    return errors;
  }

  // ───────────────────────────────────────────────────────────────────────────────
  // PUBLIC METHODS
  // ───────────────────────────────────────────────────────────────────────────────

  /**
   * GET request
   */
  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.http.get<T>(url, config);
  }

  /**
   * POST request
   */
  async post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.http.post<T>(url, data, config);
  }

  /**
   * PUT request
   */
  async put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.http.put<T>(url, data, config);
  }

  /**
   * PATCH request
   */
  async patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.http.patch<T>(url, data, config);
  }

  /**
   * DELETE request
   */
  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.http.delete<T>(url, config);
  }

  /**
   * Fazer upload de arquivo (multipart/form-data)
   */
  async uploadFile<T = unknown>(
    url: string,
    file: File,
    fieldName: string = 'arquivo',
    additionalData?: Record<string, unknown>,
  ): Promise<AxiosResponse<T>> {
    const formData = new FormData();
    formData.append(fieldName, file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });
    }

    return this.http.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * Definir header (ex: authorization)
   */
  setHeader(key: string, value: string): void {
    this.http.defaults.headers.common[key] = value;
  }

  /**
   * Remover header
   */
  removeHeader(key: string): void {
    delete this.http.defaults.headers.common[key];
  }

  /**
   * Acessar instância axios diretamente (se necessário)
   */
  getAxios(): AxiosInstance {
    return this.http;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ◆ SINGLETON
// ═══════════════════════════════════════════════════════════════════════════════

let apiClientInstance: ApiClient | null = null;

export function getApiClient(config?: ApiClientConfig): ApiClient {
  if (!apiClientInstance) {
    apiClientInstance = new ApiClient(config);
  }
  return apiClientInstance;
}

// Export default instance
export const apiClient = getApiClient();

export default apiClient;

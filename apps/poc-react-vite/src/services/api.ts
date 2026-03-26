import axios, { AxiosInstance, AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";
import { IApiError } from "@ava-poc/types";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * Base Axios instance configuration
 * Centralizes all API communication with consistent settings and global error handling
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Response interceptor for global error handling
 * - Shows user-facing toast notifications for known HTTP error codes (RF39-RF44)
 * - On 401: clears session and redirects to login
 * - Standardizes error shape for callers
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: unknown) => {
    if (error instanceof AxiosError) {
      const status = error.response?.status;

      if (status === 401) {
        toast.error("Sessão expirada. Faça login novamente.");
        useAuthStore.getState().logout();
        window.location.href = "/";
      } else if (status === 403) {
        toast.error("Você não tem permissão para realizar esta ação.");
      } else if (status === 409) {
        toast.error(error.response?.data?.message || "Recurso em conflito.");
      } else if (status === 422) {
        toast.error("Dados inválidos. Verifique os campos.");
      } else if (status !== undefined && status >= 500) {
        toast.error("Erro no servidor. Tente novamente.");
      }

      const apiError: IApiError = {
        message:
          error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred",
        status,
        statusText: error.response?.statusText,
        timestamp: new Date().toISOString(),
      };

      return Promise.reject(apiError);
    }

    const apiError: IApiError = {
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
      timestamp: new Date().toISOString(),
    };

    return Promise.reject(apiError);
  },
);

/**
 * Request interceptor for future enhancements
 * Can be used to add authorization headers, request tracking, etc.
 */
apiClient.interceptors.request.use(
  (config) => {
    // Example: Add custom headers if needed
    // const token = getAuthToken(); // This should come from a secure context
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export { apiClient };

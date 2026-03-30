import axios, {
  AxiosInstance,
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { toast } from "sonner";
import { IApiError } from "@ava-poc/types";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/authService";

/**
 * Base Axios instance configuration
 * Centralizes all API communication with consistent settings and global error handling
 */
const apiClient: AxiosInstance = axios.create({
  // Usa URL explícita do backend local por padrão para evitar 404 em rotas com prefixo /api inexistente.
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

/**
 * Helper function to handle session expiration
 * Displays error toast, clears authentication state, and redirects to login
 */
function handleSessionExpired(): void {
  toast.error("Sessão expirada. Faça login novamente.");
  useAuthStore.getState().logout();
  // Só redireciona se não estiver na tela de login
  if (
    window.location.pathname !== "/" &&
    window.location.pathname !== "/login"
  ) {
    window.location.href = "/";
  }
}

/**
 * Response interceptor with automatic refresh token flow
 *
 * Behavior:
 * 1. On 401 (token expired):
 *    - Check if already retried (prevent infinite loop via _retry flag)
 *    - If not retried: attempt automatic token refresh
 *    - Request new access token using refresh token
 *    - Update store with new tokens
 *    - Retry original request with new token
 *
 * 2. If refresh fails (e.g., refresh token expired):
 *    - Clear session (logout)
 *    - Redirect to login page
 *
 * 3. For all other errors:
 *    - Show appropriate user-facing toast notifications
 *    - Pass error to caller
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: unknown) => {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const errorMessage = error.response?.data?.message || error.message;

      // Debug: log all errors to console for troubleshooting
      console.error(
        "[API Error]",
        {
          status,
          message: errorMessage,
          url: error.config?.url,
          code: error.code,
        },
        error,
      );

      // Handle 401 with automatic refresh token flow
      const requestConfig = error.config as RetryableRequestConfig | undefined;

      if (status === 401 && requestConfig && !requestConfig._retry) {
        // Mark this config as retry to prevent infinite loop
        requestConfig._retry = true;

        try {
          // Get refresh token from store
          const refreshToken = useAuthStore.getState().refreshToken;

          if (!refreshToken) {
            // No refresh token available - must log out
            handleSessionExpired();
            return Promise.reject({
              message: "No refresh token available",
              status: 401,
              timestamp: new Date().toISOString(),
            } as IApiError);
          }

          // Attempt to refresh access token
          const response = await authService.refreshAccessToken(refreshToken);

          // Update store with new access token (refresh token remains the same)
          useAuthStore.getState().setTokens(response.accessToken, refreshToken);

          // Update the original request's Authorization header with new token
          if (requestConfig.headers) {
            requestConfig.headers.Authorization = `Bearer ${response.accessToken}`;
          }

          // Retry the original request with new token
          return apiClient(requestConfig);
        } catch (refreshError) {
          // Refresh token is invalid or expired - must log out
          console.error("[API Refresh Failed]", refreshError);
          handleSessionExpired();

          const apiError: IApiError = {
            message:
              refreshError instanceof Error
                ? refreshError.message
                : "Token refresh failed",
            status: 401,
            timestamp: new Date().toISOString(),
          };
          return Promise.reject(apiError);
        }
      }

      // Handle other HTTP error codes
      if (status === 403) {
        toast.error("Você não tem permissão para realizar esta ação.");
      } else if (status === 409) {
        toast.error(error.response?.data?.message || "Recurso em conflito.");
      } else if (status === 422) {
        toast.error("Dados inválidos. Verifique os campos.");
      } else if (status !== undefined && status >= 500) {
        toast.error("Erro no servidor. Tente novamente.");
      } else if (status === 401) {
        // Só redireciona se usuário já está autenticado e não está na tela de login
        const { token, isLoggedIn } = useAuthStore.getState();
        const isLoginScreen =
          window.location.pathname === "/" ||
          window.location.pathname === "/login";
        if ((token || isLoggedIn) && !isLoginScreen) {
          handleSessionExpired();
        }
        // Se não, apenas rejeita para o componente tratar
      } else if (error.code === "ERR_NETWORK" || !status) {
        // Network error or CORS issue
        toast.error(
          `Erro de conexão: ${errorMessage}. Verifique se a API está rodando em ${import.meta.env.VITE_API_URL}`,
        );
      }

      const apiError: IApiError = {
        message: errorMessage || "An unexpected error occurred",
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

    console.error("[API Error - Unknown]", apiError, error);
    return Promise.reject(apiError);
  },
);

/**
 * Request interceptor for JWT authentication
 * Injects Authorization header with JWT token on every authenticated request
 * - Retrieves current token from Zustand store at request time
 * - If token exists: adds `Authorization: Bearer <token>` header
 * - If token is null/undefined: skips (allows public requests)
 */
apiClient.interceptors.request.use(
  (config) => {
    const storeToken = useAuthStore.getState().token;

    if (storeToken) {
      config.headers.Authorization = `Bearer ${storeToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export { apiClient };

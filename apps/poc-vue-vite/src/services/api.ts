/**
 * Axios client com interceptador JWT — equivalente ao React
 * Centraliza todas as requisições API com tratamento de erros global e refresh token flow
 */

import axios, {
  AxiosInstance,
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { toast } from "vue-sonner";
import { useAuthStore } from "@/store/useAuthStore";
import type { IApiError } from "@ava-poc/types";

/**
 * Base Axios instance configuration
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  timeout: 10000,
});

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

/**
 * Trata expiração de sessão
 * Limpa autenticação e redireciona para login
 */
function handleSessionExpired(): void {
  toast.error("Sessão expirada. Faça login novamente.");
  const authStore = useAuthStore();
  authStore.logout();
  // Só redireciona se não estiver na tela de login
  if (
    window.location.pathname !== "/" &&
    window.location.pathname !== "/login"
  ) {
    window.location.href = "/";
  }
}

/**
 * Response interceptor com refresh token automático
 *
 * Comportamento:
 * 1. 401 (token expirado):
 *    - Tenta refresh automático (se não foi retry)
 *    - Retenta requisição original com novo token
 * 2. Refresh falha:
 *    - Faz logout
 *    - Redireciona para login
 * 3. Outros erros:
 *    - Mostra toast apropriado
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: unknown) => {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const errorMessage = error.response?.data?.message || error.message;

      console.error("[API Error]", {
        status,
        message: errorMessage,
        url: error.config?.url,
        code: error.code,
      });

      const requestConfig = error.config as RetryableRequestConfig | undefined;

      // Handle 401 com refresh token flow automático
      if (status === 401 && requestConfig && !requestConfig._retry) {
        requestConfig._retry = true;

        try {
          const authStore = useAuthStore();
          const refreshToken = authStore.refreshToken;

          if (!refreshToken) {
            handleSessionExpired();
            return Promise.reject({
              message: "No refresh token available",
              status: 401,
              timestamp: new Date().toISOString(),
            } as IApiError);
          }

          // Tenta refresh do token
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/auth/refresh`,
            { refreshToken },
          );

          const newAccessToken =
            response.data.accessToken || response.data.data?.accessToken;

          if (!newAccessToken) {
            throw new Error("No access token in refresh response");
          }

          // Atualiza store com novo token
          authStore.setTokens(newAccessToken, refreshToken);

          // Atualiza header da requisição original
          if (requestConfig.headers) {
            requestConfig.headers.Authorization = `Bearer ${newAccessToken}`;
          }

          // Retenta requisição original com novo token
          return apiClient(requestConfig);
        } catch (refreshError) {
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

      // Trata outros status HTTP
      if (status === 403) {
        toast.error("Você não tem permissão para realizar esta ação.");
      } else if (status === 409) {
        toast.error(error.response?.data?.message || "Recurso em conflito.");
      } else if (status === 422) {
        toast.error("Dados inválidos. Verifique os campos.");
      } else if (status !== undefined && status >= 500) {
        toast.error("Erro no servidor. Tente novamente.");
      } else if (status === 401) {
        const authStore = useAuthStore();
        const isLoginScreen =
          window.location.pathname === "/" ||
          window.location.pathname === "/login";
        if ((authStore.token || authStore.isAuthenticated) && !isLoginScreen) {
          handleSessionExpired();
        }
      } else if (error.code === "ERR_NETWORK" || !status) {
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
 * Request interceptor para autenticação JWT
 * Injeta header Authorization com token em toda requisição autenticada
 */
apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    const storeToken = authStore.token;
    const isFormData = config.data instanceof FormData;

    // Para multipart, deixa browser definir Content-Type com boundary
    if (isFormData && config.headers) {
      delete config.headers["Content-Type"];
    }

    // Content-Type explícito para JSON
    if (
      !isFormData &&
      config.data &&
      config.method &&
      !["get", "head", "delete"].includes(config.method.toLowerCase())
    ) {
      config.headers["Content-Type"] = "application/json";
    }

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

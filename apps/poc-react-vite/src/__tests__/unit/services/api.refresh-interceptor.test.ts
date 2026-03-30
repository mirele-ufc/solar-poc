import {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockToastError = vi.fn();
const mockRefreshAccessToken = vi.fn();
const mockLogout = vi.fn();
const mockSetTokens = vi.fn();

type StoreSnapshot = {
  token: string | null;
  refreshToken: string | null;
  logout: () => void;
  setTokens: (token: string | null, refreshToken?: string | null) => void;
};

const storeState: StoreSnapshot = {
  token: "expired-token",
  refreshToken: "refresh-token-123",
  logout: mockLogout,
  setTokens: mockSetTokens,
};

const mockGetState = vi.fn(() => storeState);

vi.mock("sonner", () => ({
  toast: {
    error: mockToastError,
  },
}));

vi.mock("@/store/useAuthStore", () => ({
  useAuthStore: {
    getState: mockGetState,
  },
}));

vi.mock("@/services/authService", () => ({
  authService: {
    refreshAccessToken: mockRefreshAccessToken,
  },
}));

function makeAxios401(config: InternalAxiosRequestConfig): AxiosError {
  const error = new AxiosError("Unauthorized", "ERR_BAD_REQUEST", config);
  const response: AxiosResponse = {
    data: { message: "Token expirado" },
    status: 401,
    statusText: "Unauthorized",
    headers: {},
    config,
  };
  error.response = response;
  return error;
}

async function loadClient() {
  const mod = await import("@/services/api");
  return mod.apiClient;
}

describe("apiClient response interceptor - refresh token flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();

    storeState.token = "expired-token";
    storeState.refreshToken = "refresh-token-123";

    mockSetTokens.mockImplementation((token, refreshToken) => {
      storeState.token = token;
      storeState.refreshToken = refreshToken ?? null;
    });

    delete (window as { location?: Location }).location;
    (window as { location: Partial<Location> }).location = {
      href: "http://localhost/",
    };
  });

  it("faz refresh e reenvia a requisição original com novo access token", async () => {
    const apiClient = await loadClient();
    mockRefreshAccessToken.mockResolvedValue({ accessToken: "new-token-456" });

    let attempt = 0;
    apiClient.defaults.adapter = async (config) => {
      attempt += 1;
      const authHeader = String(config.headers?.Authorization ?? "");

      if (attempt === 1) {
        expect(authHeader).toBe("Bearer expired-token");
        return Promise.reject(makeAxios401(config));
      }

      expect(authHeader).toBe("Bearer new-token-456");
      return {
        data: { ok: true },
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      };
    };

    const response = await apiClient.get("/protected-resource");

    expect(response.status).toBe(200);
    expect(mockRefreshAccessToken).toHaveBeenCalledWith("refresh-token-123");
    expect(mockSetTokens).toHaveBeenCalledWith(
      "new-token-456",
      "refresh-token-123",
    );
    expect(mockLogout).not.toHaveBeenCalled();
    expect(attempt).toBe(2);
  });

  it("faz logout e redireciona quando não existe refresh token", async () => {
    const apiClient = await loadClient();
    storeState.refreshToken = null;

    apiClient.defaults.adapter = async (config) => {
      return Promise.reject(makeAxios401(config));
    };

    await expect(apiClient.get("/protected-resource")).rejects.toBeDefined();

    expect(mockRefreshAccessToken).not.toHaveBeenCalled();
    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockToastError).toHaveBeenCalledWith(
      "Sessão expirada. Faça login novamente.",
    );
    expect(window.location.href).toBe("/");
  });

  it("não entra em loop infinito quando a requisição retry também retorna 401", async () => {
    const apiClient = await loadClient();
    mockRefreshAccessToken.mockResolvedValue({ accessToken: "new-token-456" });

    apiClient.defaults.adapter = async (config) => {
      return Promise.reject(makeAxios401(config));
    };

    await expect(apiClient.get("/protected-resource")).rejects.toBeDefined();

    expect(mockRefreshAccessToken).toHaveBeenCalledTimes(1);
    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(window.location.href).toBe("/");
  });

  it("faz logout quando refresh token falha", async () => {
    const apiClient = await loadClient();
    mockRefreshAccessToken.mockRejectedValue(new Error("refresh failed"));

    apiClient.defaults.adapter = async (config) => {
      return Promise.reject(makeAxios401(config));
    };

    await expect(apiClient.get("/protected-resource")).rejects.toBeDefined();

    expect(mockRefreshAccessToken).toHaveBeenCalledTimes(1);
    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockToastError).toHaveBeenCalledWith(
      "Sessão expirada. Faça login novamente.",
    );
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { InternalAxiosRequestConfig } from "axios";
import { apiClient } from "@/services/api";
import { useAuthStore } from "@/store/useAuthStore";

vi.mock("@/store/useAuthStore");

describe("API Request Interceptor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("injeta Authorization header quando token existe", async () => {
    const mockToken = "test-jwt-token-12345";

    // Mock getState para retornar token
    vi.mocked(useAuthStore).getState = vi.fn().mockReturnValue({
      token: mockToken,
    } as any);

    // Criar uma config de request válida
    const config: InternalAxiosRequestConfig = {
      url: "/test",
      method: "get",
      headers: {} as any,
    };

    // Executar o interceptor de request manualmente
    const requestFulfilled =
      apiClient.interceptors.request.handlers?.[0]?.fulfilled;
    if (requestFulfilled) {
      const result = await requestFulfilled(config);
      expect(result.headers.Authorization).toBe(`Bearer ${mockToken}`);
    }
  });

  it("não adiciona Authorization header quando token é null", async () => {
    vi.mocked(useAuthStore).getState = vi.fn().mockReturnValue({
      token: null,
    } as any);

    const config: InternalAxiosRequestConfig = {
      url: "/test",
      method: "get",
      headers: {} as any,
    };

    const requestFulfilled =
      apiClient.interceptors.request.handlers?.[0]?.fulfilled;
    if (requestFulfilled) {
      const result = await requestFulfilled(config);
      expect(result.headers.Authorization).toBeUndefined();
    }
  });

  it("não adiciona Authorization header quando token é undefined", async () => {
    vi.mocked(useAuthStore).getState = vi.fn().mockReturnValue({
      token: undefined,
    } as any);

    const config: InternalAxiosRequestConfig = {
      url: "/test",
      method: "get",
      headers: {} as any,
    };

    const requestFulfilled =
      apiClient.interceptors.request.handlers?.[0]?.fulfilled;
    if (requestFulfilled) {
      const result = await requestFulfilled(config);
      expect(result.headers.Authorization).toBeUndefined();
    }
  });

  it("usa token atualizado do store em nova requisição", async () => {
    const firstToken = "token-v1";
    const secondToken = "token-v2";

    // Primeira requisição
    vi.mocked(useAuthStore).getState = vi
      .fn()
      .mockReturnValueOnce({ token: firstToken } as any);

    const config1: InternalAxiosRequestConfig = {
      url: "/test",
      method: "get",
      headers: {} as any,
    };

    const requestFulfilled =
      apiClient.interceptors.request.handlers?.[0]?.fulfilled;

    if (requestFulfilled) {
      const result1 = await requestFulfilled(config1);
      expect(result1.headers.Authorization).toBe(`Bearer ${firstToken}`);

      // Atualizar token no mock
      vi.mocked(useAuthStore).getState = vi
        .fn()
        .mockReturnValueOnce({ token: secondToken } as any);

      const config2: InternalAxiosRequestConfig = {
        url: "/test",
        method: "get",
        headers: {} as any,
      };

      const result2 = await requestFulfilled(config2);
      expect(result2.headers.Authorization).toBe(`Bearer ${secondToken}`);
    }
  });

  it("remove Content-Type quando payload é FormData", async () => {
    vi.mocked(useAuthStore).getState = vi.fn().mockReturnValue({
      token: null,
    } as any);

    const formData = new FormData();
    formData.append("dados", new Blob(["{}"], { type: "application/json" }));

    const config: InternalAxiosRequestConfig = {
      url: "/courses",
      method: "post",
      data: formData,
      headers: {
        "Content-Type": "application/json",
      } as any,
    };

    const requestFulfilled =
      apiClient.interceptors.request.handlers?.[0]?.fulfilled;

    if (requestFulfilled) {
      const result = await requestFulfilled(config);
      expect(result.headers["Content-Type"]).toBeUndefined();
    }
  });

  it("define Content-Type application/json para payload JSON em POST", async () => {
    vi.mocked(useAuthStore).getState = vi.fn().mockReturnValue({
      token: null,
    } as any);

    const config: InternalAxiosRequestConfig = {
      url: "/courses",
      method: "post",
      data: { title: "curso" },
      headers: {} as any,
    };

    const requestFulfilled =
      apiClient.interceptors.request.handlers?.[0]?.fulfilled;

    if (requestFulfilled) {
      const result = await requestFulfilled(config);
      expect(result.headers["Content-Type"]).toBe("application/json");
    }
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import axios from "axios";
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

    // Executar o interceptor de request
    const config = { headers: {} as Record<string, string> };
    const interceptor = apiClient.interceptors.request.handlers[0];
    
    if (interceptor?.fulfilled) {
      const result = await interceptor.fulfilled(config);
      expect(result.headers.Authorization).toBe(`Bearer ${mockToken}`);
    }
  });

  it("não adiciona Authorization header quando token é null", async () => {
    vi.mocked(useAuthStore).getState = vi.fn().mockReturnValue({
      token: null,
    } as any);

    const config = { headers: {} as Record<string, string> };
    const interceptor = apiClient.interceptors.request.handlers[0];
    
    if (interceptor?.fulfilled) {
      const result = await interceptor.fulfilled(config);
      expect(result.headers.Authorization).toBeUndefined();
    }
  });

  it("não adiciona Authorization header quando token é undefined", async () => {
    vi.mocked(useAuthStore).getState = vi.fn().mockReturnValue({
      token: undefined,
    } as any);

    const config = { headers: {} as Record<string, string> };
    const interceptor = apiClient.interceptors.request.handlers[0];
    
    if (interceptor?.fulfilled) {
      const result = await interceptor.fulfilled(config);
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

    const config1 = { headers: {} as Record<string, string> };
    const interceptor = apiClient.interceptors.request.handlers[0];

    if (interceptor?.fulfilled) {
      const result1 = await interceptor.fulfilled(config1);
      expect(result1.headers.Authorization).toBe(`Bearer ${firstToken}`);

      // Atualizar token no mock
      vi.mocked(useAuthStore).getState = vi
        .fn()
        .mockReturnValueOnce({ token: secondToken } as any);

      const config2 = { headers: {} as Record<string, string> };
      const result2 = await interceptor.fulfilled(config2);
      expect(result2.headers.Authorization).toBe(`Bearer ${secondToken}`);
    }
  });
});

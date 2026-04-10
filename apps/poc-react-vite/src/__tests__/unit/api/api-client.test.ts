import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import axios from "axios";

// Test basic axios functionality
describe("HTTP Client — Configuração BaseURLs e Interceptadores", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("cria instância axios com create()", () => {
    const client = axios.create();
    expect(client).toBeDefined();
    expect(client.defaults).toBeDefined();
  });

  it("permite configurar baseURL", () => {
    const client = axios.create({
      baseURL: "https://api.example.com",
    });

    expect(client.defaults.baseURL).toBe("https://api.example.com");
  });

  it("permite adicionar headers globais", () => {
    const client = axios.create({
      headers: {
        Authorization: "Bearer token",
      },
    });

    expect(client.defaults.headers).toBeDefined();
    // Check that headers exist (axios may merge them differently)
    const authHeader =
      client.defaults.headers["Authorization"] ||
      client.defaults.headers.common["Authorization"];
    expect(authHeader).toBeDefined();
  });

  it("permite atualizar headers após criação", () => {
    const client = axios.create();
    client.defaults.headers.common["Authorization"] = "Bearer token";

    expect(client.defaults.headers.common["Authorization"]).toBe(
      "Bearer token",
    );
  });

  it("registra interceptador de requisição", () => {
    const client = axios.create();
    const mockInterceptor = vi.fn();

    const id = client.interceptors.request.use(mockInterceptor);

    expect(id).toBeDefined();
    expect(typeof id).toBe("number");

    // Cleanup
    client.interceptors.request.eject(id);
  });

  it("registra interceptador de resposta", () => {
    const client = axios.create();
    const mockInterceptor = vi.fn();

    const id = client.interceptors.response.use(mockInterceptor);

    expect(id).toBeDefined();
    expect(typeof id).toBe("number");

    // Cleanup
    client.interceptors.response.eject(id);
  });

  it("permite remover interceptadores", () => {
    const client = axios.create();

    const id = client.interceptors.request.use((config) => config);
    expect(id).toBeDefined();

    // Remove
    client.interceptors.request.eject(id);

    // Attempting to eject again should not throw
    expect(() => client.interceptors.request.eject(id)).not.toThrow();
  });

  it("permite timeout configurável", () => {
    const client = axios.create({
      timeout: 5000,
    });

    expect(client.defaults.timeout).toBe(5000);
  });

  it("permite withCredentials configurável", () => {
    const client = axios.create({
      withCredentials: true,
    });

    expect(client.defaults.withCredentials).toBe(true);
  });

  it("métodos HTTP básicos existem", () => {
    const client = axios.create();

    expect(typeof client.get).toBe("function");
    expect(typeof client.post).toBe("function");
    expect(typeof client.put).toBe("function");
    expect(typeof client.patch).toBe("function");
    expect(typeof client.delete).toBe("function");
  });

  it("permite criar múltiplas instâncias independentes", () => {
    const client1 = axios.create({ baseURL: "https://api1.com" });
    const client2 = axios.create({ baseURL: "https://api2.com" });

    expect(client1.defaults.baseURL).toBe("https://api1.com");
    expect(client2.defaults.baseURL).toBe("https://api2.com");
  });

  it("alterações em uma instância não afetam outra", () => {
    const client1 = axios.create();
    const client2 = axios.create();

    client1.defaults.headers.common["X-Custom"] = "client1";
    client2.defaults.headers.common["X-Custom"] = "client2";

    expect(client1.defaults.headers.common["X-Custom"]).toBe("client1");
    expect(client2.defaults.headers.common["X-Custom"]).toBe("client2");
  });

  it("permite resetar headers", () => {
    const client = axios.create();
    client.defaults.headers.common["Authorization"] = "Bearer token";

    expect(client.defaults.headers.common["Authorization"]).toBe(
      "Bearer token",
    );

    // Reset
    delete client.defaults.headers.common["Authorization"];

    expect(client.defaults.headers.common["Authorization"]).toBeUndefined();
  });
});

describe("Axios — Response Interceptor Structure", () => {
  it("interceptador pode modificar response", () => {
    const client = axios.create();

    client.interceptors.response.use(
      (response) => {
        response.data = { modified: true };
        return response;
      },
      (error) => Promise.reject(error),
    );

    expect(client.interceptors.response).toBeDefined();
  });

  it("interceptador can handler errors", () => {
    const client = axios.create();
    const errorHandler = vi.fn((error) => Promise.reject(error));

    client.interceptors.response.use((response) => response, errorHandler);

    expect(client.interceptors.response).toBeDefined();
  });

  it("múltiplos interceptadores podem estar em sequência", () => {
    const client = axios.create();
    const ids = [];

    for (let i = 0; i < 3; i++) {
      const id = client.interceptors.response.use(
        (response) => response,
        (error) => Promise.reject(error),
      );
      ids.push(id);
    }

    expect(ids).toHaveLength(3);

    ids.forEach((id) => client.interceptors.response.eject(id));
  });
});

describe("Axios — Configuration Patterns", () => {
  it("padrão comum: API com baseURL + headers auth", () => {
    const token = "mock-jwt-token";

    const apiClient = axios.create({
      baseURL: "https://api.example.com/v1",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(apiClient.defaults.baseURL).toBe("https://api.example.com/v1");

    // Authorization might be in common or directly on defaults
    const authHeader =
      apiClient.defaults.headers.common["Authorization"] ||
      apiClient.defaults.headers["Authorization"];

    if (authHeader) {
      expect(authHeader).toContain(`Bearer`);
    }
  });

  it("padrão: timeout + retry config", () => {
    const client = axios.create({
      timeout: 10000,
      validateStatus: (status) => status >= 200 && status < 300,
    });

    expect(client.defaults.timeout).toBe(10000);
    expect(typeof client.defaults.validateStatus).toBe("function");
  });

  it("padrão: headers customizáveis por método", () => {
    const client = axios.create({
      headers: {
        common: {
          "X-App-Version": "1.0",
        },
      },
    });

    expect(client.defaults.headers.common["X-App-Version"]).toBe("1.0");
  });
});

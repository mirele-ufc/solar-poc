import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { apiClient } from "@/services/api";
import { toast } from "sonner";

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

const mockLogout = vi.fn();
vi.mock("@/store/useAuthStore", () => ({
  useAuthStore: {
    getState: () => ({ logout: mockLogout }),
  },
  selectCanManageCourses: vi.fn(),
}));

function makeAxiosError(status: number, serverMessage?: string): AxiosError {
  const config: InternalAxiosRequestConfig = {
    headers: {} as never,
    url: "/test",
    method: "get",
  };
  const error = new AxiosError("Request failed", "ERR_BAD_REQUEST", config);
  error.response = {
    status,
    data: serverMessage ? { message: serverMessage } : {},
    statusText: "Error",
    headers: {},
    config,
  };
  return error;
}

describe("apiClient — response interceptor", () => {
  const originalAdapter = apiClient.defaults.adapter;

  beforeEach(() => {
    vi.clearAllMocks();
    delete (window as { location?: Location }).location;
    (window as { location: Partial<Location> }).location = {
      href: "http://localhost/",
    };
  });

  afterEach(() => {
    apiClient.defaults.adapter = originalAdapter;
  });

  function simulateHttpError(status: number, serverMessage?: string) {
    apiClient.defaults.adapter = () =>
      Promise.reject(makeAxiosError(status, serverMessage));
  }

  it("401 → exibe toast de sessão expirada, chama logout e redireciona para /", async () => {
    simulateHttpError(401);

    await expect(apiClient.get("/test")).rejects.toBeDefined();

    expect(toast.error).toHaveBeenCalledWith(
      "Sessão expirada. Faça login novamente.",
    );
    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(window.location.href).toBe("/");
  });

  it("403 → exibe toast de permissão negada", async () => {
    simulateHttpError(403);

    await expect(apiClient.get("/test")).rejects.toBeDefined();

    expect(toast.error).toHaveBeenCalledWith(
      "Você não tem permissão para realizar esta ação.",
    );
    expect(mockLogout).not.toHaveBeenCalled();
  });

  it("409 com mensagem do servidor → exibe a mensagem do servidor no toast", async () => {
    simulateHttpError(409, "Curso com este nome já existe.");

    await expect(apiClient.get("/test")).rejects.toBeDefined();

    expect(toast.error).toHaveBeenCalledWith("Curso com este nome já existe.");
  });

  it("409 sem mensagem do servidor → exibe toast genérico de conflito", async () => {
    simulateHttpError(409);

    await expect(apiClient.get("/test")).rejects.toBeDefined();

    expect(toast.error).toHaveBeenCalledWith("Recurso em conflito.");
  });

  it("422 → exibe toast de dados inválidos", async () => {
    simulateHttpError(422);

    await expect(apiClient.get("/test")).rejects.toBeDefined();

    expect(toast.error).toHaveBeenCalledWith(
      "Dados inválidos. Verifique os campos.",
    );
  });

  it("500 → exibe toast genérico de erro no servidor", async () => {
    simulateHttpError(500);

    await expect(apiClient.get("/test")).rejects.toBeDefined();

    expect(toast.error).toHaveBeenCalledWith(
      "Erro no servidor. Tente novamente.",
    );
  });

  it("503 → exibe toast genérico de erro no servidor (status >= 500)", async () => {
    simulateHttpError(503);

    await expect(apiClient.get("/test")).rejects.toBeDefined();

    expect(toast.error).toHaveBeenCalledWith(
      "Erro no servidor. Tente novamente.",
    );
  });

  it("404 → não exibe toast (sem tratamento para 404)", async () => {
    simulateHttpError(404);

    await expect(apiClient.get("/test")).rejects.toBeDefined();

    expect(toast.error).not.toHaveBeenCalled();
  });
});

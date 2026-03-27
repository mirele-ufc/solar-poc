import { describe, it, expect, vi, beforeEach } from "vitest";
import type { IApiError, ILoginResponse, IUserSession } from "@ava-poc/types";
import { authService } from "@/services/authService";
import { apiClient } from "@/services/api";
import type {
  IRegisterPayload,
  IChangePasswordPayload,
  IRefreshResponse,
} from "@/services/types/authService.types";

vi.mock("@/services/api", () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
  },
}));

describe("authService", () => {
  const mockedPost = vi.mocked(apiClient.post);
  const mockedGet = vi.mocked(apiClient.get);
  const mockedPut = vi.mocked(apiClient.put);

  const buildUser = (): IUserSession => ({
    id: "u-1",
    nome: "Professor UFC",
    cpf: "12345678901",
    email: "professor@ufc.br",
    fotoUrl: "",
    role: "professor",
    status: "ATIVO",
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("login válido retorna payload de sessão com tokens", async () => {
    const loginResponse: ILoginResponse = {
      accessToken: "access-token",
      refreshToken: "refresh-token",
      usuario: buildUser(),
    };

    mockedPost.mockResolvedValueOnce({ data: loginResponse } as never);

    const result = await authService.login("professor@ufc.br", "123456");

    expect(mockedPost).toHaveBeenCalledWith("/auth/login", {
      emailOuUsuario: "professor@ufc.br",
      senha: "123456",
    });
    expect(result).toEqual(loginResponse);
  });

  it("login inválido propaga IApiError 401", async () => {
    const unauthorizedError: IApiError = {
      message: "Credenciais inválidas",
      status: 401,
      timestamp: new Date().toISOString(),
    };

    mockedPost.mockRejectedValueOnce(unauthorizedError);

    await expect(
      authService.login("professor@ufc.br", "x"),
    ).rejects.toMatchObject({
      status: 401,
    });
  });

  it("register válido cria usuário e retorna sessão", async () => {
    const payload: IRegisterPayload = {
      nome: "Novo Professor",
      cpf: "12345678901",
      email: "novo@ufc.br",
      senha: "123456",
    };

    const registerResponse: ILoginResponse = {
      accessToken: "access-token",
      refreshToken: "refresh-token",
      usuario: buildUser(),
    };

    mockedPost.mockResolvedValueOnce({ data: registerResponse } as never);

    const result = await authService.register(payload);

    expect(mockedPost).toHaveBeenCalledWith("/auth/cadastro", payload);
    expect(result).toEqual(registerResponse);
  });

  it("register com CPF duplicado propaga IApiError 409", async () => {
    const conflictError: IApiError = {
      message: "CPF já cadastrado",
      status: 409,
      timestamp: new Date().toISOString(),
    };

    mockedPost.mockRejectedValueOnce(conflictError);

    await expect(
      authService.register({
        nome: "Duplicado",
        cpf: "12345678901",
        email: "dup@ufc.br",
        senha: "123456",
      }),
    ).rejects.toMatchObject({ status: 409 });
  });

  it("refresh com token expirado propaga IApiError 401", async () => {
    const refreshError: IApiError = {
      message: "Refresh token expirado",
      status: 401,
      timestamp: new Date().toISOString(),
    };

    mockedPost.mockRejectedValueOnce(refreshError);

    await expect(
      authService.refreshAccessToken("expired-refresh"),
    ).rejects.toMatchObject({
      status: 401,
    });
    expect(mockedPost).toHaveBeenCalledWith("/auth/refresh", {
      refreshToken: "expired-refresh",
    });
  });

  it("refresh válido retorna novo accessToken", async () => {
    const payload: IRefreshResponse = { accessToken: "new-access-token" };

    mockedPost.mockResolvedValueOnce({ data: payload } as never);

    const result = await authService.refreshAccessToken("valid-refresh");

    expect(mockedPost).toHaveBeenCalledWith("/auth/refresh", {
      refreshToken: "valid-refresh",
    });
    expect(result).toEqual(payload);
  });

  it("requestPasswordReset chama endpoint contratual", async () => {
    mockedPost.mockResolvedValueOnce({ data: { message: "ok" } } as never);

    const result = await authService.requestPasswordReset("mail@ufc.br");

    expect(mockedPost).toHaveBeenCalledWith("/auth/recuperar-senha", {
      email: "mail@ufc.br",
    });
    expect(result).toEqual({ message: "ok" });
  });

  it("resetPassword chama endpoint contratual", async () => {
    mockedPost.mockResolvedValueOnce({ data: { message: "ok" } } as never);

    const result = await authService.resetPassword("token-1", "nova-senha");

    expect(mockedPost).toHaveBeenCalledWith("/auth/redefinir-senha", {
      token: "token-1",
      novaSenha: "nova-senha",
    });
    expect(result).toEqual({ message: "ok" });
  });

  it("getProfile consulta /perfil", async () => {
    const user = buildUser();
    mockedGet.mockResolvedValueOnce({ data: user } as never);

    const result = await authService.getProfile();

    expect(mockedGet).toHaveBeenCalledWith("/perfil");
    expect(result).toEqual(user);
  });

  it("changePassword chama PUT /perfil/senha", async () => {
    const payload: IChangePasswordPayload = {
      senhaAtual: "senha-atual",
      novaSenha: "nova-senha",
    };

    mockedPut.mockResolvedValueOnce({
      data: { message: "Senha alterada" },
    } as never);

    const result = await authService.changePassword(payload);

    expect(mockedPut).toHaveBeenCalledWith("/perfil/senha", payload);
    expect(result).toEqual({ message: "Senha alterada" });
  });

  it("uploadProfilePhoto envia multipart para /perfil/foto", async () => {
    const file = new File(["photo-content"], "profile.png", {
      type: "image/png",
    });
    mockedPut.mockResolvedValueOnce({
      data: { message: "Foto atualizada" },
    } as never);

    const result = await authService.uploadProfilePhoto(file);

    const putArgs = mockedPut.mock.calls[0];
    const sentFormData = putArgs?.[1] as FormData;

    expect(mockedPut).toHaveBeenCalledWith(
      "/perfil/foto",
      expect.any(FormData),
      expect.objectContaining({
        headers: expect.objectContaining({
          "Content-Type": "multipart/form-data",
        }),
      }),
    );
    expect(sentFormData.get("foto")).toBe(file);
    expect(result).toEqual({ message: "Foto atualizada" });
  });
});

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
    patch: vi.fn(),
  },
}));

describe("authService", () => {
  const mockedPost = vi.mocked(apiClient.post);
  const mockedGet = vi.mocked(apiClient.get);
  const mockedPatch = vi.mocked(apiClient.patch);

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
    const loginData: ILoginResponse = {
      accessToken: "access-token",
      refreshToken: "refresh-token",
      usuario: buildUser(),
    };

    mockedPost.mockResolvedValueOnce({
      data: {
        data: loginData,
        message: "Login realizado com sucesso.",
        status: 200,
      },
    } as never);

    const result = await authService.login("professor@ufc.br", "123456");

    expect(mockedPost).toHaveBeenCalledWith("/auth/login", {
      email: "professor@ufc.br",
      senha: "123456",
    });
    expect(result).toEqual(loginData);
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

    const registerData: ILoginResponse = {
      accessToken: "access-token",
      refreshToken: "refresh-token",
      usuario: buildUser(),
    };

    mockedPost.mockResolvedValueOnce({
      data: {
        data: registerData,
        message: "Cadastro realizado com sucesso.",
        status: 201,
      },
    } as never);

    const result = await authService.register(payload);

    expect(mockedPost).toHaveBeenCalledWith("/auth/cadastro", payload);
    expect(result).toEqual(registerData);
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

    mockedPost.mockResolvedValueOnce({
      data: {
        data: payload,
        message: "Token renovado com sucesso.",
        status: 200,
      },
    } as never);

    const result = await authService.refreshAccessToken("valid-refresh");

    expect(mockedPost).toHaveBeenCalledWith("/auth/refresh", {
      refreshToken: "valid-refresh",
    });
    expect(result).toEqual(payload);
  });

  it("requestPasswordReset chama endpoint contratual", async () => {
    mockedPost.mockResolvedValueOnce({
      data: {
        data: { message: "ok" },
        message: "Email enviado",
        status: 200,
      },
    } as never);

    const result = await authService.requestPasswordReset("mail@ufc.br");

    expect(mockedPost).toHaveBeenCalledWith("/auth/recuperar-senha", {
      email: "mail@ufc.br",
    });
    expect(result).toEqual({ message: "ok" });
  });

  it("resetPassword chama endpoint contratual", async () => {
    mockedPost.mockResolvedValueOnce({
      data: {
        data: { message: "ok" },
        message: "Senha redefinida",
        status: 200,
      },
    } as never);

    const result = await authService.resetPassword("token-1", "nova-senha");

    expect(mockedPost).toHaveBeenCalledWith("/auth/redefinir-senha", {
      token: "token-1",
      novaSenha: "nova-senha",
    });
    expect(result).toEqual({ message: "ok" });
  });

  it("getProfile consulta /perfil", async () => {
    mockedGet.mockResolvedValueOnce({
      data: {
        data: {
          id: 1,
          nome: "Professor UFC",
          cpf: "***.***.***-01",
          email: "professor@ufc.br",
          perfil: "PROFESSOR",
          status: "ATIVO",
          fotoPerfil: null,
        },
        message: "Perfil carregado",
        status: 200,
      },
    } as never);

    const result = await authService.getProfile();

    expect(mockedGet).toHaveBeenCalledWith("/perfil");
    expect(result).toEqual(
      expect.objectContaining({
        id: "1",
        role: "professor",
        status: "ATIVO",
      }),
    );
  });

  it("changePassword chama PATCH /perfil/senha", async () => {
    const payload: IChangePasswordPayload = {
      senhaAtual: "senha-atual",
      novaSenha: "nova-senha",
    };

    mockedPatch.mockResolvedValueOnce({
      data: {
        data: { message: "Senha alterada" },
        message: "Senha alterada com sucesso",
        status: 200,
      },
    } as never);

    const result = await authService.changePassword(payload);

    expect(mockedPatch).toHaveBeenCalledWith("/perfil/senha", payload);
    expect(result).toEqual({ message: "Senha alterada" });
  });

  it("uploadProfilePhoto envia multipart para /perfil/foto", async () => {
    const file = new File(["photo-content"], "profile.png", {
      type: "image/png",
    });
    mockedPatch.mockResolvedValueOnce({
      data: {
        data: { message: "Foto atualizada" },
        message: "Foto atualizada com sucesso",
        status: 200,
      },
    } as never);

    const result = await authService.uploadProfilePhoto(file);

    const patchArgs = mockedPatch.mock.calls[0];
    const sentFormData = patchArgs?.[1] as FormData;

    expect(mockedPatch).toHaveBeenCalledTimes(1);
    expect(patchArgs?.[0]).toBe("/perfil/foto");
    expect(sentFormData).toBeInstanceOf(FormData);
    expect(patchArgs?.[2]).toBeUndefined();
    expect(sentFormData.get("foto")).toBe(file);
    expect(result).toEqual({ message: "Foto atualizada" });
  });
});

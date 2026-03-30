import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { IUserSession } from "@ava-poc/types";
import { LoginPage } from "@/pages/LoginPage";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/useAuthStore";

vi.mock("@/services/authService", () => ({
  authService: {
    login: vi.fn(),
    getProfile: vi.fn(),
  },
}));

const mockedAuthService = vi.mocked(authService);

describe("LoginPage", () => {
  const defaultUser: IUserSession = {
    id: "user-1",
    nome: "Professor Teste",
    cpf: "12345678900",
    email: "professor@ufc.br",
    role: "professor",
    status: "ATIVO",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      currentUser: null,
      sentMessages: [],
      isLoggedIn: false,
      token: null,
      refreshToken: null,
    });
  });

  it("deve validar email ou usuário e senha obrigatórios", async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    const submitButton = screen.getByRole("button", { name: /acessar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/E-mail ou nome de usuário obrigatório/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/Mínimo 6 caracteres/i)).toBeInTheDocument();
    });
  });

  it("deve fazer login com email com sucesso e redirecionar", async () => {
    mockedAuthService.login.mockResolvedValueOnce({
      accessToken: "access-111",
      refreshToken: "refresh-111",
    });
    mockedAuthService.getProfile.mockResolvedValueOnce(defaultUser);

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText(/nome de usuário ou email/i), {
      target: { value: "professor@ufc.br" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Insira sua senha/i), {
      target: { value: "senha123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /acessar/i }));

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith(
        "professor@ufc.br",
        "senha123",
      );
    });

    await waitFor(() => {
      expect(useAuthStore.getState().token).toBe("access-111");
      expect(useAuthStore.getState().refreshToken).toBe("refresh-111");
      expect(useAuthStore.getState().currentUser?.email).toBe(
        "professor@ufc.br",
      );
      expect(useAuthStore.getState().isLoggedIn).toBe(true);
    });
  });

  it("deve tratar credenciais inválidas com mensagem de erro", async () => {
    mockedAuthService.login.mockRejectedValueOnce({
      message: "Usuário ou senha incorretos",
      status: 401,
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText(/nome de usuário ou email/i), {
      target: { value: "incorreto" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Insira sua senha/i), {
      target: { value: "errada1" },
    });

    fireEvent.click(screen.getByRole("button", { name: /acessar/i }));

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalled();
      expect(
        screen.getByText(/Credenciais inválidas.*401/i),
      ).toBeInTheDocument();
      expect(useAuthStore.getState().isLoggedIn).toBe(false);
    });
  });

  it("deve fazer login com username com sucesso e redirecionar", async () => {
    mockedAuthService.login.mockResolvedValueOnce({
      accessToken: "access-222",
      refreshToken: "refresh-222",
    });
    mockedAuthService.getProfile.mockResolvedValueOnce(defaultUser);

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText(/nome de usuário ou email/i), {
      target: { value: "prof_teste" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Insira sua senha/i), {
      target: { value: "senha123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /acessar/i }));

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith("prof_teste", "senha123");
      expect(useAuthStore.getState().token).toBe("access-222");
      expect(useAuthStore.getState().isLoggedIn).toBe(true);
    });
  });

  it("deve desabilitar botão durante carregamento", async () => {
    mockedAuthService.login.mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                accessToken: "token",
                refreshToken: "refresh",
              }),
            100,
          ),
        ),
    );
    mockedAuthService.getProfile.mockResolvedValueOnce(defaultUser);

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText(/nome de usuário ou email/i), {
      target: { value: "professor@ufc.br" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Insira sua senha/i), {
      target: { value: "senha123" },
    });

    const submitButton = screen.getByRole("button", {
      name: /acessar/i,
    }) as HTMLButtonElement;
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });

    await waitFor(
      () => {
        expect(submitButton).not.toBeDisabled();
      },
      { timeout: 200 },
    );
  });

  it("deve tratar erro de rede com mensagem apropriada", async () => {
    mockedAuthService.login.mockRejectedValueOnce({
      message: "Erro de conexão",
      status: 0,
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText(/nome de usuário ou email/i), {
      target: { value: "professor@ufc.br" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Insira sua senha/i), {
      target: { value: "senha123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /acessar/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/Ocorreu um erro inesperado.*0/i),
      ).toBeInTheDocument();
      expect(useAuthStore.getState().isLoggedIn).toBe(false);
    });
  });

  it("deve validar email inválido no schema Zod", async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText(/nome de usuário ou email/i), {
      target: { value: "email invalido com espacos" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Insira sua senha/i), {
      target: { value: "senha123" },
    });

    const submitButton = screen.getByRole("button", { name: /acessar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/E-mail ou nome de usuário inválido/i),
      ).toBeInTheDocument();
      expect(authService.login).not.toHaveBeenCalled();
    });
  });

  it("deve validar username com menos de 3 caracteres", async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText(/nome de usuário ou email/i), {
      target: { value: "ab" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Insira sua senha/i), {
      target: { value: "senha123" },
    });

    const submitButton = screen.getByRole("button", { name: /acessar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/E-mail ou nome de usuário inválido/i),
      ).toBeInTheDocument();
      expect(authService.login).not.toHaveBeenCalled();
    });
  });
});

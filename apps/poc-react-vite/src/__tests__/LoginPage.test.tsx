import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LoginPage } from "@/pages/LoginPage";
import { useAuthStore } from "@/store/useAuthStore";

describe("LoginPage", () => {
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
      expect(useAuthStore.getState().token).toBeNull();
      expect(useAuthStore.getState().refreshToken).toBeNull();
      expect(useAuthStore.getState().currentUser?.email).toBe(
        "professor@ufc.br",
      );
      expect(useAuthStore.getState().isLoggedIn).toBe(true);
    });
  });

  it("deve tratar credenciais inválidas com mensagem de erro", async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText(/nome de usuário ou email/i), {
      target: { value: "incorreto" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Insira sua senha/i), {
      target: { value: "senha123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /acessar/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/Credenciais inválidas.*401/i),
      ).toBeInTheDocument();
      expect(useAuthStore.getState().isLoggedIn).toBe(false);
    });
  });

  it("deve fazer login com username com sucesso e redirecionar", async () => {
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
      expect(useAuthStore.getState().currentUser?.role).toBe("professor");
      expect(useAuthStore.getState().isLoggedIn).toBe(true);
    });
  });

  it("deve manter usuário deslogado quando credenciais forem inválidas", async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText(/nome de usuário ou email/i), {
      target: { value: "usuario_inexistente" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Insira sua senha/i), {
      target: { value: "senha123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /acessar/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/Credenciais inválidas.*401/i),
      ).toBeInTheDocument();
      expect(useAuthStore.getState().isLoggedIn).toBe(false);
      expect(useAuthStore.getState().currentUser).toBeNull();
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
      expect(useAuthStore.getState().isLoggedIn).toBe(false);
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
      expect(useAuthStore.getState().isLoggedIn).toBe(false);
    });
  });
});

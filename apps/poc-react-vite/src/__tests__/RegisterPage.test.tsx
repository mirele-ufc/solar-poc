import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter as Router } from "react-router";
import { RegisterPage } from "@/pages/RegisterPage";
import * as authService from "@/services/authService";
import { toast } from "sonner";

// Mock dependencies
vi.mock("@/services/authService");
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("RegisterPage - Task 2.4", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("valida CPF em formato inválido", async () => {
    const user = userEvent.setup();
    render(
      <Router>
        <RegisterPage />
      </Router>
    );

    const nomeInput = screen.getByLabelText(/nome/i);
    const cpfInput = screen.getByLabelText(/cpf/i);
    const emailInput = screen.getByLabelText(/^email/i);
    const senhaInput = screen.getByPlaceholderText(/insira sua senha/i);
    const confirmInput = screen.getByPlaceholderText(/repita sua senha/i);
    const perfilSelect = screen.getByLabelText(/perfil/i);
    const submitButton = screen.getByRole("button", { name: /cadastrar/i });

    // Preencher com CPF inválido
    await user.type(nomeInput, "João Silva");
    await user.type(cpfInput, "invalid-cpf");
    await user.type(emailInput, "joao@example.com");
    await user.type(senhaInput, "senha123");
    await user.type(confirmInput, "senha123");
    await user.selectOptions(perfilSelect, "professor");

    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/por favor, preencha os campos destacados/i)
      ).toBeInTheDocument();
    });
  });

  it("valida senha com menos de 6 caracteres", async () => {
    const user = userEvent.setup();
    render(
      <Router>
        <RegisterPage />
      </Router>
    );

    const nomeInput = screen.getByLabelText(/nome/i);
    const cpfInput = screen.getByLabelText(/cpf/i);
    const emailInput = screen.getByLabelText(/^email/i);
    const senhaInput = screen.getByPlaceholderText(/insira sua senha/i);
    const confirmInput = screen.getByPlaceholderText(/repita sua senha/i);
    const perfilSelect = screen.getByLabelText(/perfil/i);
    const submitButton = screen.getByRole("button", { name: /cadastrar/i });

    await user.type(nomeInput, "João Silva");
    await user.type(cpfInput, "123.456.789-01");
    await user.type(emailInput, "joao@example.com");
    await user.type(senhaInput, "12345"); // menos de 6 caracteres
    await user.type(confirmInput, "12345");
    await user.selectOptions(perfilSelect, "professor");

    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/a senha deve ter ao menos 6 caracteres/i)
      ).toBeInTheDocument();
    });
  });

  it("valida senhas não coincidindo", async () => {
    const user = userEvent.setup();
    render(
      <Router>
        <RegisterPage />
      </Router>
    );

    const nomeInput = screen.getByLabelText(/nome/i);
    const cpfInput = screen.getByLabelText(/cpf/i);
    const emailInput = screen.getByLabelText(/^email/i);
    const senhaInput = screen.getByPlaceholderText(/insira sua senha/i);
    const confirmInput = screen.getByPlaceholderText(/repita sua senha/i);
    const perfilSelect = screen.getByLabelText(/perfil/i);
    const submitButton = screen.getByRole("button", { name: /cadastrar/i });

    await user.type(nomeInput, "João Silva");
    await user.type(cpfInput, "123.456.789-01");
    await user.type(emailInput, "joao@example.com");
    await user.type(senhaInput, "senha123");
    await user.type(confirmInput, "senha456"); // diferente
    await user.selectOptions(perfilSelect, "professor");

    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/as senhas não coincidem/i)
      ).toBeInTheDocument();
    });
  });

  it("cadastra com sucesso e exibe mensagem de conta pendente", async () => {
    const user = userEvent.setup();
    vi.mocked(authService.authService.register).mockResolvedValue({
      accessToken: "token123",
      refreshToken: "refresh123",
      usuario: {
        id: 1,
        nome: "João Silva",
        email: "joao@example.com",
        perfil: "PROFESSOR",
        status: "INATIVO",
      },
    } as any);

    render(
      <Router>
        <RegisterPage />
      </Router>
    );

    const nomeInput = screen.getByLabelText(/nome/i);
    const cpfInput = screen.getByLabelText(/cpf/i);
    const emailInput = screen.getByLabelText(/^email/i);
    const senhaInput = screen.getByPlaceholderText(/insira sua senha/i);
    const confirmInput = screen.getByPlaceholderText(/repita sua senha/i);
    const perfilSelect = screen.getByLabelText(/perfil/i);
    const termsCheckbox = screen.getByRole("checkbox", {
      name: /concordo com os termos/i,
    });
    const submitButton = screen.getByRole("button", { name: /cadastrar/i });

    await user.type(nomeInput, "João Silva");
    await user.type(cpfInput, "123.456.789-01");
    await user.type(emailInput, "joao@example.com");
    await user.type(senhaInput, "senha123");
    await user.type(confirmInput, "senha123");
    await user.selectOptions(perfilSelect, "professor");
    await user.click(termsCheckbox);
    await user.click(submitButton);

    await waitFor(() => {
      expect(authService.authService.register).toHaveBeenCalledWith({
        nome: "João Silva",
        cpf: "123.456.789-01",
        email: "joao@example.com",
        senha: "senha123",
        perfil: "PROFESSOR",
      });
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "Conta pendente de ativação. Verifique seu email."
      );
    });
  });

  it("trata erro 409 de CPF/email duplicado", async () => {
    const user = userEvent.setup();
    vi.mocked(authService.authService.register).mockRejectedValue({
      status: 409,
      message: "CPF already exists",
    });

    render(
      <Router>
        <RegisterPage />
      </Router>
    );

    const nomeInput = screen.getByLabelText(/nome/i);
    const cpfInput = screen.getByLabelText(/cpf/i);
    const emailInput = screen.getByLabelText(/^email/i);
    const senhaInput = screen.getByPlaceholderText(/insira sua senha/i);
    const confirmInput = screen.getByPlaceholderText(/repita sua senha/i);
    const perfilSelect = screen.getByLabelText(/perfil/i);
    const termsCheckbox = screen.getByRole("checkbox", {
      name: /concordo com os termos/i,
    });
    const submitButton = screen.getByRole("button", { name: /cadastrar/i });

    await user.type(nomeInput, "João Silva");
    await user.type(cpfInput, "123.456.789-01");
    await user.type(emailInput, "joao@example.com");
    await user.type(senhaInput, "senha123");
    await user.type(confirmInput, "senha123");
    await user.selectOptions(perfilSelect, "professor");
    await user.click(termsCheckbox);
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/cpf ou email já cadastrados no sistema/i)
      ).toBeInTheDocument();
    });
  });

  it("bloqueia envio se não aceitar termos", async () => {
    const user = userEvent.setup();
    render(
      <Router>
        <RegisterPage />
      </Router>
    );

    const nomeInput = screen.getByLabelText(/nome/i);
    const cpfInput = screen.getByLabelText(/cpf/i);
    const emailInput = screen.getByLabelText(/^email/i);
    const senhaInput = screen.getByPlaceholderText(/insira sua senha/i);
    const confirmInput = screen.getByPlaceholderText(/repita sua senha/i);
    const perfilSelect = screen.getByLabelText(/perfil/i);
    const submitButton = screen.getByRole("button", { name: /cadastrar/i });

    // Preencher todos os campos mas NÃO aceitar termos
    await user.type(nomeInput, "João Silva");
    await user.type(cpfInput, "123.456.789-01");
    await user.type(emailInput, "joao@example.com");
    await user.type(senhaInput, "senha123");
    await user.type(confirmInput, "senha123");
    await user.selectOptions(perfilSelect, "professor");
    // Não aceitar termos

    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/deve aceitar os termos de privacidade/i)
      ).toBeInTheDocument();
    });

    expect(authService.authService.register).not.toHaveBeenCalled();
  });

  it("valida nome mínimo 3 caracteres", async () => {
    const user = userEvent.setup();
    render(
      <Router>
        <RegisterPage />
      </Router>
    );

    const nomeInput = screen.getByLabelText(/nome/i);
    const cpfInput = screen.getByLabelText(/cpf/i);
    const emailInput = screen.getByLabelText(/^email/i);
    const senhaInput = screen.getByPlaceholderText(/insira sua senha/i);
    const confirmInput = screen.getByPlaceholderText(/repita sua senha/i);
    const perfilSelect = screen.getByLabelText(/perfil/i);
    const submitButton = screen.getByRole("button", { name: /cadastrar/i });

    await user.type(nomeInput, "Jo"); // apenas 2 caracteres
    await user.type(cpfInput, "123.456.789-01");
    await user.type(emailInput, "joao@example.com");
    await user.type(senhaInput, "senha123");
    await user.type(confirmInput, "senha123");
    await user.selectOptions(perfilSelect, "professor");

    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/mínimo 3 caracteres/i)).toBeInTheDocument();
    });
  });

  it("mapeia perfil professor corretamente para PROFESSOR", async () => {
    const user = userEvent.setup();
    vi.mocked(authService.authService.register).mockResolvedValue({
      accessToken: "token123",
      refreshToken: "refresh123",
    } as any);

    render(
      <Router>
        <RegisterPage />
      </Router>
    );

    const nomeInput = screen.getByLabelText(/nome/i);
    const cpfInput = screen.getByLabelText(/cpf/i);
    const emailInput = screen.getByLabelText(/^email/i);
    const senhaInput = screen.getByPlaceholderText(/insira sua senha/i);
    const confirmInput = screen.getByPlaceholderText(/repita sua senha/i);
    const perfilSelect = screen.getByLabelText(/perfil/i);
    const termsCheckbox = screen.getByRole("checkbox", {
      name: /concordo com os termos/i,
    });
    const submitButton = screen.getByRole("button", { name: /cadastrar/i });

    await user.type(nomeInput, "João Silva");
    await user.type(cpfInput, "123.456.789-01");
    await user.type(emailInput, "joao@example.com");
    await user.type(senhaInput, "senha123");
    await user.type(confirmInput, "senha123");
    await user.selectOptions(perfilSelect, "professor");
    await user.click(termsCheckbox);
    await user.click(submitButton);

    await waitFor(() => {
      expect(authService.authService.register).toHaveBeenCalledWith(
        expect.objectContaining({
          perfil: "PROFESSOR",
        })
      );
    });
  });

  it("mapeia perfil student corretamente para ALUNO", async () => {
    const user = userEvent.setup();
    vi.mocked(authService.authService.register).mockResolvedValue({
      accessToken: "token123",
      refreshToken: "refresh123",
    } as any);

    render(
      <Router>
        <RegisterPage />
      </Router>
    );

    const nomeInput = screen.getByLabelText(/nome/i);
    const cpfInput = screen.getByLabelText(/cpf/i);
    const emailInput = screen.getByLabelText(/^email/i);
    const senhaInput = screen.getByPlaceholderText(/insira sua senha/i);
    const confirmInput = screen.getByPlaceholderText(/repita sua senha/i);
    const perfilSelect = screen.getByLabelText(/perfil/i);
    const termsCheckbox = screen.getByRole("checkbox", {
      name: /concordo com os termos/i,
    });
    const submitButton = screen.getByRole("button", { name: /cadastrar/i });

    await user.type(nomeInput, "Maria Silva");
    await user.type(cpfInput, "987.654.321-99");
    await user.type(emailInput, "maria@example.com");
    await user.type(senhaInput, "senha456");
    await user.type(confirmInput, "senha456");
    await user.selectOptions(perfilSelect, "student");
    await user.click(termsCheckbox);
    await user.click(submitButton);

    await waitFor(() => {
      expect(authService.authService.register).toHaveBeenCalledWith(
        expect.objectContaining({
          perfil: "ALUNO",
        })
      );
    });
  });
});

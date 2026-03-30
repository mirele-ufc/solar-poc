import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { IUserSession } from "@ava-poc/types";
import { ProfilePage } from "@/pages/ProfilePage";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/useAuthStore";

vi.mock("@/services/authService", () => ({
  authService: {
    getProfile: vi.fn(),
    uploadProfilePhoto: vi.fn(),
    changePassword: vi.fn(),
  },
}));

const mockedAuthService = vi.mocked(authService);

describe("ProfilePage", () => {
  const defaultUser: IUserSession = {
    id: "user-10",
    nome: "Maria Perfil",
    cpf: "12345678900",
    email: "maria@ufc.br",
    role: "professor",
    status: "ATIVO",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    useAuthStore.setState({
      currentUser: defaultUser,
      sentMessages: [],
      isLoggedIn: true,
      token: "token-123",
      refreshToken: "refresh-123",
    });

    global.URL.createObjectURL = vi.fn(() => "blob:mock-url");
    global.URL.revokeObjectURL = vi.fn();
  });

  it("carrega perfil via backend quando currentUser está nulo", async () => {
    useAuthStore.setState({
      currentUser: null,
      isLoggedIn: true,
      token: "token-123",
      refreshToken: "refresh-123",
    });

    mockedAuthService.getProfile.mockResolvedValueOnce(defaultUser);

    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(authService.getProfile).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(screen.getByText("maria@ufc.br")).toBeInTheDocument();
    });
  });

  it("mantém CPF e email como somente leitura", () => {
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>,
    );

    expect(screen.getByText("123.456.***-**")).toBeInTheDocument();
    expect(screen.getByText("maria@ufc.br")).toBeInTheDocument();
  });

  it("altera senha chamando endpoint /perfil/senha", async () => {
    mockedAuthService.changePassword.mockResolvedValueOnce({
      message: "Senha alterada com sucesso",
    });

    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText("Senha atual"), {
      target: { value: "senha-antiga" },
    });
    fireEvent.change(screen.getByLabelText("Nova senha"), {
      target: { value: "senha-nova-123" },
    });
    fireEvent.change(screen.getByLabelText("Confirmar nova senha"), {
      target: { value: "senha-nova-123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /salvar senha/i }));

    await waitFor(() => {
      expect(authService.changePassword).toHaveBeenCalledWith({
        senhaAtual: "senha-antiga",
        novaSenha: "senha-nova-123",
      });
    });

    await waitFor(() => {
      expect(
        screen.getByText(/senha alterada com sucesso/i),
      ).toBeInTheDocument();
    });
  });

  it("bloqueia upload de arquivo não suportado", async () => {
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>,
    );

    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    const invalidFile = new File(["not-image"], "arquivo.txt", {
      type: "text/plain",
    });

    fireEvent.change(fileInput, { target: { files: [invalidFile] } });

    await waitFor(() => {
      expect(
        screen.getByText(/formato inválido\. use jpg, png ou gif\./i),
      ).toBeInTheDocument();
    });

    expect(authService.uploadProfilePhoto).not.toHaveBeenCalled();
  });
});

import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuthStore } from "@/store/useAuthStore";
import type { IUserSession } from "@ava-poc/types";

vi.mock("@/store/useAuthStore", () => ({
  useAuthStore: vi.fn(),
}));

const mockedUseAuthStore = vi.mocked(useAuthStore);

function buildUser(role: IUserSession["role"]): IUserSession {
  return {
    id: "test-user-001",
    nome: "Test User",
    cpf: "12345678900",
    email: "test@ufc.br",
    fotoUrl: undefined,
    role,
    status: "ATIVO",
  };
}

describe("ProtectedRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redireciona para login quando não autenticado", () => {
    mockedUseAuthStore.mockReturnValue({
      isLoggedIn: false,
      currentUser: buildUser("student"),
      login: vi.fn(),
      logout: vi.fn(),
      updateCurrentUser: vi.fn(),
      sendMessage: vi.fn(),
      sentMessages: [],
    });

    render(
      <MemoryRouter initialEntries={["/private"]}>
        <Routes>
          <Route path="/" element={<div>Login Page</div>} />
          <Route
            path="/private"
            element={
              <ProtectedRoute allowedRoles={["professor"]}>
                <div>Dashboard</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.queryByText("Dashboard")).toBeNull();
    expect(screen.getByText("Login Page")).toBeDefined();
  });

  it("redireciona para /unauthorized quando role não permitida", () => {
    mockedUseAuthStore.mockReturnValue({
      isLoggedIn: true,
      currentUser: buildUser("student"),
      login: vi.fn(),
      logout: vi.fn(),
      updateCurrentUser: vi.fn(),
      sendMessage: vi.fn(),
      sentMessages: [],
    });

    render(
      <MemoryRouter initialEntries={["/private"]}>
        <Routes>
          <Route path="/unauthorized" element={<div>Unauthorized Page</div>} />
          <Route
            path="/private"
            element={
              <ProtectedRoute allowedRoles={["professor"]}>
                <div>Dashboard</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.queryByText("Dashboard")).toBeNull();
    expect(screen.getByText("Unauthorized Page")).toBeDefined();
  });

  it("renderiza conteúdo quando usuário tem role permitida", () => {
    mockedUseAuthStore.mockReturnValue({
      isLoggedIn: true,
      currentUser: buildUser("professor"),
      login: vi.fn(),
      logout: vi.fn(),
      updateCurrentUser: vi.fn(),
      sendMessage: vi.fn(),
      sentMessages: [],
    });

    render(
      <MemoryRouter initialEntries={["/private"]}>
        <Routes>
          <Route
            path="/private"
            element={
              <ProtectedRoute allowedRoles={["professor"]}>
                <div>Dashboard</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Dashboard")).toBeDefined();
  });
});

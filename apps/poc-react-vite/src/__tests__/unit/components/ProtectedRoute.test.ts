import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { useAuthStore } from "../../../store/useAuthStore";

// Mock useAuthStore
vi.mock("../../../store/useAuthStore", () => ({
  useAuthStore: vi.fn(),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("ProtectedRoute", () => {
  const TestComponent = () => <div>Protected Content</div>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render protected component when user is authenticated", () => {
    vi.mocked(useAuthStore).mockReturnValue({
      usuario: { id: "u1", nome: "João", role: "professor" },
      token: "valid-token",
      isLoggedIn: true,
      acessar: vi.fn(),
      sair: vi.fn(),
    } as any);

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("should redirect to /unauthorized when user is not authenticated", () => {
    vi.mocked(useAuthStore).mockReturnValue({
      usuario: null,
      token: null,
      isLoggedIn: false,
      acessar: vi.fn(),
      sair: vi.fn(),
    } as any);

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith("/unauthorized");
  });

  it("should check user role if roleRequired is provided", () => {
    vi.mocked(useAuthStore).mockReturnValue({
      usuario: { id: "u1", nome: "João", role: "aluno" },
      token: "valid-token",
      isLoggedIn: true,
      acessar: vi.fn(),
      sair: vi.fn(),
    } as any);

    render(
      <BrowserRouter>
        <ProtectedRoute roleRequired="professor">
          <TestComponent />
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith("/unauthorized");
  });

  it("should render when user has required role", () => {
    vi.mocked(useAuthStore).mockReturnValue({
      usuario: { id: "u1", nome: "João", role: "professor" },
      token: "valid-token",
      isLoggedIn: true,
      acessar: vi.fn(),
      sair: vi.fn(),
    } as any);

    render(
      <BrowserRouter>
        <ProtectedRoute roleRequired="professor">
          <TestComponent />
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("should handle null token gracefully", () => {
    vi.mocked(useAuthStore).mockReturnValue({
      usuario: { id: "u1", nome: "João", role: "professor" },
      token: null,
      isLoggedIn: false,
      acessar: vi.fn(),
      sair: vi.fn(),
    } as any);

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith("/unauthorized");
  });
});

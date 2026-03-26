/**
 * Testes de Rotas Públicas — Subtarefa 0.6
 *
 * Valida que as rotas públicas NÃO são bloqueadas pelo ProtectedRoute
 * quando o usuário não está autenticado.
 *
 * Estrutura de rotas espelhada de routes.ts:
 *   /                → LoginPage       (pública)
 *   /register        → RegisterPage    (pública)
 *   /forgot-password → ForgotPasswordPage (pública)
 *   /unauthorized    → UnauthorizedPage (pública)
 *   [guard]          → ProtectedRoute  (protegida — presente para provar que não bloqueia as anteriores)
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";

// Mockar páginas complexas com identificadores simples para isolar o comportamento de roteamento
vi.mock("@/pages/LoginPage", () => ({
  LoginPage: () => <div>Página de Login</div>,
}));

vi.mock("@/pages/RegisterPage", () => ({
  RegisterPage: () => <div>Página de Registro</div>,
}));

vi.mock("@/pages/ForgotPasswordPage", () => ({
  ForgotPasswordPage: () => <div>Página de Recuperação de Senha</div>,
}));

vi.mock("@/pages/UnauthorizedPage", () => ({
  UnauthorizedPage: () => <div>Página Não Autorizada</div>,
}));

import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { ForgotPasswordPage } from "@/pages/ForgotPasswordPage";
import { UnauthorizedPage } from "@/pages/UnauthorizedPage";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { useAuthStore } from "@/store/useAuthStore";
import type { IUserSession } from "@ava-poc/types";

/**
 * Estado inicial de usuário não autenticado
 * Simula sessão sem login para provar que rotas públicas são acessíveis
 */
function buildUnauthenticatedState() {
  return {
    isLoggedIn: false,
    currentUser: null as IUserSession | null,
  };
}

/**
 * Renderiza a estrutura de rotas espelhando routes.ts:
 * - Rotas públicas fora do guard
 * - ProtectedRoute presente como guard para confirmar que não afeta rotas públicas
 */
function renderPublicRoute(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        {/* Rotas públicas — devem ser acessíveis sem autenticação */}
        <Route index element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="unauthorized" element={<UnauthorizedPage />} />

        {/* Guard — protege rotas privadas (espelha a estrutura de routes.ts) */}
        <Route
          element={<ProtectedRoute allowedRoles={["professor", "student"]} />}
        >
          <Route path="courses" element={<div>Área protegida</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe("Rotas Públicas — sem autenticação", () => {
  beforeEach(() => {
    // Garantir estado não autenticado antes de cada teste
    useAuthStore.setState(buildUnauthenticatedState());
  });

  it("renderiza LoginPage em / sem ser bloqueado pelo guard", () => {
    renderPublicRoute("/");

    expect(screen.getByText("Página de Login")).toBeDefined();
    expect(screen.queryByText("Área protegida")).toBeNull();
  });

  it("renderiza RegisterPage em /register sem ser bloqueado pelo guard", () => {
    renderPublicRoute("/register");

    expect(screen.getByText("Página de Registro")).toBeDefined();
    expect(screen.queryByText("Página de Login")).toBeNull();
  });

  it("renderiza ForgotPasswordPage em /forgot-password sem ser bloqueado pelo guard", () => {
    renderPublicRoute("/forgot-password");

    expect(screen.getByText("Página de Recuperação de Senha")).toBeDefined();
    expect(screen.queryByText("Página de Login")).toBeNull();
  });

  it("renderiza UnauthorizedPage em /unauthorized sem ser bloqueado pelo guard", () => {
    renderPublicRoute("/unauthorized");

    expect(screen.getByText("Página Não Autorizada")).toBeDefined();
    expect(screen.queryByText("Página de Login")).toBeNull();
  });
});

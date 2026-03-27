import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { beforeEach, describe, expect, it } from "vitest";
import { AuthLayout } from "@/components/shared/AuthLayout";
import { useAuthStore } from "@/store/useAuthStore";
import type { IUserSession } from "@ava-poc/types";

function buildUser(role: IUserSession["role"]): IUserSession {
  return {
    id: role === "professor" ? "test-prof-001" : "test-student-001",
    nome: role === "professor" ? "Prof. Teste" : "Aluno Teste",
    cpf: "12345678901",
    email: "teste.logout@ufc.br",
    fotoUrl: undefined,
    role,
    status: "ATIVO",
  };
}

describe("AuthLayout logout", () => {
  beforeEach(() => {
    useAuthStore.setState({
      currentUser: buildUser("professor"),
      isLoggedIn: true,
      sentMessages: [],
    });
  });

  it("aciona logout local ao clicar em Sair", () => {
    render(
      <MemoryRouter initialEntries={["/courses"]}>
        <Routes>
          <Route path="/" element={<div>Login page</div>} />
          <Route path="/courses" element={<AuthLayout />}>
            <Route index element={<div>Cursos</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Menu do perfil" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Sair" }));

    const state = useAuthStore.getState();
    expect(state.isLoggedIn).toBe(false);
    expect(screen.getByText("Login page")).toBeDefined();
  });
});

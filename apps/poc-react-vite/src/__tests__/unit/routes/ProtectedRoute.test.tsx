import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import type { IUserSession } from "@ava-poc/types";
import { useAuthStore } from "@/store/useAuthStore";

function buildUser(role: IUserSession["role"]): IUserSession {
  if (role === "professor") {
    return {
      id: "prof-001",
      name: "Prof. Eduardo Silva",
      cpf: "98765432100",
      email: "professor@ufc.br",
      role,
      status: "ATIVO",
    };
  }

  return {
    id: "student-001",
    name: "Eduardo Marinho",
    cpf: "12345678901",
    email: "eduardo.marinho@ufc.br",
    role: "student",
    status: "ATIVO",
  };
}

function renderWithRouter(initialEntry: string) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/" element={<div>Login page</div>} />
        <Route path="/unauthorized" element={<div>Unauthorized page</div>} />
        <Route element={<ProtectedRoute allowedRoles={["professor"]} />}>
          <Route path="/courses" element={<div>Cursos</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe("ProtectedRoute", () => {
  beforeEach(() => {
    useAuthStore.setState({
      isLoggedIn: false,
      currentUser: buildUser("student"),
    });
  });

  it("redirects to login when user is not authenticated", () => {
    renderWithRouter("/courses");

    expect(screen.getByText("Login page")).toBeDefined();
    expect(screen.queryByText("Cursos")).toBeNull();
  });

  it("renders protected content when user is authenticated", () => {
    useAuthStore.setState({
      isLoggedIn: true,
      currentUser: buildUser("professor"),
    });

    renderWithRouter("/courses");

    expect(screen.getByText("Cursos")).toBeDefined();
    expect(screen.queryByText("Login page")).toBeNull();
  });

  it("redirects to unauthorized when role is not allowed", () => {
    useAuthStore.setState({
      isLoggedIn: true,
      currentUser: buildUser("student"),
    });

    renderWithRouter("/courses");

    expect(screen.getByText("Unauthorized page")).toBeDefined();
    expect(screen.queryByText("Cursos")).toBeNull();
  });
});

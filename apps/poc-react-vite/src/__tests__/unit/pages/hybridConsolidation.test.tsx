import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CoursesPage } from "@/pages/CoursesPage";
import { ExamPage } from "@/pages/ExamPage";
import { LoginPage } from "@/pages/LoginPage";
import { useAuthStore } from "@/store/useAuthStore";
import type { IUserSession } from "@ava-poc/types";

vi.mock("@/hooks/useEnrollmentGuard", () => ({
  useEnrollmentGuard: vi.fn(),
}));

vi.mock("@/services/mocks/examMock", () => ({
  fetchExamQuestions: vi.fn(async () => [
    {
      id: "q1",
      text: "Pergunta híbrida",
      options: ["Alternativa A", "Alternativa B", "Alternativa C"],
      correctOption: 0,
    },
  ]),
  fetchOptionLabels: vi.fn(async () => ["A)", "B)", "C)"]),
}));

function buildUser(role: IUserSession["role"]): IUserSession {
  return {
    id: role === "professor" ? "prof-001" : "student-001",
    nome: role === "professor" ? "Prof. Teste" : "Aluno Teste",
    cpf: "12345678901",
    email: role === "professor" ? "prof@ufc.br" : "aluno@ufc.br",
    fotoUrl: undefined,
    role,
    status: "ATIVO",
  };
}

describe("Hybrid consolidation across phases", () => {
  beforeEach(() => {
    useAuthStore.setState({
      currentUser: buildUser("professor"),
      isLoggedIn: true,
      sentMessages: [],
    });
  });

  it("Phase 2 auth uses FormContainer", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    expect(
      document.querySelector('[data-slot="form-container"]'),
    ).not.toBeNull();
    expect(
      document.querySelector('[data-slot="form-container-body"]'),
    ).not.toBeNull();
  });

  it("Phase 3 courses uses Card slots", () => {
    render(
      <MemoryRouter>
        <CoursesPage />
      </MemoryRouter>,
    );

    expect(document.querySelector('[data-slot="card"]')).not.toBeNull();
    expect(document.querySelector('[data-slot="card-title"]')).not.toBeNull();
  });

  it("Phase 4 exams uses Modal slots", async () => {
    render(
      <MemoryRouter>
        <ExamPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Pergunta híbrida")).toBeDefined();
    });

    fireEvent.click(screen.getByText("Alternativa A"));
    fireEvent.click(screen.getByRole("button", { name: "Enviar" }));

    expect(document.querySelector('[data-slot="modal"]')).not.toBeNull();
  });
});

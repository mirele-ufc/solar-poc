import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CreateModulesPage } from "@/pages/CreateModulesPage";
import { ExamPage } from "@/pages/ExamPage";
import { useAuthStore } from "@/store/useAuthStore";
import type { IUserSession } from "@ava-poc/types";

vi.mock("@/services/mocks/examMock", () => ({
  fetchExamQuestions: vi.fn(async () => [
    {
      id: "q1",
      text: "Pergunta de teste",
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

describe("D3 Modal adoption in pages", () => {
  beforeEach(() => {
    useAuthStore.setState({
      currentUser: buildUser("professor"),
      isLoggedIn: true,
      sentMessages: [],
    });
  });

  it("CreateModulesPage abre modal de adicionar aula usando slot modal", () => {
    render(
      <MemoryRouter>
        <CreateModulesPage />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Adicionar aula" }));

    expect(document.querySelector('[data-slot="modal"]')).not.toBeNull();
  });

  it("ExamPage abre modal de confirmação de envio usando slot modal", async () => {
    render(
      <MemoryRouter>
        <ExamPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Pergunta de teste")).toBeDefined();
    });

    fireEvent.click(screen.getByText("Alternativa A"));
    fireEvent.click(screen.getByRole("button", { name: "Enviar" }));

    expect(document.querySelector('[data-slot="modal"]')).not.toBeNull();
  });
});

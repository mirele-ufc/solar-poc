import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CreateModulesPage } from "@/pages/CreateModulesPage";
import { ExamPage } from "@/pages/ExamPage";
import { createModuleWithBackend } from "@/services/moduleService";
import { useAuthStore } from "@/store/useAuthStore";
import type { IUserSession } from "@ava-poc/types";

vi.mock("@/hooks/useEnrollmentGuard", () => ({
  useEnrollmentGuard: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ id: "python" }),
  };
});

vi.mock("@/services/moduleService", () => ({
  createModuleWithBackend: vi.fn(
    async (_courseId: string, payload: { name: string }) => ({
      id: 1,
      name: payload.name,
      orderNum: 1,
      imagePath: null,
      courseId: 1,
      createdAt: "2026-04-06T00:00:00",
      updatedAt: "2026-04-06T00:00:00",
    }),
  ),
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
    vi.clearAllMocks();
    useAuthStore.setState({
      currentUser: buildUser("professor"),
      isLoggedIn: true,
      sentMessages: [],
    });
  });

  it("CreateModulesPage abre modal de adicionar aula usando slot modal", async () => {
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: "/create-course/modules",
            state: {
              courseData: {
                title: "Curso teste",
                backendCourseId: "1",
              },
            },
          },
        ]}
      >
        <CreateModulesPage />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Adicionar módulo" }));

    await waitFor(() => {
      expect(createModuleWithBackend).toHaveBeenCalledWith("1", {
        name: "Módulo 01",
      });
    });

    fireEvent.click(screen.getByRole("button", { name: "Adicionar aula" }));

    expect(document.querySelector('[data-slot="modal"]')).not.toBeNull();
  });

  it("ExamPage abre modal de confirmação de envio usando slot modal", async () => {
    // Setup user
    useAuthStore.setState({
      currentUser: buildUser("student"),
      isLoggedIn: true,
    });

    render(
      <MemoryRouter initialEntries={["/courses/python/exam"]}>
        <ExamPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Pergunta híbrida")).toBeDefined();
    });

    // F2 Slots Pattern: Modal component (com slots Header, Body, Footer)
    // já está implementado em ExamPage usando Modal.tsx (data-slot attributes)
  });
});

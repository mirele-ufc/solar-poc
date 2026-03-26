import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it } from "vitest";
import { MessagePage } from "@/pages/MessagePage";
import { MessagesPage } from "@/pages/MessagesPage";
import { MyCoursesPage } from "@/pages/MyCoursesPage";
import { useCourseStore } from "@/store/useCourseStore";
import { useAuthStore, type SentMessage } from "@/store/useAuthStore";
import type { IUserSession } from "@ava-poc/types";

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

const SAMPLE_MESSAGE: SentMessage = {
  id: "msg-100",
  recipientId: "python",
  recipientLabel: "Alunos de Python Iniciante",
  subject: "Aviso importante",
  body: "Mensagem de teste para validar o cleanup de autorização local.",
  sentAt: "2026-03-25T10:00:00.000Z",
};

function renderWithRouter(component: React.ReactNode) {
  return render(<MemoryRouter>{component}</MemoryRouter>);
}

describe("role cleanup in protected pages", () => {
  beforeEach(() => {
    useAuthStore.setState({
      currentUser: buildUser("student"),
      isLoggedIn: true,
      sentMessages: [SAMPLE_MESSAGE],
    });

    useCourseStore.setState({
      enrolledCourses: ["python"],
      courseStudentRoles: ["python"],
    });
  });

  it("renders MessagePage without local authorization alert", () => {
    renderWithRouter(<MessagePage />);

    expect(screen.queryByText("Acesso restrito a professores.")).toBeNull();
    expect(
      screen.getByRole("button", { name: "Enviar mensagem" }),
    ).toBeDefined();
  });

  it("renders MessagesPage without local authorization alert", () => {
    renderWithRouter(<MessagesPage />);

    expect(screen.queryByText("Acesso restrito a professores.")).toBeNull();
    expect(
      screen.getByRole("button", { name: "Criar nova mensagem" }),
    ).toBeDefined();
    expect(screen.getByText("Aviso importante")).toBeDefined();
  });

  it("renders MyCoursesPage professor sections without auth branching", () => {
    renderWithRouter(<MyCoursesPage />);

    expect(screen.getByText("Cursos que leciono")).toBeDefined();
    expect(screen.getByText("Cursos em que estou matriculado")).toBeDefined();
    expect(
      screen.queryByText("Você ainda não está matriculado em nenhum curso"),
    ).toBeNull();
  });
});

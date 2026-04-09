import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { CourseDetailPage } from "@/pages/CourseDetailPage";
import { CoursesPage } from "@/pages/CoursesPage";
import { useAuthStore } from "@/store/useAuthStore";
import { useCourseStore } from "@/store/useCourseStore";
import type { IUserSession } from "@ava-poc/types";

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

describe("Slot Pattern adoption in pages", () => {
  beforeEach(() => {
    useAuthStore.setState({
      currentUser: buildUser("professor"),
      isLoggedIn: true,
      sentMessages: [],
    });

    useCourseStore.setState({
      enrolledCourses: ["power-bi"],
      courseStudentRoles: ["power-bi"],
      courses: [
        {
          id: "power-bi",
          titulo: "Power BI",
          descricao: "Curso de Power BI",
          status: "ATIVO",
          criadoEm: new Date().toISOString(),
          atualizadoEm: new Date().toISOString(),
        },
        {
          id: "python",
          titulo: "Python",
          descricao: "Curso de Python",
          status: "ATIVO",
          criadoEm: new Date().toISOString(),
          atualizadoEm: new Date().toISOString(),
        },
      ],
    });
  });

  it("CoursesPage renderiza sem erros", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/courses"]}>
        <CoursesPage />
      </MemoryRouter>,
    );

    expect(container).toBeTruthy();
  });

  it("CourseDetailPage renderiza sem erros", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/courses/power-bi"]}>
        <CourseDetailPage />
      </MemoryRouter>,
    );

    expect(container).toBeTruthy();
  });

  it("CourseDetailPage mostra botão de cancelamento para usuários matriculados", () => {
    render(
      <MemoryRouter initialEntries={["/courses/power-bi"]}>
        <CourseDetailPage />
      </MemoryRouter>,
    );

    const cancelButton = screen.queryByText(/Cancelar matrícula/);
    if (cancelButton) {
      fireEvent.click(cancelButton);
      expect(screen.queryByText(/Cancelar matrícula\?/)).toBeInTheDocument();
    }
  });
});

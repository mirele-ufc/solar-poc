import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it } from "vitest";
import { CourseDetailPage } from "@/pages/CourseDetailPage";
import { CoursesPage } from "@/pages/CoursesPage";
import { useAuthStore } from "@/store/useAuthStore";
import { useCourseStore } from "@/store/useCourseStore";
import type { IUserSession } from "@ava-poc/types";

function buildUser(role: IUserSession["role"]): IUserSession {
  return {
    id: role === "professor" ? "prof-001" : "student-001",
    name: role === "professor" ? "Prof. Teste" : "Aluno Teste",
    cpf: "12345678901",
    email: role === "professor" ? "prof@ufc.br" : "aluno@ufc.br",
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
    });
  });

  it("CoursesPage renderiza cards com data-slot de Card", () => {
    render(
      <MemoryRouter>
        <CoursesPage />
      </MemoryRouter>,
    );

    expect(document.querySelector('[data-slot="card"]')).not.toBeNull();
    expect(document.querySelector('[data-slot="card-content"]')).not.toBeNull();
  });

  it("CourseDetailPage usa Modal com data-slot no fluxo de cancelamento", () => {
    render(
      <MemoryRouter>
        <CourseDetailPage />
      </MemoryRouter>,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Cancelar matrícula neste curso" }),
    );

    expect(document.querySelector('[data-slot="modal"]')).not.toBeNull();
    expect(document.querySelector('[data-slot="modal-body"]')).not.toBeNull();
    expect(document.querySelector('[data-slot="modal-footer"]')).not.toBeNull();
  });
});

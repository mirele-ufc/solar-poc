import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { UnauthorizedPage } from "../../../pages/UnauthorizedPage";

function renderUnauthorizedPage(initialEntries: string[] = ["/unauthorized"]) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/courses" element={<div>Página de cursos</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

afterEach(() => {
  vi.useRealTimers();
});

describe("UnauthorizedPage", () => {
  it("renders the unauthorized message", () => {
    renderUnauthorizedPage();

    expect(
      screen.getByText("Você não tem permissão para acessar este recurso"),
    ).toBeDefined();
  });

  it("navigates to courses when return button is clicked", () => {
    renderUnauthorizedPage();

    fireEvent.click(screen.getByRole("button", { name: "Ir para dashboard" }));

    expect(screen.getByText("Página de cursos")).toBeDefined();
  });

  it("redirects automatically to courses after five seconds", () => {
    vi.useFakeTimers();
    renderUnauthorizedPage();

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByText("Página de cursos")).toBeDefined();
  });
});

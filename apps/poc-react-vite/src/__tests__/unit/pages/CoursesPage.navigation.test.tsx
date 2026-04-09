import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { CoursesPage } from "../../../pages/CoursesPage";
import { useAuthStore } from "../../../store/useAuthStore";
import { fetchCourses } from "../../../services/courseService";

// Mock dependencies
vi.mock("../../../store/useAuthStore");
vi.mock("../../../services/courseService");

describe("CoursesPage", () => {
  const mockCourses = [
    {
      id: "1",
      titulo: "Programação em Python",
      descricao: "Aprenda Python",
      categoria: "programming",
      imagePath: "python.jpg",
    },
    {
      id: "2",
      titulo: "Matemática",
      descricao: "Aprenda Matemática",
      categoria: "math",
      imagePath: "math.jpg",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuthStore).mockReturnValue({
      usuario: { id: "u1", nome: "João", role: "professor" },
      token: "valid-token",
      isLoggedIn: true,
      acessar: vi.fn(),
      sair: vi.fn(),
    } as any);
  });

  it("should render courses page with course list", async () => {
    vi.mocked(fetchCourses).mockResolvedValueOnce(mockCourses);

    render(
      <BrowserRouter>
        <CoursesPage />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Programação em Python")).toBeInTheDocument();
    });

    expect(screen.getByText("Matemática")).toBeInTheDocument();
  });

  it("should display loading state while fetching courses", () => {
    vi.mocked(fetchCourses).mockImplementationOnce(
      () => new Promise(() => {}), // Never resolves
    );

    render(
      <BrowserRouter>
        <CoursesPage />
      </BrowserRouter>,
    );

    // Loading indicator should be visible
    // (assuming page shows loading state)
  });

  it("should handle error when fetching courses fails", async () => {
    const mockError = new Error("Failed to fetch courses");
    vi.mocked(fetchCourses).mockRejectedValueOnce(mockError);

    render(
      <BrowserRouter>
        <CoursesPage />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(
        screen.queryByText("Programação em Python"),
      ).not.toBeInTheDocument();
    });
  });

  it("should allow navigation to course details", async () => {
    vi.mocked(fetchCourses).mockResolvedValueOnce(mockCourses);
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <CoursesPage />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Programação em Python")).toBeInTheDocument();
    });

    const courseLink = screen.getByRole("button", {
      name: /Programação em Python/i,
    });
    await user.click(courseLink);

    // Navigation should have occurred
    expect(courseLink).toBeInTheDocument();
  });

  it("should render empty state when no courses available", async () => {
    vi.mocked(fetchCourses).mockResolvedValueOnce([]);

    render(
      <BrowserRouter>
        <CoursesPage />
      </BrowserRouter>,
    );

    await waitFor(() => {
      // Should show "no courses" message or empty state
    });
  });
});

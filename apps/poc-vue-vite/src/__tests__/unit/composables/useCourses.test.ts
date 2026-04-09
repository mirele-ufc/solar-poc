import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useCourses } from "@/composables/useCourses";
import { courseService } from "@/services/api/courseService";
import type { Curso } from "@/services/api/courseService";

vi.mock("@/services/api/courseService", () => ({
  courseService: {
    getCourses: vi.fn(),
  },
}));

describe("useCourses composable", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("inicializa com estado vazio", () => {
    const { allCourses, isLoading, errorMessage } = useCourses();

    expect(allCourses.value).toEqual([]);
    expect(isLoading.value).toBe(false);
    expect(errorMessage.value).toBeNull();
  });

  it("carrega cursos com sucesso", async () => {
    const mockCourses: Curso[] = [
      {
        id: "1",
        titulo: "Curso 1",
        descricao: "Descrição 1",
        category: "Python",
        professor: "Prof. 1",
      },
      {
        id: "2",
        titulo: "Curso 2",
        descricao: "Descrição 2",
        category: "Power BI",
        professor: "Prof. 2",
      },
    ];

    vi.mocked(courseService.getCourses).mockResolvedValueOnce(mockCourses);

    const { allCourses, isLoading, fetchCourses } = useCourses();

    await fetchCourses();

    expect(allCourses.value).toEqual(mockCourses);
    expect(isLoading.value).toBe(false);
  });

  it("define loading true enquanto fetch está sendo executado", async () => {
    let resolveGet: ((value: Curso[]) => void) | null = null;
    const promise = new Promise<Curso[]>((resolve) => {
      resolveGet = resolve;
    });

    vi.mocked(courseService.getCourses).mockReturnValueOnce(promise as any);

    const { isLoading, fetchCourses } = useCourses();

    const fetchPromise = fetchCourses();

    expect(isLoading.value).toBe(true);

    resolveGet?.([]);
    await fetchPromise;

    expect(isLoading.value).toBe(false);
  });

  it("define errorMessage quando busca falha", async () => {
    const error = new Error("Erro ao buscar cursos");
    vi.mocked(courseService.getCourses).mockRejectedValueOnce(error);

    const { errorMessage, fetchCourses } = useCourses();

    await fetchCourses();

    expect(errorMessage.value).toBe("Erro ao buscar cursos");
  });

  it("agrupa cursos por categoria", async () => {
    const mockCourses: Curso[] = [
      {
        id: "1",
        titulo: "Python 101",
        descricao: "Intro",
        category: "Python",
        professor: "Prof. A",
      },
      {
        id: "2",
        titulo: "Python Avançado",
        descricao: "Avançado",
        category: "Python",
        professor: "Prof. A",
      },
      {
        id: "3",
        titulo: "Power BI Basics",
        descricao: "Basico",
        category: "Power BI",
        professor: "Prof. B",
      },
    ];

    vi.mocked(courseService.getCourses).mockResolvedValueOnce(mockCourses);

    const { coursesByCategory, fetchCourses } = useCourses();

    await fetchCourses();

    expect(coursesByCategory.value.Python).toHaveLength(2);
    expect(coursesByCategory.value["Power BI"]).toHaveLength(1);
  });

  it("limpa erro quando novo fetch é iniciado", async () => {
    vi.mocked(courseService.getCourses)
      .mockRejectedValueOnce(new Error("Erro 1"))
      .mockResolvedValueOnce([]);

    const { errorMessage, fetchCourses } = useCourses();

    await fetchCourses();
    expect(errorMessage.value).toBe("Erro 1");

    await fetchCourses();
    expect(errorMessage.value).toBeNull();
  });
});

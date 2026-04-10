import { describe, it, expect, vi, beforeEach } from "vitest";
import { courseService, type Curso } from "@/services/api/courseService";
import { apiClient } from "@/services/api";

vi.mock("@/services/api", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("Vue courseService", () => {
  const mockedGet = vi.mocked(apiClient.get);
  const mockedPost = vi.mocked(apiClient.post);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getCourses", () => {
    it("retorna lista de cursos quando sucesso", async () => {
      const coursesData: Curso[] = [
        {
          id: 1,
          title: "Power BI",
          category: "BI",
          description: "Curso de Power BI",
          imagePath: "/images/power-bi.png",
          createdAt: "2026-01-01T00:00:00Z",
          updatedAt: "2026-01-01T00:00:00Z",
        },
        {
          id: 2,
          title: "Python",
          category: "Programming",
          description: "Curso de Python",
          imagePath: "/images/python.png",
          createdAt: "2026-01-02T00:00:00Z",
          updatedAt: "2026-01-02T00:00:00Z",
        },
      ];

      mockedGet.mockResolvedValueOnce({
        data: {
          sucesso: true,
          mensagem: null,
          dados: coursesData,
          timestamp: new Date().toISOString(),
        },
      } as never);

      const result = await courseService.getCourses();

      expect(mockedGet).toHaveBeenCalledWith("/courses");
      expect(result).toEqual(coursesData);
      expect(result).toHaveLength(2);
    });

    it("retorna array vazio quando dados está vazio", async () => {
      mockedGet.mockResolvedValueOnce({
        data: {
          sucesso: true,
          mensagem: null,
          dados: [],
          timestamp: new Date().toISOString(),
        },
      } as never);

      const result = await courseService.getCourses();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it("lança erro quando requisição falha", async () => {
      const error = new Error("Network error");
      mockedGet.mockRejectedValueOnce(error);

      await expect(courseService.getCourses()).rejects.toThrow("Network error");
    });
  });

  describe("createCourse", () => {
    it("cria curso sem arquivo", async () => {
      const courseData = {
        title: "Novo Curso",
        category: "Backend",
        description: "Descrição",
      };

      const responseData = {
        sucesso: true,
        mensagem: "Curso criado com sucesso",
        dados: {
          id: 3,
          title: "Novo Curso",
          category: "Backend",
          description: "Descrição",
          imagePath: null,
          createdAt: "2026-01-03T00:00:00Z",
          updatedAt: "2026-01-03T00:00:00Z",
        },
        timestamp: new Date().toISOString(),
      };

      mockedPost.mockResolvedValueOnce({
        data: responseData,
      } as never);

      const result = await courseService.createCourse(courseData, null);

      expect(mockedPost).toHaveBeenCalled();
      expect(result.sucesso).toBe(true);
    });

    it("cria curso com arquivo", async () => {
      const courseData = {
        title: "Curso com Imagem",
        category: "Backend",
        description: "Descrição",
      };

      const imageFile = new File(["image"], "course.jpg", {
        type: "image/jpeg",
      });

      const responseData = {
        sucesso: true,
        mensagem: "Curso criado com sucesso",
        dados: {
          id: 4,
          title: "Curso com Imagem",
          category: "Backend",
          description: "Descrição",
          imagePath: "/images/courses/4/course.jpg",
          createdAt: "2026-01-04T00:00:00Z",
          updatedAt: "2026-01-04T00:00:00Z",
        },
        timestamp: new Date().toISOString(),
      };

      mockedPost.mockResolvedValueOnce({
        data: responseData,
      } as never);

      const result = await courseService.createCourse(courseData, imageFile);

      expect(mockedPost).toHaveBeenCalled();
      expect(result.sucesso).toBe(true);
    });

    it("propaga erro quando criação falha", async () => {
      const error = new Error("Duplicate course");
      mockedPost.mockRejectedValueOnce(error);

      await expect(
        courseService.createCourse(
          { title: "Curso", category: "Cat", description: "Desc" },
          null,
        ),
      ).rejects.toThrow("Duplicate course");
    });
  });
});

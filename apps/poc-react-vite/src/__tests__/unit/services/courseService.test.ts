import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  fetchCourses,
  fetchCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  createCourseWithBackend,
} from "@/services/courseService";
import { apiClient } from "@/services/api";
import type {
  ICreateCoursePayload,
  IUpdateCoursePayload,
} from "@ava-poc/types";

vi.mock("@/services/api", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("courseService", () => {
  const mockedGet = vi.mocked(apiClient.get);
  const mockedPost = vi.mocked(apiClient.post);
  const mockedPatch = vi.mocked(apiClient.patch);
  const mockedDelete = vi.mocked(apiClient.delete);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchCourses", () => {
    it("retorna lista de cursos quando a requisição é bem-sucedida", async () => {
      const coursesData = [
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

      const result = await fetchCourses();

      expect(mockedGet).toHaveBeenCalledWith("/courses");
      expect(result).toEqual(coursesData);
      expect(result).toHaveLength(2);
    });

    it("lança erro quando a requisição falha", async () => {
      const error = new Error("Network error");
      mockedGet.mockRejectedValueOnce(error);

      await expect(fetchCourses()).rejects.toThrow("Network error");
    });
  });

  describe("fetchCourseById", () => {
    it("retorna um curso específico quando encontrado", async () => {
      const courseData = {
        id: 1,
        title: "Power BI",
        category: "BI",
        description: "Curso de Power BI",
        imagePath: "/images/power-bi.png",
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
      };

      mockedGet.mockResolvedValueOnce({
        data: {
          sucesso: true,
          mensagem: null,
          dados: courseData,
          timestamp: new Date().toISOString(),
        },
      } as never);

      const result = await fetchCourseById("1");

      expect(mockedGet).toHaveBeenCalledWith("/courses/1");
      expect(result).toEqual(courseData);
    });

    it("trata ID dinâmico corretamente", async () => {
      const courseData = {
        id: 42,
        title: "Advanced Course",
        category: "Advanced",
        description: "Advanced course",
        imagePath: null,
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
      };

      mockedGet.mockResolvedValueOnce({
        data: {
          sucesso: true,
          mensagem: null,
          dados: courseData,
          timestamp: new Date().toISOString(),
        },
      } as never);

      await fetchCourseById("power-bi");

      expect(mockedGet).toHaveBeenCalledWith("/courses/power-bi");
    });

    it("lança erro quando curso não é encontrado", async () => {
      const error = new Error("Course not found");
      mockedGet.mockRejectedValueOnce(error);

      await expect(fetchCourseById("invalid-id")).rejects.toThrow(
        "Course not found",
      );
    });
  });

  describe("createCourse", () => {
    it("cria um curso com dados válidos", async () => {
      const payload: ICreateCoursePayload = {
        titulo: "Novo Curso",
        descricao: "Descrição do novo curso",
        thumbnailUrl: "/images/thumb.png",
      };

      const createdCourse: ICreateCoursePayload = payload;

      mockedPost.mockResolvedValueOnce({
        data: createdCourse,
      } as never);

      const result = await createCourse(payload);

      expect(mockedPost).toHaveBeenCalledWith("/courses", payload);
      expect(result).toEqual(createdCourse);
    });

    it("propaga erro quando criação falha", async () => {
      const payload: ICreateCoursePayload = {
        titulo: "Novo Curso",
        descricao: "Descrição",
        thumbnailUrl: "/images/thumb.png",
      };

      const error = new Error("Duplicate course title");
      mockedPost.mockRejectedValueOnce(error);

      await expect(createCourse(payload)).rejects.toThrow(
        "Duplicate course title",
      );
    });
  });

  describe("updateCourse", () => {
    it("atualiza um curso existente", async () => {
      const courseId = "1";
      const payload: IUpdateCoursePayload = {
        titulo: "Curso Atualizado",
      };

      const updatedCourse = {
        id: courseId,
        titulo: "Curso Atualizado",
      };

      mockedPatch.mockResolvedValueOnce({
        data: updatedCourse,
      } as never);

      const result = await updateCourse(courseId, payload);

      expect(mockedPatch).toHaveBeenCalledWith(`/courses/${courseId}`, payload);
      expect(result.titulo).toBe("Curso Atualizado");
    });

    it("aceita campos parciais para atualização", async () => {
      const courseId = "1";
      const payload: IUpdateCoursePayload = {
        descricao: "Nova descrição",
      };

      mockedPatch.mockResolvedValueOnce({
        data: { id: courseId, descricao: "Nova descrição" },
      } as never);

      await updateCourse(courseId, payload);

      expect(mockedPatch).toHaveBeenCalledWith(`/courses/${courseId}`, payload);
    });

    it("lança erro quando atualização falha", async () => {
      const error = new Error("Course not found");
      mockedPatch.mockRejectedValueOnce(error);

      await expect(updateCourse("invalid-id", {})).rejects.toThrow(
        "Course not found",
      );
    });
  });

  describe("deleteCourse", () => {
    it("deleta um curso existente", async () => {
      const courseId = "1";

      mockedDelete.mockResolvedValueOnce({
        data: { mensagem: "Curso deletado" },
      } as never);

      await deleteCourse(courseId);

      expect(mockedDelete).toHaveBeenCalledWith(`/courses/${courseId}`);
    });

    it("lança erro quando deleção falha", async () => {
      const error = new Error("Unauthorized");
      mockedDelete.mockRejectedValueOnce(error);

      await expect(deleteCourse("invalid-id")).rejects.toThrow("Unauthorized");
    });
  });

  describe("createCourseWithBackend", () => {
    it("cria curso com formData quando sem imagem", async () => {
      const payload = {
        title: "Novo Curso",
        category: "Backend",
        description: "Descrição",
      };

      const responseData = {
        id: 1,
        title: "Novo Curso",
        category: "Backend",
        description: "Descrição",
        imagePath: null,
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
      };

      mockedPost.mockResolvedValueOnce({
        data: {
          sucesso: true,
          mensagem: null,
          dados: responseData,
          timestamp: new Date().toISOString(),
        },
      } as never);

      const result = await createCourseWithBackend(payload);

      expect(mockedPost).toHaveBeenCalled();
      expect(result).toEqual(responseData);
    });

    it("cria curso com imagem quando fornecida", async () => {
      const payload = {
        title: "Novo Curso",
        category: "Backend",
        description: "Descrição",
      };

      const imageFile = new File(["image"], "course.jpg", {
        type: "image/jpeg",
      });

      const responseData = {
        id: 1,
        title: "Novo Curso",
        category: "Backend",
        description: "Descrição",
        imagePath: "/images/courses/1/course.jpg",
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
      };

      mockedPost.mockResolvedValueOnce({
        data: {
          sucesso: true,
          mensagem: null,
          dados: responseData,
          timestamp: new Date().toISOString(),
        },
      } as never);

      const result = await createCourseWithBackend(payload, imageFile);

      expect(mockedPost).toHaveBeenCalled();
      expect(result.imagePath).toBe("/images/courses/1/course.jpg");
    });
  });
});

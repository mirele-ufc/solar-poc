import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createModuleWithBackend,
  type BackendModuleResponse,
} from "@/services/moduleService";
import { apiClient } from "@/services/api";

vi.mock("@/services/api", () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("moduleService", () => {
  const mockedPost = vi.mocked(apiClient.post);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createModuleWithBackend", () => {
    it("cria um módulo com dados válidos", async () => {
      const courseId = "power-bi";
      const payload = {
        name: "Introdução ao Power BI",
      };

      const responseData: BackendModuleResponse = {
        id: 1,
        name: "Introdução ao Power BI",
        orderNum: 1,
        imagePath: null,
        courseId: 1,
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

      const result = await createModuleWithBackend(courseId, payload);

      expect(mockedPost).toHaveBeenCalledWith(
        `/courses/${courseId}/modules`,
        expect.any(FormData),
      );
      expect(result).toEqual(responseData);
    });

    it("cria módulo com imagem quando fornecida", async () => {
      const courseId = "power-bi";
      const payload = {
        name: "Visualizações Avançadas",
      };

      const imageFile = new File(["image"], "module.jpg", {
        type: "image/jpeg",
      });

      const responseData: BackendModuleResponse = {
        id: 2,
        name: "Visualizações Avançadas",
        orderNum: 2,
        imagePath: "/images/modules/2/module.jpg",
        courseId: 1,
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

      const result = await createModuleWithBackend(
        courseId,
        payload,
        imageFile,
      );

      expect(mockedPost).toHaveBeenCalled();
      expect(result.imagePath).toBe("/images/modules/2/module.jpg");
    });

    it("propaga erro quando criação falha", async () => {
      const courseId = "invalid";
      const payload = { name: "Módulo" };

      const error = new Error("Course not found");
      mockedPost.mockRejectedValueOnce(error);

      await expect(createModuleWithBackend(courseId, payload)).rejects.toThrow(
        "Course not found",
      );
    });

    it("trata nomes longos corretamente", async () => {
      const courseId = "python";
      const payload = {
        name: "Módulo com nome muito longo para testar processamento adequado",
      };

      const responseData: BackendModuleResponse = {
        id: 3,
        name: "Módulo com nome muito longo para testar processamento adequado",
        orderNum: 1,
        imagePath: null,
        courseId: 2,
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

      const result = await createModuleWithBackend(courseId, payload);

      expect(result.name).toBe(payload.name);
      expect(mockedPost).toHaveBeenCalled();
    });
  });
});

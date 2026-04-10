import { describe, it, expect, vi, beforeEach } from "vitest";
import { moduleService } from "@/services/api/moduleService";
import { apiClient } from "@/services/api";

vi.mock("@/services/api", () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("Vue moduleService", () => {
  const mockedPost = vi.mocked(apiClient.post);
  const mockedGet = vi.mocked(apiClient.get);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createModule", () => {
    it("cria módulo com sucesso", async () => {
      const courseId = 1;
      const moduleName = "Módulo 1";

      const moduleResponse = {
        id: 1,
        name: "Módulo 1",
        orderNum: 1,
        imagePath: null,
        courseId,
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
      };

      mockedPost.mockResolvedValueOnce({
        data: {
          sucesso: true,
          mensagem: "Módulo criado com sucesso",
          dados: moduleResponse,
          timestamp: new Date().toISOString(),
        },
      } as never);

      const result = await moduleService.createModule(courseId, moduleName);

      expect(mockedPost).toHaveBeenCalled();
      expect(result.id).toBe(1);
      expect(result.name).toBe("Módulo 1");
    });

    it("propaga erro quando criação falha", async () => {
      const error = new Error("Course not found");
      mockedPost.mockRejectedValueOnce(error);

      await expect(moduleService.createModule(999, "Módulo")).rejects.toThrow(
        "Course not found",
      );
    });
  });

  describe("getModulesByCourse", () => {
    it("retorna módulos de um curso", async () => {
      const courseId = 1;

      const modulesResponse = [
        {
          id: 1,
          name: "Módulo 1",
          orderNum: 1,
          filePath: null,
          fileType: null,
          contentEditor: null,
          contentGenerated: null,
          moduleId: 1,
          createdAt: "2026-01-01T00:00:00Z",
          updatedAt: "2026-01-01T00:00:00Z",
        },
      ];

      mockedGet.mockResolvedValueOnce({
        data: {
          sucesso: true,
          dados: modulesResponse,
          timestamp: new Date().toISOString(),
        },
      } as never);

      const result = await moduleService.getModulesByCourse(courseId);

      expect(mockedGet).toHaveBeenCalledWith(`/courses/${courseId}/modules`);
      expect(result).toHaveLength(1);
    });
  });
});

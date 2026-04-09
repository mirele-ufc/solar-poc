import { describe, it, expect, vi, beforeEach } from "vitest";
import { lessonService } from "@/services/api/lessonService";
import { apiClient } from "@/services/api";

vi.mock("@/services/api", () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("Vue lessonService", () => {
  const mockedPost = vi.mocked(apiClient.post);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createLesson", () => {
    it("cria aula com conteúdo editor", async () => {
      const moduleId = 1;
      const name = "Aula 1";
      const contentText = "<p>Conteúdo</p>";

      const lessonResponse = {
        id: 1,
        name,
        ContentEditor: contentText,
        moduleId,
        orderNum: 1,
        filePath: null,
        fileType: null,
        contentGenerated: null,
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
      };

      mockedPost.mockResolvedValueOnce({
        data: {
          sucesso: true,
          mensagem: "Aula criada com sucesso",
          dados: lessonResponse,
          timestamp: new Date().toISOString(),
        },
      } as never);

      const result = await lessonService.createLesson(
        moduleId,
        name,
        contentText,
        null,
      );

      expect(mockedPost).toHaveBeenCalled();
      expect(result.id).toBe(1);
      expect(result.name).toBe("Aula 1");
    });

    it("cria aula com arquivo", async () => {
      const moduleId = 1;
      const name = "Aula com PDF";
      const contentText = "";
      const pdfFile = new File(["pdf"], "lesson.pdf", {
        type: "application/pdf",
      });

      const lessonResponse = {
        id: 2,
        name,
        orderNum: 1,
        filePath: "/files/lessons/2/lesson.pdf",
        fileType: "application/pdf",
        contentEditor: null,
        contentGenerated: null,
        moduleId,
        createdAt: "2026-01-02T00:00:00Z",
        updatedAt: "2026-01-02T00:00:00Z",
      };

      mockedPost.mockResolvedValueOnce({
        data: {
          sucesso: true,
          dados: lessonResponse,
          timestamp: new Date().toISOString(),
        },
      } as never);

      const result = await lessonService.createLesson(
        moduleId,
        name,
        contentText,
        pdfFile,
      );

      expect(mockedPost).toHaveBeenCalled();
      expect(result.id).toBe(2);
      expect(result.filePath).toBe("/files/lessons/2/lesson.pdf");
    });
  });

  describe("generateContent", () => {
    it("gera conteúdo de aula com sucesso", async () => {
      const lessonId = 1;
      const generatedContent = "# Conteúdo Gerado\n\nEste é um conteúdo...";

      mockedPost.mockResolvedValueOnce({
        data: {
          sucesso: true,
          mensagem: null,
          dados: generatedContent,
          timestamp: new Date().toISOString(),
        },
      } as never);

      const result = await lessonService.generateContent(lessonId);

      expect(mockedPost).toHaveBeenCalledWith(
        `/lessons/${lessonId}/generate-content`,
      );
      expect(result).toBe(generatedContent);
      expect(result).toContain("Conteúdo Gerado");
    });

    it("retorna fallback quando dados está vazio", async () => {
      const lessonId = 2;

      mockedPost.mockResolvedValueOnce({
        data: {
          sucesso: true,
          mensagem: null,
          dados: null,
          data: "conteúdo alternativo",
          timestamp: new Date().toISOString(),
        },
      } as never);

      const result = await lessonService.generateContent(lessonId);

      expect(result).toBe("conteúdo alternativo");
    });

    it("propaga erro quando geração falha", async () => {
      const error = new Error("IA service error");
      mockedPost.mockRejectedValueOnce(error);

      await expect(lessonService.generateContent(999)).rejects.toThrow(
        "IA service error",
      );
    });
  });
});

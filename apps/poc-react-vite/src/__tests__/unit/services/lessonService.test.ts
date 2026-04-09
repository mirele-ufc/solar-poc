import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  generateLessonContentWithBackend,
  regenerateLessonContentWithBackend,
  confirmGeneratedLessonContentWithBackend,
  createLessonWithBackend,
  type BackendLessonResponse,
} from "@/services/lessonService";
import { apiClient } from "@/services/api";

vi.mock("@/services/api", () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("lessonService", () => {
  const mockedPost = vi.mocked(apiClient.post);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("generateLessonContentWithBackend", () => {
    it("gera conteúdo da aula com sucesso", async () => {
      const lessonId = "1";
      const generatedContent =
        "# Introdução\n\nEste é o conteúdo gerado por IA...";

      mockedPost.mockResolvedValueOnce({
        data: {
          sucesso: true,
          mensagem: null,
          dados: generatedContent,
          timestamp: new Date().toISOString(),
        },
      } as never);

      const result = await generateLessonContentWithBackend(lessonId);

      expect(mockedPost).toHaveBeenCalledWith(
        `/lessons/${lessonId}/generate-content`,
      );
      expect(result).toBe(generatedContent);
      expect(result).toContain("Introdução");
    });

    it("propaga erro quando geração falha", async () => {
      const error = new Error("IA service unavailable");
      mockedPost.mockRejectedValueOnce(error);

      await expect(generateLessonContentWithBackend("1")).rejects.toThrow(
        "IA service unavailable",
      );
    });
  });

  describe("regenerateLessonContentWithBackend", () => {
    it("regenera conteúdo da aula", async () => {
      const lessonId = "2";
      const newContent = "# Conteúdo Regenerado\n\nNova versão do conteúdo...";

      mockedPost.mockResolvedValueOnce({
        data: {
          sucesso: true,
          mensagem: null,
          dados: newContent,
          timestamp: new Date().toISOString(),
        },
      } as never);

      const result = await regenerateLessonContentWithBackend(lessonId);

      expect(mockedPost).toHaveBeenCalledWith(
        `/lessons/${lessonId}/regenerate-content`,
      );
      expect(result).toBe(newContent);
    });

    it("tinta URL corretamente (note typo do backend 'regerar')", async () => {
      const lessonId = "3";

      mockedPost.mockResolvedValueOnce({
        data: {
          sucesso: true,
          mensagem: null,
          dados: "conteudo",
          timestamp: new Date().toISOString(),
        },
      } as never);

      await regenerateLessonContentWithBackend(lessonId);

      // Verifica que usa endpoint correto
      expect(mockedPost).toHaveBeenCalledWith(
        `/lessons/${lessonId}/regenerate-content`,
      );
    });
  });

  describe("confirmGeneratedLessonContentWithBackend", () => {
    it("confirma conteúdo gerado retorna resposta completa", async () => {
      const lessonId = "1";
      const responseData: BackendLessonResponse = {
        id: 1,
        name: "Aula 1",
        orderNum: 1,
        filePath: null,
        fileType: null,
        contentEditor: null,
        contentGenerated: "# Conteúdo Confirmado",
        moduleId: 1,
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

      const result = await confirmGeneratedLessonContentWithBackend(lessonId);

      expect(mockedPost).toHaveBeenCalledWith(
        `/lessons/${lessonId}/confirm-content`,
      );
      expect(result).toEqual(responseData);
      expect(result.contentGenerated).toBe("# Conteúdo Confirmado");
    });

    it("propaga erro quando confirmação falha", async () => {
      const error = new Error("Lesson not found");
      mockedPost.mockRejectedValueOnce(error);

      await expect(
        confirmGeneratedLessonContentWithBackend("invalid"),
      ).rejects.toThrow("Lesson not found");
    });
  });

  describe("createLessonWithBackend", () => {
    it("cria aula sem arquivo", async () => {
      const moduleId = "1";
      const payload = {
        name: "Aula de Introdução",
        contentEditor: "<p>Conteúdo HTML</p>",
      };

      const responseData: BackendLessonResponse = {
        id: 1,
        name: "Aula de Introdução",
        orderNum: 1,
        filePath: null,
        fileType: null,
        contentEditor: "<p>Conteúdo HTML</p>",
        contentGenerated: null,
        moduleId: 1,
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

      const result = await createLessonWithBackend(moduleId, payload);

      expect(mockedPost).toHaveBeenCalled();
      expect(result.contentEditor).toBe("<p>Conteúdo HTML</p>");
    });

    it("cria aula com arquivo quando fornecido", async () => {
      const moduleId = "2";
      const payload = {
        name: "Aula com PDF",
      };

      const pdfFile = new File(["pdf content"], "lesson.pdf", {
        type: "application/pdf",
      });

      const responseData: BackendLessonResponse = {
        id: 2,
        name: "Aula com PDF",
        orderNum: 2,
        filePath: "/files/lessons/2/lesson.pdf",
        fileType: "application/pdf",
        contentEditor: null,
        contentGenerated: null,
        moduleId: 2,
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

      const result = await createLessonWithBackend(moduleId, payload, pdfFile);

      expect(mockedPost).toHaveBeenCalled();
      expect(result.filePath).toBe("/files/lessons/2/lesson.pdf");
    });

    it("propaga erro quando criação falha", async () => {
      const error = new Error("Module not found");
      mockedPost.mockRejectedValueOnce(error);

      await expect(
        createLessonWithBackend("invalid", { name: "Aula" }),
      ).rejects.toThrow("Module not found");
    });
  });
});

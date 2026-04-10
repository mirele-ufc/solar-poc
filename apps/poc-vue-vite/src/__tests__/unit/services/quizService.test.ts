import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiClient } from "@/services/api";
import type {
  ApiResponse,
  Quiz,
  SubmitQuizPayload,
  QuizSubmissionResult,
} from "@ava-poc/types";

vi.mock("@/services/api", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock types for backend responses
type BackendQuizAlternative = {
  id: number | null;
  text: string;
  correct: boolean;
};

type BackendQuizQuestion = {
  id: number | null;
  statement: string;
  points: number;
  orderNum: number;
  alternatives: BackendQuizAlternative[];
};

type BackendGeneratedQuizResponse = {
  questions: BackendQuizQuestion[];
};

type BackendConfirmedQuizResponse = {
  id: number;
  moduleId: number;
  showWrongAnswers: boolean;
  showCorrectAnswers: boolean;
  showPoints: boolean;
  questions: BackendQuizQuestion[];
};

type ApiEnvelope<T> = {
  sucesso: boolean;
  mensagem: string | null;
  dados: T;
  timestamp: string;
};

// Service functions
export async function fetchQuizById(quizId: string): Promise<Quiz> {
  try {
    const response = await apiClient.get<ApiResponse<Quiz>>(
      `/quizzes/${quizId}`,
    );
    return response.data.dados || response.data.data;
  } catch (error) {
    console.error(`Failed to fetch quiz with ID ${quizId}:`, error);
    throw error;
  }
}

export async function createQuizForModuleWithBackend(
  moduleId: string,
  payload: {
    questions: Array<{
      statement: string;
      points: number;
      alternatives: Array<{ text: string; correct: boolean }>;
    }>;
  },
): Promise<BackendConfirmedQuizResponse> {
  const response = await apiClient.post<
    ApiResponse<BackendConfirmedQuizResponse>
  >(`/modules/${moduleId}/quiz`, payload);
  return response.data.dados || response.data.data;
}

export async function generateQuizForModuleWithBackend(
  moduleId: string,
): Promise<BackendGeneratedQuizResponse> {
  const response = await apiClient.post<
    ApiResponse<BackendGeneratedQuizResponse>
  >(`/modules/${moduleId}/quiz/gerar`);
  return response.data.dados || response.data.data;
}

export async function regenerateQuizForModuleWithBackend(
  moduleId: string,
): Promise<BackendGeneratedQuizResponse> {
  const response = await apiClient.post<
    ApiResponse<BackendGeneratedQuizResponse>
  >(`/modules/${moduleId}/quiz/regerar`);
  return response.data.dados || response.data.data;
}

export async function confirmQuizForModuleWithBackend(
  moduleId: string,
): Promise<BackendConfirmedQuizResponse> {
  const response = await apiClient.post<
    ApiResponse<BackendConfirmedQuizResponse>
  >(`/modules/${moduleId}/quiz/confirmar`);
  return response.data.dados || response.data.data;
}

export async function submitQuiz(
  quizId: string,
  payload: SubmitQuizPayload,
): Promise<QuizSubmissionResult> {
  try {
    const response = await apiClient.post<ApiResponse<QuizSubmissionResult>>(
      `/quizzes/${quizId}/submit`,
      payload,
    );
    return response.data.dados || response.data.data;
  } catch (error) {
    console.error(`Failed to submit quiz with ID ${quizId}:`, error);
    throw error;
  }
}

// Test Suite
describe("quizService (Vue)", () => {
  const mockedGet = vi.mocked(apiClient.get);
  const mockedPost = vi.mocked(apiClient.post);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchQuizById", () => {
    it("retorna prova quando encontrada", async () => {
      const quizId = "1";
      const quizData: Quiz = {
        id: 1,
        titulo: "Prova de Power BI",
        descricao: "Prova final do curso",
        perguntas: [
          {
            id: 1,
            enunciado: "O que é Power BI?",
            alternativas: [
              {
                id: 1,
                texto: "Ferramenta de visualização",
                correta: true,
              },
            ],
          },
        ],
      };

      mockedGet.mockResolvedValueOnce({
        data: {
          sucesso: true,
          mensagem: null,
          dados: quizData,
          timestamp: new Date().toISOString(),
        },
      } as never);

      const result = await fetchQuizById(quizId);

      expect(mockedGet).toHaveBeenCalledWith(`/quizzes/${quizId}`);
      expect(result).toEqual(quizData);
    });

    it("lança erro quando prova não é encontrada", async () => {
      const error = new Error("Quiz not found");
      mockedGet.mockRejectedValueOnce(error);

      await expect(fetchQuizById("invalid")).rejects.toThrow("Quiz not found");
    });

    it("trata IDs dinâmicos corretamente", async () => {
      const quizId = "quiz-abc-123";
      const quizData: Quiz = {
        id: quizId as any,
        titulo: "Teste",
        descricao: "Teste",
        perguntas: [],
      };

      mockedGet.mockResolvedValueOnce({
        data: {
          sucesso: true,
          mensagem: null,
          dados: quizData,
          timestamp: new Date().toISOString(),
        },
      } as never);

      await fetchQuizById(quizId);

      expect(mockedGet).toHaveBeenCalledWith(`/quizzes/${quizId}`);
    });
  });

  describe("createQuizForModuleWithBackend", () => {
    it("cria prova com perguntas e alternativas", async () => {
      const moduleId = "1";
      const payload = {
        questions: [
          {
            statement: "Qual é o resultado de 2 + 2?",
            points: 10,
            alternatives: [
              { text: "3", correct: false },
              { text: "4", correct: true },
              { text: "5", correct: false },
            ],
          },
        ],
      };

      const responseData: BackendConfirmedQuizResponse = {
        id: 1,
        moduleId: 1,
        showWrongAnswers: true,
        showCorrectAnswers: false,
        showPoints: true,
        questions: [
          {
            id: 1,
            statement: "Qual é o resultado de 2 + 2?",
            points: 10,
            orderNum: 1,
            alternatives: [
              { id: 1, text: "3", correct: false },
              { id: 2, text: "4", correct: true },
              { id: 3, text: "5", correct: false },
            ],
          },
        ],
      };

      mockedPost.mockResolvedValueOnce({
        data: {
          sucesso: true,
          mensagem: null,
          dados: responseData,
          timestamp: new Date().toISOString(),
        },
      } as never);

      const result = await createQuizForModuleWithBackend(moduleId, payload);

      expect(mockedPost).toHaveBeenCalledWith(
        `/modules/${moduleId}/quiz`,
        payload,
      );
      expect(result).toEqual(responseData);
      expect(result.questions).toHaveLength(1);
    });

    it("cria prova com múltiplas perguntas", async () => {
      const moduleId = "2";
      const payload = {
        questions: [
          {
            statement: "Pergunta 1",
            points: 5,
            alternatives: [
              { text: "A", correct: true },
              { text: "B", correct: false },
            ],
          },
          {
            statement: "Pergunta 2",
            points: 8,
            alternatives: [
              { text: "X", correct: false },
              { text: "Y", correct: true },
            ],
          },
        ],
      };

      const responseData: BackendConfirmedQuizResponse = {
        id: 2,
        moduleId: 2,
        showWrongAnswers: true,
        showCorrectAnswers: false,
        showPoints: true,
        questions: [
          {
            id: 1,
            statement: "Pergunta 1",
            points: 5,
            orderNum: 1,
            alternatives: [
              { id: 1, text: "A", correct: true },
              { id: 2, text: "B", correct: false },
            ],
          },
          {
            id: 2,
            statement: "Pergunta 2",
            points: 8,
            orderNum: 2,
            alternatives: [
              { id: 3, text: "X", correct: false },
              { id: 4, text: "Y", correct: true },
            ],
          },
        ],
      };

      mockedPost.mockResolvedValueOnce({
        data: {
          sucesso: true,
          mensagem: null,
          dados: responseData,
          timestamp: new Date().toISOString(),
        },
      } as never);

      const result = await createQuizForModuleWithBackend(moduleId, payload);

      expect(result.questions).toHaveLength(2);
      expect(result.questions[0].points).toBe(5);
      expect(result.questions[1].points).toBe(8);
    });

    it("propaga erro quando criação falha", async () => {
      const error = new Error("Module not found");
      mockedPost.mockRejectedValueOnce(error);

      await expect(
        createQuizForModuleWithBackend("invalid", { questions: [] }),
      ).rejects.toThrow("Module not found");
    });
  });

  describe("submitQuiz", () => {
    it("submete respostas e retorna resultado", async () => {
      const quizId = "1";
      const payload: SubmitQuizPayload = {
        answers: [
          { questionId: 1, selectedAlternativeId: 2 },
          { questionId: 2, selectedAlternativeId: 4 },
        ],
      };

      const result: QuizSubmissionResult = {
        score: 85,
        totalPoints: 100,
        passed: true,
        feedback: "Excelente desempenho!",
      };

      mockedPost.mockResolvedValueOnce({
        data: {
          sucesso: true,
          mensagem: null,
          dados: result,
          timestamp: new Date().toISOString(),
        },
      } as never);

      const response = await submitQuiz(quizId, payload);

      expect(mockedPost).toHaveBeenCalledWith(
        `/quizzes/${quizId}/submit`,
        payload,
      );
      expect(response).toEqual(result);
      expect(response.passed).toBe(true);
    });

    it("retorna falha quando pontuação insuficiente", async () => {
      const quizId = "2";
      const payload: SubmitQuizPayload = {
        answers: [{ questionId: 1, selectedAlternativeId: 1 }],
      };

      const result: QuizSubmissionResult = {
        score: 40,
        totalPoints: 100,
        passed: false,
        feedback: "Você precisa melhorar. Tente novamente.",
      };

      mockedPost.mockResolvedValueOnce({
        data: {
          sucesso: true,
          mensagem: null,
          dados: result,
          timestamp: new Date().toISOString(),
        },
      } as never);

      const response = await submitQuiz(quizId, payload);

      expect(response.passed).toBe(false);
      expect(response.score).toBe(40);
    });

    it("propaga erro quando submissão falha", async () => {
      const error = new Error("Quiz already submitted");
      mockedPost.mockRejectedValueOnce(error);

      await expect(submitQuiz("1", { answers: [] })).rejects.toThrow(
        "Quiz already submitted",
      );
    });
  });

  describe("generateQuizForModuleWithBackend", () => {
    it("gera perguntas automaticamente para um módulo", async () => {
      const moduleId = "1";
      const response: BackendGeneratedQuizResponse = {
        questions: [
          {
            id: null,
            statement: "Pergunta gerada 1",
            points: 10,
            orderNum: 1,
            alternatives: [
              { id: null, text: "Alternativa 1", correct: true },
              { id: null, text: "Alternativa 2", correct: false },
            ],
          },
        ],
      };

      mockedPost.mockResolvedValueOnce({
        data: {
          sucesso: true,
          mensagem: null,
          dados: response,
          timestamp: new Date().toISOString(),
        },
      } as never);

      const result = await generateQuizForModuleWithBackend(moduleId);

      expect(mockedPost).toHaveBeenCalledWith(
        `/modules/${moduleId}/quiz/gerar`,
      );
      expect(result.questions).toHaveLength(1);
    });
  });

  describe("regenerateQuizForModuleWithBackend", () => {
    it("regenera perguntas de um modulo", async () => {
      const moduleId = "2";
      const response: BackendGeneratedQuizResponse = {
        questions: [
          {
            id: null,
            statement: "Pergunta regenerada",
            points: 8,
            orderNum: 1,
            alternatives: [
              { id: null, text: "Alt 1", correct: false },
              { id: null, text: "Alt 2", correct: true },
            ],
          },
        ],
      };

      mockedPost.mockResolvedValueOnce({
        data: {
          sucesso: true,
          mensagem: null,
          dados: response,
          timestamp: new Date().toISOString(),
        },
      } as never);

      const result = await regenerateQuizForModuleWithBackend(moduleId);

      expect(mockedPost).toHaveBeenCalledWith(
        `/modules/${moduleId}/quiz/regerar`,
      );
      expect(result.questions).toHaveLength(1);
    });
  });

  describe("confirmQuizForModuleWithBackend", () => {
    it("confirma prova gerada para módulo", async () => {
      const moduleId = "3";
      const response: BackendConfirmedQuizResponse = {
        id: 3,
        moduleId: 3,
        showWrongAnswers: true,
        showCorrectAnswers: true,
        showPoints: true,
        questions: [
          {
            id: 1,
            statement: "Pergunta confirmada",
            points: 10,
            orderNum: 1,
            alternatives: [
              { id: 1, text: "Correta", correct: true },
              { id: 2, text: "Incorreta", correct: false },
            ],
          },
        ],
      };

      mockedPost.mockResolvedValueOnce({
        data: {
          sucesso: true,
          mensagem: null,
          dados: response,
          timestamp: new Date().toISOString(),
        },
      } as never);

      const result = await confirmQuizForModuleWithBackend(moduleId);

      expect(mockedPost).toHaveBeenCalledWith(
        `/modules/${moduleId}/quiz/confirmar`,
      );
      expect(result.id).toBe(3);
      expect(result.questions[0].id).toBe(1);
    });
  });
});

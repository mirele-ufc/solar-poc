import { apiClient } from "@/services/api";

export interface ApiResponse<T> {
  sucesso?: boolean;
  success?: boolean;
  mensagem?: string;
  message?: string;
  dados?: T;
  data?: T;
  timestamp?: string;
}

export interface QuizQuestionPayload {
  statement: string;
  points: number;
  alternatives: { text: string; correct: boolean }[];
}

export interface CreateQuizPayload {
  questions: QuizQuestionPayload[];
}

export const quizService = {
  async generateAIQuiz(moduleId: string) {
    const response = await apiClient.post<ApiResponse<unknown>>(
      `/modules/${moduleId}/quiz/gerar?quantidade=5`,
    );

    return response.data.dados || response.data.data || "";
  },

  async regenerateAIQuiz(moduleId: string) {
    const response = await apiClient.post<ApiResponse<unknown>>(
      `/modules/${moduleId}/quiz/regerar?quantidade=5`,
    );

    return response.data.dados || response.data.data || "";
  },

  async confirmAIQuiz(moduleId: string) {
    const response = await apiClient.post<ApiResponse<unknown>>(
      `/modules/${moduleId}/quiz/confirmar`,
    );

    return response.data.dados || response.data.data || "ok";
  },

  async createQuizWithQuestions(moduleId: string, payload: CreateQuizPayload) {
    const response = await apiClient.post<ApiResponse<unknown>>(
      `/modules/${moduleId}/quiz`,
      payload,
    );

    return response.data;
  },
};

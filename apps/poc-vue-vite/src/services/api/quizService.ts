import { apiClient } from '@/services/api'

export interface ApiResponse<T> {
  sucesso?: boolean
  success?: boolean
  mensagem?: string
  message?: string
  dados?: T
  data?: T
  timestamp?: string
}

export const quizService = {
  async generateAIQuiz(moduleId: string) {
    const response = await apiClient.post<ApiResponse<any>>(
      `/modules/${moduleId}/quiz/gerar`
    )

    return response.data.dados || response.data.data || ''
  },

  async regenerateAIQuiz(moduleId: string) {
    const response = await apiClient.post<ApiResponse<any>>(
      `/modules/${moduleId}/quiz/regerar`
    )

    return response.data.dados || response.data.data || ''
  },

  async confirmAIQuiz(moduleId: string) {
    const response = await apiClient.post<ApiResponse<any>>(
      `/modules/${moduleId}/quiz/confirmar`
    )

    return response.data.dados || response.data.data || 'ok'
  },

  async createQuizWithQuestions(moduleId: string, payload: any) {
    const response = await apiClient.post<ApiResponse<any>>(
      `/modules/${moduleId}/quiz`,
      payload
    )

    return response.data
  },
}
import { apiClient } from '@/services/api'

export interface Lesson {
  id: number
  name: string
  orderNum: number
  filePath: string | null
  fileType: string | null
  contentEditor: string | null
  contentGenerated: string | null
  moduleId: number
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T> {
  sucesso?: boolean
  success?: boolean
  mensagem?: string
  message?: string
  dados?: T
  data?: T
  timestamp?: string
}

export const lessonService = {
  async createLesson(
    moduleId: number,
    name: string,
    contentText: string,
    file: File | null
  ) {
    const formData = new FormData()

    if (file) {
      const dadosPayload = { name: name }
      formData.append('dados', JSON.stringify(dadosPayload))
      formData.append('arquivo', file)
    } else {
      const dadosPayload = { name: name, contentEditor: contentText }
      formData.append('dados', JSON.stringify(dadosPayload))
    }

    const response = await apiClient.post<ApiResponse<Lesson>>(
      `/modules/${moduleId}/lessons`,
      formData
    )

    return response.data.dados
  },

  async generateContent(lessonId: number): Promise<string> {
    const response = await apiClient.post<ApiResponse<string>>(
      `/lessons/${lessonId}/gerar-conteudo`
    )

    return response.data.dados || response.data.data || ''
  },

  async approveContent(lessonId: number, contentGenerated: string) {
    const response = await apiClient.put<ApiResponse<Lesson>>(
      `/lessons/${lessonId}/aprovar-conteudo`,
      { contentGenerated }
    )

    return response.data.dados
  },

  async regenerateContent(lessonId: number): Promise<string> {
    const response = await apiClient.post<ApiResponse<string>>(
      `/lessons/${lessonId}/regerar-conteudo`
    )

    return response.data.dados || response.data.data || ''
  },

  async confirmContent(lessonId: number) {
    const response = await apiClient.post<ApiResponse<Lesson>>(
      `/lessons/${lessonId}/confirmar-conteudo`
    )

    return response.data.dados
  },

  async getLessonsByModule(moduleId: number) {
    const response = await apiClient.get<ApiResponse<Lesson[]>>(
      `/modules/${moduleId}/lessons`
    )

    return response.data.dados || []
  },
}

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Erro HTTP ${response.status}`);
    }

    const data: ApiResponse<string> = await response.json();
    return data.dados || data.data || "";
  },

  async confirmContent(lessonId: number) {
    const response = await fetch(`${API_BASE_URL}/lessons/${lessonId}/confirmar-conteudo`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.mensagem || 'Erro ao confirmar o conteúdo da aula.');
    }

    const data = await response.json();
    return data.dados;
  },

  async getLessonsByModule(moduleId: number) {
    const response = await fetch(`${API_BASE_URL}/modules/${moduleId}/lessons`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status} ao buscar aulas`);
    }

    const data = await response.json();
    return data.dados || [];
  },
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export interface Lesson {
  id: number;
  name: string;
  orderNum: number;
  filePath: string | null;
  fileType: string | null;
  contentEditor: string | null;
  contentGenerated: string | null;
  moduleId: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  sucesso?: boolean;
  success?: boolean;
  mensagem?: string;
  message?: string;
  dados?: T;
  data?: T;
  timestamp?: string;
}

export const lessonService = {
  
  async createLesson(moduleId: number, name: string, contentText: string, file: File | null) {
    const formData = new FormData();

    if (file) {
      const dadosPayload = { name: name };
      formData.append('dados', JSON.stringify(dadosPayload));
      formData.append('arquivo', file);
    } else {
      const dadosPayload = { name: name, contentEditor: contentText };
      formData.append('dados', JSON.stringify(dadosPayload));
    }

    try {
     const response = await fetch(`${API_BASE_URL}/modules/${moduleId}/lessons`, {
     method: 'POST',
     body: formData 
    });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.mensagem || 'Erro ao criar a aula');
      }

      const responseData = await response.json();
      return responseData.dados; 
    } catch (error) { throw error }
  },

  async generateContent(lessonId: number): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/lessons/${lessonId}/gerar-conteudo`, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Erro HTTP ${response.status}`);
    }

    const data: ApiResponse<string> = await response.json();
    return data.dados || data.data || "";
  },

  async approveContent(lessonId: number, contentGenerated: string) {
    const response = await fetch(`${API_BASE_URL}/lessons/${lessonId}/aprovar-conteudo`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ contentGenerated })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.mensagem || 'Erro ao aprovar o conteúdo da aula.');
    }

    const data = await response.json();
    return data.dados;
  },

  async regenerateContent(lessonId: number): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/lessons/${lessonId}/regerar-conteudo`, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

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

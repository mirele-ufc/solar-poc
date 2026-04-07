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

export const moduleService = {
    async createModule(courseId: number, name: string) {
      const formData = new FormData();
      const dadosPayload = { name: name };

       formData.append('dados', JSON.stringify(dadosPayload));

      const response = await fetch(`${API_BASE_URL}/courses/${courseId}/modules`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const err = await response.json().catch(() => null);
        throw new Error(err?.mensagem || 'Erro ao criar módulo');
      }

      const data = await response.json();
      return data.dados; 
  }, 

  async getModulesByCourse(courseId: number) {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}/modules`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status} ao buscar módulos`);
    }

    const data = await response.json();
    return data.dados || []; 
  },
};

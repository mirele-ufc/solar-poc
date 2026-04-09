import { apiClient } from "@/services/api";

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
  async createLesson(
    moduleId: number,
    name: string,
    contentText: string,
    file: File | null,
  ) {
    const formData = new FormData();

    if (file) {
      const dadosPayload = { name: name };
      formData.append("dados", JSON.stringify(dadosPayload));
      formData.append("arquivo", file);
    } else {
      const dadosPayload = { name: name, contentEditor: contentText };
      formData.append("dados", JSON.stringify(dadosPayload));
    }

    const response = await apiClient.post<ApiResponse<Lesson>>(
      `/modules/${moduleId}/lessons`,
      formData,
    );

    return response.data.dados;
  },

  async generateContent(lessonId: number): Promise<string> {
    const response = await apiClient.post<ApiResponse<string>>(
      `/lessons/${lessonId}/generate-content`,
    );

    return response.data.dados || response.data.data || "";
  },

  async approveContent(lessonId: number, contentGenerated: string) {
    const response = await apiClient.put<ApiResponse<Lesson>>(
      `/lessons/${lessonId}/confirm-content`,
      { contentGenerated },
    );

    return response.data.dados;
  },

  async regenerateContent(lessonId: number): Promise<string> {
    const response = await apiClient.post<ApiResponse<string>>(
      `/lessons/${lessonId}/regenerate-content`,
    );

    return response.data.dados || response.data.data || "";
  },

  async confirmContent(lessonId: number) {
    const response = await apiClient.post<ApiResponse<Lesson>>(
      `/lessons/${lessonId}/confirm-content`,
    );

    return response.data.dados;
  },

  async getLessonsByModule(moduleId: number) {
    const response = await apiClient.get<ApiResponse<Lesson[]>>(
      `/modules/${moduleId}/lessons`,
    );

    return response.data.dados || [];
  },
};

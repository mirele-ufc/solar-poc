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

export const moduleService = {
  async createModule(courseId: number, name: string) {
    const formData = new FormData();
    const dadosPayload = { name: name };

    // Send dados as Blob with application/json type (matches React implementation)
    formData.append(
      "dados",
      new Blob([JSON.stringify(dadosPayload)], { type: "application/json" }),
    );

    const response = await apiClient.post<ApiResponse<unknown>>(
      `/courses/${courseId}/modules`,
      formData,
    );

    return response.data.dados;
  },

  async getModulesByCourse(courseId: number) {
    const response = await apiClient.get<ApiResponse<Lesson[]>>(
      `/courses/${courseId}/modules`,
    );

    return response.data.dados || [];
  },
};

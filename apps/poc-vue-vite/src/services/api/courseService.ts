import { apiClient } from "@/services/api";
import type { CourseInfoData } from "@/views/CreateCourseView.vue";

export interface Curso {
  id: number;
  title: string;
  category: string;
  description: string;
  imagePath: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  sucesso: boolean;
  mensagem: string;
  dados: T;
  timestamp: string;
}

export const courseService = {
  async getCourses(): Promise<Curso[]> {
    const response = await apiClient.get<ApiResponse<Curso[]>>("/courses");
    return response.data.dados || [];
  },

  async createCourse(courseData: CourseInfoData, file: File | null) {
    const formData = new FormData();

    const dadosJson = JSON.stringify({
      title: courseData.title,
      category: courseData.category,
      description: courseData.description,
    });

    formData.append("dados", dadosJson);

    if (file) {
      formData.append("imagem", file);
    }

    const response = await apiClient.post<ApiResponse<Curso>>(
      "/courses",
      formData,
    );
    return response.data;
  },
};

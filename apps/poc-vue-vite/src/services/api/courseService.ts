import { apiClient } from "@/services/api";
import type { CourseInfoData } from "@/views/CreateCourseView.vue";
// STRESS TEST: descomentar para gerar 1000 cursos mock (scroll/rendering)
// import { generateMockCourses } from "@/utils/generateMockCourses";

import { courseCreateFormSchema } from "@/validations/courseSchema";

export interface Curso {
  id: number;
  title: string;
  category: string;
  description: string;
  imagePath: string;
  createdAt: string;
  updatedAt: string;
}

export type BackendCourseResponse = Curso;

export interface ApiResponse<T> {
  sucesso: boolean;
  mensagem: string;
  dados: T;
  timestamp: string;
}

export const courseService = {
  async getCourses(): Promise<Curso[]> {
    // STRESS TEST: descomentar a linha abaixo e comentar as duas seguintes
    // return generateMockCourses(1000);
    const response = await apiClient.get<ApiResponse<Curso[]>>("/courses");
    return response.data.dados || [];
  },

  async getCourseById(courseId: string): Promise<BackendCourseResponse> {
    const response = await apiClient.get<ApiResponse<BackendCourseResponse>>(
      `/courses/${courseId}`,
    );
    return response.data.dados;
  },

  async createCourse(courseData: CourseInfoData, file: File | null) {
    await courseCreateFormSchema.parseAsync({
      title: courseData.title,
      description: courseData.description,
      category: courseData.category,
      hours: courseData.hours,
      requiredFields: courseData.requiredFields,
      coverFile: file || undefined,
    });

    const formData = new FormData();

    // Send dados as Blob with application/json type (matches React implementation)
    formData.append(
      "dados",
      new Blob(
        [
          JSON.stringify({
            title: courseData.title,
            category: courseData.category,
            description: courseData.description,
          }),
        ],
        { type: "application/json" },
      ),
    );

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

// Export função getCourseById seperadamente para compatibilidade com composables
export const getCourseById = courseService.getCourseById;

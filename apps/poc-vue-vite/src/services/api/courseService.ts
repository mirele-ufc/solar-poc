import type { CourseInfoData } from '@/views/CreateCourseView.vue';

import { createCourseSchema } from '@/validations/courseSchema';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

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
    const response = await fetch(`${API_BASE_URL}/courses`, {
      method: "GET",
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Erro HTTP ${response.status}`);
    }

    const data: ApiResponse<Curso[]> = await response.json();
    return data.dados || [];
  },

  async createCourse(courseData: CourseInfoData, file: File | null) {
    
    await createCourseSchema.parseAsync({
      title: courseData.title,
      description: courseData.description,
      category: courseData.category,
      hours: courseData.hours,
      requiredFields: courseData.requiredFields,
      coverFile: file || undefined, 
    });

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

    const response = await fetch(`${API_BASE_URL}/courses`, {
      method: "POST",
      body: formData,
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Erro HTTP ${response.status}`);
    }

    return response.json();
  }
};
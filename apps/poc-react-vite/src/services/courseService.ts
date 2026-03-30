import { apiClient } from "./api";
import type {
  ICourse,
  ICreateCoursePayload,
  IUpdateCoursePayload,
} from "@ava-poc/types";

// Paginated response type
type Page<T> = {
  content: T[];
  totalElements: number;
  totalPages?: number;
  size?: number;
  number?: number;
};

// 1. Listar cursos (paginado)
export async function fetchCourses(
  params: { page?: number; size?: number; status?: string } = {},
): Promise<Page<ICourse>> {
  const response = await apiClient.get("/cursos", { params });
  return response.data.data;
}

// 2. Buscar curso por ID
export async function fetchCourseById(id: string): Promise<ICourse> {
  const response = await apiClient.get(`/cursos/${id}`);
  return response.data.data;
}

// 3. Criar curso
export async function createCourse(
  payload: ICreateCoursePayload,
): Promise<ICourse> {
  const response = await apiClient.post("/cursos", payload);
  return response.data.data;
}

// 4. Atualizar curso
export async function updateCourse(
  id: string,
  payload: IUpdateCoursePayload,
): Promise<ICourse> {
  const response = await apiClient.put(`/cursos/${id}`, payload);
  return response.data.data;
}

// 5. Deletar curso
export async function deleteCourse(id: string): Promise<void> {
  await apiClient.delete(`/cursos/${id}`);
}

// 6. Alterar status do curso
export async function updateCourseStatus(
  id: string,
  status: "RASCUNHO" | "PUBLICADO" | "ARQUIVADO",
): Promise<ICourse> {
  const response = await apiClient.patch(`/cursos/${id}/status`, { status });
  return response.data.data;
}

// 7. Buscar cursos por texto
export async function searchCourses(q: string): Promise<ICourse[]> {
  const response = await apiClient.get("/cursos/buscar", { params: { q } });
  return response.data.data;
}

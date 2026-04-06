import { apiClient } from "./api";

type ApiEnvelope<T> = {
  sucesso: boolean;
  mensagem: string | null;
  dados: T;
  timestamp: string;
};

export type BackendLessonCreatePayload = {
  name: string;
  contentEditor?: string;
};

export type BackendLessonResponse = {
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
};

/**
 * Create a lesson using the backend contract for PoC (multipart/form-data).
 * - `dados`: JSON part with lesson name/contentEditor
 * - `arquivo`: optional PDF/video file
 */
export async function createLessonWithBackend(
  moduleId: string,
  payload: BackendLessonCreatePayload,
  file?: File,
): Promise<BackendLessonResponse> {
  const formData = new FormData();
  formData.append(
    "dados",
    new Blob([JSON.stringify(payload)], { type: "application/json" }),
  );

  if (file) {
    formData.append("arquivo", file);
  }

  const response = await apiClient.post<ApiEnvelope<BackendLessonResponse>>(
    `/modules/${moduleId}/lessons`,
    formData,
  );

  return response.data.dados;
}

import { apiClient } from "./api";

type ApiEnvelope<T> = {
  sucesso: boolean;
  mensagem: string | null;
  dados: T;
  timestamp: string;
};

export type BackendModuleCreatePayload = {
  name: string;
};

export type BackendModuleResponse = {
  id: number;
  name: string;
  orderNum: number;
  imagePath: string | null;
  courseId: number;
  createdAt: string;
  updatedAt: string;
};

/**
 * Create a module using the backend contract for PoC (multipart/form-data).
 * - `dados`: JSON part with the module name
 * - `imagem`: optional image file
 */
export async function createModuleWithBackend(
  courseId: string,
  payload: BackendModuleCreatePayload,
  imageFile?: File,
): Promise<BackendModuleResponse> {
  const formData = new FormData();
  formData.append(
    "dados",
    new Blob([JSON.stringify(payload)], { type: "application/json" }),
  );

  if (imageFile) {
    formData.append("imagem", imageFile);
  }

  const response = await apiClient.post<ApiEnvelope<BackendModuleResponse>>(
    `/courses/${courseId}/modules`,
    formData,
  );

  return response.data.dados;
}

"use server";

import axios from "axios";

import { z } from "zod";
import { registerSchema } from "../schemas/register.schema";

import { api } from "@/shared/lib/axios";

export type RegisterActionResult = {
  success: boolean;
  message: string;
  errors?: Record<string, any>;
  data?: any;
};

export async function registerAction(
  formData: FormData | Record<string, any>,
): Promise<RegisterActionResult> {
  const rawData =
    formData instanceof FormData
      ? Object.fromEntries(formData.entries())
      : formData;

  const validation = registerSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: "Falha na validação dos dados.",
      errors: z.treeifyError(validation.error),
    };
  }

  try {
    const response = await api.post("/auth/cadastro", validation.data);

    return {
      success: true,
      message: "Usuário registrado com sucesso!",
      data: response.data,
    };
  } catch (error: any) {
    console.error("Registration Action Error:", error.message);

    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        message:
          error.response.data?.message ||
          "Erro ao processar o registro no servidor externo.",
      };
    }

    return {
      success: false,
      message: "Ocorreu um erro inesperado. Tente novamente mais tarde.",
    };
  }
}

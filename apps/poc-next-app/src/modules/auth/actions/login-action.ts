"use server";

import { cookies } from "next/headers";

import axios from "axios";
import { z } from "zod";

import { loginSchema } from "../schemas/login.schema";
import { api } from "@/shared/lib/axios";

export type LoginActionResult = {
  success: boolean;
  message: string;
  errors?: Record<string, any>;
  data?: any;
};

export async function loginAction(
  formData: FormData | Record<string, any>,
): Promise<LoginActionResult> {
  const rawData =
    formData instanceof FormData
      ? Object.fromEntries(formData.entries())
      : formData;

  const validation = loginSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: "E-mail ou senha inválidos.",
      errors: z.treeifyError(validation.error),
    };
  }

  try {
    const response = await api.post("/auth/login", validation.data);
    const { accessToken, refreshToken } = response.data;

    const cookieStore = await cookies();

    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60, // 1 hour
    });

    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return {
      success: true,
      message: "Login realizado com sucesso!",
      data: response.data,
    };
  } catch (error: any) {
    console.error("Login Action Error:", error.message);

    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        message:
          error.response.data?.message ||
          "Credenciais inválidas ou erro no servidor.",
      };
    }

    return {
      success: false,
      message: "Ocorreu um erro inesperado. Tente novamente mais tarde.",
    };
  }
}

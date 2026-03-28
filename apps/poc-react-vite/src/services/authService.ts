import type { ILoginResponse, IUserSession } from "@ava-poc/types";
import { apiClient } from "./api";
import type {
  IRegisterPayload,
  IChangePasswordPayload,
  IMessageResponse,
  IRefreshResponse,
} from "./types/authService.types";

export const authService = {
  async login(emailOuUsuario: string, senha: string): Promise<ILoginResponse> {
    const response = await apiClient.post<ILoginResponse>("/auth/login", {
      email: emailOuUsuario,
      senha,
    });

    return response.data;
  },

  async register(payload: IRegisterPayload): Promise<ILoginResponse> {
    const response = await apiClient.post<ILoginResponse>(
      "/auth/cadastro",
      payload,
    );

    return response.data;
  },

  async requestPasswordReset(email: string): Promise<IMessageResponse> {
    const response = await apiClient.post<IMessageResponse>(
      "/auth/recuperar-senha",
      {
        email,
      },
    );

    return response.data;
  },

  async resetPassword(
    token: string,
    novaSenha: string,
  ): Promise<IMessageResponse> {
    const response = await apiClient.post<IMessageResponse>(
      "/auth/redefinir-senha",
      {
        token,
        novaSenha,
      },
    );

    return response.data;
  },

  async refreshAccessToken(refreshToken: string): Promise<IRefreshResponse> {
    const response = await apiClient.post<IRefreshResponse>("/auth/refresh", {
      refreshToken,
    });

    return response.data;
  },

  async getProfile(): Promise<IUserSession> {
    const response = await apiClient.get<IUserSession>("/perfil");

    return response.data;
  },

  async uploadProfilePhoto(file: File): Promise<IMessageResponse> {
    const formData = new FormData();
    formData.append("foto", file);

    const response = await apiClient.put<IMessageResponse>(
      "/perfil/foto",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  },

  async changePassword(
    payload: IChangePasswordPayload,
  ): Promise<IMessageResponse> {
    const response = await apiClient.put<IMessageResponse>(
      "/perfil/senha",
      payload,
    );

    return response.data;
  },
};

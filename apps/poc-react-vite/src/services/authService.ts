import type { ILoginResponse, IUserSession } from "@ava-poc/types";
import { apiClient } from "./api";
import type {
  IRegisterPayload,
  IChangePasswordPayload,
  IMessageResponse,
  IRefreshResponse,
} from "./types/authService.types";

type ApiEnvelope<T> = {
  data: T;
  message: string;
  status: number;
};

type BackendPerfil = "PROFESSOR" | "ALUNO" | "ADMIN";
type BackendStatus = "ATIVO" | "INATIVO";

type BackendPerfilResponse = {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  perfil: BackendPerfil;
  status: BackendStatus;
  fotoPerfil?: string | null;
};

function mapPerfilToRole(perfil: BackendPerfil): IUserSession["role"] {
  if (perfil === "PROFESSOR") return "professor";
  if (perfil === "ADMIN") return "admin";
  return "student";
}

function mapProfileResponse(profile: BackendPerfilResponse): IUserSession {
  return {
    id: String(profile.id),
    nome: profile.nome,
    cpf: profile.cpf,
    email: profile.email,
    fotoUrl: profile.fotoPerfil ?? undefined,
    role: mapPerfilToRole(profile.perfil),
    status: profile.status,
  };
}

export const authService = {
  async login(emailOuUsuario: string, senha: string): Promise<ILoginResponse> {
    const response = await apiClient.post<ApiEnvelope<ILoginResponse>>(
      "/auth/login",
      {
        email: emailOuUsuario,
        senha,
      },
    );

    return response.data.data;
  },

  async register(payload: IRegisterPayload): Promise<ILoginResponse> {
    const response = await apiClient.post<ApiEnvelope<ILoginResponse>>(
      "/auth/cadastro",
      payload,
    );

    return response.data.data;
  },

  async requestPasswordReset(email: string): Promise<IMessageResponse> {
    const response = await apiClient.post<ApiEnvelope<IMessageResponse>>(
      "/auth/recuperar-senha",
      {
        email,
      },
    );

    return response.data.data;
  },

  async resetPassword(
    token: string,
    novaSenha: string,
  ): Promise<IMessageResponse> {
    const response = await apiClient.post<ApiEnvelope<IMessageResponse>>(
      "/auth/redefinir-senha",
      {
        token,
        novaSenha,
      },
    );

    return response.data.data;
  },

  async refreshAccessToken(refreshToken: string): Promise<IRefreshResponse> {
    const response = await apiClient.post<ApiEnvelope<IRefreshResponse>>(
      "/auth/refresh",
      {
        refreshToken,
      },
    );

    return response.data.data;
  },

  async getProfile(): Promise<IUserSession> {
    const response =
      await apiClient.get<ApiEnvelope<BackendPerfilResponse>>("/perfil");

    return mapProfileResponse(response.data.data);
  },

  async uploadProfilePhoto(file: File): Promise<IMessageResponse> {
    const formData = new FormData();
    formData.append("foto", file);

    const response = await apiClient.patch<ApiEnvelope<IMessageResponse>>(
      "/perfil/foto",
      formData,
    );

    return response.data.data;
  },

  async changePassword(
    payload: IChangePasswordPayload,
  ): Promise<IMessageResponse> {
    const response = await apiClient.patch<ApiEnvelope<IMessageResponse>>(
      "/perfil/senha",
      payload,
    );

    return response.data.data;
  },
};

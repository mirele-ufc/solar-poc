import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuthStore } from "@/store/useAuthStore";
import type { IUserSession } from "@ava-poc/types";
import { apiClient } from "@/services/api";

function buildUser(role: IUserSession["role"]): IUserSession {
  if (role === "professor") {
    return {
      id: "prof-logout-test",
      nome: "Prof. Logout Test",
      cpf: "11111111111",
      email: "prof.logout@ufc.br",
      role,
      status: "ATIVO",
    };
  }

  return {
    id: "aluno-logout-test",
    nome: "Aluno Logout Test",
    cpf: "22222222222",
    email: "aluno.logout@ufc.br",
    role: "student",
    status: "ATIVO",
  };
}

describe("useAuthStore logout", () => {
  beforeEach(() => {
    useAuthStore.setState({
      currentUser: buildUser("professor"),
      isLoggedIn: true,
      sentMessages: [],
    });
  });

  it("limpa o estado de autenticacao local", () => {
    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.isLoggedIn).toBe(false);
    expect(state.currentUser).toBeNull();
  });

  it("nao dispara chamada de API de logout", () => {
    const requestSpy = vi.spyOn(apiClient, "request");

    useAuthStore.getState().logout();

    expect(requestSpy).not.toHaveBeenCalled();
  });
});

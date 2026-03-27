import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuthStore, type UserProfile } from "@/store/useAuthStore";
import { apiClient } from "@/services/api";

function buildUser(role: UserProfile["role"]): UserProfile {
  if (role === "professor") {
    return {
      id: "test-prof-001",
      nome: "Prof. Logout Test",
      cpf: "11111111111",
      email: "prof.logout@ufc.br",
      fotoUrl: undefined,
      role,
      status: "ATIVO",
    };
  }

  return {
    id: "test-student-001",
    nome: "Aluno Logout Test",
    cpf: "22222222222",
    email: "aluno.logout@ufc.br",
    fotoUrl: undefined,
    role,
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
    expect(state.currentUser.email).toBe("eduardo.marinho@ufc.br");
  });

  it("nao dispara chamada de API de logout", () => {
    const requestSpy = vi.spyOn(apiClient, "request");

    useAuthStore.getState().logout();

    expect(requestSpy).not.toHaveBeenCalled();
  });
});

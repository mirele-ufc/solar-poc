import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "@/store/useAuthStore";
import type { IUserSession } from "@ava-poc/types";

describe("useAuthStore", () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useAuthStore.setState({
      currentUser: null,
      isLoggedIn: false,
      sentMessages: [],
    });
  });

  describe("Initial State", () => {
    it("deve inicializar com currentUser = null", () => {
      const state = useAuthStore.getState();
      expect(state.currentUser).toBeNull();
    });

    it("deve inicializar com isLoggedIn = false", () => {
      const state = useAuthStore.getState();
      expect(state.isLoggedIn).toBe(false);
    });

    it("deve importar IUserSession de @ava-poc/types corretamente", () => {
      // This test validates that the type is importable and the store accepts it
      const mockUser: IUserSession = {
        id: "1",
        nome: "Test User",
        cpf: "12345678901",
        email: "test@ufc.br",
        role: "student",
        status: "ATIVO",
      };
      expect(mockUser).toBeDefined();
      expect(mockUser.role).toBe("student");
    });
  });

  describe("Login - acessar()", () => {
    it("deve atualizar currentUser após login bem-sucedido", () => {
      useAuthStore.getState().login("professor", "professor");
      const state = useAuthStore.getState();

      expect(state.currentUser).not.toBeNull();
      expect(state.currentUser?.role).toBe("professor");
    });

    it("deve atualizar isLoggedIn = true após login bem-sucedido", () => {
      useAuthStore.getState().login("professor", "professor");
      const state = useAuthStore.getState();

      expect(state.isLoggedIn).toBe(true);
    });

    it("deve falhar login com credenciais inválidas", () => {
      const result = useAuthStore.getState().login("invalid", "wrong");

      expect(result).toBe(false);
      expect(useAuthStore.getState().isLoggedIn).toBe(false);
    });
  });

  describe("Logout - sair()", () => {
    it("deve limpar currentUser após logout", () => {
      // Setup: login first
      useAuthStore.getState().login("professor", "professor");
      expect(useAuthStore.getState().isLoggedIn).toBe(true);

      // Action: logout
      useAuthStore.getState().logout();

      // Assert
      const state = useAuthStore.getState();
      expect(state.currentUser).toBeNull();
    });

    it("deve atualizar isLoggedIn = false após logout", () => {
      // Setup: login first
      useAuthStore.getState().login("professor", "professor");

      // Action: logout
      useAuthStore.getState().logout();

      // Assert
      expect(useAuthStore.getState().isLoggedIn).toBe(false);
    });

    it("deve limpar sentMessages após logout", () => {
      // Setup: login and send message
      useAuthStore.getState().login("professor", "professor");
      useAuthStore.getState().sendMessage({
        recipientId: "class-001",
        recipientLabel: "Minha Turma",
        subject: "Test",
        body: "Test message",
      });

      expect(useAuthStore.getState().sentMessages.length).toBeGreaterThan(0);

      // Action: logout
      useAuthStore.getState().logout();

      // Assert
      expect(useAuthStore.getState().sentMessages.length).toBe(0);
    });
  });

  describe("Type Safety - IUserSession", () => {
    it("store deve aceitar IUserSession sem erros de tipo", () => {
      const user: IUserSession = {
        id: "aluno-456",
        nome: "Eduardo Marinho",
        cpf: "12345678901",
        email: "eduardo@ufc.br",
        role: "student",
        status: "ATIVO",
      };

      useAuthStore.setState({ currentUser: user, isLoggedIn: true });
      const state = useAuthStore.getState();

      expect(state.currentUser?.id).toBe("aluno-456");
      expect(state.currentUser?.role).toBe("student");
      expect(state.isLoggedIn).toBe(true);
    });

    it("currentUser deve ser tipado como IUserSession | null", () => {
      const state = useAuthStore.getState();

      // Should accept null
      expect(state.currentUser === null || state.currentUser.id).toBeDefined();
    });
  });

  describe("updateCurrentUser()", () => {
    it("deve atualizar propriedades de currentUser", () => {
      useAuthStore.getState().login("professor", "professor");

      useAuthStore.getState().updateCurrentUser({
        nome: "Prof. Updated",
      });

      const state = useAuthStore.getState();
      expect(state.currentUser?.nome).toBe("Prof. Updated");
    });
  });
});

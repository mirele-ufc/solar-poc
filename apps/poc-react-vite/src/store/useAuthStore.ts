import { create } from "zustand";
import type { IUserSession, SentMessage } from "@ava-poc/types";

// Re-export types for external imports (tests, components)
export type UserProfile = IUserSession;
export type { SentMessage };

/**
 * Authentication store state and actions
 * Manages user login state, profile, and messaging
 *
 * ⚠️ SECURITY NOTE (Prototype):
 * Credentials are hardcoded for demo purposes only.
 * In production, ALL authentication must occur on the backend via HTTPS + HttpOnly cookies.
 * NEVER expose passwords or tokens in the JavaScript bundle.
 */
interface AuthStore {
  // State
  currentUser: IUserSession;
  sentMessages: SentMessage[];
  isLoggedIn: boolean;

  // Actions
  login: (username: string, password: string) => boolean;
  logout: () => void;
  updateCurrentUser: (partial: Partial<IUserSession>) => void;
  sendMessage: (msg: Omit<SentMessage, "id" | "sentAt">) => void;
}

type AuthStoreSnapshot = Pick<AuthStore, "currentUser" | "isLoggedIn">;

/**
 * Hardcoded credentials for prototype demonstration
 * Maps username to password and user profile
 *
 * ⚠️ PROTOTYPE ONLY:
 * In production, authentication must be backend-driven with secure token management.
 */
const CREDENTIALS: Record<string, { password: string; profile: IUserSession }> =
  {
    professor: {
      password: "professor",
      profile: {
        id: "user-professor-001",
        nome: "Prof. Eduardo Silva",
        cpf: "98765432100",
        email: "professor@ufc.br",
        fotoUrl: undefined,
        role: "professor",
        status: "ATIVO",
      },
    },
    estudante: {
      password: "estudante",
      profile: {
        id: "user-student-001",
        nome: "Eduardo Marinho",
        cpf: "12345678901",
        email: "eduardo.marinho@ufc.br",
        fotoUrl: undefined,
        role: "student",
        status: "ATIVO",
      },
    },
  };

/**
 * Default user profile when not logged in
 * Uses student credentials as default
 */
const DEFAULT_USER: IUserSession = CREDENTIALS.estudante.profile;

/**
 * Mock messages for prototype demonstration
 *
 * ⚠️ PROTOTYPE: In production, messages are fetched from backend API
 */
const MOCK_MESSAGES: SentMessage[] = [
  {
    id: "msg-001",
    recipientId: "power-bi",
    recipientLabel: "Alunos de Power BI - Fundamentos",
    subject: "Bem-vindos ao curso de Power BI!",
    body: "Olá a todos! Seja muito bem-vindos ao curso de Power BI - Fundamentos. Nas próximas semanas exploraremos juntos as principais funcionalidades dessa poderosa ferramenta de Business Intelligence. Qualquer dúvida, estou à disposição.",
    sentAt: "2026-03-10T09:00:00.000Z",
  },
  {
    id: "msg-002",
    recipientId: "all",
    recipientLabel: "Alunos de todos os cursos",
    subject: "Aviso: Manutenção do sistema SOLAR",
    body: "Informamos que o sistema SOLAR passará por manutenção programada neste sábado, das 08h às 12h. Durante esse período o acesso estará temporariamente indisponível. Pedimos desculpas pelo inconveniente.",
    sentAt: "2026-03-08T14:30:00.000Z",
  },
  {
    id: "msg-003",
    recipientId: "power-bi",
    recipientLabel: "Alunos de Power BI - Fundamentos",
    subject: "Material complementar — Módulo 02",
    body: "Disponibilizei na plataforma um material complementar sobre Power Query que irá ajudá-los na prática do Módulo 02. Aproveitem para revisar os conceitos antes da prova. Bons estudos!",
    sentAt: "2026-03-05T11:15:00.000Z",
  },
];

/**
 * Zustand authentication store
 * Manages user profile, authentication state, and messages
 *
 * Usage:
 * const { currentUser, login, logout } = useAuthStore();
 */
export const useAuthStore = create<AuthStore>((set) => ({
  currentUser: DEFAULT_USER,
  sentMessages: MOCK_MESSAGES,
  isLoggedIn: false,

  /**
   * Authenticate user with username and password
   * For prototype: validates against hardcoded credentials
   * In production: should be a backend API call via secure channel
   *
   * @param username - Username key to look up in credentials
   * @param password - Password to validate
   * @returns true if login successful, false otherwise
   */
  login: (username: string, password: string): boolean => {
    const entry = CREDENTIALS[username.toLowerCase()];
    if (entry && entry.password === password) {
      set((state) => ({
        ...state,
        currentUser: { ...entry.profile },
        isLoggedIn: true,
      }));
      return true;
    }
    return false;
  },

  /**
   * Logout current user
   * Resets to default user state
   */
  logout: () => {
    set({
      currentUser: DEFAULT_USER,
      isLoggedIn: false,
      sentMessages: MOCK_MESSAGES,
    });
  },

  /**
   * Update current user profile with partial data
   *
   * @param partial - Partial user profile to merge with current user
   */
  updateCurrentUser: (partial: Partial<IUserSession>) => {
    set((state) => ({
      currentUser: { ...state.currentUser, ...partial },
    }));
  },

  /**
   * Send a message to recipients
   * Creates a new message with timestamp and unique ID
   *
   * @param msg - Message data without id and sentAt
   */
  sendMessage: (msg: Omit<SentMessage, "id" | "sentAt">) => {
    const newMessage: SentMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      sentAt: new Date().toISOString(),
    };

    set((state) => ({
      sentMessages: [newMessage, ...state.sentMessages],
    }));
  },
}));

export function selectCanManageCourses(state: AuthStoreSnapshot): boolean {
  return state.currentUser.role === "professor";
}

export function selectCurrentUser(state: AuthStoreSnapshot): IUserSession {
  return state.currentUser;
}

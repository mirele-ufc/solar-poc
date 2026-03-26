import { create } from "zustand";
import type { IUserSession, SentMessage } from "@ava-poc/types";

// Re-export types for external imports (tests, components)
export type { IUserSession, SentMessage };

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
  currentUser: IUserSession | null;
  sentMessages: SentMessage[];
  isLoggedIn: boolean;

  // Actions
  login: (username: string, password: string) => boolean;
  logout: () => void;
  updateCurrentUser: (partial: Partial<IUserSession>) => void;
  sendMessage: (msg: Omit<SentMessage, "id" | "sentAt">) => void;
}

/**
 * Type alias for store snapshot (used in selectors)
 */
type AuthStoreSnapshot = {
  currentUser: IUserSession | null;
  isLoggedIn: boolean;
};

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
        id: "prof-001",
        name: "Prof. Eduardo Silva",
        cpf: "98765432100",
        email: "professor@ufc.br",
        photoUrl: undefined,
        role: "professor",
        status: "ATIVO",
      },
    },
    estudante: {
      password: "estudante",
      profile: {
        id: "student-001",
        name: "Eduardo Marinho",
        cpf: "12345678901",
        email: "eduardo.marinho@ufc.br",
        photoUrl: undefined,
        role: "student",
        status: "ATIVO",
      },
    },
  };

/**
 * Initial state when user is not logged in
 * currentUser is null until user successfully authenticates
 */
const INITIAL_STATE = {
  currentUser: null as IUserSession | null,
  sentMessages: [] as SentMessage[],
  isLoggedIn: false,
};

/**
 * Zustand authentication store
 * Manages user profile, authentication state, and messages
 *
 * Usage:
 * const { currentUser, login, logout } = useAuthStore();
 */
/**
 * Zustand authentication store
 * Manages user profile, authentication state, and messages
 *
 * Usage:
 * const { currentUser, login, logout } = useAuthStore();
 */
export const useAuthStore = create<AuthStore>((set) => ({
  ...INITIAL_STATE,

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
   * Clears authentication state completely
   * - Sets currentUser to null
   * - Sets isLoggedIn to false
   * - Clears sentMessages array
   */
  logout: () => {
    set({
      ...INITIAL_STATE,
    });
  },

  /**
   * Update current user profile with partial data
   *
   * @param partial - Partial user profile to merge with current user
   */
  updateCurrentUser: (partial: Partial<IUserSession>) => {
    set((state) => ({
      currentUser: state.currentUser
        ? { ...state.currentUser, ...partial }
        : null,
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
  return state.currentUser?.role === "professor" || false;
}

export function selectCurrentUser(
  state: AuthStoreSnapshot,
): IUserSession | null {
  return state.currentUser;
}

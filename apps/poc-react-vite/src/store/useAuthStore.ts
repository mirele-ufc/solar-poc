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
  currentUser: IUserSession | null;
  sentMessages: SentMessage[];
  isLoggedIn: boolean;
  token: string | null;
  refreshToken: string | null;

  // Actions
  login: (username: string, password: string) => boolean;
  logout: () => void;
  setCurrentUser: (user: IUserSession | null) => void;
  updateCurrentUser: (partial: Partial<IUserSession>) => void;
  setTokens: (token: string | null, refreshToken?: string | null) => void;
  sendMessage: (msg: Omit<SentMessage, "id" | "sentAt">) => void;
}

/**
 * Type alias for store snapshot (used in selectors)
 */
type AuthStoreSnapshot = {
  currentUser: IUserSession | null;
  isLoggedIn: boolean;
};

type MockUserCredential = {
  identifiers: string[];
  password: string;
  profile: IUserSession;
};

/**
 * Mock users for local authentication without backend/database.
 */
const MOCK_USERS: MockUserCredential[] = [
  {
    identifiers: ["professor", "professor@ufc.br", "prof_teste"],
    password: "senha123",
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
  {
    identifiers: ["estudante", "aluno", "aluno@ufc.br"],
    password: "senha123",
    profile: {
      id: "user-student-001",
      nome: "Eduardo Marinho",
      cpf: "12345678901",
      email: "aluno@ufc.br",
      fotoUrl: undefined,
      role: "student",
      status: "ATIVO",
    },
  },
];

const INITIAL_STATE: Pick<
  AuthStore,
  "currentUser" | "isLoggedIn" | "sentMessages" | "token" | "refreshToken"
> = {
  currentUser: null,
  isLoggedIn: false,
  sentMessages: [],
  token: null,
  refreshToken: null,
};

/**
 * Load authentication state from localStorage
 * Restores user session across page reloads
 */
const loadAuthFromStorage = (): Pick<
  AuthStore,
  "currentUser" | "isLoggedIn"
> => {
  try {
    const stored = localStorage.getItem("auth-state");
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        currentUser: parsed.currentUser || null,
        isLoggedIn: parsed.isLoggedIn || false,
      };
    }
  } catch (error) {
    console.warn("Failed to load auth from localStorage:", error);
  }
  return { currentUser: null, isLoggedIn: false };
};

/**
 * Save authentication state to localStorage
 * Persists user session across page reloads
 */
const saveAuthToStorage = (
  isLoggedIn: boolean,
  currentUser: IUserSession | null,
) => {
  try {
    localStorage.setItem(
      "auth-state",
      JSON.stringify({ isLoggedIn, currentUser }),
    );
  } catch (error) {
    console.warn("Failed to save auth to localStorage:", error);
  }
};

/**
 * Zustand authentication store
 * Manages user profile, authentication state, and messages
 *
 * Usage:
 * const { currentUser, login, logout } = useAuthStore();
 */
export const useAuthStore = create<AuthStore>((set) => {
  // Load persisted auth state on store initialization
  const persistedAuth = loadAuthFromStorage();

  return {
    ...INITIAL_STATE,
    ...persistedAuth,

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
      const normalizedIdentifier = username.trim().toLowerCase();
      const entry = MOCK_USERS.find(
        (user) =>
          user.identifiers.includes(normalizedIdentifier) &&
          user.password === password,
      );

      if (entry) {
        const newUser = { ...entry.profile };
        set((state) => ({
          ...state,
          currentUser: newUser,
          isLoggedIn: true,
        }));
        // Persist login to localStorage
        saveAuthToStorage(true, newUser);
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
     * - Clears localStorage
     */
    logout: () => {
      set({
        ...INITIAL_STATE,
      });
      saveAuthToStorage(false, null);
      // Nunca força navegação. O componente decide o redirect se necessário.
    },

    setCurrentUser: (user: IUserSession | null) => {
      set({
        currentUser: user,
        isLoggedIn: Boolean(user),
      });
    },

    /**
     * Update current user profile with partial data
     * Persists changes to localStorage
     *
     * @param partial - Partial user profile to merge with current user
     */
    updateCurrentUser: (partial: Partial<IUserSession>) => {
      set((state) => {
        const updated = state.currentUser
          ? { ...state.currentUser, ...partial }
          : null;
        if (state.isLoggedIn && updated) {
          saveAuthToStorage(true, updated);
        }
        return {
          currentUser: updated,
        };
      });
    },

    /**
     * Set JWT tokens for authenticated requests
     * Stores access token and optional refresh token in state
     *
     * @param token - JWT access token from backend
     * @param refreshToken - Optional refresh token for token renewal
     */
    setTokens: (token: string | null, refreshToken?: string | null) => {
      set({
        token,
        refreshToken: refreshToken ?? null,
      });
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
  };
});

export function selectCanManageCourses(state: AuthStoreSnapshot): boolean {
  return state.currentUser?.role === "professor" || false;
}

export function selectCurrentUser(
  state: AuthStoreSnapshot,
): IUserSession | null {
  return state.currentUser;
}

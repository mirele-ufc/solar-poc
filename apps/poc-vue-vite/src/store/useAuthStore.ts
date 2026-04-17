import { defineStore } from "pinia";
import { ref } from "vue";

export interface UserProfile {
  name: string;
  cpf: string;
  email: string;
  photoUrl: string | null;
  role: "professor" | "student";
  password?: string;
}

export interface SentMessage {
  id: string;
  recipientId: string;
  recipientLabel: string;
  subject: string;
  body: string;
  sentAt: string;
}

const CREDENTIALS: Record<string, { password: string; profile: UserProfile }> =
  {
    professor: {
      password: "professor",
      profile: {
        name: "Prof. Eduardo Silva",
        cpf: "98765432100",
        email: "professor@ufc.br",
        photoUrl: null,
        role: "professor",
      },
    },
    estudante: {
      password: "estudante",
      profile: {
        name: "Mario Marinho",
        cpf: "12345678901",
        email: "eduardo.marinho@ufc.br",
        photoUrl: null,
        role: "student",
      },
    },
  };

const DEFAULT_USER: UserProfile = CREDENTIALS.estudante.profile;

const MOCK_MESSAGES: SentMessage[] = [
  {
    id: "msg-001",
    recipientId: "power-bi",
    recipientLabel: "Alunos de Power BI - Fundamentos",
    subject: "Bem-vindos ao curso de Power BI!",
    body: "Olá a todos! Seja muito bem-vindos...",
    sentAt: "2026-03-10T09:00:00.000Z",
  },
  // ... outros mocks se desejar manter
];

// Funções auxiliares para persistência
const loadAuthFromStorage = (): {
  isAuthenticated: boolean;
  user: UserProfile;
} => {
  const stored = localStorage.getItem("auth-state");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return {
        isAuthenticated: parsed.isAuthenticated || false,
        user: parsed.user || DEFAULT_USER,
      };
    } catch {
      return { isAuthenticated: false, user: DEFAULT_USER };
    }
  }
  return { isAuthenticated: false, user: DEFAULT_USER };
};

const saveAuthToStorage = (isAuthenticated: boolean, user: UserProfile) => {
  localStorage.setItem("auth-state", JSON.stringify({ isAuthenticated, user }));
};

// useAuthStore.ts
export const useAuthStore = defineStore("auth", () => {
  const storedAuth = loadAuthFromStorage();
  const currentUser = ref<UserProfile>(storedAuth.user);
  const sentMessages = ref<SentMessage[]>(MOCK_MESSAGES);
  const isAuthenticated = ref(storedAuth.isAuthenticated);
  const token = ref<string | null>(null);
  const refreshToken = ref<string | null>(null);

  function login(username: string, password: string): boolean {
    const entry = CREDENTIALS[username.toLowerCase()];
    if (entry && entry.password === password) {
      currentUser.value = { ...entry.profile };
      isAuthenticated.value = true;
      saveAuthToStorage(true, currentUser.value);
      return true;
    }
    return false;
  }

  function logout() {
    currentUser.value = DEFAULT_USER;
    isAuthenticated.value = false;
    token.value = null;
    refreshToken.value = null;
    sentMessages.value = [...MOCK_MESSAGES];
    saveAuthToStorage(false, DEFAULT_USER);
  }

  function updateCurrentUser(data: Partial<UserProfile>) {
    currentUser.value = { ...currentUser.value, ...data };
    // Salva a atualização no localStorage se o usuário está autenticado
    if (isAuthenticated.value) {
      saveAuthToStorage(true, currentUser.value);
    }
  }

  function sendMessage(message: Omit<SentMessage, "id" | "sentAt">) {
    const newMessage: SentMessage = {
      ...message,
      id: `msg-${Date.now()}`,
      sentAt: new Date().toISOString(),
    };
    sentMessages.value.push(newMessage);
  }

  function setTokens(newToken: string | null, newRefreshToken?: string | null) {
    token.value = newToken;
    refreshToken.value = newRefreshToken ?? null;
  }

  return {
    currentUser,
    sentMessages,
    isAuthenticated,
    token,
    refreshToken,
    login,
    logout,
    setTokens,
    updateCurrentUser,
    sendMessage,
  };
});

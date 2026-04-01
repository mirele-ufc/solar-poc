import { create } from 'zustand';
import type { User } from '@/types'; 

/**
 * Store de Autenticação (Zustand)
 * Gerencia: usuário logado, token, estado de autenticação
 * Alinhado com RNF20 (SOLID — separar estado de UI)
 */

interface AuthStore {
  // Estado
  usuario: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  acessar: (usuario: User, token: string) => void;
  sair: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Seletores derivados
  estaAutenticado: () => boolean;
  isProfessor: () => boolean;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Estado inicial
  usuario: null,
  token: null,
  isLoading: false,
  error: null,

  // Ação: Acessar (login bem-sucedido)
  acessar: (usuario: User, token: string) => {
    set({
      usuario,
      token,
      isLoading: false,
      error: null,
    });
  },

  // Ação: Sair (logout)
  sair: () => {
    set({
      usuario: null,
      token: null,
      isLoading: false,
      error: null,
    });
  },

  // Ação: Atualizar estado de loading
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  // Ação: Atualizar estado de erro
  setError: (error: string | null) => {
    set({ error });
  },

  // Seletor: Verificar se está autenticado
  estaAutenticado: () => {
    const { usuario, token } = get();
    return usuario !== null && token !== null;
  },

  // Seletor: Verificar se é professor
  isProfessor: () => {
    const { usuario } = get();
    return usuario?.perfil === 'PROFESSOR';
  },

  // Seletor: Verificar se é admin
  isAdmin: () => {
    const { usuario } = get();
    return usuario?.perfil === 'ADMIN';
  },
}));

/**
 * Hook customizado para extrair informações de autenticação
 * Uso: const { usuario, estaAutenticado } = useAuthInfo();
 */
export const useAuthInfo = () => {
  const usuario = useAuthStore((state) => state.usuario);
  const estaAutenticado = useAuthStore((state) => state.estaAutenticado());
  const isProfessor = useAuthStore((state) => state.isProfessor());
  const isAdmin = useAuthStore((state) => state.isAdmin());

  return {
    usuario,
    estaAutenticado,
    isProfessor,
    isAdmin,
  };
};

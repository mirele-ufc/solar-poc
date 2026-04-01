import { create } from 'zustand';
import type { Course, Module } from '@/types';

/**
 * Store de Cursos (Zustand)
 * Gerencia: lista de cursos, curso selecionado, estado de loading
 * Alinhado com RNF20 (SOLID)
 */

interface CourseStore {
  // Estado
  cursos: Course[];
  cursosLoading: boolean;
  cursosError: string | null;
  cursoSelecionado: Course | null;

  // Actions
  setCursos: (cursos: Course[]) => void;
  setCursosLoading: (loading: boolean) => void;
  setCursosError: (error: string | null) => void;
  selectCurso: (curso: Course) => void;
  deselectCurso: () => void;

  // Ação: Adicionar ou atualizar curso na lista
  upsertCurso: (curso: Course) => void;
  removeCurso: (id: string) => void;
}

export const useCourseStore = create<CourseStore>((set, get) => ({
  cursos: [],
  cursosLoading: false,
  cursosError: null,
  cursoSelecionado: null,

  setCursos: (cursos: Course[]) => {
    set({ cursos, cursosLoading: false, cursosError: null });
  },

  setCursosLoading: (loading: boolean) => {
    set({ cursosLoading: loading });
  },

  setCursosError: (error: string | null) => {
    set({ cursosError: error });
  },

  selectCurso: (curso: Course) => {
    set({ cursoSelecionado: curso });
  },

  deselectCurso: () => {
    set({ cursoSelecionado: null });
  },

  upsertCurso: (curso: Course) => {
    const { cursos } = get();
    const exists = cursos.find((c) => c.id === curso.id);

    if (exists) {
      // Atualizar
      set({
        cursos: cursos.map((c) => (c.id === curso.id ? curso : c)),
      });
    } else {
      // Adicionar
      set({ cursos: [...cursos, curso] });
    }
  },

  removeCurso: (id: string) => {
    const { cursos, cursoSelecionado } = get();
    set({
      cursos: cursos.filter((c) => c.id !== id),
      cursoSelecionado:
        cursoSelecionado?.id === id ? null : cursoSelecionado,
    });
  },
}));

/**
 * Store de Módulos (Zustand)
 * Gerencia: módulos do curso selecionado
 */

interface ModuleStore {
  modulos: Module[];
  modulosLoading: boolean;
  modulosError: string | null;
  moduloSelecionado: Module | null;

  setModulos: (modulos: Module[]) => void;
  setModulosLoading: (loading: boolean) => void;
  setModulosError: (error: string | null) => void;
  selectModulo: (modulo: Module) => void;
  deselectModulo: () => void;
  upsertModulo: (modulo: Module) => void;
  removeModulo: (id: string) => void;
}

export const useModuleStore = create<ModuleStore>((set, get) => ({
  modulos: [],
  modulosLoading: false,
  modulosError: null,
  moduloSelecionado: null,

  setModulos: (modulos: Module[]) => {
    set({ modulos, modulosLoading: false, modulosError: null });
  },

  setModulosLoading: (loading: boolean) => {
    set({ modulosLoading: loading });
  },

  setModulosError: (error: string | null) => {
    set({ modulosError: error });
  },

  selectModulo: (modulo: Module) => {
    set({ moduloSelecionado: modulo });
  },

  deselectModulo: () => {
    set({ moduloSelecionado: null });
  },

  upsertModulo: (modulo: Module) => {
    const { modulos } = get();
    const exists = modulos.find((m) => m.id === modulo.id);

    if (exists) {
      set({
        modulos: modulos.map((m) => (m.id === modulo.id ? modulo : m)),
      });
    } else {
      set({ modulos: [...modulos, modulo] });
    }
  },

  removeModulo: (id: string) => {
    const { modulos, moduloSelecionado } = get();
    set({
      modulos: modulos.filter((m) => m.id !== id),
      moduloSelecionado:
        moduloSelecionado?.id === id ? null : moduloSelecionado,
    });
  },
}));

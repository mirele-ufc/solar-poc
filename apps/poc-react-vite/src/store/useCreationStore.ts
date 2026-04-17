import { create } from "zustand";

/**
 * Tipos para persistência de dados de criação
 */

export type CourseCreationData = {
  backendCourseId?: string;
  image: string | null;
  title: string;
  description: string;
  category: string;
  hours: string;
  requiredFields: string[];
};

export type LessonData = {
  id: string;
  backendLessonId?: string;
  name: string;
  file: string | null;
  fileBlob?: File;
  contentEditor?: string | null;
};

export type ModuleData = {
  id: string;
  backendModuleId?: string;
  name: string;
  image: string | null;
  lessons: LessonData[];
};

export type QuestionData = {
  id: string;
  text: string;
  type: "multiple" | "true_false" | "open";
  correctAnswer: string;
  alternatives?: Array<{
    id: string;
    text: string;
  }>;
  points?: number;
};

export type ExamData = {
  questions: QuestionData[];
};

/**
 * State da criação
 */
interface CreationStore {
  // Course Data
  courseData: CourseCreationData | null;
  setCourseData: (data: CourseCreationData) => void;
  clearCourseData: () => void;
  updateCourseData: (partial: Partial<CourseCreationData>) => void;

  // Modules Data
  modules: ModuleData[];
  setModules: (modules: ModuleData[]) => void;
  addModule: (module: ModuleData) => void;
  updateModule: (moduleId: string, partial: Partial<ModuleData>) => void;
  removeModule: (moduleId: string) => void;
  clearModules: () => void;

  // Exam Data
  currentExam: ExamData | null;
  setExam: (exam: ExamData) => void;
  addQuestion: (question: QuestionData) => void;
  updateQuestion: (questionId: string, partial: Partial<QuestionData>) => void;
  removeQuestion: (questionId: string) => void;
  clearExam: () => void;

  // Utility methods
  clearAllCreationData: () => void;
}

const STORAGE_KEYS = {
  COURSE: "creation-course-data",
  MODULES: "creation-modules-data",
  EXAM: "creation-exam-data",
};

/**
 * Load course data from localStorage
 */
const loadCourseData = (): CourseCreationData | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.COURSE);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn("Failed to load course data from localStorage:", error);
  }
  return null;
};

/**
 * Save course data to localStorage
 */
const saveCourseData = (data: CourseCreationData | null) => {
  try {
    if (data) {
      localStorage.setItem(STORAGE_KEYS.COURSE, JSON.stringify(data));
    } else {
      localStorage.removeItem(STORAGE_KEYS.COURSE);
    }
  } catch (error) {
    console.warn("Failed to save course data to localStorage:", error);
  }
};

/**
 * Load modules data from localStorage
 * ⚠️ Note: File blobs are not serializable to JSON, so they're stored separately
 */
const loadModulesData = (): ModuleData[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.MODULES);
    if (stored) {
      const data = JSON.parse(stored);
      return data || [];
    }
  } catch (error) {
    console.warn("Failed to load modules data from localStorage:", error);
  }
  return [];
};

/**
 * Save modules data to localStorage
 * ⚠️ Note: File blobs are stripped before serialization
 */
const saveModulesData = (modules: ModuleData[]) => {
  try {
    if (modules.length === 0) {
      localStorage.removeItem(STORAGE_KEYS.MODULES);
      return;
    }
    const dataToSave = modules.map((module) => ({
      ...module,
      lessons: module.lessons.map((lesson) => ({
        id: lesson.id,
        backendLessonId: lesson.backendLessonId,
        name: lesson.name,
        file: lesson.file,
        contentEditor: lesson.contentEditor,
        // ⚠️ fileBlob is intentionally excluded as it's not serializable
      })),
    }));
    localStorage.setItem(STORAGE_KEYS.MODULES, JSON.stringify(dataToSave));
  } catch (error) {
    console.warn("Failed to save modules data to localStorage:", error);
  }
};

/**
 * Load exam data from localStorage
 */
const loadExamData = (): ExamData | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.EXAM);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn("Failed to load exam data from localStorage:", error);
  }
  return null;
};

/**
 * Save exam data to localStorage
 */
const saveExamData = (exam: ExamData | null) => {
  try {
    if (exam && exam.questions.length > 0) {
      localStorage.setItem(STORAGE_KEYS.EXAM, JSON.stringify(exam));
    } else {
      localStorage.removeItem(STORAGE_KEYS.EXAM);
    }
  } catch (error) {
    console.warn("Failed to save exam data to localStorage:", error);
  }
};

/**
 * Zustand store para persistência de dados de criação (cursos, módulos, provas)
 *
 * Usage:
 * const { courseData, setCourseData } = useCreationStore();
 */
export const useCreationStore = create<CreationStore>((set) => {
  // Load persisted data on store initialization
  const initialCourse = loadCourseData();
  const initialModules = loadModulesData();
  const initialExam = loadExamData();

  return {
    // Initial state
    courseData: initialCourse,
    modules: initialModules,
    currentExam: initialExam,

    // Course actions
    setCourseData: (data) => {
      set({ courseData: data });
      saveCourseData(data);
    },

    clearCourseData: () => {
      set({ courseData: null });
      saveCourseData(null);
    },

    updateCourseData: (partial) => {
      set((state) => {
        const updated = state.courseData
          ? { ...state.courseData, ...partial }
          : null;
        if (updated) {
          saveCourseData(updated);
        }
        return { courseData: updated };
      });
    },

    // Modules actions
    setModules: (modules) => {
      set({ modules });
      saveModulesData(modules);
    },

    addModule: (module) => {
      set((state) => {
        const updated = [...state.modules, module];
        saveModulesData(updated);
        return { modules: updated };
      });
    },

    updateModule: (moduleId, partial) => {
      set((state) => {
        const updated = state.modules.map((m) =>
          m.id === moduleId ? { ...m, ...partial } : m,
        );
        saveModulesData(updated);
        return { modules: updated };
      });
    },

    removeModule: (moduleId) => {
      set((state) => {
        const updated = state.modules.filter((m) => m.id !== moduleId);
        saveModulesData(updated);
        return { modules: updated };
      });
    },

    clearModules: () => {
      set({ modules: [] });
      saveModulesData([]);
    },

    // Exam actions
    setExam: (exam) => {
      set({ currentExam: exam });
      saveExamData(exam);
    },

    addQuestion: (question) => {
      set((state) => {
        if (!state.currentExam) {
          return { currentExam: { questions: [question] } };
        }
        const updated = {
          questions: [...state.currentExam.questions, question],
        };
        saveExamData(updated);
        return { currentExam: updated };
      });
    },

    updateQuestion: (questionId, partial) => {
      set((state) => {
        if (!state.currentExam) return state;
        const updated = {
          questions: state.currentExam.questions.map((q) =>
            q.id === questionId ? { ...q, ...partial } : q,
          ),
        };
        saveExamData(updated);
        return { currentExam: updated };
      });
    },

    removeQuestion: (questionId) => {
      set((state) => {
        if (!state.currentExam) return state;
        const updated = {
          questions: state.currentExam.questions.filter(
            (q) => q.id !== questionId,
          ),
        };
        saveExamData(updated.questions.length > 0 ? updated : null);
        return {
          currentExam: updated.questions.length > 0 ? updated : null,
        };
      });
    },

    clearExam: () => {
      set({ currentExam: null });
      saveExamData(null);
    },

    // Utility methods
    clearAllCreationData: () => {
      set({
        courseData: null,
        modules: [],
        currentExam: null,
      });
      saveCourseData(null);
      saveModulesData([]);
      saveExamData(null);
    },
  };
});

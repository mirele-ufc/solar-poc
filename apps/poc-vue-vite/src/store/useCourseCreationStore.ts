import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface CourseCreationData {
  image: string | null;
  title: string;
  description: string;
  category: string;
  hours: string;
  requiredFields: string[];
}

export interface Lesson {
  id: string;
  name: string;
  file: string | null;
}

export interface Module {
  id: string;
  name: string;
  image: string | null;
  lessons: Lesson[];
}

export interface Question {
  id: string;
  text: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  points: number;
}

export const useCourseCreationStore = defineStore('courseCreation', () => {
  // Course Information
  const courseData = ref<CourseCreationData>({
    image: null,
    title: '',
    description: '',
    category: '',
    hours: '',
    requiredFields: [],
  });

  // Modules
  const modules = ref<Module[]>([]);

  // Exams/Questions indexed by module id
  const moduleQuestions = ref<Record<string, Question[]>>({});

  // Actions
  function setCourseData(data: CourseCreationData) {
    courseData.value = { ...data };
  }

  function setModules(modulesList: Module[]) {
    modules.value = [...modulesList];
  }

  function setModuleQuestions(moduleId: string, questions: Question[]) {
    moduleQuestions.value[moduleId] = [...questions];
  }

  function resetCreation() {
    courseData.value = {
      image: null,
      title: '',
      description: '',
      category: '',
      hours: '',
      requiredFields: [],
    };
    modules.value = [];
    moduleQuestions.value = {};
  }

  return {
    courseData,
    modules,
    moduleQuestions,
    setCourseData,
    setModules,
    setModuleQuestions,
    resetCreation,
  };
});

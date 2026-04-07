import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface CourseCreationData {
  id?: number;
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
  const courseData = ref<CourseCreationData>({
    id: undefined,
    image: null,
    title: '',
    description: '',
    category: '',
    hours: '',
    requiredFields: [],
  });

  const modules = ref<Module[]>([]);

  const moduleQuestions = ref<Record<string, Question[]>>({});

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

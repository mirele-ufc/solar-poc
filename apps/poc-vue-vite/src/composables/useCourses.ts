import { ref, computed } from 'vue';
import { courseService, type Curso } from '@/services/api/courseService';

interface UseCourseState {
  courses: Curso[];
  loading: boolean;
  error: string | null;
}

export function useCourses() {
  const state = ref<UseCourseState>({
    courses: [],
    loading: false,
    error: null,
  });

  const allCourses = computed(() => state.value.courses);
  const isLoading = computed(() => state.value.loading);
  const errorMessage = computed(() => state.value.error);

  const coursesByCategory = computed(() => {
    const grouped: Record<string, Curso[]> = {};
    state.value.courses.forEach(course => {
      if (!grouped[course.category]) {
        grouped[course.category] = [];
      }
      grouped[course.category].push(course);
    });
    return grouped;
  });

  const fetchCourses = async () => {
    state.value.loading = true;
    state.value.error = null;
    try {
      const data = await courseService.getCourses();
      state.value.courses = data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao carregar cursos';
      state.value.error = errorMsg;
      console.error('Erro ao buscar cursos:', err);
    } finally {
      state.value.loading = false;
    }
  };

  return {
    allCourses,
    isLoading,
    errorMessage,
    coursesByCategory,
    fetchCourses,
  };
}

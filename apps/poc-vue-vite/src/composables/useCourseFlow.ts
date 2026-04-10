/**
 * Composable Vue para gerenciar dados do fluxo de curso (courseId parametrizado via API)
 * Substitui a abordagem estática baseada em config
 */

import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getCourseById, BackendCourseResponse } from "@/services/api/courseService";

export function useCourseFlow() {
  const route = useRoute();
  const router = useRouter();

  const courseId = (route.params.id as string) || "";
  const course = ref<BackendCourseResponse | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Função para carregar curso via API
  const loadCourse = async () => {
    if (!courseId) return;

    isLoading.value = true;
    error.value = null;
    try {
      const data = await getCourseById(courseId);
      course.value = data;
    } catch (err) {
      error.value = "Falha ao carregar curso.";
      console.error("Erro ao buscar curso:", err);
    } finally {
      isLoading.value = false;
    }
  };

  // Auto-load no montar
  loadCourse();

  // Validação
  const isValid = computed(() => !!course.value);

  // Mapeamento de courseConfig (para compatibilidade backward com template)
  const courseConfig = computed(() => course.value);

  const navigateTo = (
    path:
      | "modules"
      | "enrollment"
      | "exam"
      | "exam-instructions"
      | "exam-results",
  ) => {
    const paths: Record<string, string> = {
      modules: `/courses/${courseId}/modules`,
      enrollment: `/courses/${courseId}/enrollment`,
      "exam-instructions": `/courses/${courseId}/exam/instructions`,
      exam: `/courses/${courseId}/exam`,
      "exam-results": `/courses/${courseId}/exam/results`,
    };
    router.push(paths[path] || "/courses");
  };

  return {
    courseId,
    courseConfig,
    isValid,
    isLoading,
    error,
    router,
    navigateTo,
    loadCourse,
  };
}

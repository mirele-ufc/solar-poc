/**
 * Composable Vue para gerenciar dados do fluxo de curso (courseId)
 * Equivalente ao hook React useCourseFlow
 */

import { useRoute, useRouter } from "vue-router";
import { getCourseConfig, isValidCourseId } from "@/config/coursesConfig";

export function useCourseFlow() {
  const route = useRoute();
  const router = useRouter();

  const courseId = (route.params.id as string) || "";
  const isValid = courseId && isValidCourseId(courseId);
  const courseConfig = isValid ? getCourseConfig(courseId) : null;

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
    router,
    navigateTo,
  };
}

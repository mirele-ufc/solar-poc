/**
 * Hook customizado para gerenciar dados do fluxo de curso (courseId)
 * Retorna courseConfig e helpers para navegação e validação
 */

import { useParams, useNavigate } from "react-router-dom";
import { getCourseConfig, isValidCourseId } from "@/config/coursesConfig";

export function useCourseFlow() {
  const { id: courseId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const isValid = courseId && isValidCourseId(courseId);
  const courseConfig = isValid ? getCourseConfig(courseId!) : null;

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
    navigate(paths[path] || "/courses");
  };

  return {
    courseId: courseId || "",
    courseConfig,
    isValid,
    navigate,
    navigateTo,
  };
}

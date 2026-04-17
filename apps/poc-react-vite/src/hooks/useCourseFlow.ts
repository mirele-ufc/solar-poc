/**
 * Hook customizado para gerenciar dados do fluxo de curso com API dinâmica
 * Substitui abordagem estática (coursesConfig) por chamadas API (parity com Vue)
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchCourseById,
  BackendCourseResponse,
} from "@/services/courseService";

export function useCourseFlow() {
  const { id: courseId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<BackendCourseResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar curso via API (similar ao Vue)
  useEffect(() => {
    if (!courseId) return;

    const loadCourse = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchCourseById(courseId);
        setCourse(data);
      } catch (err) {
        setError("Falha ao carregar curso. Tente novamente mais tarde.");
        console.error("Erro ao buscar curso:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourse();
  }, [courseId]);

  const isValid = !!course;
  const courseConfig = course;

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
    isLoading,
    error,
    navigate,
    navigateTo,
  };
}

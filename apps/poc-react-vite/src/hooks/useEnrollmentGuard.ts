import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useApp } from "@/context/AppContext";

/**
 * Redirects to /courses immediately if the student does not have
 * active enrollment in the indicated course.
 *
 * Principle of least privilege by context:
 * - Professors have unrestricted access to their own courses (total bypass).
 * - For courses where the professor has a student role (courseStudentRoles),
 *   the guard applies the same enrollment rules as a student.
 *
 * ⚠️ Security: real access control must be validated on the server.
 */
export function useEnrollmentGuard(courseId: string) {
  const { isEnrolled, user, hasCourseStudentRole } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (user.role === "professor") {
      // Se o professor tem papel de aluno neste curso, aplica a regra de matrícula
      if (hasCourseStudentRole(courseId)) {
        if (!isEnrolled(courseId)) {
          navigate("/courses", { replace: true });
        }
      }
      // Caso contrário, professor tem acesso irrestrito
      return;
    }

    // Estudante: verifica matrícula normalmente
    if (!isEnrolled(courseId)) {
      navigate("/courses", { replace: true });
    }
  }, [courseId, isEnrolled, navigate, user.role, hasCourseStudentRole]);
}
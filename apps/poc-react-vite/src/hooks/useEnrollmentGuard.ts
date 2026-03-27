import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/store/useAuthStore";
import { useCourseStore } from "@/store/useCourseStore";

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
  const { currentUser } = useAuthStore();
  const { isEnrolledInCourse, hasCourseStudentRole } = useCourseStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return; // Guard null check

    if (currentUser.role === "professor") {
      // Se o professor tem papel de aluno neste curso, aplica a regra de matrícula
      if (hasCourseStudentRole(courseId)) {
        if (!isEnrolledInCourse(courseId)) {
          navigate("/courses", { replace: true });
        }
      }
      // Caso contrário, professor tem acesso irrestrito
      return;
    }

    // Student: verifica matrícula normalmente
    if (!isEnrolledInCourse(courseId)) {
      navigate("/courses", { replace: true });
    }
  }, [
    courseId,
    isEnrolledInCourse,
    navigate,
    currentUser,
    hasCourseStudentRole,
  ]);
}

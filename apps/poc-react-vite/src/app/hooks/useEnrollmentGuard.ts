import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../context/AppContext";

/**
 * Redireciona para /cursos imediatamente se o aluno não possuir
 * matrícula ativa no curso indicado.
 *
 * Princípio de privilégio mínimo por contexto:
 * - Professores têm acesso irrestrito aos seus próprios cursos (bypass total).
 * - Para cursos em que o professor possui papel de aluno (courseStudentRoles),
 *   o guard aplica as mesmas regras de matrícula de um estudante.
 *
 * ⚠️ Segurança: controle de acesso real deve ser validado no servidor.
 */
export function useEnrollmentGuard(courseId: string) {
  const { isEnrolled, user, hasCourseStudentRole } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (user.role === "professor") {
      // Se o professor tem papel de aluno neste curso, aplica a regra de matrícula
      if (hasCourseStudentRole(courseId)) {
        if (!isEnrolled(courseId)) {
          navigate("/cursos", { replace: true });
        }
      }
      // Caso contrário, professor tem acesso irrestrito
      return;
    }

    // Estudante: verifica matrícula normalmente
    if (!isEnrolled(courseId)) {
      navigate("/cursos", { replace: true });
    }
  }, [courseId, isEnrolled, navigate, user.role, hasCourseStudentRole]);
}
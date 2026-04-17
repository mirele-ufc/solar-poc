import { useRouter } from 'vue-router';
import { useCourseStore } from '@/store/useCourseStore';
import { onBeforeMount } from 'vue';

/**
 * Hook para proteger rotas de aulas/provas.
 * Se o usuário não estiver matriculado, redireciona para os detalhes do curso.
 */
export function useEnrollmentGuard(courseId: string) {
  const router = useRouter();
  const courseStore = useCourseStore();

  // No Vue, executamos a verificação antes do componente ser montado
  onBeforeMount(() => {
    const isEnrolled = courseStore.isEnrolledInCourse(courseId);

    if (!isEnrolled) {
      console.warn(`[Guard] Usuário não matriculado no curso: ${courseId}. Redirecionando...`);
      
      // Redireciona para a página principal do curso (ex: /courses/power-bi)
      // Usamos .replace para que o usuário não volte para a página protegida ao clicar em "voltar"
      router.replace({ 
        name: 'course-detail', 
        params: { id: courseId } 
      });
    }
  });
}
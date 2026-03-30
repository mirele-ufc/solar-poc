<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/useAuthStore';

// Componentes Reutilizáveis
import CourseGrid from '../components/shared/CourseGrid.vue';

const router = useRouter();
const authStore = useAuthStore();

// Lógica de Role
const isProfessor = computed(() => authStore.currentUser.role === 'professor');

// Dados dos Cursos para Alunos
const computacaoCourses = [
  { id: "power-bi", title: "Power Bi - Fundamentos", hours: "Carga horária: 30h" },
  { id: "python", title: "Python Iniciante", hours: "Carga horária: 24h" },
  { id: "matematica", title: "Matemática básica", hours: "Carga horária: 36h" },
];

const designCourses = [
  { id: "historia-design", title: "História do Design", hours: "Carga horária: 64h" },
  { id: "design-grafico", title: "Design Gráfico - Iniciante", hours: "Carga horária: 40h" },
  { id: "design-interfaces", title: "Design de Interfaces Gráficas", hours: "Carga horária: 48h" },
];

// Dados dos Cursos para Professores (Adicionado 'active: true' para exibir a tag)
const activeCourses = [
  { id: "power-bi", title: "Power Bi - Fundamentos", active: true },
  { id: "python", title: "Python Iniciante", active: true },
  { id: "matematica", title: "Matemática básica", active: true },
];

const archivedCourses = [
  { id: "historia-design", title: "História do Design", active: false },
  { id: "design-grafico", title: "Design Gráfico - Iniciante", active: false },
  { id: "design-interfaces", title: "Design de Interfaces Gráficas", active: false },
];

// Navegação do Aluno
const goToCourse = (id: string) => {
  router.push(`/courses/${id}`);
};

// Navegação do Professor (CORRIGIDO: Removido o 'if' que travava o Python)
const handleManage = (id: string) => {
  router.push(`/courses/${id}/manage`);
};
</script>

<template>
  <div class="bg-white min-h-screen">
    <div v-if="isProfessor" class="flex flex-col gap-[30px] items-start pt-[30px] px-[20px] md:px-[40px] pb-[60px]">
      <div class="flex flex-col gap-[12px] w-full">
        <h1 class="font-['Figtree:Bold',sans-serif] font-bold leading-[36px] text-[#021b59] text-[24px]">
          Acompanhe os cursos
        </h1>
        <button 
          @click="router.push('/create-course')"
          class="bg-[#ffeac4] h-[48px] w-full rounded-[26px] font-medium text-[20px] text-[#333] hover:bg-[#ffd9a0] transition-colors"
        >
          Criar curso
        </button>
      </div>

      <section class="flex flex-col gap-[20px] w-full">
        <h2 class="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[24px]">Cursos ativos</h2>
        <CourseGrid :courses="activeCourses" @click-course="handleManage" />
      </section>

      <section class="flex flex-col gap-[20px] w-full">
        <h2 class="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[24px]">Cursos arquivados</h2>
        <CourseGrid :courses="archivedCourses" @click-course="() => {}" />
      </section>
    </div>

    <div v-else class="flex flex-col gap-[30px] items-start pt-[30px] px-[20px] md:px-[40px] pb-[60px]">
      <h1 class="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[28px]">Conheça nossos cursos!</h1>
      
      <section class="flex flex-col gap-[20px] w-full">
        <h2 class="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[24px]">Computação</h2>
        <CourseGrid :courses="computacaoCourses" show-hours @click-course="goToCourse" />
      </section>

      <section class="flex flex-col gap-[20px] w-full">
        <h2 class="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[24px]">Design</h2>
        <CourseGrid :courses="designCourses" show-hours @click-course="() => {}" />
      </section>
    </div>
  </div>
</template>
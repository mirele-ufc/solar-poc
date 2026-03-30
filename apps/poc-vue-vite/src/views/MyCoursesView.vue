<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCourseStore } from "@/store/useCourseStore";
import CourseCard from '@/components/shared/CourseCard.vue';
import EmptyState from '@/components/shared/EmptyState.vue';

// ── Constants ────────────────────────────────────────────────────────────────
const BOOK_ICON = "M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 14H8v-2h8v2zm0-4H8v-2h8v2zm0-4H8V6h8v2z";
const TEACHER_ICON = "M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z";

const ALL_COURSES: Record<string, any> = {
  "power-bi": {
    title: "Power BI - Fundamentos",
    hours: "Carga horária: 30h",
    category: "Computação",
    image: "https://images.unsplash.com/photo-1759661966728-4a02e3c6ed91?..."
  },
  python: {
    title: "Python Iniciante",
    hours: "Carga horária: 24h",
    category: "Computação",
    image: "https://images.unsplash.com/photo-1624953587687-daf255b6b80a?..."
  },
  matematica: {
    title: "Matemática Básica",
    hours: "Carga horária: 36h",
    category: "Computação",
    image: "https://images.unsplash.com/photo-1747654804155-ffd62d5dfb51?..."
  },
};

const PROFESSOR_TAUGHT_COURSES = ["power-bi"];
const PROFESSOR_TAUGHT_COURSES_DATA = ["power-bi", "matematica"];

// ── State & Logic ────────────────────────────────────────────────────────────
const router = useRouter();
const courseStore = useCourseStore();

const isProfessor = true; // Placeholder como no original

const taughtCourses = computed(() => {
  if (!isProfessor) return [];
  return PROFESSOR_TAUGHT_COURSES_DATA.map(id => ({
    id,
    ...(ALL_COURSES[id] ?? null),
  })).filter(c => c.title);
});

const studentCourses = computed(() => {
  const studentCourseIds = isProfessor
    ? courseStore.enrolledCourses.filter((id: string) => courseStore.courseStudentRoles.includes(id))
    : courseStore.enrolledCourses;

  return studentCourseIds
    .map((id: string) => ({ id, ...(ALL_COURSES[id] ?? null) }))
    .filter((c: any) => c.title);
});

const getCourseTarget = (id: string) => {
  if (isProfessor && PROFESSOR_TAUGHT_COURSES.includes(id)) {
    return `/courses/${id}/manage`; // Ajustado para condizer com o router.ts vue anterior
  }
  return `/courses/${id}`;
};

const handleNavigate = (path: string) => router.push(path);
</script>

<template>
  <div v-if="!isProfessor" class="bg-white flex flex-col gap-[24px] pt-[24px] px-[20px] md:px-[40px] pb-[60px]">
    <PageHeader
      title="Meus Cursos"
      backPath="/courses"
      :crumbs="[
        { label: 'Cursos', path: '/courses' },
        { label: 'Meus Cursos' },
      ]"
    />

    <div v-if="studentCourses.length === 0" class="flex flex-col items-center gap-[20px] py-[60px] text-center">
      <svg class="size-[64px] opacity-30" fill="none" viewBox="0 0 24 24" aria-hidden="true">
        <path :d="BOOK_ICON" fill="#021b59" />
      </svg>
      <div class="flex flex-col gap-[8px]">
        <p class="font-['Figtree:Medium',sans-serif] font-medium text-[#021b59] text-[18px]">
          Você ainda não está matriculado em nenhum curso
        </p>
        <p class="font-['Figtree:Regular',sans-serif] font-normal text-[#595959] text-[15px]">
          Explore os cursos disponíveis e realize sua inscrição.
        </p>
      </div>
      <button
        type="button"
        @click="handleNavigate('/courses')"
        class="bg-[#ffeac4] h-[46px] px-[32px] rounded-[26px] cursor-pointer hover:bg-[#ffd9a0] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59]"
      >
        <span class="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[17px]">
          Ver cursos disponíveis
        </span>
      </button>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[20px]">
      <CourseCard
        v-for="course in studentCourses"
        :key="course.id"
        v-bind="course"
        :badge="{ label: 'Matriculado', bg: '#e6f9ee', text: '#155724' }"
        @click="handleNavigate(`/courses/${course.id}`)"
      />
    </div>
  </div>

  <div v-else class="bg-white flex flex-col gap-[32px] pt-[24px] px-[20px] md:px-[40px] pb-[60px]">
    <PageHeader
      title="Meus Cursos"
      backPath="/courses"
      :crumbs="[
        { label: 'Cursos', path: '/courses' },
        { label: 'Meus Cursos' },
      ]"
    />

    <section aria-labelledby="secao-professor">
      <div class="flex items-center gap-[10px] mb-[16px]">
        <div class="size-[32px] rounded-full bg-[#021b59] flex items-center justify-center shrink-0" aria-hidden="true">
          <svg class="size-[17px]" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <path :d="TEACHER_ICON" fill="#ffeac4" />
          </svg>
        </div>
        <h2 id="secao-professor" class="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[20px] leading-[30px]">
          Cursos que leciono
        </h2>
      </div>

      <EmptyState
        v-if="taughtCourses.length === 0"
        message="Nenhum curso ativo como professor"
        sub="Você não possui cursos ativos como professor no momento."
      />
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[20px]">
        <CourseCard
          v-for="course in taughtCourses"
          :key="course.id"
          v-bind="course"
          :badge="{ label: 'Professor', bg: '#c5d6ff', text: '#021b59' }"
          @click="handleNavigate(getCourseTarget(course.id))"
        />
      </div>
    </section>

    <div class="w-full h-px bg-[#e8e8e8]" aria-hidden="true" />

    <section aria-labelledby="secao-aluno">
      <div class="flex items-center gap-[10px] mb-[16px]">
        <div class="size-[32px] rounded-full bg-[#042e99] flex items-center justify-center shrink-0" aria-hidden="true">
          <svg class="size-[17px]" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <path :d="BOOK_ICON" fill="#ffeac4" />
          </svg>
        </div>
        <h2 id="secao-aluno" class="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[20px] leading-[30px]">
          Cursos em que estou matriculado
        </h2>
      </div>

      <div v-if="studentCourses.length === 0" class="flex flex-col items-center gap-[16px] py-[40px] text-center bg-[#f5f8ff] rounded-[12px]">
        <svg class="size-[48px] opacity-25" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <path :d="BOOK_ICON" fill="#021b59" />
        </svg>
        <p class="font-['Figtree:Medium',sans-serif] font-medium text-[#021b59] text-[16px]">
          Você não está matriculado em nenhum curso como aluno
        </p>
        <p class="font-['Figtree:Regular',sans-serif] font-normal text-[#595959] text-[14px]">
          Explore os cursos disponíveis e realize sua inscrição.
        </p>
        <button
          type="button"
          @click="handleNavigate('/courses')"
          class="bg-[#ffeac4] h-[46px] px-[28px] rounded-[26px] hover:bg-[#ffd9a0] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59]"
        >
          <span class="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[16px]">
            Ver cursos disponíveis
          </span>
        </button>
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[20px]">
        <CourseCard
          v-for="course in studentCourses"
          :key="course.id"
          v-bind="course"
          :badge="{ label: 'Matriculado', bg: '#e6f9ee', text: '#155724' }"
          @click="handleNavigate(`/courses/${course.id}`)"
        />
      </div>
    </section>
  </div>
</template>
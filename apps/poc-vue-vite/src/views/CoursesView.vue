<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/useAuthStore';
import { useCourses } from '../composables/useCourses';
import CourseGrid from '../components/shared/CourseGrid.vue';

const router = useRouter();
const authStore = useAuthStore();
const { allCourses, isLoading, errorMessage, coursesByCategory, fetchCourses } = useCourses();
const isProfessor = computed(() => authStore.currentUser.role === 'professor');

const goToCourse = (id: string | number) => {
  router.push(`/courses/${id}`);
};

const handleManage = (id: string | number) => {
  router.push(`/courses/${id}/manage`);
};

onMounted(() => {
  fetchCourses();
});
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

      <div v-if="isLoading" class="w-full text-center py-12">
        <p class="text-[#595959] text-[16px]">Carregando cursos...</p>
      </div>

      <div v-if="errorMessage && !isLoading" class="w-full bg-[#fee] border border-[#f99] rounded-[8px] p-[16px]">
        <p class="text-[#c33] text-[16px]">{{ errorMessage }}</p>
      </div>

      <template v-if="!isLoading && !errorMessage && allCourses.length > 0">
        <section class="flex flex-col gap-[20px] w-full">
          <h2 class="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[24px]">Cursos ativos</h2>
          <CourseGrid :courses="allCourses" @click-course="handleManage" />
        </section>
      </template>

      <div v-if="!isLoading && !errorMessage && allCourses.length === 0" class="w-full text-center py-12">
        <p class="text-[#595959] text-[16px]">Nenhum curso disponível</p>
      </div>
    </div>

    <div v-else class="flex flex-col gap-[30px] items-start pt-[30px] px-[20px] md:px-[40px] pb-[60px]">
      <h1 class="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[28px]">Conheça nossos cursos!</h1>

      <div v-if="isLoading" class="w-full text-center py-12">
        <p class="text-[#595959] text-[16px]">Carregando cursos...</p>
      </div>

      <div v-if="errorMessage && !isLoading" class="w-full bg-[#fee] border border-[#f99] rounded-[8px] p-[16px]">
        <p class="text-[#c33] text-[16px]">{{ errorMessage }}</p>
      </div>

      <template v-if="!isLoading && !errorMessage && Object.keys(coursesByCategory).length > 0">
        <section v-for="(courses, category) in coursesByCategory" :key="category" class="flex flex-col gap-[20px] w-full">
          <h2 class="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[24px]">{{ category }}</h2>
          <CourseGrid :courses="courses" @click-course="goToCourse" />
        </section>
      </template>

      <div v-if="!isLoading && !errorMessage && Object.keys(coursesByCategory).length === 0" class="w-full text-center py-12">
        <p class="text-[#595959] text-[16px]">Nenhum curso disponível</p>
      </div>
    </div>
  </div>
</template>
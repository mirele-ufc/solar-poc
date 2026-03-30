<script setup lang="ts">
import { useRouter } from "vue-router";
import PageHeader from "@/components/shared/PageHeader.vue";
import { useEnrollmentGuard } from "@/hooks/useEnrollmentGuard";

useEnrollmentGuard("python");
const router = useRouter();
</script>

<template>
  <div class="flex flex-col min-h-screen bg-white pb-[120px]">
    <div class="max-w-[900px] mx-auto flex flex-col gap-[28px] px-[20px] md:px-[40px] pt-[30px] w-full">
      <PageHeader title="Instruções" backPath="/courses/python/modules" :crumbs="[{ label: 'Courses', path: '/courses' }, { label: 'Python Beginner', path: '/courses/python' }, { label: 'Exam 01' }]" />

      <h2 class="font-extrabold text-[#021b59] text-[32px] md:text-[40px]">Prova 01</h2>

      <div class="bg-white rounded-[12px] p-[24px] md:p-[32px] shadow-sm border border-[#e0e0e0]">
        <h3 class="font-bold text-[#021b59] text-[20px] mb-[16px]">Instruções</h3>
        <ul class="list-disc space-y-[8px] ms-[24px] text-[#333]">
          <li>A prova tem 3 questões;</li>
          <li>O tempo total é de 20 minutos;</li>
          <li>Você terá apenas 1 tentativa.</li>
        </ul>
        <p class="mt-[24px] font-medium text-[#021b59]">Boa prova!</p>
      </div>
    </div>

    <div class="fixed bottom-0 left-0 right-0 bg-white px-[20px] py-[16px] shadow-lg flex justify-center">
      <button @click="router.push('/courses/python/exam')" class="w-full max-w-[900px] bg-[#ffeac4] h-[50px] rounded-[26px] font-medium text-[20px] hover:bg-[#ffd9a0]">
        Realizar prova
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
import PageHeader from '@/components/shared/PageHeader.vue';
import { useEnrollmentGuard } from '@/hooks/useEnrollmentGuard';

const router = useRouter();

// Proteção de rota para garantir matrícula antes de acessar as instruções [cite: 2]
useEnrollmentGuard("power-bi");

/**
 * Navega para a tela de execução da prova
 */
const handleStartExam = () => {
  router.push("/courses/power-bi/exam");
};
</script>

<template>
  <div class="flex flex-col min-h-[calc(100vh-70px)] pb-[120px] bg-[#ffffff]">
    <div class="max-w-[900px] mx-auto flex flex-col gap-[28px] px-[20px] md:px-[40px] pt-[30px] w-full">
      
      <PageHeader
        title="Instruções"
        backPath="/courses/power-bi/modules/1"
        :crumbs="[
          { label: 'Cursos', path: '/courses' },
          { label: 'Power BI - Fundamentos', path: '/courses/power-bi' },
          { label: 'Módulos', path: '/courses/power-bi/modules' },
          { label: 'Módulo 01', path: '/courses/power-bi/modules/1' },
          { label: 'Prova 01' },
        ]"
      />

      <h2 class="font-['Anek_Devanagari:ExtraBold',sans-serif] font-extrabold text-[#021b59] text-[32px] md:text-[40px] leading-tight">
        Prova 01
      </h2>

      <div class="bg-white rounded-[12px] p-[24px] md:p-[32px] shadow-sm">
        <h3 class="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[20px] mb-[16px]">
          Instruções
        </h3>
        
        <div class="font-['Figtree:Regular',sans-serif] font-normal text-[#333] text-[16px] leading-[24px]">
          <ul class="list-disc mb-0 space-y-[8px]">
            <li class="ms-[24px]">A prova tem 10 questões;</li>
            <li class="ms-[24px]">O tempo total é de 60 minutos;</li>
            <li class="ms-[24px]">O cronômetro começa ao acessar a prova;</li>
            <li class="ms-[24px]">As respostas são salvas automaticamente;</li>
            <li class="ms-[24px]">Ao acabar o tempo, a prova é encerrada automaticamente e suas respostas ficam registradas.</li>
            <li class="ms-[24px]">Você terá apenas 1 tentativa.</li>
          </ul>
          
          <p class="mt-[24px] font-['Figtree:Medium',sans-serif] font-medium text-[#021b59]">
            Boa prova!
          </p>
        </div>
      </div>
    </div>

    <div class="fixed bottom-0 left-0 right-0 bg-white px-[20px] py-[16px] shadow-[0px_-4px_12px_rgba(51,51,51,0.15)] flex justify-center z-10">
      <div class="w-full max-w-[900px]">
        <button
          type="button"
          @click="handleStartExam"
          class="bg-[#ffeac4] h-[50px] w-full rounded-[26px] cursor-pointer hover:bg-[#ffd9a0] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59] focus-visible:outline-offset-[2px]"
        >
          <span class="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[20px]">
            Realizar prova
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
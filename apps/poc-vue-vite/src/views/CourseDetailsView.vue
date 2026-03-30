<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router'; // Adicionado useRoute
import { useCourseStore } from '@/store/useCourseStore';
import ImageWithFallback from '@/components/shared/ImageWithFallback.vue';
import PageHeader from '@/components/shared/PageHeader.vue';
import { toast } from 'vue-sonner';

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1759661966728-4a02e3c6ed91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwdmlzdWFsaXphdGlvbiUyMGJ1c2luZXNzJTIwaW50ZWxsaWdlbmNlJTIwZGFzaGJvYXJkfGVufDF8fHx8MTc3MzMzNTYxNHww&ixlib=rb-4.1.0&q=80&w=1080";

const WARN_PATH = "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z";

const bullets = [
  "Conceitos básicos de Business Intelligence e análise de dados",
  "Conexão e importação de diferentes fontes de dados",
  "Transformação e limpeza de dados com o Power Query",
  "Criação de medidas e cálculos com a linguagem DAX",
  "Construção de dashboards interativos e relatórios visuais",
  "Publicação e compartilhamento de relatórios no Power BI Service",
];

// --- Estado e Hooks ---
const router = useRouter();
const route = useRoute(); // Hook para pegar o ID da URL
const courseStore = useCourseStore();

const showCancelModal = ref(false);

// Pegamos o ID dinamicamente da URL (ex: 'power-bi')
const courseId = computed(() => (route.params.id as string) || "power-bi");

const enrolled = computed(() => courseStore.isEnrolledInCourse(courseId.value));

// --- Métodos ---
const handleInscrever = () => {
  if (enrolled.value) {
    // Navega usando o nome da rota definido no router/index.ts
    router.push({ name: 'course-modules', params: { id: courseId.value } });
  } else {
    // Navega para a EnrollmentPage usando o nome da rota
    router.push({ name: 'course-enrollment', params: { id: courseId.value } });
  }
};

const handleConfirmCancel = () => {
  courseStore.unenrollFromCourse(courseId.value);
  showCancelModal.value = false;
  
  toast.success("Matrícula cancelada com sucesso.", {
    description: "Seu acesso ao conteúdo foi removido.",
    duration: 5000,
  });
  
  router.push("/courses");
};
</script>

<template>
  <div class="bg-white flex flex-col pb-[100px]">
    <div class="w-full h-[218px] md:h-[320px] overflow-hidden">
      <ImageWithFallback
        alt="Power BI – dashboard interativo"
        class="w-full h-full object-cover"
        :src="HERO_IMAGE"
      />
    </div>

    <div class="max-w-[900px] mx-auto flex flex-col gap-[24px] px-[20px] md:px-[40px] pt-[24px] w-full">
      <PageHeader
        title="Power BI - Fundamentos"
        backPath="/courses"
        :crumbs="[
          { label: 'Cursos', path: '/courses' },
          { label: 'Power BI - Fundamentos' },
        ]"
      />
      
      <div class="flex flex-col gap-[6px] md:flex-row md:items-baseline md:justify-between">
        <h1 class="font-['Figtree:Bold',sans-serif] font-bold leading-[36px] text-black text-[24px]">
          Power BI - Fundamentos
        </h1>
        <p class="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] text-[#595959] text-[18px] shrink-0">
          Carga horária: 30h
        </p>
      </div>

      <div class="flex flex-col gap-[10px]">
        <h2 class="font-['Figtree:Bold',sans-serif] font-bold leading-[30px] text-black text-[20px]">
          Sobre o curso
        </h2>
        <p class="font-['Figtree:Regular',sans-serif] font-normal leading-[26px] text-black text-[16px]">
          O curso Power BI Fundamentos tem como objetivo introduzir os
          participantes aos conceitos essenciais de análise de dados e
          Business Intelligence utilizando o Microsoft Power BI. Ao longo do
          curso, os alunos aprendem a transformar dados brutos em informações
          estratégicas por meio da criação de relatórios interativos e
          dashboards dinâmicos.
        </p>
      </div>

      <div class="flex flex-col gap-[10px]">
        <h2 class="font-['Figtree:Bold',sans-serif] font-bold leading-[30px] text-black text-[20px]">
          O que você irá aprender?
        </h2>
        <p class="font-['Figtree:Regular',sans-serif] font-normal leading-[26px] text-black text-[16px]">
          Serão abordados temas como:
        </p>
        <ul class="flex flex-col gap-[8px] pl-[4px] md:grid md:grid-cols-2 md:gap-x-[20px]">
          <li v-for="item in bullets" :key="item" class="flex gap-[8px] items-start">
            <span aria-hidden="true" class="text-[#021b59] mt-[2px]">
              •
            </span>
            <span class="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] text-black text-[16px]">
              {{ item }}
            </span>
          </li>
        </ul>
      </div>

      <div class="flex flex-col gap-[10px]">
        <h2 class="font-['Figtree:Bold',sans-serif] font-bold leading-[30px] text-black text-[20px]">
          Público-alvo
        </h2>
        <p class="font-['Figtree:Regular',sans-serif] font-normal leading-[26px] text-black text-[16px]">
          Este curso é destinado a profissionais de diversas áreas que
          trabalham com análise de dados, estudantes e recém-formados
          interessados em Business Intelligence, gestores que desejam tomar
          decisões baseadas em dados, e analistas que buscam aprimorar suas
          habilidades em visualização de dados.
        </p>
      </div>

      <div class="flex flex-col gap-[10px]">
        <h2 class="font-['Figtree:Bold',sans-serif] font-bold leading-[30px] text-black text-[20px]">
          Pré-requisitos
        </h2>
        <p class="font-['Figtree:Regular',sans-serif] font-normal leading-[26px] text-black text-[16px]">
          Para realizar este curso, é necessário ter conhecimentos básicos de
          informática e navegação na web, além de familiaridade com planilhas
          eletrônicas (Excel ou similar). Não é necessário conhecimento prévio
          em programação.
        </p>
      </div>
    </div>

    <div class="fixed bottom-0 left-0 right-0 bg-white px-[20px] py-[16px] shadow-[0px_-4px_12px_rgba(51,51,51,0.15)] flex justify-center z-10">
      <div class="w-full max-w-[900px] flex flex-col gap-[10px]">
        <button
          type="button"
          @click="handleInscrever"
          class="bg-[#ffeac4] h-[50px] w-full rounded-[26px] cursor-pointer hover:bg-[#ffd9a0] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59] focus-visible:outline-offset-[2px]"
        >
          <span class="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[20px]">
            {{ enrolled ? "Acessar curso" : "Inscrever-se" }}
          </span>
        </button>

        <button
          v-if="enrolled"
          type="button"
          @click="showCancelModal = true"
          class="h-[44px] w-full rounded-[26px] border-2 border-[#de2e66] cursor-pointer hover:bg-[#de2e66]/5 transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#de2e66] focus-visible:outline-offset-[2px]"
          aria-label="Cancelar matrícula neste curso"
        >
          <span class="font-['Figtree:Medium',sans-serif] font-medium text-[#de2e66] text-[16px]">
            Cancelar matrícula
          </span>
        </button>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showCancelModal">
        <div class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" @click="showCancelModal = false" />
        <div class="fixed inset-0 z-50 flex items-center justify-center px-[20px]">
          <div class="bg-white w-full max-w-[420px] rounded-[12px] shadow-2xl p-[28px] flex flex-col gap-[20px]">
            <div class="flex flex-col items-center gap-[12px] text-center">
              <div class="size-[52px] rounded-full bg-[#fde8ef] flex items-center justify-center shrink-0">
                <svg class="size-[28px]" fill="none" viewBox="0 0 24 24">
                  <path :d="WARN_PATH" fill="#de2e66" />
                </svg>
              </div>
              <h2 class="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[20px] leading-[30px]">
                Cancelar matrícula?
              </h2>
            </div>
            <p class="font-['Figtree:Regular',sans-serif] text-[#333] text-[15px] leading-[24px] text-center">
              Tem certeza que deseja cancelar sua matrícula neste curso?
              <span class="font-['Figtree:Medium',sans-serif] font-medium text-[#801436]">
                Após o cancelamento, você perderá o acesso ao conteúdo da disciplina
              </span>.
            </p>
            <div class="flex flex-col gap-[10px]">
              <button @click="handleConfirmCancel" class="w-full h-[50px] bg-[#de2e66] rounded-[26px] text-white font-medium">
                Confirmar cancelamento
              </button>
              <button @click="showCancelModal = false" class="w-full h-[50px] border-2 border-[#021b59] rounded-[26px] text-[#021b59] font-medium">
                Voltar
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
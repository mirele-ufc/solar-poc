<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/useAuthStore";
import PageHeader from "@/components/shared/PageHeader.vue";
import imgRectangle30 from "@/assets/22ebf3a06cf8215c6bd0946f42302bc2204ed790.png";

// --- Constantes e Tipos ---
type ItemType = "aula" | "prova";

interface LessonItem {
  id: string;
  label: string;
  type: ItemType;
  modId: string;
}

interface ModuloData {
  id: string;
  title: string;
  items: LessonItem[];
}

const ARROW_PATH = "M6 7L12 13L18 7L20 9L12 17L4 9L6 7Z";
const CHECK_PATH = "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z";

const MODULOS: ModuloData[] = [
  {
    id: "1",
    title: "Módulo 01",
    items: [
      { id: "m1-aula-01", label: "Aula 01 - Introdução", type: "aula", modId: "1" },
      { id: "m1-aula-02", label: "Aula 02 - Conceitos Básicos", type: "aula", modId: "1" },
      { id: "m1-aula-03", label: "Aula 03 - Prática", type: "aula", modId: "1" },
      { id: "m1-prova-01", label: "Prova do Módulo", type: "prova", modId: "1" },
    ],
  },
  {
    id: "2",
    title: "Módulo 02",
    items: [
      { id: "m2-aula-01", label: "Aula 01 - Power Query", type: "aula", modId: "2" },
      { id: "m2-aula-02", label: "Aula 02 - Transformação de Dados", type: "aula", modId: "2" },
      { id: "m2-aula-03", label: "Aula 03 - Relacionamentos", type: "aula", modId: "2" },
      { id: "m2-prova-01", label: "Prova do Módulo", type: "prova", modId: "2" },
    ],
  },
  {
    id: "3",
    title: "Módulo 03",
    items: [
      { id: "m3-aula-01", label: "Aula 01 - DAX Básico", type: "aula", modId: "3" },
      { id: "m3-aula-02", label: "Aula 02 - Visualizações Avançadas", type: "aula", modId: "3" },
      { id: "m3-aula-03", label: "Aula 03 - Publicação e Compartilhamento", type: "aula", modId: "3" },
      { id: "m3-prova-01", label: "Prova do Módulo", type: "prova", modId: "3" },
    ],
  },
];

const ALL_LESSON_IDS = MODULOS.flatMap((m) => m.items.map((i) => i.id));
const ALL_AULA_IDS = MODULOS.flatMap((m) => m.items.filter((i) => i.type === "aula").map((i) => i.id));
const ALL_PROVA_IDS = MODULOS.flatMap((m) => m.items.filter((i) => i.type === "prova").map((i) => i.id));

const VISITED_KEY = "solar_visited_lessons";

// --- Funções Utilitárias ---
function loadVisited(): Set<string> {
  try {
    const raw = localStorage.getItem(VISITED_KEY);
    if (raw) return new Set(JSON.parse(raw) as string[]);
  } catch { /* ignore */ }
  return new Set();
}

function saveVisited(visitedSet: Set<string>) {
  try {
    localStorage.setItem(VISITED_KEY, JSON.stringify([...visitedSet]));
  } catch { /* ignore */ }
}

function generateValidationCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 16; i++) {
    if (i > 0 && i % 4 === 0) code += "-";
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// --- Estado e Hooks ---
const router = useRouter();
const authStore = useAuthStore();

const expandedIds = ref<Set<string>>(new Set(["1"]));
const visited = ref<Set<string>>(loadVisited());

// Estados dos Modais
const showMatriculaModal = ref(false);
const showRequisitosAlert = ref(false);

const matriculaCode = ref(generateValidationCode());
const emissionDate = ref(new Date());

const showConclusaoModal = ref(false);
const conclusaoCode = ref(generateValidationCode()); 

const enrollmentDate = computed(() => {
  const date = new Date(emissionDate.value);
  date.setDate(date.getDate() - 30);
  return date;
});

// --- Watchers ---
watch(visited, (newVisited) => {
  saveVisited(newVisited);
}, { deep: true });

// --- Computed Values ---
const visitedAulas = computed(() => ALL_AULA_IDS.filter((id) => visited.value.has(id)).length);
const visitedProvas = computed(() => ALL_PROVA_IDS.filter((id) => visited.value.has(id)).length);
const isConcluded = computed(() => visitedAulas.value >= ALL_AULA_IDS.length && visitedProvas.value >= ALL_PROVA_IDS.length);
const totalProgress = computed(() => ALL_LESSON_IDS.filter((id) => visited.value.has(id)).length);
const overallPct = computed(() => {
  if (ALL_LESSON_IDS.length === 0) return 0;
  return Math.round((totalProgress.value / ALL_LESSON_IDS.length) * 100);
});

// --- Handlers ---
const handleToggle = (modId: string) => {
  if (expandedIds.value.has(modId)) expandedIds.value.delete(modId);
  else expandedIds.value.add(modId);
};

const handleVisitLesson = (lessonId: string, modId: string, type: ItemType) => {
  
  if (type === "prova") {
    router.push("/courses/power-bi/exam/instructions");
  } else {
    const mod = MODULOS.find((m) => m.id === modId);
    const aulaItems = mod?.items.filter((i) => i.type === "aula") ?? [];
    const aulaIndex = aulaItems.findIndex((i) => i.id === lessonId);
    
    router.push({
      name: 'course-lessons',
      params: { id: 'power-bi', modId: modId },
      state: { aulaIndex: aulaIndex >= 0 ? aulaIndex : 0 }
    });
  }
};

const handlePrint = () => {
  window.print();
};

const handleConclusaoClick = () => {
  if (!isConcluded.value) {
    showRequisitosAlert.value = true;
  } else {
    showConclusaoModal.value = true; 
  }
};

const handleEsc = (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    showMatriculaModal.value = false;
    showConclusaoModal.value = false; 
    showRequisitosAlert.value = false;
  }
};

onMounted(() => window.addEventListener("keydown", handleEsc));
onUnmounted(() => window.removeEventListener("keydown", handleEsc));
</script>

<template>
  <main id="main-content" class="bg-white flex flex-col min-h-screen pb-[110px]">
    <div class="max-w-[900px] mx-auto flex flex-col gap-[20px] px-[16px] md:px-[40px] pt-[20px] w-full">
      <PageHeader
        title="Módulos"
        backPath="/courses/power-bi"
        :crumbs="[
          { label: 'Cursos', path: '/courses' },
          { label: 'Power BI - Fundamentos', path: '/courses/power-bi' },
          { label: 'Módulos' }
        ]"
      />

      <h2 class="font-['Figtree:Bold',sans-serif] font-bold text-[24px] leading-[36px] text-black">
        Power BI - Fundamentos
      </h2>

      <div class="flex flex-col gap-[8px]">
        <button
          type="button"
          @click="showMatriculaModal = true"
          class="w-full sm:w-auto sm:self-start flex items-center gap-[10px] px-[20px] h-[46px] border-2 border-[#021b59] rounded-[26px] hover:bg-[#021b59]/5 transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59] focus-visible:outline-offset-[2px]"
        >
          <svg class="size-[18px] shrink-0" fill="none" viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#021b59" stroke-width="2" />
            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="#021b59" stroke-width="2" />
          </svg>
          <span class="font-['Figtree:Medium',sans-serif] font-medium text-[#021b59] text-[15px]">Declaração de Matrícula</span>
        </button>

        <div class="flex items-center gap-[8px]">
          <div class="flex-1 h-[5px] bg-[#e0e0e0] rounded-full overflow-hidden">
            <div class="h-full bg-[#042e99] transition-all duration-500" :style="{ width: `${overallPct}%` }" />
          </div>
          <span class="font-['Figtree:Regular',sans-serif] text-[#606060] text-[12px]">{{ overallPct }}% concluído</span>
        </div>
      </div>

      <div v-for="mod in MODULOS" :key="mod.id" class="bg-[#c5d6ff] rounded-[12px] p-[16px] flex flex-col gap-[12px]">
         <div class="w-full aspect-[16/9] rounded-[10px] overflow-hidden">
            <img class="w-full h-full object-cover" :src="imgRectangle30" />
         </div>
         
         <div class="w-full mt-[4px]">
            <div class="flex justify-between items-center mb-[4px]">
                <span class="font-normal text-[#021b59] text-[12px]">Progresso</span>
                <span class="font-bold text-[#021b59] text-[12px]">
                  {{ Math.round((mod.items.filter(i => i.type === 'aula' && visited.has(i.id)).length / (mod.items.filter(i => i.type === 'aula').length || 1)) * 100) }}%
                </span>
            </div>
            <div class="w-full h-[6px] bg-[#759BFB]/40 rounded-full overflow-hidden">
                <div class="h-full bg-[#042e99] rounded-full transition-all" :style="{ width: `${(mod.items.filter(i => i.type === 'aula' && visited.has(i.id)).length / (mod.items.filter(i => i.type === 'aula').length || 1)) * 100}%` }" />
            </div>
         </div>

         <button @click="handleToggle(mod.id)" class="flex items-center justify-between w-full font-bold text-[24px]">
            {{ mod.title }}:
            <svg :class="['size-[24px] transition-transform', expandedIds.has(mod.id) ? 'rotate-180' : '']" fill="none" viewBox="0 0 24 24">
              <path :d="ARROW_PATH" fill="#021b59" />
            </svg>
         </button>

         <div v-if="expandedIds.has(mod.id)" class="flex flex-col gap-[4px]">
            <div v-for="item in mod.items" :key="item.id" @click="handleVisitLesson(item.id, item.modId, item.type)" class="py-[10px] cursor-pointer hover:text-[#042e99] flex justify-between">
                <span class="font-medium text-[20px]">{{ item.label }}</span>
                <svg v-if="visited.has(item.id)" class="size-[18px]" viewBox="0 0 24 24"><path :d="CHECK_PATH" fill="#042e99" /></svg>
            </div>
         </div>
      </div>
    </div>

    <div class="fixed bottom-0 left-0 right-0 bg-white p-[14px] shadow-lg flex justify-center z-10">
       <button @click="handleConclusaoClick" :class="['w-full max-w-[900px] h-[50px] rounded-[26px] font-medium', isConcluded ? 'bg-[#042e99] text-white' : 'bg-[#ffeac4] text-[#333]']">
         Declaração de Conclusão
       </button>
    </div>

    <Teleport to="body">
      <div v-if="showMatriculaModal">
        <div class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" @click="showMatriculaModal = false" />
        <div class="fixed inset-0 z-50 flex items-center justify-center px-[16px] py-[24px] overflow-y-auto">
          <div class="bg-white w-full max-w-[580px] rounded-[12px] shadow-2xl flex flex-col overflow-hidden">
            <div class="bg-[#021b59] px-[28px] py-[20px] flex items-center justify-between">
              <h2 class="font-bold text-white text-[18px]">Declaração de Matrícula</h2>
              <button @click="showMatriculaModal = false" class="text-white/80 hover:text-white p-[4px]">
                <svg class="size-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M18 6L6 18M6 6l12 12" stroke-width="2.5" stroke-linecap="round"/></svg>
              </button>
            </div>

            <div class="px-[28px] md:px-[40px] py-[32px] flex flex-col gap-[20px]">
              <div class="text-center flex flex-col gap-[4px] border-b pb-[20px]">
                <div class="inline-flex items-center gap-[10px] mx-auto mb-[8px]">
                  <div class="size-[44px] rounded-full bg-[#021b59] flex items-center justify-center text-white font-bold text-[16px]">S</div>
                  <div class="text-left">
                    <p class="font-bold text-[#021b59] text-[15px]">SOLAR</p>
                    <p class="text-[#606060] text-[12px]">Sistema Online de Aprendizagem</p>
                  </div>
                </div>
                <p class="text-[#606060] text-[12px]">Universidade Federal do Ceará — UFC</p>
              </div>

              <div class="text-center">
                <h3 class="font-bold text-[#021b59] text-[20px] uppercase tracking-wide">Declaração de Matrícula</h3>
              </div>

              <div class="text-[#333] text-[15px] leading-[26px] text-justify">
                <p>Declaramos que <span class="font-bold text-[#021b59]">{{ authStore.currentUser?.name || 'Eduardo Marinho' }}</span> encontra-se regularmente matriculado(a) no curso <span class="font-bold text-[#021b59]">Power BI - Fundamentos</span> na plataforma SOLAR.</p>
              </div>

              <div class="bg-[#f5f8ff] rounded-[10px] p-[18px] grid grid-cols-1 sm:grid-cols-2 gap-[12px]">
                <div v-for="item in [
                  { label: 'Aluno(a)', value: authStore.currentUser?.name || 'Eduardo Marinho' },
                  { label: 'Curso', value: 'Power BI - Fundamentos' },
                  { label: 'Carga Horária', value: '30 horas' },
                  { label: 'Data de Matrícula', value: formatDate(enrollmentDate) },
                  { label: 'Status da Matrícula', value: 'Ativa' },
                  { label: 'Data de Emissão', value: formatDate(emissionDate) }
                ]" :key="item.label">
                  <p class="text-[#8e8e8e] text-[11px] uppercase">{{ item.label }}</p>
                  <p :class="['font-medium text-[14px]', item.label === 'Status da Matrícula' ? 'text-[#042e99]' : 'text-[#021b59]']">{{ item.value }}</p>
                </div>
              </div>

              <div class="border border-dashed border-[#759BFB] rounded-[10px] px-[18px] py-[14px]">
                <p class="text-[#8e8e8e] text-[11px] uppercase">Código de Validação</p>
                <p class="font-bold text-[#021b59] text-[17px] tracking-widest font-mono">{{ matriculaCode }}</p>
                <p class="text-[#8e8e8e] text-[11px]">Este código garante a autenticidade do documento.</p>
              </div>
            </div>

            <div class="px-[28px] md:px-[40px] pb-[28px] flex flex-col sm:flex-row gap-[10px]">
              <button @click="handlePrint" class="flex-1 h-[48px] bg-[#021b59] rounded-[26px] text-white font-medium flex items-center justify-center gap-[8px] transition-colors hover:bg-[#042e99]">
                <svg class="size-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6v-8z" stroke-width="2" /></svg>
                Imprimir / Baixar PDF
              </button>
              <button @click="showMatriculaModal = false" class="flex-1 h-[48px] border-2 border-[#021b59] rounded-[26px] text-[#021b59] font-medium hover:bg-[#021b59]/5">Fechar</button>
            </div>
          </div>
        </div>
      </div>

<div v-if="showConclusaoModal" class="fixed inset-0 z-50 flex items-center justify-center px-[16px] py-[24px] overflow-y-auto">
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="showConclusaoModal = false" />
  
  <div class="bg-white w-full max-w-[580px] rounded-[12px] shadow-2xl flex flex-col overflow-hidden relative z-10">
    <div class="bg-[#042e99] px-[28px] py-[20px] flex items-center justify-between">
      <h2 class="font-['Figtree:Bold',sans-serif] font-bold text-white text-[18px] leading-[28px]">
        Declaração de Conclusão
      </h2>
      <button @click="showConclusaoModal = false" class="text-white/80 hover:text-white p-[4px] transition-colors">
        <svg class="size-[22px]" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
        </svg>
      </button>
    </div>

    <div class="px-[28px] md:px-[40px] py-[32px] flex flex-col gap-[20px]">
      <div class="text-center flex flex-col gap-[4px] border-b border-[#e0e0e0] pb-[20px]">
        <div class="inline-flex items-center justify-center gap-[10px] mx-auto mb-[8px]">
          <div class="size-[44px] rounded-full bg-[#042e99] flex items-center justify-center shrink-0">
            <span class="font-['Figtree:Bold',sans-serif] font-bold text-white text-[16px]">S</span>
          </div>
          <div class="text-left">
            <p class="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[15px] leading-[20px]">SOLAR</p>
            <p class="font-['Figtree:Regular',sans-serif] text-[#606060] text-[12px] leading-[16px]">Sistema Online de Aprendizagem</p>
          </div>
        </div>
        <p class="font-['Figtree:Regular',sans-serif] text-[#606060] text-[12px]">Universidade Federal do Ceará — UFC</p>
      </div>

      <div class="flex justify-center">
        <div class="size-[56px] rounded-full bg-[#c5d6ff] flex items-center justify-center">
          <svg class="size-[30px]" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="#021b59" />
          </svg>
        </div>
      </div>

      <div class="text-center">
        <h3 class="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[20px] leading-[30px] uppercase tracking-wide">
          Declaração de Conclusão de Curso
        </h3>
      </div>

      <div class="font-['Figtree:Regular',sans-serif] text-[#333] text-[15px] leading-[26px] text-justify">
        <p>
          Declaramos, para os devidos fins, que 
          <span class="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59]">{{ authStore.currentUser?.name || 'Eduardo Marinho' }}</span> 
          concluiu com êxito o curso 
          <span class="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59]">Python Iniciante</span>, 
          ofertado pela Universidade Federal do Ceará através da plataforma SOLAR, tendo cumprido todos os requisitos necessários para a sua conclusão.
        </p>
      </div>

      <div class="bg-[#f5f8ff] rounded-[10px] p-[18px] grid grid-cols-1 sm:grid-cols-2 gap-[12px]">
        <div v-for="item in [
          { label: 'Aluno(a)', value: authStore.currentUser?.name || 'Eduardo Marinho' },
          { label: 'Curso', value: 'Python Iniciante' },
          { label: 'Carga Horária', value: '24 horas' },
          { label: 'Data de Conclusão', value: formatDate(emissionDate) },
          { label: 'Status', value: 'Concluído' },
          { label: 'Data de Emissão', value: formatDate(emissionDate) }
        ]" :key="item.label">
          <p class="font-['Figtree:Regular',sans-serif] text-[#8e8e8e] text-[11px] leading-[16px] uppercase tracking-wide">
            {{ item.label }}
          </p>
          <p :class="['font-[\'Figtree:Medium\',sans-serif] font-medium text-[14px] leading-[22px]', item.label === 'Status' ? 'text-[#042e99]' : 'text-[#021b59]']">
            {{ item.value }}
          </p>
        </div>
      </div>

      <div class="border border-dashed border-[#042e99] rounded-[10px] px-[18px] py-[14px] flex flex-col gap-[4px]">
        <p class="font-['Figtree:Regular',sans-serif] text-[#8e8e8e] text-[11px] uppercase tracking-wide">Código de Validação</p>
        <p class="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[17px] tracking-[0.15em] font-mono">
          {{ conclusaoCode }}
        </p>
        <p class="font-['Figtree:Regular',sans-serif] text-[#8e8e8e] text-[11px] leading-[16px]">
          Este código garante a autenticidade do documento e pode ser utilizado para verificação futura.
        </p>
      </div>

      <p class="font-['Figtree:Regular',sans-serif] text-[#8e8e8e] text-[12px] leading-[18px] text-center">
        Documento emitido eletronicamente pelo sistema SOLAR — UFC em {{ formatDate(emissionDate) }}.
      </p>
    </div>

    <div class="px-[28px] md:px-[40px] pb-[28px] flex flex-col sm:flex-row gap-[10px]">
      <button @click="handlePrint" class="flex-1 h-[48px] bg-[#042e99] rounded-[26px] text-white font-medium flex items-center justify-center gap-[8px] hover:bg-[#0643de] transition-colors">
        <svg class="size-[18px]" fill="none" viewBox="0 0 24 24">
          <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6v-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        Imprimir / Baixar PDF
      </button>
      <button @click="showConclusaoModal = false" class="flex-1 h-[48px] border-2 border-[#042e99] rounded-[26px] text-[#042e99] font-medium hover:bg-[#042e99]/5 transition-colors">
        Fechar
      </button>
    </div>
  </div>
</div>
    </Teleport>
  </main>
</template>
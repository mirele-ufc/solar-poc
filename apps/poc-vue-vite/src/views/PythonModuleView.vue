<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/useAuthStore";
import { useEnrollmentGuard } from "@/hooks/useEnrollmentGuard";
import PageHeader from "@/components/shared/PageHeader.vue";

// --- Constantes e Dados ---
const ARROW_PATH = "M6 7L12 13L18 7L20 9L12 17L4 9L6 7Z";
const CHECK_PATH = "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z";
const PYTHON_HERO = "https://images.unsplash.com/photo-1624953587687-daf255b6b80a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800";
const VISITED_KEY = "solar_visited_python_lessons";

useEnrollmentGuard("python");

type ItemType = "aula" | "prova";
interface LessonItem { id: string; label: string; type: ItemType; modId: string; }
interface ModuloData { id: string; title: string; items: LessonItem[]; }

const MODULOS: ModuloData[] = [
  {
    id: "1",
    title: "Módulo 01 — Introdução ao Python",
    items: [
      { id: "py-m1-aula-01", label: "Aula 01 — O que é Python", type: "aula", modId: "1" },
      { id: "py-m1-prova-01", label: "Prova do Módulo", type: "prova", modId: "1" },
    ],
  },
];

const ALL_LESSON_IDS = MODULOS.flatMap((m) => m.items.map((i) => i.id));
const ALL_AULA_IDS = MODULOS.flatMap((m) => m.items.filter((i) => i.type === "aula").map((i) => i.id));
const ALL_PROVA_IDS = MODULOS.flatMap((m) => m.items.filter((i) => i.type === "prova").map((i) => i.id));

// --- Funções Utilitárias ---
function loadVisited(): Set<string> {
  try {
    const raw = localStorage.getItem(VISITED_KEY);
    if (raw) return new Set(JSON.parse(raw) as string[]);
  } catch { /* ignore */ }
  return new Set();
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
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

// --- Estado e Hooks ---
const router = useRouter();
const authStore = useAuthStore();
const expandedIds = ref<Set<string>>(new Set(["1"]));
const visited = ref<Set<string>>(loadVisited());

const showMatriculaModal = ref(false);
const showRequisitosAlert = ref(false);
const showConclusaoModal = ref(false);

const matriculaCode = ref(generateValidationCode());
const conclusaoCode = ref("PY-CON-G6H2-N4B9-C2D0"); 
const emissionDate = ref(new Date());

const enrollmentDate = computed(() => {
  const date = new Date(emissionDate.value);
  date.setDate(date.getDate() - 30);
  return date;
});

// Datas mockadas para paridade visual
const mockDataMatricula = "26 de fevereiro de 2023";
const mockDataConclusao = "22 de maio de 2023";
const mockDataEmissao = "16 de agosto de 2024";

watch(visited, (newV) => {
  localStorage.setItem(VISITED_KEY, JSON.stringify([...newV]));
}, { deep: true });

const visitedAulas = computed(() => ALL_AULA_IDS.filter((id) => visited.value.has(id)).length);
const visitedProvas = computed(() => ALL_PROVA_IDS.filter((id) => visited.value.has(id)).length);
const isConcluded = computed(() => visitedAulas.value >= ALL_AULA_IDS.length && visitedProvas.value >= ALL_PROVA_IDS.length);
const totalProgress = computed(() => ALL_LESSON_IDS.filter((id) => visited.value.has(id)).length);
const overallPct = computed(() => ALL_LESSON_IDS.length === 0 ? 0 : Math.round((totalProgress.value / ALL_LESSON_IDS.length) * 100));

const handleToggle = (modId: string) => {
  if (expandedIds.value.has(modId)) expandedIds.value.delete(modId);
  else expandedIds.value.add(modId);
};

const handleVisitLesson = (lessonId: string, modId: string, type: ItemType) => {
  visited.value.add(lessonId);
  if (type === "prova") router.push("/courses/python/exam/instructions");
  else router.push({ name: 'python-lessons', params: { modId }, state: { aulaIndex: 0 } });
};

const handleConclusaoClick = () => {
  if (!isConcluded.value) showRequisitosAlert.value = true;
  else showConclusaoModal.value = true;
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
        backPath="/courses/python"
        :crumbs="[{ label: 'Cursos', path: '/courses' }, { label: 'Python Iniciante', path: '/courses/python' }, { label: 'Módulos' }]"
      />

      <h2 class="font-['Figtree:Bold',sans-serif] font-bold text-[24px] leading-[36px] text-black">
        Python Iniciante
      </h2>

      <div class="flex flex-col gap-[8px]">
        <button
          type="button"
          @click="showMatriculaModal = true"
          class="w-full sm:w-auto sm:self-start flex items-center gap-[10px] px-[20px] h-[46px] border-2 border-[#042e99] rounded-[26px] hover:bg-[#042e99]/5 transition-colors"
        >
          <svg class="size-[18px] shrink-0" fill="none" viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#042e99" stroke-width="2" />
            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="#042e99" stroke-width="2" />
          </svg>
          <span class="font-['Figtree:Medium',sans-serif] font-medium text-[#042e99] text-[15px]">Declaração de Matrícula</span>
        </button>

        <div class="flex items-center gap-[8px]">
          <div class="flex-1 h-[5px] bg-[#e0e0e0] rounded-full overflow-hidden">
            <div class="h-full bg-[#042e99] transition-all duration-500" :style="{ width: `${overallPct}%` }" />
          </div>
          <span class="font-['Figtree:Regular',sans-serif] text-[#606060] text-[12px] shrink-0">{{ overallPct }}% concluído</span>
        </div>
      </div>

      <div v-for="mod in MODULOS" :key="mod.id" class="bg-[#c5d6ff] rounded-[12px] p-[16px] flex flex-col gap-[12px]">
         <div class="w-full aspect-[16/9] rounded-[10px] overflow-hidden">
            <img class="w-full h-full object-cover" :src="PYTHON_HERO" />
         </div>
         <div class="w-full mt-[4px]">
            <div class="flex justify-between items-center mb-[4px]">
                <span class="font-['Figtree:Regular',sans-serif] text-[#042e99] text-[12px]">Progresso</span>
                <span class="font-['Figtree:Bold',sans-serif] font-bold text-[#042e99] text-[12px]">{{ Math.round((mod.items.filter(i => i.type === 'aula' && visited.has(i.id)).length / (mod.items.filter(i => i.type === 'aula').length || 1)) * 100) }}%</span>
            </div>
            <div class="w-full h-[6px] bg-[#759BFB]/40 rounded-full overflow-hidden">
                <div class="h-full bg-[#042e99] rounded-full transition-all duration-300" :style="{ width: `${(mod.items.filter(i => i.type === 'aula' && visited.has(i.id)).length / (mod.items.filter(i => i.type === 'aula').length || 1)) * 100}%` }" />
            </div>
         </div>
         <button @click="handleToggle(mod.id)" class="flex items-center justify-between w-full font-['Figtree:Bold',sans-serif] font-bold text-[22px] text-black">
            {{ mod.title }}
            <svg :class="['size-[24px] transition-transform duration-200', expandedIds.has(mod.id) ? 'rotate-180' : '']" fill="none" viewBox="0 0 24 24"><path :d="ARROW_PATH" fill="#042e99" /></svg>
         </button>
         <div v-if="expandedIds.has(mod.id)" class="flex flex-col">
            <div v-for="(item, idx) in mod.items" :key="item.id">
                <button @click="handleVisitLesson(item.id, item.modId, item.type)" class="py-[12px] w-full flex justify-between items-center group text-left">
                    <span class="font-['Figtree:Medium',sans-serif] font-medium text-[20px] leading-[30px] text-black group-hover:text-[#042e99] transition-colors">{{ item.label }}</span>
                    <svg v-if="visited.has(item.id)" class="size-[18px] shrink-0" viewBox="0 0 24 24"><path :d="CHECK_PATH" fill="#042e99" /></svg>
                </button>
                <div v-if="idx !== mod.items.length - 1" class="w-full h-px bg-[#759BFB]" />
            </div>
         </div>
      </div>
    </div>

    <div class="fixed bottom-0 left-0 right-0 bg-white px-[16px] md:px-[40px] py-[14px] shadow-[0px_-4px_12px_rgba(51,51,51,0.12)] z-10">
       <div class="max-w-[900px] mx-auto">
         <button 
           @click="handleConclusaoClick" 
           :class="[
             `w-full h-[50px] rounded-[26px] flex items-center justify-center gap-[10px] font-['Figtree:Medium',sans-serif] font-medium transition-colors`, 
             isConcluded ? 'bg-[#042e99] text-white hover:bg-[#0643de]' : 'bg-[#ffeac4] text-[#333] hover:bg-[#ffd9a0]'
           ]"
         >
           <svg class="size-[20px] shrink-0" fill="none" viewBox="0 0 24 24">
             <path v-if="isConcluded" d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="white" />
             <path v-else d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="#333" stroke-width="2" />
           </svg>
           <span>Declaração de Conclusão</span>
           <span v-if="!isConcluded" class="text-[13px] opacity-70">({{ overallPct }}%)</span>
         </button>
       </div>
    </div>

    <Teleport to="body">
      <div v-if="showRequisitosAlert" class="fixed inset-0 z-50 flex items-center justify-center px-[20px]">
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="showRequisitosAlert = false" />
        <div class="bg-white w-full max-w-[420px] rounded-[12px] shadow-2xl p-[28px] relative z-10 flex flex-col gap-[20px]">
          <div class="flex flex-col items-center gap-[12px] text-center">
            <div class="size-[52px] rounded-full bg-[#ffeac4] flex items-center justify-center shrink-0">
              <svg class="size-[28px]" fill="none" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 3.5L20.5 19h-17L12 5.5zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z" fill="#D45900" /></svg>
            </div>
            <h2 class="font-['Figtree:Bold',sans-serif] font-bold text-[#042e99] text-[20px]">Requisitos não cumpridos</h2>
          </div>
          <p class="font-['Figtree:Regular',sans-serif] text-center text-[#333] text-[15px]">Você ainda não cumpriu todos os requisitos necessários para concluir este curso.</p>
          <div class="flex flex-col gap-[10px]">
            <div v-for="item in [{ label: 'Aulas concluídas', done: visitedAulas >= ALL_AULA_IDS.length, detail: `${visitedAulas} de ${ALL_AULA_IDS.length} aulas` }, { label: 'Provas realizadas', done: visitedProvas >= ALL_PROVA_IDS.length, detail: `${visitedProvas} de ${ALL_PROVA_IDS.length} provas` }]" :key="item.label" :class="['flex items-center gap-[12px] px-[14px] py-[10px] rounded-[10px]', item.done ? 'bg-[#c5d6ff]/40' : 'bg-[#ffeac4]/60']">
              <div :class="['size-[22px] rounded-full flex items-center justify-center shrink-0', item.done ? 'bg-[#042e99]' : 'bg-[#D45900]']">
                <svg v-if="item.done" class="size-[12px]" fill="none" viewBox="0 0 24 24"><path d="M5 12l4 4L19 7" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" /></svg>
                <svg v-else class="size-[12px]" fill="none" viewBox="0 0 14 14"><path d="M2 2l10 10M12 2L2 12" stroke="white" stroke-width="2" stroke-linecap="round" /></svg>
              </div>
              <div class="flex-1 min-w-0"><p class="font-['Figtree:Medium',sans-serif] font-medium text-[#042e99] text-[14px]">{{ item.label }}</p><p class="font-['Figtree:Regular',sans-serif] text-[#606060] text-[12px]">{{ item.detail }}</p></div>
            </div>
          </div>
          <button @click="showRequisitosAlert = false" class="w-full h-[48px] bg-[#042e99] rounded-[26px] text-white font-medium hover:bg-[#0643de]">Entendi</button>
        </div>
      </div>

      <div v-if="showMatriculaModal" class="fixed inset-0 z-50 flex items-center justify-center px-[16px] py-[24px] overflow-y-auto">
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="showMatriculaModal = false" />
        <div class="bg-white w-full max-w-[580px] rounded-[12px] shadow-2xl flex flex-col overflow-hidden relative z-10">
          <div class="bg-[#042e99] px-[28px] py-[20px] flex items-center justify-between text-white font-['Figtree:Bold',sans-serif]">
            <h2 class="text-[18px]">Declaração de Matrícula</h2>
            <button @click="showMatriculaModal = false" class="text-white/80 hover:text-white p-[4px]">✕</button>
          </div>
          <div class="px-[28px] md:px-[40px] py-[32px] flex flex-col gap-[20px]">
            <div class="text-center flex flex-col gap-[4px] border-b pb-[20px]">
              <div class="inline-flex items-center gap-[10px] mx-auto mb-[8px]">
                <div class="size-[44px] rounded-full bg-[#042e99] flex items-center justify-center text-white font-bold text-[16px]">S</div>
                <div class="text-left font-['Figtree:Bold',sans-serif]"><p class="text-[#042e99] text-[15px]">SOLAR</p><p class="text-[#606060] text-[12px]">Sistema Online de Aprendizagem</p></div>
              </div>
              <p class="font-['Figtree:Regular',sans-serif] text-[#606060] text-[12px]">Universidade Federal do Ceará — UFC</p>
            </div>
            <h3 class="text-center font-['Figtree:Bold',sans-serif] font-bold text-[#042e99] text-[20px] uppercase">Declaração de Matrícula</h3>
            <p class="text-justify font-['Figtree:Regular',sans-serif] text-[#333] text-[15px] leading-[26px]">Declaramos que <b>{{ authStore.currentUser?.name || 'Eduardo Marinho' }}</b> encontra-se regularmente matriculado(a) no curso <b>Python Iniciante</b>.</p>
            <div class="bg-[#f5f8ff] p-[18px] rounded-[10px] grid grid-cols-1 sm:grid-cols-2 gap-[12px] font-['Figtree:Regular',sans-serif]">
               <div><p class="text-[#8e8e8e] uppercase text-[10px]">Aluno(a)</p><p class="text-[#042e99] text-[14px] font-medium">{{ authStore.currentUser?.name || 'Eduardo Marinho' }}</p></div>
               <div><p class="text-[#8e8e8e] uppercase text-[10px]">Carga Horária</p><p class="text-[#042e99] text-[14px] font-medium">24 horas</p></div>
               <div><p class="text-[#8e8e8e] uppercase text-[10px]">Status</p><p class="text-[#042e99] text-[14px] font-bold">Ativa</p></div>
               <div><p class="text-[#8e8e8e] uppercase text-[10px]">Matrícula</p><p class="text-[#042e99] text-[14px] font-medium">{{ mockDataMatricula }}</p></div>
            </div>
            <div class="border border-dashed border-[#759BFB] p-4 rounded-lg text-center">
               <p class="text-[11px] text-[#8e8e8e] uppercase">Código de Validação</p>
               <p class="font-mono font-bold text-[#042e99] text-[17px] tracking-widest uppercase">{{ matriculaCode }}</p>
            </div>
            <div class="flex flex-col sm:flex-row gap-[12px]">
              <button @click="() => window.print()" class="flex-1 h-[48px] bg-[#042e99] rounded-[26px] text-white font-['Figtree:Medium',sans-serif] font-medium flex items-center justify-center gap-[8px] hover:bg-[#0643de] transition-colors"><svg class="size-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6v-8z" /></svg> Imprimir / PDF</button>
              <button @click="showMatriculaModal = false" class="flex-1 h-[48px] border-2 border-[#042e99] rounded-[26px] text-[#042e99] font-medium hover:bg-[#042e99]/5 transition-colors">Fechar</button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="showConclusaoModal" class="fixed inset-0 z-50 flex items-center justify-center px-[16px] py-[24px] overflow-y-auto">
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="showConclusaoModal = false" />
        <div class="bg-white w-full max-w-[580px] rounded-[12px] shadow-2xl flex flex-col overflow-hidden relative z-10">
          <div class="bg-[#042e99] px-[28px] py-[20px] flex items-center justify-between text-white font-['Figtree:Bold',sans-serif]">
            <h2 class="text-[18px]">Declaração de Conclusão</h2>
            <button @click="showConclusaoModal = false" class="text-white/80 hover:text-white p-[4px]">✕</button>
          </div>
          
          <div class="px-[28px] md:px-[40px] py-[32px] flex flex-col gap-[20px]">
            <div class="text-center flex flex-col gap-[4px] border-b pb-[20px]">
              <div class="inline-flex items-center gap-[10px] mx-auto mb-[8px]">
                <div class="size-[44px] rounded-full bg-[#042e99] flex items-center justify-center text-white font-bold text-[16px]">S</div>
                <div class="text-left font-['Figtree:Bold',sans-serif]"><p class="text-[#042e99] text-[15px]">SOLAR</p><p class="text-[#606060] text-[12px]">Sistema Online de Aprendizagem</p></div>
              </div>
              <p class="font-['Figtree:Regular',sans-serif] text-[#606060] text-[12px]">Universidade Federal do Ceará — UFC</p>
            </div>

            <h3 class="text-center font-['Figtree:Bold',sans-serif] font-bold text-[#042e99] text-[20px] uppercase">Declaração de Conclusão de Curso</h3>
            
            <p class="text-justify font-['Figtree:Regular',sans-serif] text-[#333] text-[15px] leading-[26px]">
              Declaramos que <b>{{ authStore.currentUser?.name || 'Eduardo Marinho' }}</b> concluiu com êxito o curso <b>Python Iniciante</b> na plataforma SOLAR, cumprindo todos os requisitos.
            </p>

            <div class="bg-[#f5f8ff] p-[18px] rounded-[10px] grid grid-cols-1 sm:grid-cols-2 gap-[12px] font-['Figtree:Regular',sans-serif]">
               <div><p class="text-[#8e8e8e] uppercase text-[10px]">Aluno(a)</p><p class="text-[#042e99] text-[14px] font-medium">{{ authStore.currentUser?.name || 'Eduardo Marinho' }}</p></div>
               <div><p class="text-[#8e8e8e] uppercase text-[10px]">Curso</p><p class="text-[#042e99] text-[14px] font-medium">Python Iniciante</p></div>
               <div><p class="text-[#8e8e8e] uppercase text-[10px]">Carga Horária</p><p class="text-[#042e99] text-[14px] font-medium">24 horas</p></div>
               <div><p class="text-[#8e8e8e] uppercase text-[10px]">Conclusão</p><p class="text-[#042e99] text-[14px] font-medium">{{ mockDataConclusao }}</p></div>
               <div><p class="text-[#8e8e8e] uppercase text-[10px]">Status</p><p class="text-[#042e99] text-[14px] font-bold">Concluído</p></div>
               <div><p class="text-[#8e8e8e] uppercase text-[10px]">Data Emissão</p><p class="text-[#042e99] text-[14px] font-medium">{{ mockDataEmissao }}</p></div>
            </div>

            <div class="border border-dashed border-[#759BFB] p-4 rounded-lg text-center">
               <p class="text-[11px] text-[#8e8e8e] uppercase">Código de Autenticidade</p>
               <p class="font-mono font-bold text-[#042e99] text-[17px] tracking-widest uppercase">{{ conclusaoCode }}</p>
            </div>

            <p class="font-['Figtree:Regular',sans-serif] text-[#8e8e8e] text-[12px] leading-[18px] text-center">Documento emitido eletronicamente pelo sistema SOLAR em {{ mockDataEmissao }}.</p>
            
            <div class="flex flex-col sm:flex-row gap-[12px]">
              <button @click="() => window.print()" class="flex-1 h-[48px] bg-[#042e99] rounded-[26px] text-white font-['Figtree:Medium',sans-serif] font-medium flex items-center justify-center gap-[8px] hover:bg-[#0643de] transition-colors"><svg class="size-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6v-8z" /></svg> Imprimir / PDF</button>
              <button @click="showConclusaoModal = false" class="flex-1 h-[48px] border-2 border-[#042e99] rounded-[26px] text-[#042e99] font-medium hover:bg-[#042e99]/5 transition-colors">Fechar</button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </main>
</template>
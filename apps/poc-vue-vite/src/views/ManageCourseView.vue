<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router'; //

// ── SVG paths ─────────────────────────────────────────────────────────────────
const EDIT_PATH = "M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z";
const CLOSE_SM = "M10.657 12.071L5 6.414L6.414 5L12.071 10.657L17.728 5L19.142 6.414L13.485 12.071L19.142 17.728L17.728 19.142L12.071 13.485L6.414 19.142L5 17.728L10.657 12.071Z";
const CHART_PATH = "M9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17ZM19 19H5V5H19V19ZM19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z";
const PEOPLE_PATH = "M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z";
const ARROW_BACK = "M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z";
const DOWNLOAD_PATH = "M5 20H19V18H5V20ZM19 9H15V3H9V9H5L12 16L19 9Z";

// ── Tipagem ───────────────────────────────────────────────────────────────────
type StudentStatus = "concluiu" | "em_andamento" | "parou" | "nao_acessou";
interface Student {
  id: string;
  name: string;
  email: string;
  progress: number;
  status: StudentStatus;
  lastAccess?: string;
  stoppedAt?: string;
}

// ── STATUS_META ──────────────────────────────────────────────────────────────
const STATUS_META: Record<StudentStatus, { label: string; color: string; bg: string; dotColor: string }> = {
  concluiu: { label: "Concluiu", color: "#155724", bg: "#e6f9ee", dotColor: "#28a745" },
  em_andamento: { label: "Em andamento", color: "#021b59", bg: "#c5d6ff", dotColor: "#0643de" },
  parou: { label: "Parou", color: "#801436", bg: "#fde8ef", dotColor: "#de2e66" },
  nao_acessou: { label: "Não acessou", color: "#606060", bg: "#f0f0f0", dotColor: "#8e8e8e" },
};

// ── Mock de Dados dos Cursos ─────────────────────────────────────────
const COURSES_MOCK: Record<string, any> = {
  "power-bi": {
    title: "Power BI - Fundamentos",
    image: "https://images.unsplash.com/photo-1759661966728-4a02e3c6ed91?fit=max&fm=jpg&w=1080",
    hours: "30h",
    totalStudents: 35,
    avgScore: 72
  },
  "python": {
    title: "Python Iniciante",
    image: "https://images.unsplash.com/photo-1624953587687-daf255b6b80a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    hours: "24h",
    totalStudents: 28,
    avgScore: 68
  },
  "matematica": {
    title: "Matemática básica",
    image: "https://images.unsplash.com/photo-1747654804155-ffd62d5dfb51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    hours: "36h",
    totalStudents: 42,
    avgScore: 61
  }
};

// ── Estado Dinâmico ───────────────────────────────────────────────────────────
const router = useRouter();
const route = useRoute(); //
const activeTab = ref<"dashboard" | "modulos">("dashboard");
const showParticipants = ref(false);
const currentFilter = ref<StudentStatus | "todos">("todos");
const generatingPDF = ref(false);

// Captura o curso atual baseado no ID da URL
const currentCourse = computed(() => {
  const id = (route.params.id as string) || "power-bi";
  return COURSES_MOCK[id] || COURSES_MOCK["power-bi"];
});

const students = ref<Student[]>([
  { id: "p1",  name: "Ana Beatriz Lima", email: "ana.lima@email.com", progress: 100, status: "concluiu" },
  { id: "p2",  name: "Carlos Eduardo Silva", email: "carlos.silva@email.com", progress: 55, status: "em_andamento" },
  { id: "p4",  name: "Lucas Pereira", email: "lucas.pereira@email.com", progress: 20, status: "parou", stoppedAt: "Módulo 01 — Aula 02", lastAccess: "28/02/2026" },
  { id: "p8",  name: "Rafael Torres", email: "rafael.torres@email.com", progress: 35, status: "parou", stoppedAt: "Módulo 02 — Aula 01", lastAccess: "05/03/2026" },
]);

const filteredStudents = computed(() => {
  if (currentFilter.value === "todos") return students.value;
  return students.value.filter(s => s.status === currentFilter.value);
});

const stoppedStudents = computed(() => students.value.filter(s => s.status === 'parou'));

// ── Métodos ──────────────────────────────────────────────────────────────────
const handleGeneratePDF = async () => {
  generatingPDF.value = true;
  await new Promise(r => setTimeout(r, 1500));
  generatingPDF.value = false;
  window.print();
};
</script>

<template>
  <div class="bg-white flex flex-col pb-[80px] min-h-screen font-['Figtree',sans-serif]">
    
    <div class="w-full h-[180px] md:h-[220px] overflow-hidden relative">
      <img :src="currentCourse.image" class="w-full h-full object-cover" /> <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      
      <button @click="router.back()" class="absolute top-[16px] left-[16px] size-[36px] rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors">
        <svg class="size-[20px]" fill="none" viewBox="0 0 24 24"><path :d="ARROW_BACK" fill="#021b59" /></svg>
      </button>

      <div class="absolute bottom-[16px] left-[20px] right-[20px]">
        <h1 class="font-bold text-white text-[22px] leading-[32px]">
          {{ currentCourse.title }} </h1>
        <p class="text-white/80 text-[14px]">
          Carga horária: {{ currentCourse.hours }} · {{ currentCourse.totalStudents }} alunos inscritos </p>
      </div>
    </div>

    <div class="max-w-[900px] mx-auto w-full px-[20px] md:px-[40px] pt-[20px] flex flex-col gap-[20px]">
      
      <div class="flex flex-col sm:flex-row gap-[10px]">
        <button @click="showParticipants = true" class="flex-1 flex items-center justify-center gap-[8px] h-[46px] bg-[#ffeac4] rounded-[26px] hover:bg-[#ffd9a0] transition-colors">
          <svg class="size-[18px]" fill="none" viewBox="0 0 24 24"><path :d="PEOPLE_PATH" fill="#333" /></svg>
          <span class="font-medium text-[#333] text-[16px]">Ver participantes</span>
        </button>

        <button @click="handleGeneratePDF" :disabled="generatingPDF" class="flex-1 flex items-center justify-center gap-[8px] h-[46px] bg-[#021b59] rounded-[26px] hover:bg-[#042e99] transition-colors disabled:opacity-60">
          <svg v-if="!generatingPDF" class="size-[18px]" fill="none" viewBox="0 0 24 24"><path :d="DOWNLOAD_PATH" fill="#ffeac4" /></svg>
          <span class="font-medium text-[#ffeac4] text-[16px]">{{ generatingPDF ? 'Gerando...' : 'Gerar relatório PDF' }}</span>
        </button>

        <button @click="router.push('/messages')" class="flex-1 flex items-center justify-center h-[46px] border-2 border-[#021b59] rounded-[26px] hover:bg-[#021b59]/5 transition-colors">
          <span class="font-medium text-[#021b59] text-[16px]">Enviar comunicado</span>
        </button>
      </div>

      <div class="flex gap-0 border-b border-[#e0e0e0]">
        <button @click="activeTab = 'dashboard'" :class="['px-[20px] py-[10px] font-medium text-[15px] border-b-2 transition-colors', activeTab === 'dashboard' ? 'border-[#021b59] text-[#021b59]' : 'border-transparent text-[#8e8e8e]']">
          Dashboard
        </button>
        <button @click="activeTab = 'modulos'" :class="['px-[20px] py-[10px] font-medium text-[15px] border-b-2 transition-colors', activeTab === 'modulos' ? 'border-[#021b59] text-[#021b59]' : 'border-transparent text-[#8e8e8e]']">
          Módulos e aulas
        </button>
      </div>

      <div v-if="activeTab === 'dashboard'" class="flex flex-col gap-[20px]">
        <div class="grid grid-cols-2 md:grid-cols-3 gap-[12px]">
          <div class="flex flex-col gap-[6px] rounded-[12px] px-[16px] py-[14px] bg-[#c5d6ff]">
            <p class="font-bold text-[28px] text-[#021b59]">{{ currentCourse.totalStudents }}</p>
            <p class="font-medium text-[#333] text-[14px]">Total inscritos</p>
          </div>
          </div>

        <div class="bg-[#ffeac4] rounded-[12px] px-[16px] py-[24px] flex items-center justify-between">
          <div>
            <p class="font-bold text-[32px] text-[#021b59]">{{ currentCourse.avgScore }}%</p>
            <p class="font-medium text-[#333] text-[15px]">Média de acertos nas provas</p>
          </div>
          <div class="size-10 flex items-center justify-center bg-white/50 rounded-lg">
            <svg class="size-6" viewBox="0 0 24 24"><path :d="CHART_PATH" fill="#021b59" /></svg>
          </div>
        </div>

        <div class="flex flex-col gap-[12px]">
          <h3 class="font-bold text-[#801436] text-[18px]">Alunos que pararam — onde estavam</h3>
          <div v-for="student in stoppedStudents" :key="student.id" class="flex flex-col gap-1 p-[14px] bg-[#fde8ef] rounded-[10px]">
            <div class="flex justify-between items-start">
               <div>
                 <p class="font-medium text-[#333] text-[16px]">{{ student.name }}</p>
                 <p class="text-[#801436] text-[13px]">Parou em: {{ student.stoppedAt }}</p>
               </div>
               <div class="text-right">
                 <p class="font-bold text-[#801436]">{{ student.progress }}%</p>
                 <p class="text-[#8e8e8e] text-[11px]">{{ student.lastAccess }}</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showParticipants" class="fixed inset-0 z-50 flex items-center justify-center px-[20px]">
      <div class="fixed inset-0 bg-black/40 backdrop-blur-sm" @click="showParticipants = false"></div>
      
      <div class="bg-white w-full max-w-[520px] rounded-[16px] shadow-2xl flex flex-col max-h-[85vh] z-50 overflow-hidden">
        <div class="flex items-center justify-between px-[24px] py-[18px] border-b border-[#e0e0e0] shrink-0">
          <h2 class="font-bold text-[#021b59] text-[20px]">Participantes ({{ students.length }})</h2>
          <button @click="showParticipants = false" class="size-[32px] flex items-center justify-center hover:opacity-70">
            <svg class="size-[20px]" fill="none" viewBox="0 0 24 24"><path :d="CLOSE_SM" fill="#333" /></svg>
          </button>
        </div>
        </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { fetchPythonExamQuestions, fetchOptionLabels, type Question } from "@/services/mocks/pythonExamMock";
import { useEnrollmentGuard } from "@/hooks/useEnrollmentGuard";

// --- Proteção e Roteamento ---
const router = useRouter();
useEnrollmentGuard("python");

// --- Estado Reativo ---
const questions = ref<Question[]>([]);
const optionLabels = ref<string[]>([]);
const isLoading = ref(true);
const userAnswers = ref<Record<string, number>>({});

// --- Helpers de Ícones (SVG) ---
const checkSvg = (color: string) => `
  <svg class="size-[13px]" fill="none" viewBox="0 0 20 16">
    <path d="M1 7L7 13L19 1" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
`;

const xSvg = (color: string) => `
  <svg class="size-[11px]" fill="none" viewBox="0 0 14 14">
    <path d="M1 1L13 13M13 1L1 13" stroke="${color}" stroke-width="2.5" stroke-linecap="round" />
  </svg>
`;

// --- Lógica de Processamento ---
onMounted(async () => {
  try {
    const [questionsData, labelsData] = await Promise.all([
      fetchPythonExamQuestions(),
      fetchOptionLabels(),
    ]);
    questions.value = questionsData;
    optionLabels.value = labelsData;

    // Recuperar respostas do history.state (equivalente ao location.state do React)
    const state = window.history.state;
    if (state && state.answers) {
      userAnswers.value = state.answers;
    } else {
      // Fallback para sessionStorage caso o utilizador faça refresh à página
      const stored = sessionStorage.getItem("python_prova_answers");
      if (stored) {
        userAnswers.value = JSON.parse(stored);
        sessionStorage.removeItem("python_prova_answers");
      }
    }
  } catch (error) {
    console.error("Erro ao carregar resultados:", error);
  } finally {
    isLoading.value = false;
  }
});

// --- Computeds para Cálculos ---
const totalCorrect = computed(() => {
  return questions.value.filter(q => userAnswers.value[q.id] === q.correctIndex).length;
});

const allCorrect = computed(() => {
  return questions.value.length > 0 && totalCorrect.value === questions.value.length;
});

const percentage = computed(() => {
  if (questions.value.length === 0) return 0;
  return Math.round((totalCorrect.value / questions.value.length) * 100);
});

const handleReturn = () => {
  router.push("/courses/python/modules");
};
</script>

<template>
  <div class="bg-white min-h-screen pb-[60px]">
    <div v-if="isLoading" class="min-h-screen flex items-center justify-center">
      <p class="text-center text-[#606060]">A carregar resultados...</p>
    </div>

    <div v-else-if="allCorrect" class="max-w-[900px] mx-auto flex flex-col items-center gap-[28px] px-[20px] md:px-[40px] pt-[40px]">
      <div class="flex items-end gap-[8px]" aria-hidden="true">
        <svg v-for="s in [18, 26, 18]" :key="s" :width="s" :height="s" viewBox="0 0 24 24" fill="#f5a623">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14L2 9.27l6.91-1.01L12 2z" />
        </svg>
      </div>

      <div class="flex flex-col items-center justify-center size-[160px] rounded-full bg-[#042e99] shadow-lg">
        <span class="font-['Anek_Devanagari:ExtraBold',sans-serif] font-extrabold text-[#ffeac4] text-[42px] leading-none">100%</span>
        <span class="font-['Figtree:Regular',sans-serif] text-[#ffeac4] text-[13px] mt-[6px]">
          {{ questions.length }}/{{ questions.length }} acertos
        </span>
      </div>

      <div class="text-center flex flex-col gap-[8px]">
        <h1 class="font-['Anek_Devanagari:ExtraBold',sans-serif] font-extrabold text-[#021b59] text-[clamp(24px,5vw,34px)] leading-tight">
          Parabéns! Prova concluída!
        </h1>
        <p class="font-['Figtree:Regular',sans-serif] text-[#595959] text-[16px] leading-[25px] max-w-[480px]">
          Acertaste todas as questões da Prova 01 — Python Iniciante. Continua assim!
        </p>
      </div>

      <div class="flex flex-col gap-[16px] w-full">
        <div v-for="(q, qIdx) in questions" :key="q.id" class="border border-[#28a745] rounded-[12px] p-[16px] bg-[#f0faf3] flex flex-col gap-[10px]">
          <div class="flex items-start justify-between gap-[12px]">
            <div class="flex-1">
              <p class="font-['Figtree:Bold',sans-serif] font-bold text-black text-[18px]">Questão {{ qIdx + 1 }}</p>
              <p class="font-['Figtree:Medium',sans-serif] font-medium text-black text-[16px] mt-[4px]">{{ q.text }}</p>
            </div>
            <span class="shrink-0 flex items-center gap-[5px] px-[10px] py-[4px] rounded-full bg-[#d4edda]">
              <span v-html="checkSvg('#155724')"></span>
              <span class="font-['Figtree:Medium',sans-serif] font-medium text-[#155724] text-[13px]">Correto — 1,0 pt</span>
            </span>
          </div>
        </div>
      </div>

      <button @click="handleReturn" class="bg-[#042e99] h-[52px] w-full rounded-[26px] text-[#ffeac4] font-['Figtree:Medium',sans-serif] text-[20px] hover:bg-[#021b59] transition-colors">
        Retornar ao curso
      </button>
    </div>

    <div v-else class="max-w-[900px] mx-auto flex flex-col gap-[28px] px-[20px] md:px-[40px] pt-[30px]">
      <h1 class="font-['Anek_Devanagari:ExtraBold',sans-serif] font-extrabold text-black text-[clamp(22px,5vw,34px)] leading-tight">
        Python Iniciante
      </h1>
      <h2 class="font-['Figtree:Bold',sans-serif] font-bold text-black text-[24px] -mt-[16px]">
        Prova 01 — Resultado
      </h2>

      <div class="flex items-center justify-between px-[20px] py-[16px] rounded-[12px] bg-[#801436]">
        <p class="font-['Figtree:Bold',sans-serif] font-bold text-[#ffeac4] text-[18px]">Resultado</p>
        <p class="font-['Figtree:Bold',sans-serif] font-bold text-[#ffeac4] text-[18px]">
          {{ totalCorrect }}/{{ questions.length }} acertos ({{ percentage }}%)
        </p>
      </div>

      <div v-for="(q, qIdx) in questions" :key="q.id" class="flex flex-col gap-[14px] border-b border-[#e0e0e0] pb-[28px]">
        <div class="flex items-start justify-between gap-[12px] flex-wrap">
          <div class="flex-1">
            <p class="font-['Figtree:Bold',sans-serif] font-bold text-black text-[20px]">Questão {{ qIdx + 1 }}</p>
            <p class="font-['Figtree:Medium',sans-serif] font-medium text-black text-[16px] mt-[4px]">{{ q.text }}</p>
          </div>
          
          <span v-if="userAnswers[q.id] === q.correctIndex" class="shrink-0 flex items-center gap-[5px] px-[10px] py-[5px] rounded-full bg-[#d4edda]">
            <span v-html="checkSvg('#155724')"></span>
            <span class="font-['Figtree:Medium',sans-serif] font-medium text-[#155724] text-[13px]">Correto — 1,0 pt</span>
          </span>
          <span v-else class="shrink-0 flex items-center gap-[5px] px-[10px] py-[5px] rounded-full bg-[#f8d7da]">
            <span v-html="xSvg('#721c24')"></span>
            <span class="font-['Figtree:Medium',sans-serif] font-medium text-[#721c24] text-[13px]">Incorreto — 0,0 pt</span>
          </span>
        </div>

        <div class="flex flex-col gap-[6px]">
          <div v-for="(opt, idx) in q.options" :key="idx"
            :class="[
              'flex items-center gap-[12px] py-[11px] px-[14px] rounded-[12px] border-2',
              idx === q.correctIndex ? 'bg-[#e8f8ee] border-[#28a745]' : 
              (idx === userAnswers[q.id] ? 'bg-[#ffebee] border-[#e74c3c]' : 'bg-white border-[#d0d0d0]')
            ]"
          >
            <div :class="[
              'shrink-0 size-[22px] border-2 rounded-[4px] flex items-center justify-center',
              idx === q.correctIndex ? 'bg-[#28a745] border-[#28a745]' : 
              (idx === userAnswers[q.id] ? 'bg-[#e74c3c] border-[#e74c3c]' : 'bg-white border-[#ccc]')
            ]">
              <span v-if="idx === q.correctIndex" v-html="checkSvg('white')"></span>
              <span v-else-if="idx === userAnswers[q.id]" v-html="xSvg('white')"></span>
            </div>
            <span class="font-['Figtree:Medium',sans-serif] font-medium text-[15px] text-[#021b59]">{{ optionLabels[idx] }})</span>
            <span :class="['font-[\'Figtree:Regular\',sans-serif] text-[15px] flex-1', idx === q.correctIndex ? 'text-[#155724]' : (idx === userAnswers[q.id] ? 'text-[#c0392b]' : 'text-black')]">
              {{ opt }}
            </span>
            <span v-if="idx === q.correctIndex" class="text-[12px] font-['Figtree:Medium',sans-serif] text-[#155724] bg-[#d4edda] px-[8px] py-[2px] rounded-full">
              Correta <span aria-hidden="true">✓</span>
            </span>
            <span v-else-if="idx === userAnswers[q.id]" class="text-[12px] font-['Figtree:Medium',sans-serif] text-white bg-[#e74c3c] px-[8px] py-[2px] rounded-full">
              Tua resposta
            </span>
          </div>
        </div>

        <div class="bg-[#f5f5f5] px-[16px] py-[10px] rounded-[8px]">
          <p class="font-['Figtree:Regular',sans-serif] text-black text-[15px]">
            <strong>Gabarito questão {{ qIdx + 1 }}:</strong> {{ q.correctLabel }}) {{ q.options[q.correctIndex] }}
          </p>
        </div>
      </div>

      <button @click="handleReturn" class="bg-[#ffeac4] h-[52px] w-full rounded-[26px] text-[#333] font-['Figtree:Medium',sans-serif] text-[20px] hover:bg-[#ffd9a0] transition-colors">
        Retornar ao curso
      </button>
    </div>
  </div>
</template>
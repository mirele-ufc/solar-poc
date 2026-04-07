<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRouter } from "vue-router";
import { fetchPythonExamQuestions, fetchOptionLabels, type Question } from "@/services/mocks/pythonExamMock";
import { useEnrollmentGuard } from "@/hooks/useEnrollmentGuard";

// Proteção de rota
useEnrollmentGuard("python");

const router = useRouter();

// --- Estado Reativo ---
const questions = ref<Question[]>([]);
const optionLabels = ref<string[]>([]);
const isLoading = ref(true);
const answers = ref<Record<string, number>>({});
const timeLeft = ref(20 * 60); // 20 minutos
const submitted = ref(false);
let timerInterval: number | null = null;

// --- Computeds ---
const answeredCount = computed(() => Object.keys(answers.value).length);
const isUrgent = computed(() => timeLeft.value <= 60);

// --- Helpers ---
function formatTime(secs: number): string {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// --- Métodos ---
const loadExamData = async () => {
  try {
    const [questionsData, labelsData] = await Promise.all([
      fetchPythonExamQuestions(),
      fetchOptionLabels(),
    ]);
    questions.value = questionsData;
    optionLabels.value = labelsData;
  } catch (error) {
    console.error("Erro ao carregar dados da prova:", error);
  } finally {
    isLoading.value = false;
  }
};

const handleAnswer = (questionId: string, optionIdx: number) => {
  if (submitted.value) return;
  answers.value = { ...answers.value, [questionId]: optionIdx };
};

/**
 * Finaliza a prova e redireciona para os resultados
 */
const handleSubmit = (autoSubmit = false) => {
  if (submitted.value) return;
  submitted.value = true;
  
  if (timerInterval) clearInterval(timerInterval);

  // Navega utilizando o NOME da rota definido no router/index.ts
  // Passamos as respostas convertidas em objeto simples para o history.state
  router.push({
    name: "python-exam-results",
    state: { answers: { ...answers.value } }
  });
};

const startTimer = () => {
  timerInterval = window.setInterval(() => {
    if (timeLeft.value <= 1) {
      timeLeft.value = 0;
      handleSubmit(true);
    } else {
      timeLeft.value--;
    }
  }, 1000);
};

// --- Ciclo de Vida ---
onMounted(() => {
  loadExamData();
  startTimer();
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});
</script>

<template>
  <div class="bg-white min-h-screen pb-[120px]">
    <div class="max-w-[900px] mx-auto px-[20px] md:px-[40px] pt-[24px] flex flex-col gap-[28px] w-full">

      <div class="flex items-center justify-between gap-[12px] flex-wrap">
        <div>
          <p class="font-['Figtree:Regular',sans-serif] text-[#606060] text-[14px]">
            Python Iniciante — Módulo 01
          </p>
          <h1 class="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[24px] leading-[34px]">
            Prova 01
          </h1>
        </div>

        <div
          :class="[
            'flex items-center gap-[8px] px-[16px] h-[44px] rounded-[26px] border-2 shrink-0 transition-colors',
            isUrgent ? 'border-[#de2e66] bg-[#fde8ef]' : 'border-[#021b59] bg-[#f5f8ff]'
          ]"
          role="timer"
          :aria-label="`Tempo restante: ${formatTime(timeLeft)}`"
        >
          <svg class="size-[18px] shrink-0" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"
              :fill="isUrgent ? '#de2e66' : '#021b59'"
            />
          </svg>
          <span
            :class="[
                'font-[\'Figtree:Bold\',sans-serif] font-bold text-[18px] tabular-nums',
                isUrgent ? 'text-[#de2e66]' : 'text-[#021b59]'
            ]"
          >
            {{ formatTime(timeLeft) }}
          </span>
        </div>
      </div>

      <div v-if="isLoading" class="py-[40px]">
        <p class="text-center text-[#606060]">Carregando questões da prova...</p>
      </div>

      <template v-else>
        <div class="flex items-center gap-[10px]">
          <div class="flex-1 h-[5px] bg-[#e0e0e0] rounded-full overflow-hidden">
            <div
              class="h-full bg-[#042e99] rounded-full transition-all duration-300"
              :style="{ width: `${(answeredCount / questions.length) * 100}%` }"
            />
          </div>
          <span class="font-['Figtree:Regular',sans-serif] text-[#606060] text-[12px] shrink-0">
            {{ answeredCount }}/{{ questions.length }} respondidas
          </span>
        </div>

        <div class="flex flex-col gap-[32px]">
          <fieldset 
            v-for="(q, qIdx) in questions" 
            :key="q.id" 
            class="flex flex-col gap-[14px] border-0 p-0 m-0"
          >
            <legend class="font-['Figtree:Bold',sans-serif] font-bold text-black text-[18px] leading-[28px] mb-[4px]">
              <span class="text-[#021b59]">Questão {{ qIdx + 1 }} — </span>
              {{ q.text }}
            </legend>

            <div class="flex flex-col gap-[8px]" role="radiogroup">
              <label
                v-for="(opt, idx) in q.options"
                :key="idx"
                :class="[
                  'flex items-center gap-[12px] px-[16px] py-[14px] rounded-[12px] border-2 cursor-pointer transition-colors',
                  answers[q.id] === idx
                    ? 'border-[#042e99] bg-[#e8eeff]'
                    : 'border-[#e0e0e0] bg-white hover:border-[#759BFB] hover:bg-[#f5f8ff]'
                ]"
              >
                <input
                  type="radio"
                  :name="`question-${q.id}`"
                  :value="idx"
                  :checked="answers[q.id] === idx"
                  @change="handleAnswer(q.id, idx)"
                  class="sr-only"
                />
                <div
                  :class="[
                    'shrink-0 size-[22px] rounded-full border-2 flex items-center justify-center transition-colors',
                    answers[q.id] === idx ? 'border-[#042e99] bg-[#042e99]' : 'border-[#8e8e8e] bg-white'
                  ]"
                >
                  <div v-if="answers[q.id] === idx" class="size-[8px] rounded-full bg-white" />
                </div>
                
                <span :class="['font-[\'Figtree:Medium\',sans-serif] font-medium text-[15px] shrink-0', answers[q.id] === idx ? 'text-[#042e99]' : 'text-[#021b59]']">
                  {{ optionLabels[idx] }})
                </span>
                <span :class="['font-[\'Figtree:Regular\',sans-serif] text-[15px] leading-[24px] flex-1', answers[q.id] === idx ? 'text-[#021b59]' : 'text-[#333]']">
                  {{ opt }}
                </span>
              </label>
            </div>
          </fieldset>
        </div>
      </template>
    </div>

    <div class="fixed bottom-0 left-0 right-0 bg-white px-[20px] py-[14px] shadow-[0px_-4px_12px_rgba(51,51,51,0.15)] flex justify-center z-10">
      <div class="w-full max-w-[900px] flex flex-col gap-[6px]">
        <p v-if="answeredCount < questions.length && !isLoading" class="font-['Figtree:Regular',sans-serif] text-[#606060] text-[13px] text-center">
          Responda todas as questões antes de finalizar ({{ answeredCount }}/{{ questions.length }})
        </p>
        
        <button
          type="button"
          @click="handleSubmit(false)"
          :disabled="answeredCount < questions.length || submitted"
          class="bg-[#021b59] h-[50px] w-full rounded-[26px] cursor-pointer hover:bg-[#042e99] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#ffeac4] focus-visible:outline-offset-[2px] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span class="font-['Figtree:Medium',sans-serif] font-medium text-white text-[20px]">
            Finalizar prova
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
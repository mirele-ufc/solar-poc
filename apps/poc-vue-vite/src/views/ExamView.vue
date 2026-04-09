<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  getCourseConfig,
  isValidCourseId,
  type ExamQuestion,
} from "@/config/coursesConfig";
import PageHeader from "@/components/shared/PageHeader.vue";
import { useEnrollmentGuard } from "@/hooks/useEnrollmentGuard";

// --- Constantes ---
const clockPath =
  "M12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22ZM20 12C20 9.87827 19.1571 7.84344 17.6569 6.34315C16.1566 4.84285 14.1217 4 12 4C9.87827 4 7.84344 4.84285 6.34315 6.34315C4.84285 7.84344 4 9.87827 4 12C4 14.1217 4.84285 16.1566 6.34315 17.6569C7.84344 19.1571 9.87827 20 12 20C14.1217 20 16.1566 19.1571 17.6569 17.6569C19.1571 16.1566 20 14.1217 20 12ZM16 11C16.2652 11 16.5196 11.1054 16.7071 11.2929C16.8946 11.4804 17 11.7348 17 12C17 12.2652 16.8946 12.5196 16.7071 12.7071C16.5196 12.8946 16.2652 13 16 13H13C11.9 13 11 12.1 11 11V7C11 6.73478 11.1054 6.48043 11.2929 6.29289C11.4804 6.10536 11.7348 6 12 6C12.2652 6 12.5196 6.10536 12.7071 6.29289C12.8946 6.48043 13 6.73478 13 7V11H16Z";

const OPTION_LABELS = ["A", "B", "C", "D"];

// --- Hooks e Guards ---
const router = useRouter();
const route = useRoute();
const courseId = route.params.id as string;

// Validar courseId
if (!courseId || !isValidCourseId(courseId)) {
  router.push("/courses");
}

const courseConfig = getCourseConfig(courseId)!;
useEnrollmentGuard(courseId);

// --- Estado ---
const questions = ref<ExamQuestion[]>([]);
const isLoading = ref(true);
const answers = ref<Record<string, number>>({});
const timeLeft = ref(3600);
const timeAnnouncement = ref("");
const showConfirmModal = ref(false);
const confirmButtonRef = ref<HTMLButtonElement | null>(null);

// Controle interno para não repetir anúncios de voz
const announcedMilestones = new Set<number>();
let timerInterval: number | null = null;

// --- Helpers ---
function formatTime(s: number) {
  const h = Math.floor(s / 3600)
    .toString()
    .padStart(2, "0");
  const m = Math.floor((s % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${h}:${m}:${sec}`;
}

const answeredCount = computed(() => Object.keys(answers.value).length);
const totalCount = computed(() => questions.value.length);
const allAnswered = computed(() => answeredCount.value === totalCount.value);

// --- Métodos ---
const loadExamData = async () => {
  questions.value = courseConfig.examQuestions;
  isLoading.value = false;
};

const pick = (questionId: string, optionIndex: number) => {
  answers.value = { ...answers.value, [questionId]: optionIndex };
};

const handleSubmit = () => {
  if (!allAnswered.value) return;
  showConfirmModal.value = true;
};

const confirmSubmit = () => {
  router.push({
    path: `/courses/${courseId}/exam/results`,
    state: { answers: JSON.parse(JSON.stringify(answers.value)) },
  });
};

const cancelSubmit = () => {
  showConfirmModal.value = false;
};

// --- Ciclo de Vida e Efeitos ---
const handleEsc = (e: KeyboardEvent) => {
  if (e.key === "Escape") cancelSubmit();
};

onMounted(() => {
  loadExamData();

  timerInterval = window.setInterval(() => {
    const next = Math.max(0, timeLeft.value - 1);
    timeLeft.value = next;

    const milestones = [300, 60, 30];
    for (const ms of milestones) {
      if (next === ms && !announcedMilestones.has(ms)) {
        announcedMilestones.add(ms);
        timeAnnouncement.value =
          ms === 300
            ? "5 minutos restantes"
            : ms === 60
              ? "1 minuto restante"
              : "30 segundos restantes";
      }
    }

    if (next === 0) {
      if (timerInterval) clearInterval(timerInterval);
      router.push({
        path: `/courses/${courseId}/exam/results`,
        state: { answers: JSON.parse(JSON.stringify(answers.value)) },
      });
    }
  }, 1000);
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
  document.removeEventListener("keydown", handleEsc);
});

// Observa o modal para gerenciar foco e listeners
watch(showConfirmModal, async (isOpen) => {
  if (isOpen) {
    document.addEventListener("keydown", handleEsc);
    await nextTick();
    confirmButtonRef.value?.focus();
  } else {
    document.removeEventListener("keydown", handleEsc);
  }
});
</script>

<template>
  <div class="bg-white min-h-screen pb-[60px]">
    <div role="status" aria-live="assertive" aria-atomic="true" class="sr-only">
      {{ timeAnnouncement }}
    </div>

    <div
      class="max-w-[900px] mx-auto flex flex-col gap-[28px] px-[20px] md:px-[40px] pt-[30px]"
    >
      <PageHeader
        title="Prova 01"
        :backPath="`/courses/${courseId}/modules/1`"
        :crumbs="[
          { label: 'Cursos', path: '/courses' },
          { label: courseConfig.name, path: `/courses/${courseId}` },
          { label: 'Módulos', path: `/courses/${courseId}/modules` },
          { label: 'Módulo 01', path: `/courses/${courseId}/modules/1` },
          { label: 'Prova 01' },
        ]"
      />

      <div v-if="isLoading">
        <p class="text-center text-[#606060] py-[40px]">Carregando prova...</p>
      </div>

      <div v-else class="flex flex-col gap-[28px]">
        <p
          class="font-['Anek_Devanagari:ExtraBold',sans-serif] font-extrabold leading-tight text-black"
          style="
            font-size: clamp(22px, 5vw, 34px);
            font-variation-settings: &quot;wdth&quot; 100;
          "
        >
          {{ courseConfig.title }}
        </p>

        <div
          class="flex items-center justify-between border-b border-[#e0e0e0] pb-[16px]"
        >
          <h2
            class="font-['Figtree:Bold',sans-serif] font-bold text-black text-[26px] leading-tight"
          >
            Prova 01
          </h2>
          <div
            class="flex items-center gap-[8px] bg-[#f5f5f5] px-[14px] py-[6px] rounded-[8px]"
            aria-live="off"
            :aria-label="`Tempo restante: ${formatTime(timeLeft)}`"
          >
            <svg
              class="size-[20px] shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                :d="clockPath"
                fill="#595959"
              />
            </svg>
            <span
              class="font-['Figtree:Medium',sans-serif] font-medium text-[#595959] text-[17px] tabular-nums"
            >
              {{ formatTime(timeLeft) }}
            </span>
          </div>
        </div>

        <fieldset
          v-for="(q, qIdx) in questions"
          :key="q.id"
          class="flex flex-col gap-[14px] border-0 p-0 m-0"
        >
          <legend class="float-left w-full">
            <div class="flex items-start justify-between gap-[12px]">
              <div class="flex-1 min-w-0">
                <p
                  :id="`question-${q.id}-legend`"
                  class="font-['Figtree:Bold',sans-serif] font-bold text-black text-[20px] leading-tight mb-[6px]"
                >
                  Questão {{ qIdx + 1 }}
                </p>
                <p
                  class="font-['Figtree:Medium',sans-serif] font-medium text-black text-[17px] leading-[26px]"
                >
                  {{ q.text }}
                </p>
              </div>
              <div
                class="shrink-0 bg-[#f5f5f5] px-[14px] py-[6px] rounded-[8px]"
              >
                <span
                  class="font-['Figtree:Medium',sans-serif] font-medium text-[#595959] text-[15px] whitespace-nowrap"
                >
                  1,0 pt
                </span>
              </div>
            </div>
          </legend>

          <div class="flex flex-col gap-[8px] clear-both">
            <label
              v-for="(opt, idx) in q.options"
              :key="`${q.id}-opt-${idx}`"
              :for="`${q.id}-opt-${idx}`"
              :class="[
                'flex items-center gap-[12px] w-full text-left py-[12px] px-[14px] rounded-[12px] border-2 transition-colors cursor-pointer',
                'has-[:focus-visible]:outline has-[:focus-visible]:outline-[2px] has-[:focus-visible]:outline-[#021b59] has-[:focus-visible]:outline-offset-[2px]',
                answers[q.id] === idx
                  ? 'border-[#021b59] bg-[#ffeac4]'
                  : 'border-[#d0d0d0] bg-white hover:bg-[#f5f5f5]',
              ]"
            >
              <input
                :id="`${q.id}-opt-${idx}`"
                type="radio"
                :name="q.id"
                :value="idx"
                :checked="answers[q.id] === idx"
                @change="pick(q.id, idx)"
                class="sr-only"
              />
              <div
                :class="[
                  'shrink-0 size-[22px] border-2 rounded-[4px] flex items-center justify-center transition-colors',
                  answers[q.id] === idx
                    ? 'bg-[#ffeac4] border-[#021b59]'
                    : 'bg-white border-[#aaa]',
                ]"
                aria-hidden="true"
              >
                <svg
                  v-if="answers[q.id] === idx"
                  class="size-[13px]"
                  fill="none"
                  viewBox="0 0 22 22"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M5 9L3 11L9 17L19 7L17 5L9 13L5 9Z"
                    fill="#021B59"
                  />
                </svg>
              </div>
              <span
                class="font-['Figtree:Medium',sans-serif] font-medium text-[15px] text-[#021b59] shrink-0"
              >
                {{ OPTION_LABELS[idx] }}
              </span>
              <span
                class="font-['Figtree:Regular',sans-serif] font-normal text-[16px] text-black leading-[24px] flex-1"
              >
                {{ opt }}
              </span>
            </label>
          </div>
        </fieldset>

        <div class="pt-[8px]">
          <button
            type="button"
            @click="handleSubmit"
            :disabled="!allAnswered"
            :class="[
              'h-[52px] w-full rounded-[26px] transition-colors',
              'focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59]',
              allAnswered
                ? 'bg-[#ffeac4] cursor-pointer hover:bg-[#ffd9a0]'
                : 'bg-[#e0e0e0] cursor-not-allowed opacity-60',
            ]"
          >
            <span
              class="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[20px]"
            >
              {{
                allAnswered
                  ? "Enviar"
                  : `Responda todas as questões (${answeredCount}/${totalCount})`
              }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showConfirmModal"
      class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40 px-[20px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-description"
      @click.self="cancelSubmit"
    >
      <div
        class="bg-white rounded-[12px] w-full max-w-[460px] p-[28px] shadow-xl"
      >
        <h2
          id="confirm-title"
          class="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[24px] leading-[36px] mb-[12px]"
        >
          Deseja finalizar a prova e enviar?
        </h2>
        <p
          id="confirm-description"
          class="font-['Figtree:Regular',sans-serif] font-normal text-[#333] text-[16px] leading-[24px] mb-[24px]"
        >
          Ao confirmar o envio, você não poderá alterar as respostas.
        </p>
        <div class="flex flex-col sm:flex-row gap-[12px] sm:gap-[16px]">
          <button
            type="button"
            @click="cancelSubmit"
            class="h-[48px] flex-1 rounded-[26px] bg-white border-2 border-[#021b59] transition-colors hover:bg-[#f5f5f5] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59] focus-visible:outline-offset-[2px]"
          >
            <span
              class="font-['Figtree:Medium',sans-serif] font-medium text-[#021b59] text-[18px]"
            >
              Cancelar
            </span>
          </button>
          <button
            ref="confirmButtonRef"
            type="button"
            @click="confirmSubmit"
            class="h-[48px] flex-1 rounded-[26px] bg-[#021b59] transition-colors hover:bg-[#042e99] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59] focus-visible:outline-offset-[2px]"
          >
            <span
              class="font-['Figtree:Medium',sans-serif] font-medium text-white text-[18px]"
            >
              Enviar respostas
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

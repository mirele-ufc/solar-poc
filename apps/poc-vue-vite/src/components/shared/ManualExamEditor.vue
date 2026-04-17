<script setup lang="ts">
import { ref, onMounted } from "vue";
import { quizService } from "@/services/api/quizService";

const props = defineProps<{
  moduleId: string;
  initialQuestions?: Question[];
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "saved", questions: Question[]): void;
}>();

type Tab = "Perguntas" | "Respostas" | "Configurações";
type Option = { id: string; text: string };
type Question = {
  id: string;
  text: string;
  options: Option[];
  correctOptionId: string;
  points: number;
};

const CLOSE_SM =
  "M10.657 12.071L5 6.414L6.414 5L12.071 10.657L17.728 5L19.142 6.414L13.485 12.071L19.142 17.728L17.728 19.142L12.071 13.485L6.414 19.142L5 17.728L10.657 12.071Z";
const DOC =
  "M19.6667 5.66667H7.66667V27H23.6667V9.66667H19.6667V5.66667ZM7.66667 3H21L26.3333 8.33333V27C26.3333 27.7072 26.0524 28.3855 25.5523 28.8856C25.0522 29.3857 24.3739 29.6667 23.6667 29.6667H7.66667C6.95942 29.6667 6.28115 29.3857 5.78105 28.8856C5.28095 28.3855 5 27.7072 5 27V5.66667C5 4.95942 5.28095 4.28115 5.78105 3.78105C6.28115 3.28095 6.95942 3 7.66667 3ZM10.3333 15H21V17.6667H10.3333V15ZM10.3333 20.3333H21V23H10.3333V20.3333Z";
const BLUE_CHECK = "M6 10L4 12L10 18L20 8L18 6L10 14L6 10Z";
const IMG_ICON =
  "M19 15H29L33 19V33C33 33.5304 32.7893 34.0391 32.4142 34.4142C32.0391 34.7893 31.5304 35 31 35H19C18.4696 35 17.9609 34.7893 17.5858 34.4142C17.2107 34.0391 17 33.5304 17 33V17C17 16.4696 17.2107 15.9609 17.5858 15.5858C17.9609 15.2107 18.4696 15 19 15ZM28.172 17H19V33H31V19.828H28.172V17ZM28 27C27.7348 27 27.4804 27.2929 26.7071C27.1054 26.5196 27 26.2652 27 26C27 25.7348 27.1054 25.4804 27.2929 25.2929C27.4804 25.1054 27.7348 25 28 25C28.2652 25 28.5196 25.1054 28.7071 25.2929C28.8946 25.4804 29 25.7348 29 26C29 26.2652 28.8946 26.5196 28.7071 26.7071C28.5196 26.8946 28.2652 27 28 27ZM21 29L24.07 26L27 29L28 28L29 29V31H21V29Z";

let _id = Date.now();
const uid = () => String(_id++);

const activeTab = ref<Tab>("Perguntas");
const questions = ref<Question[]>([]);
const questionText = ref("");
const options = ref<Option[]>([
  { id: uid(), text: "" },
  { id: uid(), text: "" },
]);
const correctOptionId = ref("");
const points = ref(1);
const formError = ref("");
const isSavingQuiz = ref(false);

onMounted(() => {
  if (props.initialQuestions && props.initialQuestions.length > 0) {
    questions.value = [...props.initialQuestions];
  }
});

const resetQuestionForm = () => {
  questionText.value = "";
  options.value = [
    { id: uid(), text: "" },
    { id: uid(), text: "" },
  ];
  correctOptionId.value = "";
  points.value = 1;
  formError.value = "";
};

const addQuestion = () => {
  if (!questionText.value.trim()) {
    formError.value = "Escreva o texto da pergunta.";
    return;
  }
  const filled = options.value.filter((o) => o.text.trim());
  if (filled.length < 2) {
    formError.value = "Adicione pelo menos 2 alternativas.";
    return;
  }
  if (!correctOptionId.value) {
    formError.value = "Selecione a resposta correta.";
    return;
  }

  questions.value.push({
    id: uid(),
    text: questionText.value,
    options: [...filled],
    correctOptionId: correctOptionId.value,
    points: points.value,
  });
  resetQuestionForm();
};

const saveExam = async () => {
  if (questions.value.length === 0) {
    emit("close");
    return;
  }

  isSavingQuiz.value = true;
  formError.value = "";

  try {
    const payload = {
      questions: questions.value.map((q) => ({
        statement: q.text,
        points: q.points,
        alternatives: q.options.map((opt) => ({
          text: opt.text,
          correct: opt.id === q.correctOptionId,
        })),
      })),
    };

    await quizService.createQuizWithQuestions(props.moduleId, payload);
    emit("saved", questions.value);
  } catch (error: unknown) {
    formError.value =
      (error instanceof Error ? error.message : null) ||
      "Erro ao salvar a prova no servidor. Tente novamente.";
  } finally {
    isSavingQuiz.value = false;
  }
};
</script>

<template>
  <div
    class="max-w-[900px] mx-auto w-full px-[20px] md:px-[40px] pt-[20px] flex flex-col"
  >
    <div class="flex items-center justify-between mb-[16px]">
      <p class="font-bold text-[#021b59] text-[18px]">Adicionar prova</p>
      <button
        @click="emit('close')"
        class="text-[#801436] font-medium text-[14px] hover:underline"
      >
        Cancelar e Voltar
      </button>
    </div>

    <div
      v-if="formError"
      class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-center font-medium"
    >
      {{ formError }}
    </div>

    <div class="flex w-full border-b border-[#e0e0e0] mb-6">
      <button
        v-for="tab in ['Perguntas', 'Respostas', 'Configurações'] as Tab[]"
        :key="tab"
        @click="tab === 'Perguntas' && (activeTab = tab)"
        :disabled="tab !== 'Perguntas'"
        class="flex-1 pt-2 flex flex-col items-center transition-opacity"
        :class="{ 'opacity-40 cursor-not-allowed': tab !== 'Perguntas' }"
      >
        <span
          class="font-semibold text-[18px] pb-2"
          :class="activeTab === tab ? 'text-black' : 'text-gray-400'"
          >{{ tab }}</span
        >
        <div v-if="activeTab === tab" class="w-full h-[3px] bg-[#efbbdc]"></div>
      </button>
    </div>

    <div v-if="activeTab === 'Perguntas'" class="flex flex-col gap-5">
      <div
        v-for="(q, idx) in questions"
        :key="q.id"
        class="bg-[#c5d6ff] h-[56px] flex items-center justify-between px-4 rounded"
      >
        <span class="text-[18px] font-medium truncate"
          >Questão {{ String(idx + 1).padStart(2, "0") }} — {{ q.text }}</span
        >
        <button
          @click="questions = questions.filter((item) => item.id !== q.id)"
        >
          <svg class="size-6" viewBox="0 0 24 24">
            <path :d="CLOSE_SM" fill="#801436" />
          </svg>
        </button>
      </div>

      <div class="flex gap-4 items-end mt-2">
        <div class="flex-1 flex flex-col gap-1">
          <label class="font-medium text-[#333] text-[20px]"
            >Texto da pergunta</label
          >
          <input
            v-model="questionText"
            type="text"
            placeholder="Escreva sua pergunta"
            class="w-full border border-[#8e8e8e] h-[50px] rounded px-5"
          />
        </div>
        <button
          class="size-[50px] rounded-full bg-[#ffeac4] flex items-center justify-center shrink-0"
        >
          <svg class="size-8" viewBox="0 0 50 50">
            <path :d="IMG_ICON" fill="black" />
          </svg>
        </button>
      </div>

      <div class="flex flex-col gap-2">
        <p class="font-medium text-[18px]">Alternativas</p>
        <div
          v-for="(opt, idx) in options"
          :key="opt.id"
          class="flex items-center gap-2"
        >
          <span class="text-[#021b59] font-medium w-5"
            >{{ String.fromCharCode(65 + idx) }})</span
          >
          <input
            v-model="opt.text"
            type="text"
            :placeholder="'Alternativa ' + String.fromCharCode(65 + idx)"
            class="flex-1 border border-[#8e8e8e] h-11 rounded px-3"
          />
          <button
            v-if="options.length > 2"
            @click="options = options.filter((o) => o.id !== opt.id)"
          >
            <svg class="size-5" viewBox="0 0 24 24">
              <path :d="CLOSE_SM" fill="#801436" />
            </svg>
          </button>
        </div>
        <button
          @click="options.push({ id: uid(), text: '' })"
          class="text-[#021b59] self-start mt-1 font-medium"
        >
          + Adicionar alternativa
        </button>
      </div>

      <div class="flex flex-col gap-1">
        <p class="font-medium text-[18px]">Resposta correta</p>
        <select
          v-model="correctOptionId"
          class="w-full h-[50px] border border-[#8e8e8e] rounded px-4 bg-white outline-none"
        >
          <option value="" disabled>Selecione a resposta correta</option>
          <option
            v-for="(opt, idx) in options.filter((o) => o.text)"
            :key="opt.id"
            :value="opt.id"
          >
            {{ String.fromCharCode(65 + idx) }}) {{ opt.text }}
          </option>
        </select>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <svg class="size-6" viewBox="0 0 24 24">
            <path :d="BLUE_CHECK" fill="#1E40C5" />
          </svg>
          <span class="font-semibold text-[#1e40c5]"
            >Configure a questão: {{ points }} ponto(s)</span
          >
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="points = Math.max(1, points - 1)"
            class="size-7 rounded-full border border-[#021b59] flex items-center justify-center font-bold text-[#021b59] hover:bg-[#f5f8ff]"
          >
            −
          </button>
          <span class="w-5 text-center font-medium">{{ points }}</span>
          <button
            @click="points++"
            class="size-7 rounded-full border border-[#021b59] flex items-center justify-center font-bold text-[#021b59] hover:bg-[#f5f8ff]"
          >
            +
          </button>
        </div>
      </div>

      <button
        @click="addQuestion"
        class="w-full border-2 border-[#021b59] rounded-[26px] h-[50px] flex items-center justify-center gap-2 hover:bg-[#f5f8ff] transition-colors mt-2"
      >
        <svg class="size-7" viewBox="0 0 32 32">
          <path :d="DOC" fill="#021B59" />
        </svg>
        <span class="font-medium text-[20px] text-[#021b59]"
          >Adicionar pergunta</span
        >
      </button>
    </div>

    <div
      class="fixed bottom-0 left-0 right-0 bg-white px-[20px] py-[16px] shadow-[0px_-4px_12px_rgba(51,51,51,0.2)] flex justify-center z-10"
    >
      <button
        @click="saveExam"
        :disabled="isSavingQuiz"
        class="bg-[#ffeac4] h-[50px] w-full max-w-[900px] rounded-[26px] font-medium text-[20px] disabled:opacity-70 flex items-center justify-center transition-all hover:bg-[#ffd9a0]"
      >
        <svg
          v-if="isSavingQuiz"
          class="animate-spin -ml-1 mr-3 h-5 w-5 text-[#021b59]"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        {{ isSavingQuiz ? "Salvando Prova" : "Salvar" }}
      </button>
    </div>
  </div>
</template>

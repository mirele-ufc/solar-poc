<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { quizService } from "@/services/api/quizService";
import { useCourseCreationStore } from "@/store/useCourseCreationStore";
import { moduleService } from "@/services/api/moduleService";
import { lessonService } from "@/services/api/lessonService";
import ManualExamEditor from "@/components/shared/ManualExamEditor.vue"; // Certifique-se de que o caminho está correto

type Lesson = { id: string; name: string };
type ModuleData = { id: string; name: string; lessons: Lesson[] };
type Question = {
  id: string;
  text: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  points: number;
};

interface AIQuestionData {
  text: string;
  options: string[];
  correctAnswerIndex: number;
}

const CLOSE_SM =
  "M10.657 12.071L5 6.414L6.414 5L12.071 10.657L17.728 5L19.142 6.414L13.485 12.071L19.142 17.728L17.728 19.142L12.071 13.485L6.414 19.142L5 17.728L10.657 12.071Z";
const EDIT_ICON =
  "M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z";

let _id = Date.now();
const uid = () => String(_id++);
const router = useRouter();
const store = useCourseCreationStore();
const courseTitle = computed(
  () =>
    store.courseData?.title || history.state?.courseData?.title || "Novo Curso",
);
const modulesList = ref<ModuleData[]>([]);
const isLoading = ref(true);

const editorOpen = ref(false);
const editingModId = ref<string | null>(null);

const editingLesson = ref<{
  modId: string;
  lessonId: string;
  name: string;
  fileName?: string;
} | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);
const moduleProvas = ref<Record<string, Question[]>>({});

const aiReviewModId = ref<string | null>(null);
const parsedAIQuestions = ref<AIQuestionData[]>([]);
const isGeneratingAI = ref(false);
const aiSuccessMessage = ref("");
const aiErrorMessage = ref("");

onMounted(async () => {
  const courseId = store.courseData?.id;
  if (!courseId) {
    isLoading.value = false;
    return;
  }
  try {
    isLoading.value = true;
    const fetchedModules = await moduleService.getModulesByCourse(courseId);

    const modulesWithLessons = await Promise.all(
      fetchedModules.map(async (mod) => {
        const fetchedLessons = await lessonService.getLessonsByModule(mod.id);
        return {
          id: String(mod.id),
          name: mod.name,
          lessons: fetchedLessons.map((l) => ({
            id: String(l.id),
            name: l.name,
          })),
        };
      }),
    );
    modulesList.value = modulesWithLessons;
  } catch (error) {
    console.error("Erro ao carregar estrutura do curso:", error);
  } finally {
    isLoading.value = false;
  }
});

const openEditLesson = (modId: string, lessonId: string) => {
  const mod = modulesList.value.find((m) => m.id === modId);
  const lesson = mod?.lessons.find((l) => l.id === lessonId);
  if (lesson) editingLesson.value = { modId, lessonId, name: lesson.name };
};

const saveLessonEdit = () => {
  if (!editingLesson.value) return;
  const { modId, lessonId, name } = editingLesson.value;
  const mod = modulesList.value.find((m) => m.id === modId);
  if (mod) {
    const lesson = mod.lessons.find((l) => l.id === lessonId);
    if (lesson) lesson.name = name;
  }
  editingLesson.value = null;
};

const removeLesson = (modId: string, lessonId: string) => {
  const mod = modulesList.value.find((m) => m.id === modId);
  if (mod) mod.lessons = mod.lessons.filter((l) => l.id !== lessonId);
};

const openEditor = (modId: string) => {
  editingModId.value = modId;
  editorOpen.value = true;
};

const handleExamSaved = (modId: string, newQuestions: Question[]) => {
  moduleProvas.value[modId] = [...newQuestions];
  editorOpen.value = false;
  editingModId.value = null;
};

interface RawQuizQuestion {
  statement?: string;
  text?: string;
  pergunta?: string;
  alternatives?: RawAlternative[];
  options?: RawAlternative[];
  correctAnswerIndex?: number;
  respostaCorreta?: number;
}

interface RawAlternative {
  text?: string;
  correct?: boolean;
}

const parseApiResponse = (response: unknown): AIQuestionData[] => {
  let content = typeof response === "string" ? JSON.parse(response) : response;

  if (content && !Array.isArray(content)) {
    const obj = content as Record<string, unknown>;
    content = obj.questions || obj.questoes || obj.dados || obj.data || [];
  }

  if (!Array.isArray(content)) return [];

  return (content as RawQuizQuestion[]).map((q) => {
    const rawOptions = q.alternatives || q.options || [];

    const normalizedOptions = rawOptions.map((o) =>
      typeof o === "string" ? o : (o as RawAlternative).text || "",
    );

    let correctIdx = rawOptions.findIndex(
      (o) => (o as RawAlternative).correct === true,
    );

    if (correctIdx === -1) {
      correctIdx = Number(q.correctAnswerIndex ?? q.respostaCorreta ?? 0);
    }

    return {
      text:
        q.statement ||
        q.text ||
        q.pergunta ||
        "Texto da pergunta não encontrado",
      options: normalizedOptions,
      correctAnswerIndex: correctIdx,
    };
  });
};

const openAIGenerator = async (modId: string) => {
  aiReviewModId.value = modId;
  parsedAIQuestions.value = [];
  aiSuccessMessage.value = "";
  aiErrorMessage.value = "";
  isGeneratingAI.value = true;

  try {
    const response = await quizService.generateAIQuiz(modId);
    parsedAIQuestions.value = parseApiResponse(response);

    if (parsedAIQuestions.value.length === 0) {
      throw new Error("A IA não retornou nenhuma questão estruturada.");
    }

    aiSuccessMessage.value = "Prova gerada com sucesso";
  } catch (err: unknown) {
    aiErrorMessage.value =
      (err instanceof Error ? err.message : null) ||
      "Ocorreu um erro ao gerar a prova.";
  } finally {
    isGeneratingAI.value = false;
  }
};

const handleRegenerateAIQuiz = async () => {
  if (!aiReviewModId.value) return;
  isGeneratingAI.value = true;
  parsedAIQuestions.value = [];
  aiSuccessMessage.value = "";
  aiErrorMessage.value = "";

  try {
    const response = await quizService.regenerateAIQuiz(aiReviewModId.value);
    parsedAIQuestions.value = parseApiResponse(response);

    aiSuccessMessage.value = "Conteúdo regerado com sucesso";
  } catch (err: unknown) {
    aiErrorMessage.value =
      (err instanceof Error ? err.message : null) ||
      "Erro ao tentar regerar o conteúdo.";
  } finally {
    isGeneratingAI.value = false;
  }
};

const handleConfirmAIQuiz = async () => {
  if (!aiReviewModId.value) return;
  isGeneratingAI.value = true;
  aiErrorMessage.value = "";

  try {
    const confirmedData = (await quizService.confirmAIQuiz(
      aiReviewModId.value,
    )) as Record<string, unknown> | undefined;

    if (!moduleProvas.value[aiReviewModId.value]) {
      moduleProvas.value[aiReviewModId.value] = [];
    }

    moduleProvas.value[aiReviewModId.value].push({
      id:
        (confirmedData &&
        typeof confirmedData === "object" &&
        "id" in confirmedData
          ? String(confirmedData.id)
          : null) || uid(),
      text: "Prova Gerada por IA",
      options: [],
      correctOptionId: "",
      points: 1,
    });

    closeAIReview();
  } catch (err: unknown) {
    aiErrorMessage.value =
      (err instanceof Error ? err.message : null) ||
      "Erro ao tentar confirmar o conteúdo.";
    isGeneratingAI.value = false;
  }
};

const closeAIReview = () => {
  aiReviewModId.value = null;
  parsedAIQuestions.value = [];
  aiSuccessMessage.value = "";
  aiErrorMessage.value = "";
};

const deleteQuiz = async (modId: string) => {
  if (!confirm("Tem certeza que deseja excluir a prova deste módulo?")) return;

  try {
    moduleProvas.value[modId] = [];
  } catch (error) {
    console.error("Erro ao deletar prova", error);
    alert("Ocorreu um erro ao excluir a prova.");
  }
};
</script>

<template>
  <div class="bg-white min-h-screen flex flex-col pb-[100px]">
    <div
      v-if="!editorOpen"
      class="max-w-[900px] mx-auto flex flex-col gap-[20px] px-[20px] md:px-[40px] pt-[30px] w-full"
    >
      <h1 class="font-bold text-[#021b59] text-[22px] leading-[32px]">
        {{ courseTitle }} — Provas
      </h1>

      <div
        v-for="mod in modulesList"
        :key="mod.id"
        class="border border-black rounded-[4px] overflow-hidden"
      >
        <div class="p-[16px] flex flex-col gap-[16px]">
          <div class="flex justify-between items-center">
            <p class="font-bold text-[#021b59] text-[20px]">{{ mod.name }}</p>
            <button
              @click="modulesList = modulesList.filter((m) => m.id !== mod.id)"
              class="size-[26px]"
            >
              <svg class="size-full" viewBox="0 0 24 24">
                <path :d="CLOSE_SM" fill="#801436" />
              </svg>
            </button>
          </div>

          <div
            v-for="lesson in mod.lessons"
            :key="lesson.id"
            class="bg-[#c5d6ff] h-[60px] flex items-center justify-between px-[20px]"
          >
            <p class="text-[20px] font-medium text-black truncate flex-1">
              {{ lesson.name }}
            </p>
            <div class="flex items-center gap-[8px] ml-2">
              <button
                @click="openEditLesson(mod.id, lesson.id)"
                class="size-[24px]"
              >
                <svg class="size-full" viewBox="0 0 24 24">
                  <path :d="EDIT_ICON" fill="#021b59" />
                </svg>
              </button>
              <button
                @click="removeLesson(mod.id, lesson.id)"
                class="size-[24px]"
              >
                <svg class="size-full" viewBox="0 0 24 24">
                  <path :d="CLOSE_SM" fill="#801436" />
                </svg>
              </button>
            </div>
          </div>

          <div
            v-if="moduleProvas[mod.id] && moduleProvas[mod.id].length > 0"
            class="bg-[#c5d6ff] h-[60px] flex items-center justify-between px-[20px] rounded mb-2"
          >
            <p class="text-[20px] font-medium text-black truncate flex-1">
              Prova do Módulo
              <span class="text-[16px] font-normal text-[#555] ml-1">
                ({{ moduleProvas[mod.id].length }}
                {{
                  moduleProvas[mod.id].length === 1 ? "questão" : "questões"
                }})
              </span>
            </p>

            <div class="flex items-center gap-[12px]">
              <button
                @click="openEditor(mod.id)"
                class="size-[24px] hover:scale-110 transition-transform"
              >
                <svg class="size-full" viewBox="0 0 24 24">
                  <path :d="EDIT_ICON" fill="#021b59" />
                </svg>
              </button>
              <button
                @click="deleteQuiz(mod.id)"
                class="size-[24px] hover:scale-110 transition-transform"
              >
                <svg class="size-full" viewBox="0 0 24 24">
                  <path :d="CLOSE_SM" fill="#801436" />
                </svg>
              </button>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row items-center gap-[12px] mt-2">
            <button
              @click="openEditor(mod.id)"
              :disabled="
                moduleProvas[mod.id] && moduleProvas[mod.id].length > 0
              "
              class="flex-1 w-full bg-[#ffeac4] h-[60px] rounded-[26px] font-medium text-[18px] transition-colors hover:bg-[#ffd9a0] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#ffeac4]"
            >
              Adicionar prova manual
            </button>

            <button
              @click="openAIGenerator(mod.id)"
              :disabled="
                moduleProvas[mod.id] && moduleProvas[mod.id].length > 0
              "
              class="flex-1 w-full bg-[#021b59] text-[#ffeac4] h-[60px] rounded-[26px] font-medium text-[18px] transition-colors flex items-center justify-center gap-2 hover:bg-[#032a8a] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#021b59]"
            >
              Adicionar prova gerada com IA
            </button>
          </div>
        </div>
      </div>

      <div
        class="fixed bottom-0 left-0 right-0 bg-white px-[20px] py-[16px] shadow-[0px_-4px_12px_rgba(51,51,51,0.15)] flex justify-center z-10"
      >
        <button
          @click="router.push('/courses')"
          class="bg-[#ffeac4] h-[50px] w-full max-w-[900px] rounded-[26px] font-medium text-[20px] hover:bg-[#ffd9a0] transition-colors"
        >
          Finalizar
        </button>
      </div>
    </div>

    <ManualExamEditor
      v-else-if="editorOpen && editingModId"
      :module-id="editingModId"
      :initial-questions="moduleProvas[editingModId] || []"
      @close="
        editorOpen = false;
        editingModId = null;
      "
      @saved="(questions) => handleExamSaved(editingModId!, questions)"
    />

    <div
      v-if="editingLesson"
      class="fixed inset-0 z-50 flex items-center justify-center px-5"
    >
      <div
        class="fixed inset-0 bg-black/40 backdrop-blur-sm"
        @click="editingLesson = null"
      ></div>
      <div
        class="bg-white w-full max-w-[400px] rounded-[12px] shadow-xl p-6 flex flex-col gap-5 z-50"
      >
        <h2 class="font-bold text-[#021b59] text-[20px]">Editar aula</h2>
        <div class="flex flex-col gap-1">
          <label class="font-medium text-[#333]">Nome da aula</label>
          <input
            v-model="editingLesson.name"
            type="text"
            class="w-full border border-[#8e8e8e] h-[50px] rounded-[12px] px-4"
          />
        </div>
        <div class="flex flex-col gap-2">
          <p class="font-medium">Arquivo da aula</p>
          <p class="text-[#606060] text-sm">
            Deseja substituir o arquivo atual por um novo?
          </p>
          <input type="file" ref="fileInputRef" class="hidden" />
          <button
            @click="fileInputRef?.click()"
            class="bg-[#ffeac4] h-10 w-full rounded-[26px] font-medium"
          >
            Adicionar arquivo
          </button>
        </div>
        <div class="flex gap-3">
          <button
            @click="editingLesson = null"
            class="flex-1 h-[46px] border-2 border-[#021b59] rounded-[26px] text-[#021b59]"
          >
            Cancelar
          </button>
          <button
            @click="saveLessonEdit"
            class="flex-1 h-[46px] bg-[#021b59] rounded-[26px] text-[#ffeac4]"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="aiReviewModId"
      class="fixed inset-0 z-50 flex items-center justify-center px-[20px] py-[40px]"
    >
      <div
        class="fixed inset-0 bg-black/40 backdrop-blur-sm"
        @click="!isGeneratingAI && closeAIReview()"
      ></div>

      <div
        class="bg-white w-full max-w-[900px] h-[90vh] flex flex-col rounded-[16px] shadow-2xl p-[24px] z-50"
      >
        <div
          class="flex items-center justify-between border-b border-[#e0e0e0] pb-[16px] mb-[20px] shrink-0"
        >
          <div>
            <h2
              class="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[24px] leading-tight"
            >
              Revisão da Prova Gerada por IA
            </h2>
            <p
              class="font-['Figtree:Medium',sans-serif] text-[#595959] text-[15px] mt-1"
            >
              Confira as questões e a indicação de resposta correta antes de
              confirmar.
            </p>
          </div>
          <button
            @click="!isGeneratingAI && closeAIReview()"
            class="size-[40px] flex items-center justify-center hover:bg-[#f5f5f5] rounded-full transition-colors focus-visible:outline focus-visible:outline-[#021b59]"
            :disabled="isGeneratingAI"
          >
            <svg class="size-[20px]" viewBox="0 0 24 24">
              <path :d="CLOSE_SM" fill="#801436" />
            </svg>
          </button>
        </div>

        <div
          v-if="isGeneratingAI"
          class="flex-1 flex flex-col items-center justify-center gap-4"
        >
          <svg
            class="size-12 animate-spin text-[#021b59]"
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
          <p
            class="font-['Figtree:Medium',sans-serif] text-[#021b59] text-[18px] animate-pulse"
          >
            A IA está processando o conteúdo da aula...
          </p>
        </div>

        <div
          v-else-if="parsedAIQuestions.length > 0"
          class="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-[32px] pr-[10px] mt-[10px]"
        >
          <fieldset
            v-for="(q, qIdx) in parsedAIQuestions"
            :key="qIdx"
            class="flex flex-col gap-[14px] border-0 p-0 m-0"
          >
            <legend
              class="font-['Figtree:Bold',sans-serif] font-bold text-black text-[18px] leading-[28px] mb-[4px] w-full float-left"
            >
              <span class="text-[#021b59]">Questão {{ qIdx + 1 }} — </span>
              {{ q.text }}
            </legend>

            <div class="flex flex-col gap-[8px] clear-both">
              <div
                v-for="(opt, idx) in q.options"
                :key="idx"
                :class="[
                  'flex items-center gap-[12px] px-[16px] py-[14px] rounded-[12px] border-2 transition-colors',
                  idx === q.correctAnswerIndex
                    ? 'border-[#042e99] bg-[#e8eeff]'
                    : 'border-[#e0e0e0] bg-white opacity-90',
                ]"
              >
                <div
                  :class="[
                    'shrink-0 size-[22px] rounded-full border-2 flex items-center justify-center transition-colors',
                    idx === q.correctAnswerIndex
                      ? 'border-[#042e99] bg-[#042e99]'
                      : 'border-[#8e8e8e] bg-white',
                  ]"
                  aria-hidden="true"
                >
                  <div
                    v-if="idx === q.correctAnswerIndex"
                    class="size-[8px] rounded-full bg-white"
                  />
                </div>

                <span
                  :class="[
                    'font-[\'Figtree:Medium\',sans-serif] font-medium text-[15px] shrink-0',
                    idx === q.correctAnswerIndex
                      ? 'text-[#042e99]'
                      : 'text-[#021b59]',
                  ]"
                >
                  {{ String.fromCharCode(65 + idx) }})
                </span>

                <span
                  :class="[
                    'font-[\'Figtree:Regular\',sans-serif] text-[15px] leading-[24px] flex-1',
                    idx === q.correctAnswerIndex
                      ? 'text-[#021b59]'
                      : 'text-[#333]',
                  ]"
                >
                  {{ opt }}
                </span>
              </div>
            </div>
          </fieldset>
        </div>

        <div class="shrink-0 mt-[20px]">
          <div
            v-if="aiErrorMessage"
            class="mb-[16px] px-[12px] py-[10px] bg-[#c0392b]/10 border border-[#c0392b] rounded-[8px]"
          >
            <p
              class="text-[14px] text-[#c0392b] font-['Figtree:Medium',sans-serif] font-medium"
            >
              {{ aiErrorMessage }}
            </p>
          </div>
          <div
            v-if="aiSuccessMessage"
            class="mb-[16px] px-[12px] py-[10px] bg-[#27ae60]/10 border border-[#27ae60] rounded-[8px]"
          >
            <p
              class="text-[14px] text-[#27ae60] font-['Figtree:Medium',sans-serif] font-medium"
            >
              ✓ {{ aiSuccessMessage }}
            </p>
          </div>

          <div
            class="flex flex-col sm:flex-row gap-[12px]"
            v-if="!isGeneratingAI && parsedAIQuestions.length > 0"
          >
            <button
              @click="handleRegenerateAIQuiz"
              type="button"
              class="flex-1 h-[52px] border-2 border-[#021b59] rounded-[26px] text-[#021b59] hover:bg-[#f5f8ff] font-['Figtree:Medium',sans-serif] font-medium text-[18px] transition-colors"
            >
              Regerar questões
            </button>
            <button
              @click="handleConfirmAIQuiz"
              type="button"
              class="flex-1 h-[52px] bg-[#021b59] rounded-[26px] text-[#ffeac4] hover:bg-[#032a8a] font-['Figtree:Medium',sans-serif] font-medium text-[18px] transition-colors"
            >
              Confirmar Prova
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}
</style>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { quizService } from '@/services/api/quizService';
import { useCourseCreationStore } from '@/store/useCourseCreationStore';
import { moduleService } from '@/services/api/moduleService';
import { lessonService } from '@/services/api/lessonService';

type Tab = "Perguntas" | "Respostas" | "Configurações";
type Lesson = { id: string; name: string };
type ModuleData = { id: string; name: string; lessons: Lesson[] };
type Option = { id: string; text: string };
type Question = { id: string; text: string; options: Option[]; correctOptionId: string; points: number };
type ConfigSettings = { wrongAnswers: boolean; rightAnswers: boolean; values: boolean };

interface AIQuestionData {
  text: string;
  options: string[];
  correctAnswerIndex: number;
}

const CLOSE_SM = "M10.657 12.071L5 6.414L6.414 5L12.071 10.657L17.728 5L19.142 6.414L13.485 12.071L19.142 17.728L17.728 19.142L12.071 13.485L6.414 19.142L5 17.728L10.657 12.071Z";
const EDIT_ICON = "M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z";
const DOC = "M19.6667 5.66667H7.66667V27H23.6667V9.66667H19.6667V5.66667ZM7.66667 3H21L26.3333 8.33333V27C26.3333 27.7072 26.0524 28.3855 25.5523 28.8856C25.0522 29.3857 24.3739 29.6667 23.6667 29.6667H7.66667C6.95942 29.6667 6.28115 29.3857 5.78105 28.8856C5.28095 28.3855 5 27.7072 5 27V5.66667C5 4.95942 5.28095 4.28115 5.78105 3.78105C6.28115 3.28095 6.95942 3 7.66667 3ZM10.3333 15H21V17.6667H10.3333V15ZM10.3333 20.3333H21V23H10.3333V20.3333Z";
const BLUE_CHECK = "M6 10L4 12L10 18L20 8L18 6L10 14L6 10Z";
const IMG_ICON = "M19 15H29L33 19V33C33 33.5304 32.7893 34.0391 32.4142 34.4142C32.0391 34.7893 31.5304 35 31 35H19C18.4696 35 17.9609 34.7893 17.5858 34.4142C17.2107 34.0391 17 33.5304 17 33V17C17 16.4696 17.2107 15.9609 17.5858 15.5858C17.9609 15.2107 18.4696 15 19 15ZM28.172 17H19V33H31V19.828H28.172V17ZM28 27C27.7348 27 27.4804 26.8946 27.2929 26.7071C27.1054 26.5196 27 26.2652 27 26C27 25.7348 27.1054 25.4804 27.2929 25.2929C27.4804 25.1054 27.7348 25 28 25C28.2652 25 28.5196 25.1054 28.7071 25.2929C28.8946 25.4804 29 25.7348 29 26C29 26.2652 28.8946 26.5196 28.7071 26.7071C28.5196 26.8946 28.2652 27 28 27ZM21 29L24.07 26L27 29L28 28L29 29V31H21V29Z";

let _id = Date.now();
const uid = () => String(_id++);
const router = useRouter();
const store = useCourseCreationStore();
const courseTitle = computed(() => store.courseData?.title || history.state?.courseData?.title || "Novo Curso");
const modulesList = ref<ModuleData[]>([]);
const isLoading = ref(true);

const editorOpen = ref(false);
const editingModId = ref<string | null>(null);
const activeTab = ref<Tab>("Perguntas");

const editingLesson = ref<{ modId: string; lessonId: string; name: string; fileName?: string } | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);
const questionText = ref("");
const options = ref<Option[]>([{ id: uid(), text: "" }, { id: uid(), text: "" }]);
const correctOptionId = ref("");
const points = ref(1);
const formError = ref("");
const questions = ref<Question[]>([]);
const moduleProvas = ref<Record<string, Question[]>>({});

const aiReviewModId = ref<string | null>(null);
const parsedAIQuestions = ref<AIQuestionData[]>([]); // <--- Variável corretamente tipada
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
      fetchedModules.map(async (mod: any) => {
        const fetchedLessons = await lessonService.getLessonsByModule(mod.id);
        return {
          id: String(mod.id),
          name: mod.name,
          lessons: fetchedLessons.map((l: any) => ({
            id: String(l.id),
            name: l.name
          }))
        };
      })
    );
    modulesList.value = modulesWithLessons;
  } catch (error) {
    console.error("Erro ao carregar estrutura do curso:", error);
  } finally {
    isLoading.value = false;
  }
});

const openEditLesson = (modId: string, lessonId: string) => {
  const mod = modulesList.value.find(m => m.id === modId);
  const lesson = mod?.lessons.find(l => l.id === lessonId);
  if (lesson) editingLesson.value = { modId, lessonId, name: lesson.name };
};

const saveLessonEdit = () => {
  if (!editingLesson.value) return;
  const { modId, lessonId, name } = editingLesson.value;
  const mod = modulesList.value.find(m => m.id === modId);
  if (mod) {
    const lesson = mod.lessons.find(l => l.id === lessonId);
    if (lesson) lesson.name = name;
  }
  editingLesson.value = null;
};

const removeLesson = (modId: string, lessonId: string) => {
  const mod = modulesList.value.find(m => m.id === modId);
  if (mod) mod.lessons = mod.lessons.filter(l => l.id !== lessonId);
};

const openEditor = (modId: string) => {
  editingModId.value = modId;
  const existing = moduleProvas.value[modId] ?? [];
  questions.value = [...existing];
  resetQuestionForm();
  editorOpen.value = true;
};

const resetQuestionForm = () => {
  questionText.value = "";
  options.value = [{ id: uid(), text: "" }, { id: uid(), text: "" }];
  correctOptionId.value = "";
  points.value = 1;
  formError.value = "";
};

const addQuestion = () => {
  if (!questionText.value.trim()) { formError.value = "Escreva o texto da pergunta."; return; }
  const filled = options.value.filter(o => o.text.trim());
  if (filled.length < 2) { formError.value = "Adicione pelo menos 2 alternativas."; return; }
  if (!correctOptionId.value) { formError.value = "Selecione a resposta correta."; return; }
  
  questions.value.push({
    id: uid(),
    text: questionText.value,
    options: [...filled],
    correctOptionId: correctOptionId.value,
    points: points.value
  });
  resetQuestionForm();
};

const finalizarEditor = () => {
  if (editingModId.value) moduleProvas.value[editingModId.value] = [...questions.value];
  editorOpen.value = false;
};

const parseApiResponse = (response: any): AIQuestionData[] => {
  let content = typeof response === 'string' ? JSON.parse(response) : response;
  
  if (content && !Array.isArray(content)) {
    content = content.questions || content.questoes || content.dados || content.data || [];
  }

  if (!Array.isArray(content)) return [];

  return content.map((q: any) => {
    const rawOptions = q.alternatives || q.options || [];

    const normalizedOptions = rawOptions.map((o: any) => typeof o === 'string' ? o : o.text);
      
    let correctIdx = rawOptions.findIndex((o: any) => o.correct === true);
    
    if (correctIdx === -1) {
      correctIdx = Number(q.correctAnswerIndex ?? q.respostaCorreta ?? 0);
    }

    return {
      text: q.statement || q.text || q.pergunta || "Texto da pergunta não encontrado",
      options: normalizedOptions,
      correctAnswerIndex: correctIdx
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
  } catch (err: any) {
    aiErrorMessage.value = err.message || "Ocorreu um erro ao gerar a prova.";
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
  } catch (err: any) {
    aiErrorMessage.value = err.message || "Erro ao tentar regerar o conteúdo.";
  } finally {
    isGeneratingAI.value = false;
  }
};

const handleConfirmAIQuiz = async () => {
  if (!aiReviewModId.value) return;
  isGeneratingAI.value = true;
  aiErrorMessage.value = ""; 
  
  try {
    const confirmedData = await quizService.confirmAIQuiz(aiReviewModId.value);
    
    if (!moduleProvas.value[aiReviewModId.value]) {
      moduleProvas.value[aiReviewModId.value] = [];
    }

    moduleProvas.value[aiReviewModId.value].push({
      id: confirmedData?.id || uid(),
      text: "Prova Gerada por IA", 
      options: [],
      correctOptionId: "",
      points: 1
    });

    closeAIReview();
  } catch (err: any) {
    aiErrorMessage.value = err.message || "Erro ao tentar confirmar o conteúdo.";
    isGeneratingAI.value = false; 
  }
};

const closeAIReview = () => {
  aiReviewModId.value = null;
  parsedAIQuestions.value = [];
  aiSuccessMessage.value = "";
  aiErrorMessage.value = "";
};
</script>

<template>
  <div class="bg-white min-h-screen flex flex-col pb-[100px]">
    
    <div v-if="!editorOpen" class="max-w-[900px] mx-auto flex flex-col gap-[20px] px-[20px] md:px-[40px] pt-[30px] w-full">
      <h1 class="font-bold text-[#021b59] text-[22px] leading-[32px]">
        {{ courseTitle }} — Provas
      </h1>

      <div v-for="mod in modulesList" :key="mod.id" class="border border-black rounded-[4px] overflow-hidden">
        <div class="p-[16px] flex flex-col gap-[16px]">
          <div class="flex justify-between items-center">
            <p class="font-bold text-[#021b59] text-[20px]">{{ mod.name }}</p>
            <button @click="modulesList = modulesList.filter(m => m.id !== mod.id)" class="size-[26px]">
              <svg class="size-full" viewBox="0 0 24 24"><path :d="CLOSE_SM" fill="#801436" /></svg>
            </button>
          </div>

          <div v-for="lesson in mod.lessons" :key="lesson.id" class="bg-[#c5d6ff] h-[60px] flex items-center justify-between px-[20px]">
            <p class="text-[20px] font-medium text-black truncate flex-1">{{ lesson.name }}</p>
            <div class="flex items-center gap-[8px] ml-2">
              <button @click="openEditLesson(mod.id, lesson.id)" class="size-[24px]">
                <svg class="size-full" viewBox="0 0 24 24"><path :d="EDIT_ICON" fill="#021b59" /></svg>
              </button>
              <button @click="removeLesson(mod.id, lesson.id)" class="size-[24px]">
                <svg class="size-full" viewBox="0 0 24 24"><path :d="CLOSE_SM" fill="#801436" /></svg>
              </button>
            </div>
          </div>

          <div v-for="(q, idx) in moduleProvas[mod.id]" :key="q.id" class="bg-[#c5d6ff] h-[60px] flex items-center justify-between px-[20px]">
            <p class="text-[20px] font-medium text-black truncate flex-1">
              Prova {{ String(idx + 1).padStart(2, '0') }} — {{ q.text }}
            </p>
            <button @click="moduleProvas[mod.id] = moduleProvas[mod.id].filter(item => item.id !== q.id)" class="size-[24px]">
               <svg class="size-full" viewBox="0 0 24 24"><path :d="CLOSE_SM" fill="#801436" /></svg>
            </button>
          </div>

          <div class="flex flex-col sm:flex-row items-center gap-[12px] mt-2">
            <button @click="openEditor(mod.id)" class="flex-1 w-full bg-[#ffeac4] h-[60px] rounded-[26px] font-medium text-[18px] hover:bg-[#ffd9a0] transition-colors">
              {{ (moduleProvas[mod.id]?.length || 0) > 0 ? "Editar manual" : "Adicionar prova manual" }}
            </button>
            
            <button @click="openAIGenerator(mod.id)" class="flex-1 w-full bg-[#021b59] text-[#ffeac4] h-[60px] rounded-[26px] font-medium text-[18px] hover:bg-[#032a8a] transition-colors flex items-center justify-center gap-2">        
              Adicionar prova gerada com IA
            </button>
          </div>
        </div>
      </div>

      <div class="fixed bottom-0 left-0 right-0 bg-white px-[20px] py-[16px] shadow-[0px_-4px_12px_rgba(51,51,51,0.15)] flex justify-center z-10">
        <button @click="router.push('/courses')" class="bg-[#ffeac4] h-[50px] w-full max-w-[900px] rounded-[26px] font-medium text-[20px]">
          Finalizar curso
        </button>
      </div>
    </div>

    <div v-else class="max-w-[900px] mx-auto w-full px-[20px] md:px-[40px] pt-[20px] flex flex-col">
      <p class="font-bold text-[#021b59] text-[18px] mb-[16px]">Adicionar prova</p>
      
      <div class="flex w-full border-b border-[#e0e0e0] mb-6">
        <button v-for="tab in (['Perguntas', 'Respostas', 'Configurações'] as Tab[])" :key="tab"
                @click="activeTab = tab"
                class="flex-1 pt-2 flex flex-col items-center">
          <span class="font-semibold text-[18px] pb-2" :class="activeTab === tab ? 'text-black' : 'text-gray-400'">{{ tab }}</span>
          <div v-if="activeTab === tab" class="w-full h-[3px] bg-[#efbbdc]"></div>
        </button>
      </div>

      <div v-if="activeTab === 'Perguntas'" class="flex flex-col gap-5">
        <div v-for="(q, idx) in questions" :key="q.id" class="bg-[#c5d6ff] h-[56px] flex items-center justify-between px-4 rounded">
          <span class="text-[18px] font-medium truncate">Questão {{ String(idx+1).padStart(2, '0') }} — {{ q.text }}</span>
          <button @click="questions = questions.filter(item => item.id !== q.id)"><svg class="size-6" viewBox="0 0 24 24"><path :d="CLOSE_SM" fill="#801436" /></svg></button>
        </div>

        <div class="flex gap-4 items-end">
          <div class="flex-1 flex flex-col gap-1">
            <label class="font-medium text-[#333] text-[20px]">Texto da pergunta</label>
            <input v-model="questionText" type="text" placeholder="Escreva sua pergunta" class="w-full border border-[#8e8e8e] h-[50px] rounded px-5">
          </div>
          <button class="size-[50px] rounded-full bg-[#ffeac4] flex items-center justify-center"><svg class="size-8" viewBox="0 0 50 50"><path :d="IMG_ICON" fill="black" /></svg></button>
        </div>

        <div class="flex flex-col gap-2">
          <p class="font-medium text-[18px]">Alternativas</p>
          <div v-for="(opt, idx) in options" :key="opt.id" class="flex items-center gap-2">
            <span class="text-[#021b59] font-medium w-5">{{ String.fromCharCode(65 + idx) }})</span>
            <input v-model="opt.text" type="text" :placeholder="'Alternativa ' + String.fromCharCode(65 + idx)" class="flex-1 border border-[#8e8e8e] h-11 rounded px-3">
            <button v-if="options.length > 2" @click="options = options.filter(o => o.id !== opt.id)"><svg class="size-5" viewBox="0 0 24 24"><path :d="CLOSE_SM" fill="#801436" /></svg></button>
          </div>
          <button @click="options.push({ id: uid(), text: '' })" class="text-[#021b59] self-start">+ Adicionar alternativa</button>
        </div>

        <div class="flex flex-col gap-1">
          <p class="font-medium text-[18px]">Resposta correta</p>
          <select v-model="correctOptionId" class="w-full h-[50px] border border-[#8e8e8e] rounded px-4 bg-white">
            <option value="" disabled>Selecione a resposta correta</option>
            <option v-for="(opt, idx) in options.filter(o => o.text)" :key="opt.id" :value="opt.id">
              {{ String.fromCharCode(65 + idx) }}) {{ opt.text }}
            </option>
          </select>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <svg class="size-6" viewBox="0 0 24 24"><path :d="BLUE_CHECK" fill="#1E40C5" /></svg>
            <span class="font-semibold text-[#1e40c5]">Configure a questão: {{ points }} ponto(s)</span>
          </div>
          <div class="flex items-center gap-2">
            <button @click="points = Math.max(1, points - 1)" class="size-7 rounded-full border border-[#021b59]">−</button>
            <span class="w-5 text-center">{{ points }}</span>
            <button @click="points++" class="size-7 rounded-full border border-[#021b59]">+</button>
          </div>
        </div>

        <button @click="addQuestion" class="w-full border-2 border-[#021b59] rounded-[26px] h-[50px] flex items-center justify-center gap-2">
          <svg class="size-7" viewBox="0 0 32 32"><path :d="DOC" fill="#021B59" /></svg>
          <span class="font-medium text-[20px]">Adicionar pergunta</span>
        </button>
      </div>

      <div class="fixed bottom-0 left-0 right-0 bg-white px-[20px] py-[16px] shadow-[0px_-4px_12px_rgba(51,51,51,0.2)] flex justify-center z-10">
        <button @click="finalizarEditor" class="bg-[#ffeac4] h-[50px] w-full max-w-[900px] rounded-[26px] font-medium text-[20px]">
          Finalizar
        </button>
      </div>
    </div>
    
    <div v-if="editingLesson" class="fixed inset-0 z-50 flex items-center justify-center px-5">
      <div class="fixed inset-0 bg-black/40 backdrop-blur-sm" @click="editingLesson = null"></div>
      <div class="bg-white w-full max-w-[400px] rounded-[12px] shadow-xl p-6 flex flex-col gap-5 z-50">
        <h2 class="font-bold text-[#021b59] text-[20px]">Editar aula</h2>
        <div class="flex flex-col gap-1">
          <label class="font-medium text-[#333]">Nome da aula</label>
          <input v-model="editingLesson.name" type="text" class="w-full border border-[#8e8e8e] h-[50px] rounded-[12px] px-4">
        </div>
        <div class="flex flex-col gap-2">
          <p class="font-medium">Arquivo da aula</p>
          <p class="text-[#606060] text-sm">Deseja substituir o arquivo atual por um novo?</p>
          <input type="file" ref="fileInputRef" class="hidden">
          <button @click="fileInputRef?.click()" class="bg-[#ffeac4] h-10 w-full rounded-[26px] font-medium">Adicionar arquivo</button>
        </div>
        <div class="flex gap-3">
          <button @click="editingLesson = null" class="flex-1 h-[46px] border-2 border-[#021b59] rounded-[26px] text-[#021b59]">Cancelar</button>
          <button @click="saveLessonEdit" class="flex-1 h-[46px] bg-[#021b59] rounded-[26px] text-[#ffeac4]">Salvar</button>
        </div>
      </div>
    </div>

    <div v-if="aiReviewModId" class="fixed inset-0 z-50 flex items-center justify-center px-[20px] py-[40px]">
      <div class="fixed inset-0 bg-black/40 backdrop-blur-sm" @click="!isGeneratingAI && closeAIReview()"></div>
      
      <div class="bg-white w-full max-w-[900px] h-[90vh] flex flex-col rounded-[16px] shadow-2xl p-[24px] z-50">
        <div class="flex items-center justify-between border-b border-[#e0e0e0] pb-[16px] mb-[20px] shrink-0">
          <div>
            <h2 class="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[24px] leading-tight">
              Revisão da Prova Gerada por IA
            </h2>
            <p class="font-['Figtree:Medium',sans-serif] text-[#595959] text-[15px] mt-1">
              Confira as questões e a indicação de resposta correta antes de confirmar.
            </p>
          </div>
          <button @click="!isGeneratingAI && closeAIReview()" class="size-[40px] flex items-center justify-center hover:bg-[#f5f5f5] rounded-full transition-colors focus-visible:outline focus-visible:outline-[#021b59]" :disabled="isGeneratingAI">
             <svg class="size-[20px]" viewBox="0 0 24 24"><path :d="CLOSE_SM" fill="#801436" /></svg>
          </button>
        </div>

        <div v-if="isGeneratingAI" class="flex-1 flex flex-col items-center justify-center gap-4">
          <svg class="size-12 animate-spin text-[#021b59]" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="font-['Figtree:Medium',sans-serif] text-[#021b59] text-[18px] animate-pulse">A IA está processando o conteúdo da aula...</p>
        </div>

        <div v-else-if="parsedAIQuestions.length > 0" class="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-[32px] pr-[10px] mt-[10px]">
          <fieldset 
            v-for="(q, qIdx) in parsedAIQuestions" 
            :key="qIdx" 
            class="flex flex-col gap-[14px] border-0 p-0 m-0"
          >
            <legend class="font-['Figtree:Bold',sans-serif] font-bold text-black text-[18px] leading-[28px] mb-[4px] w-full float-left">
              <span class="text-[#021b59]">Questão {{ qIdx + 1 }} — </span>
              {{ q.text }}
            </legend>

            <div class="flex flex-col gap-[8px] clear-both">
              <div
                v-for="(opt, idx) in q.options"
                :key="idx"
                :class="[
                  'flex items-center gap-[12px] px-[16px] py-[14px] rounded-[12px] border-2 transition-colors',
                  idx === q.correctAnswerIndex ? 'border-[#042e99] bg-[#e8eeff]' : 'border-[#e0e0e0] bg-white opacity-90'
                ]"
              >
                <div
                  :class="[
                    'shrink-0 size-[22px] rounded-full border-2 flex items-center justify-center transition-colors',
                    idx === q.correctAnswerIndex ? 'border-[#042e99] bg-[#042e99]' : 'border-[#8e8e8e] bg-white'
                  ]"
                  aria-hidden="true"
                >
                  <div v-if="idx === q.correctAnswerIndex" class="size-[8px] rounded-full bg-white" />
                </div>
                
                <span :class="['font-[\'Figtree:Medium\',sans-serif] font-medium text-[15px] shrink-0', idx === q.correctAnswerIndex ? 'text-[#042e99]' : 'text-[#021b59]']">
                  {{ String.fromCharCode(65 + idx) }})
                </span>

                <span :class="['font-[\'Figtree:Regular\',sans-serif] text-[15px] leading-[24px] flex-1', idx === q.correctAnswerIndex ? 'text-[#021b59]' : 'text-[#333]']">
                  {{ opt }}
                </span>
              </div>
            </div>
          </fieldset>
        </div>

        <div class="shrink-0 mt-[20px]">
          <div v-if="aiErrorMessage" class="mb-[16px] px-[12px] py-[10px] bg-[#c0392b]/10 border border-[#c0392b] rounded-[8px]">
            <p class="text-[14px] text-[#c0392b] font-['Figtree:Medium',sans-serif] font-medium">{{ aiErrorMessage }}</p>
          </div>
          <div v-if="aiSuccessMessage" class="mb-[16px] px-[12px] py-[10px] bg-[#27ae60]/10 border border-[#27ae60] rounded-[8px]">
            <p class="text-[14px] text-[#27ae60] font-['Figtree:Medium',sans-serif] font-medium">✓ {{ aiSuccessMessage }}</p>
          </div>

          <div class="flex flex-col sm:flex-row gap-[12px]" v-if="!isGeneratingAI && parsedAIQuestions.length > 0">
            <button @click="handleRegenerateAIQuiz" type="button" class="flex-1 h-[52px] border-2 border-[#021b59] rounded-[26px] text-[#021b59] hover:bg-[#f5f8ff] font-['Figtree:Medium',sans-serif] font-medium text-[18px] transition-colors">
              Regerar questões
            </button>
            <button @click="handleConfirmAIQuiz" type="button" class="flex-1 h-[52px] bg-[#021b59] rounded-[26px] text-[#ffeac4] hover:bg-[#032a8a] font-['Figtree:Medium',sans-serif] font-medium text-[18px] transition-colors">
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
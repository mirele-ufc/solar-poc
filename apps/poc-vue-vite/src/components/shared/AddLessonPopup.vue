<script setup lang="ts">
import { ref } from 'vue';
import { lessonService } from '@/services/api/lessonService';

const props = defineProps<{
  moduleId: number;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'confirm', lessonId: number, name: string, file: string | null): void;
}>();

const closeSmPath = "M10.657 12.071L5 6.414L6.414 5L12.071 10.657L17.728 5L19.142 6.414L13.485 12.071L19.142 17.728L17.728 19.142L12.071 13.485L6.414 19.142L5 17.728L10.657 12.071Z";
const checkPath = "M5 9L3 11L9 17L19 7L17 5L9 13L5 9Z";
const backArrowPath = "M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2Z";

const step = ref<1 | 2>(1);
const lessonName = ref("");
const file = ref<File | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);
const error = ref("");
const aiText = ref("");

const generatedContent = ref("");
const isGenerating = ref(false);
const isSavingLesson = ref(false);
const savedLessonId = ref<number | null>(null);
const successMessage = ref("");

const handleStep1 = () => {
  if (!lessonName.value.trim()) {
    error.value = "Informe o nome da aula.";
    return;
  }
  error.value = "";
  step.value = 2;
};

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const f = target.files?.[0];
  if (f) file.value = f;
};

const handleSaveLesson = async () => {
  if (!lessonName.value.trim()) {
    error.value = "Informe o nome da aula antes de salvar.";
    return;
  }

  isSavingLesson.value = true;
  error.value = "";
  successMessage.value = ""; 

  try {
    const createdLesson = await lessonService.createLesson(props.moduleId, lessonName.value.trim(), aiText.value, file.value);
    savedLessonId.value = createdLesson.id;
    successMessage.value = "Aula salva com sucesso"; 
  } catch (err) {
    error.value = `Erro ao salvar aula: ${err instanceof Error ? err.message : 'Desconhecido'}`;
  } finally {
    isSavingLesson.value = false;
  }
};

const handleGenerateAiQuiz = async () => {
  if (!savedLessonId.value) {
    error.value = "Salve a aula antes de gerar conteúdo com IA.";
    return;
  }

  isGenerating.value = true;
  error.value = "";
  successMessage.value = ""; 

  try {
    const content = await lessonService.generateContent(savedLessonId.value);
    generatedContent.value = content;
    successMessage.value = "Conteúdo gerado com sucesso"; 
  } catch (err) {
    error.value = `Erro ao gerar conteúdo: ${err instanceof Error ? err.message : 'Desconhecido'}`;
  } finally {
    isGenerating.value = false;
  }
};

const handleConfirm = () => {
  if (!savedLessonId.value) {
    error.value = "Erro: aula não foi salva corretamente.";
    return;
  }
  emit('confirm', savedLessonId.value, lessonName.value.trim(), file.value?.name || null);
};

const handleRegenerateQuiz = async () => {
  if (!savedLessonId.value) return;
  
  isGenerating.value = true;
  error.value = ""; 
  successMessage.value = ""; 
  try {
    const newContent = await lessonService.regenerateContent(savedLessonId.value);
    generatedContent.value = newContent;
    successMessage.value = "Conteúdo regerado com sucesso"; 
  } catch (err: any) {
    error.value = err.message || "Erro ao tentar regerar o conteúdo.";
  } finally {
    isGenerating.value = false;
  }
};

const handleConfirmQuiz = async () => {
  if (!savedLessonId.value || !generatedContent.value) return;
  
  isGenerating.value = true;
  error.value = "";
  successMessage.value = "";
  
  try {
    await lessonService.confirmContent(savedLessonId.value);
    successMessage.value = "Conteúdo confirmado com sucesso";
  } catch (err: any) {
    error.value = err.message || "Erro ao tentar confirmar o conteúdo.";
  } finally {
    isGenerating.value = false;
  }
};
</script>

<template>
  <div
    role="dialog"
    aria-modal="true"
    class="fixed inset-0 z-50 flex items-center justify-center px-[20px] bg-black/40 backdrop-blur-sm"
    @click.self="emit('close')"
  >
    <div class="bg-white rounded-[16px] shadow-2xl w-full max-w-[480px] p-[24px] flex flex-col gap-[20px] max-h-[90vh] overflow-y-auto custom-scrollbar">
      
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-[10px]">
          <button
            v-if="step === 2"
            type="button"
            @click="step = 1; file = null; generatedContent = ''"
            class="size-[44px] flex items-center justify-center hover:bg-[#f5f5f5] rounded focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59]"
          >
            <svg class="size-[25px]" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <path :d="backArrowPath" fill="#021B59" />
            </svg>
          </button>
          <p class="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[20px]">
            {{ step === 1 ? "Adicionar Aula" : "Confirmar Aula" }}
          </p>
        </div>
        <button @click="emit('close')" type="button" class="size-[44px] focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59] rounded flex items-center justify-center">
          <svg class="size-[25px]" fill="none" viewBox="0 0 24 24"><path clip-rule="evenodd" :d="closeSmPath" fill="#021B59" fill-rule="evenodd" /></svg>
        </button>
      </div>

      <div class="flex items-center gap-[8px]">
        <div class="flex-1 h-[4px] rounded-full bg-[#021b59]" />
        <div class="flex-1 h-[4px] rounded-full transition-colors" :class="step === 2 ? 'bg-[#021b59]' : 'bg-[#e0e0e0]'" />
      </div>

      <template v-if="step === 1">
        <div class="flex flex-col gap-[6px]">
          <label for="lesson-name" class="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[18px]">Nome da aula</label>
          <div class="border border-[#8e8e8e] rounded-[12px] h-[50px] relative">
            <input
              v-model="lessonName"
              id="lesson-name"
              type="text"
              placeholder="Ex: Aula 01"
              autofocus
              @keydown.enter="handleStep1"
              class="w-full h-full px-[16px] font-['Figtree:Regular',sans-serif] text-[16px] text-[#333] bg-transparent outline-none rounded-[12px]"
            />
          </div>
          <p v-if="error" role="alert" class="text-[#c0392b] text-[13px]">{{ error }}</p>
        </div>
        <button @click="handleStep1" class="bg-[#ffeac4] h-[46px] w-full rounded-[26px] hover:bg-[#ffd9a0] transition-colors mt-[10px]">
          <span class="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[18px]">Próximo</span>
        </button>
      </template>

      <template v-else>
        <div class="bg-[#c5d6ff] rounded-[12px] px-[16px] py-[12px] flex items-center gap-[10px]">
          <svg class="size-[22px] shrink-0" fill="none" viewBox="0 0 22 22"><path clip-rule="evenodd" :d="checkPath" fill="#021b59" fill-rule="evenodd" /></svg>
          <div>
            <p class="font-['Figtree:Regular',sans-serif] text-[12px] text-[#595959]">Nome salvo:</p>
            <p class="font-['Figtree:Medium',sans-serif] font-medium text-[#021b59] text-[16px]">{{ lessonName }}</p>
          </div>
        </div>

        <div class="flex flex-col gap-[6px]">
          <label class="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[16px]">Conteúdo da aula</label>
          <div class="relative border border-[#8e8e8e] rounded-[12px] overflow-hidden focus-within:outline focus-within:outline-[2px] focus-within:outline-[#021b59]">
            <textarea v-model="aiText" rows="4" placeholder="Cole aqui o conteúdo em texto da aula..." class="w-full px-[14px] py-[12px] text-[14px] outline-none resize-none" />
          </div>
        </div>

        <div class="flex flex-col gap-[6px]">
          <p class="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[16px]">Arquivo da aula <span class="text-[#8e8e8e] text-[13px] font-normal">(opcional)</span></p>
          <button @click="fileInputRef?.click()" type="button" class="w-full h-[54px] border border-dashed border-[#8e8e8e] rounded-[12px] flex items-center justify-center hover:bg-[#f5f5f5] transition-colors">
            <p class="text-[14px] text-[#606060] font-['Figtree:Regular',sans-serif]">{{ file ? `✓ ${file.name}` : "Clique para selecionar um arquivo" }}</p>
          </button>
          <input ref="fileInputRef" type="file" class="hidden" @change="handleFileChange" />
        </div>

        <div class="flex items-center gap-[12px] pt-[4px]">
          <button @click="handleSaveLesson" :disabled="isSavingLesson" type="button" class="flex-1 h-[42px] border border-[#021b59] rounded-[26px] text-[#021b59] hover:bg-[#f5f8ff] disabled:opacity-70 transition-colors flex items-center justify-center">
            <span class="font-['Figtree:Medium',sans-serif] font-medium text-[15px]">{{ isSavingLesson ? 'Salvando...' : 'Salvar aula' }}</span>
          </button>
          <button @click="handleGenerateAiQuiz" type="button" :disabled="isGenerating || !savedLessonId" class="flex-1 h-[42px] bg-[#021b59] rounded-[26px] text-[#ffeac4] hover:bg-[#032a8a] disabled:opacity-70 transition-colors flex items-center justify-center">
            <span class="font-['Figtree:Medium',sans-serif] font-medium text-[15px]">{{ isGenerating ? 'Gerando...' : 'Gerar com IA' }}</span>
          </button>
        </div>

        <div v-if="error" role="alert" class="px-[12px] py-[10px] bg-[#c0392b]/10 border border-[#c0392b] rounded-[8px]">
          <p class="text-[13px] text-[#c0392b] font-['Figtree:Medium',sans-serif]">{{ error }}</p>
        </div>

       <div v-if="successMessage" class="px-[12px] py-[10px] bg-[#27ae60]/10 border border-[#27ae60] rounded-[8px] transition-all">
  <p class="text-[13px] text-[#27ae60] font-['Figtree:Medium',sans-serif]">✓ {{ successMessage }}</p>
</div>

        <div class="flex flex-col gap-[12px] mt-[8px] p-[16px] border border-[#e0e0e0] bg-[#f9f9f9] rounded-[12px]">
          <p class="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[16px]">Conteúdo gerado</p>
          
          <div class="min-h-[100px] bg-white border border-[#e0e0e0] rounded-[8px] p-[12px] max-h-[150px] overflow-y-auto custom-scrollbar">
            <p v-if="!generatedContent" class="text-[14px] text-[#8e8e8e] italic">
              O conteúdo gerado pela IA aparecerá aqui...
            </p>
            <p v-else class="text-[14px] text-[#333] whitespace-pre-wrap leading-relaxed">
              {{ generatedContent }}
            </p>
          </div>

          <div class="flex items-center gap-[12px]">
            <button @click="handleRegenerateQuiz" type="button" :disabled="!generatedContent || isGenerating" class="flex-1 h-[38px] border border-[#021b59] rounded-[26px] text-[#021b59] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#f5f8ff] transition-colors flex items-center justify-center">
              <span class="font-['Figtree:Medium',sans-serif] font-medium text-[14px]">Regerar</span>
            </button>
            <button @click="handleConfirmQuiz" type="button" :disabled="!generatedContent || isGenerating" class="flex-1 h-[38px] bg-[#021b59] rounded-[26px] text-white hover:bg-[#032a8a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center">
              <span class="font-['Figtree:Medium',sans-serif] font-medium text-[14px]">Confirmar</span>
            </button>
          </div>
        </div>

        <div class="pt-[10px]">
          <button @click="handleConfirm" class="bg-[#ffeac4] h-[48px] w-full rounded-[26px] hover:bg-[#ffd9a0] transition-colors">
            <span class="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[18px]">Finalizar</span>
          </button>
        </div>
      </template>

    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}
</style>
<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  // No Vue, onClose e onConfirm são eventos (emits)
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'confirm', name: string, file: string | null): void;
}>();

// --- SVG paths local ---
const closeSmPath = "M10.657 12.071L5 6.414L6.414 5L12.071 10.657L17.728 5L19.142 6.414L13.485 12.071L19.142 17.728L17.728 19.142L12.071 13.485L6.414 19.142L5 17.728L10.657 12.071Z";
const checkPath = "M5 9L3 11L9 17L19 7L17 5L9 13L5 9Z";

// --- State ---
const step = ref<1 | 2>(1);
const lessonName = ref("");
const file = ref<string | null>(null);
const error = ref("");
const aiText = ref("");
const fileInputRef = ref<HTMLInputElement | null>(null);

// --- Logic ---
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
  if (f) file.value = f.name;
};

const handleConfirm = () => {
  emit('confirm', lessonName.value.trim(), file.value);
};

// --- Logic ---
const handleGenerateAiQuiz = () => {
  // TODO: integrar com API de IA para geração do quiz
  window.alert("Quiz gerado pela IA com base no texto fornecido. (Funcionalidade em desenvolvimento)");
};
</script>

<template>
  <div
    role="dialog"
    aria-modal="true"
    class="fixed inset-0 z-50 flex items-center justify-center px-[20px] bg-black/40 backdrop-blur-sm"
    @click.self="emit('close')"
  >
    <div class="bg-white rounded-[16px] shadow-2xl w-full max-w-[420px] p-[24px] flex flex-col gap-[20px]">
      
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-[10px]">
          <button
            v-if="step === 2"
            type="button"
            @click="step = 1; file = null"
            class="size-[44px] flex items-center justify-center hover:bg-[#f5f5f5] rounded focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59]"
          >
            <span class="text-[#021b59] text-[18px] leading-none">‹</span>
          </button>
          <p class="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[20px]">
            {{ step === 1 ? "Adicionar Aula" : "Confirmar Aula" }}
          </p>
        </div>
        <button @click="emit('close')" type="button" class="size-[44px] focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59] rounded flex items-center justify-center">
          <svg class="size-full" fill="none" viewBox="0 0 24 24"><path clip-rule="evenodd" :d="closeSmPath" fill="#021B59" fill-rule="evenodd" /></svg>
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
        <button @click="handleStep1" class="bg-[#ffeac4] h-[46px] w-full rounded-[26px] hover:bg-[#ffd9a0] transition-colors">
          <span class="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[18px]">Próximo</span>
        </button>
      </template>

      <template v-else>
        <div class="bg-[#c5d6ff] rounded-[12px] px-[16px] py-[12px] flex items-center gap-[10px]">
          <svg class="size-[22px] shrink-0" fill="none" viewBox="0 0 22 22"><path clip-rule="evenodd" :d="checkPath" fill="#021b59" fill-rule="evenodd" /></svg>
          <div>
            <p class="font-['Figtree:Regular',sans-serif] text-[12px] text-[#595959]">Nome salvo:</p>
            <p class="font-['Figtree:Medium',sans-serif] font-medium text-[#021b59] text-[17px]">{{ lessonName }}</p>
          </div>
        </div>

        <div class="flex flex-col gap-[6px]">
          <p class="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[18px]">Arquivo da aula <span class="text-[#8e8e8e] text-[14px] font-normal">(opcional)</span></p>
          <button @click="fileInputRef?.click()" type="button" class="w-full h-[72px] border border-dashed border-[#8e8e8e] rounded-[12px] flex items-center justify-center hover:bg-[#f5f5f5]">
            <p class="text-[14px] text-[#606060]">{{ file ? `✓ ${file}` : "Clique para selecionar um arquivo" }}</p>
          </button>
          <input ref="fileInputRef" type="file" class="hidden" @change="handleFileChange" />
        </div>

        <div class="flex flex-col gap-[6px]">
          <label class="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[18px]">Gerar quiz com IA</label>
          <div class="relative border border-[#8e8e8e] rounded-[12px] overflow-hidden focus-within:outline focus-within:outline-[2px] focus-within:outline-[#021b59]">
            <textarea v-model="aiText" rows="5" placeholder="Cole o conteúdo..." class="w-full px-[14px] py-[12px] text-[14px] outline-none resize-none" />
            <div v-if="aiText" class="flex items-center justify-between px-[14px] py-[8px] bg-[#f5f8ff] border-t">
              <span class="text-[12px] text-[#606060]">{{ aiText.trim().split(/\s+/).length }} palavras</span>
              <button @click="aiText = ''" class="text-[#de2e66] text-[12px]">Limpar</button>
            </div>
          </div>
          <button 
  v-if="aiText.trim().split(/\s+/).length >= 20" 
  @click="handleGenerateAiQuiz"
  type="button"
  class="bg-[#021b59] h-[40px] rounded-[26px] text-[#ffeac4] flex items-center justify-center gap-2"
>
  <span class="font-['Figtree:Medium',sans-serif] font-medium text-[15px]">
    Gerar quiz com IA
  </span>
</button></div>

        <button @click="handleConfirm" class="bg-[#ffeac4] h-[46px] w-full rounded-[26px] hover:bg-[#ffd9a0]">
          <span class="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[18px]">Finalizar</span>
        </button>
      </template>
    </div>
  </div>
</template>
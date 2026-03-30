<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useCourseCreationStore } from '@/store/useCourseCreationStore';
// Assumindo que o componente PageHeader já foi convertido para Vue
import PageHeader from "@/components/shared/PageHeader.vue";

// ── Types ──────────────────────────────────────────────────────────────────
export type CourseInfoData = {
  image: string | null;
  title: string;
  description: string;
  category: string;
  hours: string;
  requiredFields: string[];
};

// ── Constants ────────────────────────────────────────────────────────────────
const fileImagePath =
  "M19.5 6.5H52L65 19.5V65C65 66.7239 64.3152 68.3772 63.0962 69.5962C61.8772 70.8152 60.2239 71.5 58.5 71.5H19.5C17.7761 71.5 16.1228 70.8152 14.9038 69.5962C13.6848 68.3772 13 66.7239 13 65V13C13 11.2761 13.6848 9.62279 14.9038 8.40381C16.1228 7.18482 17.7761 6.5 19.5 6.5ZM49.309 13H19.5V65H58.5V22.191H49.309V13ZM48.75 45.5C47.888 45.5 47.0614 45.1576 46.4519 44.5481C45.8424 43.9386 45.5 43.112 45.5 42.25C45.5 41.388 45.8424 40.5614 46.4519 39.9519C47.0614 39.3424 47.888 39 48.75 39C49.612 39 50.4386 39.3424 51.0481 39.9519C51.6576 40.5614 52 41.388 52 42.25C52 43.112 51.6576 43.9386 51.0481 44.5481C50.4386 45.1576 49.612 45.5 48.75 45.5ZM26 52L35.9775 42.25L45.5 52L48.75 48.75L52 52V58.5H26V52Z";

const checkPath = "M5 9L3 11L9 17L19 7L17 5L9 13L5 9Z";
const requiredFieldOptions = ["Endereço", "Gênero", "Idade"];

// ── State ────────────────────────────────────────────────────────────────────
const router = useRouter();
const courseCreationStore = useCourseCreationStore();
const imageInputRef = ref<HTMLInputElement | null>(null);

const form = ref<CourseInfoData>({
  image: null,
  title: "",
  description: "",
  category: "",
  hours: "",
  requiredFields: [],
});

const error = ref("");
const showFieldErrors = ref(false);

// ── Methods ──────────────────────────────────────────────────────────────────
const setField = (key: keyof CourseInfoData, value: string) => {
  (form.value[key] as string) = value;
};

const toggleRequired = (field: string) => {
  const index = form.value.requiredFields.indexOf(field);
  if (index > -1) {
    form.value.requiredFields.splice(index, 1);
  } else {
    form.value.requiredFields.push(field);
  }
};

const handleImageChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      form.value.image = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const handleNext = () => {
  const missing =
    !form.value.image ||
    !form.value.title.trim() ||
    !form.value.description.trim() ||
    !form.value.category.trim() ||
    !form.value.hours.trim();

  if (missing) {
    error.value = "Por favor, preencha os campos destacados para finalizar o cadastro";
    showFieldErrors.value = true;
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  error.value = "";
  
  // Salva os dados do curso no store
  courseCreationStore.setCourseData(form.value);
  
  router.push({ name: "create-module" });
};
</script>

<template>
  <div class="bg-white flex flex-col pb-[100px]">
    <div 
      v-if="error" 
      role="alert" 
      class="w-full bg-[#c0392b]/10 border-l-4 border-[#c0392b] px-[20px] py-[14px]"
    >
      <p class="font-['Figtree:Medium',sans-serif] font-medium text-[#c0392b] text-[15px]">
        {{ error }}
      </p>
    </div>

    <button
      type="button"
      aria-label="Clique para adicionar imagem do curso (obrigatório)"
      @click="imageInputRef?.click()"
      :class="[
        'w-full h-[218px] md:h-[280px] flex flex-col items-center justify-center hover:bg-[#3a3a3a] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59] overflow-hidden',
        showFieldErrors && !form.image ? 'bg-[#c0392b]/20 outline outline-2 outline-[#c0392b]' : 'bg-[#484848]'
      ]"
    >
      <img 
        v-if="form.image" 
        :src="form.image" 
        alt="Capa do curso" 
        class="w-full h-full object-cover" 
      />
      <template v-else>
        <svg class="size-[78px]" fill="none" viewBox="0 0 78 78" aria-hidden="true">
          <path clip-rule="evenodd" :d="fileImagePath" fill="white" fill-rule="evenodd" />
        </svg>
        <p 
          v-if="showFieldErrors && !form.image" 
          class="text-white text-[14px] mt-[8px] font-['Figtree:Medium',sans-serif] font-medium"
        >
          Imagem obrigatória
        </p>
      </template>
    </button>

    <input
      ref="imageInputRef"
      type="file"
      accept="image/*"
      class="hidden"
      aria-hidden="true"
      tabindex="-1"
      @change="handleImageChange"
    />

    <div class="max-w-[900px] mx-auto flex flex-col gap-[20px] px-[20px] md:px-[40px] pt-[24px] w-full">
      
      <PageHeader
        title="Criar Curso"
        back-path="/cursos"
        :crumbs="[
          { label: 'Cursos', path: '/cursos' },
          { label: 'Criar Curso' },
        ]"
      />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
        <div class="flex flex-col gap-[4px] w-full">
          <label for="titulo" class="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[20px] leading-[30px]">
            Título do curso
          </label>
          <div :class="['bg-white h-[56px] w-full border rounded-[8px] relative', showFieldErrors && !form.title.trim() ? 'border-[#c0392b]' : 'border-[#8e8e8e]']">
            <input
              id="titulo"
              type="text"
              placeholder="Digite o título"
              :value="form.title"
              @input="setField('title', ($event.target as HTMLInputElement).value)"
              class="w-full h-full px-[20px] font-['Figtree:Regular',sans-serif] font-normal text-[16px] text-[#333] placeholder-[#8e8e8e] bg-transparent outline-none rounded-[8px]"
            />
            <div aria-hidden="true" class="absolute inset-0 pointer-events-none focus-within:outline focus-within:outline-[3px] focus-within:outline-[#021b59] focus-within:outline-offset-[-1px] rounded-[8px]" />
          </div>
        </div>

        <div class="flex flex-col gap-[4px] w-full">
          <label for="categoria" class="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[20px] leading-[30px]">
            Categoria
          </label>
          <div :class="['bg-white h-[56px] w-full border rounded-[8px] relative', showFieldErrors && !form.category.trim() ? 'border-[#c0392b]' : 'border-[#8e8e8e]']">
            <input
              id="categoria"
              type="text"
              placeholder="Ex: Computação, Design"
              :value="form.category"
              @input="setField('category', ($event.target as HTMLInputElement).value)"
              class="w-full h-full px-[20px] font-['Figtree:Regular',sans-serif] font-normal text-[16px] text-[#333] placeholder-[#8e8e8e] bg-transparent outline-none rounded-[8px]"
            />
            <div aria-hidden="true" class="absolute inset-0 pointer-events-none focus-within:outline focus-within:outline-[3px] focus-within:outline-[#021b59] focus-within:outline-offset-[-1px] rounded-[8px]" />
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-[4px] w-full">
        <label for="descricao" class="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[20px] leading-[30px]">
          Descrição
        </label>
        <div :class="['bg-white h-[56px] w-full border rounded-[8px] relative', showFieldErrors && !form.description.trim() ? 'border-[#c0392b]' : 'border-[#8e8e8e]']">
          <input
            id="descricao"
            type="text"
            placeholder="Descreva o curso"
            :value="form.description"
            @input="setField('description', ($event.target as HTMLInputElement).value)"
            class="w-full h-full px-[20px] font-['Figtree:Regular',sans-serif] font-normal text-[16px] text-[#333] placeholder-[#8e8e8e] bg-transparent outline-none rounded-[8px]"
          />
          <div aria-hidden="true" class="absolute inset-0 pointer-events-none focus-within:outline focus-within:outline-[3px] focus-within:outline-[#021b59] focus-within:outline-offset-[-1px] rounded-[8px]" />
        </div>
      </div>

      <div class="flex flex-col gap-[4px] w-full">
        <label for="horas" class="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[20px] leading-[30px]">
          Carga horária
        </label>
        <div :class="['bg-white h-[56px] w-full border rounded-[8px] relative', showFieldErrors && !form.hours.trim() ? 'border-[#c0392b]' : 'border-[#8e8e8e]']">
          <input
            id="horas"
            type="text"
            placeholder="Ex: 30h"
            :value="form.hours"
            @input="setField('hours', ($event.target as HTMLInputElement).value)"
            class="w-full h-full px-[20px] font-['Figtree:Regular',sans-serif] font-normal text-[16px] text-[#333] placeholder-[#8e8e8e] bg-transparent outline-none rounded-[8px]"
          />
          <div aria-hidden="true" class="absolute inset-0 pointer-events-none focus-within:outline focus-within:outline-[3px] focus-within:outline-[#021b59] focus-within:outline-offset-[-1px] rounded-[8px]" />
        </div>
      </div>

      <div class="flex flex-col gap-[10px]">
        <p class="font-['Figtree:Medium',sans-serif] font-medium text-black text-[18px] leading-[28px]">
          Selecione quais dados os cadastrados deverão informar para cursar:
        </p>
        <div class="flex flex-col gap-[4px]">
          <button
            v-for="field in requiredFieldOptions"
            :key="field"
            type="button"
            role="checkbox"
            :aria-checked="form.requiredFields.includes(field)"
            @click="toggleRequired(field)"
            class="flex items-center gap-[12px] py-[8px] text-left w-fit focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59] rounded-sm"
          >
            <div
              :class="[
                'size-[22px] border-2 border-[#021b59] rounded-[4px] flex items-center justify-center flex-shrink-0 transition-colors',
                form.requiredFields.includes(field) ? 'bg-[#ffeac4]' : 'bg-white'
              ]"
            >
              <svg 
                v-if="form.requiredFields.includes(field)" 
                class="size-[14px]" 
                fill="none" 
                viewBox="0 0 22 22" 
                aria-hidden="true"
              >
                <path clip-rule="evenodd" :d="checkPath" fill="#021B59" fill-rule="evenodd" />
              </svg>
            </div>
            <span class="font-['Figtree:Regular',sans-serif] font-normal text-black text-[16px]">
              {{ field }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <div class="fixed bottom-0 left-0 right-0 bg-white px-[20px] py-[16px] shadow-[0px_-4px_12px_rgba(51,51,51,0.15)] flex justify-center z-10">
      <div class="w-full max-w-[900px]">
        <button
          type="button"
          @click="handleNext"
          class="bg-[#ffeac4] h-[50px] w-full rounded-[26px] cursor-pointer hover:bg-[#ffd9a0] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59]"
        >
          <span class="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[20px]">
            Próximo
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
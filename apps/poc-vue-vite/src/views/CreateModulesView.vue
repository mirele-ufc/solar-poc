<script setup lang="ts">
import { computed, ref, reactive, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useCourseCreationStore } from '@/store/useCourseCreationStore';
import PageHeader from "@/components/shared/PageHeader.vue";
import AddLessonPopup from "@/components/shared/AddLessonPopup.vue";

// --- Types ---
type Lesson = { id: string; name: string; file: string | null };
type Module = { id: string; name: string; image: string | null; lessons: Lesson[] };
interface CourseInfoData {
  title?: string;
}

// --- SVG paths ---
const docPath = "M19.6667 5.66667H7.66667V27H23.6667V9.66667H19.6667V5.66667ZM7.66667 3H21L26.3333 8.33333V27C26.3333 27.7072 26.0524 28.3855 25.5523 28.8856C25.0522 29.3857 24.3739 29.6667 23.6667 29.6667H7.66667C6.95942 29.6667 6.28115 29.3857 5.78105 28.8856C5.28095 28.3855 5 27.7072 5 27V5.66667C5 4.95942 5.28095 4.28115 5.78105 3.78105C6.28115 3.28095 6.95942 3 7.66667 3ZM10.3333 15H21V17.6667H10.3333V15ZM10.3333 20.3333H21V23H10.3333V20.3333Z";
const closeLgPath = "M12.4332 14.0828L5.83333 7.483L7.483 5.83333L14.0828 12.4332L20.6827 5.83333L22.3323 7.483L15.7325 14.0828L22.3323 20.6827L20.6827 22.3323L14.0828 15.7325L7.483 22.3323L5.83333 20.6827L12.4332 14.0828Z";
const closeSmPath = "M10.657 12.071L5 6.414L6.414 5L12.071 10.657L17.728 5L19.142 6.414L13.485 12.071L19.142 17.728L17.728 19.142L12.071 13.485L6.414 19.142L5 17.728L10.657 12.071Z";
const checkPath = "M5 9L3 11L9 17L19 7L17 5L9 13L5 9Z";
const imgIconPath = "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z";

// --- State & Logic ---
const router = useRouter();
const courseCreationStore = useCourseCreationStore();
let nextId = 1;
const uid = () => String(nextId++);

// Recupera dados do store ou da history
const courseData = ref(courseCreationStore.courseData && courseCreationStore.courseData.title 
  ? courseCreationStore.courseData 
  : (history.state?.courseData ?? {}));
const courseTitle = computed(() => courseData.value.title || "Novo Curso");
const modules = ref<Module[]>([
  { id: uid(), name: "Módulo 01", image: null, lessons: [] },
]);

const activeModuleId = ref<string | null>(null);
const error = ref("");
const showErrors = ref(false);

// Refs para inputs de arquivo (dinâmicas por ID de módulo)
const imgRefs = ref<Record<string, HTMLInputElement | null>>({});

const addModule = () => {
  const n = modules.value.length + 1;
  modules.value.push({
    id: uid(),
    name: `Módulo ${String(n).padStart(2, "0")}`,
    image: null,
    lessons: []
  });
};

const removeModule = (modId: string) => {
  modules.value = modules.value.filter((m) => m.id !== modId);
};

const removeLesson = (modId: string, lessonId: string) => {
  const mod = modules.value.find(m => m.id === modId);
  if (mod) {
    mod.lessons = mod.lessons.filter(l => l.id !== lessonId);
  }
};

const handleAddLesson = (name: string, file: string | null) => {
  const mod = modules.value.find(m => m.id === activeModuleId.value);
  if (mod) {
    mod.lessons.push({ id: uid(), name, file });
  }
  activeModuleId.value = null;
};

const handleModuleImageChange = (modId: string, e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const mod = modules.value.find(m => m.id === modId);
    if (mod) mod.image = reader.result as string;
  };
  reader.readAsDataURL(file);
};

const updateLessonFile = (modId: string, lessonId: string, e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  const mod = modules.value.find(m => m.id === modId);
  if (mod) {
    const lesson = mod.lessons.find(l => l.id === lessonId);
    if (lesson) lesson.file = file.name;
  }
};

const handleNext = () => {
  const missingImage = modules.value.some((m) => !m.image);
  if (missingImage) {
    error.value = "Por favor, preencha os campos destacados para finalizar o cadastro";
    showErrors.value = true;
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  error.value = "";
  
  // Salva os módulos no store
  courseCreationStore.setModules(modules.value);
  
  router.push({ name: "create-exam" });
};
</script>

<template>
  <div class="bg-white flex flex-col pb-[100px]">
    <div v-if="error" role="alert" class="w-full bg-[#c0392b]/10 border-l-4 border-[#c0392b] px-[20px] py-[14px]">
      <p class="font-['Figtree:Medium',sans-serif] font-medium text-[#c0392b] text-[15px]">{{ error }}</p>
    </div>

    <div class="max-w-[900px] mx-auto flex flex-col gap-[20px] px-[20px] md:px-[40px] pt-[24px] w-full">
      <PageHeader
        title="Estrutura de Módulos"
        backPath="/create-course"
        :crumbs="[
          { label: 'Courses', path: '/courses' },
          { label: 'Create Course', path: '/create-course' },
          { label: 'Modules' },
        ]"
      />

      <h2 class="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[20px] leading-[30px]">
        {{ courseTitle }} — Estrutura
      </h2>

      <div
        v-for="mod in modules"
        :key="mod.id"
        class="border w-full rounded-[8px] overflow-hidden"
        :class="showErrors && !mod.image ? 'border-[#c0392b]' : 'border-black'"
      >
        <div class="flex flex-col gap-[14px] p-[16px] pb-0">
          <div class="flex items-center justify-between gap-[8px]">
            <p class="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[20px] leading-[30px]">
              {{ mod.name }}
            </p>
            <button
              v-if="modules.length > 1"
              type="button"
              :aria-label="`Excluir ${mod.name}`"
              @click="removeModule(mod.id)"
              class="shrink-0 flex items-center gap-[6px] px-[12px] h-[32px] rounded-[26px] border border-[#801436] text-[#801436] hover:bg-[#801436]/10 transition-colors focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#801436]"
            >
              <svg class="size-[14px]" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="#801436" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span class="font-['Figtree:Medium',sans-serif] font-medium text-[13px] leading-none">Excluir módulo</span>
            </button>
          </div>

          <button
            type="button"
            :aria-label="`Adicionar imagem para ${mod.name} (obrigatório)`"
            @click="imgRefs[mod.id]?.click()"
            class="w-full h-[140px] rounded-[8px] overflow-hidden flex flex-col items-center justify-center transition-colors focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59]"
            :class="[
              mod.image ? '' : (showErrors && !mod.image) ? 'bg-[#c0392b]/10 border-2 border-dashed border-[#c0392b]' : 'bg-[#f0f0f0] border-2 border-dashed border-[#8e8e8e] hover:bg-[#e8e8e8]'
            ]"
          >
            <img v-if="mod.image" :src="mod.image" :alt="`Imagem de ${mod.name}`" class="w-full h-full object-cover" />
            <template v-else>
              <svg class="size-[32px] mb-[6px]" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <path :d="imgIconPath" :stroke="showErrors && !mod.image ? '#c0392b' : '#595959'" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <p class="font-['Figtree:Regular',sans-serif] text-[14px]" :class="showErrors && !mod.image ? 'text-[#c0392b]' : 'text-[#595959]'">
                {{ showErrors && !mod.image ? "Imagem obrigatória" : "Clique para adicionar imagem do módulo" }}
              </p>
            </template>
          </button>
          <input
            :ref="(el) => { imgRefs[mod.id] = el as HTMLInputElement }"
            type="file"
            accept="image/*"
            class="hidden"
            aria-hidden="true"
            @change="handleModuleImageChange(mod.id, $event)"
          />

          <div v-if="mod.lessons.length === 0" class="bg-[#efbbdc] h-[52px] flex items-center px-[20px] rounded-[4px]">
            <p class="font-['Figtree:Medium',sans-serif] font-medium text-black text-[17px]">Nenhuma aula adicionada</p>
          </div>
          <div
            v-for="lesson in mod.lessons"
            :key="lesson.id"
            class="bg-[#c5d6ff] h-[52px] flex items-center justify-between px-[16px] rounded-[4px] mb-2 last:mb-0"
          >
            <p class="font-['Figtree:Medium',sans-serif] font-medium text-black text-[17px] flex-1 min-w-0 truncate">
              {{ lesson.name }}
              <span v-if="lesson.file" class="ml-[8px] font-['Figtree:Regular',sans-serif] font-normal text-[13px] text-[#021b59]/70">
                · {{ lesson.file }}
              </span>
            </p>
            <div class="flex items-center gap-[6px] shrink-0 ml-[10px]">
              <label class="shrink-0 size-[26px] flex items-center justify-center cursor-pointer rounded hover:bg-[#021b59]/10 transition-colors focus-within:outline focus-within:outline-[2px] focus-within:outline-[#021b59]">
                <input type="file" class="sr-only" @change="updateLessonFile(mod.id, lesson.id, $event)" />
                <svg class="size-[16px]" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M15.232 5.232l3.536 3.536M9 11l6.586-6.586a2 2 0 012.828 0l.172.172a2 2 0 010 2.828L12 14H9v-3z" stroke="#021b59" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M5 19h14" stroke="#021b59" stroke-width="1.8" stroke-linecap="round" />
                </svg>
              </label>
              <button @click="removeLesson(mod.id, lesson.id)" type="button" class="shrink-0 size-[26px] focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59] rounded">
                <svg class="size-full" fill="none" viewBox="0 0 28 28" aria-hidden="true">
                  <path clip-rule="evenodd" :d="closeLgPath" fill="#801436" fill-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div class="p-[16px]">
          <button
            type="button"
            @click="activeModuleId = mod.id"
            class="h-[48px] w-full border-2 border-[#021b59] rounded-[26px] flex items-center justify-center gap-[8px] cursor-pointer hover:bg-[#021b59]/5 transition-colors focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59]"
          >
            <svg class="size-[24px] shrink-0" fill="none" viewBox="0 0 32 32.6667" aria-hidden="true">
              <path :d="docPath" fill="#021B59" />
            </svg>
            <span class="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[18px]">Adicionar aula</span>
          </button>
        </div>
      </div>

      <button
        type="button"
        @click="addModule"
        class="h-[50px] w-full border-2 border-[#021b59] rounded-[26px] flex items-center justify-center gap-[8px] cursor-pointer hover:bg-[#021b59]/5 transition-colors focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59]"
      >
        <svg class="size-[28px] shrink-0" fill="none" viewBox="0 0 32 32.6667" aria-hidden="true">
          <path :d="docPath" fill="#021B59" />
        </svg>
        <span class="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[20px]">Adicionar módulo</span>
      </button>
    </div>

    <AddLessonPopup
      v-if="activeModuleId"
      @close="activeModuleId = null"
      @confirm="handleAddLesson"
    />

    <div class="fixed bottom-0 left-0 right-0 bg-white px-[20px] py-[16px] shadow-[0px_-4px_12px_rgba(51,51,51,0.15)] flex justify-center z-10">
      <div class="w-full max-w-[900px]">
        <button
          type="button"
          @click="handleNext"
          class="bg-[#ffeac4] h-[50px] w-full rounded-[26px] cursor-pointer hover:bg-[#ffd9a0] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59]"
        >
          <span class="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[20px]">Próximo</span>
        </button>
      </div>
    </div>
  </div>
</template>
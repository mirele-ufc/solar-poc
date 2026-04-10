<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useCourseStore } from "@/store/useCourseStore";
import { useCourseFlow } from "@/composables/useCourseFlow";
import PageHeader from "@/components/shared/PageHeader.vue";
import { toast } from "vue-sonner";

const WARN_PATH = "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z";
const FALLBACK_IMAGE = "https://via.placeholder.com/800x300?text=Curso";

const router = useRouter();
const courseStore = useCourseStore();
const showCancelModal = ref(false);
const {
  courseId,
  courseConfig: course,
  isValid,
  isLoading,
  error,
  navigateTo,
} = useCourseFlow();

// Dados do curso
const title = computed(() => course.value?.title || "");
const description = computed(() => course.value?.description || "");
const imageUrl = computed(() => course.value?.imagePath || FALLBACK_IMAGE);
const category = computed(() => course.value?.category || "");

const enrolled = computed(() => courseStore.isEnrolledInCourse(courseId));

const handleInscrever = () => {
  if (enrolled.value) {
    navigateTo("modules");
  } else {
    navigateTo("enrollment");
  }
};

const handleConfirmCancel = () => {
  courseStore.unenrollFromCourse(courseId);

  toast.success("Matrícula cancelada com sucesso.", {
    description: `Seu acesso ao conteúdo de ${title.value} foi removido.`,
    duration: 5000,
  });

  router.push("/courses");
};
</script>

<template>
  <div
    v-if="isLoading"
    class="bg-white flex flex-col pb-[100px] px-[20px] md:px-[40px] pt-[24px]"
  >
    <p class="text-center">Carregando curso...</p>
  </div>

  <div
    v-else-if="error || !isValid"
    class="bg-white flex flex-col pb-[100px] px-[20px] md:px-[40px] pt-[24px]"
  >
    <p class="text-red-600 text-center">
      {{ error || "Curso não encontrado." }}
    </p>
    <button
      @click="router.push('/courses')"
      class="mt-4 mx-auto px-4 py-2 bg-blue-600 text-white rounded"
    >
      Voltar aos cursos
    </button>
  </div>

  <div v-else class="bg-white flex flex-col pb-[100px]">
    <div class="w-full h-[218px] md:h-[320px] overflow-hidden">
      <img
        :alt="`${title} – curso`"
        class="w-full h-full object-cover"
        :src="imageUrl"
        @error="
          (e: Event) => {
            (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
          }
        "
      />
    </div>

    <div
      class="max-w-[900px] mx-auto flex flex-col gap-[24px] px-[20px] md:px-[40px] pt-[24px] w-full"
    >
      <PageHeader
        :title="title"
        backPath="/courses"
        :crumbs="[{ label: 'Cursos', path: '/courses' }, { label: title }]"
      />

      <div
        class="flex flex-col gap-[6px] md:flex-row md:items-baseline md:justify-between"
      >
        <h1
          class="font-['Figtree:Bold',sans-serif] font-bold leading-[36px] text-black text-[24px]"
        >
          {{ title }}
        </h1>
        <p
          class="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] text-[#595959] text-[18px] shrink-0"
        >
          Categoría: {{ category }}
        </p>
      </div>

      <div class="flex flex-col gap-[10px]">
        <h2
          class="font-['Figtree:Bold',sans-serif] font-bold leading-[30px] text-black text-[20px]"
        >
          Sobre o curso
        </h2>
        <p
          class="font-['Figtree:Regular',sans-serif] font-normal leading-[26px] text-black text-[16px]"
        >
          {{ description }}
        </p>
      </div>
    </div>

    <div
      class="fixed bottom-0 left-0 right-0 bg-white px-[20px] py-[16px] shadow-[0px_-4px_12px_rgba(51,51,51,0.15)] flex justify-center z-10"
    >
      <div class="w-full max-w-[900px] flex flex-col gap-[10px]">
        <button
          type="button"
          @click="handleInscrever"
          class="bg-[#ffeac4] h-[50px] w-full rounded-[26px] cursor-pointer hover:bg-[#ffd9a0] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59] focus-visible:outline-offset-[2px]"
        >
          <span
            class="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[20px]"
          >
            {{ enrolled ? "Acessar curso" : "Inscrever-se" }}
          </span>
        </button>

        <button
          v-if="enrolled"
          type="button"
          @click="showCancelModal = true"
          class="h-[44px] w-full rounded-[26px] border-2 border-[#de2e66] cursor-pointer hover:bg-[#de2e66]/5 transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#de2e66] focus-visible:outline-offset-[2px]"
          aria-label="Cancelar matrícula neste curso"
        >
          <span
            class="font-['Figtree:Medium',sans-serif] font-medium text-[#de2e66] text-[16px]"
          >
            Cancelar matrícula
          </span>
        </button>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showCancelModal">
        <div
          class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          @click="showCancelModal = false"
        />
        <div
          class="fixed inset-0 z-50 flex items-center justify-center px-[20px]"
        >
          <div
            class="bg-white w-full max-w-[420px] rounded-[12px] shadow-2xl p-[28px] flex flex-col gap-[20px]"
          >
            <div class="flex flex-col items-center gap-[12px] text-center">
              <div
                class="size-[52px] rounded-full bg-[#fde8ef] flex items-center justify-center shrink-0"
              >
                <svg class="size-[28px]" fill="none" viewBox="0 0 24 24">
                  <path :d="WARN_PATH" fill="#de2e66" />
                </svg>
              </div>
              <h2
                class="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[20px] leading-[30px]"
              >
                Cancelar matrícula?
              </h2>
            </div>
            <p
              class="font-['Figtree:Regular',sans-serif] text-[#333] text-[15px] leading-[24px] text-center"
            >
              Tem certeza que deseja cancelar sua matrícula neste curso?
              <span
                class="font-['Figtree:Medium',sans-serif] font-medium text-[#801436]"
              >
                Após o cancelamento, você perderá o acesso ao conteúdo da
                disciplina </span
              >.
            </p>
            <div class="flex flex-col gap-[10px]">
              <button
                @click="handleConfirmCancel"
                class="w-full h-[50px] bg-[#de2e66] rounded-[26px] text-white font-medium"
              >
                Confirmar cancelamento
              </button>
              <button
                @click="showCancelModal = false"
                class="w-full h-[50px] border-2 border-[#021b59] rounded-[26px] text-[#021b59] font-medium"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

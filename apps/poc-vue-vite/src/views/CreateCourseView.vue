<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useCourseCreationStore } from "@/store/useCourseCreationStore";
import { courseService } from "@/services/api/courseService";
import { validateFileBeforeUpload } from "@/services/validation/fileValidator";
import PageHeader from "@/components/shared/PageHeader.vue";

export type CourseInfoData = {
  image: string | null;
  title: string;
  description: string;
  category: string;
  hours: string;
  requiredFields: string[];
};

const fileImagePath = "...";
const checkPath = "M18.5 5.5L8 16l-4.5-4.5";
const requiredFieldOptions = ["Endereço", "Gênero", "Idade"];

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

const imageFile = ref<File | null>(null);
const isSubmitting = ref(false);
const error = ref("");
const showFieldErrors = ref(false);

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

const handleImageChange = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  const rawFile = target.files?.[0];

  if (rawFile) {
    const { isValid, errorMessage, file } = await validateFileBeforeUpload(
      rawFile,
      "IMAGE",
    );

    if (!isValid) {
      error.value = errorMessage || "Erro de validação";
      target.value = "";
      imageFile.value = null;
      form.value.image = null;
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    error.value = "";
    imageFile.value = file;
    const reader = new FileReader();
    reader.onload = () => {
      form.value.image = reader.result as string;
    };
    reader.readAsDataURL(file!);
  }
};

const handleNext = async () => {
  const missing =
    !form.value.title.trim() ||
    !form.value.description.trim() ||
    !form.value.category.trim() ||
    !form.value.hours.trim();

  if (missing) {
    error.value =
      "Por favor, preencha os campos destacados para finalizar o cadastro";
    showFieldErrors.value = true;
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  error.value = "";
  isSubmitting.value = true;

  try {
    const response = await courseService.createCourse(
      form.value,
      imageFile.value,
    );

    if (response.sucesso) {
      const courseId = response.dados?.id;

      if (!courseId) {
        throw new Error("ID do curso não retornado pelo servidor.");
      }

      courseCreationStore.setCourseData({
        ...form.value,
        id: courseId,
      });

      router.push({ name: "create-module" });
    } else {
      error.value = response.mensagem || "Falha na criação do curso.";
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  } catch (err: unknown) {
    const errorMsg =
      err instanceof Error
        ? err.message
        : "Erro ao conectar com o servidor. Tente novamente.";
    console.error("Erro ao criar curso:", errorMsg);
    error.value = errorMsg;
    window.scrollTo({ top: 0, behavior: "smooth" });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="bg-white flex flex-col pb-[100px]">
    <div
      v-if="error"
      role="alert"
      class="w-full bg-[#c0392b]/10 border-l-4 border-[#c0392b] px-[20px] py-[14px]"
    >
      <p
        class="font-['Figtree:Medium',sans-serif] font-medium text-[#c0392b] text-[15px]"
      >
        {{ error }}
      </p>
    </div>

    <button
      type="button"
      aria-label="Clique para adicionar imagem do curso (opcional)"
      @click="imageInputRef?.click()"
      class="w-full h-[218px] md:h-[280px] flex flex-col items-center justify-center hover:bg-[#3a3a3a] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59] overflow-hidden bg-[#484848]"
    >
      <img
        v-if="form.image"
        :src="form.image"
        alt="Capa do curso"
        class="w-full h-full object-cover"
      />
      <template v-else>
        <svg
          class="size-[78px]"
          fill="none"
          viewBox="0 0 78 78"
          aria-hidden="true"
        >
          <path
            clip-rule="evenodd"
            :d="fileImagePath"
            fill="white"
            fill-rule="evenodd"
          />
        </svg>
        <p
          class="text-white text-[14px] mt-[8px] font-['Figtree:Medium',sans-serif] font-medium"
        >
          Adicionar imagem (opcional)
        </p>
      </template>
    </button>

    <input
      ref="imageInputRef"
      type="file"
      accept=".jpg,.jpeg,.png,image/jpeg,image/png"
      class="hidden"
      aria-hidden="true"
      tabindex="-1"
      @change="handleImageChange"
    />

    <div
      class="max-w-[900px] mx-auto flex flex-col gap-[20px] px-[20px] md:px-[40px] pt-[24px] w-full"
    >
      <PageHeader
        title="Criar Curso"
        back-path="/courses"
        :crumbs="[
          { label: 'Cursos', path: '/courses' },
          { label: 'Criar Curso' },
        ]"
      />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
        <div class="flex flex-col gap-[4px] w-full">
          <label
            for="titulo"
            class="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[20px] leading-[30px]"
          >
            Título do curso
          </label>
          <div
            :class="[
              'bg-white h-[56px] w-full border rounded-[8px] relative',
              showFieldErrors && !form.title.trim()
                ? 'border-[#c0392b]'
                : 'border-[#8e8e8e]',
            ]"
          >
            <input
              id="titulo"
              type="text"
              placeholder="Digite o título"
              :value="form.title"
              @input="
                setField('title', ($event.target as HTMLInputElement).value)
              "
              class="w-full h-full px-[20px] font-['Figtree:Regular',sans-serif] font-normal text-[16px] text-[#333] placeholder-[#8e8e8e] bg-transparent outline-none rounded-[8px]"
            />
            <div
              aria-hidden="true"
              class="absolute inset-0 pointer-events-none focus-within:outline focus-within:outline-[3px] focus-within:outline-[#021b59] focus-within:outline-offset-[-1px] rounded-[8px]"
            />
          </div>
        </div>

        <div class="flex flex-col gap-[4px] w-full">
          <label
            for="categoria"
            class="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[20px] leading-[30px]"
          >
            Categoria
          </label>
          <div
            :class="[
              'bg-white h-[56px] w-full border rounded-[8px] relative',
              showFieldErrors && !form.category.trim()
                ? 'border-[#c0392b]'
                : 'border-[#8e8e8e]',
            ]"
          >
            <input
              id="categoria"
              type="text"
              placeholder="Ex: Computação, Design"
              :value="form.category"
              @input="
                setField('category', ($event.target as HTMLInputElement).value)
              "
              class="w-full h-full px-[20px] font-['Figtree:Regular',sans-serif] font-normal text-[16px] text-[#333] placeholder-[#8e8e8e] bg-transparent outline-none rounded-[8px]"
            />
            <div
              aria-hidden="true"
              class="absolute inset-0 pointer-events-none focus-within:outline focus-within:outline-[3px] focus-within:outline-[#021b59] focus-within:outline-offset-[-1px] rounded-[8px]"
            />
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-[4px] w-full">
        <label
          for="descricao"
          class="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[20px] leading-[30px]"
        >
          Descrição
        </label>
        <div
          :class="[
            'bg-white h-[56px] w-full border rounded-[8px] relative',
            showFieldErrors && !form.description.trim()
              ? 'border-[#c0392b]'
              : 'border-[#8e8e8e]',
          ]"
        >
          <input
            id="descricao"
            type="text"
            placeholder="Descreva o curso"
            :value="form.description"
            @input="
              setField('description', ($event.target as HTMLInputElement).value)
            "
            class="w-full h-full px-[20px] font-['Figtree:Regular',sans-serif] font-normal text-[16px] text-[#333] placeholder-[#8e8e8e] bg-transparent outline-none rounded-[8px]"
          />
          <div
            aria-hidden="true"
            class="absolute inset-0 pointer-events-none focus-within:outline focus-within:outline-[3px] focus-within:outline-[#021b59] focus-within:outline-offset-[-1px] rounded-[8px]"
          />
        </div>
      </div>

      <div class="flex flex-col gap-[4px] w-full">
        <label
          for="horas"
          class="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[20px] leading-[30px]"
        >
          Carga horária
        </label>
        <div
          :class="[
            'bg-white h-[56px] w-full border rounded-[8px] relative',
            showFieldErrors && !form.hours.trim()
              ? 'border-[#c0392b]'
              : 'border-[#8e8e8e]',
          ]"
        >
          <input
            id="horas"
            type="text"
            placeholder="Ex: 30h"
            :value="form.hours"
            @input="
              setField('hours', ($event.target as HTMLInputElement).value)
            "
            class="w-full h-full px-[20px] font-['Figtree:Regular',sans-serif] font-normal text-[16px] text-[#333] placeholder-[#8e8e8e] bg-transparent outline-none rounded-[8px]"
          />
          <div
            aria-hidden="true"
            class="absolute inset-0 pointer-events-none focus-within:outline focus-within:outline-[3px] focus-within:outline-[#021b59] focus-within:outline-offset-[-1px] rounded-[8px]"
          />
        </div>
      </div>

      <div class="flex flex-col gap-[10px]">
        <p
          class="font-['Figtree:Medium',sans-serif] font-medium text-black text-[18px] leading-[28px]"
        >
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
                form.requiredFields.includes(field)
                  ? 'bg-[#ffeac4]'
                  : 'bg-white',
              ]"
            >
              <svg
                v-if="form.requiredFields.includes(field)"
                class="size-[16px]"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="3"
                stroke="#021B59"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  :d="checkPath"
                />
              </svg>
            </div>
            <span
              class="font-['Figtree:Regular',sans-serif] font-normal text-black text-[16px]"
            >
              {{ field }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <div
      class="fixed bottom-0 left-0 right-0 bg-white px-[20px] py-[16px] shadow-[0px_-4px_12px_rgba(51,51,51,0.15)] flex justify-center z-10"
    >
      <div class="w-full max-w-[900px]">
        <button
          type="button"
          @click="handleNext"
          :disabled="isSubmitting"
          :class="[
            'bg-[#ffeac4] h-[50px] w-full rounded-[26px] cursor-pointer transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59]',
            isSubmitting
              ? 'opacity-60 cursor-not-allowed'
              : 'hover:bg-[#ffd9a0]',
          ]"
        >
          <span
            class="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[20px]"
          >
            {{ isSubmitting ? "Criando curso..." : "Próximo" }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

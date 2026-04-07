<script setup lang="ts">
import { ref, useRef, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useCourseStore } from "@/store/useCourseStore";
import PageHeader from "@/components/shared/PageHeader.vue";

// --- Constantes e Assets ---
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1624953587687-daf255b6b80a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxweXRob24lMjBwcm9ncmFtbWluZyUyMGNvZGUlMjBjb21wdXRlcnxlbnwxfHx8fDE3NzMzMzU2MTd8MA&ixlib=rb-4.1.0&q=80&w=1080";

const dropdownArrow =
  "M1.5275 2L6.5 6.96167L11.4725 2L13 3.5275L6.5 10.0275L0 3.5275L1.5275 2Z";

const generos = ["Prefiro não informar", "Masculino", "Feminino", "Outro"];

// --- Estado e Hooks ---
const router = useRouter();
const { enrollInCourse } = useCourseStore();

const nome = ref("");
const sobrenome = ref("");
const cidade = ref("");
const genero = ref("");
const generoOpen = ref(false);

const status = ref<"idle" | "success" | "error">("idle");
const showErrors = ref(false);
const topRef = ref<HTMLElement | null>(null);

// --- Métodos ---
const handleFinalizar = async () => {
  const missing =
    !nome.value.trim() ||
    !sobrenome.value.trim() ||
    !cidade.value.trim() ||
    !genero.value;

  if (missing) {
    status.value = "error";
    showErrors.value = true;
    topRef.value?.scrollIntoView({ behavior: "smooth" });
    return;
  }

  enrollInCourse("python");
  status.value = "success";
  
  // Garante que o banner de sucesso seja renderizado antes do scroll
  await nextTick();
  topRef.value?.scrollIntoView({ behavior: "smooth" });

  setTimeout(() => {
    router.push("/courses/python/modules");
  }, 1800);
};

const selectGenero = (option: string) => {
  genero.value = option;
  generoOpen.value = false;
};
</script>

<template>
  <div class="bg-white flex flex-col pb-[100px]">
    <div ref="topRef">
      <div
        v-if="status === 'success'"
        role="alert"
        aria-live="polite"
        class="w-full bg-[#e6f9ee] border-l-4 border-[#155724] px-[20px] py-[14px] flex items-center gap-[12px]"
      >
        <svg class="size-[20px] shrink-0" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#155724" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <p class="font-['Figtree:Medium',sans-serif] font-medium text-[#155724] text-[15px]">
          Inscrição realizada com sucesso! Redirecionando para os módulos…
        </p>
      </div>

      <div
        v-if="status === 'error'"
        class="bg-[#c0392b] border border-[#c0392b] rounded-[12px] p-[16px] w-full mb-[12px]"
        role="alert"
      >
        <p class="font-['Figtree:Medium',sans-serif] font-medium text-white text-[15px]">
          Por favor, preencha os campos destacados para finalizar a inscrição
        </p>
      </div>
    </div>

    <div class="w-full h-[218px] md:h-[300px] overflow-hidden">
      <img :src="HERO_IMAGE" alt="Python – código e programação" class="w-full h-full object-cover" />
    </div>

    <div class="max-w-[900px] mx-auto flex flex-col gap-[16px] px-[20px] md:px-[40px] pt-[24px] w-full text-left">
      <PageHeader
        title="Inscrição"
        backPath="/courses/python"
        :crumbs="[
          { label: 'Cursos', path: '/courses' },
          { label: 'Python Iniciante', path: '/courses/python' },
          { label: 'Inscrição' },
        ]"
      />

      <h2 class="font-['Figtree:Bold',sans-serif] font-bold leading-[36px] text-black text-[22px]">
        Python Iniciante
      </h2>
      <p class="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] text-black text-[20px]">
        Confirme seus dados
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
        <div class="flex flex-col w-full gap-[2px]">
          <label for="nome" class="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] text-[#333] text-[20px]">Nome</label>
          <div :class="['bg-white h-[60px] w-full rounded-[12px] relative border transition-all', (showErrors && !nome.trim()) ? 'border-2 border-[#c0392b]' : 'border border-[#5f5f5f] focus-within:outline focus-within:outline-[3px] focus-within:outline-[#042e99] focus-within:outline-offset-[-1px]']">
            <div class="flex items-center px-[20px] h-full">
              <input id="nome" v-model="nome" type="text" placeholder="Insira seu nome" class="flex-1 font-['Figtree:Regular',sans-serif] font-normal text-[16px] text-[#333] placeholder-[#595959] bg-transparent outline-none" />
            </div>
          </div>
          <p v-if="showErrors && !nome.trim()" class="font-['Figtree:Regular',sans-serif] font-normal text-[14px] mt-[4px] text-[#c0392b]">Nome não informado</p>
        </div>

        <div class="flex flex-col w-full gap-[2px]">
          <label for="sobrenome" class="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] text-[#333] text-[20px]">Sobrenome</label>
          <div :class="['bg-white h-[60px] w-full rounded-[12px] relative border transition-all', (showErrors && !sobrenome.trim()) ? 'border-2 border-[#c0392b]' : 'border border-[#5f5f5f] focus-within:outline focus-within:outline-[3px] focus-within:outline-[#042e99] focus-within:outline-offset-[-1px]']">
            <div class="flex items-center px-[20px] h-full">
              <input id="sobrenome" v-model="sobrenome" type="text" placeholder="Insira seu sobrenome" class="flex-1 font-['Figtree:Regular',sans-serif] font-normal text-[16px] text-[#333] placeholder-[#595959] bg-transparent outline-none" />
            </div>
          </div>
          <p v-if="showErrors && !sobrenome.trim()" class="font-['Figtree:Regular',sans-serif] font-normal text-[14px] mt-[4px] text-[#c0392b]">Sobrenome não informado</p>
        </div>
      </div>

      <div class="flex flex-col w-full gap-[2px]">
        <label for="cidade" class="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] text-[#333] text-[20px]">Cidade</label>
        <div :class="['bg-white h-[60px] w-full rounded-[12px] relative border transition-all', (showErrors && !cidade.trim()) ? 'border-2 border-[#c0392b]' : 'border border-[#5f5f5f] focus-within:outline focus-within:outline-[3px] focus-within:outline-[#042e99] focus-within:outline-offset-[-1px]']">
          <div class="flex items-center px-[20px] h-full">
            <input id="cidade" v-model="cidade" type="text" placeholder="Insira o nome da cidade onde você mora" class="flex-1 font-['Figtree:Regular',sans-serif] font-normal text-[16px] text-[#333] placeholder-[#595959] bg-transparent outline-none" />
          </div>
        </div>
        <p v-if="showErrors && !cidade.trim()" class="font-['Figtree:Regular',sans-serif] font-normal text-[14px] mt-[4px] text-[#c0392b]">Cidade não informada</p>
      </div>

      <div class="flex flex-col w-full gap-[2px]">
        <label for="genero" class="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] text-[#333] text-[20px]">Gênero</label>
        <div class="relative">
          <button
            type="button"
            id="genero"
            aria-haspopup="listbox"
            :aria-expanded="generoOpen"
            @click="generoOpen = !generoOpen"
            :class="['bg-white h-[60px] w-full rounded-[12px] flex items-center gap-[10px] px-[20px] py-[12px] relative transition-all border outline-none', (showErrors && !genero) ? 'border-2 border-[#c0392b]' : 'border border-[#5f5f5f] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#042e99] focus-visible:outline-offset-[-1px]']"
          >
            <span :class="['flex-1 text-left font-[\'Figtree:Regular\',sans-serif] font-normal text-[16px]', genero ? 'text-[#333]' : 'text-[#595959]']">
              {{ genero || "Selecione uma opção" }}
            </span>
            <svg
              class="size-[13px] shrink-0 transition-transform duration-200"
              fill="none"
              viewBox="0 0 13 10.03"
              aria-hidden="true"
              :style="{ transform: generoOpen ? 'rotate(180deg)' : 'none' }"
            >
              <path :d="dropdownArrow" fill="#042e99" />
            </svg>
          </button>

          <div v-if="generoOpen">
            <div class="fixed inset-0 z-20" @click="generoOpen = false" />
            <ul role="listbox" aria-label="Gênero" class="absolute left-0 right-0 top-[65px] bg-white border border-[#5f5f5f] z-30 shadow-lg overflow-hidden rounded-[12px]">
              <li v-for="g in generos" :key="g">
                <button
                  type="button"
                  role="option"
                  :aria-selected="genero === g"
                  @click="selectGenero(g)"
                  class="w-full text-left px-[20px] py-[14px] font-['Figtree:Regular',sans-serif] font-normal text-[16px] text-[#333] hover:bg-[#ffeac4]/40 focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#042e99] transition-colors"
                >
                  {{ g }}
                </button>
              </li>
            </ul>
          </div>
        </div>
        <p v-if="showErrors && !genero" class="font-['Figtree:Regular',sans-serif] font-normal text-[14px] mt-[4px] text-[#c0392b]">Gênero não informado</p>
      </div>

      <p class="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] text-[#595959] text-[16px]">
        Seus dados serão utilizados para emissão da sua declaração.
      </p>
    </div>

    <div class="fixed bottom-0 left-0 right-0 bg-white px-[20px] py-[16px] shadow-[0px_-4px_12px_rgba(51,51,51,0.15)] flex justify-center z-10">
      <div class="w-full max-w-[900px]">
        <button
          type="button"
          @click="handleFinalizar"
          :disabled="status === 'success'"
          class="bg-[#ffeac4] h-[50px] w-full rounded-[26px] cursor-pointer hover:bg-[#ffd9a0] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#042e99] focus-visible:outline-offset-[2px] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span class="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[20px]">
            Finalizar inscrição
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
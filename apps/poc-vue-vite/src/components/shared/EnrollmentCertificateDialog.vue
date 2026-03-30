<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';

interface Props {
  studentName: string;
  validationCode: string;
  emissionDate: Date;
  enrollmentDate: Date;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'close'): void
}>();

// --- Funções Utilitárias ---
const formatDate = (date: Date): string => {
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const handlePrint = () => {
  window.print();
};

// --- Acessibilidade: Fechar com ESC ---
const handleEsc = (e: KeyboardEvent) => {
  if (e.key === "Escape") emit('close');
};

onMounted(() => document.addEventListener("keydown", handleEsc));
onUnmounted(() => document.removeEventListener("keydown", handleEsc));
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
      @click="emit('close')"
      aria-hidden="true"
    />
    <div
      class="fixed inset-0 z-50 flex items-center justify-center px-[16px] py-[24px] overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="matricula-modal-title"
    >
      <div class="bg-white w-full max-w-[580px] rounded-[12px] shadow-2xl flex flex-col overflow-hidden">
        
        <div class="px-[28px] md:px-[40px] py-[32px] flex flex-col gap-[20px]">
          
          <div class="text-center flex flex-col gap-[4px] border-b border-[#e0e0e0] pb-[20px]">
            <div class="inline-flex items-center justify-center gap-[10px] mx-auto mb-[8px]">
              <div class="size-[44px] rounded-full bg-[#021b59] flex items-center justify-center shrink-0">
                <span class="font-['Figtree:Bold',sans-serif] font-bold text-white text-[16px]">
                  S
                </span>
              </div>
              <div class="text-left">
                <p class="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[15px] leading-[20px]">
                  SOLAR
                </p>
                <p class="font-['Figtree:Regular',sans-serif] text-[#606060] text-[12px] leading-[16px]">
                  Sistema Online de Aprendizagem
                </p>
              </div>
            </div>
            <p class="font-['Figtree:Regular',sans-serif] text-[#606060] text-[12px]">
              Universidade Federal do Ceará — UFC
            </p>
          </div>

          <div class="text-center">
            <h3 class="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[20px] leading-[30px] uppercase tracking-wide">
              Declaração de Matrícula
            </h3>
          </div>

          <div class="font-['Figtree:Regular',sans-serif] text-[#333] text-[15px] leading-[26px] text-justify">
            <p>
              Declaramos, para os devidos fins, que
              <span class="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59]">
                {{ studentName }}
              </span>
              encontra-se regularmente matriculado(a) no curso
              <span class="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59]">
                Power BI - Fundamentos
              </span>
              , ofertado pela Universidade Federal do Ceará através da plataforma SOLAR.
            </p>
          </div>

          <div class="bg-[#f5f8ff] rounded-[10px] p-[18px] grid grid-cols-1 sm:grid-cols-2 gap-[12px]">
            <div v-for="item in [
              { label: 'Aluno(a)', value: studentName },
              { label: 'Curso', value: 'Power BI - Fundamentos' },
              { label: 'Carga Horária', value: '30 horas' },
              { label: 'Data de Matrícula', value: formatDate(enrollmentDate) },
              { label: 'Status da Matrícula', value: 'Ativa' },
              { label: 'Data de Emissão', value: formatDate(emissionDate) },
            ]" :key="item.label">
              <p class="font-['Figtree:Regular',sans-serif] text-[#8e8e8e] text-[11px] leading-[16px] uppercase tracking-wide">
                {{ item.label }}
              </p>
              <p
                :class="[
                  'font-[\'Figtree:Medium\',sans-serif] font-medium text-[14px] leading-[22px]',
                  item.label === 'Status da Matrícula' ? 'text-[#042e99]' : 'text-[#021b59]'
                ]"
              >
                {{ item.value }}
              </p>
            </div>
          </div>

          <div class="border border-dashed border-[#759BFB] rounded-[10px] px-[18px] py-[14px] flex flex-col gap-[4px]">
            <p class="font-['Figtree:Regular',sans-serif] text-[#8e8e8e] text-[11px] uppercase tracking-wide">
              Código de Validação
            </p>
            <p class="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[17px] tracking-[0.15em] font-mono">
              {{ validationCode }}
            </p>
            <p class="font-['Figtree:Regular',sans-serif] text-[#8e8e8e] text-[11px] leading-[16px]">
              Este código garante a autenticidade do documento e pode ser utilizado para verificação futura.
            </p>
          </div>

          <p class="font-['Figtree:Regular',sans-serif] text-[#8e8e8e] text-[12px] leading-[18px] text-center">
            Documento emitido eletronicamente pelo sistema SOLAR — UFC em {{ formatDate(emissionDate) }}.
          </p>
        </div>

        <div class="px-[28px] md:px-[40px] pb-[28px] flex flex-col sm:flex-row gap-[10px]">
          <button
            type="button"
            @click="handlePrint"
            class="flex-1 h-[48px] bg-[#021b59] rounded-[26px] hover:bg-[#042e99] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59] focus-visible:outline-offset-[2px] flex items-center justify-center gap-[8px]"
          >
            <svg class="size-[18px]" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6v-8z"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span class="font-['Figtree:Medium',sans-serif] font-medium text-white text-[16px]">
              Imprimir / Baixar PDF
            </span>
          </button>
          <button
            type="button"
            @click="emit('close')"
            class="flex-1 h-[48px] border-2 border-[#021b59] rounded-[26px] hover:bg-[#021b59]/5 transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59] focus-visible:outline-offset-[2px]"
          >
            <span class="font-['Figtree:Medium',sans-serif] font-medium text-[#021b59] text-[16px]">
              Fechar
            </span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
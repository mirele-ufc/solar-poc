<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// ── Icon Paths ────────────────────────────────────────────────────────────────
const arrowBackPath = "M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2Z";
const sendPath = "M2.01 21L23 12 2.01 3 2 10l15 2-15 2z";

const router = useRouter();

// ── Form State ────────────────────────────────────────────────────────────────
const recipient = ref("");
const subject = ref("");
const content = ref("");
const isSending = ref(false);
const sentSuccess = ref(false);

const handleSendMessage = () => {
  if (!recipient.value || !content.value) return;

  isSending.value = true;
  
  // Simulação de envio
  setTimeout(() => {
    isSending.value = false;
    sentSuccess.value = true;
    
    // Limpar campos
    recipient.value = "";
    subject.value = "";
    content.value = "";

    // Esconder mensagem de sucesso após 4s
    setTimeout(() => (sentSuccess.value = false), 4000);
  }, 1500);
};
</script>

<template>
  <div class="bg-white flex flex-col min-h-[calc(100vh-70px)]">
    <div class="bg-gradient-to-b from-[#021b59] to-[#042e99] w-full">
      <div class="max-w-[900px] mx-auto flex flex-col items-start gap-[16px] pt-[32px] pb-[48px] px-[20px]">
        <div class="w-full flex flex-col gap-[6px]">
          <button
            type="button"
            @click="router.back()"
            aria-label="Voltar"
            class="flex items-center gap-[8px] text-[#ffeac4] hover:text-white transition-colors focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#ffeac4] rounded-sm w-fit"
          >
            <svg class="size-[20px]" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <path :d="arrowBackPath" fill="currentColor" />
            </svg>
            <span class="font-['Figtree:Medium',sans-serif] font-medium text-[16px]">Voltar</span>
          </button>
          
          <nav aria-label="Navegação estrutural" class="pl-[28px]">
            <ol class="flex items-center gap-[4px] list-none m-0 p-0">
              <li>
                <button
                  @click="router.push('/courses')"
                  class="font-['Figtree:Regular',sans-serif] font-normal text-[#ffeac4]/70 text-[13px] hover:text-[#ffeac4] focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#ffeac4] rounded-sm"
                >
                  Cursos
                </button>
              </li>
              <li class="flex items-center gap-[4px]">
                <span class="text-[#ffeac4]/40 text-[13px]" aria-hidden="true">›</span>
                <span class="font-['Figtree:Regular',sans-serif] font-normal text-[#ffeac4]/50 text-[13px]">
                  Nova Mensagem
                </span>
              </li>
            </ol>
          </nav>
        </div>

        <h1 class="font-['Figtree:Bold',sans-serif] font-bold text-[#ffeac4] text-[28px] mt-[8px]">
          Enviar Mensagem
        </h1>
      </div>
    </div>

    <div class="max-w-[900px] mx-auto w-full px-[20px] md:px-[40px] py-[40px]">
      <form @submit.prevent="handleSendMessage" class="flex flex-col gap-[24px]">
        
        <div class="flex flex-col gap-[6px]">
          <label for="recipient" class="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[16px]">
            Para (Professor ou Turma)
          </label>
          <input
            id="recipient"
            v-model="recipient"
            type="text"
            placeholder="Digite o nome do destinatário"
            class="h-[56px] border border-[#5f5f5f] rounded-[12px] px-[20px] font-['Figtree:Regular',sans-serif] text-[16px] outline-none focus:outline-[3px] focus:outline-[#021b59] focus:outline-offset-[-1px]"
            required
          />
        </div>

        <div class="flex flex-col gap-[6px]">
          <label for="subject" class="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[16px]">
            Assunto
          </label>
          <input
            id="subject"
            v-model="subject"
            type="text"
            placeholder="Sobre o que é sua mensagem?"
            class="h-[56px] border border-[#5f5f5f] rounded-[12px] px-[20px] font-['Figtree:Regular',sans-serif] text-[16px] outline-none focus:outline-[3px] focus:outline-[#021b59] focus:outline-offset-[-1px]"
          />
        </div>

        <div class="flex flex-col gap-[6px]">
          <label for="content" class="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[16px]">
            Sua Mensagem
          </label>
          <textarea
            id="content"
            v-model="content"
            rows="6"
            placeholder="Escreva aqui sua dúvida ou comentário..."
            class="p-[20px] border border-[#5f5f5f] rounded-[12px] font-['Figtree:Regular',sans-serif] text-[16px] outline-none focus:outline-[3px] focus:outline-[#021b59] focus:outline-offset-[-1px] resize-none"
            required
          ></textarea>
        </div>

        <div
          v-if="sentSuccess"
          class="bg-[#d4edda] border border-[#c3e6cb] px-[16px] py-[12px] rounded-sm flex items-center gap-[10px]"
        >
          <span class="text-[#155724] font-['Figtree:Medium',sans-serif]">Mensagem enviada com sucesso!</span>
        </div>

        <div class="flex justify-end mt-[8px]">
          <button
            type="submit"
            :disabled="isSending"
            class="bg-[#ffeac4] h-[52px] px-[48px] rounded-[26px] flex items-center gap-[12px] hover:bg-[#ffd9a0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59]"
          >
            <span class="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[18px]">
              {{ isSending ? 'Enviando...' : 'Enviar mensagem' }}
            </span>
            <svg v-if="!isSending" class="size-[20px]" fill="none" viewBox="0 0 24 24">
              <path :d="sendPath" fill="#333" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
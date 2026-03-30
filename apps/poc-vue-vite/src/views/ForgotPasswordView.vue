<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// Componente UI
import InputField from '../components/ui/InputField.vue';

// Assets
import imgUfcLogo1 from "../assets/9098abf5bf97a1aac4c76f171ec108cee92cfddb.png";
import imgAtivo224X1 from "../assets/a17a08a750e97ba9bb12c3ad582c426a8debf0fa.png";

const router = useRouter();

// Estado
const email = ref("");
const showErrors = ref(false);
const generalError = ref("");

const footerItems = ["Portais", "Desenvolvimento", "Política de privacidade", "Ajuda", "Idioma"];

// Métodos
const handleSubmit = () => {
  if (!email.value.trim()) {
    generalError.value = "Por favor, preencha o campo destacado para continuar";
    showErrors.value = true;
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  // Lógica de sucesso (ex: integração com API) e retorno ao login
  router.push("/");
};

const goToLogin = () => {
  router.push("/");
};
</script>

<template>
  <main class="bg-gradient-to-b from-[#021b59] to-[#042e99] flex flex-col items-center p-[20px] min-h-screen">
    <div class="w-full max-w-[480px] mx-auto flex flex-col gap-[20px] items-center flex-1">

      <div class="inline-grid leading-[0] place-items-start relative shrink-0 mt-[10px]">
        <div class="col-1 h-[76px] ml-[72px] mt-0 relative row-1 w-[135px]">
          <img alt="UFC – Universidade Federal do Ceará" class="absolute inset-0 max-w-none object-cover size-full" :src="imgUfcLogo1" />
        </div>
        <div class="col-1 h-[35px] ml-0 mt-[17px] relative row-1 w-[63px]">
          <img alt="Instituto Universidade Virtual" class="absolute inset-0 max-w-none object-cover size-full" :src="imgAtivo224X1" />
        </div>
      </div>

      <div class="flex flex-col font-['Anek_Devanagari:ExtraBold',sans-serif] font-extrabold h-[90px] justify-center leading-[0] text-[#ffeac4] text-center w-full">
        <h1 class="flex-1 text-[#ffeac4] leading-[normal] font-medium font-[Anek_Devanagari]" style="font-size: clamp(64px, 20vw, 96px)">
          SOLAR
        </h1>
      </div>

      <div class="flex flex-col gap-[20px] items-start w-full">
        <div class="flex flex-col gap-[4px] w-full">
          <h2 class="font-['Figtree:Bold',sans-serif] font-bold leading-[36px] text-[#ffeac4] text-[24px] w-full">
            Esqueceu a sua senha?
          </h2>
          <p class="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] text-[#ffeac4] w-full text-[16px]">
            Informe o email usado no cadastro para receber instruções de recuperação da senha.
          </p>
        </div>

        <div
          v-if="showErrors && generalError"
          class="bg-[#c0392b] border border-[#c0392b] rounded-[12px] p-[16px] w-full"
          role="alert"
        >
          <p class="font-['Figtree:Medium',sans-serif] font-medium text-white text-[15px]">
            {{ generalError }}
          </p>
        </div>

        <form
          class="flex flex-col gap-[20px] w-full"
          @submit.prevent="handleSubmit"
          novalidate
        >
          <InputField
            label="Email"
            type="email"
            placeholder="Insira seu email"
            v-model="email"
            :has-error="showErrors && !email.trim()"
            error-message="Email não informado"
          />

          <div class="flex flex-col gap-[16px] w-full">
            <button
              type="submit"
              class="bg-[#ffeac4] h-[50px] w-full rounded-[26px] cursor-pointer hover:bg-[#ffd9a0] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-white focus-visible:outline-offset-[2px]"
            >
              <span class="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[20px]">Enviar</span>
            </button>
            
            <button
              type="button"
              @click="goToLogin"
              class="h-[50px] w-full border-2 border-[#ffeac4] rounded-[26px] cursor-pointer hover:bg-white/10 transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#ffeac4] focus-visible:outline-offset-[2px]"
            >
              <span class="font-['Figtree:Medium',sans-serif] font-medium text-[#ffeac4] text-[20px]">Voltar ao login</span>
            </button>
          </div>
        </form>
      </div>

      <nav class="flex flex-col items-center mt-auto pt-[20px] pb-[10px]" aria-label="Links do rodapé">
        <a
          v-for="item in footerItems"
          :key="item"
          href="#"
          @click.prevent
          class="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] text-[#ffeac4] text-[16px] text-center w-[230px] hover:underline focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#ffeac4] rounded-sm"
        >
          {{ item }}
        </a>
      </nav>
    </div>
  </main>
</template>
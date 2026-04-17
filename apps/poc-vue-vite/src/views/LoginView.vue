<template>
  <main
    class="bg-gradient-to-b from-[#021b59] to-[#042e99] flex flex-col items-center p-[20px] min-h-screen"
  >
    <div
      class="w-full max-w-[480px] mx-auto flex flex-col gap-[20px] items-center flex-1"
    >
      <div
        class="inline-grid leading-[0] place-items-start relative shrink-0 mt-[10px]"
        aria-label="Logos da UFC"
      >
        <div class="col-1 h-[76px] ml-[72px] mt-0 relative row-1 w-[135px]">
          <img
            alt="UFC – Universidade Federal do Ceará"
            class="absolute inset-0 max-w-none object-cover size-full"
            :src="imgUfcLogo1"
          />
        </div>
        <div class="col-1 h-[35px] ml-0 mt-[17px] relative row-1 w-[63px]">
          <img
            alt="Instituto Universidade Virtual"
            class="absolute inset-0 max-w-none object-cover size-full"
            :src="imgAtivo224X1"
          />
        </div>
      </div>

      <div
        class="flex flex-col font-['Anek_Devanagari:ExtraBold',sans-serif] font-extrabold h-[90px] justify-center leading-[0] text-[#ffeac4] text-center w-full"
      >
        <h1
          class="flex-1 text-[#ffeac4] leading-[normal] font-medium font-[Anek_Devanagari]"
          style="font-size: clamp(64px, 20vw, 96px)"
        >
          SOLAR
        </h1>
      </div>

      <FormContainer
        class-name="w-full"
        @submit.prevent="handleSubmit"
        aria-label="Formulário de login"
      >
        <template #body>
          <div
            v-if="showErrors && generalError"
            class="bg-[#c0392b] border border-[#c0392b] rounded-[12px] p-[16px] w-full"
            role="alert"
          >
            <p
              class="font-['Figtree:Medium',sans-serif] font-medium text-white text-[15px]"
            >
              {{ generalError }}
            </p>
          </div>

          <InputField
            label="Login"
            placeholder="Insira seu nome de usuário ou email"
            v-model="username"
            autocomplete="username"
            :has-error="showErrors && !username.trim()"
            error-message="Login não informado"
          />

          <InputField
            label="Senha"
            placeholder="Insira sua senha"
            type="password"
            v-model="password"
            autocomplete="current-password"
            :has-error="showErrors && !password.trim()"
            error-message="Senha não informada"
          />

          <div class="flex justify-end w-full">
            <button
              type="button"
              @click="navigateToForgotPassword"
              class="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] text-[#ffeac4] text-[16px] hover:underline underline-offset-2 focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#ffeac4] rounded-sm"
            >
              Esqueceu a sua senha?
            </button>
          </div>
        </template>
        <template #footer>
          <div class="flex flex-col gap-[16px] w-full mt-[8px]">
            <button
              type="submit"
              class="bg-[#ffeac4] cursor-pointer w-full h-[50px] rounded-[26px] hover:bg-[#ffd9a0] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-white focus-visible:outline-offset-[3px]"
            >
              <span
                class="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[20px]"
                >Acessar</span
              >
            </button>
            <button
              type="button"
              @click="navigateToRegister"
              class="bg-transparent border-2 border-[#ffeac4] cursor-pointer w-full h-[50px] rounded-[26px] hover:bg-white/10 transition-colors focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#ffeac4] focus-visible:outline-offset-[2px]"
            >
              <span
                class="font-['Figtree:Medium',sans-serif] font-medium text-[#ffeac4] text-[20px]"
                >Cadastrar</span
              >
            </button>
          </div>
        </template>
      </FormContainer>

      <nav
        class="flex flex-col items-center mt-auto pt-[20px] pb-[10px]"
        aria-label="Links do rodapé"
      >
        <button
          v-for="item in footerItems"
          :key="item"
          type="button"
          class="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] text-[#ffeac4] text-[16px] text-center hover:underline focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#ffeac4] rounded-sm"
        >
          {{ item }}
        </button>
      </nav>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../store/useAuthStore";

// Importação do Componente UI
import InputField from "../components/ui/InputField.vue";
import FormContainer from "../components/shared/FormContainer.vue";

// Assets
import imgUfcLogo1 from "../assets/9098abf5bf97a1aac4c76f171ec108cee92cfddb.png";
import imgAtivo224X1 from "../assets/a17a08a750e97ba9bb12c3ad582c426a8debf0fa.png";

const router = useRouter();
const authStore = useAuthStore();

// Estado
const username = ref("");
const password = ref("");
const showErrors = ref(false);
const generalError = ref("");

const footerItems = [
  "Portais",
  "Desenvolvimento",
  "Política de privacidade",
  "Ajuda",
  "Idioma",
];

const handleSubmit = () => {
  // Validação local rápida
  if (!username.value.trim() || !password.value.trim()) {
    generalError.value =
      "Por favor, preencha os campos destacados para acessar";
    showErrors.value = true;
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  // Lógica de Autenticação
  const ok = authStore.login(username.value.trim(), password.value);

  if (ok) {
    generalError.value = "";
    showErrors.value = false;

    // CORREÇÃO: Redirecionar para a tela de cursos em vez da raiz '/'
    router.push("/courses");
  } else {
    generalError.value = "Usuário ou senha incorretos";
    showErrors.value = true;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const navigateToForgotPassword = () => router.push("/forgot-password");
const navigateToRegister = () => router.push("/register");
</script>
